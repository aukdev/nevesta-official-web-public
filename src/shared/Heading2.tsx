"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import img1 from "@/images/slider3.jpeg";
import img2 from "@/images/slider4.jpeg";
import img3 from "@/images/slider5.jpeg";
import img4 from "@/images/slider1.png";
import img5 from "@/images/slider2.png";

const IMAGES = [img1, img2, img3, img4, img5];

const Heading2: React.FC = () => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const AUTO_PLAY = 5000;

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const startAutoPlay = () => {
    stopAutoPlay();
    timerRef.current = window.setInterval(() => {
      setIndex((s) => (s + 1) % IMAGES.length);
    }, AUTO_PLAY);
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const goTo = (n: number) => {
    setIndex(n);
    startAutoPlay();
  };

  const prev = () => goTo((index - 1 + IMAGES.length) % IMAGES.length);
  const next = () => goTo((index + 1) % IMAGES.length);

  return (
    <header className="relative w-full">
      <div
        ref={containerRef}
        className="relative w-full h-[320px] sm:h-[360px] md:h-[420px] lg:h-[520px] overflow-hidden rounded-xl shadow-lg"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        {IMAGES.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out transform-gpu ${
              i === index ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
            }`}
            aria-hidden={i === index ? "false" : "true"}
          >
            <Image
              src={src}
              alt={`slide-${i + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover w-full h-full"
              priority={i === 0}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent opacity-90" />

            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-8 lg:px-12">
                <div className="max-w-2xl text-white">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                    Discover premium wedding services
                  </h1>
                  <p className="mt-4 text-sm sm:text-base md:text-lg text-white/90">
                    Find trusted vendors, compare packages, and book with confidence.
                  </p>
                  <div className="mt-6 flex items-center space-x-3">
                    <a
                      href="#"
                      className="px-5 py-3 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium shadow-lg"
                    >
                      Explore Services
                    </a>
                    <a
                      href="#"
                      className="px-5 py-3 bg-white/20 hover:bg-white/30 rounded-md text-white font-medium"
                    >
                      How it works
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* controls */}
        <div className="absolute inset-y-0 left-4 flex items-center z-20">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shadow-md"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="absolute inset-y-0 right-4 flex items-center z-20">
          <button
            onClick={next}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shadow-md"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* indicators */}
        <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-6 flex items-center space-x-2">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === index ? "bg-white scale-110" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default Heading2;
