"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Heart,
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
  Plus,
  Minus,
  Trash2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { dropdownItems } from "@/components/home/content";
import { productsCatalog } from "@/lib/products-data";

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
  onMouseEnter,
}: {
  label: string;
  href?: string;
  icon?: any;
  onClick?: () => void;
  onMouseEnter?: () => void;
}) {
  return (
    <div className="h-full flex items-center" onMouseEnter={onMouseEnter}>
      <Link
        href={href}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className="group inline-flex h-full min-w-max items-center gap-1.5 px-3 text-[13px] font-semibold uppercase tracking-wider text-slate-700 transition-colors duration-200 hover:text-[#0a7ae6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7ae6]"
      >
        {Icon && (
          <Icon className="size-4 text-slate-400 group-hover:text-[#0a7ae6]" />
        )}
        <span className="uppercase">{label}</span>
      </Link>
    </div>
  );
}

function DropdownNavItem({
  label,
  open,
  onToggle,
  onOpen,
}: {
  label: string;
  items?: string[];
  open: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onClose?: () => void;
}) {
  return (
    <div
      className="h-full flex items-center"
      onMouseEnter={onOpen}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={`inline-flex h-full min-w-max items-center gap-1.5 px-3 text-[13px] font-semibold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7ae6] ${
          open ? "text-[#0a7ae6]" : "text-slate-700 hover:text-[#0a7ae6]"
        }`}
      >
        <span className="uppercase">{label}</span>
        <ChevronDown
          className={`size-3.5 stroke-[2] transition-transform duration-200 ${
            open ? "rotate-180 text-[#0a7ae6]" : "text-slate-400"
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

const MENU_ORDER = ["PRODUCT", "WARRANTY", "SUPPORT & SERVICE"];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [slideDirection, setSlideDirection] = useState<"from-right" | "from-left" | "from-top">("from-top");
  const prevMenuRef = useRef<string | null>(null);

  const handleOpenMenu = (newMenu: string | null) => {
    if (newMenu && prevMenuRef.current && newMenu !== prevMenuRef.current) {
      const prevIdx = MENU_ORDER.indexOf(prevMenuRef.current);
      const newIdx = MENU_ORDER.indexOf(newMenu);
      if (newIdx > prevIdx) {
        setSlideDirection("from-right");
      } else if (newIdx < prevIdx) {
        setSlideDirection("from-left");
      }
    } else if (newMenu && !prevMenuRef.current) {
      setSlideDirection("from-top");
    }
    prevMenuRef.current = newMenu;
    setOpenMenu(newMenu);
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "techno-android",
      name: "XElectron Techno Android",
      price: 6990,
      oldPrice: 21999,
      image: "/product-white-projector-card.png",
      category: "Projectors",
    },
    {
      id: "c9-plus",
      name: "XElectron Android C9 Plus",
      price: 10990,
      oldPrice: 19999,
      image: "/product-black-projector-card.png",
      category: "Projectors",
    },
  ]);
  const [cartItems, setCartItems] = useState([
    {
      id: "55-smart-tv",
      name: "XElectron 55 Inch LED TV",
      price: 29999,
      image: "/product-tv-card.png",
      quantity: 1,
      category: "Smart TVs",
    },
    {
      id: "techno-projector",
      name: "XElectron Techno Android",
      price: 6990,
      image: "/product-white-projector-card.png",
      quantity: 1,
      category: "Projectors",
    },
  ]);
  const headerRef = useRef<HTMLElement | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        handleOpenMenu(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setIsCartOpen(false);
        setIsWishlistOpen(false);
        setIsSearchDrawerOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setIsHeaderVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;

      if (diff > 4) {
        setIsHeaderVisible(false);
      } else if (diff < -4) {
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsHeaderVisible(true);
      }, 90);
    };

    const handleScrollEnd = () => {
      setIsHeaderVisible(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scrollend", handleScrollEnd, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scrollend", handleScrollEnd);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Prevent background scrolling when mobile menu, cart, wishlist, or search drawer is open
  useEffect(() => {
    if (mobileOpen || isCartOpen || isWishlistOpen || isSearchDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, isCartOpen, isWishlistOpen, isSearchDrawerOpen]);

  const handleNavigate = () => {
    handleOpenMenu(null);
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
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-transform duration-300 ease-out ${
          isHeaderVisible || openMenu ? "translate-y-0" : "-translate-y-full"
        }`}
        onMouseLeave={() => handleOpenMenu(null)}
      >
      <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-4 sm:grid sm:h-[70px] sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          aria-label="XElectron home"
          className="inline-flex shrink-0 items-center rounded-full text-slate-900 transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7ae6] sm:justify-self-start"
          onClick={handleNavigate}
          onMouseEnter={() => handleOpenMenu(null)}
        >
          <BrandLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary"
          className="hidden h-full w-max items-stretch justify-self-center whitespace-nowrap px-4 lg:flex lg:gap-1"
        >
          <FlatNavLink label="HOME" href="/" onMouseEnter={() => handleOpenMenu(null)} />
          {dropdownItems.map((group) => (
            <DropdownNavItem
              key={group.label}
              label={group.label}
              items={group.items}
              open={openMenu === group.label}
              onToggle={() =>
                handleOpenMenu(openMenu === group.label ? null : group.label)
              }
              onOpen={() => handleOpenMenu(group.label)}
              onClose={() => handleOpenMenu(null)}
            />
          ))}
          <FlatNavLink label="ABOUT US" href="/" onMouseEnter={() => handleOpenMenu(null)} />
          <FlatNavLink label="CONTACT" href="/" onMouseEnter={() => handleOpenMenu(null)} />
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center justify-self-end gap-1.5 sm:flex">
          <IconButton label="Search" onClick={() => setIsSearchDrawerOpen(true)}>
            <Search className="size-4 text-slate-700 stroke-[1.8]" />
          </IconButton>
          <IconButton
            label="Wishlist"
            badge={wishlistItems.length}
            onClick={() => setIsWishlistOpen(true)}
          >
            <Heart className="size-4 text-slate-700 stroke-[1.8]" />
          </IconButton>
          <Link href="/login" aria-label="My Account">
            <IconButton label="My Account">
              <User className="size-4 text-slate-700 stroke-[1.8]" />
            </IconButton>
          </Link>
          <IconButton
            label="Shopping bag"
            badge={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="size-4 text-slate-700 stroke-[1.8]" />
          </IconButton>
        </div>

        {/* Mobile Actions & Toggle */}
        <div className="flex shrink-0 items-center gap-1 sm:hidden">
          <IconButton label="Search" onClick={() => setIsSearchDrawerOpen(true)}>
            <Search className="size-4 text-slate-800 stroke-[1.8]" />
          </IconButton>
          <IconButton
            label="Wishlist"
            badge={wishlistItems.length}
            onClick={() => setIsWishlistOpen(true)}
          >
            <Heart className="size-4 text-slate-800 stroke-[1.8]" />
          </IconButton>
          <IconButton
            label="Shopping bag"
            badge={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            onClick={() => setIsCartOpen(true)}
          >
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

      {/* Darkened Smooth Backdrop Blur Overlay */}
      <div
        className={`hidden lg:block fixed inset-0 top-[70px] z-40 bg-slate-950/25 backdrop-blur-xs transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          openMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none invisible"
        }`}
        onClick={() => handleOpenMenu(null)}
      />

      {/* Full Width Mega Menu Dropdown */}
      <div
        className={`hidden lg:block absolute top-full inset-x-0 z-50 grid border-b border-slate-200/90 bg-white/98 backdrop-blur-2xl shadow-[0_35px_80px_rgba(15,23,42,0.16)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          openMenu
            ? "grid-rows-[1fr] opacity-100 translate-y-0 pointer-events-auto visible"
            : "grid-rows-[0fr] opacity-0 -translate-y-3 pointer-events-none invisible"
        }`}
        onMouseEnter={() => openMenu && handleOpenMenu(openMenu)}
        onMouseLeave={() => handleOpenMenu(null)}
      >
        <div className="overflow-hidden">
          <div className="mx-auto max-w-[1440px] px-8 py-6">
            <div
              key={openMenu ?? "empty"}
              className={`transition-all duration-300 ease-out ${
                slideDirection === "from-right"
                  ? "animate-in fade-in slide-in-from-right-8 duration-300"
                  : slideDirection === "from-left"
                  ? "animate-in fade-in slide-in-from-left-8 duration-300"
                  : "animate-in fade-in slide-in-from-top-1 duration-300"
              }`}
            >
            {openMenu === "PRODUCT" && (
              <div className="grid grid-cols-12 gap-8 items-stretch">
                {/* Column 1: Featured Links */}
                <div className="col-span-3 border-r border-slate-100 pr-6 space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    FEATURED
                  </h4>
                  <ul className="space-y-0.5">
                    {[
                      { name: "New Arrivals", href: "/shop?filter=new-arrivals", badge: "HOT" },
                      { name: "Best Sellers", href: "/shop?filter=best-sellers", badge: "TOP" },
                      { name: "All Products", href: "/shop", badge: null },
                    ].map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50 hover:text-[#0a7ae6] transition-all duration-200"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {item.name}
                          </span>
                          {item.badge ? (
                            <span className="text-[9px] font-extrabold bg-[#0a7ae6]/10 text-[#0a7ae6] px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          ) : (
                            <ChevronRight className="size-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Categories */}
                <div className="col-span-4 border-r border-slate-100 pr-6 space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    CATEGORIES
                  </h4>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    {[
                      { name: "Smart TVs", href: "/shop?filter=smart-tvs" },
                      { name: "Projectors", href: "/shop?filter=projectors" },
                      { name: "Headphones", href: "/shop?filter=headphones" },
                      { name: "Speakers", href: "/shop?filter=speakers" },
                      { name: "Cameras", href: "/shop?filter=cameras" },
                      { name: "Digital Frames", href: "/shop?filter=digital-photo-frame" },
                    ].map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setOpenMenu(null)}
                        className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:text-[#0a7ae6] transition-all duration-200"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 3: High-End Spotlight Visual Cards */}
                <div className="col-span-5 grid grid-cols-2 gap-4">
                  {/* Spotlight Card 1 */}
                  <Link
                    href="/product/55-smart-tv"
                    onClick={() => setOpenMenu(null)}
                    className="group relative h-[195px] w-full overflow-hidden rounded-none bg-black shadow-md transition-all duration-300 hover:shadow-xl flex flex-col justify-end"
                  >
                    <Image
                      src="/category-tv.png"
                      alt="Spotlight TV"
                      fill
                      className="object-cover object-center opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                      <div className="mb-1">
                        <span className="inline-block rounded-none bg-black text-white px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest border border-white/20">
                          SPOTLIGHT
                        </span>
                      </div>
                      <h5 className="text-xs font-medium uppercase text-white tracking-wider">
                        OFF BEAT TV EDIT
                      </h5>
                    </div>
                  </Link>

                  {/* Spotlight Card 2 */}
                  <Link
                    href="/product/techno-projector"
                    onClick={() => setOpenMenu(null)}
                    className="group relative h-[195px] w-full overflow-hidden rounded-none bg-black shadow-md transition-all duration-300 hover:shadow-xl flex flex-col justify-end"
                  >
                    <Image
                      src="/category-projector.png"
                      alt="New Launch Projector"
                      fill
                      className="object-cover object-center opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                      <div className="mb-1">
                        <span className="inline-block rounded-none bg-black text-white px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest border border-white/20">
                          NEW LAUNCH
                        </span>
                      </div>
                      <h5 className="text-xs font-medium uppercase text-white tracking-wider">
                        TECHNO PROJECTOR
                      </h5>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {openMenu === "WARRANTY" && (
              <div className="grid grid-cols-12 gap-8 items-stretch">
                {/* Column 1: Coverage */}
                <div className="col-span-3 border-r border-slate-100 pr-6 space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    COVERAGE
                  </h4>
                  <ul className="space-y-0.5">
                    {[
                      { name: "Check Coverage", href: "/warranty" },
                      { name: "Register Product", href: "/warranty" },
                      { name: "Terms & Policy", href: "/warranty" },
                    ].map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="group flex items-center justify-between rounded-none px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-800 hover:bg-slate-50 hover:text-[#0a7ae6] transition-all duration-200"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {item.name}
                          </span>
                          <ChevronRight className="size-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Services */}
                <div className="col-span-4 border-r border-slate-100 pr-6 space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    SERVICES & REPAIRS
                  </h4>
                  <div className="space-y-0.5">
                    {[
                      { name: "Service Status Tracking", href: "/warranty" },
                      { name: "Replacement Claims", href: "/warranty" },
                      { name: "Authorized Service Centers", href: "/warranty" },
                    ].map((srv) => (
                      <Link
                        key={srv.name}
                        href={srv.href}
                        onClick={() => setOpenMenu(null)}
                        className="group flex items-center justify-between rounded-none px-3 py-2 text-xs font-normal uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:text-[#0a7ae6] transition-all duration-200"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {srv.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 3: Spotlight Image Cards */}
                <div className="col-span-5 grid grid-cols-2 gap-4">
                  <Link
                    href="/warranty"
                    onClick={() => setOpenMenu(null)}
                    className="group relative h-[195px] w-full overflow-hidden rounded-none bg-black shadow-md transition-all duration-300 hover:shadow-xl flex flex-col justify-end"
                  >
                    <Image
                      src="/category-headphones.png"
                      alt="Register Product"
                      fill
                      className="object-cover object-center opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                      <div className="mb-1">
                        <span className="inline-block rounded-none bg-black text-white px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest border border-white/20">
                          REGISTRATION
                        </span>
                      </div>
                      <h5 className="text-xs font-medium uppercase text-white tracking-wider">
                        REGISTER YOUR GEAR
                      </h5>
                    </div>
                  </Link>

                  <Link
                    href="/warranty"
                    onClick={() => setOpenMenu(null)}
                    className="group relative h-[195px] w-full overflow-hidden rounded-none bg-black shadow-md transition-all duration-300 hover:shadow-xl flex flex-col justify-end"
                  >
                    <Image
                      src="/banner-earbuds.png"
                      alt="Care Plus"
                      fill
                      className="object-cover object-center opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                      <div className="mb-1">
                        <span className="inline-block rounded-none bg-black text-white px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest border border-white/20">
                          PROTECTION
                        </span>
                      </div>
                      <h5 className="text-xs font-medium uppercase text-white tracking-wider">
                        XELECTRON CARE PLUS
                      </h5>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {openMenu === "SUPPORT & SERVICE" && (
              <div className="grid grid-cols-12 gap-8 items-stretch">
                {/* Column 1: Help & Support */}
                <div className="col-span-3 border-r border-slate-100 pr-6 space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    HELP & SUPPORT
                  </h4>
                  <ul className="space-y-0.5">
                    {[
                      { name: "Contact Support", href: "/contact" },
                      { name: "Troubleshooting Guide", href: "/support" },
                      { name: "Order Tracking", href: "/support" },
                    ].map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="group flex items-center justify-between rounded-none px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-800 hover:bg-slate-50 hover:text-[#0a7ae6] transition-all duration-200"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {item.name}
                          </span>
                          <ChevronRight className="size-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Resources & Downloads */}
                <div className="col-span-4 border-r border-slate-100 pr-6 space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    RESOURCES & DOWNLOADS
                  </h4>
                  <div className="space-y-0.5">
                    {[
                      { name: "Repair Center Locations", href: "/support" },
                      { name: "Downloads & Manuals", href: "/support" },
                      { name: "Firmware Updates", href: "/support" },
                    ].map((res) => (
                      <Link
                        key={res.name}
                        href={res.href}
                        onClick={() => setOpenMenu(null)}
                        className="group flex items-center justify-between rounded-none px-3 py-2 text-xs font-normal uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:text-[#0a7ae6] transition-all duration-200"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {res.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 3: Spotlight Image Cards */}
                <div className="col-span-5 grid grid-cols-2 gap-4">
                  <Link
                    href="/contact"
                    onClick={() => setOpenMenu(null)}
                    className="group relative h-[195px] w-full overflow-hidden rounded-none bg-black shadow-md transition-all duration-300 hover:shadow-xl flex flex-col justify-end"
                  >
                    <Image
                      src="/creator-projector.png"
                      alt="Repair Center"
                      fill
                      className="object-cover object-center opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                      <div className="mb-1">
                        <span className="inline-block rounded-none bg-black text-white px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest border border-white/20">
                          HELP CENTER
                        </span>
                      </div>
                      <h5 className="text-xs font-medium uppercase text-white tracking-wider">
                        NEED REPAIR HELP?
                      </h5>
                    </div>
                  </Link>

                  <Link
                    href="/support"
                    onClick={() => setOpenMenu(null)}
                    className="group relative h-[195px] w-full overflow-hidden rounded-none bg-black shadow-md transition-all duration-300 hover:shadow-xl flex flex-col justify-end"
                  >
                    <Image
                      src="/blog-3.png"
                      alt="Manuals"
                      fill
                      className="object-cover object-center opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                      <div className="mb-1">
                        <span className="inline-block rounded-none bg-black text-white px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest border border-white/20">
                          MANUALS
                        </span>
                      </div>
                      <h5 className="text-xs font-medium uppercase text-white tracking-wider">
                        USER GUIDES & DOCS
                      </h5>
                    </div>
                  </Link>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen ? (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 top-[68px] z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-Down Drawer Container */}
          <div className="fixed inset-x-0 top-[68px] z-50 max-h-[calc(100vh-68px)] overflow-y-auto border-t border-slate-200/80 bg-white/98 shadow-2xl backdrop-blur-2xl lg:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="mx-auto max-w-[1600px] px-4 py-4 space-y-4">
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
                          {group.items.map((item) => {
                            let href = "/";
                            if (group.label === "PRODUCT") {
                              if (item === "New Arrivals") href = "/shop?filter=new-arrivals";
                              else if (item === "Best Sellers") href = "/shop?filter=best-sellers";
                              else if (item === "All Products") href = "/shop";
                            }
                            return (
                              <Link
                                key={item}
                                href={href}
                                onClick={handleNavigate}
                                className="block rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 hover:bg-[#0a7ae6]/5 hover:text-[#0a7ae6]"
                              >
                                <span>{item}</span>
                              </Link>
                            );
                          })}
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
                  href="/login"
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

    {/* Cart Drawer */}
    <div className={`fixed inset-0 z-[100] ${isCartOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-500 ease-in-out ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-[440px] flex-col bg-white shadow-2xl transition-transform duration-500 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-base sm:text-lg font-medium uppercase tracking-wider text-slate-900">
            Shopping Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-white border border-slate-100 p-2 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <span className="text-[9px] font-medium uppercase tracking-widest text-[#0a7ae6]">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-medium text-slate-900 line-clamp-1">
                    {item.name}
                  </h3>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
                      <button
                        onClick={() => {
                          setCartItems((prev) =>
                            prev.map((x) =>
                              x.id === item.id ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x
                            )
                          );
                        }}
                        className="p-1 text-slate-500 hover:text-slate-900"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="px-2 text-xs font-medium text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => {
                          setCartItems((prev) =>
                            prev.map((x) =>
                              x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x
                            )
                          );
                        }}
                        className="p-1 text-slate-500 hover:text-slate-900"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    <span className="text-sm font-medium text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCartItems((prev) => prev.filter((x) => x.id !== item.id));
                  }}
                  className="self-start p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="size-12 text-slate-200 stroke-[1.5] mb-3" />
              <p className="text-slate-400 font-medium">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={() => setIsCartOpen(false)}
                className="mt-4 rounded-full bg-[#0a7ae6] px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white shadow-md shadow-[#0a7ae6]/20 transition-all hover:scale-105"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 p-5 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Subtotal</span>
              <span className="text-xl font-medium text-slate-900">
                ₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mb-5 font-normal">
              Taxes and shipping calculated at checkout. Free shipping on all orders!
            </p>
            <button
              onClick={() => alert("Proceeding to checkout...")}
              className="w-full rounded-xl bg-[#0a7ae6] py-3.5 text-center text-sm font-medium uppercase tracking-wider text-white shadow-lg shadow-[#0a7ae6]/25 transition-all hover:opacity-95 hover:scale-[1.02]"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Wishlist Drawer */}
    <div className={`fixed inset-0 z-[100] ${isWishlistOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-500 ease-in-out ${
          isWishlistOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-[440px] flex-col bg-white shadow-2xl transition-transform duration-500 ease-in-out ${
          isWishlistOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-base sm:text-lg font-medium uppercase tracking-wider text-slate-900">
            My Wishlist ({wishlistItems.length})
          </h2>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-slate-100 pb-4 group">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-white border border-slate-100 p-2 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-medium uppercase tracking-widest text-[#0a7ae6]">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      {item.oldPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.oldPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCartItems((prev) => [
                          ...prev,
                          {
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            quantity: 1,
                            category: item.category,
                          },
                        ]);
                        setIsWishlistOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="inline-flex h-8 items-center justify-center rounded-lg bg-[#0a7ae6] px-3.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-[#0867c2] active:scale-95 cursor-pointer"
                    >
                      Move to Cart
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setWishlistItems((prev) => prev.filter((x) => x.id !== item.id));
                  }}
                  className="self-start p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Heart className="size-12 text-slate-200 stroke-[1.5] mb-3" />
              <p className="text-slate-400 font-medium">Your wishlist is empty</p>
              <Link
                href="/shop"
                onClick={() => setIsWishlistOpen(false)}
                className="mt-4 rounded-full bg-[#0a7ae6] px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white shadow-md shadow-[#0a7ae6]/20 transition-all hover:scale-105"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {wishlistItems.length > 0 && (
          <div className="border-t border-slate-100 p-5 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Saved Items</span>
              <span className="text-sm font-medium text-slate-900">
                {wishlistItems.length} {wishlistItems.length === 1 ? "Product" : "Products"}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mb-4 font-normal">
              Move items to your cart anytime to complete your order. Free shipping on all orders!
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setCartItems((prev) => [
                    ...prev,
                    ...wishlistItems.map((item) => ({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      quantity: 1,
                      category: item.category,
                    })),
                  ]);
                  setIsWishlistOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full rounded-xl bg-[#0a7ae6] py-3.5 text-center text-sm font-medium uppercase tracking-wider text-white shadow-lg shadow-[#0a7ae6]/25 transition-all hover:opacity-95 hover:scale-[1.02] cursor-pointer"
              >
                Move All to Cart
              </button>
              <button
                onClick={() => setWishlistItems([])}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-center text-xs font-medium uppercase tracking-wider text-slate-500 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600 cursor-pointer"
              >
                Clear Wishlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Search Drawer */}
    <div className={`fixed inset-0 z-[100] ${isSearchDrawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-500 ease-in-out ${
          isSearchDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsSearchDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-[440px] flex-col bg-white shadow-2xl transition-transform duration-500 ease-in-out ${
          isSearchDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-900">
            Search Products
          </h2>
          <button
            onClick={() => setIsSearchDrawerOpen(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-5 border-b border-slate-100">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-none border border-slate-900 bg-white py-2.5 pl-4 pr-10 text-[14px] text-slate-900 placeholder-slate-500 focus:outline-none"
              autoFocus={isSearchDrawerOpen}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-800 pointer-events-none" />
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-5">
          {searchQuery.trim() !== "" ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                Search Results
              </p>
              <div className="space-y-4">
                {(() => {
                  const filtered = Object.values(productsCatalog).filter(
                    (p) =>
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.category.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  if (filtered.length === 0) {
                    return <p className="text-sm text-slate-400 text-center py-8">No products found matching your search.</p>;
                  }
                  const cards = filtered.slice(0, 4);
                  const listItems = filtered.slice(4);

                  return (
                    <>
                      {/* 4 Cards Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {cards.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            onClick={() => setIsSearchDrawerOpen(false)}
                            className="group flex flex-col rounded-lg border border-slate-200/80 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <div className="relative h-[80px] w-full bg-slate-50/60 rounded-md p-1 flex items-center justify-center mb-2 overflow-hidden">
                              <Image
                                src={product.mainImage}
                                alt={product.name}
                                fill
                                className="object-contain p-1 transition-transform group-hover:scale-105"
                                sizes="120px"
                              />
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-wider text-[#0a7ae6] truncate">
                              {product.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#0a7ae6] transition-colors mt-0.5">
                              {product.name}
                            </h4>
                            <span className="text-xs font-black text-slate-900 mt-1">
                              {product.price}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {/* Remainder List */}
                      {listItems.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">More Results</p>
                          {listItems.map((product) => (
                            <Link
                              key={product.id}
                              href={`/product/${product.id}`}
                              onClick={() => setIsSearchDrawerOpen(false)}
                              className="flex gap-3 border-b border-slate-100 pb-3 group items-center"
                            >
                              <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-white border border-slate-100 p-1 flex items-center justify-center">
                                <Image
                                  src={product.mainImage}
                                  alt={product.name}
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex flex-1 flex-col justify-center min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0a7ae6] transition-colors">
                                  {product.name}
                                </h4>
                                <p className="text-[9px] text-slate-400 font-semibold truncate mt-0.5">
                                  {product.category} • <span className="text-slate-950 font-bold">{product.price}</span>
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                Popular Products
              </p>
              <div className="space-y-4">
                {(() => {
                  const allProducts = Object.values(productsCatalog);
                  const cards = allProducts.slice(0, 4);
                  const listItems = allProducts.slice(4);

                  return (
                    <>
                      {/* 4 Cards Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {cards.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            onClick={() => setIsSearchDrawerOpen(false)}
                            className="group flex flex-col rounded-lg border border-slate-200/80 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <div className="relative h-[80px] w-full bg-slate-50/60 rounded-md p-1 flex items-center justify-center mb-2 overflow-hidden">
                              <Image
                                src={product.mainImage}
                                alt={product.name}
                                fill
                                className="object-contain p-1 transition-transform group-hover:scale-105"
                                sizes="120px"
                              />
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-wider text-[#0a7ae6] truncate">
                              {product.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#0a7ae6] transition-colors mt-0.5">
                              {product.name}
                            </h4>
                            <span className="text-xs font-black text-slate-900 mt-1">
                              {product.price}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {/* Remainder List */}
                      {listItems.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">More Popular Products</p>
                          {listItems.map((product) => (
                            <Link
                              key={product.id}
                              href={`/product/${product.id}`}
                              onClick={() => setIsSearchDrawerOpen(false)}
                              className="flex gap-3 border-b border-slate-100 pb-3 group items-center"
                            >
                              <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-white border border-slate-100 p-1 flex items-center justify-center">
                                <Image
                                  src={product.mainImage}
                                  alt={product.name}
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex flex-1 flex-col justify-center min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0a7ae6] transition-colors">
                                  {product.name}
                                </h4>
                                <p className="text-[9px] text-slate-400 font-semibold truncate mt-0.5">
                                  {product.category} • <span className="text-slate-950 font-bold">{product.price}</span>
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
