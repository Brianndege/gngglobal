import Link from "next/link";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { navItems } from "@/lib/constants";

export const metadata = {
  title: "Scenes - GNG Global Investment Group",
  description:
    "Digital content company helping clients enhance their brand through integrated and interactive marketing campaigns.",
};



const capabilities = [
  {
    title: "Brand Development",
    description:
      "Strategic brand development and positioning that helps clients stand out in competitive markets and build lasting brand equity.",
  },
  {
    title: "Integrated Marketing Campaigns",
    description:
      "End-to-end campaign management across multiple channels, delivering cohesive messaging that resonates with target audiences.",
  },
  {
    title: "Digital Content Creation",
    description:
      "High-quality digital content including video, photography, copywriting, and social media content that engages and converts.",
  },
  {
    title: "Interactive Media Solutions",
    description:
      "Innovative interactive experiences including web, mobile, and emerging technologies that create meaningful brand interactions.",
  },
];

export default function ScenesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        {/* Hero Section */}
        <LegalHero
          title="Scenes"
          subtitle="Digital content company helping clients enhance their brand through integrated and interactive marketing campaigns"
          image="https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=1920&q=90"
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
                    Elevating Brands Through Storytelling
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8" />
                </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={0.2}>
                <div className="bg-ivory-50 p-10 rounded-lg border border-ivory-300 shadow-sm mb-10">
                  <p className="font-inter text-xl text-charcoal-700 leading-relaxed mb-6 text-center">
                    Scenes is a digital content company that helps clients enhance their brand
                    through integrated and interactive marketing campaigns. As part of the GNG
                    Global Investment Group portfolio, Scenes brings a strategic approach to
                    creative media.
                  </p>
                  <p className="font-inter text-lg text-charcoal-600 leading-relaxed text-center">
                    We combine compelling storytelling with data-driven strategies to create
                    content that drives engagement, builds brand loyalty, and delivers measurable
                    results.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-ivory-300 shadow-sm">
                    <div className="text-sm font-inter font-semibold text-charcoal-500 uppercase tracking-wider mb-2">
                      Sector
                    </div>
                    <div className="font-playfair text-xl font-bold text-navy-800">
                      Media &amp; Digital Content
                    </div>
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
                    <div className="font-playfair text-xl font-bold text-navy-800">Australia</div>
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
                    Creative and strategic digital media solutions for modern brands
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 gap-8">
                {capabilities.map((item, idx) => (
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
                  Elevate Your Brand with Scenes
                </h2>
                <div className="w-24 h-1 bg-gold mx-auto mb-8" />
                <p className="font-inter text-xl text-ivory-200 mb-10 leading-relaxed">
                  Interested in working with Scenes to enhance your brand presence? Get in touch
                  with our team to discuss how we can help.
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
