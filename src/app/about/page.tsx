import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Shield, Scale, Handshake, Award, TrendingUp, Users, Globe, Target } from "lucide-react";

export const metadata = {
  title: "About Us - GNG Global Investment Group",
  description: "Trusted investment expertise for modern business challenges. Learn about GNG Global's legacy, values, and proprietary framework.",
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

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        {/* Hero Section */}
        <LegalHero
          title="Trusted Investment Expertise for Modern Business Challenges"
          subtitle="Building enduring value through strategic partnerships and our proprietary GNG Value Exchange framework"
          image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=90"
          height="lg"
        />

        {/* Elegant Intro Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          {/* Subtle Background Texture */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDE0YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNG0wIDI4YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNHpNMCAzNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMjggMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]" />

          <div className="container mx-auto px-6 relative">
            <div className="max-w-5xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-navy-800 mb-6">
                    Our Legacy
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                  <p className="font-inter text-xl md:text-2xl text-charcoal-600 leading-relaxed max-w-4xl mx-auto">
                    A commitment to excellence, integrity, and lasting partnerships
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={0.2}>
                <div className="bg-white/80 backdrop-blur-sm p-10 md:p-16 rounded-lg shadow-xl border border-ivory-300">
                  <p className="font-inter text-xl text-charcoal-700 leading-relaxed mb-8 text-center">
                    GNG Global Investment Group is an investment firm founded in Perth, Australia. We have numerous strategic investments in a wide range of sectors and asset classes, including healthcare, media, financial services, and advisory services.
                  </p>
                  <p className="font-inter text-lg text-charcoal-600 leading-relaxed text-center">
                    Our approach is built on creating long-term, sustainable value for our portfolio companies and clients. We believe in partnerships that go beyond capital investment, providing strategic guidance and operational support to drive growth and success.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* The GNG Value Exchange - Sophisticated Alternating Layout */}
        <section className="py-20 md:py-32 bg-white relative">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <ScrollReveal direction="up">
                <div className="text-center mb-20">
                  <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-navy-800 mb-6">
                    The GNG Value Exchange
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                  <p className="font-inter text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
                    Our proprietary framework for generating long-term, mutually beneficial outcomes
                  </p>
                </div>
              </ScrollReveal>

              {/* Image Left, Text Right */}
              <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                <ScrollReveal direction="left">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-gold/20 to-transparent rounded-lg blur-xl"></div>
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
                      alt="Strategic Planning and Investment"
                      className="relative w-full h-[600px] object-cover rounded-lg shadow-2xl"
                    />
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={0.2}>
                  <div className="lg:pl-8">
                    <div className="inline-block mb-6">
                      <span className="font-inter text-sm font-semibold tracking-wider text-gold uppercase border-b-2 border-gold pb-2">
                        Our Framework
                      </span>
                    </div>
                    <h3 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mb-6 leading-tight">
                      Creating Sustainable Value
                    </h3>
                    <p className="font-inter text-lg text-charcoal-700 leading-relaxed mb-6">
                      We believe, using our proprietary framework called "The GNG Value Exchange", we are able to generate long-term and mutually beneficial outcomes for our clients and portfolio companies.
                    </p>
                    <p className="font-inter text-charcoal-600 leading-relaxed mb-8">
                      Using this framework, we invest to create sustainable value that drives strong economic, environmental and social outcomes, complemented by the philanthropic work of GNG Charity Trust.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-px bg-gradient-to-r from-gold to-transparent flex-grow"></div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Image Right, Text Left */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <ScrollReveal direction="left" className="lg:order-2">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-bl from-navy-500/20 to-transparent rounded-lg blur-xl"></div>
                    <img
                      src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"
                      alt="Professional Excellence and Collaboration"
                      className="relative w-full h-[600px] object-cover rounded-lg shadow-2xl"
                    />
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={0.2} className="lg:order-1">
                  <div className="lg:pr-8">
                    <div className="inline-block mb-6">
                      <span className="font-inter text-sm font-semibold tracking-wider text-gold uppercase border-b-2 border-gold pb-2">
                        Our Commitment
                      </span>
                    </div>
                    <h3 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mb-6 leading-tight">
                      A Legacy of Excellence
                    </h3>
                    <p className="font-inter text-lg text-charcoal-700 leading-relaxed mb-6">
                      The GNG Value Exchange ensures that every investment decision considers not just financial returns, but also the broader impact on communities, the environment, and society as a whole.
                    </p>
                    <p className="font-inter text-charcoal-600 leading-relaxed mb-8">
                      We are committed to creating partnerships that stand the test of time, delivering value across generations through strategic insight, operational excellence, and unwavering integrity.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-px bg-gradient-to-r from-gold to-transparent flex-grow"></div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Why Clients Choose Us - Enhanced */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-navy-900 via-navy-800 to-charcoal-900 text-white relative overflow-hidden">
          {/* Elegant Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal direction="down">
                <div className="text-center mb-20">
                  <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    Why Clients Choose Us
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                  <p className="font-inter text-xl text-ivory-200 max-w-3xl mx-auto leading-relaxed">
                    Delivering exceptional results through proven expertise and unwavering commitment
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
                {[
                  {
                    icon: Shield,
                    title: "Protection",
                    description: "Safeguarding your investments with rigorous due diligence, comprehensive risk assessment, and strategic oversight",
                  },
                  {
                    icon: Scale,
                    title: "Balance",
                    description: "Creating mutually beneficial outcomes for all stakeholders through our proprietary Value Exchange framework",
                  },
                  {
                    icon: Handshake,
                    title: "Trust",
                    description: "Building lasting relationships founded on integrity, transparency, and consistent communication",
                  },
                  {
                    icon: Award,
                    title: "Excellence",
                    description: "Delivering exceptional results through proven investment strategies and operational expertise",
                  },
                ].map((item, idx) => (
                  <ScrollReveal key={item.title} direction="up" delay={idx * 0.1}>
                    <div className="text-center group">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 mb-8 group-hover:from-gold/40 group-hover:to-gold/20 transition-all duration-300 border border-gold/20">
                        <item.icon className="w-12 h-12 text-gold" />
                      </div>
                      <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-4">{item.title}</h3>
                      <div className="w-12 h-0.5 bg-gold/50 mx-auto mb-4"></div>
                      <p className="font-inter text-ivory-200 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Additional Value Propositions */}
              <ScrollReveal direction="up" delay={0.4}>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pt-20 border-t border-ivory-200/10">
                  {[
                    { icon: TrendingUp, label: "Strategic Growth", value: "Long-term value creation" },
                    { icon: Users, label: "Expert Team", value: "Decades of experience" },
                    { icon: Globe, label: "Global Reach", value: "International partnerships" },
                    { icon: Target, label: "Focused Approach", value: "Tailored solutions" },
                  ].map((stat, idx) => (
                    <div key={stat.label} className="text-center">
                      <stat.icon className="w-10 h-10 text-gold mx-auto mb-4" />
                      <div className="font-playfair text-lg font-bold text-white mb-2">{stat.label}</div>
                      <div className="font-inter text-sm text-ivory-300">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Land Acknowledgement - Refined */}
        <section className="py-16 bg-charcoal-900 text-ivory-100 border-t border-charcoal-800">
          <div className="container mx-auto px-6">
            <ScrollReveal direction="scale">
              <div className="max-w-4xl mx-auto text-center">
                <p className="font-inter text-lg leading-relaxed italic opacity-90">
                  The GNG Global Investment Group and its subsidiaries acknowledge the Traditional Owners of the lands and waters on which we work, live and engage. We pay our respects to elders past and present.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
