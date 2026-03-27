import Nav from '../../components/Nav';

export default function TermsPage() {
  return (
    <main style={{ background: "#faf7f0", minHeight: "100vh", color: "#1a1a1a", fontFamily: "var(--font-dm-sans)" }}>
      <Nav />

      <div style={{ padding: "3rem 1.25rem", maxWidth: "760px", margin: "0 auto" }}>

        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-block", background: "rgba(58,170,53,0.1)", border: "1px solid rgba(58,170,53,0.25)", color: "#3aaa35", fontSize: "11px", fontWeight: 500, padding: "5px 14px", borderRadius: "20px", marginBottom: "1rem", letterSpacing: "1px", textTransform: "uppercase" as const }}>
            Legal
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, margin: "0 0 0.5rem", letterSpacing: "-1px" }}>Terms of Service</h1>
          <p style={{ color: "#888)", fontSize: "14px", margin: 0 }}>Last updated: March 2026</p>
        </div>

        {[
          {
            title: "Acceptance of terms",
            content: "By accessing or using Boxxond (boxxond.com) you agree to be bound by these Terms of Service. If you do not agree to these terms please do not use our service. We reserve the right to update these terms at any time and will notify registered users of significant changes."
          },
          {
            title: "About Boxxond",
            content: "Boxxond is a UK-based trading card price tracker that displays live eBay UK listing data to help collectors research card values. We are not a marketplace and do not facilitate the buying or selling of trading cards directly. All purchases are made through eBay."
          },
          {
            title: "Use of the service",
            content: "You may use Boxxond for personal, non-commercial purposes only. You must not use Boxxond to scrape, copy or redistribute our data. You must not attempt to gain unauthorised access to any part of our service. You must be at least 13 years old to create an account."
          },
          {
            title: "Accounts",
            content: "When you create an account you are responsible for maintaining the security of your account credentials. You are responsible for all activity that occurs under your account. We reserve the right to suspend or terminate accounts that violate these terms."
          },
          {
            title: "Price data accuracy",
            content: "All price data displayed on Boxxond is sourced from eBay UK via the eBay Browse API and reflects live listings at the time of retrieval. Prices are indicative only and may not reflect actual sold prices. Boxxond makes no guarantees about the accuracy, completeness or timeliness of price data. Do not rely solely on Boxxond data when making purchasing decisions."
          },
          {
            title: "eBay affiliate links",
            content: "Boxxond participates in the eBay Partner Network. Links to eBay listings on our site are affiliate links and we may earn a commission if you make a purchase after clicking through. This does not affect the price you pay on eBay. We only link to legitimate eBay listings and do not endorse any specific seller."
          },
          {
            title: "Card alerts and email notifications",
            content: "By setting up card alerts you consent to receiving daily email notifications from Boxxond. These emails contain eBay listing data and affiliate links. You can unsubscribe at any time by removing your alerts from your dashboard. We will not send promotional emails unrelated to your alerts without your explicit consent."
          },
          {
            title: "Intellectual property",
            content: "All content on Boxxond including text, design, logos and code is the property of Boxxond unless otherwise stated. Card images displayed on Boxxond are sourced from eBay listings and remain the property of their respective owners. You may not reproduce or redistribute Boxxond content without permission."
          },
          {
            title: "Disclaimer of warranties",
            content: "Boxxond is provided on an as-is basis without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free or that defects will be corrected. We are not responsible for any losses arising from your use of or inability to use the service."
          },
          {
            title: "Limitation of liability",
            content: "To the maximum extent permitted by law, Boxxond shall not be liable for any indirect, incidental, special or consequential damages arising from your use of the service. Our total liability to you shall not exceed the amount you have paid us in the past 12 months, if any."
          },
          {
            title: "Third party services",
            content: "Boxxond uses third party services including eBay, Supabase, Google Analytics and Resend. Your use of these services is subject to their own terms and privacy policies. We are not responsible for the practices of these third party services."
          },
          {
            title: "Governing law",
            content: "These terms are governed by the laws of England and Wales. Any disputes arising from these terms or your use of Boxxond shall be subject to the exclusive jurisdiction of the courts of England and Wales."
          },
          {
            title: "Contact us",
            content: "If you have any questions about these Terms of Service please contact us at hello@boxxond.com."
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #f0ede6" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 0.75rem", color: "#3aaa35" }}>{section.title}</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: 0 }}>{section.content}</p>
          </div>
        ))}

      </div>
    </main>
  );
}