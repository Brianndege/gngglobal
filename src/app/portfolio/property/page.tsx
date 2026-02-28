import type { Metadata } from "next";
import Link from "next/link";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { primaryNavItems, siteConfig } from "@/lib/site";
import { getBreadcrumbJsonLd, getPortfolioCompanyJsonLd, stringifyJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GNG Property Group",
  description:
    "Real estate investment company focused on residential and commercial property development in Perth, Western Australia.",
  alternates: {
    canonical: "/portfolio/property",
  },
};

export default function PropertyPage() {
  const breadcrumbJsonLd = stringifyJsonLd(
    getBreadcrumbJsonLd([
      { name: "Home", item: siteConfig.url },
      { name: "Portfolio", item: `${siteConfig.url}/portfolio` },
      { name: "GNG Property Group", item: `${siteConfig.url}/portfolio/property` },
    ])
  );

  const companyJsonLd = stringifyJsonLd(
    getPortfolioCompanyJsonLd({
      name: "GNG Property Group",
      description:
        "GNG Property Group is our affiliated real estate company, investing in both residential and commercial property to create long-term sustainable value.",
      path: "/portfolio/property",
      sector: "Property",
    })
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <EnhancedNavigation items={primaryNavItems} />

      <main id="main-content" className="flex-grow">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: companyJsonLd }} />

        <section className="bg-gradient-to-br from-navy-700 to-navy-900 text-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <p className="text-gold mb-2 font-medium">Property</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">GNG Property Group</h1>
              <p className="text-xl text-ivory-200 mb-6">Perth, Western Australia</p>
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
                GNG Property Group is our affiliated real estate company, investing in both residential and commercial property to create long-term sustainable value.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-muted p-6 rounded-lg">
                  <div className="text-sm text-charcoal-500 mb-1">Sector</div>
                  <div className="text-lg font-semibold text-navy-700">Property</div>
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
              <h2 className="text-3xl font-bold text-navy-700 mb-8">Focus Areas</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Residential Property Investment</h3>
                </div>
                <div className="bg-white p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Commercial Property Strategy</h3>
                </div>
                <div className="bg-white p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Long-Term Asset Growth</h3>
                </div>
                <div className="bg-white p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Sustainable Portfolio Management</h3>
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
