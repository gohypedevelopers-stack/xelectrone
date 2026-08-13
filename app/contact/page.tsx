"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ChevronDown,
  Building2,
  Store,
  Wrench,
  CheckCircle2,
  User,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { toast } from "sonner";

const QUICK_CONTACTS = [
  {
    id: "customer-care",
    icon: Headphones,
    badge: "24/7 Assistance",
    title: "Customer Support & Service",
    person: "Support Helpdesk",
    phones: [
      { label: "Direct", value: "8527312304", href: "tel:8527312304" },
      { label: "Landline", value: "0120-4550655", href: "tel:01204550655" },
    ],
    whatsapp: "8527312304",
    email: "customercare@xelectron.com",
    tagColor: "bg-blue-500/10 text-[#0a7ae6] border-blue-500/20",
  },
  {
    id: "sales-inquiries",
    icon: User,
    badge: "Sales & Bulk Orders",
    title: "Sales Department",
    person: "Gaurav Sharma (Sales Manager)",
    phones: [{ label: "Direct Sales", value: "9870293008", href: "tel:9870293008" }],
    whatsapp: "9870293008",
    email: "sales@xelectron.com",
    tagColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
];

const LOCATIONS = [
  {
    icon: Building2,
    badge: "Corporate Office",
    name: "XElectron Technologies Pvt. Ltd.",
    address: "2417, Tower A, The Corenthum, Sector – 62, Noida – 201301, UP, India.",
    landmark: "The Corenthum IT Hub, Sec-62",
    phones: ["+91-0120-4550655", "+91-9891332304"],
    timing: "Mon - Sat: 9:30 AM – 6:30 PM",
    mapQuery: "The Corenthum Sector 62 Noida",
    accent: "from-blue-600 to-indigo-600",
  },
  {
    icon: Store,
    badge: "Retail Experience Center",
    name: "XElectron Flagship Showroom",
    address: "LGF-22, Spectrum Metro Mall, Sector-75, Noida, Uttar Pradesh – 201307.",
    landmark: "Lower Ground Floor, Spectrum Metro",
    phones: ["9870293008"],
    timing: "Open Daily: 01:00 PM – 09:00 PM",
    mapQuery: "Spectrum Metro Mall Sector 75 Noida",
    accent: "from-[#0a7ae6] to-sky-500",
  },
  {
    icon: Wrench,
    badge: "Authorized Service Center",
    name: "XElectron Technical Service",
    address: "Plot No.626, Ground Floor, Sector - 5, Vaishali, Ghaziabad, UP. PIN - 201010.",
    landmark: "In front of Ram Prashtha Green Colony, Near Mohan Dhaba",
    phones: ["0120-4213337", "9650836754"],
    timing: "Mon - Sat: 10:00 AM – 06:00 PM",
    mapQuery: "Sector 5 Vaishali Ghaziabad Ram Prashtha Green",
    accent: "from-slate-700 to-slate-900",
  },
];

const FAQS = [
  {
    question: "How do I register my product for official warranty?",
    answer:
      "Send your purchase invoice and serial number to customercare@xelectron.com or WhatsApp us at 8527312304. Our team will verify and activate your warranty within 24 hours.",
  },
  {
    question: "Where can I get technical service for my XElectron Projector or TV?",
    answer:
      "Visit our authorized Service Center at Sector-5, Vaishali, Ghaziabad (Opp. Ram Prashtha Green Colony, Near Mohan Dhaba). Call 0120-4213337 or 9650836754 for repair assistance.",
  },
  {
    question: "Can I test Projectors & Smart TVs live before buying?",
    answer:
      "Yes! Visit our Experience Center at LGF-22, Spectrum Metro Mall, Sector-75, Noida (1:00 PM - 9:00 PM). Experience live 4K projection demos in person. Call 9870293008 for store queries.",
  },
  {
    question: "Who should I contact for corporate or bulk purchases?",
    answer:
      "Contact Gaurav Sharma (Sales Manager) directly at 9870293008 or email sales@xelectron.com for special corporate discounts and bulk pricing.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Sales Department (Gaurav Sharma)",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to XElectron.");
    }, 900);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900">
      <Navbar />

      {/* STUNNING HERO SECTION WITH AMBIENT LIGHTING */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#060911] via-[#0b1120] to-[#0f172a] pt-20 pb-28 text-white sm:pt-28 sm:pb-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(10,122,230,0.22),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.25em] text-[#38bdf8] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Official Support & Experience Network
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Get in Touch With{" "}
            <span className="bg-gradient-to-r from-[#38bdf8] via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              XElectron
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Have questions about our Smart TVs, 4K Projectors, or order status? Connect directly with our Sales Team, Customer Care, or visit our Experience Center.
          </p>
        </div>
      </section>

      {/* QUICK DEPARTMENT CONTACT CARDS (OVERLAPPING HERO) */}
      <section className="-mt-16 sm:-mt-20 relative z-30 pb-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {QUICK_CONTACTS.map((dept) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.id}
                  className="group relative rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500/30"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0a7ae6] group-hover:bg-[#0a7ae6] group-hover:text-white transition-colors duration-300">
                        <Icon className="size-7" />
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${dept.tagColor}`}
                        >
                          {dept.badge}
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">{dept.title}</h3>
                        <p className="text-xs font-semibold text-slate-500">{dept.person}</p>
                      </div>
                    </div>

                    <a
                      href={`mailto:${dept.email}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#0a7ae6] shrink-0"
                    >
                      <Mail className="size-4" />
                      Email Us
                    </a>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {dept.phones.map((phone) => (
                      <a
                        key={phone.value}
                        href={phone.href}
                        className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5 font-bold text-slate-800 hover:border-blue-200 hover:bg-blue-50/50 hover:text-[#0a7ae6] transition"
                      >
                        <Phone className="size-4 text-[#0a7ae6]" />
                        <div>
                          <span className="block text-[10px] text-slate-400 font-semibold uppercase">{phone.label}</span>
                          <span>{phone.value}</span>
                        </div>
                      </a>
                    ))}

                    {dept.whatsapp && (
                      <a
                        href={`https://wa.me/91${dept.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3.5 py-2.5 font-bold text-emerald-800 hover:bg-emerald-100/70 transition"
                      >
                        <MessageCircle className="size-4 text-emerald-600 fill-emerald-600" />
                        <div>
                          <span className="block text-[10px] text-emerald-600/70 font-semibold uppercase">WhatsApp</span>
                          <span>{dept.whatsapp}</span>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OFFICIAL LOCATIONS GRID */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0a7ae6]">
              Offices & Centers
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
              Visit Our Experience & Service Hubs
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Corporate headquarters, retail experience showroom, and authorized repair center.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {LOCATIONS.map((loc) => {
              const Icon = loc.icon;
              return (
                <div
                  key={loc.badge}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-slate-300 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-r ${loc.accent} text-white shadow-md`}>
                        <Icon className="size-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 border border-slate-200">
                        {loc.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{loc.name}</h3>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                        <MapPin className="size-4 shrink-0 text-[#0a7ae6] mt-0.5" />
                        <span>{loc.address}</span>
                      </p>
                      {loc.landmark && (
                        <p className="mt-1 text-[11px] text-slate-500 font-medium italic pl-6">
                          📍 {loc.landmark}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <Phone className="size-4 text-[#0a7ae6]" />
                        <span>{loc.phones.join(" / ")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Clock className="size-4 text-slate-400" />
                        <span>{loc.timing}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-200"
                    >
                      <span>Get Directions on Google Maps</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORM & FAQ SECTION */}
      <section className="py-16 sm:py-24 bg-slate-50/70">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* INQUIRY FORM */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-md">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0a7ae6]">
                Direct Contact
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Send Us An Inquiry
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                Have a question for Gaurav Sharma (Sales) or our Customer Support team? Fill out the form below.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center text-emerald-900 space-y-4 animate-in fade-in">
                  <CheckCircle2 className="mx-auto size-14 text-emerald-600" />
                  <h3 className="text-lg font-bold">Message Sent Successfully!</h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold">{formData.name}</span>. Your inquiry has been routed to our team. We will get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", department: "Sales Department (Gaurav Sharma)", message: "" });
                    }}
                    className="mt-2 inline-flex items-center rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs outline-none focus:border-[#0a7ae6] focus:bg-white focus:ring-2 focus:ring-[#0a7ae6]/10 transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs outline-none focus:border-[#0a7ae6] focus:bg-white focus:ring-2 focus:ring-[#0a7ae6]/10 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+91 98702 93008"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs outline-none focus:border-[#0a7ae6] focus:bg-white focus:ring-2 focus:ring-[#0a7ae6]/10 transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="department" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                        Department / Contact
                      </label>
                      <select
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs outline-none focus:border-[#0a7ae6] focus:bg-white focus:ring-2 focus:ring-[#0a7ae6]/10 transition"
                      >
                        <option value="Sales Department (Gaurav Sharma)">Sales Inquiries (Manager: Gaurav Sharma)</option>
                        <option value="Customer Care">Customer Care (Tel: 0120-4550655 / 8527312304)</option>
                        <option value="Service Center (Vaishali)">Service Center (Vaishali, Ghaziabad)</option>
                        <option value="Spectrum Metro Experience Center">Spectrum Metro Showroom (Noida Sec-75)</option>
                        <option value="Corporate Office (Sec-62 Noida)">Corporate Office (Sector 62 Noida)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      placeholder="Enter your message, product model, or inquiry details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs outline-none focus:border-[#0a7ae6] focus:bg-white focus:ring-2 focus:ring-[#0a7ae6]/10 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-13 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0a7ae6] px-9 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-blue-600 shadow-md shadow-blue-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="size-4" />
                    {isSubmitting ? "Sending Inquiry..." : "Submit Inquiry"}
                  </button>
                </form>
              )}
            </div>

            {/* FREQUENTLY ASKED QUESTIONS */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#0a7ae6]">
                  Quick Support
                </span>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, index) => {
                  const isOpen = activeFaqIndex === index;
                  return (
                    <div
                      key={faq.question}
                      className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                        className="flex w-full items-center justify-between p-5 text-left text-xs font-bold text-slate-900 hover:text-[#0a7ae6] transition cursor-pointer"
                      >
                        <span className="pr-4 leading-snug">{faq.question}</span>
                        <ChevronDown
                          className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#0a7ae6]" : ""}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3.5">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0a7ae6]">
                  <ShieldCheck className="size-4" /> Official Pan-India Customer Care
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Call our care line at <span className="font-bold text-slate-900">8527312304</span> or email <span className="font-bold text-slate-900">customercare@xelectron.com</span> for quick resolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
