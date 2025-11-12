"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import "keen-slider/keen-slider.min.css";

interface Slide {
  id: string;
  image: string;
  imageMobile?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  overlay?: "dark" | "light" | "gradient";
}

interface HeroCarouselProps {
  slides: Slide[];
  autoplayInterval?: number;
  enableParallax?: boolean;
}

export default function HeroCarousel({
  slides,
  autoplayInterval = 7000,
  enableParallax = true,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    const handleChange = () => {
      prefersReducedMotion.current = mediaQuery.matches;
      if (mediaQuery.matches) {
        setIsPlaying(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      loop: true,
      slides: {
        perView: 1,
        spacing: 0,
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    },
    [
      (slider) => {
        let timeout: NodeJS.Timeout;
        let mouseOver = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver || !isPlaying) return;
          timeout = setTimeout(() => {
            slider.next();
          }, autoplayInterval);
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  useEffect(() => {
    if (!enableParallax || prefersReducedMotion.current) return;

    const handleScroll = () => {
      const offset = window.pageYOffset;
      setParallaxOffset(offset * 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enableParallax]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      instanceRef.current?.moveToIdx(index);
    },
    [instanceRef]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        instanceRef.current?.prev();
      } else if (e.key === "ArrowRight") {
        instanceRef.current?.next();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      }
    },
    [instanceRef, togglePlayPause]
  );

  const overlayClass = (overlay?: string) => {
    switch (overlay) {
      case "dark":
        return "bg-black/50";
      case "light":
        return "bg-white/30";
      case "gradient":
        return "bg-gradient-to-b from-black/60 via-black/30 to-transparent";
      default:
        return "bg-gradient-to-b from-black/40 to-black/20";
    }
  };

  return (
    <section
      className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero carousel"
    >
      <div ref={sliderRef} className="keen-slider h-full">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="keen-slider__slide relative h-full"
            aria-roledescription="slide"
            aria-label={`Slide ${idx + 1} of ${slides.length}`}
            aria-hidden={currentSlide !== idx}
          >
            {/* Background Image with Parallax */}
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform: enableParallax && !prefersReducedMotion.current
                  ? `translateY(${parallaxOffset}px)`
                  : undefined,
              }}
            >
              <picture>
                {slide.imageMobile && (
                  <source
                    media="(max-width: 640px)"
                    srcSet={slide.imageMobile}
                  />
                )}
                <img
                  src={slide.image}
                  alt=""
                  className="w-full h-full object-cover"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </picture>
            </div>

            {/* Overlay */}
            <div className={`absolute inset-0 ${overlayClass(slide.overlay)}`} />

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: currentSlide === idx ? 1 : 0,
                    y: currentSlide === idx ? 0 : 20,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="max-w-4xl mx-auto text-center text-white"
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.ctaText && slide.ctaLink && (
                    <a
                      href={slide.ctaLink}
                      className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-3 rounded-md transition-colors duration-300"
                    >
                      {slide.ctaText}
                    </a>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      {loaded && instanceRef.current && (
        <div className="absolute inset-x-0 bottom-8 z-10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              {/* Navigation Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={() => instanceRef.current?.prev()}
                  className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300 text-white"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => instanceRef.current?.next()}
                  className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300 text-white"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="flex gap-2" role="tablist" aria-label="Slide navigation">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === idx
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/70"
                    }`}
                    role="tab"
                    aria-selected={currentSlide === idx}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300 text-white"
                aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Reader Announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Slide {currentSlide + 1} of {slides.length}
      </div>
    </section>
  );
}
