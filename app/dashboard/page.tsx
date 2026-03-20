'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    getUser();
  }, []);

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
            { label: "Saved Cards", value: "0", desc: "Cards in your watchlist" },
            { label: "Price Alerts", value: "0", desc: "Active alerts" },
            { label: "Searches", value: "0", desc: "Total searches made" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.25rem" }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "0.5rem" }}>{stat.label}</div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#f0b429", marginBottom: "0.25rem" }}>{stat.value}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* Coming Soon Features */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 1rem", letterSpacing: "-0.3px" }}>Coming Soon</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { title: "Saved Cards", desc: "Save cards from search results and track their prices", icon: "🔖" },
              { title: "Price Alerts", desc: "Get notified when a card drops below your target price", icon: "🔔" },
              { title: "Portfolio Tracker", desc: "Track the total value of your card collection", icon: "📈" },
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

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ display: "inline-block", background: "#f0b429", color: "#080c10", fontWeight: 700, fontSize: "14px", padding: "12px 24px", borderRadius: "8px", textDecoration: "none" }}>
            Start Searching Cards →
          </Link>
        </div>

      </div>
    </main>
  );
}