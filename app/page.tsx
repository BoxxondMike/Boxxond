import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boxxond | Football Card Price Tracker",
  description: "Real sold prices from eBay. Track football card values across the UK market.",
};

export default function Home() {
  return (
    <main style={{ background: "#080c10", minHeight: "100vh", color: "#ffffff", fontFamily: "DM Sans, sans-serif" }}>
      
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-1px" }}>
          boxx<span style={{ color: "#00e87a" }}>ond</span>
        </div>
        <div style={{ display: "flex", gap: "2rem", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Prices</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Players</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Sets</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Breaks</a>
        </div>
        <button style={{ background: "#00e87a", color: "#080c10", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "13px", padding: "10px 22px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Sign Up Free
        </button>
      </nav>

      {/* Hero */}
      <div style={{ padding: "4rem 2rem 3rem", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(0,232,122,0.1)", border: "1px solid rgba(0,232,122,0.25)", color: "#00e87a", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1.5rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
          Football Card Price Tracker
        </div>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(40px, 7vw, 68px)", lineHeight: 1.05, margin: "0 0 1.5rem", letterSpacing: "-2px" }}>
          Know what your<br /><span style={{ color: "#00e87a" }}>cards are worth</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 2.5rem" }}>
          Real sold prices from eBay. No guesswork. Track players, sets and box values across the entire UK market.
        </p>
        <div style={{ display: "flex", maxWidth: "520px", margin: "0 auto", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" }}>
          <input type="text" placeholder="Search player, set or card..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "15px", padding: "14px 18px" }} />
          <button style={{ background: "#00e87a", border: "none", color: "#080c10", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "13px", padding: "0 22px", cursor: "pointer" }}>Search</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", padding: "1.5rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {[["2.4M+", "Sales tracked"], ["48hrs", "Data refresh"], ["£0", "Free to use"], ["12K+", "Cards indexed"]].map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "24px", letterSpacing: "-1px", display: "block" }}>{num}</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Recent Sales */}
      <div style={{ padding: "2.5rem 2rem", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "17px" }}>Recent Sales</span>
          <a href="#" style={{ fontSize: "13px", color: "#00e87a", textDecoration: "none" }}>View all →</a>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr>
                {["Player", "Card", "Platform", "Sold Price", "Date"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" as const, letterSpacing: "0.5px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Jude Bellingham", "Topps Chrome Auto /99", "£385", "Today"],
                ["Bukayo Saka", "Prizm Silver PSA 10", "£210", "Today"],
                ["Erling Haaland", "Select Tri-Color /49", "£540", "Yesterday"],
                ["Cole Palmer", "Topps Chrome RC PSA 9", "£145", "Yesterday"],
                ["Phil Foden", "Prizm EPL Gold /10", "£890", "2 days ago"],
              ].map(([player, card, price, date]) => (
                <tr key={player}>
                  <td style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#fff", fontWeight: 500 }}>{player}</td>
                  <td style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}>{card}</td>
                  <td style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ background: "rgba(0,232,122,0.1)", color: "#00e87a", fontSize: "10px", padding: "2px 8px", borderRadius: "4px" }}>eBay UK</span>
                  </td>
                  <td style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "15px", color: "#00e87a" }}>{price}</td>
                  <td style={{ padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}>{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}