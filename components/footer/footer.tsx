"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-black text-[#f5f5f0]">
      <div className="mx-auto max-w-[1600px] px-4 pb-8 pt-10 sm:px-6 md:px-12 md:pb-10 md:pt-16">
        <div className="md:hidden mb-8 border-b border-white/10 pb-5">
          <h2 className="text-[2rem] font-black italic leading-none tracking-[-0.06em] text-[#f5f5f0]">
            <span className="text-[#0a7ae6]">X</span>ELECTRON
          </h2>
        </div>

        <div className="hidden md:flex md:items-center md:justify-center md:pt-4 md:pb-12 md:overflow-hidden md:px-2">
          <h1
            className="select-none text-center font-black italic uppercase leading-none tracking-[-0.05em] text-[#f5f5f0]"
            style={{ fontSize: "clamp(3rem, 10.5vw, 18rem)" }}
          >
            <span className="text-[#0a7ae6]">X</span>ELECTRON
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-8 md:gap-y-12">
          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white md:mb-6 md:text-sm md:tracking-widest">
              Shop
            </h3>
            <ul className="space-y-2.5 text-[12px] font-medium tracking-wide text-[#a1a1aa] md:space-y-3 md:text-[13px]">
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">Audio</Link></li>
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">Smartwatch</Link></li>
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">Dashcam</Link></li>
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">Projector</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white md:mb-6 md:text-sm md:tracking-widest">
              Support
            </h3>
            <ul className="space-y-2.5 text-[12px] font-medium tracking-wide text-[#a1a1aa] md:space-y-3 md:text-[13px]">
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">About</Link></li>
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">FAQs</Link></li>
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">Returns</Link></li>
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">Careers</Link></li>
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white md:mb-6 md:text-sm md:tracking-widest">
              Socials
            </h3>
            <ul className="space-y-2.5 text-[12px] font-medium tracking-wide text-[#a1a1aa] md:space-y-3 md:text-[13px]">
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">Instagram</Link></li>
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">Twitter</Link></li>
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">YouTube</Link></li>
              <li><Link href="#" className="uppercase transition-colors hover:text-[#f4f4f5]">LinkedIn</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white md:mb-6 md:text-sm md:tracking-widest">
              Studio
            </h3>
            <ul className="space-y-2.5 text-[12px] font-medium tracking-wide text-[#a1a1aa] md:space-y-3 md:text-[13px]">
              <li className="uppercase">hi@xelectron.com</li>
              <li className="uppercase">+1 (123) 456-789</li>
              <li className="max-w-[16ch] uppercase leading-relaxed md:max-w-[200px]">
                123 Innovation Drive,<br />
                Suite 100 Tech City, TC 90210
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-3 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a1a1aa] md:mt-12 md:gap-4 md:text-[11px] md:tracking-[0.2em]">
          <p className="whitespace-nowrap">Copyright &copy; {currentYear}</p>
          <p className="flex min-w-0 items-center gap-2 whitespace-nowrap">
            <span className="text-[#f4f4f5] text-lg leading-none"></span>
            We are Xelectron
          </p>
        </div>
      </div>
    </footer>
  );
}


