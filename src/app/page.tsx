import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroCarousel from "@/components/HeroCarousel";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import { ScrollReveal, StaggeredGrid, ParallaxSection } from "@/components/ScrollReveal";
import AnimatedCardGrid from "@/components/AnimatedCardGrid";
import Footer from "@/components/Footer";

const heroSlides = [
  {
    id: "slide-1",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
    imageMobile: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    title: "GNG Global Investment Group is an investment firm founded in Perth, Australia",
    subtitle: "We have numerous strategic investments in a wide range of sectors and asset classes",
    ctaText: "Learn More",
    ctaLink: "/about",
    overlay: "gradient" as const,
  },
  {
    id: "slide-2",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80",
    imageMobile: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    title: "The GNG Value Exchange",
    subtitle: "Our proprietary framework for generating long-term mutually beneficial outcomes",
    ctaText: "Discover Our Approach",
    ctaLink: "/about",
    overlay: "gradient" as const,
  },
  {
    id: "slide-3",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1920&q=80",
    imageMobile: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
    title: "Strategic Investments Across Multiple Sectors",
    subtitle: "Healthcare, media, financial services, advisory services, and more",
    ctaText: "View Portfolio",
    ctaLink: "/portfolio",
    overlay: "dark" as const,
  },
];

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

const portfolioCards = [
  {
    id: "healthcare",
    title: "GNG Healthcare Group",
    description: "Comprehensive healthcare and healthcare systems provider spanning NDIS services, aged care, and allied health across Western Australia.",
    category: "Healthcare",
    link: "/portfolio/healthcare",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
  },
  {
    id: "property",
    title: "GNG Property Group",
    description: "Real estate investment company focused on residential and commercial property development in Perth, Western Australia.",
    category: "Property",
    link: "/portfolio/property",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
  },
  {
    id: "scenes",
    title: "Scenes",
    description: "Digital content company helping clients enhance their brand through integrated and interactive marketing campaigns.",
    category: "Media & Digital Content",
    link: "/portfolio/scenes",
    image: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=600&q=80",
  },
];

const newsCards = [
  {
    id: "kenya-visit",
    title: "GNG Global Investment Group Directors Visit Kenya High Commissioner to Australia",
    description: "GNG Global Investment Group Directors met with the Kenya High Commissioner to discuss strategic partnerships and investment opportunities.",
    category: "Economy",
    link: "/news",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
  },
  {
    id: "launch-party",
    title: "GNG Global Investment Group Launch Party: A Celebration of Vision and Innovation",
    description: "Celebrating our official launch with partners, clients, and stakeholders, marking a new chapter in strategic investment.",
    category: "Company News",
    link: "/news",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80",
  },
];

export default function Home() {
  return (
    <>
      <EnhancedNavigation items={navItems} />

      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} autoplayInterval={7000} enableParallax />

      <main className="min-h-screen">
        {/* Value Exchange Section */}
        <ScrollReveal direction="up">
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto">
                <ParallaxSection speed={0.3}>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#293d7c] mb-8 text-center">
                    The GNG Value Exchange
                  </h2>
                </ParallaxSection>

                <ScrollReveal direction="scale" delay={0.2}>
                  <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                      We believe, using our proprietary framework called The GNG Value Exchange, we are able to generate long-term and mutually beneficial outcomes for our clients and portfolio companies.
                    </p>
                    <p className="text-gray-600">
                      Using this framework, we invest to create sustainable value that drives strong economic, environmental and social outcomes, complemented by the philanthropic work of GNG Charity Trust.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <ScrollReveal direction="up">
              <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#293d7c] mb-4">
                  Our Portfolio
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                  Strategic investments across multiple sectors creating sustainable value
                </p>
              </div>
            </ScrollReveal>

            <StaggeredGrid pattern="diagonal" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioCards.map((card) => (
                <div key={card.id}>
                  <AnimatedCardGrid cards={[card]} columns={1} variant="default" />
                </div>
              ))}
            </StaggeredGrid>

            <ScrollReveal direction="up" delay={0.4}>
              <div className="text-center mt-12">
                <Link href="/portfolio">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#293d7c] text-[#293d7c] hover:bg-[#293d7c] hover:text-white transition-all duration-300"
                  >
                    View All Portfolio Companies
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* News Section */}
        <ScrollReveal direction="up">
          <section id="news" className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#293d7c] mb-4">
                  News & Media
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                  Latest insights and updates from GNG Global
                </p>
              </div>

              <StaggeredGrid pattern="wave" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {newsCards.map((card) => (
                  <div key={card.id}>
                    <AnimatedCardGrid cards={[card]} columns={1} variant="default" />
                  </div>
                ))}
              </StaggeredGrid>

              <ScrollReveal direction="up" delay={0.3}>
                <div className="text-center mt-12">
                  <Link href="/news">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[#293d7c] text-[#293d7c] hover:bg-[#293d7c] hover:text-white transition-all duration-300"
                    >
                      View All News
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </ScrollReveal>

        {/* Team Preview */}
        <ParallaxSection speed={0.2}>
          <section id="team" className="py-16 md:py-24 bg-[#293d7c] text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
              <ScrollReveal direction="down">
                <div className="mb-12 text-center">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                    Our Team
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                    Leadership committed to creating long-term value for our clients and portfolio companies
                  </p>
                </div>
              </ScrollReveal>

              <StaggeredGrid pattern="grid" className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {["Scott Geare", "Newton Ndege", "Iain Geare", "Daniel Ngetich"].map((name, idx) => (
                  <div key={name} className="text-center">
                    <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-1">{name}</h3>
                    <p className="text-gray-300 text-sm mb-2">
                      {idx === 0 || idx === 2 ? "Director, Co-Founder" : idx === 3 ? "Director, Principal Consultant" : "Director"}
                    </p>
                  </div>
                ))}
              </StaggeredGrid>

              <ScrollReveal direction="up" delay={0.5}>
                <div className="text-center mt-12">
                  <Link href="/team">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-[#293d7c] transition-all duration-300"
                    >
                      Meet the Full Team
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </ParallaxSection>

        {/* Contact CTA */}
        <ScrollReveal direction="up">
          <section id="contact" className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#293d7c] mb-6">
                  Get in Touch
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-8">
                  Interested in learning more about our investment opportunities? Contact us today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 transition-all duration-300">
                      Contact Us
                    </Button>
                  </Link>
                  <Link href="/portfolio">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[#293d7c] text-[#293d7c] hover:bg-[#293d7c] hover:text-white px-8 transition-all duration-300"
                    >
                      View Portfolio
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <Footer />
    </>
  );
}
