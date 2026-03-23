'use client';

import Nav from '../../components/Nav';
import Link from 'next/link';

const sports = [
  {
    name: 'Soccer',
    sets: [
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
        description: 'Panini\'s flagship Premier League set. Famous for its Silver Prizm parallels and coloured refractors.',
        difficulty: 'Premium',
        tags: ['Prizms', 'Silver', 'Parallels'],
      },
      {
        slug: 'topps-match-attax',
        name: 'Topps Match Attax',
        year: '2007–Present',
        manufacturer: 'Topps',
        description: 'The gateway set for millions of collectors. Affordable packs and a huge player selection.',
        difficulty: 'Beginner',
        tags: ['Affordable', 'EPL', 'Beginner Friendly'],
      },
      {
        slug: 'merlin',
        name: 'Merlin',
        year: '1991–Present',
        manufacturer: 'Topps',
        description: 'A British institution. Merlin sticker collections have been a staple of UK football culture for decades.',
        difficulty: 'Beginner',
        tags: ['Stickers', 'Classic', 'UK'],
      },
      {
        slug: 'topps-stadium-club',
        name: 'Topps Stadium Club',
        year: '2021–Present',
        manufacturer: 'Topps',
        description: 'Known for its stunning photography and clean design. A favourite among collectors who appreciate artistry.',
        difficulty: 'Mid Range',
        tags: ['Photography', 'Clean Design', 'Autos'],
      },
      {
        slug: 'panini-select',
        name: 'Panini Select',
        year: '2020–Present',
        manufacturer: 'Panini',
        description: 'Three tier design featuring Concourse, Premier and Courtside levels with bold colourful parallels.',
        difficulty: 'Mid Range',
        tags: ['Tiered', 'Parallels', 'Rookies'],
      },
      {
  slug: 'topps-chrome-sapphire',
  name: 'Topps Chrome Sapphire',
  year: '2018–Present',
  manufacturer: 'Topps',
  description: 'The ultra premium edition of Topps Chrome. Limited print run with stunning sapphire blue refractor finish. One of the most sought after sets in the hobby.',
  difficulty: 'Premium',
  tags: ['Sapphire', 'Limited', 'Ultra Premium'],
},
{
  slug: 'topps-ucl',
  name: 'Topps UEFA Champions League',
  year: '2018–Present',
  manufacturer: 'Topps',
  description: 'The official UEFA Champions League card set. Covers all competing clubs and players across Europe\'s premier club competition.',
  difficulty: 'Mid Range',
  tags: ['Champions League', 'Europe', 'Topps'],
},
{
  slug: 'topps-ucc',
  name: 'Topps UCC Showcase',
  year: '2021–Present',
  manufacturer: 'Topps',
  description: 'UEFA Club Competitions Showcase. Premium chrome set covering Champions League, Europa League and Conference League players.',
  difficulty: 'Premium',
  tags: ['Chrome', 'UCL', 'Europa'],
},
{
  slug: 'topps-finest',
  name: 'Topps Finest',
  year: '2020–Present',
  manufacturer: 'Topps',
  description: 'Premium refractor based set with stunning card design. Known for its atomic refractors and on card autographs of top European players.',
  difficulty: 'Premium',
  tags: ['Refractors', 'Autos', 'Premium'],
},
{
  slug: 'topps-gold-label',
  name: 'Topps Gold Label',
  year: '2016–Present',
  manufacturer: 'Topps',
  description: 'Ultra premium single card per pack product. Three tiers of Class 1, 2 and 3 with stunning photography and very short print runs.',
  difficulty: 'Premium',
  tags: ['Ultra Premium', 'Short Print', 'Photography'],
},
{
  slug: 'topps-now',
  name: 'Topps NOW',
  year: '2017–Present',
  manufacturer: 'Topps',
  description: 'Limited edition cards released within 24-48 hours of major football moments. Print to order with very limited windows making them genuinely rare.',
  difficulty: 'Mid Range',
  tags: ['Limited Edition', 'Event Cards', 'Rare'],
},
{
  slug: 'panini-adrenalyn',
  name: 'Panini Adrenalyn XL',
  year: '2010–Present',
  manufacturer: 'Panini',
  description: 'Panini\'s popular trading card game covering the Premier League and Champions League. Affordable entry point with special limited edition cards worth chasing.',
  difficulty: 'Beginner',
  tags: ['Card Game', 'Affordable', 'Premier League'],
},
{
  slug: 'topps-inception',
  name: 'Topps Inception',
  year: '2019–Present',
  manufacturer: 'Topps',
  description: 'Premium on card autograph focused set with stunning acetate cards. Every box guaranteed to contain autographs from top players.',
  difficulty: 'Premium',
  tags: ['Autos', 'Acetate', 'On Card'],
},
    ],
  },
  {
    name: 'Basketball',
    sets: [
      {
        slug: 'panini-prizm-nba',
        name: 'Panini Prizm NBA',
        year: '2012–Present',
        manufacturer: 'Panini',
        description: 'The gold standard of basketball cards. Silver Prizms of top NBA players are among the most traded cards in the hobby worldwide.',
        difficulty: 'Premium',
        tags: ['Prizms', 'Silver', 'NBA'],
      },
      {
        slug: 'topps-chrome-nba',
        name: 'Topps Chrome NBA',
        year: '1996–Present',
        manufacturer: 'Topps',
        description: 'A classic chromium basketball set with a long history. Rookie cards from this set are highly collectible.',
        difficulty: 'Mid Range',
        tags: ['Chrome', 'Rookies', 'Classic'],
      },
      {
        slug: 'panini-select-nba',
        name: 'Panini Select NBA',
        year: '2014–Present',
        manufacturer: 'Panini',
        description: 'Three tier design with Concourse, Premier and Courtside levels. Die cut Courtside cards are the most sought after.',
        difficulty: 'Mid Range',
        tags: ['Tiered', 'Die Cut', 'Parallels'],
      },
    ],
  },
  {
    name: 'Baseball',
    sets: [
      {
        slug: 'topps-chrome-baseball',
        name: 'Topps Chrome Baseball',
        year: '1996–Present',
        manufacturer: 'Topps',
        description: 'The original Chrome set and still one of the most popular. Rookie cards of MLB stars are the most valuable.',
        difficulty: 'Premium',
        tags: ['Chrome', 'Rookies', 'MLB'],
      },
      {
        slug: 'topps-baseball',
        name: 'Topps Baseball',
        year: '1952–Present',
        manufacturer: 'Topps',
        description: 'The most iconic baseball card set in history. Vintage Topps cards from the 1950s-70s are among the most valuable sports cards ever.',
        difficulty: 'Beginner',
        tags: ['Classic', 'Vintage', 'Iconic'],
      },
      {
        slug: 'bowman-baseball',
        name: 'Bowman Baseball',
        year: '1948–Present',
        manufacturer: 'Topps',
        description: 'The go-to set for prospect collectors. First Bowman cards of players who make the major leagues can be extremely valuable.',
        difficulty: 'Mid Range',
        tags: ['Prospects', 'Rookies', 'First Cards'],
      },
    ],
  },
  {
    name: 'NFL',
    sets: [
      {
        slug: 'panini-prizm-nfl',
        name: 'Panini Prizm NFL',
        year: '2012–Present',
        manufacturer: 'Panini',
        description: 'The most popular NFL card set. Rookie Prizms of top draft picks are among the most valuable cards in the hobby.',
        difficulty: 'Premium',
        tags: ['Prizms', 'Rookies', 'NFL'],
      },
      {
        slug: 'topps-chrome-nfl',
        name: 'Topps Chrome NFL',
        year: '1996–Present',
        manufacturer: 'Topps',
        description: 'A classic chromium NFL set with strong collector demand. Rookie cards of star quarterbacks are particularly valuable.',
        difficulty: 'Mid Range',
        tags: ['Chrome', 'Rookies', 'QBs'],
      },
      {
        slug: 'panini-select-nfl',
        name: 'Panini Select NFL',
        year: '2018–Present',
        manufacturer: 'Panini',
        description: 'Three tier design with bold colourful parallels. One of the most visually striking NFL sets available.',
        difficulty: 'Mid Range',
        tags: ['Tiered', 'Parallels', 'Bold'],
      },
    ],
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

     <Nav activePage="sets" />

      <div style={{ padding: "3rem 2rem 2rem", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.25)", color: "#f0b429", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1rem", letterSpacing: "1px", textTransform: "uppercase" }}>
          Card Set Guide
        </div>
        <h1 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-1.5px", margin: "0 0 1rem", lineHeight: 1.05 }}>
          Know your <span style={{ color: "#f0b429" }}>sets</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", lineHeight: 1.6, maxWidth: "500px", margin: 0 }}>
          From beginner sticker collections to premium chrome refractors — guides covering soccer, basketball, baseball and NFL card sets.
        </p>
      </div>

      {sports.map((sport) => (
        <div key={sport.name} style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "22px", letterSpacing: "-0.5px", margin: 0 }}>{sport.name}</h2>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }}/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {sport.sets.map((set) => (
              <Link key={set.slug} href={`/sets/${set.slug}`} style={{ textDecoration: "none" }}>
                <div
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.5rem", height: "100%", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(240,180,41,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{set.manufacturer}</span>
                    <span style={{ background: difficultyColour[set.difficulty], color: difficultyText[set.difficulty], fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 500 }}>{set.difficulty}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "18px", color: "#fff", marginBottom: "0.5rem", letterSpacing: "-0.3px" }}>{set.name}</div>
                  <div style={{ fontSize: "12px", color: "#f0b429", marginBottom: "0.75rem" }}>{set.year}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "1rem" }}>{set.description}</div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {set.tags.map(tag => (
                      <span key={tag} style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontSize: "10px", padding: "3px 8px", borderRadius: "4px" }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: "1rem", fontSize: "12px", color: "#f0b429" }}>Learn more →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

    </main>
  );
}