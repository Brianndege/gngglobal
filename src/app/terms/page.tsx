import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { navItems } from "@/lib/constants";

export const metadata = {
  title: "Terms of Use - GNG Global Investment Group",
  description:
    "Terms of Use for GNG Global Investment Group website. Please read these terms carefully before using our site.",
};



export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        <LegalHero
          title="Terms of Use"
          subtitle="Please read these terms carefully before using our website"
          image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=90"
          height="sm"
        />

        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal direction="up">
                <div className="prose prose-lg max-w-none">
                  <p className="font-inter text-charcoal-600 leading-relaxed mb-8">
                    Last updated: {new Date().getFullYear()}
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    1. Acceptance of Terms
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-8">
                    By accessing or using the GNG Global Investment Group website
                    (gngglobal.com.au), you agree to be bound by these Terms of Use. If you do
                    not agree to these terms, please do not use our website.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    2. Use of Website
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-4">
                    You agree to use this website only for lawful purposes. You must not:
                  </p>
                  <ul className="font-inter text-charcoal-700 leading-relaxed mb-8 space-y-2 list-disc pl-6">
                    <li>Use the site in any way that violates applicable laws or regulations</li>
                    <li>Transmit any unsolicited or unauthorised advertising or promotional material</li>
                    <li>Attempt to gain unauthorised access to any part of the website</li>
                    <li>Engage in any conduct that restricts or inhibits others from using the site</li>
                  </ul>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    3. Intellectual Property
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-8">
                    All content on this website, including text, graphics, logos, and images, is
                    the property of GNG Global Investment Group Pty Ltd or its content suppliers
                    and is protected by Australian and international copyright laws. You may not
                    reproduce, distribute, or create derivative works without our express written
                    permission.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    4. No Financial Advice
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-8">
                    The information provided on this website is for general informational purposes
                    only and does not constitute financial, investment, legal, or other
                    professional advice. You should seek independent professional advice before
                    making any investment decisions.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    5. Limitation of Liability
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-8">
                    To the maximum extent permitted by law, GNG Global Investment Group Pty Ltd
                    will not be liable for any direct, indirect, incidental, special, or
                    consequential damages arising from your use of, or inability to use, this
                    website or its content.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    6. Governing Law
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-8">
                    These Terms of Use are governed by the laws of Western Australia, Australia.
                    Any disputes arising under these terms shall be subject to the exclusive
                    jurisdiction of the courts of Western Australia.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    7. Changes to Terms
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-8">
                    We reserve the right to modify these Terms of Use at any time. Changes will
                    be effective immediately upon posting to the website. Your continued use of
                    the website after any changes constitutes your acceptance of the new terms.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    8. Contact Us
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-4">
                    If you have any questions about these Terms of Use, please contact us:
                  </p>
                  <div className="bg-ivory-50 p-6 rounded-lg border border-ivory-300">
                    <p className="font-inter text-charcoal-700 leading-relaxed">
                      <strong>GNG Global Investment Group Pty Ltd</strong>
                      <br />
                      136 Stirling Highway, Nedlands WA 6009
                      <br />
                      Email:{" "}
                      <a
                        href="mailto:info@gngglobal.com.au"
                        className="text-gold hover:text-gold-700 transition-colors"
                      >
                        info@gngglobal.com.au
                      </a>
                      <br />
                      Phone:{" "}
                      <a
                        href="tel:+61893058580"
                        className="text-gold hover:text-gold-700 transition-colors"
                      >
                        (08) 9305 8580
                      </a>
                    </p>
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
