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
  LogOut,
  Home as HomeIcon,
  Info,
  Plus,
  Minus,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { dropdownItems } from "@/components/home/content";
import { useCart } from "@/components/providers/cart-provider";
import { formatINR } from "@/lib/format-price";

function BrandLogo() {
  return (
    <Image
      src="/xelectron-logo.png"
      alt="XElectron"
      width={360}
      height={120}
      className="h-12 sm:h-14 md:h-16 lg:h-18 w-auto object-contain object-left transition-transform duration-200"
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
  href,
  icon: Icon,
  onClick,
  onMouseEnter,
}: {
  label: string;
  href: string;
  icon?: LucideIcon;
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
        className={`inline-flex h-full min-w-max items-center gap-1.5 px-3 text-[13px] font-semibold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a7ae6] ${open ? "text-[#0a7ae6]" : "text-slate-700 hover:text-[#0a7ae6]"
          }`}
      >
        <span className="uppercase">{label}</span>
        <ChevronDown
          className={`size-3.5 stroke-[2] transition-transform duration-200 ${open ? "rotate-180 text-[#0a7ae6]" : "text-slate-400"
            }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

const MENU_ORDER = ["PRODUCT", "WARRANTY", "SUPPORT & SERVICE"];

type StoreCategory = {
  id: string;
  title: string;
  slug: string;
  visible: boolean;
};

type SearchDrawerProduct = {
  id: string;
  slug: string;
  name: string;
  price: string | number;
  description?: string | null;
  mainImage?: string | null;
  media?: { url: string }[];
  category?: { title?: string | null } | string | null;
  showInBestSellers?: boolean;
  createdAt?: string;
};

function searchProductCategory(product: SearchDrawerProduct) {
  if (typeof product.category === "string") return product.category;
  return product.category?.title || "XElectron";
}

function searchProductImage(product: SearchDrawerProduct) {
  return product.mainImage || product.media?.[0]?.url || "/category-smartphone.png";
}

function searchProductPrice(price: SearchDrawerProduct["price"]) {
  return formatINR(price);
}

function menuProductImage(product: SearchDrawerProduct) {
  return product.mainImage || product.media?.[0]?.url || "/category-smartphone.png";
}

export default function Navbar() {
  const {
    items: cartItems,
    cartCount,
    subtotal: cartSubtotal,
    addItem,
    addItems,
    updateQuantity,
    removeItem,
    wishlistItems,
    wishlistCount,
    removeWishlistItem,
    clearWishlist,
  } = useCart();
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

  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [searchProducts, setSearchProducts] = useState<SearchDrawerProduct[]>([]);
  const [isLoadingSearchProducts, setIsLoadingSearchProducts] = useState(false);
  const [menuProducts, setMenuProducts] = useState<SearchDrawerProduct[]>([]);
  const [isLoadingMenuProducts, setIsLoadingMenuProducts] = useState(false);
  const [areMenuProductsLoaded, setAreMenuProductsLoaded] = useState(false);
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [areStoreCategoriesLoaded, setAreStoreCategoriesLoaded] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadStoreCategories() {
      try {
        const response = await fetch("/api/categories");
        const payload = await response.json();

        if (isCurrent && response.ok && payload.success && Array.isArray(payload.data)) {
          setStoreCategories(
            payload.data.filter(
              (category: StoreCategory) => category.visible && category.title && category.slug,
            ),
          );
        }
      } catch {
        // Keep the menu usable even if categories are temporarily unavailable.
      } finally {
        if (isCurrent) {
          setAreStoreCategoriesLoaded(true);
        }
      }
    }

    void loadStoreCategories();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!isSearchDrawerOpen) return;

    let isCurrent = true;

    async function loadSearchProducts() {
      setIsLoadingSearchProducts(true);

      try {
        const response = await fetch("/api/products");
        const payload = await response.json();

        if (isCurrent && response.ok && payload.success && Array.isArray(payload.data)) {
          setSearchProducts(payload.data);
        }
      } catch {
        if (isCurrent) {
          setSearchProducts([]);
        }
      } finally {
        if (isCurrent) {
          setIsLoadingSearchProducts(false);
        }
      }
    }

    void loadSearchProducts();

    return () => {
      isCurrent = false;
    };
  }, [isSearchDrawerOpen]);

  useEffect(() => {
    if (openMenu !== "PRODUCT") return;

    let isCurrent = true;

    async function loadMenuProducts() {
      setIsLoadingMenuProducts(true);

      try {
        const response = await fetch("/api/products");
        const payload = await response.json();

        if (isCurrent && response.ok && payload.success && Array.isArray(payload.data)) {
          setMenuProducts(payload.data);
        }
      } catch {
        if (isCurrent) {
          setMenuProducts([]);
        }
      } finally {
        if (isCurrent) {
          setIsLoadingMenuProducts(false);
          setAreMenuProductsLoaded(true);
        }
      }
    }

    void loadMenuProducts();

    return () => {
      isCurrent = false;
    };
  }, [openMenu]);

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
    const shouldLockPage = mobileOpen || isCartOpen || isWishlistOpen || isSearchDrawerOpen;
    if (!shouldLockPage) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
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

  const searchTerm = searchQuery.trim().toLocaleLowerCase();
  const visibleSearchProducts = searchTerm
    ? searchProducts.filter((product) =>
        [product.name, product.description, searchProductCategory(product)]
          .filter(Boolean)
          .some((value) => value?.toLocaleLowerCase().includes(searchTerm)),
      )
    : searchProducts;
  const searchProductCards = visibleSearchProducts.slice(0, 4);
  const searchProductListItems = visibleSearchProducts.slice(4);
  const menuFeaturedProducts = [...menuProducts]
    .sort((left, right) => {
      const bestSellerDifference = Number(Boolean(right.showInBestSellers)) - Number(Boolean(left.showInBestSellers));
      if (bestSellerDifference !== 0) return bestSellerDifference;

    return (Date.parse(right.createdAt || "") || 0) - (Date.parse(left.createdAt || "") || 0);
    })
    .slice(0, 2);

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 bg-white transition-transform duration-300 ease-out ${
          isHeaderVisible || openMenu ? "translate-y-0" : "-translate-y-full"
        }`}
        onMouseLeave={() => handleOpenMenu(null)}
      >
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:grid sm:h-[76px] sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-6 lg:px-8">
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
            <FlatNavLink label="ABOUT US" href="/about" onMouseEnter={() => handleOpenMenu(null)} />
            <FlatNavLink label="CONTACT" href="/contact" onMouseEnter={() => handleOpenMenu(null)} />
          </nav>

          {/* Desktop Actions */}
          <div className="hidden shrink-0 items-center justify-self-end gap-1.5 sm:flex">
            <IconButton label="Search" onClick={() => setIsSearchDrawerOpen(true)}>
              <Search className="size-4 text-slate-700 stroke-[1.8]" />
            </IconButton>
            <IconButton
              label="Wishlist"
              badge={wishlistCount}
              onClick={() => setIsWishlistOpen(true)}
            >
              <Heart className="size-4 text-slate-700 stroke-[1.8]" />
            </IconButton>

            {currentUser ? (
              <div className="relative">
                <IconButton
                  label="My Account"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                >
                  <User className="size-4 text-[#0a7ae6] stroke-[2.2]" />
                </IconButton>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2.5 w-60 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xl z-50">
                    <div className="border-b border-slate-100 px-3.5 py-2.5">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name || "Customer"}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Package className="size-4 text-[#0a7ae6]" />
                        My Orders
                      </Link>
                      {currentUser.role === "ADMIN" && (
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        >
                          <ShieldCheck className="size-4 text-emerald-600" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <LogOut className="size-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" aria-label="My Account" className="inline-flex items-center">
                <IconButton label="My Account">
                  <User className="size-4 text-slate-700 stroke-[1.8]" />
                </IconButton>
              </Link>
            )}

            <IconButton
              label="Shopping bag"
              badge={cartCount}
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
              badge={wishlistCount}
              onClick={() => setIsWishlistOpen(true)}
            >
              <Heart className="size-4 text-slate-800 stroke-[1.8]" />
            </IconButton>
            <IconButton
              label="Shopping bag"
              badge={cartCount}
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
          className={`hidden lg:block fixed inset-0 top-[72px] sm:top-[76px] z-40 bg-slate-950/25 backdrop-blur-xs transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            openMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none invisible"
          }`}
          onClick={() => handleOpenMenu(null)}
        />

        {/* Full Width Mega Menu Dropdown */}
        <div
          className={`hidden lg:block absolute top-full inset-x-0 z-50 grid bg-white/98 backdrop-blur-2xl shadow-[0_35px_80px_rgba(15,23,42,0.16)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                className={`transition-all duration-300 ease-out ${slideDirection === "from-right"
                  ? "animate-in fade-in slide-in-from-right-8 duration-300"
                  : slideDirection === "from-left"
                    ? "animate-in fade-in slide-in-from-left-8 duration-300"
                    : "animate-in fade-in slide-in-from-top-1 duration-300"
                  }`}
              >
                {openMenu === "PRODUCT" && (
                  <div className="grid grid-cols-12 gap-8 items-stretch">
                    {/* Column 1: Featured Links */}
                    <div className="col-span-3 pr-6 space-y-3">
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
                    <div className="col-span-4 pr-6 space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                        CATEGORIES
                      </h4>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                        {storeCategories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/shop?filter=${encodeURIComponent(category.slug)}`}
                            onClick={() => setOpenMenu(null)}
                            className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:text-[#0a7ae6] transition-all duration-200"
                          >
                            <span className="group-hover:translate-x-0.5 transition-transform">
                              {category.title}
                            </span>
                          </Link>
                        ))}
                        {areStoreCategoriesLoaded && storeCategories.length === 0 ? (
                          <p className="col-span-2 px-3 py-2 text-xs text-slate-400">
                            No categories available
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Column 3: current dashboard products */}
                    <div className="col-span-5 grid grid-cols-2 gap-4">
                      {menuFeaturedProducts.map((product, index) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={() => setOpenMenu(null)}
                          className="group flex flex-col items-center justify-between rounded-xl p-2 transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <div className="relative h-[135px] w-full overflow-hidden rounded-lg">
                            <Image
                              src={menuProductImage(product)}
                              alt={product.name}
                              fill
                              sizes="(min-width: 1024px) 260px, 0px"
                              className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <h5 className="mt-2.5 w-full text-center text-xs font-bold uppercase tracking-wider text-slate-800 truncate group-hover:text-[#0a7ae6] transition-colors">
                            {product.name}
                          </h5>
                        </Link>
                      ))}

                      {(isLoadingMenuProducts || !areMenuProductsLoaded) && menuFeaturedProducts.length === 0 ? (
                        <>
                          <div className="h-[195px] animate-pulse bg-slate-100" />
                          <div className="h-[195px] animate-pulse bg-slate-100" />
                        </>
                      ) : null}

                      {areMenuProductsLoaded && !isLoadingMenuProducts && menuFeaturedProducts.length === 0 ? (
                        <div className="col-span-2 flex h-[195px] items-center justify-center border border-dashed border-slate-200 px-6 text-center text-sm text-slate-400">
                          Add products in the dashboard to show them here.
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {openMenu === "WARRANTY" && (
                  <div className="grid grid-cols-12 gap-8 items-stretch">
                    {/* Column 1: Coverage */}
                    <div className="col-span-3 pr-6 space-y-3">
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
                    <div className="col-span-4 pr-6 space-y-3">
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
                        className="group flex flex-col items-center justify-between rounded-xl p-2 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <div className="relative h-[135px] w-full overflow-hidden rounded-lg">
                          <Image
                            src="/category-headphones.png"
                            alt="Register Product"
                            fill
                            className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h5 className="mt-2.5 w-full text-center text-xs font-bold uppercase tracking-wider text-slate-800 truncate group-hover:text-[#0a7ae6] transition-colors">
                          Register Your Gear
                        </h5>
                      </Link>

                      <Link
                        href="/warranty"
                        onClick={() => setOpenMenu(null)}
                        className="group flex flex-col items-center justify-between rounded-xl p-2 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <div className="relative h-[135px] w-full overflow-hidden rounded-lg">
                          <Image
                            src="/banner-earbuds.png"
                            alt="Care Plus"
                            fill
                            className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h5 className="mt-2.5 w-full text-center text-xs font-bold uppercase tracking-wider text-slate-800 truncate group-hover:text-[#0a7ae6] transition-colors">
                          Xelectron Care Plus
                        </h5>
                      </Link>
                    </div>
                  </div>
                )}

                {openMenu === "SUPPORT & SERVICE" && (
                  <div className="grid grid-cols-12 gap-8 items-stretch">
                    {/* Column 1: Help & Support */}
                    <div className="col-span-3 pr-6 space-y-3">
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
                    <div className="col-span-4 pr-6 space-y-3">
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
                        className="group flex flex-col items-center justify-between rounded-xl p-2 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <div className="relative h-[135px] w-full overflow-hidden rounded-lg">
                          <Image
                            src="/creator-projector.png"
                            alt="Repair Center"
                            fill
                            className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h5 className="mt-2.5 w-full text-center text-xs font-bold uppercase tracking-wider text-slate-800 truncate group-hover:text-[#0a7ae6] transition-colors">
                          Need Repair Help?
                        </h5>
                      </Link>

                      <Link
                        href="/support"
                        onClick={() => setOpenMenu(null)}
                        className="group flex flex-col items-center justify-between rounded-xl p-2 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <div className="relative h-[135px] w-full overflow-hidden rounded-lg">
                          <Image
                            src="/blog-3.png"
                            alt="Manuals"
                            fill
                            className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h5 className="mt-2.5 w-full text-center text-xs font-bold uppercase tracking-wider text-slate-800 truncate group-hover:text-[#0a7ae6] transition-colors">
                          User Guides & Docs
                        </h5>
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
                    const mobileItems = group.label === "PRODUCT"
                      ? [
                        { key: "new-arrivals", label: "New Arrivals", href: "/shop?filter=new-arrivals" },
                        { key: "best-sellers", label: "Best Sellers", href: "/shop?filter=best-sellers" },
                        { key: "all-products", label: "All Products", href: "/shop" },
                        ...storeCategories.map((category) => ({
                          key: category.id,
                          label: category.title,
                          href: `/shop?filter=${encodeURIComponent(category.slug)}`,
                        })),
                      ]
                      : group.items.map((item) => ({ key: item, label: item, href: "/" }));

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
                            className={`size-4 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#0a7ae6]" : ""
                              }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="border-t border-slate-100 bg-white px-3.5 py-2 space-y-1">
                            {mobileItems.map((item) => (
                                <Link
                                  key={item.key}
                                  href={item.href}
                                  onClick={handleNavigate}
                                  className="block rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 hover:bg-[#0a7ae6]/5 hover:text-[#0a7ae6]"
                                >
                                  <span>{item.label}</span>
                                </Link>
                            ))}
                            {group.label === "PRODUCT" && areStoreCategoriesLoaded && storeCategories.length === 0 ? (
                              <p className="px-3 py-2 text-[13px] text-slate-400">
                                No categories available
                              </p>
                            ) : null}
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
          className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-500 ease-in-out ${isCartOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsCartOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-[440px] flex-col bg-white transition-all duration-500 ease-in-out ${isCartOpen ? "translate-x-0 shadow-2xl" : "translate-x-full shadow-none"
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <h2 className="text-base sm:text-lg font-medium uppercase tracking-wider text-slate-900">
              Shopping Cart ({cartCount})
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
                            updateQuantity(item.id, -1);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-900"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="px-2 text-xs font-medium text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => {
                            updateQuantity(item.id, 1);
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
                      removeItem(item.id);
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
                  ₹{cartSubtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mb-5 font-normal">
                Taxes and shipping calculated at checkout. Free shipping on all orders!
              </p>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full rounded-xl bg-[#0a7ae6] py-3.5 text-center text-sm font-medium uppercase tracking-wider text-white shadow-lg shadow-[#0a7ae6]/25 transition-all hover:opacity-95 hover:scale-[1.02]"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Wishlist Drawer */}
      <div className={`fixed inset-0 z-[100] ${isWishlistOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-500 ease-in-out ${isWishlistOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsWishlistOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-[440px] flex-col bg-white transition-all duration-500 ease-in-out ${isWishlistOpen ? "translate-x-0 shadow-2xl" : "translate-x-full shadow-none"
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
                          addItem(item);
                          removeWishlistItem(item.id);
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
                    onClick={() => removeWishlistItem(item.id)}
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
                    addItems(wishlistItems);
                    clearWishlist();
                    setIsWishlistOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full rounded-xl bg-[#0a7ae6] py-3.5 text-center text-sm font-medium uppercase tracking-wider text-white shadow-lg shadow-[#0a7ae6]/25 transition-all hover:opacity-95 hover:scale-[1.02] cursor-pointer"
                >
                  Move All to Cart
                </button>
                <button
                  onClick={clearWishlist}
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
          className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-500 ease-in-out ${isSearchDrawerOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsSearchDrawerOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          data-lenis-prevent
          className={`fixed inset-y-0 right-0 z-[101] flex w-full max-w-[440px] flex-col overflow-hidden bg-white transition-all duration-500 ease-in-out ${isSearchDrawerOpen ? "translate-x-0 shadow-2xl" : "translate-x-full shadow-none"
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
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 touch-pan-y [-webkit-overflow-scrolling:touch]">
            {isLoadingSearchProducts ? (
              <p className="py-10 text-center text-sm text-slate-400">Loading products…</p>
            ) : visibleSearchProducts.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-400">
                {searchTerm ? "No products found matching your search." : "No products are available yet."}
              </p>
            ) : (
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {searchTerm ? "Search results" : "Popular products"}
                </p>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  {searchProductCards.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug || product.id}`}
                      onClick={() => setIsSearchDrawerOpen(false)}
                      className="group flex flex-col rounded-lg border border-slate-200/80 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="relative mb-2 flex h-[80px] w-full items-center justify-center overflow-hidden rounded-md bg-slate-50/60 p-1">
                        <Image
                          src={searchProductImage(product)}
                          alt={product.name}
                          fill
                          className="object-contain p-1 transition-transform group-hover:scale-105"
                          sizes="120px"
                        />
                      </div>
                      <span className="truncate text-[8px] font-bold uppercase tracking-wider text-[#0a7ae6]">
                        {searchProductCategory(product)}
                      </span>
                      <h4 className="mt-0.5 line-clamp-1 text-xs font-bold text-slate-900 transition-colors group-hover:text-[#0a7ae6]">
                        {product.name}
                      </h4>
                      <span className="mt-1 text-xs font-black text-slate-900">
                        {searchProductPrice(product.price)}
                      </span>
                    </Link>
                  ))}
                </div>

                {searchProductListItems.length > 0 ? (
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {searchTerm ? "More results" : "More popular products"}
                    </p>
                    {searchProductListItems.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug || product.id}`}
                        onClick={() => setIsSearchDrawerOpen(false)}
                        className="group flex items-center gap-3 border-b border-slate-100 pb-3"
                      >
                        <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-white p-1">
                          <Image
                            src={searchProductImage(product)}
                            alt={product.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-xs font-bold text-slate-900 transition-colors group-hover:text-[#0a7ae6]">
                            {product.name}
                          </h4>
                          <p className="mt-0.5 truncate text-[9px] font-semibold text-slate-400">
                            {searchProductCategory(product)} • <span className="font-bold text-slate-950">{searchProductPrice(product.price)}</span>
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
