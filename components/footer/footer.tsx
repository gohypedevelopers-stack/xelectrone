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
      <h3 className="text-[12px] font-medium uppercase tracking-[0.05em] text-black sm:text-[13px] lg:text-[14px]">{title}</h3>
      <ul className="mt-3 space-y-2 text-[12px] uppercase leading-5 tracking-[0.01em] text-slate-400 sm:mt-4 sm:text-[13px]">
        {links.map((link) => (
          <li key={link}>
            <Link href="/" className="transition-colors hover:text-slate-700">
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
    <footer className="bg-white px-4 pb-3 pt-5 sm:px-6 sm:pb-4 sm:pt-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col border-t border-slate-100 pt-6 sm:pt-8 lg:pt-12">
        <div className="flex flex-col gap-5 px-0 sm:px-2 lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:px-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:flex lg:gap-16 xl:gap-20">
            <FooterColumn title="Product" links={productLinks} className="col-span-1" />
            <FooterColumn title="Customer Service" links={customerServiceLinks} className="col-span-1" />
            <FooterColumn title="Our Company" links={companyLinks} className="col-span-2 sm:col-span-1" />
          </div>
        </div>

        <div className="order-2 mt-6 flex items-center justify-between gap-3 rounded-[10px] bg-[#121212] px-4 py-2.5 text-white lg:order-3 sm:px-5 sm:py-3 lg:px-7">
          <div className="whitespace-nowrap text-[14px] font-semibold italic tracking-[-0.08em] text-white sm:text-[17px] lg:text-[22px]">
            XElectron
          </div>
          <p className="whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.12em] text-white/80 sm:text-[10px] lg:text-[12px]">
            © MADE BY XElectron 2026
          </p>
        </div>

        <ul className="order-3 mt-1 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-[10px] font-semibold uppercase leading-5 tracking-[0.02em] text-slate-900 sm:mt-2 sm:text-[11px] lg:order-2 lg:mt-0 lg:justify-end lg:pr-2 lg:text-[12px]">
          {policyLinks.map((link) => (
            <li key={link}>
              <Link href="/" className="transition-colors hover:text-slate-950">
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}





