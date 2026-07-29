"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type BuyerReview = {
  id: number;
  name: string;
  avatar: string;
  text: string;
  size: "sm" | "md" | "lg";
  mobilePos: { top: string; left: string };
  desktopPos: { top: string; left: string };
  cardSide: "left" | "right";
};

const reviews: BuyerReview[] = [
  {
    id: 0,
    name: "Siva M.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    text: "Never had a bad experience. Totally worth it every time.",
    size: "md",
    mobilePos: { top: "18%", left: "25%" },
    desktopPos: { top: "25%", left: "28%" },
    cardSide: "right",
  },
  {
    id: 1,
    name: "Monika B.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    text: "Premium feel with amazing performance. Loved it.",
    size: "sm",
    mobilePos: { top: "20%", left: "75%" },
    desktopPos: { top: "48%", left: "55%" },
    cardSide: "right",
  },
  {
    id: 2,
    name: "Varshini W.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    text: "Sound clarity is insane. Didn't expect this at this price.",
    size: "lg",
    mobilePos: { top: "50%", left: "82%" },
    desktopPos: { top: "62%", left: "82%" },
    cardSide: "left",
  },
  {
    id: 3,
    name: "David R.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    text: "Reliable and consistent. XElectron keeps getting better.",
    size: "sm",
    mobilePos: { top: "50%", left: "18%" },
    desktopPos: { top: "25%", left: "76%" },
    cardSide: "left",
  },
  {
    id: 4,
    name: "Tara S.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    text: "XElectron always delivers. Sound quality is just next level.",
    size: "sm",
    mobilePos: { top: "80%", left: "18%" },
    desktopPos: { top: "50%", left: "16%" },
    cardSide: "right",
  },
  {
    id: 5,
    name: "Ramkumar T.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    text: "Been using it daily. No complaints at all.",
    size: "lg",
    mobilePos: { top: "48%", left: "50%" },
    desktopPos: { top: "50%", left: "38%" },
    cardSide: "right",
  },
  {
    id: 6,
    name: "Ananya K.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    text: "Exceeded my expectations! Build quality feels like luxury high-end.",
    size: "sm",
    mobilePos: { top: "80%", left: "50%" },
    desktopPos: { top: "72%", left: "26%" },
    cardSide: "right",
  },
  {
    id: 7,
    name: "Aarav P.",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    text: "Fast delivery & amazing customer care response.",
    size: "sm",
    mobilePos: { top: "80%", left: "82%" },
    desktopPos: { top: "72%", left: "68%" },
    cardSide: "left",
  },
];

export default function VerifiedReviewsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close card when clicking outside the section
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
        setActiveIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeReview = activeIndex !== null ? reviews[activeIndex] : null;

  // Typewriter effect on active review change
  useEffect(() => {
    if (activeIndex === null || !activeReview) {
      setTypedText("");
      setIsTyping(false);
      return;
    }

    setTypedText("");
    setIsTyping(true);
    let i = 0;
    const fullText = activeReview.text;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [activeIndex, activeReview]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === null ? 0 : (prev - 1 + reviews.length) % reviews.length));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % reviews.length));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseOffset({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  };

  const handleCanvasClick = () => {
    setActiveIndex(null);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f8fafc] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* HEADER TITLE & NAVIGATION BUTTONS IN ONE LINE */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-[42px] sm:whitespace-nowrap">
            Real reviews from verified buyers
          </h2>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous review"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ea580c] text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#c2410c] hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next review"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ea580c] text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#c2410c] hover:scale-105 active:scale-95"
            >
              <ChevronRight className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* SCATTERED AVATAR PARALLAX CANVAS */}
        <div
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
          className="relative min-h-[300px] sm:min-h-[360px] w-full rounded-3xl bg-transparent p-2 overflow-hidden cursor-pointer"
        >
          {reviews.map((rev) => {
            const isActive = rev.id === activeIndex;
            const pos = isMobile ? rev.mobilePos : rev.desktopPos;

            let circleSize = "w-11 h-11 sm:w-12 sm:h-12";
            let depth = 10;
            if (rev.size === "md") {
              circleSize = "w-14 h-14 sm:w-18 sm:h-18";
              depth = 16;
            }
            if (rev.size === "lg") {
              circleSize = "w-16 h-16 sm:w-22 sm:h-22";
              depth = 24;
            }

            const moveX = isMobile ? 0 : mouseOffset.x * depth;
            const moveY = isMobile ? 0 : mouseOffset.y * depth;

            return (
              <div
                key={rev.id}
                className={`absolute transition-all duration-300 ease-out ${
                  isActive ? "z-40" : "z-10"
                }`}
                style={{
                  top: pos.top,
                  left: pos.left,
                  transform: `translate(-50%, -50%) translate3d(${moveX}px, ${moveY}px, 0)`,
                }}
              >
                {/* BLUE RADIAL GLOW ONLY WHEN ACTIVE */}
                {isActive && (
                  <div className="absolute -inset-4 sm:-inset-5 rounded-full bg-blue-500/30 blur-xl animate-pulse" />
                )}

                {/* AVATAR CIRCLE BUTTON - CLICK TO TOGGLE AND HOVER ON DESKTOP */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(isActive ? null : rev.id);
                  }}
                  onMouseEnter={() => !isMobile && setActiveIndex(rev.id)}
                  className={`relative overflow-hidden rounded-full border-2 bg-slate-100 shadow-lg transition-all duration-300 ${circleSize} ${
                    isActive
                      ? "border-[#0a7ae6] ring-4 ring-blue-500/30 scale-110 shadow-blue-500/20 shadow-xl"
                      : "border-white opacity-85 hover:opacity-100 hover:scale-110"
                  }`}
                >
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="h-full w-full object-cover pointer-events-none"
                  />
                </button>

                {/* DESKTOP FLOATING REVIEW CARD POPOVER */}
                {isActive && (
                  <div
                    className={`hidden md:block absolute z-50 w-72 lg:w-80 pointer-events-none animate-in fade-in zoom-in-95 duration-200 ${
                      rev.cardSide === "left"
                        ? "right-full mr-3 top-1/2 -translate-y-1/2"
                        : "left-full ml-3 top-1/2 -translate-y-1/2"
                    }`}
                  >
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_15px_40px_rgba(15,23,42,0.12)]">
                      <p className="min-h-[40px] text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                        &quot;{typedText}&quot;
                        {isTyping && (
                          <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#0a7ae6] animate-pulse" />
                        )}
                      </p>
                      <p className="mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {rev.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MOBILE REVIEW POPOVER CARD - SHOWN ONLY WHEN AN AVATAR IS SELECTED */}
        {activeIndex !== null && activeReview && (
          <div className="mt-4 block md:hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-md transition-all">
              <p className="min-h-[36px] text-sm font-medium text-slate-800 leading-relaxed">
                &quot;{typedText}&quot;
                {isTyping && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#0a7ae6] animate-pulse" />}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {activeReview.name}
                </span>
                <span className="text-[11px] font-semibold text-[#0a7ae6]">
                  Tap outside to dismiss
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
