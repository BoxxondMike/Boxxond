import Nav from '../../components/Nav';

export default function PrivacyPage() {
  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>
      <Nav />

      <div style={{ padding: "3rem 1.25rem", maxWidth: "760px", margin: "0 auto" }}>

        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-block", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", color: "#3aaa35", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
            Legal
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, margin: "0 0 0.5rem", letterSpacing: "-1px" }}>Privacy Policy</h1>
          <p style={{ color: "#888)", fontSize: "14px", margin: 0 }}>Last updated: March 2026</p>
        </div>

        {[
          {
            title: "Who we are",
            content: "BoxxHQ is a UK-based trading card price tracker operated as a sole trader business based in England. Our website is located at BoxxHQ.com. For any privacy related queries please contact us at Boxx_hq on instagram."
          },
          {
            title: "What data we collect",
            content: "We collect the following personal data when you create an account: your email address and password (stored securely via Supabase). We also collect data you voluntarily provide such as saved cards and price alerts. We collect anonymised usage analytics via Google Analytics to understand how visitors use our site."
          },
          {
            title: "How we use your data",
            content: "We use your email address to create and manage your account, send you price alert emails you have subscribed to, and communicate important service updates. We do not sell your personal data to any third parties. We do not use your data for advertising purposes."
          },
          {
            title: "Email alerts",
            content: "If you set up card alerts on BoxxHQ, you will receive daily emails containing eBay UK listings matching your alert terms. These emails contain affiliate links to eBay via the eBay Partner Network. You can delete your alerts at any time from your dashboard to stop receiving these emails."
          },
          {
            title: "eBay affiliate links",
            content: "BoxxHQ participates in the eBay Partner Network affiliate programme. When you click a link to eBay from our site and make a purchase, we may earn a small commission. This does not affect the price you pay. All eBay listings shown on BoxxHQ are sourced via the eBay Browse API."
          },
          {
            title: "Cookies and analytics",
            content: "We use Google Analytics to collect anonymised data about how visitors use our site. This includes pages visited, time on site and general location data. This data is anonymised and cannot be used to identify you personally. You can opt out of Google Analytics tracking via your browser settings."
          },
          {
            title: "Data storage",
            content: "Your account data is stored securely using Supabase, a cloud database provider. Data is stored in the EU. We take reasonable technical measures to protect your data from unauthorised access."
          },
          {
            title: "Your rights",
            content: "Under UK GDPR you have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, and withdraw consent at any time. To exercise any of these rights please contact us at hello@BoxxHQ.com and we will respond within 30 days."
          },
          {
            title: "Data retention",
            content: "We retain your account data for as long as your account is active. If you delete your account all personal data associated with it will be removed within 30 days. Anonymised analytics data may be retained indefinitely."
          },
          {
            title: "Third party services",
            content: "BoxxHQ uses the following third party services: Supabase (database and authentication), Google Analytics (anonymised usage analytics), Resend (email delivery), eBay Browse API (listing data), eBay Partner Network (affiliate programme). Each of these services has their own privacy policy."
          },
          {
            title: "Changes to this policy",
            content: "We may update this privacy policy from time to time. We will notify registered users of any significant changes by email. The date at the top of this page indicates when the policy was last updated."
          },
          {
            title: "Contact us",
            content: "If you have any questions about this privacy policy or how we handle your data please contact us at boxx_hq on Instagram. We are based in England, United Kingdom."
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #f0ede6" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 0.75rem", color: "#3aaa35" }}>{section.title}</h2>
            <p style={{ fontSize: "14px", color: "#1a1a1a", lineHeight: 1.8, margin: 0 }}>{section.content}</p>
          </div>
        ))}

      </div>
    </main>
  );
}