import Link from "next/link";
import { notFound } from "next/navigation";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { navItems } from "@/lib/constants";



const articles: Record<
  string,
  {
    title: string;
    date: string;
    category: string;
    image: string;
    content: string[];
  }
> = {
  "kenya-visit": {
    title: "GNG Global Investment Group Directors Visit Kenya High Commissioner to Australia",
    date: "27 Jun 2024",
    category: "International Relations",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80",
    content: [
      "GNG Global Investment Group Directors met with the Kenya High Commissioner to Australia to discuss strategic partnerships and investment opportunities across healthcare, infrastructure, and economic development initiatives.",
      "This meeting represents a significant step in strengthening bilateral investment relations between Australia and Kenya. The discussions focused on identifying mutually beneficial opportunities that align with the GNG Value Exchange framework.",
      "The GNG Global Investment Group leadership team explored opportunities to leverage Kenya's growing economy and Australia's expertise in healthcare, property development, and financial services to create sustainable value for both nations.",
      "This engagement is part of GNG Global's broader strategy to develop international partnerships that drive long-term economic, social, and environmental outcomes.",
    ],
  },
  "launch-party": {
    title: "GNG Global Investment Group Launch Party: A Celebration of Vision and Innovation",
    date: "13 Jan 2024",
    category: "Company News",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
    content: [
      "GNG Global Investment Group celebrated its official launch with partners, clients, and stakeholders, marking a new chapter in strategic investment and value creation through the proprietary GNG Value Exchange framework.",
      "The launch event brought together industry leaders, government representatives, and community stakeholders to celebrate the founding of a new investment group committed to creating sustainable long-term value.",
      "Directors Scott Geare, Newton Ndege, Iain Geare, and Daniel Ngetich shared their vision for GNG Global and outlined the company's strategic priorities across healthcare, property, and media sectors.",
      "The event marked the beginning of an exciting journey as GNG Global Investment Group moves forward with its mission to generate long-term, mutually beneficial outcomes through the GNG Value Exchange framework.",
    ],
  },
  "value-exchange": {
    title: "Understanding the GNG Value Exchange Framework",
    date: "05 Feb 2024",
    category: "Insights",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    content: [
      "An in-depth look at how our proprietary framework generates long-term, mutually beneficial outcomes for clients and portfolio companies while driving sustainable economic, environmental, and social impact.",
      "The GNG Value Exchange is built on the principle that true investment value is created when all stakeholders benefit — not just financial investors, but also employees, communities, and the environment.",
      "Our framework guides every investment decision, ensuring that capital is deployed in ways that create positive, sustainable outcomes across the economic, social, and environmental dimensions.",
      "By applying the GNG Value Exchange to our portfolio companies in healthcare, property, and media, we are demonstrating that financial returns and positive social impact are complementary, not competing, objectives.",
    ],
  },
  "healthcare-expansion": {
    title: "GNG Healthcare Group Expands Services Across Western Australia",
    date: "22 Mar 2024",
    category: "Portfolio Update",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    content: [
      "GNG Healthcare Group announces expansion of NDIS and aged care services to better serve communities across Perth, Bunbury, Albany, and Mandurah.",
      "The expansion reflects growing demand for quality healthcare and disability support services in regional Western Australia, and GNG Healthcare Group's commitment to providing accessible, high-quality care.",
      "The new service locations will offer the full range of GNG Healthcare Group's services, including NDIS Scheme Disability Services, Residential Aged-Care, Allied Health Services, and Community Nursing Care.",
      "This expansion is a key milestone in GNG Healthcare Group's growth strategy and demonstrates the GNG Global Investment Group's commitment to creating lasting value in the healthcare sector.",
    ],
  },
  "property-investment": {
    title: "Strategic Property Investments Drive Sustainable Growth",
    date: "15 Apr 2024",
    category: "Portfolio Update",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    content: [
      "GNG Property Group's approach to residential and commercial real estate development creates long-term value while contributing to sustainable urban development in Western Australia.",
      "The company's investment strategy focuses on identifying high-growth opportunities in Perth's residential market, with particular emphasis on sustainable development practices.",
      "GNG Property Group's portfolio has demonstrated strong performance, reflecting the team's deep expertise in Western Australian real estate markets and their commitment to quality development.",
      "Looking ahead, GNG Property Group plans to expand its portfolio with new residential and commercial developments that deliver both strong financial returns and positive community outcomes.",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(articles).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = articles[id];
  if (!article) return {};
  return {
    title: `${article.title} - GNG Global Investment Group`,
    description: article.content[0],
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = articles[id];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        <LegalHero
          title={article.title}
          image={article.image}
          height="md"
        />

        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal direction="up">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 font-inter text-sm text-gold hover:text-gold-700 transition-colors font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to News
                  </Link>
                  <div className="flex items-center gap-3 ml-auto">
                    <div className="inline-flex items-center gap-2 bg-ivory-100 text-navy-800 px-3 py-1.5 rounded-full">
                      <Tag className="w-3 h-3 text-gold" />
                      <span className="font-inter text-xs font-semibold">{article.category}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-gold/10 text-navy-800 px-3 py-1.5 rounded-full">
                      <Calendar className="w-3 h-3 text-gold" />
                      <span className="font-inter text-xs font-semibold">{article.date}</span>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="space-y-6">
                  {article.content.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="font-inter text-lg text-charcoal-700 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-12 pt-8 border-t border-ivory-300 flex flex-col sm:flex-row gap-4">
                  <Link href="/news">
                    <Button
                      variant="outline"
                      className="border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      All News
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button className="bg-gold hover:bg-gold-600 text-navy-900 font-inter font-semibold">
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
