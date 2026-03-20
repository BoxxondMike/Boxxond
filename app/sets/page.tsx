'use client';
import Link from 'next/link';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const set = sets[slug];
  if (!set) return {};
  return {
    title: `${set.name} Football Cards | Prices, Parallels & Guide | Boxxond`,
    description: `Everything you need to know about ${set.name}. Prices, parallels, print runs and collector tips. Real sold prices from eBay UK.`,
  };
}
const sets = [
  {
    slug: 'topps-chrome',
    name: 'Topps Chrome',
    year: '2019–Present',
    manufacturer: 'Topps',
    description: 'The most prestigious football card set in the hobby. Known for its iconic chromium finish and highly sought after autographs and refractors.',
    difficulty: 'Premium',
    tags: ['Refractors', 'Autos', 'Rookie Cards'],
  },
  {
    slug: 'panini-prizm-epl',
    name: 'Panini Prizm EPL',
    year: '2019–Present',
    manufacturer: 'Panini',
    description: 'Panini\'s flagship Premier League set. Famous for its Silver Prizm parallels and coloured refractors. One of the most collected EPL sets worldwide.',
    difficulty: 'Premium',
    tags: ['Prizms', 'Silver', 'Parallels'],
  },
  {
    slug: 'topps-match-attax',
    name: 'Topps Match Attax',
    year: '2007–Present',
    manufacturer: 'Topps',
    description: 'The gateway set for millions of collectors. A household name in UK football cards with affordable packs and a huge player selection across all top leagues.',
    difficulty: 'Beginner',
    tags: ['Affordable', 'EPL', 'Beginner Friendly'],
  },
  {
    slug: 'merlin',
    name: 'Merlin',
    year: '1991–Present',
    manufacturer: 'Topps',
    description: 'A British institution. Merlin sticker collections have been a staple of UK football culture for decades, with modern versions now featuring premium cards.',
    difficulty: 'Beginner',
    tags: ['Stickers', 'Classic', 'UK'],
  },
  {
    slug: 'topps-stadium-club',
    name: 'Topps Stadium Club',
    year: '2021–Present',
    manufacturer: 'Topps',
    description: 'Known for its stunning photography and clean design. Stadium Club is a favourite among collectors who appreciate artistry alongside the hobby.',
    difficulty: 'Mid Range',
    tags: ['Photography', 'Clean Design', 'Autos'],
  },
  {
    slug: 'panini-select',
    name: 'Panini Select',
    year: '2020–Present',
    manufacturer: 'Panini',
    description: 'Three tier design featuring Concourse, Premier and Courtside levels. Select is known for its bold colourful parallels and strong rookie card market.',
    difficulty: 'Mid Range',
    tags: ['Tiered', 'Parallels', 'Rookies'],
  },
];

const difficultyColour: Record<string, string> = {
  'Beginner': 'rgba(34,197,94,0.15)',
  'Mid Range': 'rgba(240,180,41,0.15)',
  'Premium': 'rgba(239,68,68,0.15)',
};

const difficultyText: Record<string, string> = {
  'Beginner': '#22c55e',
  'Mid Range': '#f0b429',
  'Premium': '#ef4444',
};

export default function SetsPage() {
  return (
    <main style={{ background: "#080c10", minHeight: "100vh", color: "#ffffff", fontFamily: "var(--font-dm-sans)" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "24px", letterSpacing: "-1px", color: "#fff", textDecoration: "none" }}>
          boxx<span style={{ color: "#f0b429" }}>ond</span>
        </Link>
        <div style={{ display: "flex", gap: "2rem", fontSize: "14px" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Prices</Link>
          <Link href="/sets" style={{ color: "#f0b429", textDecoration: "none" }}>Sets</Link>
          <Link href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Breaks</Link>
        </div>
        <button style={{ background: "#f0b429", color: "#080c10", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "13px", padding: "10px 22px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Sign Up Free
        </button>
      </nav>

      {/* Header */}
      <div style={{ padding: "3rem 2rem 2rem", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.25)", color: "#f0b429", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1rem", letterSpacing: "1px", textTransform: "uppercase" }}>
          Card Set Guide
        </div>
        <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-1.5px", margin: "0 0 1rem", lineHeight: 1.05 }}>
          Know your <span style={{ color: "#f0b429" }}>sets</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", lineHeight: 1.6, maxWidth: "500px", margin: 0 }}>
          From beginner sticker collections to premium chrome refractors — everything you need to know about the main football card sets.
        </p>
      </div>

      {/* Sets Grid */}
      <div style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {sets.map((set) => (
          <Link key={set.slug} href={`/sets/${set.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.5rem", height: "100%", transition: "border-color 0.2s", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(240,180,41,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>

              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{set.manufacturer}</span>
                <span style={{ background: difficultyColour[set.difficulty], color: difficultyText[set.difficulty], fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 500 }}>{set.difficulty}</span>
              </div>

              {/* Name */}
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "18px", color: "#fff", marginBottom: "0.5rem", letterSpacing: "-0.3px" }}>{set.name}</div>
              <div style={{ fontSize: "12px", color: "#f0b429", marginBottom: "0.75rem" }}>{set.year}</div>

              {/* Description */}
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "1rem" }}>{set.description}</div>

              {/* Tags */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {set.tags.map(tag => (
                  <span key={tag} style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontSize: "10px", padding: "3px 8px", borderRadius: "4px" }}>{tag}</span>
                ))}
              </div>

              {/* Read more */}
              <div style={{ marginTop: "1rem", fontSize: "12px", color: "#f0b429" }}>Learn more →</div>
            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}