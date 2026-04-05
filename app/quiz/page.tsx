'use client';

import { useState, useEffect } from 'react';
import Nav from '../../components/Nav';
import { supabase } from '../../lib/supabase';

export default function WhoScored() {
  const [match, setMatch] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [homeLineup, setHomeLineup] = useState<any[]>([]);
  const [awayLineup, setAwayLineup] = useState<any[]>([]);
  const [homeBench, setHomeBench] = useState<any[]>([]);
  const [awayBench, setAwayBench] = useState<any[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [competition, setCompetition] = useState('Premier League');
  const [correctCount, setCorrectCount] = useState(0);
  const [hints, setHints] = useState<Record<number, number>>({});
  const [isMobile, setIsMobile] = useState(false);

  const COMPETITIONS = [
    { label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League', value: 'Premier League' },
    { label: '⭐ Champions League', value: 'Champions League' },
    { label: '🌍 World Cup', value: 'World Cup' },
    { label: '🇪🇺 Euros', value: 'Euros' },
  ];

  const POSITION_ORDER = ['G', 'D', 'M', 'F'];

  const fetchRandomMatch = async (comp = competition) => {
    setLoading(true);
    setSubmitted(false);
    setGuesses([]);
    setGoals([]);
    setHomeLineup([]);
    setAwayLineup([]);
    setHomeBench([]);
    setAwayBench([]);
    setCorrectCount(0);
    setMatch(null);
    setHints({});

    let attempts = 0;

    while (attempts < 15) {
      attempts++;

      const { count } = await supabase
        .from('football_matches')
        .select('*', { count: 'exact', head: true })
        .eq('competition', comp)
        .gt('home_score', 0);

      if (!count) break;

      const randomOffset = Math.floor(Math.random() * count);

      const { data: matchData } = await supabase
        .from('football_matches')
        .select('*')
        .eq('competition', comp)
        .gt('home_score', 0)
        .range(randomOffset, randomOffset);

      if (!matchData || !matchData[0]) continue;

      const m = matchData[0];

      const [{ data: goalsData }, { data: lineupData }] = await Promise.all([
        supabase.from('football_goals').select('*').eq('fixture_id', m.fixture_id).order('minute', { ascending: true }),
        supabase.from('football_lineups').select('*').eq('fixture_id', m.fixture_id),
      ]);

      if (goalsData && goalsData.length > 0 && lineupData && lineupData.length >= 18) {
        setMatch(m);
        setGoals(goalsData);
        setHomeLineup(lineupData.filter((p: any) => p.team === m.home_team && !p.is_substitute));
        setAwayLineup(lineupData.filter((p: any) => p.team === m.away_team && !p.is_substitute));
        setHomeBench(lineupData.filter((p: any) => p.team === m.home_team && p.is_substitute));
        setAwayBench(lineupData.filter((p: any) => p.team === m.away_team && p.is_substitute));
        setGuesses([]);
        break;
      }
    }

    setLoading(false);
  };

  useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768);
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, []);

  useEffect(() => {
    fetchRandomMatch();
  }, []);

  const handleCompetitionChange = (comp: string) => {
    setCompetition(comp);
    fetchRandomMatch(comp);
  };

  const getScorerNames = () => goals.map(g => g.player_name);

  const isScorer = (playerName: string) => {
    return goals.some(g => {
      if (g.goal_type === 'Own Goal') return false;
      return g.player_name.toLowerCase() === playerName.toLowerCase();
    });
  };

  const checkGuesses = () => {
    const remaining = [...getScorerNames()];
    let correct = 0;
    for (const guess of guesses) {
      const idx = remaining.findIndex(s =>
        s.toLowerCase().includes(guess.toLowerCase().trim()) ||
        guess.toLowerCase().trim().includes(s.split(' ').pop()!.toLowerCase())
      );
      if (idx !== -1) {
        correct++;
        remaining.splice(idx, 1);
      }
    }
    return correct;
  };

  const handleSubmit = () => {
    if (guesses.every(g => !g.trim())) return;
    const correct = checkGuesses();
    setCorrectCount(correct);
    setScore(s => s + correct);
    setGamesPlayed(g => g + 1);
    setSubmitted(true);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const renderPlayer = (player: any, size: number = 28) => {
    const scorer = isScorer(player.player_name);
    const fontSize = size >= 40 ? "13px" : size >= 28 ? "10px" : "8px";
const nameFontSize = size >= 40 ? "11px" : size >= 28 ? "8px" : "7px";
    return (
      <div style={{ textAlign: "center", minWidth: size >= 40 ? "60px" : size >= 32 ? "55px" : size >= 28 ? "38px" : "32px", maxWidth: size >= 40 ? "70px" : size >= 32 ? "60px" : size >= 28 ? "42px" : "36px" }}>
        <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: scorer && !submitted ? "#e0d9cc" : scorer && submitted ? "rgba(239,68,68,0.15)" : "rgba(58,170,53,0.15)", border: `2px solid ${scorer && !submitted ? "#bbb" : scorer && submitted ? "#ef4444" : "#3aaa35"}`, margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize, fontWeight: 700, color: scorer && !submitted ? "#aaa" : "#3aaa35" }}>
          {scorer && !submitted ? "?" : player.player_name.split(' ').pop()?.charAt(0)}
        </div>
        <div style={{ fontSize: nameFontSize, color: scorer && !submitted ? "#aaa" : "#555", lineHeight: 1.2, wordBreak: "break-word" as const }}>
          {scorer && !submitted ? "?????" : player.player_name.split(' ').pop()}
        </div>
      </div>
    );
  };

  const renderFormation = (lineup: any[], teamName: string, isHome: boolean, bench: any[], isMobile: boolean) => {
    const hasPositions = lineup.some(p => ['G', 'D', 'M', 'F'].includes(p.position));

    let rows: any[][];
    if (hasPositions) {
      rows = POSITION_ORDER.map(pos => lineup.filter(p => p.position === pos));
    } else {
      const sorted = [...lineup].slice(0, 11);
      rows = [
        sorted.slice(0, 1),
        sorted.slice(1, 5),
        sorted.slice(5, 9),
        sorted.slice(9, 11),
      ];
    }

    return (
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a1a", textAlign: "center", marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
          {teamName}
        </div>
        <div style={{ background: "rgba(58,170,53,0.06)", border: "1px solid rgba(58,170,53,0.15)", borderRadius: "10px 10px 0 0", padding: "10px 4px", display: "flex", flexDirection: isHome ? "column" : "column-reverse" as const, gap: "8px" }}>
          {rows.map((row, rowIdx) => (
            row.length > 0 && (
              <div key={rowIdx} style={{ display: "flex", justifyContent: "center", gap: "2px", flexWrap: "wrap" as const }}>
                {row.map((player: any, i: number) => (
                  <div key={i}>{renderPlayer(player, isMobile ? 24 : 40)}</div>
                ))}
              </div>
            )
          ))}
        </div>
        {bench.length > 0 && (
          <div style={{ background: "rgba(58,170,53,0.03)", border: "1px solid rgba(58,170,53,0.15)", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "6px 4px" }}>
            <div style={{ fontSize: "8px", color: "#aaa", textAlign: "center", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Bench</div>
            <div style={{ display: "flex", justifyContent: "center", gap: "2px", flexWrap: "wrap" as const }}>
              {bench.map((player: any, i: number) => (
                <div key={i}>{renderPlayer(player, isMobile ? 22 : 32)}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const homeGoals = goals.filter(g => g.team === match?.home_team);
  const awayGoals = goals.filter(g => g.team !== match?.home_team);

  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>
      <Nav />

      <div style={{ padding: "2rem 1.25rem 1rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", color: "#3aaa35", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
          Football Quiz
        </div>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.05, margin: "0 0 0.5rem", letterSpacing: "-2px" }}>
          Who <span style={{ color: "#3aaa35" }}>Scored?</span>
        </h1>
        <p style={{ color: "#666", fontSize: "14px", margin: "0 0 1rem" }}>
          Find the missing players in the lineup
        </p>

        {/* Competition filter */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" as const, marginBottom: "1rem" }}>
          {COMPETITIONS.map(c => (
            <button key={c.value} onClick={() => handleCompetitionChange(c.value)}
              style={{ background: competition === c.value ? "#3aaa35" : "#fff", color: competition === c.value ? "#faf7f0" : "#888", border: `1px solid ${competition === c.value ? "#3aaa35" : "#e0d9cc"}`, borderRadius: "20px", padding: "5px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Score tracker */}
        <div style={{ display: "inline-flex", gap: "1.5rem", background: "#fff", border: "1px solid #e0d9cc", borderRadius: "20px", padding: "6px 20px" }}>
          <span style={{ fontSize: "13px", color: "#888" }}>Points: <strong style={{ color: "#3aaa35" }}>{score}</strong></span>
          <span style={{ fontSize: "13px", color: "#888" }}>Played: <strong>{gamesPlayed}</strong></span>
        </div>
      </div>

      <div style={{ padding: "0 1.25rem 4rem", maxWidth: "800px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#bbb", padding: "3rem 0" }}>Loading match...</div>
        ) : !match ? (
          <div style={{ textAlign: "center", color: "#bbb", padding: "3rem 0" }}>No matches found</div>
        ) : (
          <div>
            {/* Match header */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e0d9cc", marginBottom: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "8px" }}>{match.competition} · {formatDate(match.match_date)}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                <div style={{ flex: 1, textAlign: "right" as const, fontSize: "16px", fontWeight: 700 }}>{match.home_team}</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div style={{ fontSize: "40px", fontWeight: 800, color: "#1a1a1a" }}>{match.home_score}</div>
                  <div style={{ fontSize: "20px", color: "#e0d9cc" }}>—</div>
                  <div style={{ fontSize: "40px", fontWeight: 800, color: "#1a1a1a" }}>{match.away_score}</div>
                </div>
                <div style={{ flex: 1, fontSize: "16px", fontWeight: 700 }}>{match.away_team}</div>
              </div>
              <div style={{ fontSize: "13px", color: "#3aaa35", marginTop: "8px", fontWeight: 600 }}>
                {goals.length} goal{goals.length !== 1 ? 's' : ''} — {goals.length} name{goals.length !== 1 ? 's' : ''} missing from the lineup
              </div>
            </div>

            {/* Formations */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "1rem" }}>
              {renderFormation(homeLineup, match.home_team, true, homeBench, isMobile)}
{renderFormation(awayLineup, match.away_team, false, awayBench, isMobile)}
            </div>

            {/* Input area */}
            {!submitted ? (
              <div style={{ background: "#ffffff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e0d9cc" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#888", marginBottom: "12px", textAlign: "center" }}>
                  Name the {goals.length} missing player{goals.length !== 1 ? 's' : ''} — type a surname and press Enter
                </div>

                {/* Hints */}
                <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px", marginBottom: "12px" }}>
                  {goals.map((goal, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#faf7f0", borderRadius: "8px", padding: "8px 12px", border: "1px solid #e0d9cc" }}>
                      <div style={{ fontSize: "13px", color: "#666" }}>
                        ⚽ Goal {i + 1}
                        {(hints[i] ?? 0) >= 1 && (
                          <span style={{ color: "#3aaa35", fontWeight: 600, marginLeft: "8px" }}>— {goal.minute}' minute</span>
                        )}
                        {(hints[i] ?? 0) >= 2 && (
                          <span style={{ color: "#3aaa35", fontWeight: 600, marginLeft: "8px" }}>· starts with "{goal.player_name.split(' ').pop()?.charAt(0)}"</span>
                        )}
                      </div>
                      <button
                        onClick={() => setHints(prev => ({ ...prev, [i]: Math.min((prev[i] ?? 0) + 1, 2) }))}
                        disabled={(hints[i] ?? 0) >= 2}
                        style={{ background: "none", border: "1px solid #e0d9cc", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", color: (hints[i] ?? 0) >= 2 ? "#aaa" : "#888", cursor: (hints[i] ?? 0) >= 2 ? "default" : "pointer", whiteSpace: "nowrap" as const }}>
                        {(hints[i] ?? 0) === 0 ? "Hint ⏱" : (hints[i] ?? 0) === 1 ? "Hint 🔤" : "No more hints"}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Added guesses */}
                {guesses.filter(g => g.trim()).length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px", marginBottom: "12px" }}>
                    {guesses.filter(g => g.trim()).map((g, i) => (
                      <div key={i} style={{ background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.3)", borderRadius: "20px", padding: "4px 12px", fontSize: "13px", color: "#3aaa35", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                        ⚽ {g}
                        <span onClick={() => setGuesses(guesses.filter((_, idx) => idx !== i))} style={{ cursor: "pointer", color: "#aaa", fontSize: "12px" }}>✕</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Single input */}
                {guesses.filter(g => g.trim()).length < goals.length && (
                  <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
                    <input
                      id="scorer-input"
                      type="text"
                      placeholder="Type a scorer's surname..."
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) {
                            setGuesses([...guesses.filter(g => g.trim()), val]);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #e0d9cc", fontSize: "15px", background: "#faf7f0", color: "#1a1a1a", outline: "none" }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('scorer-input') as HTMLInputElement;
                        const val = input.value.trim();
                        if (val) {
                          setGuesses([...guesses.filter(g => g.trim()), val]);
                          input.value = '';
                        }
                      }}
                      style={{ background: "#3aaa35", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 16px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                      Add
                    </button>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={guesses.filter(g => g.trim()).length === 0}
                  style={{ width: "100%", background: "#3aaa35", color: "#faf7f0", padding: "14px", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "16px", cursor: "pointer", opacity: guesses.filter(g => g.trim()).length === 0 ? 0.5 : 1 }}>
                  Submit Answers
                </button>
              </div>
            ) : (
              <div style={{ background: "#ffffff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e0d9cc" }}>
                <div style={{ background: correctCount === goals.length ? "rgba(58,170,53,0.1)" : correctCount > 0 ? "rgba(251,191,36,0.1)" : "rgba(239,68,68,0.08)", border: `1px solid ${correctCount === goals.length ? "rgba(58,170,53,0.3)" : correctCount > 0 ? "rgba(251,191,36,0.3)" : "rgba(239,68,68,0.2)"}`, borderRadius: "10px", padding: "1rem", textAlign: "center", marginBottom: "1.5rem" }}>
                  <div style={{ fontWeight: 800, fontSize: "28px", color: correctCount === goals.length ? "#3aaa35" : correctCount > 0 ? "#3aaa35" : "#ef4444" }}>
                    {correctCount}/{goals.length}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    {correctCount === goals.length ? "🎉 Perfect! All scorers correct!" : correctCount > 0 ? `⚽ Got ${correctCount} right!` : "❌ Unlucky — check the lineup above"}
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "12px", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "12px", textAlign: "center" }}>Full Scorers</div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#888", marginBottom: "8px" }}>{match.home_team}</div>
                      {homeGoals.length > 0 ? homeGoals.map((g: any, i: number) => (
                        <div key={i} style={{ fontSize: "13px", color: "#555", marginBottom: "6px", padding: "6px 10px", background: "#faf7f0", borderRadius: "6px" }}>
                          ⚽ {g.player_name} <span style={{ color: "#aaa" }}>{g.minute}'</span>
                          {g.goal_type === 'Own Goal' && <span style={{ color: "#ef4444" }}> OG</span>}
                          {g.goal_type === 'Penalty' && <span style={{ color: "#888" }}> (P)</span>}
                        </div>
                      )) : <div style={{ fontSize: "13px", color: "#bbb" }}>—</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#888", marginBottom: "8px" }}>{match.away_team}</div>
                      {awayGoals.length > 0 ? awayGoals.map((g: any, i: number) => (
                        <div key={i} style={{ fontSize: "13px", color: "#555", marginBottom: "6px", padding: "6px 10px", background: "#faf7f0", borderRadius: "6px" }}>
                          ⚽ {g.player_name} <span style={{ color: "#aaa" }}>{g.minute}'</span>
                          {g.goal_type === 'Own Goal' && <span style={{ color: "#ef4444" }}> OG</span>}
                          {g.goal_type === 'Penalty' && <span style={{ color: "#888" }}> (P)</span>}
                        </div>
                      )) : <div style={{ fontSize: "13px", color: "#bbb" }}>—</div>}
                    </div>
                  </div>
                </div>

                <button onClick={() => fetchRandomMatch()}
                  style={{ width: "100%", background: "#3aaa35", color: "#faf7f0", padding: "14px", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}>
                  Next Match →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}