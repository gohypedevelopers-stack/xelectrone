"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  ShoppingBag,
  X,
  Tv,
  ShieldCheck,
  Headphones,
  User,
  PhoneCall,
  Package,
  Home as HomeIcon,
  Info,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { dropdownItems } from "@/components/home/content";

function BrandLogo() {
  return (
    <Image
      src="/xelectron-logo.svg"
      alt="XElectron"
      width={180}
      height={40}
      className="h-7 w-auto object-contain object-left sm:h-10 md:h-11"
      priority
    />
  );
}

function IconButton({
  children,
  label,
  badge,
  onClick,
}: {
  children: ReactNode;
  label: string;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative inline-flex size-9 items-center justify-center rounded-full text-slate-800 transition-all duration-200 hover:bg-slate-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7ae6]"
    >
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#0a7ae6] text-[10px] font-bold text-white shadow-sm">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function FlatNavLink({
  label,
  href = "/",
  icon: Icon,
  onClick,
}: {
  label: string;
  href?: string;
  icon?: any;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group inline-flex h-full min-w-max items-center gap-1.5 px-3 text-[14px] font-medium text-slate-700 transition-colors duration-200 hover:text-[#0a7ae6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7ae6]"
    >
      {Icon && (
        <Icon className="size-4 text-slate-400 group-hover:text-[#0a7ae6]" />
      )}
      <span>{label}</span>
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
}: {
  label: string;
  items: string[];
  open: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onClose: () => void;
}) {
  const panelId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-menu`;

  return (
    <div
      className="relative h-full"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={`inline-flex h-full min-w-max items-center gap-1 px-3 text-[14px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7ae6] ${
          open ? "text-[#0a7ae6]" : "text-slate-700 hover:text-[#0a7ae6]"
        }`}
      >
        <span>{label}</span>
        <ChevronDown
          className={`size-3.5 stroke-[2] transition-transform duration-200 ${
            open ? "rotate-180 text-[#0a7ae6]" : "text-slate-400"
          }`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute left-1/2 top-full z-40 mt-1 w-[260px] -translate-x-1/2 pt-1"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.15)] backdrop-blur-xl">
            <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              <span>{label}</span>
            </div>
            <div className="space-y-0.5">
              {items.map((item) => (
                <Link
                  key={item}
                  href="/"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-[#0a7ae6]/8 hover:text-[#0a7ae6]"
                >
                  <span>{item}</span>
                  <ChevronRight className="size-3.5 text-slate-300 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100" />
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
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<
    string | null
  >("PRODUCT");
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setOpenMenu(null);
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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavigate = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const toggleMobileCategory = (cat: string) => {
    setExpandedMobileCategory((curr) => (curr === cat ? null : cat));
  };

  const getCategoryIcon = (label: string) => {
    switch (label) {
      case "PRODUCT":
        return Tv;
      case "WARRANTY":
        return ShieldCheck;
      case "SUPPORT & SERVICE":
        return Headphones;
      default:
        return Package;
    }
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all duration-200"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto flex h-[58px] max-w-[1600px] items-center justify-between px-4 sm:grid sm:h-[70px] sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          aria-label="XElectron home"
          className="inline-flex shrink-0 items-center rounded-full text-slate-900 transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7ae6] sm:justify-self-start"
          onClick={handleNavigate}
        >
          <BrandLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary"
          className="hidden h-full w-max items-stretch justify-self-center whitespace-nowrap px-4 lg:flex lg:gap-1"
        >
          <FlatNavLink label="Home" href="/" />
          {dropdownItems.map((group) => (
            <DropdownNavItem
              key={group.label}
              label={group.label}
              items={group.items}
              open={openMenu === group.label}
              onToggle={() =>
                setOpenMenu((current) =>
                  current === group.label ? null : group.label,
                )
              }
              onOpen={() => setOpenMenu(group.label)}
              onClose={() => setOpenMenu(null)}
            />
          ))}
          <FlatNavLink label="About Us" href="/" />
          <FlatNavLink label="Contact" href="/" />
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center justify-self-end gap-1.5 sm:flex">
          <IconButton label="Search">
            <Search className="size-4 text-slate-700 stroke-[1.8]" />
          </IconButton>
          <IconButton label="My Account">
            <User className="size-4 text-slate-700 stroke-[1.8]" />
          </IconButton>
          <IconButton label="Shopping bag" badge={2}>
            <ShoppingBag className="size-4 text-slate-700 stroke-[1.8]" />
          </IconButton>
        </div>

        {/* Mobile Actions & Toggle */}
        <div className="flex shrink-0 items-center gap-1 sm:hidden">
          <IconButton label="Search" onClick={() => setMobileOpen(true)}>
            <Search className="size-4 text-slate-800 stroke-[1.8]" />
          </IconButton>
          <IconButton label="My Account">
            <User className="size-4 text-slate-800 stroke-[1.8]" />
          </IconButton>
          <IconButton label="Shopping bag" badge={2}>
            <ShoppingBag className="size-4 text-slate-800 stroke-[1.8]" />
          </IconButton>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((current) => !current)}
            className="ml-1 inline-flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7ae6]"
          >
            {mobileOpen ? (
              <X className="size-5 stroke-[2]" />
            ) : (
              <Menu className="size-5 stroke-[2]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen ? (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 top-[58px] z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-Down Drawer Container */}
          <div className="fixed inset-x-0 top-[58px] z-50 max-h-[calc(100vh-58px)] overflow-y-auto border-t border-slate-200/80 bg-white/98 shadow-2xl backdrop-blur-2xl lg:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="mx-auto max-w-[1600px] px-4 py-4 space-y-4">
              {/* Quick Search Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products, TVs, projectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-[13px] text-slate-900 placeholder-slate-400 focus:border-[#0a7ae6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a7ae6]/20"
                />
              </div>

              {/* Navigation Items List */}
              <div className="space-y-1">
                {/* Home */}
                <Link
                  href="/"
                  onClick={handleNavigate}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-[14px] font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#0a7ae6]"
                >
                  <HomeIcon className="size-4 text-[#0a7ae6]" />
                  <span>Home</span>
                </Link>

                {/* Dropdown Category Groups (Accordion) */}
                {dropdownItems.map((group) => {
                  const IconComponent = getCategoryIcon(group.label);
                  const isExpanded = expandedMobileCategory === group.label;

                  return (
                    <div
                      key={group.label}
                      className="rounded-xl border border-slate-100 bg-slate-50/50 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleMobileCategory(group.label)}
                        className="flex w-full items-center justify-between px-3.5 py-3 text-[13px] font-semibold uppercase tracking-wider text-slate-800 hover:bg-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="size-4 text-[#0a7ae6]" />
                          <span>{group.label}</span>
                        </div>
                        <ChevronDown
                          className={`size-4 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-[#0a7ae6]" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-white px-3.5 py-2 space-y-1">
                          {group.items.map((item) => (
                            <Link
                              key={item}
                              href="/"
                              onClick={handleNavigate}
                              className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 hover:bg-[#0a7ae6]/5 hover:text-[#0a7ae6]"
                            >
                              <span>{item}</span>
                              <ChevronRight className="size-3.5 text-slate-300" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Flat Nav Items */}
                <Link
                  href="/"
                  onClick={handleNavigate}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-[14px] font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#0a7ae6]"
                >
                  <Info className="size-4 text-slate-500" />
                  <span>About Us</span>
                </Link>

                <Link
                  href="/"
                  onClick={handleNavigate}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-[14px] font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#0a7ae6]"
                >
                  <PhoneCall className="size-4 text-slate-500" />
                  <span>Contact</span>
                </Link>

                <Link
                  href="/"
                  onClick={handleNavigate}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-[14px] font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#0a7ae6]"
                >
                  <User className="size-4 text-slate-500" />
                  <span>My Account</span>
                </Link>
              </div>

              {/* Bottom Support Callout Box */}
              <div className="rounded-xl border border-[#0a7ae6]/20 bg-[linear-gradient(135deg,rgba(10,122,230,0.05),rgba(10,122,230,0.1))] p-3.5 text-center">
                <p className="text-[12px] font-bold text-slate-900">
                  Need Help or Service?
                </p>
                <p className="mt-0.5 text-[11px] text-slate-600">
                  Call Support:{" "}
                  <span className="font-semibold text-[#0a7ae6]">
                    1800-123-4567
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
