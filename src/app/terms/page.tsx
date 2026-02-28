import type { Metadata } from "next";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import { primaryNavItems, siteConfig } from "@/lib/site";
import { getBreadcrumbJsonLd, stringifyJsonLd } from "@/lib/seo";

const lastUpdated = "28 February 2026";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for GNG Global Investment Group website.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  const breadcrumbJsonLd = stringifyJsonLd(
    getBreadcrumbJsonLd([
      { name: "Home", item: siteConfig.url },
      { name: "Terms of Use", item: `${siteConfig.url}/terms` },
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
              <h1 className="text-3xl font-bold text-navy-800 md:text-4xl">Terms of Use</h1>
              <p className="mt-3 text-sm text-charcoal-600">Last updated: {lastUpdated}</p>
            </header>

            <div className="space-y-8 text-charcoal-700">
              <section>
                <h2 className="text-2xl font-semibold text-navy-800">1. Acceptance</h2>
                <p className="mt-3">
                  By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree,
                  you should discontinue use of the website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">2. Website Content</h2>
                <p className="mt-3">
                  Content on this website is provided for general information only and may be updated without notice.
                  While we aim for accuracy, we do not guarantee completeness or currency of all information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">3. No Financial Advice</h2>
                <p className="mt-3">
                  Nothing on this website constitutes financial, legal, tax, or investment advice. You should obtain
                  independent professional advice before acting on any information contained on this site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">4. Intellectual Property</h2>
                <p className="mt-3">
                  Unless otherwise stated, all website content including text, design, graphics, and branding is owned
                  by or licensed to {siteConfig.name}. You may not reproduce or republish content without prior written consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">5. Third-Party Links</h2>
                <p className="mt-3">
                  This website may include links to third-party websites. We do not control and are not responsible for
                  the content, policies, or practices of third-party sites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">6. Limitation of Liability</h2>
                <p className="mt-3">
                  To the maximum extent permitted by law, {siteConfig.name} is not liable for any loss or damage arising
                  from use of, or reliance on, this website or its content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">7. Privacy</h2>
                <p className="mt-3">
                  Your use of this website is also governed by our Privacy Policy, available at /privacy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">8. Governing Law</h2>
                <p className="mt-3">
                  These Terms of Use are governed by the laws of Western Australia, and you submit to the non-exclusive
                  jurisdiction of its courts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-navy-800">9. Contact</h2>
                <p className="mt-3">
                  For questions about these Terms, contact {" "}
                  <a className="text-navy-700 underline hover:text-navy-900" href={`mailto:${siteConfig.contact.email}`}>
                    {siteConfig.contact.email}
                  </a>
                  .
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
