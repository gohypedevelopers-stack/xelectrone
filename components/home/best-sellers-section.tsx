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
  const trackRef = useRef<HTMLDivElement | null>(null);

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const visualRefs = useRef<Array<HTMLDivElement | null>>([]);
  const glowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    if (reduceMotion || isMobile) return;

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
          opacity: i === 0 ? 1 : 0.4,
          color: i === 0 ? "#0f172a" : "#cbd5e1",
        });
      });

      glowRefs.current.forEach((glow, i) => {
        if (!glow) return;
        gsap.set(glow, { autoAlpha: i === 0 ? 1 : 0 });
      });

      // Position title rail initially
      gsap.set(track, { x: getTitleX(0) });

      const numSlides = bestSellers.length;
      const scrollDistance = (numSlides - 1) * window.innerHeight;

      // Master Timeline scrubbed by ScrollTrigger
      // Pin sectionRef directly with pinSpacing: true so GSAP reserves DOM space
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 0.6, // Physics scrub dampening
          pin: section,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // For each transition step between slide i and slide i+1:
      // Timeline runs from t = 0 to t = (numSlides - 1)
      for (let i = 0; i < numSlides - 1; i++) {
        const tStart = i;

        // Phase 1 (t = i + 0.15 -> i + 0.45): Card i and Visual i fade out cleanly
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
            { opacity: 0.4, color: "#cbd5e1", ease: "power1.inOut", duration: 0.5 },
            tStart + 0.25
          );
        }

        // Phase 2 (t = i + 0.2 -> i + 0.8): Title rail slides to center title i+1
        tl.to(
          track,
          {
            x: () => getTitleX(i + 1),
            ease: "power2.inOut",
            duration: 0.6,
          },
          tStart + 0.2
        );

        // Phase 3 (t = i + 0.52 -> i + 0.87): Card i+1 and Visual i+1 fade in cleanly (No overlap with Card i!)
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
  }, [reduceMotion, isMobile]);

  const titleRailStyle = {
    WebkitMaskImage:
      "linear-gradient(90deg, transparent 0, black 6%, black 94%, transparent 100%)",
    maskImage:
      "linear-gradient(90deg, transparent 0, black 6%, black 94%, transparent 100%)",
  } as const;

  const titleClass =
    "shrink-0 whitespace-nowrap text-[clamp(1.8rem,5vw,6.6rem)] font-semibold leading-none tracking-[-0.08em] will-change-transform";

  if (reduceMotion) {
    return (
      <section className="bg-white py-12 text-slate-900 hidden md:block">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0a7ae6]">
            Best sellers
          </p>
        </div>
        <div className="mx-auto max-w-[1600px] space-y-8 px-4 pb-10 sm:px-6 lg:px-8">
          {bestSellers.map((item) => (
            <div key={item.id} className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="rounded-[28px] border border-slate-200 bg-[#f8fafc] px-6 py-6 md:px-8 md:py-7">
                <div className="flex flex-wrap items-end gap-x-3 gap-y-1 border-b border-slate-200 pb-6">
                  <span className="text-[27px] font-semibold text-slate-900">{item.price}</span>
                  {item.oldPrice && (
                    <span className="text-[15px] text-slate-400 line-through">{item.oldPrice}</span>
                  )}
                  {item.discount && (
                    <span className="text-[16px] font-medium text-[#0a7ae6]">{item.discount}</span>
                  )}
                </div>
                <p className="mt-5 max-w-[34rem] text-[17px] leading-8 text-slate-700 md:text-[18px]">
                  {item.description}
                </p>
                <div className="mt-6">
                  {item.specs.map((spec) => (
                    <SpecificationRow key={spec.label} label={spec.label} value={spec.value} />
                  ))}
                </div>
                <a
                  href={`/product?id=${item.id}`}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#0a7ae6] px-6 text-[16px] font-medium text-white hover:bg-[#086ac9] transition-colors"
                >
                  View Details & Buy
                </a>
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
      className="relative min-h-screen h-screen bg-white text-slate-900 overflow-hidden hidden md:block"
    >
      <div
        ref={viewportRef}
        className="mx-auto flex h-full max-w-[1600px] flex-col justify-between px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10"
      >
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0a7ae6]">
          Best sellers
        </p>

        <div className="relative mt-2 w-full overflow-hidden lg:mt-4" style={titleRailStyle}>
          <div
            ref={trackRef}
            className="flex w-max items-center gap-14 py-0.5 will-change-transform"
          >
            {bestSellers.map((item, index) => (
              <h2
                key={item.id}
                ref={(node) => {
                  titleRefs.current[index] = node;
                }}
                className={titleClass}
              >
                {item.name}
              </h2>
            ))}
          </div>
        </div>

        <div className="my-auto grid flex-1 items-center gap-2 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
          <div className="relative order-2 min-h-[320px] pb-2 sm:min-h-[420px] sm:pb-4 lg:order-1 lg:min-h-[560px] lg:pb-0">
            {bestSellers.map((item, index) => (
              <div
                key={item.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="absolute inset-0 flex items-center will-change-[transform,opacity]"
              >
                <div className="relative z-10 w-full max-w-[640px] rounded-[20px] sm:rounded-[28px] border border-slate-200/80 bg-white/90 backdrop-blur-md px-4 py-4 shadow-[0_20px_70px_rgba(15,23,42,0.05)] sm:px-8 sm:py-8 md:px-10 md:py-9 max-h-[calc(100vh-320px)] sm:max-h-none overflow-y-auto">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-6">
                    <div>
                      <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                        <span className="text-[22px] font-semibold text-slate-900 sm:text-[32px]">
                          {item.price}
                        </span>
                        {item.oldPrice && (
                          <span className="text-[14px] text-slate-400 line-through sm:text-[16px]">
                            {item.oldPrice}
                          </span>
                        )}
                        {item.discount && (
                          <span className="text-[14px] font-medium text-[#0a7ae6] sm:text-[17px]">
                            {item.discount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 sm:mt-5 max-w-[34rem] text-[14px] leading-6 text-slate-700 sm:text-[17px] sm:leading-8 md:text-[19px]">
                    {item.description}
                  </p>

                  <div className="mt-3 sm:mt-6">
                    {item.specs.map((spec) => (
                      <SpecificationRow key={spec.label} label={spec.label} value={spec.value} />
                    ))}
                  </div>

                  <a
                    href={`/product?id=${item.id}`}
                    className="mt-4 sm:mt-8 inline-flex h-11 sm:h-14 w-full items-center justify-center rounded-full bg-[#0a7ae6] px-6 text-[14px] sm:text-[16px] font-medium text-white transition-all hover:bg-[#086ac9] shadow-lg shadow-blue-500/15 active:scale-[0.99]"
                  >
                    View Details & Buy
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="relative order-1 flex items-center justify-center pb-0 lg:order-2 lg:justify-end lg:pb-0">
            <div className="relative min-h-[220px] w-full max-w-[900px] sm:min-h-[440px] lg:min-h-[580px]">
              {bestSellers.map((item, index) => (
                <div
                  key={item.id}
                  ref={(node) => {
                    visualRefs.current[index] = node;
                  }}
                  className="absolute inset-0 flex items-center justify-center pb-0 will-change-[transform,opacity]"
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
                    className="object-contain filter drop-shadow-[0_25px_45px_rgba(15,23,42,0.12)]"
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
