"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShoppingBag,
  Star,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { toast } from "sonner";

type CreatorVideoType = {
  id: string;
  title?: string | null;
  thumbnailUrl: string;
  videoUrl?: string | null;
  product?: {
    id: string;
    name: string;
    slug: string;
    mainImage: string;
    price?: string;
    oldPrice?: string | null;
    discount?: string | null;
    rating?: number;
    reviewsCount?: string;
    description?: string;
  } | null;
};

function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=)|img\.youtube\.com\/vi\/)([\w-]{11})/;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : null;
}

function extractYouTubeThumbnail(url: string): string {
  if (!url) return url;
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return url.trim();
}

export default function CreatorVideosSection() {
  const router = useRouter();
  const { addItem } = useCart();
  const [videoList, setVideoList] = useState<CreatorVideoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/creator-videos");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setVideoList(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch creator videos:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVideos();
  }, []);

  if (!isLoading && videoList.length === 0) {
    return null;
  }

  const videos = videoList;

  const toggleFlip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavigateToProduct = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    router.push(url);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -340 : 340;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="bg-white pt-2 sm:pt-4 pb-12 md:pb-16 text-slate-900 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* HEADER WITH TITLE AND SCROLL CONTROLS */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0a7ae6] flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Real Creator Reviews
            </p>
            <h2 className="mt-1 text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Approved by Creators
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-black/50">
              Click any video card to flip and discover the featured product
            </p>
          </div>

          {/* CAROUSEL ARROWS */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous videos"
              className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-[#0a7ae6] hover:text-[#0a7ae6] active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next videos"
              className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-[#0a7ae6] hover:text-[#0a7ae6] active:scale-95 cursor-pointer"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* HORIZONTALLY SCROLLABLE CAROUSEL TRACK */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 sm:gap-6 scroll-smooth"
        >
          {videos.map((vid) => {
            const ytId = extractYouTubeId(vid.videoUrl || vid.thumbnailUrl);
            const isFlipped = !!flippedCards[vid.id];
            const targetUrl = vid.product ? `/product/${vid.product.slug}` : "/shop";

            return (
              <div
                key={vid.id}
                className="group [perspective:1000px] aspect-[9/16] w-[260px] sm:w-[290px] md:w-[320px] shrink-0 snap-start select-none cursor-pointer"
                onClick={(e) => toggleFlip(vid.id, e)}
              >
                {/* 3D FLIPPABLE INNER CONTAINER */}
                <div
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                  className="relative w-full h-full rounded-2xl"
                >
                  {/* ───────────────── FRONT SIDE: AUTOPLAY VIDEO ───────────────── */}
                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(0deg)",
                    }}
                    className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-slate-950 border border-black/10 shadow-xs transition-opacity duration-300 ${
                      isFlipped ? "pointer-events-none opacity-0 z-0" : "pointer-events-auto opacity-100 z-10"
                    }`}
                  >
                    {/* VIDEO AUTOPLAY LAYER */}
                    {ytId ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden pointer-events-none select-none">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&fs=0&playsinline=1&iv_load_policy=3&enablejsapi=1`}
                          title={vid.title || "Creator video"}
                          allow="autoplay; encrypted-media; picture-in-picture"
                          tabIndex={-1}
                          className="pointer-events-none absolute inset-0 w-full h-full object-cover border-0 select-none scale-[1.03]"
                        />
                      </div>
                    ) : vid.videoUrl ? (
                      <video
                        src={vid.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                      />
                    ) : (
                      <Image
                        src={extractYouTubeThumbnail(vid.thumbnailUrl)}
                        alt={vid.title || "Approved by Creators"}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 260px, 320px"
                      />
                    )}

                    {/* TRANSPARENT INTERACTION SHIELD & SUBTLE BOTTOM GRADIENT */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-auto cursor-pointer select-none" />

                    {/* BOTTOM TITLE */}
                    {vid.title && (
                      <div className="absolute bottom-4 left-4 right-4 z-20 text-white pointer-events-auto">
                        <p className="text-xs sm:text-sm font-semibold leading-snug drop-shadow-md line-clamp-2">
                          {vid.title}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ───────────────── BACK SIDE: EXACT STOREFRONT PRODUCT CARD ───────────────── */}
                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                    className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-white text-slate-900 border border-slate-200 p-3.5 sm:p-4 flex flex-col cursor-pointer shadow-xs transition-opacity duration-300 ${
                      isFlipped ? "pointer-events-auto opacity-100 z-10" : "pointer-events-none opacity-0 z-0"
                    }`}
                    onClick={(e) => toggleFlip(vid.id, e)}
                  >
                    {/* TOP CORNER FLIP BACK BUTTON */}
                    <button
                      type="button"
                      onClick={(e) => toggleFlip(vid.id, e)}
                      className="absolute right-2.5 top-2.5 z-20 flex size-8 items-center justify-center rounded-full bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Flip back to video"
                    >
                      <RotateCcw className="size-4" />
                    </button>

                    {/* PRODUCT IMAGE (TALL PROPORTIONAL CONTAINER) */}
                    <div
                      className="relative h-[58%] w-full rounded-xl bg-[#fbfbfd] overflow-hidden p-3 flex items-center justify-center group/img shrink-0"
                    >
                      <Image
                        src={vid.product?.mainImage || extractYouTubeThumbnail(vid.thumbnailUrl)}
                        alt={vid.product?.name || vid.title || "Product"}
                        fill
                        unoptimized
                        className="object-contain p-2 transition-transform duration-300 group-hover/img:scale-105"
                      />
                    </div>

                    {/* PRODUCT DETAILS BODY */}
                    <div className="flex flex-1 flex-col justify-between pt-2.5">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-semibold">
                          XELECTRON
                        </p>
                        <h3
                          className="line-clamp-2 text-[13px] sm:text-[14px] font-bold leading-snug text-slate-900"
                        >
                          {vid.product?.name || vid.title || "XElectron Smart Device"}
                        </h3>
                        <p className="text-[11px] leading-4 text-slate-500 line-clamp-2">
                          {vid.product?.description ||
                            "A compact white digital photo frame for desks, shelves, and bedside tables with crisp image playback."}
                        </p>

                        {/* PRICE SECTION (DIRECTLY UNDER DESCRIPTION) */}
                        <div className="flex items-baseline gap-2 pt-1.5">
                          <span className="text-[16px] sm:text-[18px] font-bold text-slate-900">
                            {vid.product?.price
                              ? vid.product.price.startsWith("₹")
                                ? vid.product.price
                                : `₹${vid.product.price}`
                              : "₹2999.00"}
                          </span>
                          {vid.product?.oldPrice ? (
                            <span className="text-[11px] sm:text-[12px] text-slate-400 line-through">
                              {vid.product.oldPrice.startsWith("₹")
                                ? vid.product.oldPrice
                                : `₹${vid.product.oldPrice}`}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* SINGLE FULL-WIDTH "BUY" BUTTON */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const numPrice =
                              parseFloat((vid.product?.price || "2999").replace(/[^\d.]/g, "")) || 2999;
                            addItem({
                              id: vid.product?.id || vid.id,
                              slug: vid.product?.slug || "shop",
                              name: vid.product?.name || vid.title || "XElectron Product",
                              price: numPrice,
                              image: vid.product?.mainImage || extractYouTubeThumbnail(vid.thumbnailUrl),
                              category: "Electronics",
                            });
                            router.push(targetUrl);
                          }}
                          className="inline-flex h-9 sm:h-10 w-full cursor-pointer items-center justify-center rounded-xl bg-[#0a7ae6] text-xs sm:text-sm font-bold text-white transition-colors hover:bg-[#0866c2] shadow-xs active:scale-[0.98]"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
