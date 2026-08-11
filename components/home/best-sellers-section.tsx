"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { bestSellers, type BestSellerItem } from "@/components/home/best-sellers-data";
import { formatINR } from "@/lib/format-price";

gsap.registerPlugin(ScrollTrigger);

function SpecificationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 border-t border-slate-200/80 py-2.5 sm:py-3 first:border-t-0 first:pt-0 last:pb-0">
      <div className="text-[13px] sm:text-[15px] font-medium text-slate-600">{label}</div>
      <div className="text-right text-[13px] sm:text-[15px] font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default function BestSellersSection({ additionalItems = [] }: { additionalItems?: BestSellerItem[] }) {
  const items = useMemo(() => {
    const selectedById = new Map(additionalItems.map((item) => [item.id, item]));
    const defaultItemIds = new Set(bestSellers.map((item) => item.id));

    // Keep the original storefront slides in place. A dashboard-selected product
    // either refreshes its matching slide or is appended as another slide.
    return [
      ...bestSellers.map((item) => selectedById.get(item.id) ?? item),
      ...additionalItems.filter((item) => !defaultItemIds.has(item.id)),
    ];
  }, [additionalItems]);

  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const visualRefs = useRef<Array<HTMLDivElement | null>>([]);
  const glowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);

  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!section || !viewport || !track) return;

    const ctx = gsap.context(() => {
      // Helper: calculate X translation to center title[index] inside container
      const getTitleX = (index: number) => {
        const title = titleRefs.current[index];
        if (!title || !track.parentElement) return 0;
        const titleCenter = title.offsetLeft + title.offsetWidth / 2;
        const containerCenter = track.parentElement.offsetWidth / 2;
        return containerCenter - titleCenter;
      };

      // Set initial states (Slide 0 visible, rest hidden)
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.set(card, {
          autoAlpha: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 35,
          scale: i === 0 ? 1 : 0.96,
        });
      });

      visualRefs.current.forEach((visual, i) => {
        if (!visual) return;
        gsap.set(visual, {
          autoAlpha: i === 0 ? 1 : 0,
          y: i === 0 ? 0 : 50,
          scale: i === 0 ? 1 : 0.94,
        });
      });

      titleRefs.current.forEach((title, i) => {
        if (!title) return;
        gsap.set(title, {
          opacity: i === 0 ? 1 : 0.35,
          color: i === 0 ? "#0f172a" : "#cbd5e1",
        });
      });

      glowRefs.current.forEach((glow, i) => {
        if (!glow) return;
        gsap.set(glow, { autoAlpha: i === 0 ? 1 : 0 });
      });

      // Position title rail initially
      gsap.set(track, { x: getTitleX(0) });

      const numSlides = items.length;
      const scrollDistance = (numSlides - 1) * window.innerHeight;

      // Master Timeline scrubbed by ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 0.8,
          pin: section,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 0; i < numSlides - 1; i++) {
        const tStart = i;

        const cardCur = cardRefs.current[i];
        const visualCur = visualRefs.current[i];
        const glowCur = glowRefs.current[i];
        const titleCur = titleRefs.current[i];

        if (cardCur) {
          tl.to(
            cardCur,
            { autoAlpha: 0, y: -35, scale: 0.96, ease: "power2.in", duration: 0.35 },
            tStart + 0.15
          );
        }
        if (visualCur) {
          tl.to(
            visualCur,
            { autoAlpha: 0, y: -50, scale: 0.94, ease: "power2.in", duration: 0.35 },
            tStart + 0.15
          );
        }
        if (glowCur) {
          tl.to(glowCur, { autoAlpha: 0, ease: "power2.in", duration: 0.35 }, tStart + 0.15);
        }
        if (titleCur) {
          tl.to(
            titleCur,
            { opacity: 0.35, color: "#cbd5e1", ease: "power1.inOut", duration: 0.5 },
            tStart + 0.25
          );
        }

        tl.to(
          track,
          {
            x: () => getTitleX(i + 1),
            ease: "power2.inOut",
            duration: 0.6,
          },
          tStart + 0.2
        );

        const cardNext = cardRefs.current[i + 1];
        const visualNext = visualRefs.current[i + 1];
        const glowNext = glowRefs.current[i + 1];
        const titleNext = titleRefs.current[i + 1];

        if (cardNext) {
          tl.to(
            cardNext,
            { autoAlpha: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.35 },
            tStart + 0.52
          );
        }
        if (visualNext) {
          tl.to(
            visualNext,
            { autoAlpha: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.35 },
            tStart + 0.52
          );
        }
        if (glowNext) {
          tl.to(glowNext, { autoAlpha: 1, ease: "power2.out", duration: 0.35 }, tStart + 0.52);
        }
        if (titleNext) {
          tl.to(
            titleNext,
            { opacity: 1, color: "#0f172a", ease: "power1.inOut", duration: 0.5 },
            tStart + 0.25
          );
        }
      }
    }, section);

    return () => ctx.revert();
  }, [items, reduceMotion]);

  const goToSlide = (targetIndex: number) => {
    const section = sectionRef.current;
    if (!section || items.length < 2) return;
    const numSlides = items.length;
    const scrollDistance = (numSlides - 1) * window.innerHeight;
    const targetProgress = targetIndex / (numSlides - 1);
    const targetScroll = section.offsetTop + targetProgress * scrollDistance;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const titleRailStyle = {
    WebkitMaskImage:
      "linear-gradient(90deg, transparent 0, black 6%, black 94%, transparent 100%)",
    maskImage:
      "linear-gradient(90deg, transparent 0, black 6%, black 94%, transparent 100%)",
  } as const;

  const titleClass =
    "shrink-0 whitespace-nowrap text-[clamp(1.8rem,4vw,4.2rem)] font-bold leading-[1.2] tracking-[-0.03em] will-change-transform cursor-pointer transition-opacity duration-300 hover:opacity-100 select-none py-1";

  if (reduceMotion) {
    return (
      <section className="bg-white py-16 text-slate-900">
        <div className="mx-auto max-w-[1600px] px-6 py-6 sm:px-8 lg:px-12">
          <p className="text-center text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.1em] text-[#0a7ae6]">
            Best sellers
          </p>
        </div>
        <div className="mx-auto max-w-[1600px] space-y-12 px-6 pb-12 sm:px-8 lg:px-12">
          {items.map((item) => (
            <div key={item.id} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center">
              <div className="rounded-[28px] border border-slate-200 bg-[#f8fafc] px-6 py-6 md:px-8 md:py-8">
                <div className="border-b border-slate-200 pb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0a7ae6]">
                    XElectron
                  </p>
                  <h3 className="mt-1 text-[22px] font-bold text-slate-900 md:text-[28px]">
                    {item.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                    <span className="text-[27px] font-semibold text-slate-900">{formatINR(item.price)}</span>
                    {item.oldPrice && (
                      <span className="text-[15px] text-slate-400 line-through">{formatINR(item.oldPrice)}</span>
                    )}
                    {item.discount && (
                      <span className="text-[16px] font-medium text-[#0a7ae6]">{item.discount}</span>
                    )}
                  </div>
                </div>
                <p className="mt-5 max-w-[34rem] text-[16px] leading-7 text-slate-700 md:text-[17px]">
                  {item.description}
                </p>
                <div className="mt-6">
                  {item.specs.map((spec) => (
                    <SpecificationRow key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                </div>
                <Link
                  href={`/product/${item.slug || item.id}`}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#0a7ae6] px-6 text-[16px] font-medium text-white hover:bg-[#086ac9] transition-colors shadow-lg shadow-blue-500/15"
                >
                  View Details & Buy
                </Link>
              </div>
              <div className="relative min-h-[380px] lg:h-full lg:min-h-[520px]">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(10,122,230,0.18)_0%,_rgba(10,122,230,0.08)_30%,_rgba(10,122,230,0)_68%)] blur-3xl" />
                <Image src={item.image} alt={item.imageAlt} fill className="object-contain scale-110" sizes="100vw" />
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
      className="relative min-h-screen h-screen bg-white text-slate-900 overflow-hidden"
    >
      <div
        ref={viewportRef}
        className="mx-auto flex h-full max-w-[1600px] flex-col justify-between px-4 pt-10 pb-8 sm:px-8 sm:pt-12 sm:pb-10 lg:px-12 lg:pt-14 lg:pb-12"
      >
        {/* TOP HEADER BLOCK: Badge + Giant Title Rail */}
        <div className="relative z-20 shrink-0 flex flex-col items-center mb-4 sm:mb-6">
          <p className="text-center text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.1em] text-[#0a7ae6]">
            Best sellers
          </p>

          <div className="relative mt-2 w-full overflow-hidden py-1" style={titleRailStyle}>
            <div
              ref={trackRef}
              className="flex w-max items-center gap-12 sm:gap-16 py-1 will-change-transform"
            >
              {items.map((item, index) => (
                <h2
                  key={item.id}
                  ref={(node) => {
                    titleRefs.current[index] = node;
                  }}
                  onClick={() => goToSlide(index)}
                  className={titleClass}
                >
                  {item.name}
                </h2>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM PRODUCT SHOWCASE GRID */}
        <div className="relative z-10 grid w-full flex-1 items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
          <div className="relative order-2 min-h-[340px] sm:min-h-[420px] lg:order-1 lg:min-h-[480px] flex items-center">
            {items.map((item, index) => (
              <div
                key={item.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="absolute inset-0 flex items-center will-change-[transform,opacity]"
              >
                <div className="relative z-10 w-full max-w-[640px] rounded-[24px] sm:rounded-[32px] border border-slate-200/80 bg-white/90 backdrop-blur-md px-6 pt-5 pb-6 shadow-[0_20px_70px_rgba(15,23,42,0.05)] sm:px-8 sm:pt-7 sm:pb-8 max-h-[calc(100vh-240px)] overflow-y-auto no-scrollbar">
                  <div className="border-b border-slate-200/80 pb-4">
                    <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-[#0a7ae6]">
                      XElectron
                    </p>
                    <h3 className="mt-1 text-[22px] sm:text-[28px] font-bold tracking-tight text-slate-900">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                      <span className="text-[24px] font-semibold text-slate-900 sm:text-[30px]">
                        {formatINR(item.price)}
                      </span>
                      {item.oldPrice && (
                        <span className="text-[14px] text-slate-400 line-through sm:text-[16px]">
                          {formatINR(item.oldPrice)}
                        </span>
                      )}
                      {item.discount && (
                        <span className="text-[14px] font-medium text-[#0a7ae6] sm:text-[17px]">
                          {item.discount}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 max-w-[34rem] text-[14px] leading-6 text-slate-700 sm:text-[16px] sm:leading-7">
                    {item.description}
                  </p>

                  <div className="mt-4 sm:mt-6">
                    {item.specs.map((spec) => (
                      <SpecificationRow key={spec.label} label={spec.label} value={spec.value} />
                    ))}
                  </div>

                  <Link
                    href={`/product/${item.slug || item.id}`}
                    className="mt-6 inline-flex h-12 sm:h-14 w-full items-center justify-center rounded-full bg-[#0a7ae6] px-6 text-[14px] sm:text-[16px] font-medium text-white transition-all hover:bg-[#086ac9] shadow-lg shadow-blue-500/15 active:scale-[0.99]"
                  >
                    View Details & Buy
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="relative order-1 flex items-center justify-center lg:order-2 lg:justify-end h-full">
            <div className="relative min-h-[320px] w-full max-w-[900px] sm:min-h-[460px] lg:min-h-[580px] flex items-center justify-center">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  ref={(node) => {
                    visualRefs.current[index] = node;
                  }}
                  className="absolute inset-0 flex items-center justify-center will-change-[transform,opacity]"
                >
                  <div
                    ref={(node) => {
                      glowRefs.current[index] = node;
                    }}
                    className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(10,122,230,0.18)_0%,_rgba(10,122,230,0.08)_30%,_rgba(10,122,230,0)_68%)] blur-3xl pointer-events-none will-change-[opacity]"
                  />
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-contain filter drop-shadow-[0_25px_45px_rgba(15,23,42,0.12)] scale-110 sm:scale-120 lg:scale-125"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
