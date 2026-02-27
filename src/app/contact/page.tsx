"use client";

import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { navItems } from "@/lib/constants";



export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In production, this would send to an API endpoint
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      }, 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow">
        {/* Hero Section */}
        <LegalHero
          title="Let's Start the Conversation"
          subtitle="Connect with our team to explore investment opportunities and strategic partnerships"
          image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=90"
          height="md"
        />

        {/* Contact Form & Information */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-16">
                {/* Left Column - Introduction & Contact Details */}
                <div className="lg:col-span-2">
                  <ScrollReveal direction="left">
                    <div className="lg:sticky lg:top-32">
                      {/* Introduction */}
                      <div className="mb-12">
                        <div className="inline-block mb-6">
                          <span className="font-inter text-sm font-semibold tracking-wider text-gold uppercase border-b-2 border-gold pb-2">
                            Get in Touch
                          </span>
                        </div>
                        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-navy-800 mb-6 leading-tight">
                          We're Here to Help
                        </h2>
                        <p className="font-inter text-lg text-charcoal-700 leading-relaxed mb-6">
                          Whether you're interested in learning more about our portfolio companies, exploring investment opportunities, or discussing potential partnerships, our team is ready to assist you.
                        </p>
                        <p className="font-inter text-charcoal-600 leading-relaxed">
                          Complete the form and we'll respond within one business day.
                        </p>
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-6 mb-12">
                        <div className="flex items-start gap-4 p-6 bg-ivory-50 rounded-lg border border-ivory-300">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <h3 className="font-inter text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-2">
                              Office Location
                            </h3>
                            <p className="font-inter text-navy-800 leading-relaxed">
                              136 Stirling Highway<br />
                              Nedlands WA 6009<br />
                              Australia
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-ivory-50 rounded-lg border border-ivory-300">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center">
                            <Phone className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <h3 className="font-inter text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-2">
                              Phone
                            </h3>
                            <a href="tel:+61893058580" className="font-inter text-navy-800 hover:text-gold transition-colors">
                              (08) 9305 8580
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-ivory-50 rounded-lg border border-ivory-300">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center">
                            <Mail className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <h3 className="font-inter text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-2">
                              Email
                            </h3>
                            <a href="mailto:info@gngglobal.com.au" className="font-inter text-navy-800 hover:text-gold transition-colors">
                              info@gngglobal.com.au
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-ivory-50 rounded-lg border border-ivory-300">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center">
                            <Clock className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <h3 className="font-inter text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-2">
                              Business Hours
                            </h3>
                            <p className="font-inter text-navy-800 leading-relaxed">
                              Monday - Friday<br />
                              9:00 AM - 5:00 PM AWST
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Trust Markers */}
                      <div className="p-6 bg-gradient-to-br from-navy-900 to-charcoal-900 rounded-lg text-white">
                        <h3 className="font-playfair text-xl font-bold mb-4">Trusted Investment Partner</h3>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <p className="font-inter text-sm text-ivory-200 leading-relaxed">
                            Confidential consultations with experienced investment professionals
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Right Column - Contact Form */}
                <div className="lg:col-span-3">
                  <ScrollReveal direction="right" delay={0.2}>
                    {submitted ? (
                      /* Success Message */
                      <div className="bg-white p-12 rounded-lg border-2 border-gold shadow-xl">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold/30 to-gold/10 rounded-full mb-6">
                            <CheckCircle2 className="w-10 h-10 text-gold" />
                          </div>
                          <h3 className="font-playfair text-3xl font-bold text-navy-800 mb-4">
                            Message Received
                          </h3>
                          <p className="font-inter text-lg text-charcoal-700 mb-2">
                            Thank you for contacting GNG Global Investment Group.
                          </p>
                          <p className="font-inter text-charcoal-600">
                            A member of our team will respond within one business day.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Contact Form */
                      <div className="bg-white p-10 rounded-lg border border-ivory-300 shadow-lg">
                        <div className="mb-8">
                          <h3 className="font-playfair text-2xl md:text-3xl font-bold text-navy-800 mb-2">
                            Send Us a Message
                          </h3>
                          <p className="font-inter text-charcoal-600">
                            Complete the form below and we'll get back to you shortly
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Name */}
                          <div>
                            <Label htmlFor="name" className="font-inter text-sm font-semibold text-charcoal-700 mb-2 block">
                              Full Name <span className="text-gold">*</span>
                            </Label>
                            <Input
                              id="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="John Smith"
                              className="w-full h-12 px-4 border-2 border-charcoal-300 focus:border-gold focus:ring-gold rounded-md font-inter"
                            />
                          </div>

                          {/* Email & Phone Grid */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="email" className="font-inter text-sm font-semibold text-charcoal-700 mb-2 block">
                                Email Address <span className="text-gold">*</span>
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="john@example.com"
                                className="w-full h-12 px-4 border-2 border-charcoal-300 focus:border-gold focus:ring-gold rounded-md font-inter"
                              />
                            </div>

                            <div>
                              <Label htmlFor="phone" className="font-inter text-sm font-semibold text-charcoal-700 mb-2 block">
                                Phone Number
                              </Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+61 400 000 000"
                                className="w-full h-12 px-4 border-2 border-charcoal-300 focus:border-gold focus:ring-gold rounded-md font-inter"
                              />
                            </div>
                          </div>

                          {/* Company */}
                          <div>
                            <Label htmlFor="company" className="font-inter text-sm font-semibold text-charcoal-700 mb-2 block">
                              Company / Organization
                            </Label>
                            <Input
                              id="company"
                              type="text"
                              value={formData.company}
                              onChange={handleChange}
                              placeholder="Company Name"
                              className="w-full h-12 px-4 border-2 border-charcoal-300 focus:border-gold focus:ring-gold rounded-md font-inter"
                            />
                          </div>

                          {/* Message */}
                          <div>
                            <Label htmlFor="message" className="font-inter text-sm font-semibold text-charcoal-700 mb-2 block">
                              Message <span className="text-gold">*</span>
                            </Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                              rows={6}
                              placeholder="Tell us about your inquiry..."
                              className="w-full px-4 py-3 border-2 border-charcoal-300 focus:border-gold focus:ring-gold rounded-md font-inter resize-none"
                            />
                          </div>

                          {/* Submit Button */}
                          <div className="pt-4">
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full md:w-auto px-10 py-6 bg-gold hover:bg-gold-600 text-navy-900 font-inter font-semibold text-lg rounded-md transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                              {isSubmitting ? (
                                <span>Sending...</span>
                              ) : (
                                <>
                                  <span>Send Message</span>
                                  <Send className="ml-2 w-5 h-5 inline group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Privacy Notice */}
                          <p className="text-xs font-inter text-charcoal-500 leading-relaxed">
                            By submitting this form, you consent to GNG Global Investment Group collecting and processing your personal information in accordance with our privacy policy. We respect your privacy and will never share your information with third parties.
                          </p>
                        </form>
                      </div>
                    )}
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 md:py-28 bg-ivory-50">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal direction="up">
                <div className="text-center mb-12">
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mb-6">
                    Visit Our Office
                  </h2>
                  <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                  <p className="font-inter text-xl text-charcoal-600">
                    Located in the heart of Nedlands, Western Australia
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="scale" delay={0.2}>
                <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl border border-ivory-300">
                  {/* Map Placeholder - In production, integrate Google Maps or similar */}
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-charcoal-800 to-navy-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <MapPin className="w-16 h-16 text-gold mx-auto mb-4" />
                      <h3 className="font-playfair text-2xl font-bold mb-2">136 Stirling Highway</h3>
                      <p className="font-inter text-ivory-200">Nedlands WA 6009, Australia</p>
                      <a
                                href="https://maps.google.com/?q=136+Stirling+Highway+Nedlands+WA+6009"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-6 px-6 py-3 bg-gold hover:bg-gold-600 text-navy-900 font-inter font-semibold rounded-md transition-all duration-300"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Additional CTA */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-navy-900 via-navy-800 to-charcoal-900 text-white">
          <div className="container mx-auto px-6">
            <ScrollReveal direction="scale">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                  Ready to Explore Opportunities?
                </h2>
                <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                <p className="font-inter text-xl text-ivory-200 mb-10 leading-relaxed">
                  Learn more about our investment approach and portfolio companies
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/about" className="inline-block px-10 py-4 bg-gold hover:bg-gold-600 text-navy-900 font-inter font-semibold rounded-md transition-all duration-300 hover:shadow-xl">
                    About Our Approach
                  </a>
                  <a href="/portfolio" className="inline-block px-10 py-4 border-2 border-white text-white hover:bg-white hover:text-navy-900 font-inter font-semibold rounded-md transition-all duration-300">
                    View Portfolio
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
