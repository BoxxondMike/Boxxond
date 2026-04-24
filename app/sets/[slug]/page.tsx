import Nav from '../../../components/Nav';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const set = sets[slug];
  if (!set) return {};
  return {
    title: `${set.name} Card Prices, Parallels & Collector Guide | Boxxhq`,
    description: `${set.name} trading card guide. ${set.overview.slice(0, 120)}... Real sold prices from eBay UK, parallel details and collector tips.`,
    openGraph: {
      title: `${set.name} Card Prices & Guide | Boxxhq`,
      description: `${set.name} prices, parallels and collector guide. Real eBay UK sold prices.`,
      url: `https://boxxhq.com/sets/${slug}`,
      siteName: 'Boxxhq',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${set.name} Card Prices & Guide | Boxxhq`,
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
    year: '2012-2025',
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
    year: '2014-2025',
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
    name: 'Topps Heritage Baseball',
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
    name: 'Topps Cosmic Chrome NFL',
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
  'topps-nfl': {
  name: 'Topps NFL',
  manufacturer: 'Topps',
  year: '2025',
  difficulty: 'Premium',
  overview: 'Topps returns to NFL trading cards for the first time in over a decade. The highly anticipated comeback brings Topps Chrome quality to American football, featuring rookie cards and autographs of the biggest names in the NFL. One of the most talked about product launches in the hobby for years.',
  whatToLookFor: 'Rookie Chrome refractors of top draft picks especially quarterbacks are the biggest chase cards. Autographed refractors will command significant premiums. Look for numbered parallels of established stars and breakout players early before prices rise.',
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
    'Topps returning to NFL is massive news — expect strong demand and premium prices at launch',
    'Quarterback rookie refractors will be the most valuable cards in the set',
    'Buy early before the hobby catches on — launch prices often represent the best value',
    'Compare carefully with Panini Prizm NFL to understand relative values',
  ],
  priceRange: 'TBC — launching 2025',
},
'topps-chrome-ucc-2526': {
  name: 'Topps Chrome UCC 2025-26',
  manufacturer: 'Topps',
  year: '2025-26',
  difficulty: 'Premium',
  overview: 'UCC Chrome is back. Topps Chrome returns to UEFA Club Competitions for the 2025-26 season covering the Champions League, Europa League and Conference League. The premium chrome treatment brings refractor parallels and autographs of Europe\'s best players in what is set to be one of the most anticipated football card releases of the year.',
  whatToLookFor: 'Chrome refractors of Champions League stars are the top chase cards. Autographed refractors of European elite players will command strong premiums. Look for rookie chrome cards of breakout players from the 2025-26 season.',
  parallels: [
    { name: 'Base Chrome', printRun: 'Unlimited', colour: 'Silver' },
    { name: 'Blue Refractor', printRun: '/150', colour: 'Blue' },
    { name: 'Green Refractor', printRun: '/99', colour: 'Green' },
    { name: 'Gold Refractor', printRun: '/50', colour: 'Gold' },
    { name: 'Orange Refractor', printRun: '/25', colour: 'Orange' },
    { name: 'Red Refractor', printRun: '/5', colour: 'Red' },
    { name: 'Superfractor', printRun: '1/1', colour: 'Gold' },
  ],
  tips: [
    'UCC Chrome has a passionate collector base — demand at launch will be strong',
    'Champions League winners cards always spike in value after the final',
    'Buy cards of players before the knockout rounds when prices are still reasonable',
    'Europa and Conference League player cards are often undervalued compared to UCL equivalents',
  ],
  priceRange: 'From £5 to £3,000+',
},
'topps-finest-premier-league-2026': {
  name: 'Topps Finest Premier League 2026',
  manufacturer: 'Topps',
  year: '2025-26',
  difficulty: 'Premium',
  overview: 'The historic debut of the Finest brand in the Premier League. Built around a 300-card tiered base set split across Common, Uncommon and Rare tiers, each with their own parallel rainbow. A Hobby-only product featuring two autographs and four to five numbered parallels per box, with big name rookies including Max Dowman, Rio Ngumoha and Estêvão Willian.',
  whatToLookFor: 'Refractor autographs of star players are the top chase. SuperFractor 1/1 autos are the ultimate grail. Finest Idols legends cards and Kaboom-style case hit inserts like Swerve and Main Attraction are the most sought after singles.',
  parallels: [
    { name: 'Sky Blue Refractor', printRun: '/150', colour: 'Sky Blue' },
    { name: 'Purple Refractor', printRun: '/125', colour: 'Purple' },
    { name: 'Blue Refractor', printRun: '/99', colour: 'Blue' },
    { name: 'Green Refractor', printRun: '/75', colour: 'Green' },
    { name: 'Gold Refractor', printRun: '/50', colour: 'Gold' },
    { name: 'Orange Refractor', printRun: '/25', colour: 'Orange' },
    { name: 'Black Refractor', printRun: '/10', colour: 'Black' },
    { name: 'Red Refractor', printRun: '/5', colour: 'Red' },
    { name: 'SuperFractor', printRun: '1/1', colour: 'Gold' },
  ],
  tips: [
    'Hobby only — no retail version means print runs are more controlled',
    'The tiered base means star players appear three times at different rarity levels — chase the Rare tier',
    'Refractor autos of World Cup-bound players will spike in value this summer',
    'Finest Idols legends inserts are strong long-term holds',
  ],
  priceRange: 'From £5 to £3,000+',
},
'donruss-road-to-world-cup': {
  name: 'Donruss Road to FIFA World Cup 2026',
  manufacturer: 'Panini',
  year: '2025-26',
  difficulty: 'Mid-Range',
  overview: 'Panini Donruss Road to FIFA World Cup 2026 is the first major international set building towards the 2026 World Cup in North America. Covering 30 national teams with a 250-card base set including 50 Rated Rookies, it features Optic Holo parallels, Kaboom inserts and autographs from the biggest names in international football.',
  whatToLookFor: 'Kaboom inserts are the headline chase — Gold /10 and Black 1/1 versions of players like Messi, Ronaldo and Lamine Yamal can reach four and five figures. Optic Holo parallels of star players are the most liquid cards in the set.',
  parallels: [
    { name: 'Pink Ice', printRun: 'Unlimited', colour: 'Pink' },
    { name: 'Blue', printRun: '/199', colour: 'Blue' },
    { name: 'Purple', printRun: '/99', colour: 'Purple' },
    { name: 'Red', printRun: '/49', colour: 'Red' },
    { name: 'Gold', printRun: '/10', colour: 'Gold' },
    { name: 'Green', printRun: '/5', colour: 'Green' },
    { name: 'Black', printRun: '1/1', colour: 'Black' },
  ],
  tips: [
    'Kaboom inserts are the must-have chase cards — demand is extremely high',
    'Optic Holo parallels of Messi, Ronaldo and Yamal are the most tradeable cards',
    'World Cup winner cards will spike massively in value after the tournament',
    'Rated Rookies of breakout World Cup stars could be huge long-term holds',
  ],
  priceRange: 'From £2 to £5,000+',
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

        <Link href="/sets" style={{ color: "#888", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>← Back to Release Vault</Link>

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
            <strong style={{ color: "#555" }}>Disclaimer:</strong> Set information, parallel details and price ranges on this page are provided for guidance only. Print runs, parallels and pricing vary by year and release. Always verify current details with official manufacturer sources before making purchasing decisions. Boxxhq is not affiliated with Topps, Panini or any card manufacturer.
          </div>
        </div>

      </div>
    </main>
  );
}