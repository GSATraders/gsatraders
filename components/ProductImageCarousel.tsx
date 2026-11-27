"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/images/products/hake-on-ice.jpg", alt: "Fresh hake fillets laid out on ice" },
  { src: "/images/products/squid-on-ice.jpg", alt: "Squid on ice ready for packing" },
  { src: "/images/facility/facility-exterior.jpg", alt: "GSA Traders facility exterior in Cape Town" },
  { src: "/images/facility/fleet-trucks.jpg", alt: "GSA Traders delivery fleet" },
];

const AUTOPLAY_INTERVAL_MS = 6000;

export default function ProductImageCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = slides.length;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isPaused || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slideCount);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, slideCount]);

  const goTo = (next: number) => setIndex((next + slideCount) % slideCount);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Product and facility photos"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
      className="relative mx-auto w-full max-w-4xl"
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/7]">
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)",
          }}
        >
          {[-1, 0, 1].map((position) => {
            const slideIndex = (index + position + slideCount) % slideCount;
            const slide = slides[slideIndex];

            return (
              <div
                key={slideCount > 2 ? slide.src : `${slide.src}-${position}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${slideCount}`}
                aria-hidden={position !== 0}
                className="absolute top-1/2 aspect-[4/3] w-[78%] max-w-[800px] overflow-hidden rounded-2xl bg-[#0D1F3C] shadow-xl transition-[left,transform,opacity] duration-700 ease-out motion-reduce:transition-none sm:aspect-[16/8]"
                style={{
                  left: `${50 + position * 61}%`,
                  opacity: position === 0 ? 1 : 0.72,
                  transform: `translate(-50%, -50%) scale(${position === 0 ? 1 : 0.9})`,
                  zIndex: position === 0 ? 20 : 10,
                }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(min-width: 1024px) 700px, 78vw"
                  priority={position === 0 && index === 0}
                  className="object-contain"
                />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/95 p-2 text-[#0D1F3C] shadow-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2980B9] sm:left-4"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/95 p-2 text-[#0D1F3C] shadow-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2980B9] sm:right-4"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>

        <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(slideIndex)}
              aria-label={`Show photo ${slideIndex + 1}`}
              aria-current={slideIndex === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                slideIndex === index ? "w-6 bg-white" : "w-2.5 bg-white/60 hover:bg-white/90"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
