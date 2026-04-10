'use client';

import Nav from '../../components/Nav';
import Link from 'next/link';
type CardSet = {
  slug: string;
  name: string;
  manufacturer: string;
  description: string;
  difficulty: string;
  tags: string[];
  status?: string;
  checklistUrl?: string;
};

type Sport = {
  name: string;
  sets: CardSet[];
};
const sports: Sport[] = [
  {
    name: 'Soccer',
    sets: [
      {
        slug: 'topps-chrome',
        name: 'Topps Chrome',
        manufacturer: 'Topps',
        description: 'The most prestigious football card set in the hobby. Known for its iconic chromium finish and highly sought after autographs and refractors.',
        difficulty: 'Premium',
        tags: ['Refractors', 'Autos', 'Rookie Cards'],
        checklistUrl: 'https://cdn.shopify.com/s/files/1/0739/2015/1805/files/FINAL_PL_Chrome_Checklist.pdf?v=1770285570',
      },
      {
  slug: 'topps-finest-premier-league-2026',
  name: 'Topps Finest Premier League 2026',
  manufacturer: 'Topps',
  description: 'Topps Finest comes to the Premier League. Premium refractor based set featuring the biggest names in English football with stunning atomic refractors and on card autographs.',
  difficulty: 'Premium',
  tags: ['Refractors', 'Autos', 'Premier League', 'New Release'],
  status: 'new',
  checklistUrl: 'https://cdn.shopify.com/s/files/1/0739/2015/1805/files/Finest_Premier_League_Checklist.pdf?v=1774359572',
},
      {
        slug: 'panini-prizm-epl',
        name: 'Panini Prizm EPL',
        manufacturer: 'Panini',
        description: 'Panini\'s flagship Premier League set. Famous for its Silver Prizm parallels and coloured refractors.',
        difficulty: 'Premium',
        tags: ['Prizms', 'Silver', 'Parallels'],
        checklistUrl: 'https://www.beckett.com/news/2024-25-panini-prizm-premier-league-soccer-cards/',
      },
       {
        slug: 'topps-chrome-ucc-2526',
        name: 'Topps Chrome UCC 2025-26',
        manufacturer: 'Topps',
        description: 'UCC Chrome is back. The premium chrome set covering UEFA Club Competitions including the Champions League, Europa League and Conference League for the 2025-26 season.',
        difficulty: 'Premium',
        tags: ['Chrome', 'UCL', 'Europa', 'New Release'],
        status: 'new',
        checklistUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/26TUCC_ChromeChecklist_FINAL.pdf?v=1775059905'
      },
      {
        slug: 'topps-stadium-club',
        name: 'Topps Stadium Club',
        manufacturer: 'Topps',
        description: 'Known for its stunning photography and clean design. A favourite among collectors who appreciate artistry.',
        difficulty: 'Mid Range',
        tags: ['Photography', 'Clean Design', 'Autos'],
        checklistUrl: 'https://www.beckett.com/news/topps-stadium-club-chrome-soccer/',
      },
      {
        slug: 'panini-select',
        name: 'Panini Select',
        manufacturer: 'Panini',
        description: 'Three tier design featuring Concourse, Premier and Courtside levels with bold colourful parallels.',
        difficulty: 'Mid Range',
        tags: ['Tiered', 'Parallels', 'Rookies'],
        checklistUrl: 'https://www.beckett.com/news/panini-select-soccer/',
      },
      {
        slug: 'topps-chrome-sapphire',
        name: 'Topps Chrome Sapphire',
        manufacturer: 'Topps',
        description: 'The ultra premium edition of Topps Chrome. Limited print run with stunning sapphire blue refractor finish. One of the most sought after sets in the hobby.',
        difficulty: 'Premium',
        tags: ['Sapphire', 'Limited', 'Ultra Premium'],
        checklistUrl: 'https://cdn.shopify.com/s/files/1/0739/2015/1805/files/CheckList_26PLCM_Sapphire_Completed.pdf?v=1772811316',
      },
      {
        slug: 'topps-now',
        name: 'Topps NOW',
        manufacturer: 'Topps',
        description: 'Limited edition cards released within 24-48 hours of major football moments. Print to order with very limited windows making them genuinely rare.',
        difficulty: 'Mid Range',
        tags: ['Limited Edition', 'Event Cards', 'Rare'],
        checklistUrl: 'https://www.topps.com/pages/topps-now',
      },
      {
        slug: 'topps-inception',
        name: 'Topps Inception',
        manufacturer: 'Topps',
        description: 'Premium on card autograph focused set with stunning acetate cards. Every box guaranteed to contain autographs from top players.',
        difficulty: 'Premium',
        tags: ['Autos', 'Acetate', 'On Card'],
        checklistUrl: 'https://www.beckett.com/news/topps-inception-soccer/',
      },
    ],
  },
   {
    name: 'NFL',
    sets: [
      {
        slug: 'panini-prizm-nfl',
        name: 'Panini Prizm NFL',
        manufacturer: 'Panini',
        description: 'The most popular NFL card set. Rookie Prizms of top draft picks are among the most valuable cards in the hobby.',
        difficulty: 'Premium',
        tags: ['Prizms', 'Rookies', 'NFL'],
        checklistUrl: 'https://www.beckett.com/news/panini-prizm-football/',
      },
      {
        slug: 'topps-chrome-nfl',
        name: 'Topps Cosmic Chrome NFL',
        manufacturer: 'Topps',
        description: 'A classic chromium NFL set with strong collector demand. Rookie cards of star quarterbacks are particularly valuable.',
        difficulty: 'Mid Range',
        tags: ['Chrome', 'Rookies', 'QBs'],
        checklistUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/NFL2405-2024ToppsCosmicChromeChecklist_V2.pdf?v=1744134769',
      },
      {
        slug: 'panini-select-nfl',
        name: 'Panini Select NFL',
        manufacturer: 'Panini',
        description: 'Three tier design with bold colourful parallels. One of the most visually striking NFL sets available.',
        difficulty: 'Mid Range',
        tags: ['Tiered', 'Parallels', 'Bold'],
        checklistUrl: 'https://www.beckett.com/news/panini-select-football/',
      },
      {
        slug: 'topps-nfl',
        name: 'Topps NFL',
        manufacturer: 'Topps',
        description: 'Topps returns to NFL trading cards for the first time in over a decade. Highly anticipated comeback with chrome refractors and autographs of top NFL stars.',
        difficulty: 'Premium',
        tags: ['Chrome', 'Rookies', 'Topps Comeback'],
        status: 'coming-soon',
        checklistUrl: 'https://www.checklistinsider.com/2024-topps-chrome-football',
      },
    ],
  },
  {
    name: 'Basketball',
    sets: [
      {
        slug: 'panini-prizm-nba',
        name: 'Panini Prizm NBA',
        manufacturer: 'Panini',
        description: 'The gold standard of basketball cards. Silver Prizms of top NBA players are among the most traded cards in the hobby worldwide.',
        difficulty: 'Premium',
        tags: ['Prizms', 'Silver', 'NBA'],
        checklistUrl: 'https://www.beckett.com/news/panini-prizm-basketball/',
      },
      {
        slug: 'topps-chrome-nba',
        name: 'Topps Chrome® Basketball',
        manufacturer: 'Topps',
        description: 'A classic chromium basketball set with a long history. Rookie cards from this set are highly collectible.',
        difficulty: 'Mid Range',
        tags: ['Chrome', 'Rookies', 'Classic'],
        checklistUrl: 'https://cdn.shopify.com/s/files/1/0739/2015/1805/files/2025-26_Topps_Chrome_Basketball_Checklist_1.pdf?v=1766053015',
      },
      {
        slug: 'panini-select-nba',
        name: 'Panini Select NBA',
        manufacturer: 'Panini',
        description: 'Three tier design with Concourse, Premier and Courtside levels. Die cut Courtside cards are the most sought after.',
        difficulty: 'Mid Range',
        tags: ['Tiered', 'Die Cut', 'Parallels'],
        checklistUrl: 'https://www.beckett.com/news/panini-select-basketball/',
      },
    ],
  },
  {
    name: 'Baseball',
    sets: [
      {
        slug: 'topps-chrome-baseball',
        name: 'Topps Chrome Baseball',
        manufacturer: 'Topps',
        description: 'The original Chrome set and still one of the most popular. Rookie cards of MLB stars are the most valuable.',
        difficulty: 'Premium',
        tags: ['Chrome', 'Rookies', 'MLB'],
        checklistUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/MLB2501-2025ToppsSeries1BBChecklistV3_b89e7210-e09d-41d9-84d1-d51a34abcadf.pdf?v=1739307106',
      },
      {
        slug: 'topps-baseball',
        name: 'Topps Heritage Baseball',
        manufacturer: 'Topps',
        description: 'The most iconic baseball card set in history. Heritage Topps cards from 1977 set design are among the most valuable sports cards ever.',
        difficulty: 'Beginner',
        tags: ['Classic', 'Heritage', 'Iconic'],
        checklistUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/Checklist_26THBB_3.20.pdf?v=1774362662',
      },
      {
        slug: 'bowman-baseball',
        name: 'Bowman Baseball',
        manufacturer: 'Topps',
        description: 'The go-to set for prospect collectors. First Bowman cards of players who make the major leagues can be extremely valuable.',
        difficulty: 'Mid Range',
        tags: ['Prospects', 'Rookies', 'First Cards'],
        checklistUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/MLB2507-2025BowmanBaseballChecklist2.pdf?v=1746543006',
      },
    ],
  },
];

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

