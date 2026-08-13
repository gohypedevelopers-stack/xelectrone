"use client";

import Image from "next/image";
import Link from "next/link";

import { formatINR } from "@/lib/format-price";
import { useEffect, useRef, useState } from "react";
import { Flame, Sparkles } from "lucide-react";

export type StorefrontDealOfTheDay = {
  title: string;
  description: string;
  image: string;
  badge: string | null;
  features: string[];
  unitsLeft: number;
  totalUnits: number;
  endsAt: string | null;
  product: { slug: string; name: string; price: string; oldPrice: string | null };
};

function getTimeLeftInfo(endsAt: string | null) {
  const now = new Date();
  const deadline = endsAt ? new Date(endsAt) : new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const remaining = Math.max(0, deadline.getTime() - now.getTime());

  const totalHours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);

  const isMoreThan24Hours = remaining > 24 * 60 * 60 * 1000;
  const isUrgent = remaining > 0 && remaining <= 3 * 60 * 60 * 1000;

  let labelText = "Ends In";
  let dateDisplay = "";

  if (isMoreThan24Hours) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDay = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
    const dayDiff = Math.round((targetDay.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

    labelText = "Offer";

    if (dayDiff <= 1) {
      dateDisplay = "Ends Tomorrow";
    } else {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      dateDisplay = `Ends ${deadline.getDate()} ${monthNames[deadline.getMonth()]}`;
    }
  }

  return {
    remaining,
    totalHours,
    minutes,
    seconds,
    isMoreThan24Hours,
    isUrgent,
    labelText,
    dateDisplay,
  };
}

function displayPrice(price: string) {
  return formatINR(price);
}

