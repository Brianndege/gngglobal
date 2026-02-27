"use client";

import { useEffect, useState } from "react";
import { BREAKPOINTS } from "@/lib/constants";

/**
 * Returns true once the component has mounted on the client.
 * Useful for avoiding hydration mismatches with SSR.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

/**
 * Tracks whether the page has been scrolled past a given threshold.
 *
 * @param threshold - Scroll distance in pixels (default: 50)
 */
export function useScrolled(threshold = 50): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}

/**
 * Returns the current window width, updating on resize.
 * Returns `undefined` on the server to avoid SSR mismatches.
 */
export function useWindowWidth(): number | undefined {
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

/**
 * Returns true when the viewport width is below the given breakpoint.
 *
 * @param breakpoint - One of the Tailwind breakpoint keys (default: "md")
 */
export function useIsMobile(
  breakpoint: keyof typeof BREAKPOINTS = "md",
): boolean {
  const width = useWindowWidth();
  return width !== undefined && width < BREAKPOINTS[breakpoint];
}
