'use client';

import { useState, useEffect } from 'react';
import Nav from '../../components/Nav';
import { supabase } from '../../lib/supabase';

const FEATURED_MATCHES = [
  { fixture_id: 208391, label: "2010 World Cup Final", home: "Netherlands", away: "Spain", competition: "World Cup" },
  { fixture_id: 194189, label: "Agueroooo! 2012", home: "Manchester City", away: "QPR", competition: "Premier League" },
  { fixture_id: 355393, label: "CL Quarter Final 2014", home: "Manchester United", away: "Bayern Munich", competition: "Champions League" },
  { fixture_id: 355386, label: "2014 Champions League Final", home: "Real Madrid", away: "Atletico Madrid", competition: "Champions League" },
  { fixture_id: 208317, label: "The 7-1", home: "Brazil", away: "Germany", competition: "World Cup" },
  { fixture_id: 354954, label: "2016 Champions League Final", home: "Real Madrid", away: "Atletico Madrid", competition: "Champions League" },
  { fixture_id: 135761, label: "2018 World Cup Round of 16", home: "France", away: "Argentina", competition: "World Cup" },
  { fixture_id: 135776, label: "2018 World Cup Final", home: "France", away: "Croatia", competition: "World Cup" },
  { fixture_id: 107696, label: "2019 CL Semi Final", home: "Barcelona", away: "Manchester United", competition: "Champions League" },
  { fixture_id: 125534, label: "2019 Champions League Final", home: "Tottenham", away: "Liverpool", competition: "Champions League" },
  { fixture_id: 787573, label: "CL Group Stage 2021", home: "Liverpool", away: "AC Milan", competition: "Champions League" },
  { fixture_id: 979139, label: "2022 World Cup Final", home: "Argentina", away: "France", competition: "World Cup" },
];

