import React from 'react';
import Nav from '../../components/Nav';

export default function BreaksPage() {
  return (
    <main style={{ background: "#080c10", minHeight: "100vh", color: "#ffffff", fontFamily: "var(--font-dm-sans)" }}>
      <Nav activePage="breaks" />

      {/* Hero */}
      <div style={{ padding: "3rem 1.25rem 2.5rem", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.25)", color: "#f0b429", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1.5rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
          Live Breaks
        </div>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.05, margin: "0 0 1.25rem", letterSpacing: "-2px" }}>
          Watch live <span style={{ color: "#f0b429" }}>card breaks</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto" }}>
          The best UK card breakers all in one place. Watch live breaks, grab spots and add cards to your collection.
        </p>
      </div>

      <div style={{ padding: "0 1.25rem 3rem", maxWidth: "960px", margin: "0 auto" }}>

        {/* What is a break */}
        <div style={{ background: "rgba(240,180,41,0.06)", border: "1px solid rgba(240,180,41,0.15)", borderRadius: "12px", padding: "1.5rem 2rem", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 0.75rem", color: "#f0b429" }}>What is a card break?</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>
            A card break is where a breaker opens boxes of trading cards live on stream. Collectors buy spots representing a team or player — any cards pulled for their spot are theirs to keep. It's a fun, affordable way to get cards from premium boxes without buying the whole box yourself.
          </p>
        </div>

        {/* Featured Breakers */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Featured Breakers</h2>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>UK verified</span>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "1rem" }}>🎴</div>
          <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "0.5rem" }}>Breakers coming soon</div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>We're curating the best UK card breakers — check back soon</div>
        </div>

      </div>
    </main>
  );
}