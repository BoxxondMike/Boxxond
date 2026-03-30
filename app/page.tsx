'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Nav from '../components/Nav';
import { supabase } from '../lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';

const featuredQueries = [
  'Jude Bellingham auto refractor',
  'Cole Palmer Topps Chrome auto',
  'Lamine Yamal Prizm refractor',
  'Bukayo Saka auto card',
  'LeBron James Prizm',
  'Patrick Mahomes auto',
];
function HomeContent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSales, setRecentSales] = useState([]);
  const [featuredCards, setFeaturedCards] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [activeSport, setActiveSport] = useState('');
  const [certNumber, setCertNumber] = useState('');
const [certResult, setCertResult] = useState<any>(null);
const [certLoading, setCertLoading] = useState(false);
const [certError, setCertError] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [sortBy, setSortBy] = useState('');
  const searchParams = useSearchParams();
const router = useRouter();
  const formatPrice = (value: number) => {
  const parts = value.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

 useEffect(() => {
    fetchRecentSales();
    fetchFeaturedCards();
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      handleSearchWithQuery(q);
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase.from('saved_cards').select('item_id');
        setSavedIds(data?.map((d: any) => d.item_id) || []);
      }
    };
    getUser();
  }, []);

  const fetchRecentSales = async () => {
  const res = await fetch('/api/search?q=Topps+Chrome+refractor+auto+football&featured=true');
  const data = await res.json();
  setRecentSales(data.items?.slice(0, 12) || []);
};

 const fetchFeaturedCards = async () => {
  const queries = [
    'Jude Bellingham auto refractor',
    'Cole Palmer Topps Chrome',
    'Bukayo Saka card',
    'Lamine Yamal rookie card',
    'Erling Haaland auto',
    'Kylian Mbappe Prizm',
    'Bruno Fernandes Chrome',
    'LeBron James Prizm',
    'Stephen Curry auto',
    'Giannis Antetokounmpo',
    'Patrick Mahomes auto',
    'Josh Allen Prizm',
    'Shohei Ohtani rookie',
    'Juan Soto Chrome',
  ];

  const shuffled = queries.sort(() => Math.random() - 0.5).slice(0, 8);

  const results = await Promise.all(
    shuffled.map(q =>
      fetch(`/api/search?q=${encodeURIComponent(q)}&featured=true`)
        .then(res => res.json())
        .then(data => data.items?.slice(0, 5) || [])
    )
  );

  const combined = results.flat().sort(() => Math.random() - 0.5);
  const filtered = combined.filter((item: any) => parseFloat(item.price?.value || 0) >= 5);
  setFeaturedCards(filtered.slice(0, 12));
};
const handleSearchWithQuery = async (q: string) => {
  setLoading(true);
  const searchQuery = activeSport ? `${q} ${activeSport}` : q;
  const params = new URLSearchParams();
  params.set('q', searchQuery);
  if (minPrice) params.set('minPrice', minPrice);
  if (maxPrice) params.set('maxPrice', maxPrice);
  if (condition) params.set('condition', condition);
  if (sortBy) params.set('sort', sortBy);
  const res = await fetch(`/api/search?${params.toString()}`);
  const data = await res.json();
  setResults(data.items || []);
  setLoading(false);
};
const handleCertCheck = async () => {
  if (!certNumber.trim()) return;
  setCertLoading(true);
  setCertResult(null);
  setCertError('');
  try {
    const res = await fetch(`/api/psa/cert?cert=${encodeURIComponent(certNumber.trim())}`);
    const data = await res.json();
    if (data.error || !data.PSACert) {
      setCertError('No card found for that cert number.');
   } else {
  console.log('PSA result:', data);
  setCertResult(data);
}
  } catch {
    setCertError('Something went wrong. Please try again.');
  }
  setCertLoading(false);
};
  const handleSearch = async () => {
  if (!query) return;
  router.push(`/?q=${encodeURIComponent(query)}`);
  handleSearchWithQuery(query);
};

  const handleSave = async (item: any) => {
    if (!user) {
      window.location.href = '/signup';
      return;
    }
    
    const isAlreadySaved = savedIds.includes(item.itemId);
    if (isAlreadySaved) {
      await supabase.from('saved_cards').delete().eq('item_id', item.itemId).eq('user_id', user.id);
      setSavedIds(savedIds.filter((id: string) => id !== item.itemId));
    } else {
      await supabase.from('saved_cards').insert({
        user_id: user.id,
        item_id: item.itemId,
        title: item.title,
        price: item.price ? parseFloat(item.price.value) : null,
        currency: item.price?.currency || 'GBP',
        image_url: item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl || null,
        item_url: item.itemAffiliateWebUrl || item.itemWebUrl,
      });
      setSavedIds([...savedIds, item.itemId]);
    }
  };

  const CardGrid = ({ items }: { items: any[] }) => (
    <div style={{ display: "flex", gap: "12px", overflowX: "scroll", paddingBottom: "8px", scrollbarWidth: "thin", scrollbarColor: "rgba(58,170,53,0.3) transparent" }}>
      {items.map((item: any) => (
        <a key={item.itemId} href={item.itemAffiliateWebUrl || item.itemWebUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flexShrink: 0, width: "200px" }}>
          <div style={{ background: "#fff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "1rem", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(58,170,53,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0d9cc')}>
            {item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl ? (
              <img
                src={item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl}
                alt={item.title}
                style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px" }}
              />
            ) : (
              <div style={{ width: "100%", height: "220px", background: "#f0ede6", borderRadius: "6px", marginBottom: "10px" }} />
            )}
            <div style={{ fontSize: "12px", color: "#444", marginBottom: "8px", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</div>
            <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "18px", color: "#3aaa35", letterSpacing: "0px" }}>
            {item.price ? `${item.price.currency === 'GBP' ? '£' : '$'}${formatPrice(parseFloat(item.price.value))}` : 'N/A'}
            </div>
          </div>
        </a>
      ))}
    </div>
  );

  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>

      <style>{`
        .result-card { display: flex; gap: 1.5rem; align-items: center; }
        .result-image { width: 90px; height: 90px; flex-shrink: 0; }
        .result-price { text-align: right; flex-shrink: 0; }
        .stats-bar { display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap; }
        select option { background: #faf7f0; color: #fff; }
        @media (max-width: 640px) {
          .result-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .result-image { width: 100% !important; height: 200px !important; }
          .result-price { text-align: left; width: 100%; display: flex; justify-content: space-between; align-items: center; }
          .stats-bar { gap: 1.5rem; }
        }
      `}</style>

      <Nav activePage="prices" />

      {/* Hero */}
      <div style={{ padding: "3rem 1.25rem 2.5rem", maxWidth: "12git00px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", color: "#3aaa35", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1.5rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
          Trading Card Price Tracker
        </div>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(36px, 7vw, 68px)", lineHeight: 1.05, margin: "0 0 1.25rem", letterSpacing: "-2px" }}>
          Know what your<br /><span style={{ color: "#3aaa35" }}>cards are worth</span>
        </h1>
      <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 1.5rem" }}>
  Search live eBay UK listings and get daily alerts when new cards drop for your favourite players and teams.
</p>

{/* CTA Buttons */}
<div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" as const }}>
  <button
    onClick={() => document.querySelector('input')?.focus()}
    style={{ background: "#3aaa35", color: "#faf7f0", fontWeight: 700, fontSize: "14px", padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer" }}>
    Search Cards
  </button>
  <Link
    href={user ? "/dashboard" : "/signup"}
    style={{ background: "rgba(255,255,255,0.05)", color: "#1a1a1a", fontWeight: 700, fontSize: "14px", padding: "12px 24px", border: "1px solid #e0d9cc", borderRadius: "8px", textDecoration: "none" }}>
    Set Up Alerts →
  </Link>
</div>

        {/* Sport Filter */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap" as const }}>
          {[
            { label: "All Sports", value: "" },
            { label: "Soccer", value: "football soccer card" },
            { label: "Basketball", value: "basketball card NBA" },
            { label: "Baseball", value: "baseball card MLB" },
            { label: "NFL", value: "american football NFL card" },
          ].map((sport) => (
            <button
              key={sport.label}
              onClick={() => setActiveSport(sport.value)}
              style={{
                background: activeSport === sport.value ? "#3aaa35" : "rgba(255,255,255,0.05)",
                color: activeSport === sport.value ? "#faf7f0" : "#666",
                border: `1px solid ${activeSport === sport.value ? "#3aaa35" : "#e0d9cc"}`,
                borderRadius: "20px",
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}>
              {sport.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ display: "flex", maxWidth: "720px", margin: "0 auto", background: "#fff", border: "1px solid #e0d9cc", borderRadius: "10px", overflow: "hidden" }}>
          <input
            type="text"
            placeholder="Search player, set or card..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#1a1a1a", fontSize: "15px", padding: "14px 16px" }}
          />
          <button onClick={handleSearch} style={{ background: "#3aaa35", border: "none", color: "#faf7f0", fontWeight: 700, fontSize: "13px", padding: "0 18px", cursor: "pointer", whiteSpace: "nowrap" as const }}>
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar" style={{ padding: "1.25rem", borderTop: "1px solid #f0ede6", borderBottom: "1px solid #f0ede6" }}>
        {[["eBay UK", "Live Data"], ["Free", "To Use"], ["Trading Cards", "UK Market"], ["Daily", "Updated"]].map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <span style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px", display: "block" }}>{num}</span>
            <span style={{ fontSize: "11px", color: "#888", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div style={{ padding: "2rem 1.25rem", maxWidth: "1000px", margin: "0 auto" }}>

          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap" as const, alignItems: "center" }}>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "6px 12px", color: "#444", fontSize: "13px", outline: "none", cursor: "pointer" }}>
              <option value="">All Conditions</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Graded">Graded</option>
            </select>
            <input
              type="number"
              placeholder="Min £"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{ width: "80px", background: "rgba(255,255,255,0.05)", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "6px 12px", color: "#1a1a1a", fontSize: "13px", outline: "none" }}
            />
            <input
              type="number"
              placeholder="Max £"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ width: "80px", background: "rgba(255,255,255,0.05)", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "6px 12px", color: "#1a1a1a", fontSize: "13px", outline: "none" }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "6px 12px", color: "#444", fontSize: "13px", outline: "none", cursor: "pointer" }}>
              <option value="">Sort: Default</option>
              <option value="price">Price: High to Low</option>
              <option value="lowPrice">Price: Low to High</option>
            </select>
            <button
              onClick={handleSearch}
              style={{ background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", color: "#3aaa35", borderRadius: "8px", padding: "6px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              Apply Filters
            </button>
            <span style={{ fontSize: "13px", color: "#888" }}>{results.length} results</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {results.map((item: any) => (
              <div key={item.itemId} className="result-card" style={{ background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "1rem 1.25rem" }}>
                <div style={{ flexShrink: 0 }}>
                  {item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl ? (
                    <img src={item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl} alt={item.title} className="result-image" style={{ objectFit: "contain", borderRadius: "8px", background: "rgba(255,255,255,0.05)" }} />
                  ) : (
                    <div className="result-image" style={{ background: "#f0ede6", borderRadius: "8px" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: "14px", color: "#1a1a1a", marginBottom: "6px", lineHeight: 1.4 }}>{item.title}</div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" as const }}>
                    <span style={{ fontSize: "12px", color: "#888" }}>{item.condition || 'Condition not specified'}</span>
                    <Link
                      href={`/players/${query.toLowerCase().trim().split(' ').slice(0, 2).join('-')}`}
                      style={{ fontSize: "11px", color: "#3aaa35", textDecoration: "none", background: "rgba(58,170,53,0.1)", padding: "2px 8px", borderRadius: "4px" }}>
                      View Player Page →
                    </Link>
                  </div>
                </div>
                <div className="result-price">
                  <div style={{ fontWeight: 700, fontSize: "22px", color: "#3aaa35", marginBottom: "8px" }}>
                   {item.price ? `${item.price.currency === 'GBP' ? '£' : '$'}${formatPrice(parseFloat(item.price.value))}` : 'N/A'}
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <a href={item.itemAffiliateWebUrl || item.itemWebUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#888", fontSize: "12px", textDecoration: "none" }}>View on eBay →</a>
                    <button
                      onClick={() => handleSave(item)}
                      style={{ background: savedIds.includes(item.itemId) ? "rgba(58,170,53,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${savedIds.includes(item.itemId) ? "rgba(58,170,53,0.5)" : "#e0d9cc"}`, borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", color: savedIds.includes(item.itemId) ? "#3aaa35" : "#888" }}>
                      {savedIds.includes(item.itemId) ? '★ Saved' : '☆ Save'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Ending Soon & Listings We Like */}
<div style={{ padding: "2rem 1.25rem", maxWidth: "1300px", margin: "0 auto" }}>
  
  {/* Ending Soon */}
  <div style={{ marginBottom: "2.5rem" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
      <span style={{ fontWeight: 700, fontSize: "17px" }}>Ending Soon</span>
      <span style={{ fontSize: "13px", color: "#888" }}>Live from eBay UK</span>
    </div>
    {recentSales.length > 0 ? <CardGrid items={recentSales} /> : (
      <div style={{ textAlign: "center", color: "#bbb", padding: "2rem 0" }}>Loading...</div>
    )}
  </div>

  {/* Listings We Like */}
  <div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
      <span style={{ fontWeight: 700, fontSize: "17px" }}>Listings We Like</span>
      <span style={{ fontSize: "13px", color: "#888" }}>Cards we think you'll love</span>
    </div>
    {featuredCards.length > 0 ? <CardGrid items={featuredCards} /> : (
      <div style={{ textAlign: "center", color: "#bbb", padding: "2rem 0" }}>Loading...</div>
    )}
  </div>

</div>
{/* Trending Players */}
<div style={{ padding: "2rem 1.25rem", maxWidth: "1000px", margin: "0 auto" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
    <span style={{ fontWeight: 700, fontSize: "17px" }}>Trending Players</span>
    <span style={{ background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.2)", color: "#3aaa35", padding: "3px 10px", borderRadius: "20px", fontSize: "11px" }}>Updated weekly</span>
  </div>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
   {[
  { name: "Jude Bellingham", slug: "jude-bellingham", sport: "Soccer" },
  { name: "Cole Palmer", slug: "cole-palmer", sport: "Soccer" },
  { name: "Bukayo Saka", slug: "bukayo-saka", sport: "Soccer" },
  { name: "Lamine Yamal", slug: "lamine-yamal", sport: "Soccer" },
  { name: "Erling Haaland", slug: "erling-haaland", sport: "Soccer" },
  { name: "Kylian Mbappe", slug: "kylian-mbappe", sport: "Soccer" },
  { name: "LeBron James", slug: "lebron-james", sport: "Basketball" },
  { name: "Stephen Curry", slug: "stephen-curry", sport: "Basketball" },
  { name: "Patrick Mahomes", slug: "patrick-mahomes", sport: "NFL" },
  { name: "Josh Allen", slug: "josh-allen", sport: "NFL" },
  { name: "Shohei Ohtani", slug: "shohei-ohtani", sport: "Baseball" },
  { name: "Juan Soto", slug: "juan-soto", sport: "Baseball" },
].map((player) => (
      <Link key={player.slug} href={`/players/${player.slug}`} style={{ textDecoration: "none" }}>
        <div
          style={{ background: "#fff", border: "1px solid #e0d9cc", borderRadius: "10px", padding: "1rem", textAlign: "center", cursor: "pointer" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(58,170,53,0.3)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0d9cc')}>
          <div style={{ width: "100%", height: "70px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: player.sport === 'Soccer' ? 'rgba(58,170,53,0.08)' : player.sport === 'Basketball' ? 'rgba(239,68,68,0.08)' : player.sport === 'Baseball' ? 'rgba(34,197,94,0.08)' : 'rgba(59,130,246,0.08)', borderRadius: "8px", border: `1px solid ${player.sport === 'Soccer' ? 'rgba(58,170,53,0.2)' : player.sport === 'Basketball' ? 'rgba(239,68,68,0.2)' : player.sport === 'Baseball' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)'}`, fontSize: "32px" }}>
  {player.sport === 'Soccer' ? '⚽' : player.sport === 'Basketball' ? '🏀' : player.sport === 'Baseball' ? '⚾' : '🏈'}
</div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#1a1a1a", marginBottom: "3px", lineHeight: 1.3 }}>{player.name}</div>
          <div style={{ fontSize: "10px", color: "#aaa" }}>{player.sport}</div>
        </div>
      </Link>
    ))}
  </div>
</div>
{/* PSA Cert Checker */}
<div style={{ padding: "2rem 1.25rem", maxWidth: "1000px", margin: "0 auto" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
    <span style={{ fontWeight: 700, fontSize: "17px" }}>PSA Cert Checker</span>
    <span style={{ fontSize: "11px", color: "#aaa", background: "#f0ede6", padding: "4px 10px", borderRadius: "20px" }}>Powered by PSA</span>
  </div>
  <p style={{ fontSize: "13px", color: "#888", marginBottom: "1.25rem", marginTop: 0 }}>
    Verify any PSA graded card by entering the cert number from the label.
  </p>
  <div style={{ background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "1.5rem" }}>
    <div style={{ display: "flex", gap: "10px", marginBottom: "1.25rem", flexWrap: "wrap" as const }}>
      <input
        type="text"
        placeholder="Enter PSA cert number e.g. 12345678"
        value={certNumber}
        onChange={e => setCertNumber(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleCertCheck()}
        style={{ flex: 1, minWidth: "200px", background: "#faf7f0", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "10px 14px", color: "#1a1a1a", fontSize: "14px", outline: "none" }}
      />
      <button onClick={handleCertCheck} disabled={certLoading}
        style={{ background: "#3aaa35", color: "#faf7f0", fontWeight: 700, fontSize: "13px", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer" }}>
        {certLoading ? 'Checking...' : 'Verify Cert'}
      </button>
    </div>
    {certError && (
      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "rgba(239,68,68,0.8)", marginBottom: "1rem" }}>
        {certError}
      </div>
    )}
    {certResult && (
      <div style={{ background: "#faf7f0", borderRadius: "10px", padding: "1.25rem", border: "1px solid #e0d9cc" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
          {[
            { label: "Card", value: certResult.PSACert?.Subject || 'N/A' },
            { label: "Year", value: certResult.PSACert?.Year || 'N/A' },
            { label: "Brand", value: certResult.PSACert?.Brand || 'N/A' },
            { label: "Grade", value: certResult.PSACert?.CardGrade || 'N/A' },
            { label: "Cert Number", value: certResult.PSACert?.CertNumber || 'N/A' },
            { label: "Card Number", value: certResult.PSACert?.CardNumber || 'N/A' },
            { label: "Variety", value: certResult.PSACert?.Variety || 'N/A' },
{ label: "Population", value: certResult.PSACert?.TotalPopulation ? `${certResult.PSACert.TotalPopulation} graded` : 'N/A' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "4px" }}>{item.label}</div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#1a1a1a" }}>{item.value}</div>
            </div>
          ))}
        </div>
        {certResult.PSACert?.CardGrade && (
  <div style={{ marginTop: "1rem", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" as const }}>
    <div style={{ display: "inline-block", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.3)", borderRadius: "8px", padding: "8px 16px" }}>
      <span style={{ fontSize: "13px", color: "#3aaa35", fontWeight: 700 }}>✓ Verified PSA {certResult.PSACert.PSAGrade}</span>
    </div>
    <a href={`https://www.psacard.com/cert/${certResult.PSACert.CertNumber}`} target="_blank" rel="noopener noreferrer"
      style={{ fontSize: "12px", color: "#888", textDecoration: "none" }}>
      View on PSA →
    </a>
  </div>
)}
      </div>
    )}
  </div>
</div>

    </main>
  );
}
export default function Home() {
  return (
    <Suspense fallback={<main style={{ background: "#faf7f0", minHeight: "100vh" }} />}>
      <HomeContent />
    </Suspense>
  );
}