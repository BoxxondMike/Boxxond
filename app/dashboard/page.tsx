'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const router = useRouter();

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
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleUnsave = async (itemId: string) => {
    await supabase.from('saved_cards').delete().eq('item_id', itemId);
    setSavedCards(savedCards.filter((c: any) => c.item_id !== itemId));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <main style={{ background: "#080c10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Loading...</div>
      </main>
    );
  }

  return (
    <main style={{ background: "#080c10", minHeight: "100vh", color: "#ffffff", fontFamily: "var(--font-dm-sans)" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", letterSpacing: "-1px", color: "#fff", textDecoration: "none" }}>
          boxx<span style={{ color: "#f0b429" }}>ond</span>
        </Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Back to site</Link>
          <button onClick={handleSignOut} style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontSize: "13px", padding: "8px 16px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ padding: "2.5rem 1.25rem", maxWidth: "960px", margin: "0 auto" }}>

        {/* Welcome */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-block", background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.25)", color: "#f0b429", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
            Dashboard
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 0.5rem", letterSpacing: "-0.5px" }}>
            Welcome back 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>{user?.email}</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "2.5rem" }}>
          {[
            { label: "Saved Cards", value: savedCards.length.toString(), desc: "Cards in your watchlist" },
            { label: "Price Alerts", value: "0", desc: "Active alerts — coming soon" },
            { label: "Portfolio Value", value: savedCards.length > 0 ? `£${savedCards.reduce((sum: number, c: any) => sum + (c.price || 0), 0).toFixed(2)}` : "£0", desc: "Total value of saved cards" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.25rem" }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "0.5rem" }}>{stat.label}</div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#f0b429", marginBottom: "0.25rem" }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* Saved Cards */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>Saved Cards</h2>
            <Link href="/" style={{ fontSize: "13px", color: "#f0b429", textDecoration: "none" }}>+ Add more</Link>
          </div>

          {savedCards.length === 0 ? (
            <div style={{ textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "3rem" }}>
              <div style={{ fontSize: "32px", marginBottom: "1rem" }}>☆</div>
              <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "0.5rem" }}>No saved cards yet</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>Search for a card and hit Save to add it here</div>
              <Link href="/" style={{ background: "#f0b429", color: "#080c10", fontWeight: 700, fontSize: "13px", padding: "10px 20px", borderRadius: "6px", textDecoration: "none" }}>
                Start Searching
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {savedCards.map((card: any) => (
                <div key={card.id} style={{ display: "flex", gap: "1rem", alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1rem 1.25rem" }}>
                  {card.image_url && (
                    <img src={card.image_url} alt={card.title} style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "6px", background: "rgba(255,255,255,0.05)", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: "13px", color: "#fff", marginBottom: "4px", lineHeight: 1.4 }}>{card.title}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Saved {new Date(card.created_at).toLocaleDateString('en-GB')}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "18px", color: "#f0b429", marginBottom: "6px" }}>
                      {card.price ? `£${card.price.toFixed(2)}` : 'N/A'}
                    </div>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <a href={card.item_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>View →</a>
                      <button onClick={() => handleUnsave(card.item_id)} style={{ fontSize: "11px", color: "rgba(239,68,68,0.6)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 1rem", letterSpacing: "-0.3px" }}>Coming Soon</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { title: "Price Alerts", desc: "Get notified when a card drops below your target price", icon: "🔔" },
              { title: "Portfolio Tracker", desc: "Track the total value of your card collection over time", icon: "📈" },
            ].map((feature) => (
              <div key={feature.title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                <span style={{ fontSize: "20px" }}>{feature.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "3px" }}>{feature.title}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{feature.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", background: "rgba(240,180,41,0.1)", color: "#f0b429", fontSize: "10px", padding: "3px 8px", borderRadius: "4px", fontWeight: 500, whiteSpace: "nowrap" as const }}>Coming Soon</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}