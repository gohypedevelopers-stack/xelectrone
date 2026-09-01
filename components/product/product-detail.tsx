"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Zap,
  Tag,
  Share2,
  CheckCircle2,
  HelpCircle,
  Award,
  CreditCard,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  Layers,
  Play,
  Pause,
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
  Sliders,
  ExternalLink,
  X as CloseIcon,
  Copy,
} from "lucide-react";
import {
  ProductDetailItem,
  type SimilarProductCard,
} from "@/lib/products-data";
import SimilarProductsSection from "@/components/product/similar-products-section";
import RecentlyViewedSection from "@/components/product/recently-viewed-section";
import ProductReviewsSection from "@/components/product/product-reviews-section";
import { ProductDescriptionContent } from "@/components/product/product-description-content";
import { VelocityLogo } from "@/components/checkout/payment-logos";
import { priceToNumber, useCart } from "@/components/providers/cart-provider";
import { formatINR } from "@/lib/format-price";
import { recordRecentlyViewedProduct } from "@/lib/recently-viewed-products";

interface ProductDetailProps {
  initialProduct: ProductDetailItem;
  initialRelatedProducts?: SimilarProductCard[];
  productId?: string;
  initialReviews?: any[];
}

function toProductDetailItem(product: any, activeDeal?: any): ProductDetailItem {
  let priceStr = typeof product.price === "number" ? `₹${product.price.toLocaleString("en-IN")}` : String(product.price);
  let oldPriceStr = product.oldPrice
    ? typeof product.oldPrice === "number"
      ? `₹${product.oldPrice.toLocaleString("en-IN")}`
      : String(product.oldPrice)
    : undefined;

  return {
    id: product.id,
    slug: product.slug || product.id,
    name: product.name,
    category: product.category?.title || product.category || "Electronics",
    categorySlug: product.category?.slug || "general",
    price: priceStr,
    oldPrice: oldPriceStr,
    discount: product.discount || undefined,
    rating: product.rating || 4.8,
    reviewsCount: `${product.reviewsCount || product.reviewCount || 0} Reviews`,
    description: product.description || "High quality XElectron product with premium build and official brand warranty.",
    colors:
      Array.isArray(product.colors) && product.colors.length > 0
        ? product.colors.map((color: any) => ({
            name: color.name,
            bg: color.bg || color.bgHex || "#1e1e24",
            border: color.border || color.borderHex,
          }))
        : [],
    features:
      Array.isArray(product.features) && product.features.length > 0
        ? product.features.map((feature: any) =>
            typeof feature === "string"
              ? feature
              : feature.featureText || feature.text || feature.title || feature.name || String(feature)
          )
        : ["Official 1-Year Brand Warranty", "High Performance Optical Engine", "Fast Express Shipping Across India"],
    specs:
      Array.isArray(product.specs) && product.specs.length > 0
        ? product.specs.map((spec: any) => ({
            label: spec.label || "Specification",
            value: spec.value || String(spec),
          }))
        : [
            { label: "Category", value: product.category?.title || "Electronics" },
            { label: "Model SKU", value: product.sku || product.id },
          ],
    shippingNotice: product.shippingNotice || "Free express delivery across India & Official Brand Warranty",
    quantity:
      typeof product.quantity === "number" && Number.isFinite(product.quantity)
        ? Math.max(0, product.quantity)
        : undefined,
    mainImage: product.images?.[0] || product.mainImage || "/category-smartphone.png",
    images:
      Array.isArray(product.media) && product.media.length > 0
        ? [...new Set([product.mainImage, ...product.media.map((media: any) => media.url)])]
        : product.images,
    faqs:
      Array.isArray(product.faqs) && product.faqs.length > 0
        ? product.faqs.map((faq: any) => ({
            question: faq.question || faq.q,
            answer: faq.answer || faq.a,
          }))
        : product.faqs,
    banners:
      Array.isArray(product.banners) && product.banners.length > 0
        ? product.banners.map((b: any) => ({
            id: b.id,
            imageUrl: b.imageUrl || b.url,
            mobileImageUrl: b.mobileImageUrl,
            title: b.title,
            sortOrder: b.sortOrder,
          }))
        : product.banners,
    sku: product.sku || null,
    variants: (product as any).variants || [],
    creatorVideos:
      Array.isArray(product.creatorVideos) && product.creatorVideos.length > 0
        ? product.creatorVideos.map((v: any) => ({
            id: v.id,
            title: v.title,
            thumbnailUrl: v.thumbnailUrl,
            videoUrl: v.videoUrl,
            sortOrder: v.sortOrder,
            isActive: v.isActive,
            isProductVideo: v.isProductVideo ?? v.is_product_video ?? true,
          }))
        : product.creatorVideos || [],
  };
}

