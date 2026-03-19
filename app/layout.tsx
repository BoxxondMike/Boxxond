import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
  title: "Boxxond | Football Card Price Tracker",
  description: "Real sold prices from eBay. Track football card values across the UK market.",
  icons: {
    icon: "/logo.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable}`}>
        {children}

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#080c10", padding: "3rem 2rem", marginTop: "4rem" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem", marginBottom: "2.5rem" }}>
              
              {/* Logo and tagline */}
              <div>
                <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "22px", letterSpacing: "-1px", color: "#fff", marginBottom: "0.5rem" }}>
                  boxx<span style={{ color: "#f0b429" }}>ond</span>
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", maxWidth: "220px", lineHeight: 1.6 }}>
                  Real sold prices from eBay. The UK's football card price tracker.
                </div>
              </div>

              {/* Links */}
              <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", fontFamily: "var(--font-syne)", fontWeight: 700 }}>Explore</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <Link href="/" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Price Tracker</Link>
                    <Link href="/sets" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Card Sets</Link>
                    <a href="#" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Live Breaks</a>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", fontFamily: "var(--font-syne)", fontWeight: 700 }}>Sets</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <Link href="/sets/topps-chrome" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Topps Chrome</Link>
                    <Link href="/sets/panini-prizm-epl" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Panini Prizm EPL</Link>
                    <Link href="/sets/topps-match-attax" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Match Attax</Link>
                    <Link href="/sets/merlin" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Merlin</Link>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", fontFamily: "var(--font-syne)", fontWeight: 700 }}>Follow Us</div>
                <a href="https://instagram.com/boxxond" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                  <div style={{ width: "36px", height: "36px", background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.25)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0b429" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="#f0b429" stroke="none"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>@boxxond</span>
                </a>
              </div>

            </div>

            {/* Bottom row */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
                © 2025 Boxxond. All rights reserved.
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
                Price data sourced from eBay UK. Not affiliated with eBay.
              </div>
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}