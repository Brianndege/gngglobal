import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal, StaggeredGrid } from "@/components/ScrollReveal";
import { Linkedin, Mail, Award } from "lucide-react";

export const metadata = {
  title: "Our Team - GNG Global Investment Group",
  description: "Meet the leadership team driving strategic investment excellence and creating long-term value.",
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

const teamMembers = [
  {
    name: "Scott Geare",
    role: "Director, Co-Founder",
    bio: "Strategic investment leader with extensive experience in portfolio development and value creation across multiple sectors.",
    linkedin: "https://www.linkedin.com/in/scott-geare-981025157/",
    image: "https://netorg15445780-my.sharepoint.com/personal/n_ndege_gngglobal_com_au/_layouts/15/onedrive.aspx?viewid=ba91211e%2Dc4e0%2D4940%2Da71c%2Db8e17b2833b5&e=5%3A8ef6d67f84bf4abd850f761064c56b49&sharingv2=true&fromShare=true&at=9&CID=9eb476eb%2D1c46%2D44bb%2D86d9%2D96929cd7ff8d&FolderCTID=0x012000794261365BFB9A47B20F0FD25EBA1A01&id=%2Fpersonal%2Fn%5Fndege%5Fgngglobal%5Fcom%5Fau%2FDocuments%2FWEB%20AND%20IT%20DEVELOPMENT%2FIAIN%20GEARE%20%2D%20CORPORATE%20SHOT%2FMTP%5F7751%2DEnhanced%2DNRcopy%2Ejpg&parent=%2Fpersonal%2Fn%5Fndege%5Fgngglobal%5Fcom%5Fau%2FDocuments%2FWEB%20AND%20IT%20DEVELOPMENT%2FIAIN%20GEARE%20%2D%20CORPORATE%20SHOT",
    specialties: ["Strategic Investment", "Portfolio Management", "Business Development"],
  },
  {
    name: "Newton Ndege",
    role: "Director",
    bio: "Investment professional specializing in international partnerships and strategic growth initiatives.",
    linkedin: "https://au.linkedin.com/in/newton-ndege-03a84a104",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    specialties: ["International Relations", "Strategic Partnerships", "Growth Strategy"],
  },
  {
    name: "Iain Geare",
    role: "Director, Co-Founder",
    bio: "Co-founder focused on investment strategy, portfolio optimization, and long-term value creation.",
    linkedin: "http://www.linkedin.com/in/iain-geare-0813371b8",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80",
    specialties: ["Investment Strategy", "Portfolio Development", "Value Creation"],
  },
  {
    name: "Daniel Ngetich",
    role: "Director, Principal Consultant Political Affairs",
    bio: "Expert in government relations, policy advisory, and stakeholder engagement across public and private sectors.",
    linkedin: "https://www.linkedin.com/in/daniel-ngetich-2b59b6205/",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    specialties: ["Government Relations", "Policy Advisory", "Stakeholder Engagement"],
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        {/* Hero Section */}
        <LegalHero
          title="Leadership Committed to Excellence"
          subtitle="Experienced professionals driving strategic investment and creating long-term value"
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=90"
          height="lg"
        />

        {/* Introduction */}
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDE0YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNG0wIDI4YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNHpNMCAzNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMjggMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]" />

          <div className="container mx-auto px-6 relative">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center">
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mb-6">
                    Our Leadership Team
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                  <p className="font-inter text-xl text-charcoal-700 leading-relaxed">
                    A diverse team of investment professionals committed to generating long-term, mutually beneficial outcomes through strategic insight, operational excellence, and unwavering integrity.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-20 md:py-32 bg-ivory-50">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <StaggeredGrid pattern="diagonal" className="grid md:grid-cols-2 gap-12">
                {teamMembers.map((member) => (
                  <div key={member.name}>
                    <div className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-ivory-300">
                      <div className="relative">
                        {/* Professional Photo */}
                        <div className="relative h-96 overflow-hidden bg-gradient-to-br from-navy-900 to-charcoal-900">
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent z-10" />
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                          />

                          {/* Floating LinkedIn Badge */}
                          <div className="absolute top-6 right-6 z-20">
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-gold hover:scale-110 transition-all duration-300 group/link"
                            >
                              <Linkedin className="w-6 h-6 text-navy-800 group-hover/link:text-white" />
                            </a>
                          </div>
                        </div>

                        {/* Overlay Info on Hover - Desktop */}
                        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/95 to-navy-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <div className="mb-4">
                              <h3 className="font-playfair text-3xl font-bold mb-2">{member.name}</h3>
                              <p className="font-inter text-ivory-200">{member.role}</p>
                            </div>
                            <p className="font-inter text-sm text-ivory-300 mb-6 leading-relaxed">
                              {member.bio}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {member.specialties.map((specialty) => (
                                <span key={specialty} className="px-3 py-1 bg-gold/20 text-gold text-xs font-medium rounded-full border border-gold/30">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-8">
                        <div className="mb-4">
                          <h3 className="font-playfair text-2xl md:text-3xl font-bold text-navy-800 mb-2">
                            {member.name}
                          </h3>
                          <p className="font-inter text-charcoal-600 font-medium">{member.role}</p>
                        </div>

                        {/* Bio - visible on mobile */}
                        <p className="lg:hidden font-inter text-charcoal-700 leading-relaxed mb-6">
                          {member.bio}
                        </p>

                        {/* Specialties - visible on mobile */}
                        <div className="lg:hidden mb-6">
                          <div className="flex flex-wrap gap-2">
                            {member.specialties.map((specialty) => (
                              <span key={specialty} className="px-3 py-1 bg-gold/10 text-gold-700 text-xs font-medium rounded-full border border-gold/30">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Contact Actions */}
                        <div className="flex gap-3 pt-4 border-t border-charcoal-200/30">
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-navy-800 hover:bg-navy-900 text-white rounded-md transition-all duration-300 group/btn"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span className="font-inter text-sm font-medium">View Profile</span>
                          </a>
                          <a
                            href="/contact"
                            className="flex items-center justify-center px-4 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-white rounded-md transition-all duration-300"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </StaggeredGrid>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-navy-900 via-navy-800 to-charcoal-900 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-16">
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                    Our Core Values
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                  <p className="font-inter text-xl text-ivory-200 max-w-3xl mx-auto">
                    The principles that guide our approach to investment and partnership
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Award,
                    title: "Excellence",
                    description: "We maintain the highest standards in everything we do, from strategic analysis to operational execution."
                  },
                  {
                    icon: Award,
                    title: "Integrity",
                    description: "Our commitment to transparency, honesty, and ethical conduct underpins every decision and relationship."
                  },
                  {
                    icon: Award,
                    title: "Partnership",
                    description: "We believe in collaborative relationships that create mutually beneficial outcomes for all stakeholders."
                  },
                ].map((value, idx) => (
                  <ScrollReveal key={value.title} direction="up" delay={idx * 0.1}>
                    <div className="text-center p-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold/30 to-gold/10 rounded-full mb-6 border border-gold/20">
                        <value.icon className="w-10 h-10 text-gold" />
                      </div>
                      <h3 className="font-playfair text-2xl font-bold mb-4">{value.title}</h3>
                      <div className="w-12 h-0.5 bg-gold/50 mx-auto mb-4"></div>
                      <p className="font-inter text-ivory-200 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Team CTA */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <ScrollReveal direction="scale">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mb-6">
                  Join Our Team
                </h2>
                <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                <p className="font-inter text-xl text-charcoal-700 mb-10 leading-relaxed">
                  We're always looking for talented professionals who share our commitment to excellence and value creation. If you're passionate about strategic investment and making a positive impact, we'd love to hear from you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/contact" className="inline-block px-10 py-4 bg-navy-800 hover:bg-navy-900 text-white font-inter font-semibold rounded-md transition-all duration-300 hover:shadow-xl">
                    Get in Touch
                  </a>
                  <a href="/about" className="inline-block px-10 py-4 border-2 border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white font-inter font-semibold rounded-md transition-all duration-300">
                    Learn More About Us
                  </a>
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
