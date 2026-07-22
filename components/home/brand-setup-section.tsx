"use client";

import Image from "next/image";
import { useState } from "react";

const items = [
  {
    id: 1,
    title: "ANC for Mumbai Locals",
    subtitle: "40ms gaming mode, 100-hour battery",
    image: "/banner-earbuds.png",
  },
  {
    id: 2,
    title: "Crystal Clear Vision",
    subtitle: "4K Dashcam with Night Vision",
    image: "/banner-dashcam.png",
  },
  {
    id: 3,
    title: "Health Monitor",
    subtitle: "BT calling, 7-day battery, IP68",
    image: "/banner-smartwatch.png",
  },
  {
    id: 4,
    title: "Cinematic Experience",
    subtitle: "Up to 300 inch projection, 4K supported",
    image: "/banner-projector.png",
  },
];

export default function BrandSetupSection() {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  return (
    <section className="overflow-hidden bg-white pb-10 pt-4 text-slate-900 md:pb-16 md:pt-4">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-[2rem] font-bold leading-[0.96] tracking-tight md:mb-10 md:text-[clamp(2.5rem,4vw,3.5rem)]">
          One brand for your whole setup
        </h2>

        <div className="md:hidden">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Swipe to explore
          </p>
          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-2">
            {items.map((item, index) => (
              <article
                key={item.id}
                className="relative min-w-[76vw] snap-start overflow-hidden rounded-[20px] bg-slate-950"
              >
                <div className="relative h-[370px] w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="78vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                      XElectron
                    </p>
                    <h3 className="mt-2 text-[1.4rem] font-bold leading-[1.1] text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.9rem] leading-5 text-white/70">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="hidden h-[320px] w-full gap-[0.5px] transition-all duration-500 md:flex md:h-[400px] lg:h-[460px] lg:gap-2">
          {items.map((item, index) => {
            const isActive = hoveredIndex === index;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredIndex(index)}
                className={`group relative cursor-pointer overflow-hidden rounded-[24px] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isActive ? "flex-[12] lg:flex-[16]" : "flex-[1]"
                }`}
              >
                <div
                  className={`absolute inset-0 z-10 bg-slate-900/10 transition-opacity duration-500 group-hover:bg-transparent ${
                    isActive ? "opacity-0" : "opacity-100"
                  }`}
                />

                <div
                  className={`absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-700 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />

                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={`object-cover transition-transform duration-1000 ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                  sizes="(max-width: 767px) 100vw, 50vw"
                />

                <div
                  className={`absolute bottom-6 right-6 z-30 flex flex-col justify-end text-right transition-all duration-500 ease-out md:bottom-10 md:right-10 ${
                    isActive ? "translate-y-0 opacity-100 delay-200" : "translate-y-8 opacity-0"
                  }`}
                >
                  <h3 className="mb-2 whitespace-nowrap text-2xl font-bold text-white drop-shadow-md md:text-3xl lg:text-4xl">
                    {item.title}
                  </h3>
                  <p className="whitespace-nowrap text-sm font-medium text-white/90 drop-shadow md:text-base">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


