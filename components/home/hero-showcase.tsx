"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { banners as defaultBanners } from "@/components/home/content";

type BannerType = {
  src: string;
  mobileSrc?: string | null;
  alt: string;
  title: string;
  category?: string | null;
  caption?: string | null;
  cta?: string | null;
  linkUrl?: string | null;
};

const SLIDE_DURATION = 6000;
const PROGRESS_STEP = 50;
function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".mkv") ||
    clean.startsWith("data:video") ||
    clean.startsWith("blob:") ||
    clean.includes("video") ||
    clean.includes(".mp4") ||
    clean.includes(".webm") ||
    clean.includes(".mov")
  );
}

export default function HeroShowcase() {
  const [bannerList, setBannerList] = useState<BannerType[]>(defaultBanners);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch("/api/banners");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBannerList(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch active banners:", err);
      }
    }
    fetchBanners();
  }, []);

  const activeBanners = bannerList.length > 0 ? bannerList : defaultBanners;

  // Extended array for seamless forward/backward infinite looping: [Last, ...Banners, First]
  const extendedBanners = [
    activeBanners[activeBanners.length - 1],
    ...activeBanners,
    activeBanners[0],
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 40;

  // Handle wrap-around seamlessly after transition finishes
  useEffect(() => {
    let resetTimer: NodeJS.Timeout;
    if (currentIndex === extendedBanners.length - 1) {
      resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 700);
    } else if (currentIndex === 0) {
      resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(activeBanners.length);
      }, 700);
    }
    return () => clearTimeout(resetTimer);
  }, [currentIndex, extendedBanners.length, activeBanners.length]);

  // Re-enable transition after position reset
  useEffect(() => {
    if (!isTransitioning) {
      const enableTimer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(enableTimer);
    }
  }, [isTransitioning]);

  // Active slide timer & progress bar
  useEffect(() => {
    if (!isPlaying) return;

    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + (PROGRESS_STEP / SLIDE_DURATION) * 100;
      });
    }, PROGRESS_STEP);

    const slideTimer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearInterval(slideTimer);
    };
  }, [currentIndex, isPlaying]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    } else if (isRightSwipe) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Determine active 0-based index for banners
  const activeDotIndex =
    currentIndex === 0
      ? activeBanners.length - 1
      : currentIndex === extendedBanners.length - 1
      ? 0
      : currentIndex - 1;

  return (
    <section className="w-full bg-white overflow-hidden rounded-none pt-0">
      {/* FULL WIDTH SHARP CAROUSEL TRACK */}
      <div
        className="relative w-full aspect-[9/16] sm:aspect-[1672/941] overflow-hidden touch-pan-y rounded-none bg-white"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex h-full ${
            isTransitioning
              ? "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              : "transition-none"
          }`}
          style={{
            width: `${extendedBanners.length * 100}%`,
            transform: `translateX(-${(currentIndex * 100) / extendedBanners.length}%)`,
          }}
        >
          {extendedBanners.map((banner, index) => {
            const linkHref = banner.linkUrl || "/shop";
            return (
              <div
                key={`${banner.src}-${index}`}
                className="relative h-full shrink-0 overflow-hidden rounded-none bg-white"
                style={{ width: `${100 / extendedBanners.length}%` }}
              >
                <Link href={linkHref} className="block relative h-full w-full">
                  {/* DESKTOP BANNER */}
                  <div className="hidden sm:block relative h-full w-full">
                    {isVideoUrl(banner.src) ? (
                      <video
                        src={banner.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <Image
                        src={banner.src}
                        alt={banner.alt || banner.title}
                        fill
                        priority={index === 1}
                        className="object-cover object-center"
                        sizes="100vw"
                      />
                    )}
                  </div>

                  {/* MOBILE BANNER */}
                  <div className="sm:hidden relative h-full w-full">
                    {isVideoUrl(banner.mobileSrc || banner.src) ? (
                      <video
                        key={banner.mobileSrc || banner.src}
                        src={banner.mobileSrc || banner.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <Image
                        src={banner.mobileSrc || banner.src}
                        alt={banner.alt || banner.title}
                        fill
                        priority={index === 1}
                        className="object-cover object-center"
                        sizes="100vw"
                      />
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* PROGRESS DOT PAGINATION OVERLAY UPWARD ON HERO BANNER */}
        <div className="absolute inset-x-0 bottom-4 sm:bottom-6 z-20 flex items-center justify-center px-6">
          <div className="flex items-center gap-2.5">
            {activeBanners.map((banner, index) => {
              const isActive = index === activeDotIndex;

              return isActive ? (
                <button
                  key={`${banner.src}-${index}`}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(index + 1);
                  }}
                  className="relative w-8 sm:w-9 h-2 sm:h-2.5 rounded-full bg-neutral-300 overflow-hidden transition-all duration-300 cursor-pointer shadow-md"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-neutral-900 rounded-full transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </button>
              ) : (
                <button
                  key={`${banner.src}-${index}`}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(index + 1);
                  }}
                  className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-neutral-400/80 hover:bg-neutral-700 transition-all duration-300 cursor-pointer shadow-md"
                />
              );
            })}
          </div>

          {/* PLAY / PAUSE CONTROLLER */}
          <button
            type="button"
            aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute right-6 sm:right-10 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
