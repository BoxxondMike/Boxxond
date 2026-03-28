import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Boxxond | UK Trading Card Price Tracker",
  description: "Track live market prices and new listings for trading cards on eBay UK. Search any player, set or card and see what it's worth right now.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Boxxond | UK Trading Card Price Tracker",
    description: "Track real sold prices for soccer, basketball, baseball and NFL trading cards on eBay UK. Search any player, set or card and see what it's actually worth.",
    url: "https://boxxond.com",
    siteName: "Boxxond",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boxxond | UK Trading Card Price Tracker",
    description: "Track real sold prices for soccer, basketball, baseball and NFL trading cards on eBay UK.",
  },
  keywords: ["trading card prices", "football card prices UK", "eBay card prices", "Topps Chrome prices", "Panini Prizm prices", "sports card tracker UK"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0GPKL0Z4TK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0GPKL0Z4TK');
          `}
        </Script>
      </head>
      <body className={`${syne.variable} ${dmSans.variable}`} style={{ background: "#faf7f0", color: "#1a1a1a" }}>
        {children}

        <footer style={{ borderTop: "1px solid #e0d9cc", background: "#faf7f0", padding: "3rem 2rem", marginTop: "4rem" }}>
  <div style={{ maxWidth: "960px", margin: "0 auto" }}>
    
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: "2rem", marginBottom: "2.5rem" }}>
      
      <div>
        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", letterSpacing: "-1px", color: "#1a1a1a", marginBottom: "0.5rem" }}>
          boxx<span style={{ color: "#3aaa35" }}>ond</span>
        </div>
        <div style={{ fontSize: "13px", color: "#888", maxWidth: "220px", lineHeight: 1.6 }}>
          Live market prices from eBay UK. The UK's trading card price tracker covering Soccer, Basketball, Baseball and NFL.
        </div>
      </div>

      <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" as const }}>
        <div>
          <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "1rem", fontFamily: "var(--font-dm-sans)", fontWeight: 700 }}>Explore</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.6rem" }}>
            <Link href="/" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Price Tracker</Link>
            <Link href="/sets" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Card Sets</Link>
            <Link href="/breaks" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Live Breaks</Link>
            <Link href="/dashboard" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Dashboard</Link>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "1rem", fontFamily: "var(--font-dm-sans)", fontWeight: 700 }}>Soccer</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.6rem" }}>
            <Link href="/sets/topps-chrome" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Topps Chrome</Link>
            <Link href="/sets/panini-prizm-epl" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Panini Prizm EPL</Link>
            <Link href="/sets/topps-match-attax" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Match Attax</Link>
            <Link href="/sets/merlin" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Merlin</Link>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "1rem", fontFamily: "var(--font-dm-sans)", fontWeight: 700 }}>Other Sports</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.6rem" }}>
            <Link href="/sets/panini-prizm-nba" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Prizm NBA</Link>
            <Link href="/sets/panini-prizm-nfl" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Prizm NFL</Link>
            <Link href="/sets/topps-chrome-baseball" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Topps Chrome Baseball</Link>
            <Link href="/sets" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>View All Sets →</Link>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "1rem", fontFamily: "var(--font-dm-sans)", fontWeight: 700 }}>Legal</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.6rem" }}>
            <Link href="/privacy" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: "14px", color: "#666", textDecoration: "none" }}>Terms of Service</Link>
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: "1rem", fontFamily: "var(--font-dm-sans)", fontWeight: 700 }}>Follow Us</div>
        <a href="https://instagram.com/boxx_hq" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "36px", height: "36px", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3aaa35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="#3aaa35" stroke="none"/>
            </svg>
          </div>
          <span style={{ fontSize: "14px", color: "#666" }}>@boxx_hq</span>
        </a>
      </div>

    </div>

    <div style={{ borderTop: "1px solid #e0d9cc", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: "1rem" }}>
      <div style={{ fontSize: "12px", color: "#aaa" }}>
        © 2026 Boxxond. All rights reserved.
      </div>
      <div style={{ fontSize: "12px", color: "#aaa" }}>
        Price data sourced from eBay UK via the eBay Browse API. Boxxond is an eBay Partner Network affiliate.
      </div>
    </div>

  </div>
</footer>

      </body>
    </html>
  );
}