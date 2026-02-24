import Link from "next/link";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "GNG Property Group - GNG Global Investment Group",
  description: "Real estate investment company focused on residential and commercial property development creating long-term sustainable value in Perth, Western Australia.",
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

const highlights = [
  { title: "Residential Property Investment", description: "Strategic acquisition and management of residential properties across Perth's growing suburbs." },
  { title: "Commercial Real Estate", description: "Investment in commercial assets delivering strong yields and long-term capital growth." },
  { title: "Property Development", description: "Developing residential and mixed-use projects that create sustainable communities." },
  { title: "Strategic Portfolio Management", description: "Active portfolio management maximising returns while managing risk across all property holdings." },
];

export default function PropertyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        {/* Hero Section */}
        <LegalHero
          title="GNG Property Group"
          subtitle="Creating long-term sustainable value through strategic real estate investment and development"
          image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=90"
          height="lg"
        />

        {/* Overview */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <ScrollReveal direction="up">
                <div className="mb-4">
                  <span className="font-inter text-sm font-semibold tracking-wider text-gold uppercase border-b-2 border-gold pb-2">
                    Property
                  </span>
                </div>
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mb-6">Overview</h2>
                <div className="w-24 h-1 bg-gold mb-8" />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.1}>
                <p className="font-inter text-xl text-charcoal-700 leading-relaxed mb-8">
                  GNG Property Group is our affiliated real estate company, investing in both residential and commercial property to create long-term sustainable value. Using the GNG Value Exchange framework, every property investment is evaluated for its economic, environmental, and social impact.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-ivory-50 p-6 rounded-lg border border-ivory-300">
                    <div className="text-sm font-inter text-charcoal-500 mb-1 uppercase tracking-wider">Sector</div>
                    <div className="font-playfair text-xl font-bold text-navy-800">Property</div>
                  </div>
                  <div className="bg-ivory-50 p-6 rounded-lg border border-ivory-300">
                    <div className="text-sm font-inter text-charcoal-500 mb-1 uppercase tracking-wider">Established</div>
                    <div className="font-playfair text-xl font-bold text-navy-800">2023</div>
                  </div>
                  <div className="bg-ivory-50 p-6 rounded-lg border border-ivory-300">
                    <div className="text-sm font-inter text-charcoal-500 mb-1 uppercase tracking-wider">Location</div>
                    <div className="font-playfair text-xl font-bold text-navy-800">Perth, Western Australia</div>
                  </div>
                </div>

                <div className="flex gap-4 flex-wrap">
                  <Link href="/contact">
                    <Button className="bg-gold hover:bg-gold-600 text-navy-900 font-semibold">
                      Enquire Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/portfolio">
                    <Button variant="outline" className="border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white">
                      Back to Portfolio
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Investment Focus */}
        <section className="py-20 md:py-28 bg-ivory-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mb-6">Investment Focus</h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8" />
                  <p className="font-inter text-xl text-charcoal-600 max-w-3xl mx-auto">
                    Strategic property investment across residential and commercial sectors
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 gap-8">
                {highlights.map((item, idx) => (
                  <ScrollReveal key={item.title} direction="up" delay={idx * 0.1}>
                    <div className="bg-white p-8 rounded-lg border border-ivory-300 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                          <h3 className="font-playfair text-xl font-bold text-navy-800 mb-3">{item.title}</h3>
                          <p className="font-inter text-charcoal-600 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-navy-900 via-navy-800 to-charcoal-900 text-white">
          <div className="container mx-auto px-6">
            <ScrollReveal direction="scale">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Property Investment Opportunities</h2>
                <div className="w-24 h-1 bg-gold mx-auto mb-8" />
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {[
                    { label: "Long-term Value", description: "Investments designed for sustainable capital growth." },
                    { label: "Diversified Portfolio", description: "Residential and commercial assets across WA." },
                    { label: "Expert Management", description: "Professional property management and oversight." },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center text-center">
                      <CheckCircle2 className="w-10 h-10 text-gold mb-4" />
                      <h3 className="font-playfair text-xl font-bold mb-3">{item.label}</h3>
                      <p className="font-inter text-ivory-200 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
                <Link href="/contact">
                  <span className="inline-block px-10 py-4 bg-gold hover:bg-gold-600 text-navy-900 font-inter font-semibold rounded-md transition-all duration-300 hover:shadow-xl cursor-pointer">
                    Get in Touch
                  </span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
