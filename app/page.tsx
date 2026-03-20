'use client';
import Nav from '../components/Nav';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const featuredQueries = [
  'Jude Bellingham Topps Chrome',
  'Cole Palmer Prizm',
  'Bukayo Saka card',
  'LeBron James Prizm',
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSales, setRecentSales] = useState([]);
  const [featuredCards, setFeaturedCards] = useState([]);
  const [activeTab, setActiveTab] = useState('recent');

  useEffect(() => {
    fetchRecentSales();
    fetchFeaturedCards();
  }, []);

  const fetchRecentSales = async () => {
    const res = await fetch('/api/search?q=Topps+Chrome+football+card&featured=true');
    const data = await res.json();
    setRecentSales(data.items?.slice(0, 4) || []);
  };

  const fetchFeaturedCards = async () => {
    const randomQuery = featuredQueries[Math.floor(Math.random() * featuredQueries.length)];
    const res = await fetch(`/api/search?q=${encodeURIComponent(randomQuery)}&featured=true`);
    const data = await res.json();
    setFeaturedCards(data.items?.slice(0, 4) || []);
  };

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.items || []);
    setLoading(false);
  };

  const CardGrid = ({ items }: { items: any[] }) => (
  <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" }}>
    {items.map((item: any) => (
      <a key={item.itemId} href={item.itemWebUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flexShrink: 0, width: "200px" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1rem", cursor: "pointer" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(240,180,41,0.3)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
          {item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl ? (
            <img
              src={item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl}
              alt={item.title}
              style={{ width: "100%", height: "160px", objectFit: "contain", borderRadius: "6px", background: "rgba(255,255,255,0.05)", marginBottom: "10px" }}
            />
          ) : (
            <div style={{ width: "100%", height: "160px", background: "rgba(255,255,255,0.06)", borderRadius: "6px", marginBottom: "10px" }} />
          )}
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "8px", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</div>
          <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "18px", color: "#f0b429", letterSpacing: "0px" }}>
            {item.price ? `${item.price.currency === 'GBP' ? '£' : '$'}${parseFloat(item.price.value).toFixed(2)}` : 'N/A'}
          </div>
        </div>
      </a>
    ))}
  </div>
);

  return (
    <main style={{ background: "#080c10", minHeight: "100vh", color: "#ffffff", fontFamily: "var(--font-dm-sans)" }}>

      <style>{`
        .nav-links { display: flex; gap: 2rem; }
        .result-card { display: flex; gap: 1.5rem; align-items: center; }
        .result-image { width: 90px; height: 90px; flex-shrink: 0; }
        .result-price { text-align: right; flex-shrink: 0; }
        .stats-bar { display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .nav-links { display: none; }
          .result-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .result-image { width: 100% !important; height: 200px !important; }
          .result-price { text-align: left; width: 100%; display: flex; justify-content: space-between; align-items: center; }
          .stats-bar { gap: 1.5rem; }
        }
      `}</style>

   <Nav activePage="prices" />

      {/* Hero */}
      <div style={{ padding: "3rem 1.25rem 2.5rem", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.25)", color: "#f0b429", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1.5rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
          Trading Card Price Tracker
        </div>
        <h1 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "clamp(36px, 7vw, 68px)", lineHeight: 1.05, margin: "0 0 1.25rem", letterSpacing: "-2px" }}>
          Know what your<br /><span style={{ color: "#f0b429" }}>cards are worth</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 2rem" }}>
          Real sold prices from eBay. No guesswork. Track players, sets and box values across soccer, basketball, baseball and NFL.
        </p>
        <div style={{ display: "flex", maxWidth: "520px", margin: "0 auto", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" }}>
          <input
            type="text"
            placeholder="Search player, set or card..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "15px", padding: "14px 16px" }}
          />
          <button onClick={handleSearch} style={{ background: "#f0b429", border: "none", color: "#080c10", fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "13px", padding: "0 18px", cursor: "pointer", whiteSpace: "nowrap" as const }}>
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar" style={{ padding: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {[["eBay UK", "Live Data"], ["Free", "To Use"], ["Football Cards", "UK Market"], ["Daily", "Updated"]].map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px", display: "block" }}>{num}</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div style={{ padding: "2rem 1.25rem", maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "17px" }}>Search Results</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{results.length} results</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {results.map((item: any) => (
              <div key={item.itemId} className="result-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1rem 1.25rem" }}>
                <div style={{ flexShrink: 0 }}>
                  {item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl ? (
                    <img src={item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl} alt={item.title} className="result-image" style={{ objectFit: "contain", borderRadius: "8px", background: "rgba(255,255,255,0.05)" }} />
                  ) : (
                    <div className="result-image" style={{ background: "rgba(255,255,255,0.06)", borderRadius: "8px" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: "14px", color: "#fff", marginBottom: "6px", lineHeight: 1.4 }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{item.condition || 'Condition not specified'}</div>
                </div>
                <div className="result-price">
                  <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "22px", color: "#f0b429", letterSpacing: "-1px", marginBottom: "8px" }}>
                    {item.price ? `${item.price.currency === 'GBP' ? '£' : '$'}${parseFloat(item.price.value).toFixed(2)}` : 'N/A'}
                  </div>
                  <a href={item.itemWebUrl} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textDecoration: "none" }}>View on eBay →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Section */}
      <div style={{ padding: "2rem 1.25rem", maxWidth: "960px", margin: "0 auto" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "1.5rem", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "4px", width: "fit-content" }}>
          {[['recent', 'Recent Sales'], ['featured', 'Featured Cards']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? "#f0b429" : "transparent", color: activeTab === tab ? "#080c10" : "rgba(255,255,255,0.5)", fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "13px", padding: "8px 18px", border: "none", borderRadius: "7px", cursor: "pointer", transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'recent' && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "17px" }}>Recent Sales</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Live from eBay UK</span>
            </div>
            {recentSales.length > 0 ? <CardGrid items={recentSales} /> : (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "2rem 0" }}>Loading...</div>
            )}
          </>
        )}

        {activeTab === 'featured' && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "17px" }}>Featured Cards</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Hand picked for you</span>
            </div>
            {featuredCards.length > 0 ? <CardGrid items={featuredCards} /> : (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "2rem 0" }}>Loading...</div>
            )}
          </>
        )}

      </div>

    </main>
  );
}