export default function SetsPage() {
  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>

     <Nav activePage="sets" />

      <div style={{ padding: "3rem 2rem 2rem", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", color: "#3aaa35", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1rem", letterSpacing: "1px", textTransform: "uppercase" }}>
          Checklists & New Releases
        </div>
        <h1 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-1.5px", margin: "0 0 1rem", lineHeight: 1.05 }}>
  Release <span style={{ color: "#3aaa35" }}>Vault</span>
</h1>
        <p style={{ color: "#666", fontSize: "16px", lineHeight: 1.6, maxWidth: "500px", margin: 0 }}>
          From beginner collections to premium chrome refractors — guides covering soccer, basketball, baseball and NFL card sets.
        </p>
      </div>
{/* Featured Sets */}
<div style={{ padding: "0 2rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
    <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "22px", letterSpacing: "-0.5px", margin: 0 }}>Featured Sets</h2>
    <div style={{ flex: 1, height: "1px", background: "#f0ede6" }}/>
  </div>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", alignItems: "stretch"}}>
    {[
      { slug: 'topps-chrome', label: '🔥 Flagship', color: '#3aaa35' },
      { slug: 'topps-finest-premier-league-2026', label: '🔥 New Release', color: '#3aaa35' },
      { slug: 'topps-chrome-ucc-2526', label: '🆕 New Release', color: '#3aaa35' },
      { slug: 'topps-nfl', label: '⚡ Coming Soon', color: '#f59e0b' },
    ].map(({ slug, label, color }) => {
      const set = sports.flatMap(s => s.sets).find(s => s.slug === slug);
      if (!set) return null;
      return (
        <Link key={slug} href={`/sets/${slug}`} style={{ textDecoration: "none" }}>
          <div
            style={{ background: "#ffffff", border: `1px solid ${color === '#f59e0b' ? 'rgba(251,191,36,0.3)' : 'rgba(58,170,53,0.3)'}`, borderRadius: "12px", padding: "1.5rem", cursor: "pointer", position: "relative" as const, height: "100%", boxSizing: "border-box" as const }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = color === '#f59e0b' ? 'rgba(251,191,36,0.3)' : 'rgba(58,170,53,0.3)')}>
            <div style={{ fontSize: "11px", fontWeight: 700, color, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{label}</div>
            <div style={{ fontWeight: 700, fontSize: "17px", color: "#1a1a1a", marginBottom: "4px", letterSpacing: "-0.3px" }}>{set.name}</div>
            <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "10px" }}>{set.manufacturer} ·</div>
            <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.5, marginBottom: "12px" }}>{set.description.slice(0, 80)}...</div>
            <div style={{ fontSize: "12px", color, fontWeight: 600 }}>View Set →</div>
          </div>
        </Link>
      );
    })}
  </div>
