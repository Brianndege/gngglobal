import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata = {
  title: "Privacy Policy - GNG Global Investment Group",
  description: "Privacy Policy for GNG Global Investment Group. Learn how we collect, use, and protect your personal information.",
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        <LegalHero
          title="Privacy Policy"
          subtitle="How GNG Global Investment Group collects, uses, and protects your personal information"
          image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=90"
          height="sm"
        />

        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal direction="up">
                <div className="prose prose-lg max-w-none font-inter text-charcoal-700">
                  <p className="text-sm text-charcoal-500 mb-8">Last updated: January 2025</p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">1. Introduction</h2>
                  <p className="leading-relaxed mb-6">
                    GNG Global Investment Group Pty Ltd and its related entities ("GNG Global", "we", "us", or "our") are committed to protecting your privacy and handling your personal information in accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
                  </p>
                  <p className="leading-relaxed mb-8">
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you interact with our website, services, or communicate with us.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">2. Information We Collect</h2>
                  <p className="leading-relaxed mb-4">We may collect the following types of personal information:</p>
                  <ul className="list-disc pl-6 mb-8 space-y-2">
                    <li>Contact information (name, email address, phone number, company name)</li>
                    <li>Correspondence and communications you send to us</li>
                    <li>Website usage data (via cookies and analytics tools)</li>
                    <li>Business and investment-related information you provide</li>
                    <li>Information provided in connection with enquiries or applications</li>
                  </ul>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">3. How We Use Your Information</h2>
                  <p className="leading-relaxed mb-4">We use your personal information to:</p>
                  <ul className="list-disc pl-6 mb-8 space-y-2">
                    <li>Respond to your enquiries and provide requested information</li>
                    <li>Communicate about investment opportunities and portfolio updates</li>
                    <li>Improve our website and services</li>
                    <li>Comply with legal and regulatory obligations</li>
                    <li>Send newsletters or updates (only with your consent)</li>
                  </ul>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">4. Disclosure of Your Information</h2>
                  <p className="leading-relaxed mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may disclose your information to:
                  </p>
                  <ul className="list-disc pl-6 mb-8 space-y-2">
                    <li>Our portfolio companies and subsidiaries where relevant</li>
                    <li>Service providers who assist in our operations (subject to confidentiality obligations)</li>
                    <li>Legal and regulatory authorities where required by law</li>
                    <li>Professional advisers including lawyers and accountants</li>
                  </ul>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">5. Data Security</h2>
                  <p className="leading-relaxed mb-8">
                    We take reasonable steps to protect your personal information from unauthorised access, modification, disclosure, or misuse. Our security measures include technical safeguards, access controls, and staff training. However, no method of transmission over the internet is 100% secure.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">6. Cookies</h2>
                  <p className="leading-relaxed mb-8">
                    Our website may use cookies to enhance your browsing experience and collect aggregate usage data. You can configure your browser to refuse cookies, although this may limit some website functionality.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">7. Access and Correction</h2>
                  <p className="leading-relaxed mb-8">
                    You have the right to request access to the personal information we hold about you and to request correction of any inaccuracies. To make such a request, please contact us at the details below.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">8. Contact Us</h2>
                  <p className="leading-relaxed mb-4">
                    For privacy-related enquiries, complaints, or to exercise your rights, please contact:
                  </p>
                  <div className="bg-ivory-50 p-6 rounded-lg border border-ivory-300 mb-8">
                    <p className="font-semibold text-navy-800 mb-1">GNG Global Investment Group Pty Ltd</p>
                    <p>136 Stirling Highway, Nedlands WA 6009</p>
                    <p>Email: <a href="mailto:info@gngglobal.com.au" className="text-gold hover:underline">info@gngglobal.com.au</a></p>
                    <p>Phone: <a href="tel:+61893058580" className="text-gold hover:underline">(08) 9305 8580</a></p>
                  </div>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-4">9. Changes to This Policy</h2>
                  <p className="leading-relaxed mb-4">
                    We may update this Privacy Policy from time to time. The updated policy will be posted on our website with a revised date. We encourage you to review this policy periodically.
                  </p>
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
