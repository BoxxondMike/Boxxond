import React from 'react';
import Nav from '../../components/Nav';

export default function BreaksPage() {
  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>
      <Nav activePage="breaks" />

      {/* Hero */}
      <div style={{ padding: "3rem 1.25rem 2.5rem", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", color: "#3aaa35", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1.5rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
          Live Breaks
        </div>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.05, margin: "0 0 1.25rem", letterSpacing: "-2px" }}>
          Watch live <span style={{ color: "#3aaa35" }}>card breaks</span>
        </h1>
        <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto" }}>
          The best UK card breakers all in one place. Watch live breaks, grab spots and add cards to your collection.
        </p>
      </div>

      <div style={{ padding: "0 1.25rem 3rem", maxWidth: "960px", margin: "0 auto" }}>

        {/* Featured Breakers */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Featured Breakers</h2>
          <span style={{ fontSize: "12px", color: "#aaa" }}>UK verified</span>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #f0ede6", borderRadius: "12px", padding: "3rem", textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "32px", marginBottom: "1rem" }}>🎴</div>
          <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "0.5rem" }}>Breakers coming soon</div>
          <div style={{ fontSize: "13px", color: "#888)" }}>We're curating the best UK card breakers — check back soon</div>
        </div>

        {/* What is a break */}
        <div style={{ background: "rgba(58,170,53,0.06)", border: "1px solid rgba(58,170,53,0.15)", borderRadius: "12px", padding: "1.5rem 2rem" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 0.75rem", color: "#3aaa35" }}>What is a card break?</h2>
          <p style={{ fontSize: "14px", color: "#888)", lineHeight: 1.7, margin: 0 }}>
            A card break is where a breaker opens boxes of trading cards live on stream. Collectors buy spots representing a team or player. Any cards pulled for their spot are theirs to keep. It's a fun, affordable way to chase the hits.
          </p>
        </div>

      </div>
    </main>
  );
}