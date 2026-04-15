'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Nav from '../../../components/Nav';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
const playerProfiles: Record<string, { club: string; nation: string; position: string; sport: string; related: string[] }> = {
  'jude-bellingham': { club: 'Real Madrid', nation: 'England', position: 'Midfielder', sport: 'Soccer', related: ['cole-palmer', 'bukayo-saka', 'phil-foden', 'declan-rice'] },
  'cole-palmer': { club: 'Chelsea', nation: 'England', position: 'Midfielder', sport: 'Soccer', related: ['jude-bellingham', 'bukayo-saka', 'phil-foden', 'jack-grealish'] },
  'bukayo-saka': { club: 'Arsenal', nation: 'England', position: 'Winger', sport: 'Soccer', related: ['jude-bellingham', 'cole-palmer', 'martin-odegaard', 'leandro-trossard'] },
  'lamine-yamal': { club: 'Barcelona', nation: 'Spain', position: 'Winger', sport: 'Soccer', related: ['jude-bellingham', 'pedri', 'gavi', 'vinicius-junior'] },
  'erling-haaland': { club: 'Man City', nation: 'Norway', position: 'Striker', sport: 'Soccer', related: ['kylian-mbappe', 'harry-kane', 'victor-osimhen', 'darwin-nunez'] },
  'kylian-mbappe': { club: 'Real Madrid', nation: 'France', position: 'Forward', sport: 'Soccer', related: ['lamine-yamal', 'erling-haaland', 'vinicius-junior', 'jude-bellingham'] },
  'phil-foden': { club: 'Man City', nation: 'England', position: 'Midfielder', sport: 'Soccer', related: ['jude-bellingham', 'cole-palmer', 'jack-grealish', 'erling-haaland'] },
  'lebron-james': { club: 'LA Lakers', nation: 'USA', position: 'Forward', sport: 'Basketball', related: ['stephen-curry', 'kevin-durant', 'giannis-antetokounmpo', 'luka-doncic'] },
  'stephen-curry': { club: 'Golden State Warriors', nation: 'USA', position: 'Guard', sport: 'Basketball', related: ['lebron-james', 'kevin-durant', 'klay-thompson', 'draymond-green'] },
  'patrick-mahomes': { club: 'Kansas City Chiefs', nation: 'USA', position: 'Quarterback', sport: 'NFL', related: ['josh-allen', 'lamar-jackson', 'joe-burrow', 'justin-herbert'] },
  'josh-allen': { club: 'Buffalo Bills', nation: 'USA', position: 'Quarterback', sport: 'NFL', related: ['patrick-mahomes', 'lamar-jackson', 'joe-burrow', 'jalen-hurts'] },
  'shohei-ohtani': { club: 'LA Dodgers', nation: 'Japan', position: 'Pitcher/DH', sport: 'Baseball', related: ['mike-trout', 'mookie-betts', 'juan-soto', 'freddie-freeman'] },
  'declan-rice': { club: 'Arsenal', nation: 'England', position: 'Midfielder', sport: 'Soccer', related: ['jude-bellingham', 'bukayo-saka', 'cole-palmer', 'martin-odegaard'] },
};
export default function PlayerPage() {
  const params = useParams();
  const slug = params.slug as string;
  const playerName = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 25;
  const [results, setResults] = useState<any[]>([]);
  const [sortedResults, setSortedResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgPrice, setAvgPrice] = useState(0);
  const [highPrice, setHighPrice] = useState(0);
  const [lowPrice, setLowPrice] = useState(0);
  const [sortOrder, setSortOrder] = useState<'high' | 'low'>('high');
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [playerProfile, setPlayerProfile] = useState<any>(null);
  const [boxxIQ, setBoxxIQ] = useState<any[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
const [addingCard, setAddingCard] = useState(false);
const [selectedVariant, setSelectedVariant] = useState('');
const [purchasePrice, setPurchasePrice] = useState('');
const [cardAdded, setCardAdded] = useState(false);
const [user, setUser] = useState<any>(null);

useEffect(() => {
    const fetchCards = async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(playerName)}&sort=${sortOrder === 'high' ? 'price' : 'endingSoonest'}&playerSearch=true`);
      const data = await res.json();
      const items = data.items || [];
      // Fetch player profile from Supabase if not in hardcoded list
if (!playerProfiles[slug]) {
  const { data: profileData } = await supabase
    .from('players')
    .select('name, team, nationality, sport')
    .ilike('name', playerName)
    .single();
  console.log('Profile data:', profileData);
console.log('Player name searched:', playerName);
  if (profileData) {
    setPlayerProfile(profileData);
  }
}
      setResults(items);

      const prices = items
        .filter((item: any) => item.price?.value)
        .map((item: any) => parseFloat(item.price.value));

      if (prices.length > 0) {
        const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
        setAvgPrice(avg);
        setHighPrice(Math.max(...prices));
        setLowPrice(Math.min(...prices));
      }

      const { data: historyData } = await supabase
        .from('price_history')
        .select('*')
        .eq('search_term', playerName.toLowerCase().replace(/-/g, ' '))
        .gte('recorded_at', '2026-04-10')
        .order('recorded_at', { ascending: true })
        .limit(30);
        // Fetch Boxx IQ variant data
const { data: iqData } = await supabase
  .from('price_history')
  .select('variant_label, avg_price, recorded_at')
  .ilike('search_term', `${playerName.toLowerCase()}%`)
  .neq('variant_label', 'All')
  .gte('recorded_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  .order('recorded_at', { ascending: false });

if (iqData) {
  // Group by variant and calculate 7 day rolling average
  const grouped = iqData.reduce((acc: any, row: any) => {
    if (!acc[row.variant_label]) acc[row.variant_label] = [];
    acc[row.variant_label].push(parseFloat(row.avg_price));
    return acc;
  }, {});

  const averaged = Object.entries(grouped).map(([variant_label, prices]: any) => ({
    variant_label,
    avg_price: (prices.reduce((a: number, b: number) => a + b, 0) / prices.length).toFixed(2),
  }));

  setBoxxIQ(averaged);
}

      if (historyData) {
        console.log('History data:', historyData);
        setPriceHistory(historyData.map((h: any) => ({
          date: new Date(h.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          price: parseFloat(h.avg_price),
        })));
      }

      setLoading(false);
    };
    fetchCards();
  }, [slug, sortOrder]);

 useEffect(() => {
    const sorted = [...results].sort((a: any, b: any) => {
      const priceA = parseFloat(a.price?.value || '0');
      const priceB = parseFloat(b.price?.value || '0');
      return sortOrder === 'high' ? priceB - priceA : priceA - priceB;
    });
    setCurrentPage(1);
    setSortedResults(sorted);
  }, [results, sortOrder]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
  const getUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };
  getUser();
}, []);

const addToCollection = async () => {
  if (!user || !selectedVariant || !purchasePrice) return;
  setAddingCard(true);

  const { data: playerData } = await supabase
    .from('players')
    .select('id')
    .ilike('name', playerName)
    .single();

  if (!playerData) {
    setAddingCard(false);
    return;
  }

  await supabase.from('user_cards').insert({
    user_id: user.id,
    player_id: playerData.id,
    variant_label: selectedVariant,
    purchase_price: parseFloat(purchasePrice),
  });

  setAddingCard(false);
  setCardAdded(true);
  setShowAddCard(false);
  setTimeout(() => setCardAdded(false), 3000);
};

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "#ffffff", border: "1px solid rgba(58,170,53,0.3)", borderRadius: "8px", padding: "8px 12px" }}>
          <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>{label}</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#3aaa35" }}>£{payload[0].value.toFixed(2)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>
      <Nav />
{/* Player Profile Header */}
{(() => {
  const profile = playerProfiles[slug] || (playerProfile ? {
  club: playerProfile.team,
  nation: playerProfile.nationality,
  position: playerProfile.sport,
  sport: playerProfile.sport,
} : null);
  return (
    <div style={{ borderBottom: "1px solid #f0ede6", background: "rgba(255,255,255,0.02)" }}>
      <div style={{ padding: "2rem 1.25rem", maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(58,170,53,0.1)", border: "2px solid rgba(58,170,53,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "24px", fontWeight: 800, color: "#3aaa35" }}>
          {playerName.split(' ').map((n: string) => n.charAt(0)).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.5px" }}>{playerName}</h1>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
            {profile ? (
              <>
                <span style={{ fontSize: "12px", color: "#666" }}>🏟 {profile.club}</span>
                <span style={{ fontSize: "12px", color: "#666" }}>🌍 {profile.nation}</span>
                <span style={{ fontSize: "12px", color: "#666" }}>⚽ {profile.position}</span>
              </>
            ) : (
              <span style={{ fontSize: "12px", color: "#aaa" }}>Trading Card Price Guide</span>
            )}
          </div>
        </div>
        <div style={{ display: "inline-block", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", color: "#3aaa35", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" as const, flexShrink: 0 }}>
          Player Price Guide
        </div>
      </div>
    </div>
  );
})()}
      <div style={{ padding: "2.5rem 1.25rem", maxWidth: "960px", margin: "0 auto" }}>

        <Link href="/" style={{ color: "#888", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>← Back to search</Link>

        <div style={{ marginBottom: "2rem" }}>
  <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
    Live eBay UK prices for {playerName} trading cards 
  </p>
</div>


        {/* Price Stats */}
        {!loading && results.length > 0 && (
  <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "1.5rem", marginTop: "-1rem" }}>
    Listings sorted by price — high to low.
  </p>
)}
{/* Boxx IQ */}
{boxxIQ.length > 0 && (
  <div style={{ background: "#fff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ background: "#3aaa35", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.05em" }}>BOXX IQ</div>
<div style={{ background: "rgba(58,170,53,0.1)", color: "#3aaa35", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "20px", letterSpacing: "0.05em" }}>BETA</div>
        <span style={{ fontSize: "13px", color: "#888" }}> </span>
      </div>
      <span style={{ fontSize: "11px", color: "#aaa" }}>Prices are shown on a rolling average basis across the previous 7 days - Updated daily · eBay UK</span>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "1rem" }}>
  {boxxIQ
    .sort((a: any, b: any) => {
      const order = ['Auto', 'PSA 10', 'Prizm', 'Numbered Parallel', 'Short Print', 'World Cup'];
      return order.indexOf(a.variant_label) - order.indexOf(b.variant_label);
    })
    .map((variant: any) => (
      <div key={variant.variant_label} style={{
  background: "#faf7f0",
  border: "1px solid #e0d9cc",
  borderRadius: "10px",
  padding: "16px",
  textAlign: "center",
}}>
  <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{variant.variant_label}</div>
  <div style={{ fontSize: "24px", fontWeight: 800, color: "#3aaa35" }}>£{parseFloat(variant.avg_price).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
  <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>avg price</div>
</div>
    ))}
</div>

    <div style={{ borderTop: "1px solid #f0ede6", paddingTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "13px", color: "#888" }}>Want to know what this means for your cards?</span>
      <button
        onClick={() => {
          const event = new CustomEvent('openBoxxIntel');
          window.dispatchEvent(event);
        }}
        style={{ background: "#3aaa35", color: "#fff", border: "none", borderRadius: "6px", padding: "7px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
        Chat to Boxx Intel →
      </button>
    </div>
</div>
)}

{/* Add to Collection */}
{boxxIQ.length > 0 && (
  <div style={{ marginBottom: '2rem' }}>
    {cardAdded && (
      <div style={{ background: 'rgba(58,170,53,0.1)', border: '1px solid rgba(58,170,53,0.3)', borderRadius: '8px', padding: '10px 16px', marginBottom: '12px', fontSize: '14px', color: '#3aaa35', fontWeight: 500 }}>
        ✓ Added to your collection
      </div>
    )}
    {!showAddCard ? (
      <button
        onClick={() => user ? setShowAddCard(true) : window.location.href = '/login'}
        style={{ background: 'none', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, color: '#888', cursor: 'pointer' }}>
        + Add to My Collection
      </button>
    ) : (
      <div style={{ background: '#fff', border: '1px solid #e0d9cc', borderRadius: '12px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' as const }}>
        <div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>Variant</div>
          <select
            value={selectedVariant}
            onChange={e => setSelectedVariant(e.target.value)}
            style={{ background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}>
            <option value=''>Select variant</option>
            {boxxIQ.map((v: any) => (
              <option key={v.variant_label} value={v.variant_label}>{v.variant_label}</option>
            ))}
          </select>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>What did you pay? (£)</div>
          <input
            type='number'
            placeholder='0.00'
            value={purchasePrice}
            onChange={e => setPurchasePrice(e.target.value)}
            style={{ background: '#faf7f0', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', outline: 'none', width: '120px', fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={addToCollection}
            disabled={!selectedVariant || !purchasePrice || addingCard}
            style={{ background: selectedVariant && purchasePrice ? '#3aaa35' : '#e0d9cc', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', fontWeight: 600, cursor: selectedVariant && purchasePrice ? 'pointer' : 'default', fontFamily: 'inherit' }}>
            {addingCard ? 'Adding...' : 'Add Card'}
          </button>
          <button
            onClick={() => setShowAddCard(false)}
            style={{ background: 'none', border: '1px solid #e0d9cc', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
)}

        {/* Results */}
        <div>
         <div id="results-section" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap" as const, gap: "10px" }}>
  <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Current Listings</h2>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#888" }}>Sort:</span>
              {[['high', 'High to Low'], ['low', 'Low to High']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setSortOrder(val as 'high' | 'low')}
                  style={{
                    background: sortOrder === val ? "#3aaa35" : "rgba(255,255,255,0.05)",
                    color: sortOrder === val ? "#faf7f0" : "#666",
                    border: `1px solid ${sortOrder === val ? "#3aaa35" : "#e0d9cc"}`,
                    borderRadius: "6px",
                    padding: "5px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}>
                  {label}
                </button>
              ))}
            </div>
            {sortedResults.length > itemsPerPage && (
  <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "1.5rem", alignItems: "center" }}>
    <button
  onClick={() => { setCurrentPage(p => p - 1); }}
  disabled={currentPage === 1}
  style={{ background: currentPage === 1 ? "#ffffff" : "rgba(255,255,255,0.05)", border: "1px solid #e0d9cc", color: currentPage === 1 ? "#bbb" : "#666", borderRadius: "6px", padding: "8px 14px", fontSize: "13px", cursor: currentPage === 1 ? "default" : "pointer" }}>
  ← Prev
</button>
<span style={{ fontSize: "13px", color: "#888" }}>Page {currentPage} of {Math.ceil(sortedResults.length / itemsPerPage)}</span>
<button
  onClick={() => { setCurrentPage(p => p + 1); }}
  disabled={currentPage === Math.ceil(sortedResults.length / itemsPerPage)}
  style={{ background: currentPage === Math.ceil(sortedResults.length / itemsPerPage) ? "#ffffff" : "rgba(255,255,255,0.05)", border: `1px solid ${currentPage === Math.ceil(sortedResults.length / itemsPerPage) ? "#e0d9cc" : "rgba(58,170,53,0.3)"}`, color: currentPage === Math.ceil(sortedResults.length / itemsPerPage) ? "#bbb" : "#3aaa35", borderRadius: "6px", padding: "8px 14px", fontSize: "13px", cursor: currentPage === Math.ceil(sortedResults.length / itemsPerPage) ? "default" : "pointer" }}>
  Next →
</button>
  </div>
)}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "#bbb", padding: "3rem 0" }}>Loading {playerName} cards...</div>
          ) : sortedResults.length === 0 ? (
            <div style={{ textAlign: "center", color: "#bbb", padding: "3rem 0" }}>No listings found for {playerName}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {sortedResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item: any) => (
                <div key={item.itemId} style={{ display: "flex", gap: "1rem", alignItems: "center", background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "1rem 1.25rem" }}>
                  {item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl ? (
                    <img
                      src={item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl}
                      alt={item.title}
                      style={{ width: "70px", height: "70px", objectFit: "contain", borderRadius: "6px", background: "rgba(255,255,255,0.05)", flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: "70px", height: "70px", background: "#f0ede6", borderRadius: "6px", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: "14px", color: "#1a1a1a", marginBottom: "4px", lineHeight: 1.4 }}>{item.title}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{item.condition || 'Condition not specified'}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "20px", color: "#3aaa35", marginBottom: "6px" }}>
                      {item.price ? `${item.price.currency === 'GBP' ? '£' : '$'}${formatPrice(parseFloat(item.price.value))}` : 'N/A'}
                    </div>
                    <a href={item.itemAffiliateWebUrl || item.itemWebUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#888", fontSize: "12px", textDecoration: "none" }}>View on eBay →</a>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
{/* Related Players */}
{playerProfiles[slug] && (
  <div style={{ marginTop: "3rem" }}>
    <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 1.25rem" }}>Related Players</h2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px" }}>
      {playerProfiles[slug].related.map((relatedSlug) => {
        const relatedProfile = playerProfiles[relatedSlug];
        const relatedName = relatedSlug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        return (
          <Link key={relatedSlug} href={`/players/${relatedSlug}`} style={{ textDecoration: "none" }}>
            <div
              style={{ background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "10px", padding: "1rem", textAlign: "center", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(58,170,53,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0d9cc')}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: "14px", fontWeight: 800, color: "#3aaa35" }}>
                {relatedName.split(' ').map((n: string) => n.charAt(0)).join('')}
              </div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#1a1a1a", marginBottom: "3px", lineHeight: 1.3 }}>{relatedName}</div>
              {relatedProfile && (
                <div style={{ fontSize: "10px", color: "#aaa" }}>{relatedProfile.nation} · {relatedProfile.club}</div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  </div>
)}
      </div>
    </main>
  );
}