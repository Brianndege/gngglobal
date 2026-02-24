import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata = {
  title: "Terms of Use - GNG Global Investment Group",
  description: "Terms of Use for the GNG Global Investment Group website. Please read these terms carefully before using our website.",
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Portfolio",
    href: "/portfolio",
    children: [
      { label: "All Companies", href: "/portfolio" },
      { label: "GNG Healthcare Group", href: "/portfolio/healthcare" },
      { label: "GNG Property Group", href: "/portfolio/property" },
      { label: "Scenes", href: "/portfolio/scenes" },
    ],
  },
  { label: "News & Media", href: "/news" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        <LegalHero
          title="Terms of Use"
          subtitle="Please read these terms carefully before using the GNG Global Investment Group website"
          image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=90"
          height="sm"
        />

        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal direction="up">
                <div className="prose prose-lg max-w-none font-inter text-charcoal-700">
                  <p className="text-sm text-charcoal-500 mb-8">Last updated: January 2025</p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">1. Acceptance of Terms</h2>
                  <p className="leading-relaxed mb-8">
                    By accessing and using the GNG Global Investment Group website (gngglobal.com.au), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this website.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">2. General Information Only</h2>
                  <p className="leading-relaxed mb-8">
                    The content on this website is provided for general information purposes only. Nothing on this website constitutes financial, investment, legal, or other professional advice. You should seek independent professional advice before making any investment or financial decision.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">3. No Investment Offer</h2>
                  <p className="leading-relaxed mb-8">
                    Information on this website does not constitute an offer to sell, or a solicitation of an offer to buy, any investment product or financial instrument. Any investment opportunities are subject to separate agreements and regulatory requirements.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">4. Intellectual Property</h2>
                  <p className="leading-relaxed mb-8">
                    All content on this website, including text, graphics, logos, images, and software, is the property of GNG Global Investment Group Pty Ltd or its content suppliers and is protected by Australian and international copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">5. Limitation of Liability</h2>
                  <p className="leading-relaxed mb-8">
                    To the maximum extent permitted by law, GNG Global Investment Group Pty Ltd and its related entities will not be liable for any loss or damage arising from your use of, or reliance on, information contained on this website. This includes direct, indirect, incidental, consequential, or punitive damages.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">6. Third-Party Links</h2>
                  <p className="leading-relaxed mb-8">
                    This website may contain links to third-party websites. These links are provided for convenience only. GNG Global Investment Group does not endorse, control, or accept responsibility for the content of linked sites. Use of third-party websites is at your own risk.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">7. Accuracy of Information</h2>
                  <p className="leading-relaxed mb-8">
                    While we endeavour to keep information on this website current and accurate, we make no representations or warranties about its completeness, accuracy, or suitability for any purpose. Information may be changed or updated without notice.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">8. Governing Law</h2>
                  <p className="leading-relaxed mb-8">
                    These Terms of Use are governed by the laws of Western Australia, Australia. Any disputes arising from these terms or your use of this website are subject to the exclusive jurisdiction of the courts of Western Australia.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">9. Changes to Terms</h2>
                  <p className="leading-relaxed mb-8">
                    We reserve the right to modify these Terms of Use at any time. Your continued use of this website after any changes constitutes your acceptance of the updated terms.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">10. Contact Us</h2>
                  <p className="leading-relaxed mb-4">
                    For questions regarding these Terms of Use, please contact:
                  </p>
                  <div className="bg-ivory-50 p-6 rounded-lg border border-ivory-300 mb-8">
                    <p className="font-semibold text-navy-800 mb-1">GNG Global Investment Group Pty Ltd</p>
                    <p>136 Stirling Highway, Nedlands WA 6009</p>
                    <p>Email: <a href="mailto:info@gngglobal.com.au" className="text-gold hover:underline">info@gngglobal.com.au</a></p>
                    <p>Phone: <a href="tel:+61893058580" className="text-gold hover:underline">(08) 9305 8580</a></p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
