"use client";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import Image from "next/image";
import Link from "next/link";
import { Star, Quote, Tv, ArrowRight, Sparkles } from "lucide-react";

const STORIES = [
  {
    author: "Amit & Neha Verma",
    location: "New Delhi",
    setup: "120-Inch Home Cinema Setup",
    product: "XElectron Techno Android 14 Projector",
    quote:
      "We converted our living room into a private theater for weekend movie nights. The 4K support and bright projection even with ambient lights on blew our minds!",
    rating: 5,
    image: "/creator-projector.png",
  },
  {
    author: "Rohan Kapoor",
    location: "Bangalore",
    setup: "Gaming & Sports Setup",
    product: "XElectron 55-Inch 4K UHD Smart TV",
    quote:
      "Zero input lag for PS5 gaming and IPL matches look buttery smooth. Hands down the best value-for-money smart TV in India.",
    rating: 5,
    image: "/category-tv.png",
  },
  {
    author: "Priya Sundaram",
    location: "Mumbai",
    setup: "Surround Sound Living Room",
    product: "XElectron Cinema Soundbar with Subwoofer",
    quote:
      "The bass is deep and dialogue clarity is crisp without distortion. Setting up Bluetooth and Optical ARC took less than 2 minutes.",
    rating: 5,
    image: "/category-audio.png",
  },
];

export default function StoriesPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900">
      <Navbar />

      {/* HERO HEADER */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 sm:py-24 text-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.25em] text-[#38bdf8] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Customer Showcases
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
            Real Homes, Real XElectron Experiences
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-300">
            See how movie enthusiasts, gamers, and families across India transformed their living rooms with XElectron Smart TVs and Projectors.
          </p>
        </div>
      </section>

      {/* STORIES GRID */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STORIES.map((item) => (
              <div
                key={item.author}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md hover:shadow-xl hover:border-[#0a7ae6]/40 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900">
                    <Image
                      src={item.image}
                      alt={item.setup}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                      {item.setup}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    &quot;{item.quote}&quot;
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.author}</h4>
                      <p className="text-[10px] text-slate-500">{item.location}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-[#0a7ae6] bg-blue-50 px-2.5 py-1 rounded-full">
                      {item.product}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-3xl bg-slate-900 p-8 sm:p-12 text-center text-white space-y-4">
            <h2 className="text-2xl font-bold text-white">Share Your XElectron Home Setup!</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Tag @XElectron on Instagram or email your setup photos to customercare@xelectron.com to get featured on our stories page!
            </p>
            <div>
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0a7ae6] px-8 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-600 transition shadow-md shadow-blue-500/20"
              >
                Shop XElectron Catalog <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
