"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { bestSellers } from "@/components/home/best-sellers-data";

gsap.registerPlugin(ScrollTrigger);

function SpecificationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 border-t border-slate-200 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <div className="text-[15px] font-medium text-slate-600">{label}</div>
      <div className="text-right text-[15px] font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default function BestSellersSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const visualRefs = useRef<Array<HTMLDivElement | null>>([]);
  const glowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const [trackOffset, setTrackOffset] = useState(0);

  useLayoutEffect(() => {
    if (reduceMotion) {
      return;
    }

    const section = sectionRef.current;
    const viewport = viewportRef.current;
    if (!section || !viewport) {
      return;
    }

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(bestSellers.length - 1, 1) * window.innerHeight}`,
        scrub: 1,
        pin: viewport,
        pinSpacing: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const nextIndex = Math.min(
            bestSellers.length - 1,
            Math.round(self.progress * (bestSellers.length - 1))
          );
          setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
        },
      });

      gsap.set(cardRefs.current, { autoAlpha: 0, y: 24, scale: 0.98 });
      gsap.set(visualRefs.current, { autoAlpha: 0, y: 150, x: -150, scale: 0.94 });
      gsap.set(glowRefs.current, { autoAlpha: 0 });
      gsap.set(cardRefs.current[0], { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(visualRefs.current[0], { autoAlpha: 1, y: 0, x: 0, scale: 1 });
      gsap.set(glowRefs.current[0], { autoAlpha: 1 });

      return () => trigger.kill();
    }, section);

    return () => ctx.revert();
  }, [reduceMotion]);

  useLayoutEffect(() => {
    if (reduceMotion) {
      return;
    }

    cardRefs.current.forEach((card, index) => {
      if (!card) {
        return;
      }

      gsap.to(card, {
        autoAlpha: index === activeIndex ? 1 : 0,
        y: index === activeIndex ? 0 : 24,
        scale: index === activeIndex ? 1 : 0.98,
        duration: 0.7,
        ease: "power2.out",
        overwrite: true,
      });
    });

    visualRefs.current.forEach((visual, index) => {
      if (!visual) {
        return;
      }

      gsap.to(visual, {
        autoAlpha: index === activeIndex ? 1 : 0,
        y: index === activeIndex ? 0 : 150,
        x: index === activeIndex ? 0 : -150,
        scale: index === activeIndex ? 1 : 0.94,
        duration: 0.9,
        ease: "power3.out",
        overwrite: true,
      });
    });

    glowRefs.current.forEach((glow, index) => {
      if (!glow) {
        return;
      }

      gsap.to(glow, {
        autoAlpha: index === activeIndex ? 1 : 0,
        duration: 0.7,
        ease: "power2.out",
        overwrite: true,
      });
    });

    // Update track offset to center the active title
    const activeTitle = titleRefs.current[activeIndex];
    const track = trackRef.current;
    if (activeTitle && track && track.parentElement) {
      const centerOfActive = activeTitle.offsetLeft + activeTitle.offsetWidth / 2;
      const centerOfContainer = track.parentElement.offsetWidth / 2;
      setTrackOffset(centerOfContainer - centerOfActive);
    }
  }, [activeIndex, reduceMotion]);

  const titleRailStyle = {
    WebkitMaskImage: "linear-gradient(90deg, transparent 0, black 6%, black 94%, transparent 100%)",
    maskImage: "linear-gradient(90deg, transparent 0, black 6%, black 94%, transparent 100%)",
  } as const;

  const titleClass =
    "shrink-0 whitespace-nowrap text-[clamp(2.9rem,5vw,6.6rem)] font-semibold leading-none tracking-[-0.08em] transition-all duration-700 ease-out";

  if (reduceMotion) {
    return (
      <section className="hidden bg-white text-slate-900 lg:block">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0a7ae6]">
            Best sellers
          </p>
          <div className="relative mt-2 flex w-full justify-center lg:mt-4" style={titleRailStyle}>
            <div className="flex min-w-max items-center justify-center gap-14 py-0.5">
              {bestSellers.map((item, index) => (
                <h2
                  key={item.id}
                  className={`${titleClass} ${
                    index === 0
                      ? "translate-y-[-0.02em] text-slate-900 opacity-100"
                      : "translate-y-[0.02em] text-slate-300 opacity-60"
                  }`}
                >
                  {item.name}
                </h2>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] space-y-6 px-4 pb-10 sm:px-6 lg:px-8">
          {bestSellers.map((item) => (
            <div key={item.id} className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="rounded-[28px] border border-slate-200 bg-[#f8fafc] px-5 py-5 md:px-8 md:py-7">
                <div className="flex flex-wrap items-end gap-x-3 gap-y-1 border-b border-slate-200 pb-6">
                  <span className="text-[27px] font-semibold text-slate-900">{item.price}</span>
                  <span className="text-[15px] text-slate-400 line-through">{item.oldPrice}</span>
                  <span className="text-[16px] font-medium text-[#0a7ae6]">{item.discount}</span>
                </div>
                <p className="mt-5 max-w-[34rem] text-[17px] leading-8 text-slate-700 md:text-[18px]">
                  {item.description}
                </p>
                <div className="mt-6">
                  {item.specs.map((spec) => (
                    <SpecificationRow key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                </div>
                <button className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#0a7ae6] px-6 text-[16px] font-medium text-white">
                  Add to cart
                </button>
              </div>
              <div className="relative min-h-[350px] lg:h-full lg:min-h-[450px]">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(10,122,230,0.18)_0%,_rgba(10,122,230,0.08)_30%,_rgba(10,122,230,0)_68%)] blur-3xl" />
                <Image src={item.image} alt={item.imageAlt} fill className="object-contain" sizes="100vw" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="hidden relative bg-white text-slate-900 lg:block"
      style={{ height: `${bestSellers.length * 105}vh` }}
    >
      <div
        ref={viewportRef}
        className="mx-auto flex h-screen max-w-[1600px] flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
      >
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0a7ae6]">
          Best sellers
        </p>

        <div className="relative mt-2 w-full overflow-visible lg:mt-4" style={titleRailStyle}>
          <div 
            ref={trackRef}
            className="flex w-max items-center gap-14 py-0.5 transition-transform duration-700 ease-out"
            style={{ transform: `translateX(${trackOffset}px)` }}
          >
            {bestSellers.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <h2
                  key={item.id}
                  ref={(node) => { titleRefs.current[index] = node; }}
                  className={`${titleClass} ${
                    isActive
                      ? "translate-y-[-0.02em] text-slate-900 opacity-100"
                      : "translate-y-[0.02em] text-slate-300 opacity-50"
                  }`}
                >
                  {item.name}
                </h2>
              );
            })}
          </div>
        </div>

        <div className="mt-0 grid flex-1 items-center gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
          <div className="relative order-2 min-h-[420px] pb-4 sm:min-h-[460px] lg:order-1 lg:min-h-[560px] lg:pb-0">
            {bestSellers.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={item.id}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  className={`absolute inset-0 flex items-center transition-all duration-700 ease-out ${
                    isActive ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-6 scale-[0.98]"
                  }`}
                >
                  <div className="relative z-10 w-full max-w-[640px] rounded-[28px] border border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-6 shadow-[0_20px_70px_rgba(15,23,42,0.05)] sm:px-8 sm:py-8 md:px-10 md:py-9">
                    <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-6">
                      <div>
                        <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                          <span className="text-[26px] font-semibold text-slate-900 sm:text-[32px]">{item.price}</span>
                          <span className="text-[14px] text-slate-400 line-through sm:text-[16px]">{item.oldPrice}</span>
                          <span className="text-[14px] font-medium text-[#0a7ae6] sm:text-[17px]">{item.discount}</span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 max-w-[34rem] text-[16px] leading-8 text-slate-700 sm:text-[17px] md:text-[19px]">
                      {item.description}
                    </p>

                    <div className="mt-6">
                      {item.specs.map((spec) => (
                        <SpecificationRow key={spec.label} label={spec.label} value={spec.value} />
                      ))}
                    </div>

                    <a
                      href={`/product?id=${item.id}`}
                      className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#0a7ae6] px-6 text-[16px] font-medium text-white transition-all hover:bg-[#086ac9] shadow-lg shadow-blue-500/15 active:scale-[0.99]"
                    >
                      View Details & Buy
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative order-1 flex items-center justify-center pb-0 lg:order-2 lg:justify-end lg:pb-0">
            <div className="relative min-h-[360px] w-full max-w-[900px] sm:min-h-[440px] lg:min-h-[580px]">
              {bestSellers.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={item.id}
                    ref={(node) => {
                      visualRefs.current[index] = node;
                    }}
                    className={`absolute inset-0 flex items-center justify-center pb-0 transition-all duration-1000 ease-out ${
                      isActive
                        ? "opacity-100 translate-y-0 translate-x-0 scale-100"
                        : "opacity-0 translate-y-32 -translate-x-32 scale-[0.94]"
                    }`}
                  >
                    <div
                      ref={(node) => {
                        glowRefs.current[index] = node;
                      }}
                      className={`absolute inset-0 rounded-full blur-3xl pointer-events-none ${
                        isActive
                          ? "bg-[radial-gradient(circle,_rgba(10,122,230,0.12)_0%,_rgba(10,122,230,0.04)_40%,_transparent_70%)]"
                          : "bg-transparent"
                      }`}
                    />
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      className="object-contain filter drop-shadow-[0_25px_45px_rgba(15,23,42,0.12)]"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority={index === 0}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}







