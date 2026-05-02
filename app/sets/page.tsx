'use client';

import Nav from '../../components/Nav';
import Link from 'next/link';
import { cardSets, getSportsList, getSetsBySport, type CardSet } from '../../lib/sets';

const difficultyColour: Record<string, string> = {
  'Beginner': 'rgba(34,197,94,0.15)',
  'Mid Range': 'rgba(58,170,53,0.15)',
  'Premium': 'rgba(239,68,68,0.15)',
};

const difficultyText: Record<string, string> = {
  'Beginner': '#22c55e',
  'Mid Range': '#3aaa35',
  'Premium': '#ef4444',
};

const featuredConfig: { slug: string; label: string; color: string }[] = [
  { slug: 'donruss-road-to-world-cup', label: '🌍 World Cup', color: '#3aaa35' },
  { slug: 'topps-finest-premier-league-2026', label: '⚡ Out Now', color: '#3aaa35' },
  { slug: 'topps-chrome-ucc-2526', label: '⚡ New Release', color: '#3aaa35' },
  { slug: 'topps-nfl', label: '🔥 Coming Soon', color: '#f59e0b' },
];

export default function SetsPage() {
  const sports = getSportsList();

  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>

      <Nav activePage="sets" />

      <div style={{ padding: "3rem 2rem 2rem", maxWidth: "960px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-1.5px", margin: "0 0 1rem", lineHeight: 1.05 }}>
          Sets &<span style={{ color: "#1F6F3A" }}> New releases</span>
        </h1>
        <p style={{ color: "#666", fontSize: "16px", lineHeight: 1.6, maxWidth: "850px", margin: 0 }}>
          From beginner collections to premium chrome refractors. Browse the main soccer, basketball, baseball and NFL card sets,
          plus information on new releases. Looking for a checklist? Visit our <Link href="/checklists" style={{ color: "#1F6F3A", fontWeight: 600, textDecoration: "underline" }}>Checklists hub</Link>.
        </p>
      </div>

      {/* Featured Sets */}
      <div style={{ padding: "0 2rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "22px", letterSpacing: "-0.5px", margin: 0 }}>Featured Sets</h2>
          <div style={{ flex: 1, height: "1px", background: "#f0ede6" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", alignItems: "stretch" }}>
          {featuredConfig.map(({ slug, label, color }) => {
            const set = cardSets.find(s => s.slug === slug);
            if (!set) return null;
            return (
              <Link key={slug} href={`/sets/${slug}`} style={{ textDecoration: "none" }}>
                <div
                  style={{ background: "#ffffff", border: `1px solid ${color === '#f59e0b' ? 'rgba(251,191,36,0.3)' : 'rgba(58,170,53,0.3)'}`, borderRadius: "12px", padding: "1.5rem", cursor: "pointer", position: "relative" as const, height: "100%", boxSizing: "border-box" as const, display: "flex", flexDirection: "column" as const }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = color === '#f59e0b' ? 'rgba(251,191,36,0.3)' : 'rgba(58,170,53,0.3)')}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: "17px", color: "#1a1a1a", marginBottom: "4px", letterSpacing: "-0.3px" }}>{set.name}</div>
                  <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.5, marginBottom: "12px", flex: 1 }}>{set.shortDescription?.slice(0, 80)}...</div>
                  <div style={{ fontSize: "12px", color, fontWeight: 600, marginTop: "auto" }}>View Set →</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sets by sport */}
      {sports.map(sport => {
        const sets = getSetsBySport(sport);
        if (sets.length === 0) return null;
        return (
          <div key={sport} style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "22px", letterSpacing: "-0.5px", margin: 0 }}>{sport}</h2>
              <div style={{ flex: 1, height: "1px", background: "#f0ede6" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
              {sets.map((set: CardSet) => (
                <Link key={set.slug} href={`/sets/${set.slug}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{ background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: "12px", padding: "1.5rem", height: "100%", cursor: "pointer", boxSizing: "border-box" as const, display: "flex", flexDirection: "column" as const }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(58,170,53,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#e0d9cc')}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" }}>{set.manufacturer}</span>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {set.status === 'new' && (
                          <span style={{ background: "rgba(58,170,53,0.15)", color: "#3aaa35", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>NEW</span>
                        )}
                        {set.status === 'coming-soon' && (
                          <span style={{ background: "rgba(251,191,36,0.15)", color: "#f59e0b", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>COMING SOON</span>
                        )}
                        {set.status === 'previous' && (
                          <span style={{ background: "rgba(150,150,150,0.15)", color: "#888", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>PREVIOUS</span>
                        )}
                        <span style={{ background: difficultyColour[set.difficulty], color: difficultyText[set.difficulty], fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 500 }}>{set.difficulty}</span>
                      </div>
                    </div>
                    <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "18px", color: "#1a1a1a", marginBottom: "0.5rem", letterSpacing: "-0.3px" }}>{set.name}</div>
                    <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, marginBottom: "1rem", flex: 1 }}>{set.shortDescription}</div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, marginBottom: "0.75rem" }}>
                      {set.tags.map(tag => (
                        <span key={tag} style={{ background: "rgba(255,255,255,0.05)", color: "#888", fontSize: "10px", padding: "3px 8px", borderRadius: "4px" }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: "12px", color: "#3aaa35", marginTop: "auto" }}>Learn more →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

    </main>
  );
}