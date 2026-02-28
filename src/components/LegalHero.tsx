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

      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-navy-800/85 to-charcoal-900/80" />

      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDE0YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNG0wIDI4YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNHpNMCAzNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMjggMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="font-inter text-lg md:text-xl text-ivory-200 leading-relaxed max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory-50 to-transparent" />
    </section>
  );
}
