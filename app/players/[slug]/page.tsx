'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Nav from '../../../components/Nav';
import Link from 'next/link';

export default function PlayerPage() {
  const params = useParams();
  const slug = params.slug as string;
  const playerName = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgPrice, setAvgPrice] = useState(0);
  const [highPrice, setHighPrice] = useState(0);
  const [lowPrice, setLowPrice] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(playerName + ' card')}`);
      const data = await res.json();
      const items = data.items || [];
      setResults(items);

      const prices = items
        .filter((item: any) => item.price?.value)
        .map((item: any) => parseFloat(item.price.value));

      if (prices.length > 0) {
        setAvgPrice(prices.reduce((a: number, b: number) => a + b, 0) / prices.length);
        setHighPrice(Math.max(...prices));
        setLowPrice(Math.min(...prices));
      }
      setLoading(false);
    };
    fetchCards();
  }, [slug]);

  return (
    <main style={{ background: "#080c10", minHeight: "100vh", color: "#ffffff", fontFamily: "var(--font-dm-sans)" }}>
      <Nav />

      <div style={{ padding: "2.5rem 1.25rem", maxWidth: "960px", margin: "0 auto" }}>

        {/* Back */}
        <Link href="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>← Back to search</Link>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "inline-block", background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.25)", color: "#f0b429", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
            Player Price Guide
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, margin: "0 0 0.5rem", letterSpacing: "-1px" }}>
            {playerName}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
            Real eBay UK prices for {playerName} trading cards
          </p>
        </div>

        {/* Price Stats */}
        {!loading && results.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "2.5rem" }}>
            {[
              { label: "Average Price", value: `£${avgPrice.toFixed(2)}` },
              { label: "Highest Price", value: `£${highPrice.toFixed(2)}` },
              { label: "Lowest Price", value: `£${lowPrice.toFixed(2)}` },
              { label: "Listings Found", value: results.length.toString() },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.25rem" }}>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "0.5rem" }}>{stat.label}</div>
                <div style={{ fontSize: "26px", fontWeight: 700, color: "#f0b429" }}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Current Listings</h2>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Live from eBay UK</span>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "3rem 0" }}>Loading {playerName} cards...</div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "3rem 0" }}>No listings found for {playerName}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {results.map((item: any) => (
                <div key={item.itemId} style={{ display: "flex", gap: "1rem", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1rem 1.25rem" }}>
                  {item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl ? (
                    <img
                      src={item.thumbnailImages?.[0]?.imageUrl || item.image?.imageUrl}
                      alt={item.title}
                      style={{ width: "70px", height: "70px", objectFit: "contain", borderRadius: "6px", background: "rgba(255,255,255,0.05)", flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: "70px", height: "70px", background: "rgba(255,255,255,0.06)", borderRadius: "6px", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: "14px", color: "#fff", marginBottom: "4px", lineHeight: 1.4 }}>{item.title}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{item.condition || 'Condition not specified'}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "20px", color: "#f0b429", marginBottom: "6px" }}>
                      {item.price ? `${item.price.currency === 'GBP' ? '£' : '$'}${parseFloat(item.price.value).toFixed(2)}` : 'N/A'}
                    </div>
                    <a href={item.itemWebUrl} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", textDecoration: "none" }}>View on eBay →</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}