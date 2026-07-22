"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { banners } from "@/components/home/content";

const SLIDE_DURATION = 6000;
const PROGRESS_STEP = 50;

export default function HeroShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          setActiveSlide((slide) => (slide + 1) % banners.length);
          return 0;
        }

        return current + (PROGRESS_STEP / SLIDE_DURATION) * 100;
      });
    }, PROGRESS_STEP);

    return () => window.clearInterval(timer);
  }, [activeSlide]);

  return (
    <section className="w-full bg-white">
      <div className="sm:hidden">
        <div className="relative h-[66vh] min-h-[460px] max-h-[700px] w-full overflow-hidden bg-gradient-to-b from-white via-white to-[#edf3fa]">
          <div className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth">
            {banners.map((banner) => (
              <div key={banner.src} className="relative h-full w-full shrink-0 snap-start">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  priority={banner.src === banners[0].src}
                  className="object-contain object-center p-0.5"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center px-4">
            <div className="flex items-center gap-2 rounded-full bg-white/65 px-3 py-1.5 backdrop-blur-sm">
              {banners.map((banner, index) => (
                <button
                  key={banner.src}
                  type="button"
                  aria-label={`Show banner ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeSlide ? "w-8 bg-slate-800" : "w-2 bg-slate-400/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="relative h-[clamp(360px,72vh,760px)] w-full overflow-hidden sm:h-[calc(100vh-72px)]">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.src} className="relative h-full w-full shrink-0">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  priority={banner.src === banners[0].src}
                  className="object-cover object-[70%_center] sm:object-center"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center px-4 sm:bottom-7">
            <div className="flex items-center gap-2 rounded-full bg-white/65 px-3 py-1.5 backdrop-blur-sm">
              {banners.map((banner, index) => (
                <button
                  key={banner.src}
                  type="button"
                  aria-label={`Show banner ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeSlide ? "w-8 bg-slate-800" : "w-2 bg-slate-400/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

