"use client";

import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import {
  MapPin,
  Store,
  Building2,
  Wrench,
  Phone,
  Clock,
  ExternalLink,
  Navigation,
  Sparkles,
} from "lucide-react";

const STORES = [
  {
    badge: "Flagship Retail Store",
    name: "XElectron Experience Center",
    type: "Showroom & Demo Hub",
    address: "LGF- 22, Spectrum Metro Mall, Sector-75, Noida, Uttar Pradesh – 201307.",
    phones: ["9870293008"],
    timing: "01:00 PM to 09:00 PM (Open Daily)",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Spectrum+Metro+Mall+Sector+75+Noida",
    features: ["Live 4K Projector Demos", "Smart TV Viewing Wall", "Surround Sound Test Zone"],
  },
  {
    badge: "Corporate Headquarters",
    name: "XElectron Technologies Pvt. Ltd.",
    type: "Corporate Office & Admin",
    address: "2417, Tower A, The Corenthum, Sector – 62, Noida – 201301.",
    phones: ["+91-0120-4550655", "+91-9891332304"],
    timing: "09:30 AM to 06:30 PM (Mon - Sat)",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=The+Corenthum+Sector+62+Noida",
    features: ["Corporate Sales Desk", "Partner & Dealer Support", "Executive Offices"],
  },
  {
    badge: "Authorized Technical Center",
    name: "XElectron Service Center",
    type: "Repair & Warranty Service",
    address: "Plot No.626, Ground Floor, Sector - 5, Vaishali, Ghaziabad, UP. PIN - 201010.",
    landmark: "Landmark: In front of Ram Prashtha Green Colony, Near Mohan Dhaba.",
    phones: ["0120-4213337", "9650836754"],
    timing: "10:00 AM to 06:00 PM (Mon - Sat)",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Sector+5+Vaishali+Ghaziabad+Ram+Prashtha+Green",
    features: ["Hardware Repair", "Replacement Claim Verification", "Genuine Spare Parts"],
  },
];

export default function FindAStorePage() {
  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900">
      <Navbar />

      {/* HERO HEADER */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 sm:py-24 text-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.25em] text-[#38bdf8] backdrop-blur-md">
            <Navigation className="h-3.5 w-3.5" /> Store Locator
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
            Find an XElectron Store Near You
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-300">
            Experience our 4K Android Projectors, Smart TVs, and audio systems in person at our Spectrum Metro Mall showroom or visit our technical centers.
          </p>
        </div>
      </section>

      {/* STORES GRID */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STORES.map((store) => (
              <div
                key={store.name}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-md hover:shadow-xl hover:border-[#0a7ae6]/40 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-50 text-[#0a7ae6] border border-blue-200 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                      {store.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">{store.type}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{store.name}</h3>

                  <div className="space-y-2 text-xs text-slate-600">
                    <p className="flex items-start gap-2 leading-relaxed">
                      <MapPin className="size-4 shrink-0 text-[#0a7ae6] mt-0.5" />
                      <span>{store.address}</span>
                    </p>
                    {store.landmark && (
                      <p className="text-[11px] text-slate-500 italic pl-6">{store.landmark}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <p className="flex items-center gap-2 font-bold text-slate-900">
                      <Phone className="size-3.5 text-[#0a7ae6]" />
                      <span>{store.phones.join(" / ")}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-500 font-medium">
                      <Clock className="size-3.5 text-slate-400" />
                      <span>{store.timing}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">Available On-Site:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {store.features.map((feat) => (
                        <span key={feat} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2.5 py-1 rounded-md">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0a7ae6] transition cursor-pointer"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
