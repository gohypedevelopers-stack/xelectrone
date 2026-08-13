"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import {
  Wrench,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function RepairReplacementPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serialNumber: "",
    requestType: "Replacement (Within 7 Days)",
    issueDetails: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.serialNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Service request submitted successfully!");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900">
      <Navbar />

      {/* HERO HEADER */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 sm:py-24 text-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.25em] text-[#38bdf8] backdrop-blur-md">
            <RotateCcw className="h-3.5 w-3.5" /> Doorstep Service & Replacement
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
            Repair & Replacement Requests
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-300">
            Submit a service request for doorstep pickup or visit our Authorized Technical Service Center in Ghaziabad.
          </p>
        </div>
      </section>

      {/* POLICIES CARDS */}
      <section className="-mt-8 relative z-20 pb-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0a7ae6] mb-4">
                <RotateCcw className="size-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">7-Day Free Replacement Policy</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                If your product arrives damaged or develops a hardware defect within 7 days of delivery, we provide an immediate 100% free replacement with doorstep pickup.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1-Year Official Warranty Repairs</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                All XElectron devices come with a 1-Year Manufacturer Warranty. Technical repairs and replacement parts are covered free of charge during the warranty period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM & SERVICE CENTER DETAILS */}
      <section className="py-12 sm:py-20 bg-white border-t border-slate-200/80">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* SERVICE REQUEST FORM */}
            <div className="lg:col-span-7 bg-slate-50/60 p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Submit A Repair / Replacement Request
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Provide your order serial number and pickup address for fast service resolution.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-900 space-y-3 animate-in fade-in">
                  <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
                  <h3 className="text-base font-bold">Request Logged Successfully!</h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Your request for serial <span className="font-mono font-bold">{formData.serialNumber}</span> has been assigned to our Vaishali Service Team.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", serialNumber: "", requestType: "Replacement (Within 7 Days)", issueDetails: "", address: "" });
                    }}
                    className="mt-2 inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ankit Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none focus:border-[#0a7ae6] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none focus:border-[#0a7ae6] transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Serial Number (S/N) *</label>
                      <input
                        type="text"
                        required
                        placeholder="XE-9812301"
                        value={formData.serialNumber}
                        onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none focus:border-[#0a7ae6] transition uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Request Type</label>
                      <select
                        value={formData.requestType}
                        onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none focus:border-[#0a7ae6] transition"
                      >
                        <option value="Replacement (Within 7 Days)">7-Day Replacement</option>
                        <option value="Warranty Repair">Warranty Repair</option>
                        <option value="Out of Warranty Repair">Out-of-Warranty Repair</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Pickup Address</label>
                    <input
                      type="text"
                      placeholder="Complete street address with pincode for doorstep pickup..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none focus:border-[#0a7ae6] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Issue Description *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe the issue with display, audio, HDMI, or power..."
                      value={formData.issueDetails}
                      onChange={(e) => setFormData({ ...formData, issueDetails: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white p-4 text-xs outline-none focus:border-[#0a7ae6] transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0a7ae6] px-8 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-blue-600 shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Wrench className="size-4" />
                    {isSubmitting ? "Submitting..." : "Submit Repair Request"}
                  </button>
                </form>
              )}
            </div>

            {/* AUTHORIZED SERVICE CENTER SIDEBAR */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-slate-200/90 bg-slate-900 text-white p-6 sm:p-8 space-y-4">
                <span className="rounded-full bg-[#0a7ae6] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1">
                  Main Service Hub
                </span>
                <h3 className="text-xl font-bold text-white">XElectron Service Center</h3>

                <div className="space-y-3 text-xs text-slate-300">
                  <p className="flex items-start gap-2.5 leading-relaxed">
                    <MapPin className="size-4 shrink-0 text-[#38bdf8] mt-0.5" />
                    <span>Plot No.626, Ground Floor, Sector - 5, Vaishali, Ghaziabad, UP. PIN - 201010</span>
                  </p>
                  <p className="text-[11px] text-slate-400 italic pl-6">
                    Landmark: In front of Ram Prashtha Green Colony, Near Mohan Dhaba.
                  </p>

                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <p className="flex items-center gap-2 text-white font-bold">
                      <Phone className="size-4 text-[#38bdf8]" />
                      <span>0120-4213337 / 9650836754</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-400">
                      <Clock className="size-4" />
                      <span>Timing: 10:00 AM to 06:00 PM (Mon-Sat)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
