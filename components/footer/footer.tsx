import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

const productLinks: FooterLink[] = [
  { label: "Speaker", href: "/shop" },
  { label: "Home Speaker", href: "/shop" },
  { label: "Sound Bar", href: "/shop" },
  { label: "Portable PA", href: "/shop" },
];

const customerServiceLinks: FooterLink[] = [
  { label: "Troubleshooting", href: "/troubleshooting" },
  { label: "Repair & Replacement", href: "/repair-replacement" },
  { label: "Order Tracking", href: "/orders" },
  { label: "Register Your Product", href: "/warranty" },
  { label: "Contact Us", href: "/contact" },
];

const companyLinks: FooterLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Find a Store", href: "/find-a-store" },
  { label: "Careers", href: "/careers" },
  { label: "Stories", href: "/stories" },
];

const policyLinks: FooterLink[] = [
  { label: "Your privacy choices", href: "/contact" },
  { label: "Privacy Policy", href: "/contact" },
  { label: "Terms of Use", href: "/contact" },
];

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: FooterLink[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.05em] text-white">
        {title}
      </h3>
      <ul className="mt-3.5 space-y-2 text-xs sm:text-sm uppercase leading-5 tracking-[0.01em] text-slate-400 font-normal sm:mt-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-transparent px-0 sm:px-[20px] pt-0 sm:pt-4 pb-0">
      {/* CHARCOAL DARK GRAY FOOTER CARD WITH TOP ROUNDED CORNERS ON DESKTOP */}
      <div className="mx-auto flex max-w-[1600px] flex-col rounded-none sm:rounded-t-[20px] bg-[#18191c] border-t sm:border-x border-slate-800/60 px-6 pt-8 pb-6 text-white shadow-2xl sm:px-8 sm:pt-10 sm:pb-8 lg:px-12 lg:pt-12 lg:pb-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 sm:gap-8 lg:flex lg:gap-16 xl:gap-20">
            <FooterColumn title="Product" links={productLinks} className="col-span-1" />
            <FooterColumn title="Our Company" links={companyLinks} className="col-span-1 sm:order-3" />
            <FooterColumn title="Customer Service" links={customerServiceLinks} className="col-span-2 sm:col-span-1 sm:order-2" />
          </div>

          {/* Official Contact Info */}
          <div className="text-xs sm:text-sm text-slate-400 space-y-2 border-t lg:border-t-0 border-slate-800 pt-4 lg:pt-0 max-w-md font-normal">
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.05em] text-white">
              XElectron Technologies Pvt. Ltd.
            </h3>
            <p className="leading-relaxed text-slate-400">
              2417, Tower A, The Corenthum, Sector – 62, Noida – 201301.
            </p>
            <p>
              <span className="text-slate-300 font-normal">Customer Care:</span>{" "}
              <a href="tel:8527312304" className="hover:text-white transition">8527312304</a> /{" "}
              <a href="tel:01204550655" className="hover:text-white transition">0120-4550655</a>
            </p>
            <p>
              <span className="text-slate-300 font-normal">Sales (Gaurav Sharma):</span>{" "}
              <a href="tel:9870293008" className="hover:text-white transition">9870293008</a>
            </p>
            <p>
              <span className="text-slate-300 font-normal">Email:</span>{" "}
              <a href="mailto:customercare@xelectron.com" className="hover:text-white transition">customercare@xelectron.com</a>
            </p>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR (WHITE BACKGROUND WITH DARK TEXT & LOGO) */}
        <div className="order-2 mt-7 flex items-center justify-between gap-3 rounded-xl sm:rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm sm:px-6 sm:py-4 lg:px-8 lg:order-3">
          <div className="whitespace-nowrap text-sm font-black italic tracking-[-0.08em] text-slate-900 sm:text-[19px] lg:text-[24px]">
            XElectron
          </div>
          <p className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.10em] text-slate-700 sm:text-[10px] lg:text-[12px]">
            © MADE BY XELECTRON 2026
          </p>
        </div>

        {/* POLICY LINKS */}
        <ul className="order-3 mt-4 flex flex-nowrap items-center justify-center gap-x-2.5 text-center text-[9px] font-medium uppercase tracking-[0.01em] text-slate-400 whitespace-nowrap sm:mt-4 sm:gap-x-6 sm:text-[11px] lg:order-2 lg:mt-6 lg:justify-end lg:pr-2 lg:text-[12px]">
          {policyLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
