"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { dropdownItems, flatItems } from "@/components/home/content";
import type { NavDropdownItem } from "@/components/home/content";

function BrandLogo() {
  return (
    <Image
      src="/xelectron-logo.svg"
      alt="XElectron"
      width={180}
      height={40}
      className="h-7 w-auto object-contain object-left sm:h-10 md:h-12"
      priority
    />
  );
}

function IconButton({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex size-8 items-center justify-center rounded-full text-[#1d1d1f] transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
    >
      {children}
    </button>
  );
}

function FlatNavLink({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="inline-flex h-full min-w-max items-center px-2 text-[14px] font-medium tracking-[-0.01em] text-[#1d1d1f] transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
    >
      {label}
    </Link>
  );
}

function DropdownNavItem({
  label,
  items,
  open,
  onToggle,
  onOpen,
  onClose,
}: NavDropdownItem & {
  open: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onClose: () => void;
}) {
  const panelId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-menu`;

  return (
    <div className="relative h-full" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="inline-flex h-full min-w-max items-center gap-0.5 px-2 text-[14px] font-medium tracking-[-0.01em] text-[#1d1d1f] transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
      >
        <span>{label}</span>
        <ChevronDown
          className={`size-3.5 stroke-[2.15] transition-transform duration-200 ${
            open ? "translate-y-px rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute left-1/2 top-full z-40 mt-2 w-[240px] -translate-x-1/2"
        >
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
            <div className="bg-[linear-gradient(180deg,rgba(245,247,250,0.92),rgba(255,255,255,1))] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              {label}
            </div>
            <div className="p-2">
              {items.map((item) => (
                <Link
                  key={item}
                  href="/"
                  onClick={onClose}
                  className="flex items-center rounded-xl px-3 py-2 text-[13px] text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleNavigate = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-black/10 bg-white/98 backdrop-blur-md"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto flex h-[56px] max-w-[1600px] items-center justify-between px-3 sm:grid sm:h-[72px] sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="XElectron home"
          className="inline-flex shrink-0 items-center rounded-full text-[#1d1d1f] transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 sm:justify-self-start"
          onClick={handleNavigate}
        >
          <BrandLogo />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden h-full w-max items-stretch justify-self-center whitespace-nowrap px-4 lg:flex lg:gap-1"
        >
          <FlatNavLink label={flatItems[0]} />
          <DropdownNavItem
            {...dropdownItems[0]}
            open={openMenu === dropdownItems[0].label}
            onToggle={() =>
              setOpenMenu((current) =>
                current === dropdownItems[0].label ? null : dropdownItems[0].label
              )
            }
            onOpen={() => setOpenMenu(dropdownItems[0].label)}
            onClose={() => setOpenMenu(null)}
          />
          <DropdownNavItem
            {...dropdownItems[1]}
            open={openMenu === dropdownItems[1].label}
            onToggle={() =>
              setOpenMenu((current) =>
                current === dropdownItems[1].label ? null : dropdownItems[1].label
              )
            }
            onOpen={() => setOpenMenu(dropdownItems[1].label)}
            onClose={() => setOpenMenu(null)}
          />
          <DropdownNavItem
            {...dropdownItems[2]}
            open={openMenu === dropdownItems[2].label}
            onToggle={() =>
              setOpenMenu((current) =>
                current === dropdownItems[2].label ? null : dropdownItems[2].label
              )
            }
            onOpen={() => setOpenMenu(dropdownItems[2].label)}
            onClose={() => setOpenMenu(null)}
          />
          <FlatNavLink label={flatItems[1]} />
          <FlatNavLink label={flatItems[2]} />
          <FlatNavLink label={flatItems[3]} />
        </nav>

        <div className="hidden shrink-0 items-center justify-self-end gap-1 sm:flex sm:gap-2">
          <IconButton label="Search">
            <Search className="size-[15px] stroke-[1.7]" />
          </IconButton>
          <IconButton label="Shopping bag">
            <ShoppingBag className="size-[15px] stroke-[1.7]" />
          </IconButton>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:hidden">
          <IconButton label="Search">
            <Search className="size-[15px] stroke-[1.7]" />
          </IconButton>
          <IconButton label="Shopping bag">
            <ShoppingBag className="size-[15px] stroke-[1.7]" />
          </IconButton>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex size-8 items-center justify-center rounded-full text-[#1d1d1f] transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          >
            {mobileOpen ? <X className="size-[15px] stroke-[1.8]" /> : <Menu className="size-[15px] stroke-[1.8]" />}
          </button>
        </div>
      </div>
      {mobileOpen ? (
        <div className="fixed inset-x-0 top-[56px] z-40 max-h-[calc(100vh-56px)] overflow-y-auto border-t border-black/10 bg-white sm:top-[72px] sm:max-h-[calc(100vh-72px)] lg:hidden">
          <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
            <div className="grid gap-1">
              <FlatNavLink label={flatItems[0]} onClick={handleNavigate} />
              <FlatNavLink label={dropdownItems[0].label} onClick={handleNavigate} />
              <FlatNavLink label={dropdownItems[1].label} onClick={handleNavigate} />
              <FlatNavLink label={dropdownItems[2].label} onClick={handleNavigate} />
              <FlatNavLink label={flatItems[1]} onClick={handleNavigate} />
              <FlatNavLink label={flatItems[2]} onClick={handleNavigate} />
              <FlatNavLink label={flatItems[3]} onClick={handleNavigate} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}





