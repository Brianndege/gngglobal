import type { Metadata } from "next";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import { primaryNavItems, siteConfig } from "@/lib/site";
import { getBreadcrumbJsonLd, stringifyJsonLd } from "@/lib/seo";

const lastUpdated = "28 February 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for GNG Global Investment Group.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const breadcrumbJsonLd = stringifyJsonLd(
    getBreadcrumbJsonLd([
      { name: "Home", item: siteConfig.url },
      { name: "Privacy Policy", item: `${siteConfig.url}/privacy` },
    ])
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <EnhancedNavigation items={primaryNavItems} />

      <main id="main-content" className="flex-grow pt-28 pb-16 md:pt-32 md:pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />

        <section className="container mx-auto px-4 sm:px-6">
          <article className="mx-auto max-w-4xl rounded-2xl border border-border bg-white p-6 shadow-sm md:p-10">
            <header className="mb-8 border-b border-border pb-6">
              <h1 className="text-3xl font-bold text-navy-800 md:text-4xl">Privacy Policy</h1>
              <p className="mt-3 text-sm text-charcoal-600">Last updated: {lastUpdated}</p>
            </header>

            <div className="space-y-8 text-charcoal-700">
              <section>
                <h2 className="text-2xl font-semibold text-navy-800">1. Overview</h2>
                <p className="mt-3">
                  {siteConfig.name} ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains
                  how we collect, use, store, and disclose personal information when you visit our website or contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">2. Information We Collect</h2>
                <p className="mt-3">We may collect the following personal information:</p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Contact details (such as name, email address, phone number, and company name).</li>
                  <li>Information you submit through forms, emails, or direct enquiries.</li>
                  <li>Technical data such as browser type, IP address, and pages visited.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">3. How We Use Information</h2>
                <p className="mt-3">We use personal information to:</p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Respond to enquiries and provide requested information.</li>
                  <li>Operate, maintain, and improve our website and services.</li>
                  <li>Communicate updates where relevant to your enquiry or relationship with us.</li>
                  <li>Comply with legal and regulatory obligations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">4. Cookies and Analytics</h2>
                <p className="mt-3">
                  Our website may use cookies or similar technologies to improve functionality and understand website usage.
                  You can adjust your browser settings to manage cookies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">5. Disclosure of Information</h2>
                <p className="mt-3">
                  We do not sell personal information. We may disclose information to service providers, professional advisers,
                  or authorities where required for operational, legal, or compliance purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">6. Data Security</h2>
                <p className="mt-3">
                  We take reasonable technical and organisational measures to protect personal information from misuse,
                  loss, unauthorised access, modification, or disclosure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">7. Access and Correction</h2>
                <p className="mt-3">
                  You may request access to or correction of your personal information by contacting us at {" "}
                  <a className="text-navy-700 underline hover:text-navy-900" href={`mailto:${siteConfig.contact.email}`}>
                    {siteConfig.contact.email}
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">8. Changes to This Policy</h2>
                <p className="mt-3">
                  We may update this Privacy Policy from time to time. The updated version will be published on this page
                  with a revised "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">9. Contact Us</h2>
                <p className="mt-3">
                  For privacy-related enquiries, contact us at {" "}
                  <a className="text-navy-700 underline hover:text-navy-900" href={`mailto:${siteConfig.contact.email}`}>
                    {siteConfig.contact.email}
                  </a>
                  {" "}or call {siteConfig.contact.phoneDisplay}.
                </p>
              </section>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
