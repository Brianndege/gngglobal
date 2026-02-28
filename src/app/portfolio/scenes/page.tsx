import type { Metadata } from "next";
import Link from "next/link";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { primaryNavItems, siteConfig } from "@/lib/site";
import { getBreadcrumbJsonLd, getPortfolioCompanyJsonLd, stringifyJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Scenes",
  description:
    "Digital content company helping private and public clients grow their brand through integrated and interactive campaigns.",
  alternates: {
    canonical: "/portfolio/scenes",
  },
};

export default function ScenesPage() {
  const breadcrumbJsonLd = stringifyJsonLd(
    getBreadcrumbJsonLd([
      { name: "Home", item: siteConfig.url },
      { name: "Portfolio", item: `${siteConfig.url}/portfolio` },
      { name: "Scenes", item: `${siteConfig.url}/portfolio/scenes` },
    ])
  );

  const companyJsonLd = stringifyJsonLd(
    getPortfolioCompanyJsonLd({
      name: "Scenes",
      description:
        "Scenes is a digital content company who helps private and public clients enhance and grow their brand by developing and implementing integrated and interactive marketing campaigns.",
      path: "/portfolio/scenes",
      sector: "Media & Digital Content",
    })
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <EnhancedNavigation items={primaryNavItems} />

      <main id="main-content" className="flex-grow">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: companyJsonLd }} />

        <section className="bg-gradient-to-br from-navy-700 to-charcoal-900 text-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <p className="text-gold mb-2 font-medium">Media & Digital Content</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Scenes</h1>
              <p className="text-xl text-ivory-200 mb-6">Australia</p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link href="/portfolio">Back to Portfolio</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-navy-700 mb-6">Overview</h2>
              <p className="text-lg text-charcoal-700 mb-6 leading-relaxed">
                Scenes is a digital content company who helps private and public clients enhance and grow their brand by developing and implementing integrated and interactive marketing campaigns.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-muted p-6 rounded-lg">
                  <div className="text-sm text-charcoal-500 mb-1">Sector</div>
                  <div className="text-lg font-semibold text-navy-700">Media & Digital Content</div>
                </div>
                <div className="bg-muted p-6 rounded-lg">
                  <div className="text-sm text-charcoal-500 mb-1">Established</div>
                  <div className="text-lg font-semibold text-navy-700">2023</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-navy-700 mb-8">Capabilities</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Integrated Campaign Design</h3>
                </div>
                <div className="bg-white p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Interactive Brand Experiences</h3>
                </div>
                <div className="bg-white p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Digital Content Strategy</h3>
                </div>
                <div className="bg-white p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Public & Private Sector Delivery</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
