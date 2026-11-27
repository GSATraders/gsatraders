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
      onBlur={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-3xl border border-[#EBF5FB] bg-white"
    >
      <div
        className="flex transition-transform duration-[900ms] ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${slideCount}`}
            aria-hidden={slideIndex !== index}
            className="relative aspect-[4/3] w-full shrink-0 sm:aspect-[16/7]"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              priority={slideIndex === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#0D1F3C] shadow-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2980B9]"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#0D1F3C] shadow-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2980B9]"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goTo(slideIndex)}
            aria-label={`Show photo ${slideIndex + 1}`}
            aria-current={slideIndex === index}
            className={`h-2.5 rounded-full transition-all ${
              slideIndex === index ? "w-6 bg-white" : "w-2.5 bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
