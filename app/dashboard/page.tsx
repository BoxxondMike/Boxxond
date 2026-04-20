'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Nav from '../../components/Nav';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertTerm, setAlertTerm] = useState('');
  const [alertMaxPrice, setAlertMaxPrice] = useState('');
  const [alertType, setAlertType] = useState('player');
  const router = useRouter();
  const [collectionStats, setCollectionStats] = useState<{ count: number, value: number } | null>(null);
  const [username, setUsername] = useState('');
const [selectedSports, setSelectedSports] = useState<string[]>([]);
const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
const [savingProfile, setSavingProfile] = useState(false);
const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        const { data } = await supabase
          .from('saved_cards')
          .select('*')
          .order('created_at', { ascending: false });
        setSavedCards(data || []);
        const { data: alertsData } = await supabase
          .from('card_alerts')
          .select('*')
          .order('created_at', { ascending: false });
        setAlerts(alertsData || []);

        const { data: profileData } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', session.user.id)
  .single();

if (profileData) {
  setUsername(profileData.username || '');
  setSelectedSports(profileData.sports || []);
  setSelectedTeams(profileData.teams || []);
}

        const { data: collectionData } = await supabase
          .from('user_cards')
          .select('purchase_price, quantity')
          .eq('user_id', session.user.id);

        if (collectionData) {
          const count = collectionData.length;
          const value = collectionData.reduce((sum: number, c: any) => sum + (parseFloat(c.purchase_price) * (c.quantity || 1)), 0);
          setCollectionStats({ count, value });
        }
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleUnsave = async (itemId: string) => {
    await supabase.from('saved_cards').delete().eq('item_id', itemId);
    setSavedCards(savedCards.filter((c: any) => c.item_id !== itemId));
  };

  const handleAddAlert = async () => {
    if (!alertTerm.trim()) return;
    const { data, error } = await supabase.from('card_alerts').insert({
      user_id: user.id,
      search_term: alertTerm.trim(),
      max_price: alertMaxPrice ? parseFloat(alertMaxPrice) : null,
    }).select();
    if (!error && data) {
      setAlerts([data[0], ...alerts]);
      setAlertTerm('');
      setAlertMaxPrice('');
    }
  };

  const handleDeleteAlert = async (id: string) => {
    await supabase.from('card_alerts').delete().eq('id', id);
    setAlerts(alerts.filter((a: any) => a.id !== id));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <main style={{ background: "#faf7f0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#888)", fontSize: "14px" }}>Loading...</div>
      </main>
    );
  }

  const saveProfile = async () => {
  if (!user) return;
  setSavingProfile(true);
  await supabase.from('user_profiles').upsert({
    user_id: user.id,
    username,
    sports: selectedSports,
    teams: selectedTeams,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  setSavingProfile(false);
  setProfileSaved(true);
  setTimeout(() => setProfileSaved(false), 3000);
};

  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>

      <Nav />

      <div style={{ padding: "2.5rem 1.25rem", maxWidth: "960px", margin: "0 auto" }}>

        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-block", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", color: "#1F6F3A", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
            Dashboard
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 0.5rem", letterSpacing: "-0.5px" }}>
            Welcome back 👋
          </h1>
          <p style={{ color: "#888)", fontSize: "14px", margin: 0 }}>{user?.email}</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "2.5rem" }}>
          {[
            { label: "Wishlist", value: savedCards.length.toString(), desc: "Cards being watched" },
            { label: "Price Alerts", value: alerts.length.toString(), desc: "Active alerts" },
            { label: "Collection Value", value: collectionStats && collectionStats.value > 0 ? `£${collectionStats.value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "£0", desc: "Est. value of your collection" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "1.25rem" }}>
              <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "0.5rem" }}>{stat.label}</div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#3aaa35", marginBottom: "0.25rem" }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: "#aaa" }}>{stat.desc}</div>
            </div>
          ))}
        </div>
                {/* Card Alerts */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>Card Alerts</h2>
          </div>
          <p style={{ fontSize: "13px", color: "#888)", marginBottom: "1.25rem", marginTop: 0 }}>
            Get notified when new listings appear for players or teams you're tracking.
          </p>

          {/* Alert Type Tabs */}
          <div style={{ display: "flex", gap: "0", marginBottom: "1rem", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "4px", width: "fit-content" }}>
            {[['player', 'Player / Card'], ['team', 'Team']].map(([tab, label]) => (
              <button key={tab} onClick={() => { setAlertType(tab); setAlertTerm(''); }} style={{ background: alertType === tab ? "#3aaa35" : "transparent", color: alertType === tab ? "#faf7f0" : "#666", fontWeight: 700, fontSize: "13px", padding: "8px 18px", border: "none", borderRadius: "7px", cursor: "pointer" }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem", flexWrap: "wrap" as const }}>
            {alertType === 'player' ? (
              <input
                type="text"
                placeholder="e.g. Jude Bellingham Topps Chrome"
                value={alertTerm}
                onChange={(e) => setAlertTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAlert()}
                style={{ flex: 1, minWidth: "200px", background: "rgba(255,255,255,0.05)", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "10px 14px", color: "#1a1a1a", fontSize: "14px", outline: "none" }}
              />
            ) : (
              <select
                value={alertTerm}
                onChange={(e) => setAlertTerm(e.target.value)}
                style={{ flex: 1, minWidth: "200px", background: "#faf7f0", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "10px 14px", color: alertTerm ? "#fff" : "#888)", fontSize: "14px", outline: "none", cursor: "pointer" }}>
                <option value="">Select a team...</option>
                <optgroup label="Premier League">
                  {['Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton', 'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Burnley', 'Sunderland', 'Liverpool', 'Man City', 'Man United', 'Newcastle', 'Nottm Forest', 'Leeds', 'Spurs', 'West Ham', 'Wolves'].map(team => (
                    <option key={team} value={`${team} football card`}>{team}</option>
                  ))}
                </optgroup>
                <optgroup label="NBA Teams">
                  {['Lakers', 'Warriors', 'Celtics', 'Bulls', 'Heat', 'Knicks', 'Nets', 'Suns', 'Bucks', 'Nuggets'].map(team => (
                    <option key={team} value={`${team} basketball card`}>{team}</option>
                  ))}
                </optgroup>
                <optgroup label="NFL Teams">
                  {['Chiefs', 'Eagles', '49ers', 'Cowboys', 'Patriots', 'Packers', 'Bills', 'Bengals', 'Ravens', 'Dolphins'].map(team => (
                    <option key={team} value={`${team} NFL card`}>{team}</option>
                  ))}
                </optgroup>
              </select>
            )}
            <input
              type="number"
              placeholder="Max price £ (optional)"
              value={alertMaxPrice}
              onChange={(e) => setAlertMaxPrice(e.target.value)}
              style={{ width: "180px", background: "rgba(255,255,255,0.05)", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "10px 14px", color: "#1a1a1a", fontSize: "14px", outline: "none" }}
            />
            <button
              onClick={handleAddAlert}
              style={{ background: "#3aaa35", color: "#faf7f0", fontWeight: 700, fontSize: "13px", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap" as const }}>
              Add Alert
            </button>
          </div>

          {alerts.length === 0 ? (
            <div style={{ textAlign: "center", background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "2rem" }}>
              <div style={{ fontSize: "13px", color: "#aaa" }}>No alerts set up yet — add one above</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {alerts.map((alert: any) => (
                <div key={alert.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: "14px", color: "#1a1a1a", marginBottom: "3px" }}>{alert.search_term}</div>
                    <div style={{ fontSize: "12px", color: "#aaa" }}>
                      {alert.max_price ? `Max price: £${alert.max_price}` : 'Any price'}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Link href={`/?q=${encodeURIComponent(alert.search_term)}`} style={{ fontSize: "12px", color: "#3aaa35", textDecoration: "none" }}>Search now →</Link>
                    <button onClick={() => handleDeleteAlert(alert.id)} style={{ fontSize: "11px", color: "rgba(239,68,68,0.6)", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: "1rem", background: "rgba(58,170,53,0.06)", border: "1px solid rgba(58,170,53,0.15)", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "12px", color: "#888)" }}>
            🔔 Daily email notifications active — new listings delivered to your inbox
          </div>
        </div>

        {/* Wishlist */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>Wishlist</h2>
            <Link href="/" style={{ fontSize: "13px", color: "#3aaa35", textDecoration: "none" }}>+ Add more</Link>
          </div>

          {savedCards.length === 0 ? (
            <div style={{ textAlign: "center", background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "3rem" }}>
              <div style={{ fontSize: "32px", marginBottom: "1rem" }}>☆</div>
              <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "0.5rem" }}>No saved cards yet</div>
              <div style={{ fontSize: "13px", color: "#888)", marginBottom: "1.5rem" }}>Search for a card and save it to your Wishlist</div>
              <Link href="/" style={{ background: "#3aaa35", color: "#faf7f0", fontWeight: 700, fontSize: "13px", padding: "10px 20px", borderRadius: "6px", textDecoration: "none" }}>
                Start Searching
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {savedCards.map((card: any) => (
                <div key={card.id} style={{ display: "flex", gap: "1rem", alignItems: "center", background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "1rem 1.25rem" }}>
                  {card.image_url && (
                    <img src={card.image_url} alt={card.title} style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "6px", background: "rgba(255,255,255,0.05)", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: "13px", color: "#1a1a1a", marginBottom: "4px", lineHeight: 1.4 }}>{card.title}</div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' as const }}>
  <div style={{ fontSize: "11px", color: "#aaa" }}>Saved {new Date(card.created_at).toLocaleDateString('en-GB')}</div>
  {card.end_date && (() => {
    const hoursLeft = Math.floor((new Date(card.end_date).getTime() - Date.now()) / (1000 * 60 * 60));
    if (hoursLeft <= 0) return null;
    if (hoursLeft <= 24) return (
      <span style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#dc3545', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
        ⏰ Ends in {hoursLeft}h
      </span>
    );
    if (hoursLeft <= 72) return (
      <span style={{ background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.3)', color: '#ff8c00', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
        ⏰ Ends in {Math.floor(hoursLeft / 24)}d
      </span>
    );
    return null;
  })()}
</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "18px", color: "#3aaa35", marginBottom: "6px" }}>
                      {card.price ? `£${card.price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                    </div>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <a href={card.item_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#888)", textDecoration: "none" }}>View →</a>
                      <button onClick={() => handleUnsave(card.item_id)} style={{ fontSize: "11px", color: "rgba(239,68,68,0.6)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
       {/* My Collection */}
<div style={{ marginTop: "2.5rem" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.3px" }}>My Collection</h2>
      <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>Track your card collection against live Boxx IQ prices</p>
    </div>
  </div>
  <div style={{ background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div>
      <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
        {collectionStats ? `${collectionStats.count} card${collectionStats.count !== 1 ? 's' : ''} tracked` : '0 cards tracked'}
      </div>
      <div style={{ fontSize: "13px", color: "#888" }}>
        {collectionStats && collectionStats.value > 0 ? `Est. value £${collectionStats.value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Add cards to start tracking'}
      </div>
    </div>
    <Link href="/collection" style={{ background: "#1F6F3A", color: "#fff", fontWeight: 700, fontSize: "13px", padding: "10px 20px", borderRadius: "8px", textDecoration: "none" }}>
      Open My Collection →
    </Link>
  </div>
</div>
{/* Profile */}
<div style={{ marginTop: "2.5rem" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.3px" }}>My Profile</h2>
      <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>Personalise your BoxxHQ experience</p>
    </div>
  </div>

  <div style={{ background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

    {/* Username */}
    <div>
      <label style={{ fontSize: "12px", color: "#888", fontWeight: 600, display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Username</label>
      <input
        type="text"
        placeholder="e.g. cardkinguk"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ background: "#faf7f0", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" as const }}
      />
    </div>

    {/* Sports */}
    <div>
      <label style={{ fontSize: "12px", color: "#888", fontWeight: 600, display: "block", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sports I Collect</label>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
        {['Football', 'Basketball', 'NFL', 'Baseball', 'Cricket', 'Rugby'].map(sport => (
          <button
            key={sport}
            onClick={() => setSelectedSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport])}
            style={{
              background: selectedSports.includes(sport) ? "rgba(58,170,53,0.1)" : "#faf7f0",
              border: selectedSports.includes(sport) ? "1px solid rgba(58,170,53,0.4)" : "1px solid #e0d9cc",
              color: selectedSports.includes(sport) ? "#3aaa35" : "#888",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}>
            {selectedSports.includes(sport) ? '✓ ' : ''}{sport}
          </button>
        ))}
      </div>
    </div>

    {/* Teams */}
<div>
  <label style={{ fontSize: "12px", color: "#888", fontWeight: 600, display: "block", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Teams I Follow</label>
  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const, alignItems: "center" }}>
    <select
      onChange={e => {
        const val = e.target.value;
        if (val && !selectedTeams.includes(val)) {
          setSelectedTeams(prev => [...prev, val]);
        }
        e.target.value = '';
      }}
      style={{ background: "#faf7f0", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
      <option value="">Add a team...</option>
      {(selectedSports.includes('Football') || selectedSports.length === 0) && (
        <optgroup label="Premier League">
          {['Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Leeds', 'Liverpool', 'Man City', 'Man United', 'Newcastle', 'Nottm Forest', 'Spurs', 'Sunderland', 'West Ham', 'Wolves'].map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </optgroup>
      )}
      {(selectedSports.includes('Basketball') || selectedSports.length === 0) && (
        <optgroup label="NBA">
          {['Lakers', 'Warriors', 'Celtics', 'Bulls', 'Heat', 'Knicks', 'Nets', 'Suns', 'Bucks', 'Nuggets', 'Clippers', 'Mavericks', 'Spurs', 'Rockets', 'Thunder'].map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </optgroup>
      )}
      {(selectedSports.includes('NFL') || selectedSports.length === 0) && (
        <optgroup label="NFL">
          {['Chiefs', 'Eagles', '49ers', 'Cowboys', 'Patriots', 'Packers', 'Bills', 'Bengals', 'Ravens', 'Dolphins', 'Rams', 'Seahawks', 'Bears', 'Giants', 'Steelers'].map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </optgroup>
      )}
      {(selectedSports.includes('Baseball') || selectedSports.length === 0) && (
        <optgroup label="MLB">
          {['Yankees', 'Red Sox', 'Dodgers', 'Cubs', 'Mets', 'Giants', 'Cardinals', 'Braves', 'Astros', 'Blue Jays'].map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </optgroup>
      )}
      <optgroup label="Other">
        <option value="Other">Other</option>
      </optgroup>
    </select>
    {selectedTeams.map(team => (
      <div key={team} style={{ background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.4)", color: "#3aaa35", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
        {team}
        <span onClick={() => setSelectedTeams(prev => prev.filter(t => t !== team))} style={{ cursor: "pointer", fontSize: "14px", lineHeight: 1 }}>×</span>
      </div>
    ))}
  </div>
</div>

    {/* Save */}
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <button
        onClick={saveProfile}
        disabled={savingProfile}
        style={{ background: "#1F6F3A", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        {savingProfile ? 'Saving...' : 'Save Profile'}
      </button>
      {profileSaved && (
        <span style={{ fontSize: "13px", color: "#3aaa35", fontWeight: 500 }}>✓ Profile saved</span>
      )}
    </div>

  </div>
</div>
      </div>
    </main>
  );
}