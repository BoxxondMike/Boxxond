import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const set = sets[slug];
  if (!set) return {};
  return {
    title: `${set.name} Football Cards | Prices, Parallels & Guide | Boxxond`,
    description: `Everything you need to know about ${set.name}. Prices, parallels, print runs and collector tips. Real sold prices from eBay UK.`,
  };
}

const sets: Record<string, any> = {
  'topps-chrome': {
    name: 'Topps Chrome',
    manufacturer: 'Topps',
    year: '2019-Present',
    difficulty: 'Premium',
    overview: 'Topps Chrome is widely considered the most prestigious football card set in the modern hobby. Built on a chromium card stock that gives each card a distinctive shine and durability, Chrome has become the benchmark by which all other football sets are measured.',
    whatToLookFor: 'Rookie Cards of players in their first professional season are the most valuable. Autograph cards signed directly on the card carry a significant premium. Refractors come in various colours with different print runs, with Gold (/50), Orange (/25) and Red (/5) being the rarest.',
    parallels: [
      { name: 'Base Refractor', printRun: 'Unlimited', colour: 'Silver' },
      { name: 'Blue Refractor', printRun: '/150', colour: 'Blue' },
      { name: 'Green Refractor', printRun: '/99', colour: 'Green' },
      { name: 'Gold Refractor', printRun: '/50', colour: 'Gold' },
      { name: 'Orange Refractor', printRun: '/25', colour: 'Orange' },
      { name: 'Red Refractor', printRun: '/5', colour: 'Red' },
      { name: 'Superfractor', printRun: '1/1', colour: 'Gold' },
    ],
    tips: [
      'Always check the print run - lower numbers mean higher value',
      'Graded copies (PSA/BGS) of top rookies command a significant premium',
      'Look for on-card autos rather than sticker autos - they are worth more',
      'Bellingham, Palmer and Saka rookies are the most sought after UK players',
    ],
    priceRange: 'From £5 to £5,000+',
  },
  'panini-prizm-epl': {
    name: 'Panini Prizm EPL',
    manufacturer: 'Panini',
    year: '2019-Present',
    difficulty: 'Premium',
    overview: 'Panini Prizm EPL is the Premier League equivalent of Topps Chrome. Covering all 20 Premier League clubs, Prizm EPL features the biggest names in English football and its Silver Prizm parallel has become one of the most recognisable cards in the hobby.',
    whatToLookFor: 'Silver Prizms of star players are the bread and butter of this set. Autographed Prizms are extremely valuable. The Wave Prizm parallel is one of the most visually striking cards in the hobby.',
    parallels: [
      { name: 'Silver Prizm', printRun: 'Unlimited', colour: 'Silver' },
      { name: 'Blue Prizm', printRun: '/199', colour: 'Blue' },
      { name: 'Green Prizm', printRun: '/99', colour: 'Green' },
      { name: 'Purple Prizm', printRun: '/49', colour: 'Purple' },
      { name: 'Gold Prizm', printRun: '/10', colour: 'Gold' },
      { name: 'Black Prizm', printRun: '1/1', colour: 'Black' },
    ],
    tips: [
      'Silver Prizms are the most liquid - easiest to buy and sell',
      'Wave Prizms have a unique pattern and are very popular with collectors',
      'EPL Prizm holds value well due to worldwide demand for Premier League cards',
      'Look for short print variations which are harder to find in packs',
    ],
    priceRange: 'From £3 to £2,000+',
  },
  'topps-match-attax': {
    name: 'Topps Match Attax',
    manufacturer: 'Topps',
    year: '2007-Present',
    difficulty: 'Beginner',
    overview: 'Topps Match Attax is the gateway product that introduced millions of UK kids to football card collecting. An affordable sticker and card hybrid game, Match Attax covers all Premier League clubs and has expanded to include the Champions League and more.',
    whatToLookFor: 'Limited Edition cards with golden borders are the most sought after. 100 Club cards featuring players with 100+ ratings are popular. Complete sets in mint condition have collector value.',
    parallels: [
      { name: 'Base Card', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Limited Edition', printRun: 'Limited', colour: 'Gold Border' },
      { name: '100 Club', printRun: 'Limited', colour: 'Special' },
      { name: 'Hat Trick Hero', printRun: 'Limited', colour: 'Special' },
    ],
    tips: [
      'Great entry point for younger or new collectors',
      'Packs are very affordable - perfect for ripping on a budget',
      'Older complete sets in good condition are underrated investments',
      'Limited Edition cards are the ones to keep - do not swap them away',
    ],
    priceRange: 'From £0.10 to £50',
  },
  'merlin': {
    name: 'Merlin',
    manufacturer: 'Topps',
    year: '1991-Present',
    difficulty: 'Beginner',
    overview: 'Merlin is a British institution. Since 1991 Merlin sticker collections have been a staple of UK playground culture. Now owned by Topps, modern Merlin releases have evolved beyond stickers to include premium card variants.',
    whatToLookFor: 'Original 1990s Merlin sticker collections in complete condition are genuinely valuable. First edition Premier League Merlin collections from 1991-92 are the most historically significant.',
    parallels: [
      { name: 'Base Sticker', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Shiny Sticker', printRun: 'Limited', colour: 'Foil' },
      { name: 'Premium Card', printRun: 'Limited', colour: 'Various' },
    ],
    tips: [
      'Original 90s complete collections are genuinely collectible - check car boot sales',
      'Modern Merlin is great for kids and casual collectors',
      'Shiny stickers were always the most valuable - nothing has changed',
      'Look out for error cards and misprints which can be worth a premium',
    ],
    priceRange: 'From £0.05 to £500 (vintage)',
  },
  'topps-stadium-club': {
    name: 'Topps Stadium Club',
    manufacturer: 'Topps',
    year: '2021-Present',
    difficulty: 'Mid Range',
    overview: 'Topps Stadium Club Chrome is known for its stunning photography and clean artistic design. Unlike refractor heavy Chrome sets, Stadium Club puts photography front and centre making each card feel more like a piece of art than a trading card.',
    whatToLookFor: 'Black and White parallel cards are visually striking and popular. Autograph cards feature on-card signatures. Co-signers featuring multiple player autographs on one card are rare and valuable.',
    parallels: [
      { name: 'Base', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Black and White', printRun: '/99', colour: 'Monochrome' },
      { name: 'Gold', printRun: '/50', colour: 'Gold' },
      { name: 'Red', printRun: '/5', colour: 'Red' },
      { name: '1/1', printRun: '1/1', colour: 'Various' },
    ],
    tips: [
      'Base cards are genuinely beautiful - worth collecting for the photography alone',
      'Black and White parallels are the most popular and visually striking',
      'A great mid-range set for collectors who want quality without Chrome prices',
      'Stadium Club has a loyal community - easy to buy and sell within hobby groups',
    ],
    priceRange: 'From £2 to £500+',
  },
  'panini-select': {
    name: 'Panini Select',
    manufacturer: 'Panini',
    year: '2020-Present',
    difficulty: 'Mid Range',
    overview: 'Panini Select is one of the most visually distinctive sets in the football card hobby. Its three tier design featuring Concourse, Premier and Courtside levels gives collectors different card designs within the same product.',
    whatToLookFor: 'Courtside die cut cards are the most distinctive and sought after. Tri-Colour parallels are among the most visually striking cards in the hobby. Look for numbered parallels of top Premier League players.',
    parallels: [
      { name: 'Concourse Base', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Premier Base', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Courtside', printRun: 'Limited', colour: 'Die Cut' },
      { name: 'Tri-Colour', printRun: '/49', colour: 'Multi' },
      { name: 'Gold', printRun: '/10', colour: 'Gold' },
      { name: 'Black', printRun: '1/1', colour: 'Black' },
    ],
    tips: [
      'Courtside cards are the ones to chase - the die cut design is unlike anything else',
      'Tri-Colour parallels are incredibly popular and very eye catching',
      'Select boxes offer good value compared to Chrome at similar price points',
      'The three tier system means more variety - something for every collector',
    ],
    priceRange: 'From £2 to £1,000+',
  },
};
export default async function SetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const set = sets[slug];

  if (!set) notFound();

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

  return (
    <main style={{ background: "#080c10", minHeight: "100vh", color: "#ffffff", fontFamily: "var(--font-dm-sans)" }}>

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "24px", letterSpacing: "-1px", color: "#fff", textDecoration: "none" }}>
          boxx<span style={{ color: "#f0b429" }}>ond</span>
        </Link>
        <div style={{ display: "flex", gap: "2rem", fontSize: "14px" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Prices</Link>
          <Link href="/sets" style={{ color: "#f0b429", textDecoration: "none" }}>Sets</Link>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Breaks</a>
        </div>
        <button style={{ background: "#f0b429", color: "#080c10", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "13px", padding: "10px 22px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Sign Up Free
        </button>
      </nav>

      <div style={{ padding: "2.5rem 2rem", maxWidth: "800px", margin: "0 auto" }}>

        <Link href="/sets" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>Back to Sets</Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(28px, 5vw, 44px)", letterSpacing: "-1px", margin: 0 }}>{set.name}</h1>
          <span style={{ background: difficultyColour[set.difficulty], color: difficultyText[set.difficulty], fontSize: "11px", padding: "3px 10px", borderRadius: "4px", fontWeight: 500 }}>{set.difficulty}</span>
        </div>
        <div style={{ fontSize: "13px", color: "#f0b429", marginBottom: "2rem" }}>{set.manufacturer} · {set.year}</div>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "16px", marginBottom: "0.75rem", color: "rgba(255,255,255,0.9)" }}>Overview</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>{set.overview}</p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "16px", marginBottom: "0.75rem", color: "rgba(255,255,255,0.9)" }}>What to look for</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>{set.whatToLookFor}</p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "16px", marginBottom: "1rem", color: "rgba(255,255,255,0.9)" }}>Parallels and Print Runs</h2>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {["Parallel", "Print Run", "Colour"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" as const, letterSpacing: "0.5px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {set.parallels.map((p: any, i: number) => (
                  <tr key={i}>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#fff", fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#f0b429", fontFamily: "var(--font-syne)", fontWeight: 700 }}>{p.printRun}</td>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }}>{p.colour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "16px", marginBottom: "1rem", color: "rgba(255,255,255,0.9)" }}>Collector Tips</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {set.tips.map((tip: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "12px 16px" }}>
                <span style={{ color: "#f0b429", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>0{i + 1}</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6 }}>{tip}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "rgba(240,180,41,0.06)", border: "1px solid rgba(240,180,41,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "0.5rem" }}>Typical Price Range</div>
          <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "28px", color: "#f0b429", letterSpacing: "-1px" }}>{set.priceRange}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>Based on recent eBay UK sold prices</div>
        </section>

      </div>
    </main>
  );
}