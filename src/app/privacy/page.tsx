import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { navItems } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy - GNG Global Investment Group",
  description:
    "Privacy Policy for GNG Global Investment Group. Learn how we collect, use, and protect your personal information.",
};



export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        <LegalHero
          title="Privacy Policy"
          subtitle="How we collect, use, and protect your personal information"
          image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=90"
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
                    1. Introduction
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-8">
                    GNG Global Investment Group Pty Ltd and its related entities (&quot;GNG
                    Global&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) are committed
                    to protecting your privacy. This Privacy Policy explains how we collect, use,
                    disclose, and safeguard your personal information in accordance with the
                    Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    2. Information We Collect
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-4">
                    We may collect the following types of personal information:
                  </p>
                  <ul className="font-inter text-charcoal-700 leading-relaxed mb-8 space-y-2 list-disc pl-6">
                    <li>Contact information (name, email address, phone number, company)</li>
                    <li>Communications you send us via our contact form or email</li>
                    <li>Technical information such as IP address and browser type when you visit our website</li>
                    <li>Any other information you voluntarily provide to us</li>
                  </ul>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    3. How We Use Your Information
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-4">
                    We use your personal information to:
                  </p>
                  <ul className="font-inter text-charcoal-700 leading-relaxed mb-8 space-y-2 list-disc pl-6">
                    <li>Respond to your enquiries and provide the services you request</li>
                    <li>Send you information about our services and investment opportunities</li>
                    <li>Improve our website and services</li>
                    <li>Comply with our legal obligations</li>
                  </ul>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    4. Disclosure of Your Information
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-8">
                    We will not sell, trade, or rent your personal information to third parties.
                    We may share your information with our related entities and trusted service
                    providers who assist us in operating our website and conducting our business,
                    provided they agree to keep your information confidential.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    5. Data Security
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-8">
                    We implement appropriate technical and organisational measures to protect your
                    personal information against unauthorised access, alteration, disclosure, or
                    destruction. However, no method of transmission over the internet is 100%
                    secure.
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    6. Your Rights
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-8">
                    You have the right to access, correct, or request deletion of your personal
                    information. To exercise these rights, please contact us at{" "}
                    <a
                      href="mailto:info@gngglobal.com.au"
                      className="text-gold hover:text-gold-700 transition-colors"
                    >
                      info@gngglobal.com.au
                    </a>
                    .
                  </p>

                  <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-6">
                    7. Contact Us
                  </h2>
                  <p className="font-inter text-charcoal-700 leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy or our privacy practices,
                    please contact us:
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
