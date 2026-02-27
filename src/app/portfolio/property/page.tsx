import Link from "next/link";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { navItems } from "@/lib/constants";

export const metadata = {
  title: "GNG Property Group - GNG Global Investment Group",
  description:
    "Real estate investment company focused on residential and commercial property development creating long-term sustainable value in Perth, Western Australia.",
};



const highlights = [
  {
    title: "Residential Property Investment",
    description:
      "Strategic acquisition and management of residential properties across Perth and surrounding areas, focusing on high-growth suburbs.",
  },
  {
    title: "Commercial Real Estate",
    description:
      "Investment in commercial properties that deliver strong rental yields and long-term capital appreciation.",
  },
  {
    title: "Property Development",
    description:
      "End-to-end property development projects delivering quality residential and mixed-use developments.",
  },
  {
    title: "Strategic Portfolio Management",
    description:
      "Active portfolio management ensuring optimal asset allocation, performance, and risk-adjusted returns.",
  },
];

export default function PropertyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        {/* Hero Section */}
        <LegalHero
          title="GNG Property Group"
          subtitle="Real estate investment company focused on residential and commercial property development creating long-term sustainable value in Perth, Western Australia"
          image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=90"
          height="lg"
        />

        {/* Overview */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-12">
                  <span className="font-inter text-sm font-semibold tracking-wider text-gold uppercase border-b-2 border-gold pb-2">
                    Overview
                  </span>
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mt-6 mb-6">
                    Sustainable Property Value
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8" />
                </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={0.2}>
                <div className="bg-ivory-50 p-10 rounded-lg border border-ivory-300 shadow-sm mb-10">
                  <p className="font-inter text-xl text-charcoal-700 leading-relaxed mb-6 text-center">
                    GNG Property Group is a real estate investment company focused on residential
                    and commercial property development in Perth, Western Australia. Using the GNG
                    Value Exchange framework, we create long-term sustainable value for investors
                    and the communities we develop in.
                  </p>
                  <p className="font-inter text-lg text-charcoal-600 leading-relaxed text-center">
                    Our approach combines strategic site selection, quality development, and active
                    portfolio management to deliver exceptional returns.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-ivory-300 shadow-sm">
                    <div className="text-sm font-inter font-semibold text-charcoal-500 uppercase tracking-wider mb-2">
                      Sector
                    </div>
                    <div className="font-playfair text-xl font-bold text-navy-800">Property</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-ivory-300 shadow-sm">
                    <div className="text-sm font-inter font-semibold text-charcoal-500 uppercase tracking-wider mb-2">
                      Established
                    </div>
                    <div className="font-playfair text-xl font-bold text-navy-800">2023</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-ivory-300 shadow-sm sm:col-span-2">
                    <div className="text-sm font-inter font-semibold text-charcoal-500 uppercase tracking-wider mb-2">
                      Location
                    </div>
                    <div className="font-playfair text-xl font-bold text-navy-800">
                      Perth, Western Australia
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-20 md:py-28 bg-ivory-50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mb-6">
                    Our Capabilities
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8" />
                  <p className="font-inter text-xl text-charcoal-600 max-w-3xl mx-auto">
                    Comprehensive property investment and development expertise
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 gap-8">
                {highlights.map((item, idx) => (
                  <ScrollReveal key={item.title} direction="up" delay={idx * 0.1}>
                    <div className="group bg-white p-8 rounded-lg border border-ivory-300 shadow-sm hover:border-gold/50 hover:shadow-md transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center mt-0.5">
                          <CheckCircle2 className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <h3 className="font-playfair text-xl font-bold text-navy-800 mb-3 group-hover:text-navy-900 transition-colors">
                            {item.title}
                          </h3>
                          <p className="font-inter text-charcoal-600 leading-relaxed">
                            {item.description}
                          </p>
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
                <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                  Explore Property Opportunities
                </h2>
                <div className="w-24 h-1 bg-gold mx-auto mb-8" />
                <p className="font-inter text-xl text-ivory-200 mb-10 leading-relaxed">
                  Interested in learning more about GNG Property Group&apos;s investment approach
                  and portfolio? Get in touch with our team today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button
                      size="lg"
                      className="bg-gold hover:bg-gold-600 text-navy-900 font-inter font-semibold px-10"
                    >
                      Get in Touch
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/portfolio">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-navy-900 px-10"
                    >
                      Back to Portfolio
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
