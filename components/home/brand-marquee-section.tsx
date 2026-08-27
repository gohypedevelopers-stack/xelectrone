"use client";

import Image from "next/image";
import {
  defaultBrandMarqueeItems,
  type BrandMarqueeItemType,
} from "@/lib/shared/default-brand-marquee";

export default function BrandMarqueeSection({
  items,
}: {
  items?: BrandMarqueeItemType[];
}) {
  const displayItems =
    items && items.length > 0
      ? items.filter((i) => i.isActive ?? true)
      : defaultBrandMarqueeItems;

  if (displayItems.length === 0) return null;

  // Duplicate items for continuous smooth infinite scrolling
  const marqueeList = [...displayItems, ...displayItems, ...displayItems];

  return (
    <section className="relative w-full overflow-hidden bg-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.25em] text-slate-400">
          Available on all major platforms
        </p>
      </div>

      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max items-center gap-12 sm:gap-16 lg:gap-24 marquee-scroll py-2">
          {marqueeList.map((b, i) => {
            const content = b.logoUrl ? (
              <div className="relative flex items-center justify-center shrink-0 h-12 sm:h-14 md:h-16 lg:h-18 transition-all duration-300 hover:scale-105 hover:opacity-85">
                <Image
                  src={b.logoUrl}
                  alt={b.name}
                  width={240}
                  height={75}
                  unoptimized
                  className="h-full w-auto max-w-[170px] sm:max-w-[210px] lg:max-w-[250px] object-contain select-none filter drop-shadow-2xs"
                />
              </div>
            ) : (
              <span
                className="shrink-0 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight transition-all duration-300 hover:scale-105 hover:opacity-75 cursor-default select-none"
                style={{ color: b.color }}
              >
                {b.name}
              </span>
            );

            if (b.linkUrl) {
              return (
                <a
                  key={`${b.name}-${i}`}
                  href={b.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7ae6] rounded-md"
                >
                  {content}
                </a>
              );
            }

            return (
              <div key={`${b.name}-${i}`} className="shrink-0">
                {content}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .marquee-scroll {
          animation: scrollLeft 35s linear infinite;
        }
        .marquee-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
