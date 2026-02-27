import Link from "next/link";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal, StaggeredGrid } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Building2, Heart, Image as ImageIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import { navItems } from "@/lib/constants";

export const metadata = {
  title: "Portfolio - GNG Global Investment Group",
  description: "Strategic investments across healthcare, property, and media sectors creating sustainable long-term value.",
};



const portfolioCompanies = [
  {
    id: "healthcare",
    name: "GNG Healthcare Group",
    sector: "Healthcare",
    icon: Heart,
    description: "Comprehensive healthcare and healthcare systems provider spanning NDIS services, aged care, and allied health across Western Australia.",
    location: "Perth, Bunbury, Albany, Mandurah",
    established: "2023",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    website: "https://gnghealthcare.com.au/",
    highlights: [
      "NDIS Scheme Disability Services",
      "Residential Aged-Care Services",
      "Allied Health Services",
      "Community Nursing Care"
    ]
  },
  {
    id: "property",
    name: "GNG Property Group",
    sector: "Property",
    icon: Building2,
    description: "Real estate investment company focused on residential and commercial property development creating long-term sustainable value.",
    location: "Perth, Western Australia",
    established: "2023",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    highlights: [
      "Residential Property Investment",
      "Commercial Real Estate",
      "Property Development",
      "Strategic Portfolio Management"
    ]
  },
  {
    id: "scenes",
    name: "Scenes",
    sector: "Media & Digital Content",
    icon: ImageIcon,
    description: "Digital content company helping clients enhance their brand through integrated and interactive marketing campaigns.",
    location: "Australia",
    established: "2023",
    image: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&q=80",
    highlights: [
      "Brand Development",
      "Integrated Marketing Campaigns",
      "Digital Content Creation",
      "Interactive Media Solutions"
    ]
  },
];

const sectors = [
  {
    name: "Healthcare",
    description: "Comprehensive healthcare services, aged care, and disability support systems delivering quality care and support.",
    icon: Heart,
  },
  {
    name: "Property",
    description: "Residential and commercial real estate investment and development creating sustainable communities.",
    icon: Building2,
  },
  {
    name: "Media & Digital",
    description: "Digital content creation and integrated marketing solutions helping brands tell their story.",
    icon: ImageIcon,
  },
];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        {/* Hero Section */}
        <LegalHero
          title="Strategic Investments Across Multiple Sectors"
          subtitle="Creating sustainable value through the GNG Value Exchange framework"
          image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=90"
          height="lg"
        />

        {/* Introduction Section */}
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDE0YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNG0wIDI4YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNHpNMCAzNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMjggMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]" />

          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-12">
                  <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mb-6">
                    Investment Excellence
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                  <p className="font-inter text-xl text-charcoal-700 leading-relaxed">
                    Using "The GNG Value Exchange", we invest to create long-term and sustainable value for our portfolio companies and clients. The mutually beneficial value we create helps us drive strong economic, environmental and social outcomes.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Portfolio Companies - Sophisticated Cards */}
        <section className="py-20 md:py-32 bg-ivory-50">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mb-6">
                    Our Portfolio Companies
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto"></div>
                </div>
              </ScrollReveal>

              <StaggeredGrid pattern="diagonal" className="space-y-16">
                {portfolioCompanies.map((company, idx) => (
                  <ScrollReveal key={company.id} direction={idx % 2 === 0 ? "left" : "right"}>
                    <div className="group bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-ivory-300">
                      <div className={`grid lg:grid-cols-2 gap-0 ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                        {/* Image */}
                        <div className={`relative h-80 lg:h-auto overflow-hidden ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/40 to-transparent z-10" />
                          <img
                            src={company.image}
                            alt={company.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {/* Floating Icon */}
                          <div className="absolute top-6 left-6 z-20 w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                            <company.icon className="w-8 h-8 text-gold" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className={`p-8 lg:p-12 flex flex-col justify-center ${idx % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                          <div className="mb-4">
                            <span className="inline-block font-inter text-sm font-semibold tracking-wider text-gold uppercase border-b-2 border-gold pb-2">
                              {company.sector}
                            </span>
                          </div>

                          <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-navy-800 mb-4 group-hover:text-navy-900 transition-colors">
                            {company.name}
                          </h3>

                          <p className="font-inter text-lg text-charcoal-700 leading-relaxed mb-6">
                            {company.description}
                          </p>

                          {/* Details */}
                          <div className="space-y-2 mb-6 font-inter text-sm text-charcoal-600">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Location:</span>
                              <span>{company.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Established:</span>
                              <span>{company.established}</span>
                            </div>
                          </div>

                          {/* Highlights */}
                          <div className="mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {company.highlights.map((highlight, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                  <span className="font-inter text-sm text-charcoal-600">{highlight}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-4">
                            <Link href={`/portfolio/${company.id}`}>
                              <Button
                                variant="default"
                                className="bg-navy-800 hover:bg-navy-900 text-white group/btn"
                              >
                                Learn More
                                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                            {company.website && (
                              <a href={company.website} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                                  Visit Website
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </StaggeredGrid>
            </div>
          </div>
        </section>

        {/* Sectors Overview */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mb-6">
                    Investment Sectors
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                  <p className="font-inter text-xl text-charcoal-600 max-w-3xl mx-auto">
                    Focused expertise across key sectors driving sustainable growth and value creation
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-3 gap-8">
                {sectors.map((sector, idx) => (
                  <ScrollReveal key={sector.name} direction="up" delay={idx * 0.1}>
                    <div className="group bg-ivory-50 p-8 rounded-lg border-2 border-transparent hover:border-gold/50 hover:bg-white transition-all duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <sector.icon className="w-8 h-8 text-gold" />
                      </div>
                      <h3 className="font-playfair text-2xl font-bold text-navy-800 mb-4">
                        {sector.name}
                      </h3>
                      <div className="w-12 h-0.5 bg-gold/50 mb-4"></div>
                      <p className="font-inter text-charcoal-600 leading-relaxed">
                        {sector.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-navy-900 via-navy-800 to-charcoal-900 text-white">
          <div className="container mx-auto px-6">
            <ScrollReveal direction="scale">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                  Explore Investment Opportunities
                </h2>
                <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                <p className="font-inter text-xl text-ivory-200 mb-10 leading-relaxed">
                  Interested in learning more about our portfolio companies or investment approach? Our team is ready to discuss how we can create mutually beneficial outcomes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button size="lg" className="bg-gold hover:bg-gold-600 text-navy-900 font-semibold px-10">
                      Get in Touch
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-navy-900 px-10">
                      Learn About Our Approach
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
