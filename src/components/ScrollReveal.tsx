"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation, Variants } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });
  const controls = useAnimation();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants: Record<string, Variants> = {
    up: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    },
    down: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 },
    },
    left: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants[direction]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredGridProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  pattern?: "grid" | "diagonal" | "wave";
}

export function StaggeredGrid({
  children,
  className = "",
  staggerDelay = 0.1,
  pattern = "diagonal",
}: StaggeredGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getDelay = (index: number, total: number) => {
    switch (pattern) {
      case "grid":
        return index * staggerDelay;
      case "diagonal":
        const row = Math.floor(index / 3);
        const col = index % 3;
        return (row + col) * staggerDelay;
      case "wave":
        return Math.sin(index * 0.5) * staggerDelay * 2;
      default:
        return index * staggerDelay;
    }
  };

  const getDirection = (index: number): "up" | "left" | "right" | "scale" => {
    switch (pattern) {
      case "diagonal":
        const position = index % 3;
        if (position === 0) return "left";
        if (position === 1) return "scale";
        return "right";
      case "wave":
        return index % 2 === 0 ? "up" : "scale";
      default:
        return "up";
    }
  };

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          direction={getDirection(index)}
          delay={getDelay(index, children.length)}
          duration={0.6}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className = "",
}: ParallaxSectionProps) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const elementTop = rect.top + scrolled;
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;

      if (
        rect.top < viewportHeight &&
        rect.bottom > 0
      ) {
        const progress = (scrolled - elementTop + viewportHeight) / (elementHeight + viewportHeight);
        setOffset(progress * 100 * speed);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, prefersReducedMotion]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        style={{
          transform: prefersReducedMotion ? undefined : `translateY(${offset}px)`,
          willChange: prefersReducedMotion ? undefined : "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
