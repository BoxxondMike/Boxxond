'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.items || []);
    setLoading(false);
  };

  return (
    <main style={{ background: "#080c10", minHeight: "100vh", color: "#ffffff", fontFamily: "var(--font-dm-sans)" }}>

      <style>{`
        .nav-links { display: flex; gap: 2rem; }
        .result-card { display: flex; gap: 1.5rem; align-items: center; }
        .result-image { width: 90px; height: 90px; flex-shrink: 0; }
        .result-price { text-align: right; flex-shrink: 0; }
        .stats-bar { display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap; }
        .hero-title { font-size: clamp(36px, 7vw, 68px); }
        .nav-btn { display: block; }
        @media (max-width: 640px) {
          .nav-links { display: none; }
          .nav-btn { display: block; }
          .result-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .result-image { width: 100%; height: 200px; object-fit: contain; }
          .result-price { text-align: left; width: 100%; display: flex; justify-content: space-between; align-items: center; }
          .stats-bar { gap: 1.5rem; }
          .hero-title { font-size: clamp(32px, 9vw, 52px) !important; letter-spacing: -1px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", letterSpacing: "-1px", color: "#fff", textDecoration: "none" }}>
          boxx<span style={{ color: "#f0b429" }}>ond</span>
        </Link>
        <div className="nav-links" style={{ fontSize: "14px" }}>
          <Link href="/" style={{ color: "#f0b429", textDecoration: "none" }}>Prices</Link>
          <Link href="/sets" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Sets</Link>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Breaks</a>
        </div>
        <button className="nav-btn" style={{ background: "#f0b429", color: "#080c10", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "13px", padding: "8px 16px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Sign Up
        </button>
      </nav>

      {/* Hero */}
      <div style={{ padding: "3rem 1.25rem 2.5rem", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.25)", color: "#f0b429", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1.5rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
          Football Card Price Tracker
        </div>
        <h1 className="hero-title" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, lineHeight: 1.05, margin: "0 0 1.25rem", letterSpacing: "-2px" }}>
          Know what your<br /><span style={{ color: "#f0b429" }}>cards are worth</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 2rem" }}>
          Real sold prices from eBay. No guesswork. Track players, sets and box values across the entire UK market.
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
          <button onClick={handleSearch} style={{ background: "#f0b429", border: "none", color: "#080c10", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "13px", padding: "0 18px", cursor: "pointer", whiteSpace: "nowrap" as const }}>
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar" style={{ padding: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {[["2.4M+", "Sales tracked"], ["48hrs", "Data refresh"], ["£0", "Free to use"], ["12K+", "Cards indexed"]].map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", letterSpacing: "-1px", display: "block" }}>{num}</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Results */}
      <div style={{ padding: "2rem 1.25rem", maxWidth: "960px", margin: "0 auto" }}>
        {results.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "17px" }}>Search Results</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{results.length} results</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {results.map((item: any) => (
                <div key={item.itemId} className="result-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1rem 1.25rem" }}>
                  
                  {/* Image */}
                  <div style={{ flexShrink: 0 }}>
                    {item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl ? (
                      <img
                        src={item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl}
                        alt={item.title}
                        className="result-image"
                        style={{ objectFit: "contain", borderRadius: "8px", background: "rgba(255,255,255,0.05)" }}
                      />
                    ) : (
                      <div className="result-image" style={{ background: "rgba(255,255,255,0.06)", borderRadius: "8px" }} />
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: "14px", color: "#fff", marginBottom: "6px", lineHeight: 1.4 }}>{item.title}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{item.condition || 'Condition not specified'}</div>
                  </div>

                  {/* Price + Link */}
                  <div className="result-price">
                    <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", color: "#f0b429", letterSpacing: "-1px", marginBottom: "8px" }}>
                      {item.price ? `${item.price.currency === 'GBP' ? '£' : '$'}${parseFloat(item.price.value).toFixed(2)}` : 'N/A'}
                    </div>
                    <a href={item.itemWebUrl} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textDecoration: "none" }}>
                      View on eBay →
                    </a>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}

        {results.length === 0 && !loading && (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", paddingTop: "2rem", fontSize: "15px" }}>
            Search for a player or card above to see real eBay prices
          </div>
        )}
      </div>

    </main>
  );
}