export default function ProductDetail({
  initialProduct,
  initialRelatedProducts = [],
  productId,
  initialReviews,
}: ProductDetailProps) {
  const searchParams = useSearchParams();
  const { addItem, wishlistItems, toggleWishlistItem } = useCart();
  const searchProductId = searchParams?.get("id") || searchParams?.get("product");
  const [apiProduct, setApiProduct] = useState<ProductDetailItem | null>(null);

  // Interaction States
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"features" | "faqs" | "reviews">("features");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showBottomSticky, setShowBottomSticky] = useState(false);
  const [isBottomStickyDismissed, setIsBottomStickyDismissed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);
  const [isBannerSlider, setIsBannerSlider] = useState(true);
  const [isSliderPlaying, setIsSliderPlaying] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState<{ url: string; title?: string } | null>(null);
  const buyBoxRef = useRef<HTMLDivElement>(null);

  const product = useMemo(
    () => apiProduct ?? initialProduct,
    [apiProduct, initialProduct]
  );

  useEffect(() => {
    if (!isSliderPlaying) return;
    const allBanners = product?.banners || [];
    const sliderCount = allBanners.filter(
      (b: any) => b.title?.includes("[slider]") || (typeof b.sortOrder === "number" && b.sortOrder >= 1000)
    ).length;
    if (sliderCount <= 1) return;

    const interval = setInterval(() => {
      setActiveBannerSlide((prev) => (prev + 1) % sliderCount);
    }, 4500);

    return () => clearInterval(interval);
  }, [isSliderPlaying, product?.banners]);

  useEffect(() => {
    const targetId = productId || searchProductId;
    if (!targetId) return;

    Promise.all([
      fetch(`/api/products/${encodeURIComponent(targetId)}`).then((res) => res.json()),
      fetch(`/api/deal-of-the-day`).then((res) => res.json()).catch(() => null),
    ])
      .then(([productRes, dealRes]) => {
        if (productRes.success && productRes.data) {
          const activeDeal = dealRes && dealRes.success ? dealRes.data : null;
          setApiProduct(toProductDetailItem(productRes.data, activeDeal));
        }
      })
      .catch(() => {});
  }, [productId, searchProductId]);

  useEffect(() => {
    if (product?.id) recordRecentlyViewedProduct(product.id);
  }, [product?.id]);

  // Scroll listener for sticky purchase bottom bar
  useEffect(() => {
    const handleScroll = () => {
      if (!buyBoxRef.current) return;
      const rect = buyBoxRef.current.getBoundingClientRect();
      // Show bottom bar when buy box scrolls out of view
      if (rect.bottom < 100) {
        setShowBottomSticky(true);
      } else {
        setShowBottomSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productImages = useMemo(
    () => [...new Set([product.mainImage, ...(product.images || [])].filter(Boolean))],
    [product.images, product.mainImage]
  );

  const heroImage = productImages[0] || "/category-projector.png";
  const additionalImages = productImages.slice(1);

  const numericPrice = useMemo(() => priceToNumber(product.price), [product.price]);
  const emiAmount = useMemo(() => Math.round(numericPrice / 3), [numericPrice]);
  // Only an explicit stored quantity of zero marks the product as unavailable.
  // A missing value must never be treated as out of stock while product data loads.
  const availableStock =
    typeof product.quantity === "number" && Number.isFinite(product.quantity)
      ? Math.max(0, product.quantity)
      : null;
  const isOutOfStock = availableStock === 0;
  const maximumPurchaseQuantity = availableStock === null ? 10 : Math.min(10, availableStock);

  useEffect(() => {
    setQuantity((currentQuantity) => Math.max(1, Math.min(currentQuantity, maximumPurchaseQuantity || 1)));
  }, [maximumPurchaseQuantity]);

  const addProductToCart = () => {
    if (isOutOfStock) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        slug: product.slug || product.id,
        name: product.name,
        price: numericPrice,
        image: product.mainImage,
        category: product.category,
      });
    }
  };

  const isFavorite = wishlistItems.some((item) => item.id === product.id);

  const toggleProductWishlist = () => {
    toggleWishlistItem({
      id: product.id,
      slug: product.slug || product.id,
      name: product.name,
      price: numericPrice,
      oldPrice: product.oldPrice ? priceToNumber(product.oldPrice) : undefined,
      image: product.mainImage,
      category: product.category,
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const [recentDisplayedIds, setRecentDisplayedIds] = useState<string[]>([]);

  return (
    <div className="w-full bg-white pt-2 sm:pt-4 pb-0 text-slate-900 overflow-x-clip">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        {/* TOP PRODUCT SECTION */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          
          {/* LEFT COLUMN: MULTI-IMAGE SHOWCASE / GALLERY */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Primary Hero Feature Image */}
            <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-lg sm:rounded-xl flex items-center justify-center">
              <Image
                src={heroImage}
                alt={product.name}
                fill
                priority
                className="object-contain transition-transform duration-500 hover:scale-[1.02]"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            </div>

            {/* Gallery Grid Below Hero Image */}
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {additionalImages.map((image, idx) => (
                  <div
                    key={`${image}-${idx}`}
                    className="relative aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl flex items-center justify-center group"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} feature ${idx + 1}`}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 28vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PRODUCT PURCHASE CARD */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div
              ref={buyBoxRef}
              className="rounded-3xl border border-slate-200/90 bg-[#fafafa]/90 p-5 sm:p-7 xl:p-8 shadow-xs backdrop-blur-xs"
            >
              {/* Product Category & Title with Badge */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#0a7ae6]">
                    NEW ARRIVALS
                  </span>
                  {product.sku && (
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
                      SKU: {product.sku}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Subtitle / Spec Summary */}
                {product.shippingNotice && (
                  <p className="text-sm sm:text-base font-normal text-gray-500 leading-relaxed">
                    {product.shippingNotice}
                  </p>
                )}
              </div>

              {/* Rating & Review Counter */}
              <div className="mt-3.5 flex items-center gap-2.5">
                <div className="inline-flex items-center rounded-none bg-[#15803d] px-2.5 py-0.5 text-sm sm:text-base font-bold text-white shadow-2xs">
                  <span>{typeof product.rating === "number" ? product.rating.toFixed(1) : product.rating}</span>
                </div>
                <span className="text-sm sm:text-base font-medium text-slate-500">
                  ({product.reviewsCount})
                </span>
              </div>

              {/* Price Row */}
              <div className="mt-4 pt-3 border-t border-slate-200/70">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                    {formatINR(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-lg sm:text-xl text-slate-400 line-through font-normal">
                      {formatINR(product.oldPrice)}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-base sm:text-lg font-semibold text-emerald-600">
                      {product.discount}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs sm:text-sm text-gray-400 font-medium">
                  (MRP Inclusive of all taxes)
                </p>
              </div>

              {/* Crossbeats Style Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4 border-t border-slate-200/70 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Color : <span className="text-slate-900 font-semibold">{selectedColor || product.colors[0]?.name}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {product.colors.map((color: any) => {
                      const isSelected = (selectedColor || product.colors[0]?.name) === color.name;
                      return (
                        <button
                          key={color.id || color.name}
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`group relative flex size-7 items-center justify-center rounded-full transition cursor-pointer ${
                            isSelected ? "ring-2 ring-black ring-offset-2 scale-110" : "hover:scale-105"
                          }`}
                          title={color.name}
                        >
                          <span
                            className="size-6 rounded-full border border-black/15 shadow-2xs"
                            style={{ backgroundColor: color.bg || color.bgHex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Crossbeats Style Product Variants */}
              {(product as any).variants && (product as any).variants.length > 0 && (
                <div className="mt-4 border-t border-slate-200/70 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Select Variant :
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(product as any).variants.map((v: any) => {
                      const isSelected = (selectedVariant?.name || (product as any).variants[0]?.name) === v.name;
                      return (
                        <button
                          key={v.id || v.name}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition border cursor-pointer ${
                            isSelected
                              ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                              : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          <span>{v.name}</span>
                          {v.price && (
                            <span className={`ml-1.5 text-[11px] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                              (₹{v.price})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Velocity EMI */}
              <div className="mt-4 space-y-1.5 rounded-2xl border border-sky-200 bg-sky-50/60 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-900">
                    <VelocityLogo className="h-4" />
                    EMI / Pay Later
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0a7ae6]">
                    Available
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                  <span>
                    From <strong className="font-bold text-slate-900">₹{emiAmount.toLocaleString("en-IN")}/month</strong> for 3 months
                  </span>
                  {isOutOfStock ? (
                    <span className="text-[11px] font-bold text-slate-400">Unavailable</span>
                  ) : (
                    <Link
                      href={`/checkout?product=${encodeURIComponent(product.slug || product.id)}&payment=velocity&emiTenure=3`}
                      onClick={addProductToCart}
                      className="text-[11px] font-bold text-[#0a7ae6] underline"
                    >
                      Buy on EMI
                    </Link>
                  )}
                </div>
                <p className="text-[10px] text-slate-500">Eligible plans and final terms are shown by Velocity at checkout.</p>
              </div>

              {/* Stock state */}
              {isOutOfStock ? (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700">
                  <span className="flex size-2.5 shrink-0 rounded-full bg-red-600" />
                  <span>Out of stock</span>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2.5 text-sm sm:text-[15px] font-medium text-emerald-800">
                  <span className="relative flex size-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-600" />
                  </span>
                  <span>{availableStock !== null && availableStock <= 5 ? `Only ${availableStock} left in stock` : "In stock and ready to ship"}</span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-200/70 pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Quantity :
                </span>
                <div className="flex items-center rounded-xl border border-slate-300 bg-white p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    aria-label="Decrease quantity"
                    className="flex size-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition active:scale-95 disabled:opacity-40"
                    disabled={isOutOfStock || quantity <= 1}
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(maximumPurchaseQuantity, prev + 1))}
                    aria-label="Increase quantity"
                    className="flex size-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition active:scale-95 disabled:opacity-40"
                    disabled={isOutOfStock || quantity >= maximumPurchaseQuantity}
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="mt-5 space-y-2.5">
                {isOutOfStock ? (
                  <button type="button" disabled className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-slate-300 text-sm font-bold text-slate-600">
                    Out of Stock
                  </button>
                ) : (
                  <Link
                    href={`/checkout?product=${encodeURIComponent(product.slug || product.id)}`}
                    onClick={addProductToCart}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0a7ae6] text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-[#086ac9] active:scale-[0.99]"
                  >
                    Buy Now
                  </Link>
                )}

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={addProductToCart}
                    disabled={isOutOfStock}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 text-xs font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
                  >
                    <ShoppingBag className="size-4" />
                    <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleProductWishlist}
                    aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl border transition-all ${
                      isFavorite
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <Heart className={`size-4.5 ${isFavorite ? "fill-red-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="mt-5 border-t border-slate-200/70 pt-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Delivered to your doorstep within 24-48 hours</span>
                </div>
              </div>

              {/* Services and Benefits Section */}
              <div className="mt-6 border-t border-slate-200/70 pt-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2.5">
                  Services and benefits
                </h3>
                <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-2xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    <div className="flex items-center gap-3">
                      <Truck className="size-5 text-slate-900 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-slate-800">
                        Fast, Free Shipping
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="size-5 text-slate-900 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-slate-800">
                        Hassle-Free Warranty
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="size-5 text-slate-900 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-slate-800">
                        Lowest Price Guarantee
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <HelpCircle className="size-5 text-slate-900 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-slate-800">
                        Lifetime Customer Support
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Accordion: Description */}
              <div className="mt-5 border-t border-slate-200/70 pt-4">
                <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs transition-all">
                  <button
                    type="button"
                    onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                    className="flex w-full items-center justify-between p-3.5 text-left font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <span className="text-slate-900 font-bold">Product Description</span>
                    <span className="flex size-5 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      {isDescriptionOpen ? <Minus className="size-3" /> : <Plus className="size-3" />}
                    </span>
                  </button>

                  {isDescriptionOpen && (
                    <div className="border-t border-slate-100 p-4 pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <ProductDescriptionContent description={product.description} />
                    </div>
                  )}
                </div>
              </div>

              {/* Social Sharing Icons */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-200/70 pt-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Share Product
                </span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.name} on XElectron: `)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition shadow-2xs"
                    title="Share on WhatsApp"
                  >
                    <MessageSquare className="size-3.5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} on XElectron`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-sky-500 hover:border-sky-200 transition shadow-2xs"
                    title="Share on X"
                  >
                    <Share2 className="size-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex size-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#0a7ae6] hover:border-blue-200 transition shadow-2xs relative"
                    title="Copy Link"
                  >
                    <Copy className="size-3.5" />
                    {copiedLink && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap shadow-md">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* SEPARATE SECTION NAVIGATION PILL BAR (BELOW RIGHT COLUMN CARD) */}
            <div className="mt-5 flex justify-center w-full">
              <div className="inline-flex w-full items-center justify-around rounded-full bg-[#ebedf0] px-6 sm:px-10 py-5 sm:py-6 shadow-sm border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("features");
                    const el = document.getElementById("product-specifications") || document.getElementById("product-features");
                    if (el) {
                      const yOffset = -90;
                      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className={`text-sm sm:text-base md:text-lg font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                    activeTab === "features" ? "text-slate-950" : "text-slate-700 hover:text-slate-950"
                  }`}
                >
                  Features
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("faqs");
                    const el = document.getElementById("product-faqs");
                    if (el) {
                      const yOffset = -90;
                      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className={`text-sm sm:text-base md:text-lg font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                    activeTab === "faqs" ? "text-slate-950" : "text-slate-700 hover:text-slate-950"
                  }`}
                >
                  FAQ&apos;S
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("reviews");
                    const el = document.getElementById("product-reviews");
                    if (el) {
                      const yOffset = -90;
                      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className={`text-sm sm:text-base md:text-lg font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                    activeTab === "reviews" ? "text-slate-950" : "text-slate-700 hover:text-slate-950"
                  }`}
                >
                  Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH EDGE-TO-EDGE PRODUCT SHOWCASE & SLIDER BANNERS */}
      {(() => {
        const allBanners = product.banners || [];
        if (allBanners.length === 0) return null;

        // Parse position tag from slider banners
        const sliderBannerSample = allBanners.find((b: any) => b.title?.includes("[slider"));
        let insertPos = "after";
        if (sliderBannerSample?.title) {
          const match = sliderBannerSample.title.match(/\[slider(?::pos:(\w+|\d+)|:(before|after))?\]/i);
          if (match) {
            insertPos = match[1] || match[2] || "after";
          }
        }

        const sliderBanners = allBanners
          .filter((b: any) => b.title?.includes("[slider]") || (typeof b.sortOrder === "number" && b.sortOrder >= 1000))
          .map((b: any) => ({
            ...b,
            cleanTitle: b.title ? b.title.replace(/\[slider(?::(?:pos:\w+|before|after))?\]\s*/gi, "").trim() : "",
          }));

        const showcaseBanners = allBanners.filter(
          (b: any) => !b.title?.includes("[slider]") && !(typeof b.sortOrder === "number" && b.sortOrder >= 1000)
        );

        let splitIdx = showcaseBanners.length;
        if (insertPos === "before" || insertPos === "0" || insertPos === "1") {
          splitIdx = 0;
        } else if (insertPos !== "after" && !isNaN(Number(insertPos))) {
          splitIdx = Math.max(0, Math.min(showcaseBanners.length, Number(insertPos) - 1));
        }

        const topShowcase = showcaseBanners.slice(0, splitIdx);
        const bottomShowcase = showcaseBanners.slice(splitIdx);

        const renderSliderSection = () => {
          if (sliderBanners.length === 0) return null;
          const currentIdx = activeBannerSlide % sliderBanners.length;

          return (
            <section id="product-slider-banners" className="relative w-full bg-[#060609] py-8 sm:py-14 overflow-hidden block select-none">
              {/* True Horizontal Carousel Track with Peeking Cards */}
              <div className="relative w-full overflow-hidden">
                <div
                  className="flex items-center gap-4 sm:gap-6 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    transform: `translateX(calc(50vw - ${(currentIdx * 80)}vw - 40vw - ${(currentIdx * 1.5)}rem))`,
                  }}
                >
                  {sliderBanners.map((banner: any, idx: number) => {
                    const isActive = currentIdx === idx;

                    return (
                      <div
                        key={banner.id || `slider-banner-card-${idx}`}
                        onClick={() => setActiveBannerSlide(idx)}
                        className={`w-[80vw] rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 transition-all duration-500 shadow-2xl bg-black border border-white/10 ${
                          isActive
                            ? "opacity-100 scale-100 ring-1 ring-white/15"
                            : "opacity-40 scale-[0.93] hover:opacity-75 cursor-pointer"
                        }`}
                      >
                        {/* Desktop Banner Image */}
                        <div className={banner.mobileImageUrl ? "hidden md:block w-full leading-none m-0 p-0" : "block w-full leading-none m-0 p-0"}>
                          <img
                            src={banner.imageUrl}
                            alt={banner.cleanTitle || `${product.name} slide ${idx + 1}`}
                            className="w-full h-auto block object-contain mx-auto"
                            loading={idx === 0 ? "eager" : "lazy"}
                          />
                        </div>

                        {/* Mobile Banner Image */}
                        {banner.mobileImageUrl && (
                          <div className="block md:hidden w-full leading-none m-0 p-0">
                            <img
                              src={banner.mobileImageUrl}
                              alt={banner.cleanTitle || `${product.name} mobile slide ${idx + 1}`}
                              className="w-full h-auto block object-contain mx-auto"
                              loading={idx === 0 ? "eager" : "lazy"}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Controller Pill (Crossbeats Style) */}
              {sliderBanners.length > 1 && (
                <div className="flex items-center justify-center mt-6 sm:mt-8">
                  <div className="inline-flex items-center gap-3 rounded-full bg-[#1c1c22]/90 px-4 py-2 border border-white/10 shadow-2xl backdrop-blur-md">
                    {/* Pagination Indicators */}
                    <div className="flex items-center gap-1.5">
                      {sliderBanners.map((_, idx) => (
                        <button
                          key={`slider-dot-${idx}`}
                          type="button"
                          onClick={() => setActiveBannerSlide(idx)}
                          aria-label={`Slide ${idx + 1}`}
                          className={`rounded-full transition-all duration-300 cursor-pointer ${
                            currentIdx === idx
                              ? "w-6 sm:w-7 h-1.5 sm:h-2 bg-white shadow-xs"
                              : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/35 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Play / Pause Toggle Button */}
                    <div className="border-l border-white/15 pl-2.5 flex items-center">
                      <button
                        type="button"
                        onClick={() => setIsSliderPlaying((prev) => !prev)}
                        title={isSliderPlaying ? "Pause slideshow" : "Play slideshow"}
                        aria-label={isSliderPlaying ? "Pause slideshow" : "Play slideshow"}
                        className="text-white/80 hover:text-white transition cursor-pointer p-0.5"
                      >
                        {isSliderPlaying ? (
                          <Pause className="size-3 sm:size-3.5 fill-white text-white" />
                        ) : (
                          <Play className="size-3 sm:size-3.5 fill-white text-white translate-x-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        };

        const renderShowcaseSlice = (slice: any[], startIdx = 0) => {
          if (slice.length === 0) return null;

          return (
            <section className="relative w-full space-y-0 leading-none overflow-hidden block">
              <div className="space-y-0 leading-none block m-0 p-0">
                {slice.map((banner: any, idx: number) => (
                  <div
                    id={`showcase-slide-${startIdx + idx}`}
                    key={banner.id || `showcase-banner-${startIdx + idx}`}
                    className="relative w-full overflow-hidden leading-none block m-0 p-0"
                  >
                    {/* Desktop Banner Image (Full width end-to-end) */}
                    <div className={banner.mobileImageUrl ? "hidden md:block leading-none m-0 p-0" : "block leading-none m-0 p-0"}>
                      <img
                        src={banner.imageUrl}
                        alt={banner.title || `${product.name} showcase banner ${startIdx + idx + 1}`}
                        className="w-full h-auto block m-0 p-0"
                        loading="lazy"
                      />
                    </div>

                    {/* Mobile Banner Image (Full width end-to-end) */}
                    {banner.mobileImageUrl && (
                      <div className="block md:hidden leading-none m-0 p-0">
                        <img
                          src={banner.mobileImageUrl}
                          alt={banner.title || `${product.name} mobile banner ${startIdx + idx + 1}`}
                          className="w-full h-auto block m-0 p-0"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        };

        return (
          <div id="product-features" className="w-full space-y-0 my-8 sm:my-14 leading-none m-0 p-0 block scroll-mt-24">
            {renderShowcaseSlice(topShowcase, 0)}
            {renderSliderSection()}
            {renderShowcaseSlice(bottomShowcase, splitIdx)}
          </div>
        );
      })()}

      {/* BOTTOM SECTIONS CONTAINER */}
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8">
        {/* CREATOR & HANDS-ON VIDEOS SECTION (MATCHING USER IMAGES) */}
        {(() => {
          const videos = ((product as any)?.creatorVideos || []).filter((v: any) => v && (v.isProductVideo !== false) && Boolean(v.videoUrl?.trim() || v.thumbnailUrl?.trim()));
          if (!Array.isArray(videos) || videos.length === 0) return null;

          const getYouTubeEmbedUrl = (url: string, autoPlay = true, mute = true) => {
            if (!url) return "";
            let videoId = "";
            if (url.includes("watch?v=")) {
              videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
            } else if (url.includes("youtu.be/")) {
              videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
            } else if (url.includes("shorts/")) {
              videoId = url.split("shorts/")[1]?.split("?")[0] || "";
            } else if (url.includes("embed/")) {
              videoId = url.split("embed/")[1]?.split("?")[0] || "";
            }

            if (videoId) {
              const params = new URLSearchParams({
                autoplay: autoPlay ? "1" : "0",
                mute: mute ? "1" : "0",
                controls: "1",
                rel: "0",
                playsinline: "1",
                enablejsapi: "1",
                cc_load_policy: "0",
                iv_load_policy: "3",
              });
              return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
            }
            return url;
          };

          return (
            <section id="product-creator-videos" className="my-8 sm:my-14 scroll-mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
                {videos.map((vid: any, idx: number) => {
                  const isYouTube = vid.videoUrl && (vid.videoUrl.includes("youtube.com") || vid.videoUrl.includes("youtu.be"));
                  const isDirectVideo = vid.videoUrl && !isYouTube;

                  return (
                    <div
                      key={vid.id || `creator-vid-card-${idx}`}
                      className="group relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-slate-200/90 shadow-sm"
                    >
                      {/* Video Player Content with Native Details */}
                      {isDirectVideo ? (
                        <video
                          src={vid.videoUrl}
                          controls
                          autoPlay
                          loop
                          muted
                          playsInline
                          poster={vid.thumbnailUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : isYouTube ? (
                        <iframe
                          src={getYouTubeEmbedUrl(vid.videoUrl, true, true)}
                          title={vid.title || `Video ${idx + 1}`}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <img
                          src={vid.thumbnailUrl || "/creator-projector.png"}
                          alt={vid.title || `${product.name} video ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* FULL-WIDTH SPECIFICATIONS SECTION (CROSSBEATS REFERENCE) */}
        {(() => {
          const isConnectivityKey = (rawLabel: string) => {
            const l = String(rawLabel || "").trim().toLowerCase();
            return (
              l.includes("smart") ||
              l.includes("battery") ||
              l.includes("charging") ||
              l.includes("connectivity") ||
              l.includes("bluetooth") ||
              l.includes("wi-fi") ||
              l.includes("wifi") ||
              l.includes("app support") ||
              l.includes("app") ||
              l.includes("wireless") ||
              l.includes("network") ||
              l.includes("ports")
            );
          };

          const rawSpecs =
            Array.isArray(product.specs) && product.specs.length > 0
              ? product.specs
              : [
                  { label: "Display Type", value: "Curved AMOLED / LED" },
                  { label: "Resolution", value: "1080P Full HD & 4K Support" },
                  { label: "Brightness / Lumens", value: "9000 Lumens" },
                  { label: "Speaker / Audio", value: "Built-in Hi-Fi Stereo Speaker" },
                  { label: "Operating System", value: "Android Smart OS (Built-in Apps)" },
                  { label: "Focus / Keystone", value: "Electric Focus, Auto & 4D Keystone" },
                  { label: "Screen / Projection Size", value: "Up to 200 inches" },
                  { label: "Warranty", value: "1 Year Official Brand Warranty" },
                  { label: "Typical Usage", value: "Up to 7 days" },
                  { label: "Battery Life / Usage", value: "Up to 7 Days Battery" },
                  { label: "Connectivity", value: "Dual Wi-Fi 6 + Bluetooth 5.2, HDMI, USB" },
                  {
                    label: "Smart Features",
                    value:
                      "Built-in WhatsApp\nChatGPT Integration\nDynamic Island\nMotion-sensing Games & Exercises\nNFC Support\nDual Voice Assistant\nVoice Recorder\nVideo Watch Faces\nEbook Reader\nAltimeter & Compass\nMulti-sports Mode with Dynamic Route Tracking",
                  },
                  { label: "Battery Type", value: "Li-Polymer" },
                  { label: "Charging Type", value: "Wireless Magnetic Charger" },
                ];

          const designSpecs = rawSpecs.filter((s: any) => !isConnectivityKey(s.label));
          const connectivitySpecs = rawSpecs.filter((s: any) => isConnectivityKey(s.label));

          return (
            <section id="product-specifications" className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-slate-200 scroll-mt-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20">
                {/* Column 1: Design, Display & Performance */}
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight pb-3.5 border-b border-slate-200/90">
                    Design, Display & Performance
                  </h2>
                  {designSpecs.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {designSpecs.map((spec: any, idx: number) => (
                        <div
                          key={`d-full-${idx}`}
                          className="grid grid-cols-1 sm:grid-cols-[190px_1fr] py-3.5 sm:py-4 items-baseline gap-1.5 sm:gap-6"
                        >
                          <span className="text-xs sm:text-sm font-medium text-slate-500">
                            {spec.label}
                          </span>
                          <span className="text-xs sm:text-sm md:text-[15px] font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-3">No specifications listed.</p>
                  )}
                </div>

                {/* Column 2: Connectivity, Battery & Smart Features */}
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight pb-3.5 border-b border-slate-200/90">
                    Connectivity, Battery & Smart Features
                  </h2>
                  {connectivitySpecs.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {connectivitySpecs.map((spec: any, idx: number) => (
                        <div
                          key={`c-full-${idx}`}
                          className="grid grid-cols-1 sm:grid-cols-[190px_1fr] py-3.5 sm:py-4 items-baseline gap-1.5 sm:gap-6"
                        >
                          <span className="text-xs sm:text-sm font-medium text-slate-500">
                            {spec.label}
                          </span>
                          <span className="text-xs sm:text-sm md:text-[15px] font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-3">No specifications listed.</p>
                  )}
                </div>
              </div>
            </section>
          );
        })()}

        {/* FULL-WIDTH FREQUENTLY ASKED QUESTIONS SECTION (MATCHING REFERENCE) */}
        {(() => {
          const rawFaqs = product.faqs && product.faqs.length > 0
            ? product.faqs.map((f: any) => ({ q: f.question, a: f.answer }))
            : [
                {
                  q: "Getting Started",
                  a: "Unbox the device, connect the power adapter, and press the power button for 3 seconds. Follow the on-screen setup assistant to connect to your Wi-Fi network.",
                },
                {
                  q: "About the Product",
                  a: "Engineered with native 1080P Full HD clarity, 4K video decoding, immersive stereo speakers, and built-in Android Smart OS with Netflix, YouTube, and Prime Video.",
                },
                {
                  q: "Battery and Charging",
                  a: "Equipped with high-efficiency power management and fast-charging support. Full recharge takes approximately 90–120 minutes.",
                },
                {
                  q: "App",
                  a: "Download the companion mobile application from Google Play Store or Apple App Store for wireless remote control, firmware updates, and settings customization.",
                },
                {
                  q: "Health and Sensors",
                  a: "Features precision multi-axis gyroscope, smart auto-keystone correction, intelligent obstacle avoidance, and dynamic heat dissipation sensors.",
                },
                {
                  q: "Compatibility",
                  a: "Seamlessly pairs with Android, iOS, Windows, Mac, gaming consoles (PS5/Xbox/Switch), TV sticks, USB drives, and Bluetooth audio systems.",
                },
              ];

          return (
            <section id="product-faqs" className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-slate-200 scroll-mt-24">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-slate-800 tracking-tight text-center mb-8 sm:mb-12">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-3 sm:space-y-3.5">
                  {rawFaqs.map((faq: any, idx: number) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={`faq-ref-${idx}`}
                        className="rounded-none bg-[#f4f5f7] transition-colors duration-150 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full px-6 py-4.5 sm:px-8 sm:py-5 flex items-center justify-between gap-4 text-left font-normal text-base sm:text-lg md:text-xl text-slate-600 hover:text-slate-900 transition cursor-pointer"
                        >
                          <span className="leading-snug">{faq.q}</span>
                          <span className="shrink-0 flex items-center justify-center">
                            {isOpen ? (
                              <Minus className="size-5 sm:size-6 text-slate-500 stroke-[1.8]" />
                            ) : (
                              <Plus className="size-5 sm:size-6 text-slate-500 stroke-[1.8]" />
                            )}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-6 sm:px-8 pb-5 sm:pb-6 pt-1 text-sm sm:text-base text-slate-500 leading-relaxed whitespace-pre-line border-t border-slate-200/40">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })()}

        {/* BOTTOM FLOATING STICKY PURCHASE BAR */}
        {showBottomSticky && !isBottomStickyDismissed && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="rounded-xl border border-slate-200/90 bg-white/95 px-4 sm:px-7 py-2.5 sm:py-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 sm:gap-6">
              {/* Product Info */}
              <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
                {/* Borderless Large Product Image */}
                <div className="relative size-14 sm:size-16 md:size-18 shrink-0 overflow-hidden bg-transparent">
                  <Image
                    src={heroImage}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-[13px] font-semibold text-slate-800 truncate max-w-[220px] sm:max-w-[420px] md:max-w-[620px] leading-tight">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {formatINR(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                        {formatINR(product.oldPrice)}
                      </span>
                    )}
                    {product.discount && (
                      <span className="text-[10px] sm:text-xs font-semibold text-emerald-600">
                        {product.discount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Mini Quantity Stepper */}
                <div className="hidden sm:flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="size-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-md transition shadow-2xs"
                    disabled={isOutOfStock || quantity <= 1}
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="w-7 text-center text-xs font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(maximumPurchaseQuantity, prev + 1))}
                    disabled={isOutOfStock || quantity >= maximumPurchaseQuantity}
                    className="size-7 flex items-center justify-center rounded-md text-slate-600 shadow-2xs transition hover:bg-white disabled:opacity-40"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>

                {isOutOfStock ? (
                  <span className="rounded-lg bg-slate-300 px-6 py-2 text-xs font-bold text-slate-600 sm:py-2.5 sm:text-sm">Out of Stock</span>
                ) : (
                  <Link
                    href={`/checkout?product=${encodeURIComponent(product.slug || product.id)}`}
                    onClick={addProductToCart}
                    className="rounded-lg bg-[#0a7ae6] px-6 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#086ac9] active:scale-95 sm:py-2.5 sm:text-sm"
                  >
                    Buy Now
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setIsBottomStickyDismissed(true)}
                  aria-label="Dismiss quick bar"
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition cursor-pointer"
                >
                  <CloseIcon className="size-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS SECTION */}
        <ProductReviewsSection
          productId={product.id || productId}
          productName={product.name}
          rating={product.rating}
          reviewsCount={product.reviewsCount}
          initialReviews={initialReviews}
        />

        {/* RECENTLY VIEWED & SIMILAR PRODUCTS */}
        <div className="mt-16 sm:mt-24 space-y-12">
          <RecentlyViewedSection
            currentProductId={product.id}
            onDisplayedProductsChange={setRecentDisplayedIds}
          />
          <SimilarProductsSection
            products={initialRelatedProducts}
            excludeIds={[product.id, ...recentDisplayedIds]}
          />
        </div>
      </div>

      {/* CREATOR VIDEO PLAYER MODAL */}
      {activeVideoModal && (
        <div
          onClick={() => setActiveVideoModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-20 size-9 rounded-full bg-black/70 text-white hover:bg-white hover:text-black flex items-center justify-center transition cursor-pointer"
            >
              <CloseIcon className="size-5" />
            </button>

            {/* Video Player (Embed or HTML5 Video) */}
            <div className="relative aspect-video w-full bg-black">
              {activeVideoModal.url.includes("youtube.com") || activeVideoModal.url.includes("youtu.be") ? (
                <iframe
                  src={
                    activeVideoModal.url.includes("watch?v=")
                      ? `https://www.youtube-nocookie.com/embed/${activeVideoModal.url.split("watch?v=")[1]?.split("&")[0]}?autoplay=1&rel=0&cc_load_policy=0&iv_load_policy=3`
                      : activeVideoModal.url.includes("youtu.be/")
                      ? `https://www.youtube-nocookie.com/embed/${activeVideoModal.url.split("youtu.be/")[1]?.split("?")[0]}?autoplay=1&rel=0&cc_load_policy=0&iv_load_policy=3`
                      : activeVideoModal.url.includes("shorts/")
                      ? `https://www.youtube-nocookie.com/embed/${activeVideoModal.url.split("shorts/")[1]?.split("?")[0]}?autoplay=1&rel=0&cc_load_policy=0&iv_load_policy=3`
                      : activeVideoModal.url
                  }
                  title={activeVideoModal.title || "Video Player"}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideoModal.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

