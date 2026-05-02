import Nav from '../../../components/Nav';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSetBySlug, getChecklistHref } from '../../../lib/sets';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const set = getSetBySlug(slug);
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
    alternates: {
      canonical: `https://boxxhq.com/sets/${slug}`,
    },
  };
}

export default async function SetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const set = getSetBySlug(slug);

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

  const checklistHref = getChecklistHref(set);
  const isInteractive = set.checklistType === 'interactive';

  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>

      <Nav activePage="sets" />

      <div style={{ padding: "2.5rem 2rem", maxWidth: "800px", margin: "0 auto" }}>

        <Link href="/sets" style={{ color: "#888", fontSize: "13px", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>← Back to Sets & Releases</Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" as const }}>
          <h1 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 800, fontSize: "clamp(28px, 5vw, 44px)", letterSpacing: "-1px", margin: 0 }}>{set.name}</h1>
          <span style={{ background: difficultyColour[set.difficulty], color: difficultyText[set.difficulty], fontSize: "11px", padding: "3px 10px", borderRadius: "4px", fontWeight: 500 }}>{set.difficulty}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem", flexWrap: "wrap" as const }}>
          <div style={{ fontSize: "13px", color: "#3aaa35", fontWeight: 600 }}>{set.manufacturer} · {set.year}</div>
          {checklistHref && (
            isInteractive ? (
              <Link href={checklistHref} style={{ background: "#1F6F3A", color: "#fff", fontSize: "12px", fontWeight: 700, padding: "6px 14px", borderRadius: "6px", textDecoration: "none" }}>
                View Full Checklist →
              </Link>
            ) : (
              <a href={checklistHref} target="_blank" rel="noopener noreferrer" style={{ background: "#1F6F3A", color: "#fff", fontSize: "12px", fontWeight: 700, padding: "6px 14px", borderRadius: "6px", textDecoration: "none" }}>
                View Full Checklist →
              </a>
            )
          )}
        </div>

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
                {set.parallels.map((p, i) => (
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
            {set.tips.map((tip, i) => (
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