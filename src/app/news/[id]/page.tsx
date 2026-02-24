import Link from "next/link";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Calendar, Tag, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

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

const articles: Record<string, {
  title: string;
  date: string;
  category: string;
  content: string[];
  image: string;
}> = {
  "kenya-visit": {
    title: "GNG Global Investment Group Directors Visit Kenya High Commissioner to Australia",
    date: "27 Jun 2024",
    category: "International Relations",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80",
    content: [
      "GNG Global Investment Group Directors recently met with the Kenya High Commissioner to Australia to discuss strategic partnerships and investment opportunities across healthcare, infrastructure, and economic development initiatives.",
      "This landmark meeting represents a significant step in strengthening bilateral investment relations between Australia and Kenya, with both parties expressing strong interest in exploring mutually beneficial opportunities aligned with GNG's proprietary Value Exchange framework.",
      "The discussions centred on identifying sectors where GNG's expertise in healthcare, property, and media could complement Kenya's rapidly growing economy. The meeting highlighted the importance of cross-border partnerships in driving sustainable economic outcomes.",
      "GNG Global Investment Group remains committed to building international relationships that create long-term value for all stakeholders, and this meeting with the Kenya High Commissioner marks an important milestone in the group's international engagement strategy.",
    ],
  },
  "launch-party": {
    title: "GNG Global Investment Group Launch Party: A Celebration of Vision and Innovation",
    date: "13 Jan 2024",
    category: "Company News",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
    content: [
      "GNG Global Investment Group celebrated its official launch with an exclusive event attended by partners, clients, and stakeholders from across Western Australia and beyond. The event marked a new chapter in strategic investment and value creation.",
      "The launch celebration brought together leaders from healthcare, property, media, and advisory sectors to witness the official unveiling of the GNG Value Exchange framework — the proprietary methodology that underpins all of GNG's investment decisions.",
      "Founders Scott Geare, Iain Geare, and fellow directors Newton Ndege and Daniel Ngetich shared their vision for GNG Global Investment Group: to create an investment firm that generates not just financial returns, but lasting social, environmental, and economic value.",
      "The event was a testament to the team's commitment to building a world-class investment group from Perth, Western Australia, with a global outlook and a local heart.",
    ],
  },
  "value-exchange": {
    title: "Understanding the GNG Value Exchange Framework",
    date: "05 Feb 2024",
    category: "Insights",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    content: [
      "The GNG Value Exchange is GNG Global Investment Group's proprietary framework for evaluating, structuring, and managing investments. It is designed to ensure that every investment creates long-term, mutually beneficial outcomes for all stakeholders.",
      "At its core, the GNG Value Exchange recognises that true investment success goes beyond financial returns. It encompasses economic impact, environmental responsibility, and social value — all complemented by the philanthropic work of GNG Charity Trust.",
      "The framework operates on three key principles: creating sustainable economic value through strategic investment; delivering positive environmental and social outcomes; and building genuine partnerships that endure beyond the life of individual investments.",
      "By applying the GNG Value Exchange to every portfolio decision, GNG Global Investment Group ensures that its growth is aligned with the wellbeing of the communities and ecosystems in which it operates.",
    ],
  },
  "healthcare-expansion": {
    title: "GNG Healthcare Group Expands Services Across Western Australia",
    date: "22 Mar 2024",
    category: "Portfolio Update",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    content: [
      "GNG Healthcare Group has announced a significant expansion of its NDIS and aged care services, extending its reach to better serve communities across Perth, Bunbury, Albany, and Mandurah.",
      "The expansion reflects GNG Healthcare Group's commitment to delivering accessible, high-quality healthcare to more Western Australians. New service centres and care teams are being established in regional locations to address growing demand.",
      "The growth includes the addition of new allied health practitioners, community nursing staff, and NDIS support workers — all recruited and trained to GNG's exacting standards for person-centred care.",
      "GNG Global Investment Group continues to support GNG Healthcare Group's expansion through strategic investment and operational support, in line with the GNG Value Exchange framework's commitment to social and community value creation.",
    ],
  },
  "property-investment": {
    title: "Strategic Property Investments Drive Sustainable Growth",
    date: "15 Apr 2024",
    category: "Portfolio Update",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    content: [
      "GNG Property Group has continued to build its portfolio of strategic residential and commercial real estate investments across Western Australia, with a focus on assets that offer both strong returns and long-term sustainable value.",
      "The group's approach to property investment is guided by GNG's Value Exchange framework, ensuring that each acquisition supports positive outcomes for local communities, the environment, and the broader economy.",
      "Recent acquisitions have targeted growth corridors in Perth's northern and southern suburbs, where infrastructure investment and population growth are driving strong demand for quality residential and commercial property.",
      "GNG Property Group's leadership team brings decades of combined experience in Western Australian real estate, enabling the group to identify and capitalise on opportunities that others may overlook.",
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
    description: article.content[0].slice(0, 160),
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = articles[id];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        {/* Article Hero */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/85 via-navy-800/80 to-charcoal-900/75 z-10" />
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-end">
            <div className="container mx-auto px-6 pb-12">
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center gap-2 bg-gold/95 text-navy-900 px-4 py-2 rounded-full">
                    <Tag className="w-4 h-4" />
                    <span className="font-inter text-sm font-semibold">{article.category}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="font-inter text-sm">{article.date}</span>
                  </div>
                </div>
                <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {article.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal direction="up">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-700 font-inter font-medium mb-10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to News &amp; Media
                </Link>

                <div className="space-y-6">
                  {article.content.map((paragraph, idx) => (
                    <p key={idx} className="font-inter text-lg text-charcoal-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-12 pt-12 border-t border-ivory-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-inter text-sm text-charcoal-500 mb-1">Published by</p>
                      <p className="font-inter font-semibold text-navy-800">GNG Global Investment Group</p>
                    </div>
                    <Link
                      href="/contact"
                      className="inline-block px-8 py-3 bg-navy-800 hover:bg-navy-900 text-white font-inter font-semibold rounded-md transition-all duration-300"
                    >
                      Contact Us
                    </Link>
                  </div>
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
