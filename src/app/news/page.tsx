import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal, StaggeredGrid } from "@/components/ScrollReveal";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/lib/constants";

export const metadata = {
  title: "News & Media - GNG Global Investment Group",
  description: "Latest insights, updates, and thought leadership from GNG Global Investment Group.",
};



const featuredArticle = {
  id: "kenya-visit",
  title: "GNG Global Investment Group Directors Visit Kenya High Commissioner to Australia",
  date: "27 Jun 2024",
  category: "International Relations",
  excerpt: "GNG Global Investment Group Directors met with the Kenya High Commissioner to Australia to discuss strategic partnerships and investment opportunities across healthcare, infrastructure, and economic development initiatives. This meeting represents a significant step in strengthening bilateral investment relations.",
  image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80",
  featured: true,
};

const newsItems = [
  {
    id: "launch-party",
    title: "GNG Global Investment Group Launch Party: A Celebration of Vision and Innovation",
    date: "13 Jan 2024",
    category: "Company News",
    excerpt: "GNG Global Investment Group celebrated its official launch with partners, clients, and stakeholders, marking a new chapter in strategic investment and value creation through the proprietary GNG Value Exchange framework.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
  },
  {
    id: "value-exchange",
    title: "Understanding the GNG Value Exchange Framework",
    date: "05 Feb 2024",
    category: "Insights",
    excerpt: "An in-depth look at how our proprietary framework generates long-term, mutually beneficial outcomes for clients and portfolio companies while driving sustainable economic, environmental, and social impact.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  {
    id: "healthcare-expansion",
    title: "GNG Healthcare Group Expands Services Across Western Australia",
    date: "22 Mar 2024",
    category: "Portfolio Update",
    excerpt: "GNG Healthcare Group announces expansion of NDIS and aged care services to better serve communities across Perth, Bunbury, Albany, and Mandurah.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  },
  {
    id: "property-investment",
    title: "Strategic Property Investments Drive Sustainable Growth",
    date: "15 Apr 2024",
    category: "Portfolio Update",
    excerpt: "GNG Property Group's approach to residential and commercial real estate development creates long-term value while contributing to sustainable urban development.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
];

const categories = ["All", "Company News", "Insights", "Portfolio Update", "International Relations"];

export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        {/* Hero Section */}
        <LegalHero
          title="News & Insights"
          subtitle="Latest updates, thought leadership, and strategic insights from GNG Global"
          image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=90"
          height="md"
        />

        {/* Featured Article */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal direction="up">
                <div className="mb-12">
                  <div className="inline-block mb-6">
                    <span className="font-inter text-sm font-semibold tracking-wider text-gold uppercase border-b-2 border-gold pb-2">
                      Featured Article
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={0.2}>
                <Link href={`/news/${featuredArticle.id}`}>
                  <div className="group relative bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-ivory-300">
                    <div className="grid lg:grid-cols-5 gap-0">
                      {/* Image */}
                      <div className="lg:col-span-3 relative h-96 lg:h-auto overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/60 via-navy-900/40 to-transparent z-10" />
                        <img
                          src={featuredArticle.image}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Category Badge */}
                        <div className="absolute top-6 left-6 z-20">
                          <div className="inline-flex items-center gap-2 bg-gold/95 backdrop-blur-sm text-navy-900 px-4 py-2 rounded-full">
                            <Tag className="w-4 h-4" />
                            <span className="font-inter text-sm font-semibold">{featuredArticle.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-charcoal-600 mb-4">
                          <Calendar className="w-4 h-4" />
                          <span className="font-inter text-sm">{featuredArticle.date}</span>
                        </div>

                        <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-navy-800 mb-6 group-hover:text-navy-900 transition-colors leading-tight">
                          {featuredArticle.title}
                        </h2>

                        <p className="font-inter text-lg text-charcoal-700 leading-relaxed mb-8">
                          {featuredArticle.excerpt}
                        </p>

                        <div className="flex items-center text-gold group-hover:text-gold-700 font-semibold">
                          <span>Read Full Article</span>
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-8 bg-ivory-50 border-y border-ivory-300">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal direction="up">
                <div className="flex flex-wrap gap-3 justify-center">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-6 py-2 rounded-full font-inter text-sm font-medium transition-all duration-300 ${
                        category === "All"
                          ? "bg-navy-800 text-white"
                          : "bg-white text-charcoal-700 hover:bg-navy-800 hover:text-white border border-charcoal-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-20 md:py-28 bg-ivory-50">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mb-6">
                    Latest Updates
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto"></div>
                </div>
              </ScrollReveal>

              <StaggeredGrid pattern="wave" className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
                {newsItems.map((article) => (
                  <div key={article.id}>
                    <Link href={`/news/${article.id}`}>
                      <div className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-ivory-300 h-full">
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent z-10" />
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4 z-20">
                            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-navy-900 px-3 py-1.5 rounded-full">
                              <Tag className="w-3 h-3" />
                              <span className="font-inter text-xs font-semibold">{article.category}</span>
                            </div>
                          </div>
                          {/* Date Badge */}
                          <div className="absolute bottom-4 left-4 z-20">
                            <div className="inline-flex items-center gap-2 bg-gold/95 backdrop-blur-sm text-navy-900 px-3 py-1.5 rounded-full">
                              <Calendar className="w-3 h-3" />
                              <span className="font-inter text-xs font-semibold">{article.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="font-playfair text-2xl font-bold text-navy-800 mb-4 group-hover:text-navy-900 transition-colors leading-tight line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="font-inter text-charcoal-600 leading-relaxed mb-6 line-clamp-3">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center text-gold group-hover:text-gold-700 font-semibold text-sm">
                            <span>Read More</span>
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </StaggeredGrid>

              {/* Load More */}
              <ScrollReveal direction="up" delay={0.4}>
                <div className="text-center mt-16">
                  <button className="px-10 py-4 bg-navy-800 hover:bg-navy-900 text-white font-inter font-semibold rounded-md transition-all duration-300 hover:shadow-xl">
                    Load More Articles
                  </button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-navy-900 via-navy-800 to-charcoal-900 text-white">
          <div className="container mx-auto px-6">
            <ScrollReveal direction="scale">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                  Stay Informed
                </h2>
                <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                <p className="font-inter text-xl text-ivory-200 mb-10 leading-relaxed">
                  Subscribe to receive the latest insights, updates, and thought leadership from GNG Global Investment Group
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 rounded-md text-navy-900 font-inter focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button className="px-8 py-4 bg-gold hover:bg-gold-600 text-navy-900 font-inter font-semibold rounded-md transition-all duration-300 hover:shadow-xl whitespace-nowrap">
                    Subscribe Now
                  </button>
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
