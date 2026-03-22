'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Nav from '../../../components/Nav';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function PlayerPage() {
  const params = useParams();
  const slug = params.slug as string;
  const playerName = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  const [results, setResults] = useState<any[]>([]);
  const [sortedResults, setSortedResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgPrice, setAvgPrice] = useState(0);
  const [highPrice, setHighPrice] = useState(0);
  const [lowPrice, setLowPrice] = useState(0);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'high' | 'low'>('high');

  useEffect(() => {
    const fetchCards = async () => {
     const res = await fetch(`/api/search?q=${encodeURIComponent(playerName)}&sort=${sortOrder === 'high' ? 'price' : 'endingSoonest'}&playerSearch=true`);
      const data = await res.json();
      const items = data.items || [];
      setResults(items);

      const prices = items
        .filter((item: any) => item.price?.value)
        .map((item: any) => parseFloat(item.price.value));

      if (prices.length > 0) {
        const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
        setAvgPrice(avg);
        setHighPrice(Math.max(...prices));
        setLowPrice(Math.min(...prices));

        await supabase.from('price_history').insert({
          search_term: playerName.toLowerCase(),
          avg_price: parseFloat(avg.toFixed(2)),
          listing_count: items.length,
        });
      }

      const { data: historyData } = await supabase
        .from('price_history')
        .select('*')
        .eq('search_term', playerName.toLowerCase())
        .order('recorded_at', { ascending: true })
        .limit(30);

      if (historyData) {
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
    setSortedResults(sorted);
  }, [results, sortOrder]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "#0f1419", border: "1px solid rgba(240,180,41,0.3)", borderRadius: "8px", padding: "8px 12px" }}>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>{label}</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#f0b429" }}>£{payload[0].value.toFixed(2)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <main style={{ background: "#080c10", minHeight: "100vh", color: "#ffffff", fontFamily: "var(--font-dm-sans)" }}>
      <Nav />

      <div style={{ padding: "2.5rem 1.25rem", maxWidth: "960px", margin: "0 auto" }}>

        <Link href="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>← Back to search</Link>

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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "2rem" }}>
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

        {/* Price History Chart */}
        {priceHistory.length > 1 && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 1.5rem" }}>Price History</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `£${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="price" stroke="#f0b429" strokeWidth={2} dot={{ fill: "#f0b429", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Results */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap" as const, gap: "10px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Current Listings</h2>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Sort:</span>
              {[['high', 'High to Low'], ['low', 'Low to High']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setSortOrder(val as 'high' | 'low')}
                  style={{
                    background: sortOrder === val ? "#f0b429" : "rgba(255,255,255,0.05)",
                    color: sortOrder === val ? "#080c10" : "rgba(255,255,255,0.5)",
                    border: `1px solid ${sortOrder === val ? "#f0b429" : "rgba(255,255,255,0.1)"}`,
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
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "3rem 0" }}>Loading {playerName} cards...</div>
          ) : sortedResults.length === 0 ? (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "3rem 0" }}>No listings found for {playerName}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {sortedResults.map((item: any) => (
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