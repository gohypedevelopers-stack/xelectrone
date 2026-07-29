"use client";

const brands = [
  { name: "Amazon", color: "#FF9900" },
  { name: "Flipkart", color: "#2874F0" },
  { name: "Myntra", color: "#FF3F6C" },
  { name: "Croma", color: "#0F7C4F" },
  { name: "Reliance Digital", color: "#0033A0" },
  { name: "JioMart", color: "#0A3D8F" },
  { name: "Meesho", color: "#570A57" },
  { name: "Snapdeal", color: "#E40046" },
  { name: "Tata CLiQ", color: "#5C2D91" },
  { name: "Nykaa", color: "#FC2779" },
];

export default function BrandMarqueeSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          Available on all major platforms
        </p>
      </div>

      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-32 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-32 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max items-center gap-10 sm:gap-14 lg:gap-20 marquee-scroll">
          {[...brands, ...brands].map((b, i) => (
            <span
              key={i}
              className="shrink-0 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight transition-opacity duration-300 hover:opacity-70 cursor-default select-none"
              style={{ color: b.color }}
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
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
