import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal, StaggeredGrid } from "@/components/ScrollReveal";
import { Linkedin, Mail, Award } from "lucide-react";
import { primaryNavItems } from "@/lib/site";
import Link from "next/link";
import TeamMemberPhoto from "@/components/TeamMemberPhoto";

export const metadata = {
  title: "Our Team - GNG Global Investment Group",
  description: "Meet the leadership team driving strategic investment excellence and creating long-term value.",
};

const teamMembers = [
  {
    name: "Scott Geare",
    role: "Director, Co-Founder",
    bio: "Scott Geare is a Co-Founder and Director of GNG Global Investment Group, bringing extensive experience in strategic investment and business development.",
    linkedin: "https://www.linkedin.com/in/scott-geare-981025157/",
    image: "/team/scot.jpg",
    specialties: ["Strategic Investment", "Portfolio Management", "Business Development"],
  },
  {
    name: "Newton Ndege",
    role: "Director",
    bio: "Newton Ndege serves as a Director of GNG Global Investment Group, contributing expertise in international partnerships and strategic growth.",
    linkedin: "https://au.linkedin.com/in/newton-ndege-03a84a104",
    image: "/team/newton.jpg",
    specialties: ["International Relations", "Strategic Partnerships", "Growth Strategy"],
  },
  {
    name: "Iain Geare",
    role: "Director, Co-Founder",
    bio: "Iain Geare is a Co-Founder and Director of GNG Global Investment Group, with a focus on investment strategy and portfolio development.",
    linkedin: "http://www.linkedin.com/in/iain-geare-0813371b8",
    image: "/team/Ian.jpg",
    specialties: ["Investment Strategy", "Portfolio Development", "Value Creation"],
  },
  {
    name: "Daniel Ngetich",
    role: "Director, Principal Consultant Political Affairs",
    bio: "Daniel Ngetich is a Director and Principal Consultant for Political Affairs at GNG Global Investment Group, specializing in government relations and policy advisory.",
    linkedin: "https://www.linkedin.com/in/daniel-ngetich-2b59b6205/",
    image: "/team/daniel.jpg",
    specialties: ["Government Relations", "Policy Advisory", "Stakeholder Engagement"],
  },
];

export default function TeamPage() {
  return (
    <div className="premium-site-shell premium-site-shell--deep">
      <EnhancedNavigation items={primaryNavItems} />

      <main id="main-content" className="premium-page-main">
        {/* Hero Section */}
        <LegalHero
          title="Leadership Committed to Excellence"
          subtitle="Experienced professionals driving strategic investment and creating long-term value"
          image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=90"
          height="lg"
        />

        {/* Introduction */}
        <section className="py-20 md:py-28 section-premium-light relative overflow-hidden">
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
        <section className="py-16 md:py-24 section-premium-neutral section-premium-divider">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <StaggeredGrid pattern="diagonal" className="grid md:grid-cols-2 gap-12">
                {teamMembers.map((member) => (
                  <div key={member.name}>
                    <div className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-ivory-300">
                      <div className="relative">
                        {/* Professional Photo */}
                        <div className="relative h-[26rem] md:h-[30rem] overflow-hidden bg-gradient-to-br from-navy-900 to-charcoal-900">
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent z-10" />
                          <TeamMemberPhoto
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-700"
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
                          <Link
                            href="/contact"
                            className="flex items-center justify-center px-4 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-white rounded-md transition-all duration-300"
                          >
                            <Mail className="w-4 h-4" />
                          </Link>
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
        <section className="py-20 md:py-32 section-premium-dark text-white">
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
        <section className="py-20 md:py-28 section-premium-light">
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
                  <Link href="/contact" className="inline-block px-10 py-4 bg-navy-800 hover:bg-navy-900 text-white font-inter font-semibold rounded-md transition-all duration-300 hover:shadow-xl">
                    Get in Touch
                  </Link>
                  <Link href="/about" className="inline-block px-10 py-4 border-2 border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white font-inter font-semibold rounded-md transition-all duration-300">
                    Learn More About Us
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
