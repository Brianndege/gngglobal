"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ParallaxSection } from "./ScrollReveal";

interface LegalHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  height?: "sm" | "md" | "lg";
}

export default function LegalHero({ title, subtitle, image, height = "md" }: LegalHeroProps) {
  const heights = {
    sm: "h-[400px]",
    md: "h-[500px] md:h-[600px]",
    lg: "h-[600px] md:h-[700px]",
  };

  return (
    <section className={`relative ${heights[height]} overflow-hidden`}>
      {/* Background Image with Parallax */}
      <ParallaxSection speed={0.5} className="absolute inset-0">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover"
          />
        </div>
      </ParallaxSection>

      <div className="absolute inset-0 bg-gradient-to-br from-navy-950/92 via-navy-900/86 to-charcoal-900/88" />
      <div className="premium-soft-radial" />
      <div className="premium-hero-symbols" />
      <div className="absolute inset-0 opacity-[0.06] mix-blend-soft-light bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.22),transparent_34%)]" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-4xl mx-auto text-center text-white premium-glass-panel px-8 py-10 md:px-12 md:py-12"
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="font-inter text-lg md:text-xl text-ivory-100/95 leading-relaxed max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#f5f7fa] to-transparent" />
    </section>
  );
}
