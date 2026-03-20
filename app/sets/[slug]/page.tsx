import Nav from '../../../components/Nav';
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
  },'panini-prizm-nba': {
    name: 'Panini Prizm NBA',
    manufacturer: 'Panini',
    year: '2012-Present',
    difficulty: 'Premium',
    overview: 'Panini Prizm NBA is the gold standard of basketball cards. Launched in 2012, it quickly became the most popular and traded basketball card set in the world. Silver Prizms of top NBA players are instantly recognisable and form the backbone of the modern basketball card market.',
    whatToLookFor: 'Silver Prizms of star players and top rookies are the most liquid cards in the hobby. Rookie Prizms of first round draft picks can be extremely valuable especially if the player has a breakout season. Look for numbered parallels and on-card autographs for maximum value.',
    parallels: [
      { name: 'Silver Prizm', printRun: 'Unlimited', colour: 'Silver' },
      { name: 'Blue Prizm', printRun: '/199', colour: 'Blue' },
      { name: 'Green Prizm', printRun: '/99', colour: 'Green' },
      { name: 'Purple Prizm', printRun: '/49', colour: 'Purple' },
      { name: 'Gold Prizm', printRun: '/10', colour: 'Gold' },
      { name: 'Black Prizm', printRun: '1/1', colour: 'Black' },
    ],
    tips: [
      'Silver Prizms are the most traded cards in basketball - very easy to buy and sell',
      'Rookie Prizms of lottery picks are worth grabbing early before prices rise',
      'PSA 10 graded Silver Prizms of star players command a massive premium',
      'Look for short print variations and rare colour parallels for the biggest returns',
    ],
    priceRange: 'From £3 to £10,000+',
  },
  'topps-chrome-nba': {
    name: 'Topps Chrome NBA',
    manufacturer: 'Topps',
    year: '1996-Present',
    difficulty: 'Mid Range',
    overview: 'Topps Chrome NBA has a long and storied history dating back to 1996. One of the earliest chromium basketball sets, it has produced some of the most iconic rookie cards in the hobby including early Kobe Bryant and LeBron James cards which are among the most valuable sports cards ever made.',
    whatToLookFor: 'Vintage Chrome rookie cards from the late 1990s and early 2000s are the real prizes. Modern releases focus on current NBA stars and rookies. Refractor parallels are the most sought after within the set.',
    parallels: [
      { name: 'Base Refractor', printRun: 'Unlimited', colour: 'Silver' },
      { name: 'Blue Refractor', printRun: '/150', colour: 'Blue' },
      { name: 'Green Refractor', printRun: '/99', colour: 'Green' },
      { name: 'Gold Refractor', printRun: '/50', colour: 'Gold' },
      { name: 'Red Refractor', printRun: '/5', colour: 'Red' },
      { name: 'Superfractor', printRun: '1/1', colour: 'Gold' },
    ],
    tips: [
      'Vintage Topps Chrome rookies from the late 90s are seriously undervalued',
      'Look for early LeBron and Kobe Chrome cards for the biggest long term returns',
      'Modern Chrome NBA offers good value compared to Prizm at similar price points',
      'Graded copies of star rookie cards hold value extremely well',
    ],
    priceRange: 'From £2 to £50,000+ (vintage)',
  },
  'panini-select-nba': {
    name: 'Panini Select NBA',
    manufacturer: 'Panini',
    year: '2014-Present',
    difficulty: 'Mid Range',
    overview: 'Panini Select NBA features the distinctive three tier design of Concourse, Premier and Courtside levels. The die cut Courtside cards are the standout feature of this set and have become one of the most recognisable card designs in the hobby.',
    whatToLookFor: 'Courtside die cut cards are the must have cards from this set. Tri-Colour parallels are visually striking and popular with collectors. Rookie cards of top draft picks in the Courtside design are particularly valuable.',
    parallels: [
      { name: 'Concourse Base', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Premier Base', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Courtside', printRun: 'Limited', colour: 'Die Cut' },
      { name: 'Tri-Colour', printRun: '/49', colour: 'Multi' },
      { name: 'Gold', printRun: '/10', colour: 'Gold' },
      { name: 'Black', printRun: '1/1', colour: 'Black' },
    ],
    tips: [
      'Courtside cards are the ones to chase - the die cut design is iconic',
      'Select boxes offer great variety with three different card designs per box',
      'Tri-Colour parallels are very popular and photograph beautifully',
      'A good alternative to Prizm if you want something visually different',
    ],
    priceRange: 'From £2 to £2,000+',
  },
  'topps-chrome-baseball': {
    name: 'Topps Chrome Baseball',
    manufacturer: 'Topps',
    year: '1996-Present',
    difficulty: 'Premium',
    overview: 'Topps Chrome Baseball is the premier modern baseball card set. The chromium finish elevates the classic Topps design and rookie cards from this set are among the most valuable in the baseball card hobby. A staple product that every serious baseball card collector follows closely.',
    whatToLookFor: 'Rookie cards of top MLB prospects are the biggest chase cards. Autographed refractors are extremely valuable. Look for short print variations and rare parallels of star players for maximum returns.',
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
      'Follow MLB prospect rankings closely - early Chrome rookies of future stars are gold',
      'Autographed refractors of top prospects can skyrocket in value quickly',
      'The US baseball card market is massive - liquidity is excellent',
      'Short print variations are harder to find and worth a significant premium',
    ],
    priceRange: 'From £3 to £20,000+',
  },
  'topps-baseball': {
    name: 'Topps Baseball',
    manufacturer: 'Topps',
    year: '1952-Present',
    difficulty: 'Beginner',
    overview: 'Topps Baseball is the most iconic trading card set in history. Dating back to 1952, it has documented every era of Major League Baseball for over 70 years. Vintage Topps cards from the 1950s to 1970s featuring legends like Mickey Mantle and Babe Ruth are among the most valuable sports cards ever sold.',
    whatToLookFor: 'Vintage cards from the 1950s-1970s in good condition are the most valuable. The 1952 Topps Mickey Mantle is one of the most famous cards in existence. Modern Topps Series 1 and 2 offer affordable collecting with short prints and autographs worth chasing.',
    parallels: [
      { name: 'Base Card', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Gold Parallel', printRun: '/2025', colour: 'Gold' },
      { name: 'Black Parallel', printRun: '/63', colour: 'Black' },
      { name: 'Platinum', printRun: '1/1', colour: 'Platinum' },
    ],
    tips: [
      'Vintage Topps cards in PSA graded condition are serious investments',
      'Check car boot sales and charity shops for hidden vintage treasures',
      'Modern Topps is very affordable and great for new collectors',
      'Short print variations in modern sets are worth looking out for',
    ],
    priceRange: 'From £0.10 to £1,000,000+ (vintage)',
  },
  'bowman-baseball': {
    name: 'Bowman Baseball',
    manufacturer: 'Topps',
    year: '1948-Present',
    difficulty: 'Mid Range',
    overview: 'Bowman Baseball is the definitive prospect set. Collectors chase First Bowman cards of top MLB prospects years before they reach the major leagues. When a prospect becomes a star, their First Bowman card can increase dramatically in value making this one of the most exciting sets to collect.',
    whatToLookFor: 'First Bowman cards of top prospects are the most important cards in the set. Bowman Chrome versions of prospect cards are more valuable than the base paper versions. Autographed prospect cards are the ultimate chase cards in this set.',
    parallels: [
      { name: 'Base Paper', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Chrome Base', printRun: 'Unlimited', colour: 'Chrome' },
      { name: 'Chrome Refractor', printRun: 'Unlimited', colour: 'Silver' },
      { name: 'Blue Refractor', printRun: '/150', colour: 'Blue' },
      { name: 'Gold Refractor', printRun: '/50', colour: 'Gold' },
      { name: 'Superfractor', printRun: '1/1', colour: 'Gold' },
    ],
    tips: [
      'Follow Baseball America prospect rankings to know which players to target',
      'First Bowman Chrome autos of top prospects are the biggest long term investments',
      'Buy prospect cards before they debut in the majors for the best prices',
      'Graded First Bowman cards hold value extremely well long term',
    ],
    priceRange: 'From £1 to £50,000+',
  },
  'panini-prizm-nfl': {
    name: 'Panini Prizm NFL',
    manufacturer: 'Panini',
    year: '2012-Present',
    difficulty: 'Premium',
    overview: 'Panini Prizm NFL is the most popular American football card set in the hobby. Rookie Prizms of top NFL draft picks are among the most traded cards in the entire sports card market. With the NFL being the most watched sport in America, demand for Prizm cards is enormous.',
    whatToLookFor: 'Rookie Prizms of first round draft picks especially quarterbacks are the biggest chase cards. Silver Prizms are the most liquid and easiest to trade. Look for numbered parallels of star players and Super Bowl winners for maximum value.',
    parallels: [
      { name: 'Silver Prizm', printRun: 'Unlimited', colour: 'Silver' },
      { name: 'Blue Prizm', printRun: '/199', colour: 'Blue' },
      { name: 'Green Prizm', printRun: '/99', colour: 'Green' },
      { name: 'Purple Prizm', printRun: '/49', colour: 'Purple' },
      { name: 'Gold Prizm', printRun: '/10', colour: 'Gold' },
      { name: 'Black Prizm', printRun: '1/1', colour: 'Black' },
    ],
    tips: [
      'Quarterback rookie Prizms are always the most valuable in any given year',
      'Buy rookie Prizms early in the season before prices rise after breakout performances',
      'The US market for NFL cards is massive - excellent liquidity',
      'Super Bowl performance can dramatically increase a player\'s card values overnight',
    ],
    priceRange: 'From £3 to £15,000+',
  },
  'topps-chrome-nfl': {
    name: 'Topps Chrome NFL',
    manufacturer: 'Topps',
    year: '1996-Present',
    difficulty: 'Mid Range',
    overview: 'Topps Chrome NFL has a rich history in the American football card hobby. The chromium finish gives each card a premium feel and rookie cards from key years are highly collectible. A strong alternative to Prizm with a loyal collector base.',
    whatToLookFor: 'Rookie refractors of star quarterbacks are the most valuable cards. Vintage Chrome NFL cards from the late 1990s featuring early career cards of legends are worth seeking out. Autographed refractors command strong premiums.',
    parallels: [
      { name: 'Base Refractor', printRun: 'Unlimited', colour: 'Silver' },
      { name: 'Blue Refractor', printRun: '/150', colour: 'Blue' },
      { name: 'Green Refractor', printRun: '/99', colour: 'Green' },
      { name: 'Gold Refractor', printRun: '/50', colour: 'Gold' },
      { name: 'Red Refractor', printRun: '/5', colour: 'Red' },
      { name: 'Superfractor', printRun: '1/1', colour: 'Gold' },
    ],
    tips: [
      'Chrome NFL offers good value compared to Prizm at similar price points',
      'Early career Chrome cards of NFL legends are seriously undervalued',
      'Quarterback refractors are always the most sought after position',
      'Graded copies of star rookie refractors hold value very well',
    ],
    priceRange: 'From £2 to £5,000+',
  },
  'panini-select-nfl': {
    name: 'Panini Select NFL',
    manufacturer: 'Panini',
    year: '2018-Present',
    difficulty: 'Mid Range',
    overview: 'Panini Select NFL brings the distinctive three tier design to American football. The bold colourful parallels and die cut Courtside cards make this one of the most visually striking NFL sets available. A favourite among collectors who want something different from Prizm.',
    whatToLookFor: 'Courtside die cut cards are the standout cards from this set. Tri-Colour parallels of star quarterbacks and wide receivers are particularly popular. Rookie Courtside cards of top draft picks can be very valuable.',
    parallels: [
      { name: 'Concourse Base', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Premier Base', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Courtside', printRun: 'Limited', colour: 'Die Cut' },
      { name: 'Tri-Colour', printRun: '/49', colour: 'Multi' },
      { name: 'Gold', printRun: '/10', colour: 'Gold' },
      { name: 'Black', printRun: '1/1', colour: 'Black' },
    ],
    tips: [
      'Courtside rookie cards of quarterbacks are the top chase cards in this set',
      'Select offers great visual variety compared to standard Prizm',
      'Tri-Colour parallels are extremely popular and very eye catching',
      'Good value boxes compared to Prizm with similar hit rates',
    ],
    priceRange: 'From £2 to £3,000+',
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

      <Nav activePage="sets" />

      <div style={{ padding: "2.5rem 2rem", maxWidth: "800px", margin: "0 auto" }}>

        <Link href="/sets" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>Back to Sets</Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "clamp(28px, 5vw, 44px)", letterSpacing: "-1px", margin: 0 }}>{set.name}</h1>
          <span style={{ background: difficultyColour[set.difficulty], color: difficultyText[set.difficulty], fontSize: "11px", padding: "3px 10px", borderRadius: "4px", fontWeight: 500 }}>{set.difficulty}</span>
        </div>
        <div style={{ fontSize: "13px", color: "#f0b429", marginBottom: "2rem" }}>{set.manufacturer} · {set.year}</div>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "16px", marginBottom: "0.75rem", color: "rgba(255,255,255,0.9)" }}>Overview</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>{set.overview}</p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "16px", marginBottom: "0.75rem", color: "rgba(255,255,255,0.9)" }}>What to look for</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>{set.whatToLookFor}</p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "16px", marginBottom: "1rem", color: "rgba(255,255,255,0.9)" }}>Parallels and Print Runs</h2>
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
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#f0b429", fontFamily: "var(--font-dm-sans)", fontWeight: 700 }}>{p.printRun}</td>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }}>{p.colour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "16px", marginBottom: "1rem", color: "rgba(255,255,255,0.9)" }}>Collector Tips</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {set.tips.map((tip: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "12px 16px" }}>
                <span style={{ color: "#f0b429", fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>0{i + 1}</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6 }}>{tip}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "rgba(240,180,41,0.06)", border: "1px solid rgba(240,180,41,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "0.5rem" }}>Typical Price Range</div>
          <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "28px", color: "#f0b429", letterSpacing: "-1px" }}>{set.priceRange}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>Based on recent eBay UK sold prices</div>
        </section>

      </div>
    </main>
  );
}