import Link from "next/link";

const productLinks = ["Speaker", "Home Speaker", "Sound Bar", "Portable PA"];
const customerServiceLinks = [
  "Troubleshooting",
  "Repair & Replacement",
  "Order Tracking",
  "Register Your Product",
  "Contact Us",
];
const companyLinks = ["About Us", "Find a Store", "Careers", "Stories"];
const policyLinks = ["Your privacy choices", "Privacy Policy", "Terms of Use"];

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.05em] text-white sm:text-[13px] lg:text-[14px]">
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-[12px] uppercase leading-5 tracking-[0.01em] text-slate-400 sm:mt-4 sm:text-[13px]">
        {links.map((link) => (
          <li key={link}>
            <Link href="/" className="transition-colors hover:text-white">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-transparent px-[20px] pt-4 pb-0">
      {/* BLACK FOOTER CARD WITH TOP ROUNDED CORNERS, SIDE MARGINS, AND FLAT BOTTOM */}
      <div className="mx-auto flex max-w-[1600px] flex-col rounded-t-[15px] rounded-b-none bg-[#09090b] px-6 pt-8 pb-6 text-white shadow-2xl sm:px-8 sm:pt-10 sm:pb-8 lg:px-12 lg:pt-12 lg:pb-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 sm:gap-8 lg:flex lg:gap-16 xl:gap-20">
            <FooterColumn title="Product" links={productLinks} className="col-span-1" />
            <FooterColumn title="Our Company" links={companyLinks} className="col-span-1 sm:order-3" />
            <FooterColumn title="Customer Service" links={customerServiceLinks} className="col-span-2 sm:col-span-1 sm:order-2" />
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
        <ul className="order-3 mt-4 flex flex-nowrap items-center justify-center gap-x-2.5 text-center text-[9px] font-semibold uppercase tracking-[0.01em] text-slate-400 whitespace-nowrap sm:mt-4 sm:gap-x-6 sm:text-[11px] lg:order-2 lg:mt-6 lg:justify-end lg:pr-2 lg:text-[12px]">
          {policyLinks.map((link) => (
            <li key={link}>
              <Link href="/" className="transition-colors hover:text-white">
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
