import Nav from '../../../components/Nav';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const set = sets[slug];
  if (!set) return {};
  return {
    title: `${set.name} Card Prices, Parallels & Collector Guide | Boxxond`,
    description: `${set.name} trading card guide. ${set.overview.slice(0, 120)}... Real sold prices from eBay UK, parallel details and collector tips.`,
    openGraph: {
      title: `${set.name} Card Prices & Guide | Boxxond`,
      description: `${set.name} prices, parallels and collector guide. Real eBay UK sold prices.`,
      url: `https://boxxond.com/sets/${slug}`,
      siteName: 'Boxxond',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${set.name} Card Prices & Guide | Boxxond`,
      description: `${set.name} prices, parallels and collector guide. Real eBay UK sold prices.`,
    },
    keywords: [`${set.name}`, `${set.name} prices`, `${set.name} parallels`, `${set.manufacturer} cards`, 'trading card prices UK', 'eBay card prices'],
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
  'topps-chrome-sapphire': {
    name: 'Topps Chrome Sapphire',
    manufacturer: 'Topps',
    year: '2018-Present',
    difficulty: 'Premium',
    overview: 'Topps Chrome Sapphire is the ultra premium edition of Topps Chrome. Released exclusively through the Topps website and selected retailers, Sapphire features a stunning blue refractor finish on every card making the entire base set refractors. With a significantly limited print run compared to standard Chrome, Sapphire cards command a substantial premium and are among the most desirable cards in the modern hobby.',
    whatToLookFor: 'Every base card in Sapphire is a refractor making them all more valuable than standard Chrome base. Autographed Sapphire cards are extremely rare and valuable. Parallel versions including Gold and SuperFractor are the ultimate chase cards. Rookie Sapphires of top players can be worth many times their standard Chrome equivalent.',
    parallels: [
      { name: 'Base Sapphire Refractor', printRun: 'Limited', colour: 'Blue' },
      { name: 'Gold Refractor', printRun: '/50', colour: 'Gold' },
      { name: 'Orange Refractor', printRun: '/25', colour: 'Orange' },
      { name: 'Red Refractor', printRun: '/5', colour: 'Red' },
      { name: 'SuperFractor', printRun: '1/1', colour: 'Gold' },
    ],
    tips: [
      'Every base card is a refractor - making even base cards significantly more valuable than standard Chrome',
      'Sapphire sells out fast - pre-order if possible when new editions are announced',
      'PSA graded Sapphire rookies of top players hold value exceptionally well',
      'Compare prices carefully - Sapphire premiums can be 5-10x standard Chrome prices',
    ],
    priceRange: 'From £20 to £5,000+',
  },
  'topps-ucl': {
    name: 'Topps UEFA Champions League',
    manufacturer: 'Topps',
    year: '2018-Present',
    difficulty: 'Mid Range',
    overview: 'Topps UEFA Champions League is the official card set for Europe\'s premier club competition. Covering all clubs and players competing in the Champions League, this set is hugely popular with European collectors. The chrome versions of this set are particularly sought after with refractor parallels of star players commanding strong prices.',
    whatToLookFor: 'Chrome refractor parallels of the biggest names in European football are the top chase cards. Autographs of Champions League legends are very valuable. Look for cards of players who go on to win the competition as their values often spike after tournament success.',
    parallels: [
      { name: 'Base Card', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Silver Refractor', printRun: 'Unlimited', colour: 'Silver' },
      { name: 'Blue Refractor', printRun: '/150', colour: 'Blue' },
      { name: 'Gold Refractor', printRun: '/50', colour: 'Gold' },
      { name: 'SuperFractor', printRun: '1/1', colour: 'Gold' },
    ],
    tips: [
      'Buy cards of players before the Champions League knockout stages - prices spike during the tournament',
      'Winners of the Champions League see massive price increases - timing is everything',
      'Chrome versions are worth significantly more than standard base cards',
      'European collectors drive strong demand for this set making it very liquid',
    ],
    priceRange: 'From £2 to £2,000+',
  },
  'topps-ucc': {
    name: 'Topps UCC Showcase',
    manufacturer: 'Topps',
    year: '2021-Present',
    difficulty: 'Premium',
    overview: 'Topps UCC Showcase covers UEFA Club Competitions including the Champions League, Europa League and Conference League. A premium chrome product with stunning card design, UCC Showcase has quickly built a strong following among European football card collectors who want premium cards of their favourite club players.',
    whatToLookFor: 'Chrome refractors of top Champions League players are the most valuable cards. Europa League stars are often undervalued compared to Champions League equivalents. Look for autograph cards of breakout players early in the season before prices rise.',
    parallels: [
      { name: 'Base Chrome', printRun: 'Unlimited', colour: 'Silver' },
      { name: 'Blue Refractor', printRun: '/150', colour: 'Blue' },
      { name: 'Green Refractor', printRun: '/99', colour: 'Green' },
      { name: 'Gold Refractor', printRun: '/50', colour: 'Gold' },
      { name: 'SuperFractor', printRun: '1/1', colour: 'Gold' },
    ],
    tips: [
      'Europa League player cards are often undervalued compared to Champions League equivalents',
      'Conference League cards of breakout players can be great value before they move to bigger clubs',
      'Buy before the knockout rounds when prices are still reasonable',
      'UCC Showcase has strong demand from UK collectors following European football',
    ],
    priceRange: 'From £3 to £1,500+',
  },
  'topps-finest': {
    name: 'Topps Finest',
    manufacturer: 'Topps',
    year: '2020-Present',
    difficulty: 'Premium',
    overview: 'Topps Finest is one of the most visually stunning sets in the football card hobby. Known for its atomic refractor parallels and premium on card autographs, Finest targets the serious collector who wants something special. The set features top European players and is released in limited quantities making it genuinely scarce.',
    whatToLookFor: 'Atomic refractor parallels are the signature cards of this set and the most visually striking. On card autographs are guaranteed in hobby boxes and are the main chase. Superfractors at 1/1 are among the rarest cards produced by Topps.',
    parallels: [
      { name: 'Base Refractor', printRun: 'Unlimited', colour: 'Silver' },
      { name: 'Atomic Refractor', printRun: 'Limited', colour: 'Rainbow' },
      { name: 'Blue Refractor', printRun: '/150', colour: 'Blue' },
      { name: 'Gold Refractor', printRun: '/50', colour: 'Gold' },
      { name: 'Red Refractor', printRun: '/5', colour: 'Red' },
      { name: 'SuperFractor', printRun: '1/1', colour: 'Gold' },
    ],
    tips: [
      'Atomic refractors are the most eye catching cards in the set - very popular with collectors',
      'On card autos are worth significantly more than sticker autos',
      'Finest has a loyal collector base making cards relatively easy to buy and sell',
      'Limited print runs mean genuine scarcity - prices hold well over time',
    ],
    priceRange: 'From £5 to £3,000+',
  },
  'topps-gold-label': {
    name: 'Topps Gold Label',
    manufacturer: 'Topps',
    year: '2016-Present',
    difficulty: 'Premium',
    overview: 'Topps Gold Label is one of the most unique products in the football card market. Each pack contains just one card across three classes - Class 1, Class 2 and Class 3 - each with different photography and very short print runs. The stunning design and genuine scarcity make Gold Label a favourite among serious collectors.',
    whatToLookFor: 'Class 3 cards have the shortest print runs and are the most valuable. Framed autograph versions are extremely rare. Look for cards of top Premier League and European stars as demand is strongest for recognisable names.',
    parallels: [
      { name: 'Class 1', printRun: 'Limited', colour: 'Gold' },
      { name: 'Class 2', printRun: 'Very Limited', colour: 'Gold' },
      { name: 'Class 3', printRun: 'Ultra Limited', colour: 'Gold' },
      { name: 'Framed Auto', printRun: 'Ultra Limited', colour: 'Gold' },
    ],
    tips: [
      'Class 3 cards are the rarest and most valuable - worth paying a premium for',
      'The one card per pack format makes Gold Label feel genuinely premium',
      'Stunning photography makes even lower class cards beautiful display pieces',
      'Strong demand from UK collectors who appreciate the premium format',
    ],
    priceRange: 'From £10 to £5,000+',
  },
  'topps-now': {
    name: 'Topps NOW',
    manufacturer: 'Topps',
    year: '2017-Present',
    difficulty: 'Mid Range',
    overview: 'Topps NOW is unlike any other card product. Cards are released within 24-48 hours of significant football moments - a hat trick, a title win, a record breaking performance. Cards are only available for a limited 24-48 hour window making them genuinely rare. The print run is determined by how many are ordered during that window.',
    whatToLookFor: 'Cards commemorating historic moments are the most valuable - title winning goals, record breaking performances, debut cards. Low print run cards from less popular windows can be very scarce. Look for moments that will be remembered long term as those cards appreciate most.',
    parallels: [
      { name: 'Base Card', printRun: 'Print to Order', colour: 'Standard' },
      { name: 'Blue Parallel', printRun: '/10', colour: 'Blue' },
      { name: 'Gold Parallel', printRun: '/5', colour: 'Gold' },
      { name: '1/1', printRun: '1/1', colour: 'Various' },
    ],
    tips: [
      'Order during the window - once it closes you can only buy on the secondary market at a premium',
      'Historic moments create the most valuable cards - title clinchers, records, debuts',
      'Low ordered print runs can make even base cards genuinely rare',
      'Follow Topps social media to never miss a new release window',
    ],
    priceRange: 'From £5 to £500+',
  },
  'panini-adrenalyn': {
    name: 'Panini Adrenalyn XL',
    manufacturer: 'Panini',
    year: '2010-Present',
    difficulty: 'Beginner',
    overview: 'Panini Adrenalyn XL is a trading card game covering the Premier League, Champions League and other top competitions. More accessible than premium chrome sets, Adrenalyn is a great entry point for younger collectors or those new to the hobby. Special limited edition cards within the set can hold real value.',
    whatToLookFor: 'Limited Edition cards are the most valuable in Adrenalyn. Ultimate cards and Top Master cards are the rarest. Complete sets in mint condition have collector value. Older season complete sets are particularly sought after by nostalgic collectors.',
    parallels: [
      { name: 'Base Card', printRun: 'Unlimited', colour: 'Standard' },
      { name: 'Limited Edition', printRun: 'Limited', colour: 'Gold' },
      { name: 'Top Master', printRun: 'Very Limited', colour: 'Special' },
      { name: 'Ultimate', printRun: 'Ultra Limited', colour: 'Special' },
    ],
    tips: [
      'Great entry point for new collectors - very affordable packs',
      'Limited Edition and Ultimate cards are worth keeping in top condition',
      'Complete sets from older seasons are underrated collectibles',
      'Popular with younger collectors making it a great gift for kids getting into the hobby',
    ],
    priceRange: 'From £0.10 to £200',
  },
  'topps-inception': {
    name: 'Topps Inception',
    manufacturer: 'Topps',
    year: '2019-Present',
    difficulty: 'Premium',
    overview: 'Topps Inception is built around on card autographs on stunning acetate card stock. The see-through acetate design makes Inception cards unlike anything else in the hobby. Every hobby box is guaranteed to contain autographs making it a popular choice for collectors who want to pull signatures from top players.',
    whatToLookFor: 'On card acetate autographs are the signature cards of this set. Rookie autographs are the most valuable. The see-through acetate design makes every card a standout piece. Look for parallel versions of autograph cards for the rarest pulls.',
    parallels: [
      { name: 'Base Acetate', printRun: 'Unlimited', colour: 'Clear' },
      { name: 'Blue Parallel', printRun: '/150', colour: 'Blue' },
      { name: 'Gold Parallel', printRun: '/50', colour: 'Gold' },
      { name: 'Red Parallel', printRun: '/5', colour: 'Red' },
      { name: 'SuperFractor', printRun: '1/1', colour: 'Gold' },
    ],
    tips: [
      'The acetate design is unique in the hobby - makes for stunning display pieces',
      'On card autos are guaranteed in hobby boxes making it great value for auto hunters',
      'Rookie acetate autos of top players are among the most desirable cards in the set',
      'Store carefully - acetate cards can scratch more easily than standard card stock',
    ],
    priceRange: 'From £5 to £3,000+',
  },
};
export default async function SetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const set = sets[slug];

  if (!set) notFound();

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

  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>

      <Nav activePage="sets" />

      <div style={{ padding: "2.5rem 2rem", maxWidth: "800px", margin: "0 auto" }}>

        <Link href="/sets" style={{ color: "#888", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>← Back to Sets</Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" as const }}>
          <h1 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "clamp(28px, 5vw, 44px)", letterSpacing: "-1px", margin: 0 }}>{set.name}</h1>
          <span style={{ background: difficultyColour[set.difficulty], color: difficultyText[set.difficulty], fontSize: "11px", padding: "3px 10px", borderRadius: "4px", fontWeight: 500 }}>{set.difficulty}</span>
        </div>
        <div style={{ fontSize: "13px", color: "#3aaa35", fontWeight: 600, marginBottom: "2rem" }}>{set.manufacturer} · {set.year}</div>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "16px", marginBottom: "0.75rem", color: "#1a1a1a" }}>Overview</h2>
          <p style={{ color: "#555", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>{set.overview}</p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "16px", marginBottom: "0.75rem", color: "#1a1a1a" }}>What to look for</h2>
          <p style={{ color: "#555", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>{set.whatToLookFor}</p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "16px", marginBottom: "1rem", color: "#1a1a1a" }}>Parallels and Print Runs</h2>
          <div style={{ background: "#fff", border: "1px solid #e0d9cc", borderRadius: "10px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  {["Parallel", "Print Run", "Colour"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "11px", fontWeight: 500, color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "0.5px", borderBottom: "1px solid #e0d9cc" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {set.parallels.map((p: any, i: number) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#faf7f0" }}>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid #e0d9cc", color: "#1a1a1a", fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid #e0d9cc", color: "#3aaa35", fontFamily: "var(--font-dm-sans)", fontWeight: 700 }}>{p.printRun}</td>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid #e0d9cc", color: "#666" }}>{p.colour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "16px", marginBottom: "1rem", color: "#1a1a1a" }}>Collector Tips</h2>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
            {set.tips.map((tip: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "#fff", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "12px 16px" }}>
                <span style={{ color: "#3aaa35", fontFamily: "var(--font-dm-sans)", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>0{i + 1}</span>
                <span style={{ color: "#555", fontSize: "14px", lineHeight: 1.6 }}>{tip}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "rgba(58,170,53,0.06)", border: "1px solid rgba(58,170,53,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
          <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "0.5rem" }}>Typical Price Range</div>
          <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "28px", color: "#3aaa35", letterSpacing: "-1px" }}>{set.priceRange}</div>
          <div style={{ fontSize: "12px", color: "#aaa", marginTop: "0.5rem" }}>Based on recent eBay UK listing prices</div>
        </section>

        <div style={{ marginTop: "1.5rem", background: "#f0ede6", border: "1px solid #e0d9cc", borderRadius: "8px", padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: "11px", color: "#888", lineHeight: 1.6 }}>
            <strong style={{ color: "#555" }}>Disclaimer:</strong> Set information, parallel details and price ranges on this page are provided for guidance only. Print runs, parallels and pricing vary by year and release. Always verify current details with official manufacturer sources before making purchasing decisions. Boxxond is not affiliated with Topps, Panini or any card manufacturer.
          </div>
        </div>

      </div>
    </main>
  );
}