</div>
     {sports.map((sport) => (
        <div key={sport.name} style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "22px", letterSpacing: "-0.5px", margin: 0 }}>{sport.name}</h2>
            <div style={{ flex: 1, height: "1px", background: "#f0ede6" }}/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
            {sport.sets.map((set) => (
              <div key={set.slug} style={{ display: "flex", flexDirection: "column" as const }}>
                <Link href={`/sets/${set.slug}`} style={{ textDecoration: "none", flex: 1 }}>
                  <div
                    style={{ background: "#ffffff", border: "1px solid #e0d9cc", borderRadius: set.checklistUrl ? "12px 12px 0 0" : "12px", padding: "1.5rem", height: "100%", cursor: "pointer", boxSizing: "border-box" as const }}
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
                        <span style={{ background: difficultyColour[set.difficulty], color: difficultyText[set.difficulty], fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 500 }}>{set.difficulty}</span>
                      </div>
                    </div>
                    <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "18px", color: "#1a1a1a", marginBottom: "0.5rem", letterSpacing: "-0.3px" }}>{set.name}</div>
                    <div style={{ fontSize: "12px", color: "#3aaa35", marginBottom: "0.75rem" }}></div>
                    <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, marginBottom: "1rem" }}>{set.description}</div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, marginBottom: "0.75rem" }}>
                      {set.tags.map(tag => (
                        <span key={tag} style={{ background: "rgba(255,255,255,0.05)", color: "#888", fontSize: "10px", padding: "3px 8px", borderRadius: "4px" }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: "12px", color: "#3aaa35" }}>Learn more →</div>
                  </div>
                </Link>
                {set.checklistUrl && (
                  <a href={set.checklistUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: "block", fontSize: "12px", color: "#888", padding: "8px 1.5rem", background: "#faf7f0", border: "1px solid #e0d9cc", borderTop: "none", borderRadius: "0 0 12px 12px", textDecoration: "none" }}>
                    View Checklist →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

    </main>
  );
}