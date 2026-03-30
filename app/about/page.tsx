import Nav from '../../components/Nav';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>
      <Nav />

      {/* Hero */}
      <div style={{ padding: "3rem 1.25rem 2.5rem", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", color: "#3aaa35", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1.5rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
          About Boxxhq
        </div>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.05, margin: "0 0 1.25rem", letterSpacing: "-2px" }}>
          Built by a collector,<br /><span style={{ color: "#3aaa35" }}>for collectors</span>
        </h1>
        <p style={{ color: "#666", fontSize: "15px", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto" }}>
          Boxxhq exists to bring transparency, community and passion back to the trading card hobby.
        </p>
      </div>

      <div style={{ padding: "0 1.25rem 4rem", maxWidth: "720px", margin: "0 auto" }}>

        {/* Story */}
        <div style={{ background: "#ffffff", borderRadius: "16px", padding: "2rem 2.5rem", border: "1px solid #e0d9cc", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 1rem", color: "#1a1a1a" }}>The Story</h2>
          <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.8, margin: "0 0 1rem" }}>
            Hi I'm Mike. Like most of us, I started young collecting football sticker albums, Pokémon cards, freebies from cereal boxes. The feeling of finally completing a collection. Then life got in the way and the hobby faded into the background.
          </p>
          <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.8, margin: "0 0 1rem" }}>
            Years later a friend brought me back into it. The hobby has transformed. The cards are incredible, names like retrofactor replacing shiny. The communities are so passionate, and the market had become something serious. My issue was finding reliable price data, knowing what things were actually worth, and navigating eBay as a UK collector? That was still a headache.
          </p>
          <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.8, margin: 0 }}>
            BoxxHQ was built to fix that. A clean, simple tool for UK collectors to track prices, discover cards and stay close to the hobby they love.
          </p>
        </div>

        {/* Physical vs Digital */}
        <div style={{ background: "rgba(58,170,53,0.06)", border: "1px solid rgba(58,170,53,0.15)", borderRadius: "16px", padding: "2rem 2.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 1rem", color: "#1a1a1a" }}>Why physical cards still matter</h2>
          <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.8, margin: 0 }}>
            In a world where everything is digital.  streaming, downloads, NFTs there's something genuinely special about holding a physical card. It's tangible. It's yours. A graded Bellingham rookie sitting in a case on your shelf means something that a digital asset never quite can. We believe in the lasting value of physical collections and the community that grows around them.
          </p>
        </div>

       <div style={{ textAlign: "center" }}>
  <Link href="/" style={{ display: "inline-block", background: "#3aaa35", color: "#faf7f0", padding: "12px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: 700, fontSize: "15px" }}>
    Start Tracking Cards →
  </Link>
  <p style={{ marginTop: "1.5rem", fontSize: "13px", color: "#aaa" }}></p>
</div>

      </div>
    </main>
  );
}