export default function DealOfTheDaySection({ deal }: { deal: StorefrontDealOfTheDay }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isWhite, setIsWhite] = useState(false);
  const [timerInfo, setTimerInfo] = useState(() => getTimeLeftInfo(deal.endsAt));
  const claimedPercent = Math.max(0, Math.min(100, Math.round(((deal.totalUnits - deal.unitsLeft) / deal.totalUnits) * 100)));

  // COUNTDOWN TIMER
  useEffect(() => {
    const updateTimer = () => setTimerInfo(getTimeLeftInfo(deal.endsAt));
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [deal.endsAt]);

  // SCROLL TRIGGER: FIRST BLACK, THEN TRANSITIONS TO WHITE ON IN-VIEW
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsWhite(entry.isIntersecting);
      },
      {
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatTime = (num: number) => String(num).padStart(2, "0");

  const isUrgent = timerInfo.isUrgent;

  return (
    <section
      ref={sectionRef}
      className={`px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28 transition-colors duration-700 ease-in-out ${
        isWhite ? "bg-[#fafbfc] text-slate-900" : "bg-[#080c14] text-white"
      }`}
    >
      <div className="mx-auto max-w-[1480px]">
        {/* SECTION HEADER */}
        <div className="mb-4 sm:mb-10 flex items-center justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#0a7ae6]">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Flash Offer
            </span>
            <h2
              className={`mt-0.5 text-lg xs:text-2xl font-normal tracking-tight transition-colors duration-700 whitespace-nowrap sm:text-3xl lg:text-4xl ${
                isWhite ? "text-slate-900" : "text-white"
              }`}
            >
              Deal of the day
            </h2>
          </div>

          {/* MOBILE ONLY TIMER BADGE */}
          <div
            className={`flex sm:hidden items-center gap-1.5 rounded-lg border px-2.5 py-1 shadow-xs transition-all duration-700 shrink-0 ${
              isUrgent
                ? "border-rose-300 bg-rose-50 text-rose-700 animate-pulse"
                : isWhite
                ? "border-blue-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-blue-50/80 text-slate-900"
                : "border-slate-800 bg-[#0f172a]/90 text-white"
            }`}
          >
            <div className="flex items-center gap-1">
              <Flame className={`h-3 w-3 ${isUrgent ? "fill-rose-600 text-rose-600 animate-bounce" : "fill-[#0a7ae6] text-[#0a7ae6] animate-pulse"}`} />
              <span className="text-[10px] font-extrabold">{deal.unitsLeft} Left</span>
            </div>
            <div className={`h-3 w-px ${isUrgent ? "bg-rose-200" : isWhite ? "bg-slate-300/80" : "bg-slate-700"}`} />
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                {timerInfo.labelText}
              </span>
              {timerInfo.isMoreThan24Hours ? (
                <span className="text-[10px] font-extrabold text-[#0a7ae6]">{timerInfo.dateDisplay}</span>
              ) : (
                <div className={`font-mono text-[11px] font-extrabold tracking-tight ${isUrgent ? "text-rose-600" : ""}`}>
                  <span>{formatTime(timerInfo.totalHours)}</span>:
                  <span>{formatTime(timerInfo.minutes)}</span>:
                  <span className={isUrgent ? "text-rose-600" : "text-[#0a7ae6]"}>{formatTime(timerInfo.seconds)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2-COLUMN GRID WITH 50/50 SIZING */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* LEFT COLUMN: LIFESTYLE IMAGE BANNER */}
          <div
            className={`relative overflow-hidden rounded-lg sm:rounded-xl border transition-all duration-700 lg:col-span-6 flex flex-col h-[210px] sm:h-full sm:min-h-[460px] lg:min-h-[550px] ${
              isWhite
                ? "border-slate-200/80 bg-slate-900"
                : "border-slate-800/90 bg-slate-950"
            }`}
          >
            <div className="relative h-full w-full min-h-[210px] sm:min-h-[460px] lg:min-h-[550px]">
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              
              {/* DOLBY AUDIO BADGE */}
              <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 flex items-center gap-2 rounded-xl bg-black/80 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 text-white border border-white/10 shadow-lg">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  {deal.badge || "Deal of the day"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DEAL DETAILS CARD WITH DESKTOP TIMER BOX */}
          <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-6 justify-between">
            {/* DESKTOP TIMER BOX */}
            <div
              className={`hidden sm:flex items-center justify-between rounded-[22px] border p-4.5 shadow-sm transition-all duration-700 ${
                isUrgent
                  ? "border-rose-200 bg-rose-50/90 text-rose-950 ring-2 ring-rose-500/20"
                  : isWhite
                  ? "border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/70 text-slate-900"
                  : "border-slate-800 bg-[#0f172a]/90 text-white"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-700 ${
                    isUrgent
                      ? "bg-rose-100 border border-rose-300 text-rose-600"
                      : isWhite
                      ? "bg-[#0a7ae6]/10 border border-[#0a7ae6]/20 text-[#0a7ae6]"
                      : "bg-[#0a7ae6]/20 border border-[#0a7ae6]/30 text-[#0a7ae6]"
                  }`}
                >
                  <Flame className={`h-5.5 w-5.5 ${isUrgent ? "fill-rose-600 text-rose-600 animate-bounce" : "fill-[#0a7ae6] text-[#0a7ae6] animate-pulse"}`} />
                </div>
                <div>
                  <p
                    className={`text-base font-bold leading-none transition-colors duration-700 ${
                      isUrgent ? "text-rose-900" : isWhite ? "text-slate-900" : "text-white"
                    }`}
                  >
                    {deal.unitsLeft}
                  </p>
                  <p
                    className={`mt-0.5 text-[10px] font-semibold uppercase tracking-widest transition-colors duration-700 ${
                      isUrgent ? "text-rose-600" : isWhite ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Units Left
                  </p>
                </div>
              </div>

              <div
                className={`h-8.5 w-px transition-colors duration-700 ${
                  isUrgent ? "bg-rose-200" : isWhite ? "bg-slate-200/80" : "bg-slate-800"
                }`}
              />

              {/* DYNAMIC TIMER / DATE DISPLAY */}
              <div className="text-right">
                <p
                  className={`text-[10px] font-semibold uppercase tracking-widest transition-colors duration-700 ${
                    isUrgent ? "text-rose-600" : "text-slate-400"
                  }`}
                >
                  {timerInfo.labelText}
                </p>

                {timerInfo.isMoreThan24Hours ? (
                  <div
                    className={`mt-0.5 text-lg sm:text-2xl font-bold tracking-tight transition-colors duration-700 ${
                      isWhite ? "text-[#0a7ae6]" : "text-sky-400"
                    }`}
                  >
                    {timerInfo.dateDisplay}
                  </div>
                ) : (
                  <div
                    className={`mt-0.5 font-mono text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors duration-700 ${
                      isUrgent
                        ? "text-rose-600"
                        : isWhite
                        ? "text-slate-900"
                        : "text-white"
                    }`}
                  >
                    <span>{formatTime(timerInfo.totalHours)}</span>:
                    <span>{formatTime(timerInfo.minutes)}</span>:
                    <span className={isUrgent ? "text-rose-600" : "text-[#0a7ae6]"}>
                      {formatTime(timerInfo.seconds)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCT CARD BODY */}
            <div
              className={`flex-1 flex flex-col justify-between rounded-2xl sm:rounded-[30px] border p-4 sm:p-7 lg:p-9 shadow-sm transition-all duration-700 ${
                isWhite
                  ? "border-slate-200/90 bg-white text-slate-900 shadow-sm"
                  : "border-slate-800 bg-[#0e1626] text-white shadow-2xl"
              }`}
            >
              <div>
                {/* PRODUCT TITLE & SUBTITLE */}
                <h3
                  className={`text-2xl font-semibold tracking-tight transition-colors duration-700 sm:text-4xl ${
                    isWhite ? "text-slate-900" : "text-white"
                  }`}
                >
                  {deal.title}
                </h3>
                <p
                  className={`mt-1 text-sm sm:text-base leading-relaxed transition-colors duration-700 ${
                    isWhite ? "text-slate-600" : "text-slate-300"
                  }`}
                >
                  {deal.description}
                </p>

                {/* SPECIFICATION PILLS WITH WEIGHT SEMIBOLD & 11PX */}
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-2.5">
                  {deal.features.map((spec) => (
                    <span
                      key={spec}
                      className={`rounded-full border px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider transition-all duration-700 ${
                        isWhite
                          ? "border-[#0a7ae6]/30 bg-blue-50/70 text-[#0a7ae6] hover:bg-blue-100"
                          : "border-[#0a7ae6]/40 bg-[#0a7ae6]/15 text-[#38bdf8] hover:bg-[#0a7ae6]/25"
                      }`}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* PRICING */}
                <div
                  className={`mt-4 sm:mt-5 border-t pt-3.5 sm:pt-4 transition-colors duration-700 ${
                    isWhite ? "border-slate-100" : "border-slate-800"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                    <span
                      className={`text-xl font-medium transition-colors duration-700 sm:text-2xl lg:text-3xl ${
                        isWhite ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {displayPrice(deal.product.price)}
                    </span>
                    {deal.product.oldPrice ? <span
                      className={`text-xs font-normal line-through transition-colors duration-700 sm:text-sm ${
                        isWhite ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {displayPrice(deal.product.oldPrice)}
                    </span>
                    : null}</div>
                  <p className="mt-0.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[#0a7ae6]">
                    Limited-time offer
                  </p>
                </div>

                {/* STOCK CLAIM PROGRESS BAR */}
                <div className="mt-3 sm:mt-4">
                  <div className="flex justify-between text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
                    <span className="text-[#0a7ae6]">Selling Fast</span>
                    <span
                      className={`transition-colors duration-700 ${
                        isWhite ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {claimedPercent}% Claimed
                    </span>
                  </div>
                  <div
                    className={`mt-1.5 sm:mt-2 h-2 sm:h-2.5 w-full overflow-hidden rounded-full transition-colors duration-700 ${
                      isWhite ? "bg-slate-100" : "bg-slate-800"
                    }`}
                  >
                    <div style={{ width: `${claimedPercent}%` }} className="h-full rounded-full bg-gradient-to-r from-[#0a7ae6] to-[#025bb5] shadow-sm transition-all duration-500" />
                  </div>
                </div>

                {/* BLUE CTA BUTTON */}
                <Link
                  href={`/product/${deal.product.slug}`}
                  className="group relative mt-4 sm:mt-7 inline-flex h-12 sm:h-15 w-full items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0a7ae6] to-[#025bb5] text-sm sm:text-lg font-semibold tracking-wide text-white shadow-md shadow-blue-500/25 transition-all duration-300 hover:from-[#0869c7] hover:to-[#014993] hover:shadow-blue-500/40 active:scale-[0.99]"
                >
                  <span>GRAB IT NOW — {displayPrice(deal.product.price)}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
