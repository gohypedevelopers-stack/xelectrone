import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { Sparkles, ShieldCheck, Tv, Award, Users, HeartHandshake, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | XElectron Official",
  description: "Learn about XElectron's journey, mission, and commitment to bringing cinema-grade Smart TVs, Android Projectors, and audio equipment into Indian homes.",
};

const STATS = [
  { value: "100K+", label: "Happy Customers", description: "Trusted by homes across India" },
  { value: "4.8 ★", label: "Customer Rating", description: "Across leading platforms" },
  { value: "100%", label: "Pan-India Warranty", description: "Hassle-free service coverage" },
  { value: "10+", label: "Years of Excellence", description: "In consumer electronics" },
];

const VALUES = [
  {
    icon: Tv,
    title: "Cinema-Grade Innovation",
    description:
      "We design Full HD and 4K Android Projectors and Smart TVs built to turn any living room into an immersive theater experience.",
  },
  {
    icon: ShieldCheck,
    title: "Uncompromised Quality",
    description:
      "Every XElectron product undergoes rigorous quality testing and comes backed by our official warranty and dedicated service network.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First Service",
    description:
      "From pre-purchase guidance to post-warranty support, our team is always ready to assist you every step of the way.",
  },
  {
    icon: Award,
    title: "Honest & Accessible Pricing",
    description:
      "Cutting out middleman markups so you get cutting-edge home entertainment technology at fair, accessible prices.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 text-white sm:py-28 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#38bdf8] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Redefining Home Entertainment
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Bringing Theater-Grade Magic <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#38bdf8] via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Into Every Home
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
            At XElectron, we believe exceptional visual and audio experiences should not be a luxury. We engineer smart home theater projectors, Smart TVs, and audio gear for movie lovers, gamers, and tech enthusiasts.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0a7ae6] px-6 text-sm font-semibold text-white transition-all hover:bg-blue-600 shadow-lg shadow-blue-500/25 active:scale-95"
            >
              Explore Our Catalog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="border-y border-slate-100 bg-slate-50/70 py-12 sm:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-2xs">
                <p className="text-3xl font-extrabold text-[#0a7ae6] sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-bold text-slate-900">{stat.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR MISSION & STORY */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0a7ae6]">Our Story</span>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl text-slate-900">
                Pioneering Smart Display Technology Since 2012
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Founded with a passion for digital innovation, XElectron started with a simple vision: to create smart display solutions that empower families, professionals, and entertainment seekers.
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                Over the past decade, we have expanded from digital photo frames to market-leading Android 14 Smart Home Theater Projectors, high-definition LED TVs, and powerful surround sound systems.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#0a7ae6]">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Certified Quality</h4>
                    <p className="text-[11px] text-slate-500">ISO & BIS Compliant</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#0a7ae6]">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Pan-India Reach</h4>
                    <p className="text-[11px] text-slate-500">Delivering to 19,000+ Pin Codes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT HIGHLIGHT BANNER */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-900 border border-slate-200 shadow-xl">
              <Image
                src="/creator-projector.png"
                alt="XElectron Projector Experience"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-[#0a7ae6] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Flagship Series
                </span>
                <h3 className="mt-2 text-xl font-bold text-white">XElectron Techno Android Projector</h3>
                <p className="mt-1 text-xs text-slate-300">4K Support • Electric Auto Focus • Built-in Apps & WiFi 6</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-slate-900 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#38bdf8]">Why XElectron</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl text-white">
              Built on Principles of Excellence
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              We stand behind every pixel, frame, and speaker we build for your home.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-blue-500/40 hover:bg-white/10"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#0a7ae6] text-white shadow-md">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-white">{val.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{val.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FOOTER BANNER */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Ready to Upgrade Your Home Theater?
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Explore our full lineup of Smart TVs, 4K Projectors, and Audio Soundbars with official warranty and free shipping across India.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100 shadow-md active:scale-95"
                >
                  Shop Now <ArrowRight className="h-4 w-4 text-[#0a7ae6]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