export default function GamesHub() {
  const [activeGame, setActiveGame] = useState<'roulette' | 'knowyourxi'>('roulette');

  // ─── PLAYER ROULETTE STATE ───
  const [player, setPlayer] = useState<any>(null);
  const [rouletteGuess, setRouletteGuess] = useState('');
  const [rouletteSubmitted, setRouletteSubmitted] = useState(false);
  const [rouletteCorrect, setRouletteCorrect] = useState(false);
  const [rouletteScore, setRouletteScore] = useState(0);
  const [roulettePlayed, setRoulettePlayed] = useState(0);
  const [rouletteLoading, setRouletteLoading] = useState(true);
  const [nationalityMap, setNationalityMap] = useState<Record<string, string>>({});

  // ─── KNOW YOUR XI STATE ───
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [homeLineup, setHomeLineup] = useState<any[]>([]);
  const [awayLineup, setAwayLineup] = useState<any[]>([]);
  const [xiGuesses, setXiGuesses] = useState<string[]>([]);
  const [xiSubmitted, setXiSubmitted] = useState(false);
  const [xiCorrect, setXiCorrect] = useState(0);
  const [xiScore, setXiScore] = useState(0);
  const [xiPlayed, setXiPlayed] = useState(0);
  const [xiLoading, setXiLoading] = useState(false);
  const [xiTeam, setXiTeam] = useState<'home' | 'away'>('home');
  const [currentGuess, setCurrentGuess] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const POSITION_ORDER = ['G', 'D', 'M', 'F'];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ─── PLAYER ROULETTE ───
  const fetchRandomPlayer = async () => {
    setRouletteLoading(true);
    setRouletteSubmitted(false);
    setRouletteGuess('');
    setRouletteCorrect(false);

    const { count } = await supabase
      .from('player_careers')
      .select('*', { count: 'exact', head: true });

    if (!count) { setRouletteLoading(false); return; }

    let found = false;
    while (!found) {
      const randomOffset = Math.floor(Math.random() * count);
      const { data } = await supabase
        .from('player_careers')
        .select('*')
        .range(randomOffset, randomOffset);

      if (data && data[0]) {
        const clubs = data[0].clubs || [];
        const totalApps = clubs.reduce((sum: number, club: any) => sum + club.totalApps, 0);
        if (totalApps >= 100 && clubs.length > 0) {
          setPlayer(data[0]);
          found = true;
        }
      }
    }
    setRouletteLoading(false);
  };

  const handleRouletteSubmit = () => {
    if (!rouletteGuess.trim()) return;
    setRouletteSubmitted(true);
    setRoulettePlayed(p => p + 1);
    const isCorrect = rouletteGuess.toLowerCase().trim() === player.player_name.toLowerCase().replace(/&apos;/g, "'") ||
  player.player_name.toLowerCase().replace(/&apos;/g, "'").includes(rouletteGuess.toLowerCase().trim());
    setRouletteCorrect(isCorrect);
    if (isCorrect) setRouletteScore(s => s + 1);
  };

  useEffect(() => {
    fetchRandomPlayer();
  }, []);

  useEffect(() => {
  if (activeGame === 'knowyourxi' && !selectedMatch) {
    const random = FEATURED_MATCHES[Math.floor(Math.random() * FEATURED_MATCHES.length)];
    loadMatch(random);
  }
}, [activeGame]);
  // ─── KNOW YOUR XI ───
  const loadMatch = async (match: any) => {
    setXiLoading(true);
    setXiSubmitted(false);
    setXiGuesses([]);
    setXiCorrect(0);
    setCurrentGuess('');
    setXiTeam('home');
    setSelectedMatch(match);

    console.log('Nationality map:', nationalityMap);

    const { data: lineupData } = await supabase
      .from('football_lineups')
      .select('*')
      .eq('fixture_id', match.fixture_id)
      .eq('is_substitute', false);

if (lineupData) {
  setHomeLineup(lineupData.filter((p: any) => p.team === match.home));
  setAwayLineup(lineupData.filter((p: any) => p.team === match.away));

  const playerNames = lineupData.map((p: any) => p.player_name);
  const { data: careerData } = await supabase
    .from('player_careers')
    .select('player_name, nationality');

const { data: nationalityData } = await supabase
  .from('player_careers')
  .select('player_name, nationality');

console.log('Player names from lineup:', playerNames);
console.log('Career data count:', nationalityData?.length);
console.log('First career entry:', nationalityData?.[0]);

const nationalityMap: Record<string, string> = {};
if (nationalityData) {
 for (const name of playerNames) {
  console.log('Trying to match:', name);
  const found = nationalityData.find((c: any) => {
    const surname = c.player_name.split('. ')[1] || c.player_name;
    return name.toLowerCase().includes(surname.toLowerCase()) ||
      surname.toLowerCase().includes(name.toLowerCase());
  });
  console.log('Found:', found?.player_name, found?.nationality);
  if (found) nationalityMap[name] = found.nationality;
}
}
setNationalityMap(nationalityMap);
}
    setXiLoading(false);
  };

  
  const currentLineup = xiTeam === 'home' ? homeLineup : awayLineup;
  const currentTeamName = selectedMatch ? (xiTeam === 'home' ? selectedMatch.home : selectedMatch.away) : '';

  const handleXiGuess = () => {
    if (!currentGuess.trim()) return;
    const guess = currentGuess.trim().toLowerCase();
    const remaining = currentLineup.filter((p: any) =>
      !xiGuesses.includes(p.player_name)
    );
    const match = remaining.find((p: any) =>
      p.player_name.toLowerCase().includes(guess) ||
      guess.includes(p.player_name.split(' ').pop()!.toLowerCase())
    );
    if (match) {
      setXiGuesses(prev => [...prev, match.player_name]);
    }
    setCurrentGuess('');
  };

  const handleXiSubmit = () => {
    const correct = xiGuesses.length;
    setXiCorrect(correct);
    setXiScore(s => s + correct);
    setXiPlayed(p => p + 1);
    setXiSubmitted(true);
  };

  const getCountryCode = (nationality: string) => {
  const codes: Record<string, string> = {
    'England': 'gb-eng', 'Scotland': 'gb-sct', 'Wales': 'gb-wls',
    'France': 'fr', 'Spain': 'es', 'Germany': 'de', 'Portugal': 'pt',
    'Brazil': 'br', 'Argentina': 'ar', 'Netherlands': 'nl', 'Belgium': 'be',
    'Italy': 'it', 'Croatia': 'hr', 'Uruguay': 'uy', 'Colombia': 'co',
    'Mexico': 'mx', 'USA': 'us', 'Japan': 'jp', 'South Korea': 'kr',
    'Nigeria': 'ng', 'Senegal': 'sn', 'Ghana': 'gh', 'Ivory Coast': 'ci',
    'Cameroon': 'cm', 'Egypt': 'eg', 'Morocco': 'ma', 'Algeria': 'dz',
    'Sweden': 'se', 'Norway': 'no', 'Denmark': 'dk', 'Finland': 'fi',
    'Switzerland': 'ch', 'Austria': 'at', 'Poland': 'pl', 'Czech Republic': 'cz',
    'Slovakia': 'sk', 'Hungary': 'hu', 'Romania': 'ro', 'Serbia': 'rs',
    'Slovenia': 'si', 'Bosnia': 'ba', 'Montenegro': 'me', 'Albania': 'al',
    'Greece': 'gr', 'Turkey': 'tr', 'Ukraine': 'ua', 'Russia': 'ru',
    'Ireland': 'ie', 'Northern Ireland': 'gb', 'Iceland': 'is',
    'Zimbabwe': 'zw', 'Zambia': 'zm', 'DR Congo': 'cd', 'Mali': 'ml',
    'Gabon': 'ga', 'Angola': 'ao', 'Guinea': 'gn', 'Saudi Arabia': 'sa',
    'Iran': 'ir', 'Australia': 'au', 'Canada': 'ca', 'Jamaica': 'jm',
    'Trinidad': 'tt', 'Costa Rica': 'cr', 'Ecuador': 'ec', 'Peru': 'pe',
    'Chile': 'cl', 'Paraguay': 'py', 'Bolivia': 'bo', 'Venezuela': 've',
  };
  return codes[nationality] || null;
};

  const renderFormation = (lineup: any[], guessed: string[], submitted: boolean) => {
    const hasPositions = lineup.some(p => ['G', 'D', 'M', 'F'].includes(p.position));
    let rows: any[][];
    if (hasPositions) {
      rows = POSITION_ORDER.map(pos => lineup.filter(p => p.position === pos));
    } else {
      const sorted = [...lineup].slice(0, 11);
      rows = [sorted.slice(0, 1), sorted.slice(1, 5), sorted.slice(5, 9), sorted.slice(9, 11)];
    }

    return (
      <div style={{ background: "rgba(58,170,53,0.06)", border: "1px solid rgba(58,170,53,0.15)", borderRadius: "12px", padding: "16px 8px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {rows.map((row, rowIdx) => (
          row.length > 0 && (
            <div key={rowIdx} style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" as const }}>
              {row.map((player: any, i: number) => {
                const isGuessed = guessed.includes(player.player_name);
                const size = isMobile ? 24 : 40;
                return (
                  <div key={i} style={{ textAlign: "center", minWidth: isMobile ? "44px" : "70px", maxWidth: isMobile ? "50px" : "80px" }}>
                    <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: isGuessed ? "rgba(58,170,53,0.15)" : "#e0d9cc", border: `2px solid ${isGuessed ? "#3aaa35" : "#bbb"}`, margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? "9px" : "13px", fontWeight: 700, color: isGuessed ? "#3aaa35" : "#aaa" }}>
                      {isGuessed 
  ? player.player_name.split(' ').pop()?.charAt(0)
  : nationalityMap[player.player_name] && getCountryCode(nationalityMap[player.player_name])
    ? <img src={`https://flagcdn.com/w40/${getCountryCode(nationalityMap[player.player_name])}.png`} style={{ width: "20px", height: "14px", objectFit: "cover", borderRadius: "2px" }} />
    : "?"
}
                    </div>
                    <div style={{ fontSize: isMobile ? "8px" : "11px", color: isGuessed ? "#555" : "#bbb", lineHeight: 1.2 }}>
                      {isGuessed ? player.player_name.split(' ').pop() : "?????"}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>
      <Nav />

      <div style={{ padding: "2rem 1.25rem 1rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", color: "#3aaa35", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
          Football Quiz
        </div>

        {/* Game switcher */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "1.5rem" }}>
          <button onClick={() => setActiveGame('roulette')}
            style={{ background: activeGame === 'roulette' ? "#3aaa35" : "#fff", color: activeGame === 'roulette' ? "#faf7f0" : "#888", border: `1px solid ${activeGame === 'roulette' ? "#3aaa35" : "#e0d9cc"}`, borderRadius: "20px", padding: "8px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            🎰 Player Roulette
          </button>
          <button onClick={() => setActiveGame('knowyourxi')}
            style={{ background: activeGame === 'knowyourxi' ? "#3aaa35" : "#fff", color: activeGame === 'knowyourxi' ? "#faf7f0" : "#888", border: `1px solid ${activeGame === 'knowyourxi' ? "#3aaa35" : "#e0d9cc"}`, borderRadius: "20px", padding: "8px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            📋 Know Your XI
          </button>
        </div>

        {/* ─── PLAYER ROULETTE HEADER ─── */}
        {activeGame === 'roulette' && (
          <>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.05, margin: "0 0 0.5rem", letterSpacing: "-2px" }}>
              Player <span style={{ color: "#3aaa35" }}>Roulette</span>
            </h1>
            <p style={{ color: "#666", fontSize: "14px", margin: "0 0 1.5rem" }}>Guess the player from their Premier League career</p>
            <div style={{ display: "inline-flex", gap: "1.5rem", background: "#fff", border: "1px solid #e0d9cc", borderRadius: "20px", padding: "6px 20px", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "13px", color: "#888" }}>Score: <strong style={{ color: "#3aaa35" }}>{rouletteScore}</strong></span>
              <span style={{ fontSize: "13px", color: "#888" }}>Played: <strong>{roulettePlayed}</strong></span>
            </div>
          </>
        )}

        {/* ─── KNOW YOUR XI HEADER ─── */}
        {activeGame === 'knowyourxi' && (
          <>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.05, margin: "0 0 0.5rem", letterSpacing: "-2px" }}>
              Know Your <span style={{ color: "#3aaa35" }}>XI</span>
            </h1>
            <p style={{ color: "#666", fontSize: "14px", margin: "0 0 1.5rem" }}>Pick a famous match and name the starting lineup</p>
            {selectedMatch && (
              <div style={{ display: "inline-flex", gap: "1.5rem", background: "#fff", border: "1px solid #e0d9cc", borderRadius: "20px", padding: "6px 20px", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>Score: <strong style={{ color: "#3aaa35" }}>{xiScore}</strong></span>
                <span style={{ fontSize: "13px", color: "#888" }}>Played: <strong>{xiPlayed}</strong></span>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ padding: "0 1.25rem 4rem", maxWidth: "800px", margin: "0 auto" }}>

        {/* ─── PLAYER ROULETTE CONTENT ─── */}
        {activeGame === 'roulette' && (
          rouletteLoading ? (
            <div style={{ textAlign: "center", color: "#bbb", padding: "3rem 0" }}>Loading player...</div>
          ) : player ? (
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "2rem", border: "1px solid #e0d9cc" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1.5rem" }}>
                <div style={{ background: "#faf7f0", borderRadius: "10px", padding: "1rem", textAlign: "center" as const }}>
                  <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "6px" }}>Nationality</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>{player.nationality}</div>
                </div>
                <div style={{ background: "#faf7f0", borderRadius: "10px", padding: "1rem", textAlign: "center" as const }}>
                  <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "6px" }}>Position</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>{player.position}</div>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "10px" }}>Career</div>
                <div style={{ border: "1px solid #e0d9cc", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", padding: "8px 14px", background: "#f0ede6", borderBottom: "1px solid #e0d9cc" }}>
                    {["Years", "Team", "Apps", "Goals"].map(h => (
                      <div key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#888", textTransform: "uppercase" as const }}>{h}</div>
                    ))}
                  </div>
                  {player.clubs.map((club: any, i: number) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", padding: "10px 14px", borderBottom: i < player.clubs.length - 1 ? "1px solid #e0d9cc" : "none", background: i % 2 === 0 ? "#ffffff" : "#faf7f0" }}>
                      <div style={{ fontSize: "13px", color: "#888", fontStyle: "italic" }}>
                        {club.seasons?.length > 0 ? `${Math.min(...club.seasons)}–${Math.max(...club.seasons) + 1}` : '—'}
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>
  {club.isLoan && <span style={{ color: "#888", fontWeight: 400, marginRight: "4px" }}>→</span>}
  {club.name}
  {club.isLoan && <span style={{ color: "#aaa", fontWeight: 400, fontSize: "11px", marginLeft: "4px" }}>(loan)</span>}
</div>
                      <div style={{ fontSize: "13px", color: "#555" }}>{club.totalApps}</div>
                      <div style={{ fontSize: "13px", color: "#555" }}>{club.totalGoals}</div>
                    </div>
                  ))}
                </div>
              </div>

              {!rouletteSubmitted ? (
                <div>
                  <button onClick={fetchRandomPlayer}
                    style={{ width: "100%", background: "transparent", color: "#aaa", padding: "10px", borderRadius: "10px", border: "1px solid #e0d9cc", fontWeight: 600, fontSize: "14px", cursor: "pointer", marginBottom: "12px" }}>
                    Skip →
                  </button>
                  <input
                    type="text"
                    placeholder="Type player name..."
                    value={rouletteGuess}
                    onChange={e => setRouletteGuess(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRouletteSubmit()}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e0d9cc", fontSize: "15px", background: "#faf7f0", color: "#1a1a1a", outline: "none", marginBottom: "12px", boxSizing: "border-box" as const }}
                  />
                  <button onClick={handleRouletteSubmit} disabled={!rouletteGuess.trim()}
                    style={{ width: "100%", background: "#3aaa35", color: "#faf7f0", padding: "14px", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "16px", cursor: "pointer", opacity: !rouletteGuess.trim() ? 0.5 : 1 }}>
                    Submit Answer
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ background: rouletteCorrect ? "rgba(58,170,53,0.1)" : "rgba(239,68,68,0.08)", border: `1px solid ${rouletteCorrect ? "rgba(58,170,53,0.3)" : "rgba(239,68,68,0.2)"}`, borderRadius: "10px", padding: "1rem", textAlign: "center", marginBottom: "1rem" }}>
                    <div style={{ fontWeight: 800, fontSize: "20px", color: rouletteCorrect ? "#3aaa35" : "#ef4444", marginBottom: "4px" }}>
                      {rouletteCorrect ? "🎉 Correct!" : "❌ Wrong!"}
                    </div>
                    <div style={{ fontSize: "15px", color: "#666" }}>
                      The answer was <strong style={{ color: "#1a1a1a" }}>{player.player_name.replace(/&apos;/g, "'")}</strong>
                    </div>
                  </div>
                  <button onClick={fetchRandomPlayer}
                    style={{ width: "100%", background: "#3aaa35", color: "#faf7f0", padding: "14px", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>
                    Next Player →
                  </button>
                </div>
              )}
            </div>
          ) : null
        )}

        {/* ─── KNOW YOUR XI CONTENT ─── */}
        {activeGame === 'knowyourxi' && (
         !selectedMatch ? (
  <div style={{ textAlign: "center", color: "#bbb", padding: "3rem 0" }}>Loading match...</div>
) :xiLoading ? (
            <div style={{ textAlign: "center", color: "#bbb", padding: "3rem 0" }}>Loading lineup...</div>
          ) : (
            <div>

                
              {/* Match header */}
              <div style={{ background: "#ffffff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e0d9cc", marginBottom: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "6px" }}>{selectedMatch.competition} · {selectedMatch.label}</div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#1a1a1a" }}>{selectedMatch.home} vs {selectedMatch.away}</div>
                <button onClick={() => { setSelectedMatch(null); setXiGuesses([]); setXiSubmitted(false); }}
                  style={{ marginTop: "10px", background: "transparent", border: "none", color: "#aaa", fontSize: "12px", cursor: "pointer" }}>
                  ← Choose different match
                </button>
              </div>

              {/* Team selector */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", justifyContent: "center" }}>
                <button onClick={() => { setXiTeam('home'); setXiGuesses([]); setXiSubmitted(false); }}
                  style={{ background: xiTeam === 'home' ? "#3aaa35" : "#fff", color: xiTeam === 'home' ? "#faf7f0" : "#888", border: `1px solid ${xiTeam === 'home' ? "#3aaa35" : "#e0d9cc"}`, borderRadius: "20px", padding: "6px 18px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                  {selectedMatch.home}
                </button>
                <button onClick={() => { setXiTeam('away'); setXiGuesses([]); setXiSubmitted(false); }}
                  style={{ background: xiTeam === 'away' ? "#3aaa35" : "#fff", color: xiTeam === 'away' ? "#faf7f0" : "#888", border: `1px solid ${xiTeam === 'away' ? "#3aaa35" : "#e0d9cc"}`, borderRadius: "20px", padding: "6px 18px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                  {selectedMatch.away}
                </button>
              </div>

              {/* Formation */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "8px", textAlign: "center" }}>
                  {currentTeamName} — {xiGuesses.length}/{currentLineup.length} guessed
                </div>
                {renderFormation(currentLineup, xiGuesses, xiSubmitted)}
              </div>

              {/* Input */}
              {!xiSubmitted ? (
                <div style={{ background: "#ffffff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e0d9cc" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#888", marginBottom: "12px", textAlign: "center" }}>
                    Type a player's surname to reveal them
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
                    <input
                      type="text"
                      placeholder="Type a player surname..."
                      value={currentGuess}
                      onChange={e => setCurrentGuess(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleXiGuess()}
                      style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #e0d9cc", fontSize: "15px", background: "#faf7f0", color: "#1a1a1a", outline: "none" }}
                    />
                    <button onClick={handleXiGuess}
                      style={{ background: "#3aaa35", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 16px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                      Add
                    </button>
                  </div>
                  <button onClick={handleXiSubmit}
                    style={{ width: "100%", background: "#3aaa35", color: "#faf7f0", padding: "14px", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>
                    Submit Answers
                  </button>
                </div>
              ) : (
                <div style={{ background: "#ffffff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e0d9cc" }}>
                  <div style={{ background: xiCorrect === currentLineup.length ? "rgba(58,170,53,0.1)" : xiCorrect > 0 ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.08)", border: `1px solid ${xiCorrect === currentLineup.length ? "rgba(58,170,53,0.3)" : xiCorrect > 0 ? "rgba(251,191,36,0.3)" : "rgba(239,68,68,0.2)"}`, borderRadius: "10px", padding: "1rem", textAlign: "center", marginBottom: "1rem" }}>
                    <div style={{ fontWeight: 800, fontSize: "28px", color: xiCorrect === currentLineup.length ? "#3aaa35" : xiCorrect > 0 ? "#f59e0b" : "#ef4444" }}>
                      {xiCorrect}/{currentLineup.length}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666" }}>
                      {xiCorrect === currentLineup.length ? "🎉 Perfect! Full lineup!" : xiCorrect > 0 ? `⚽ Got ${xiCorrect} right!` : "❌ Unlucky!"}
                    </div>
                  </div>

                  {/* Reveal full lineup */}
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "10px", textAlign: "center" }}>Full Lineup</div>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
                      {currentLineup.map((p: any, i: number) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", background: xiGuesses.includes(p.player_name) ? "rgba(58,170,53,0.08)" : "#faf7f0", borderRadius: "8px", border: `1px solid ${xiGuesses.includes(p.player_name) ? "rgba(58,170,53,0.3)" : "#e0d9cc"}` }}>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>{p.player_name}</div>
                          <div style={{ fontSize: "12px", color: xiGuesses.includes(p.player_name) ? "#3aaa35" : "#ef4444", fontWeight: 700 }}>
                            {xiGuesses.includes(p.player_name) ? "✓ Got it" : "✗ Missed"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => { setXiGuesses([]); setXiSubmitted(false); setCurrentGuess(''); }}
                      style={{ flex: 1, background: "transparent", color: "#888", padding: "12px", borderRadius: "10px", border: "1px solid #e0d9cc", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                      Try Again
                    </button>
                    <button onClick={() => { setSelectedMatch(null); setXiGuesses([]); setXiSubmitted(false); }}
                      style={{ flex: 1, background: "#3aaa35", color: "#faf7f0", padding: "12px", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                      New Match →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </main>
  );
}