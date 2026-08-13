"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import {
  getProductById,
  ProductDetailItem,
  type SimilarProductCard,
} from "@/lib/products-data";
import SimilarProductsSection from "@/components/product/similar-products-section";
import RecentlyViewedSection from "@/components/product/recently-viewed-section";
import { ProductDescriptionContent } from "@/components/product/product-description-content";
import { priceToNumber, useCart } from "@/components/providers/cart-provider";
import { formatINR } from "@/lib/format-price";
import { recordRecentlyViewedProduct } from "@/lib/recently-viewed-products";

interface ProductDetailProps {
  initialProduct?: ProductDetailItem;
  initialRelatedProducts?: SimilarProductCard[];
  productId?: string;
}

function toProductDetailItem(product: any, activeDeal?: any): ProductDetailItem {
  let priceStr = typeof product.price === "number" ? `₹${product.price.toLocaleString("en-IN")}` : String(product.price);
  let oldPriceStr = product.oldPrice ? (typeof product.oldPrice === "number" ? `₹${product.oldPrice.toLocaleString("en-IN")}` : String(product.oldPrice)) : undefined;



  const priceVal = priceToNumber(priceStr);
  const oldPriceVal = oldPriceStr ? priceToNumber(oldPriceStr) : 0;

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
    colors: Array.isArray(product.colors) && product.colors.length > 0
      ? product.colors.map((color: any) => ({ name: color.name, bg: color.bg || color.bgHex || "#1e1e24", border: color.border || color.borderHex }))
      : [{ name: "Standard", bg: "#1e1e24" }],
    features: Array.isArray(product.features) && product.features.length > 0
      ? product.features.map((feature: any) => typeof feature === "string" ? feature : feature.featureText || feature.text || feature.title || feature.name || String(feature))
      : ["Official Brand Warranty", "High Performance Build", "Fast Express Shipping"],
    specs: Array.isArray(product.specs) && product.specs.length > 0
      ? product.specs.map((spec: any) => ({ label: spec.label || "Specification", value: spec.value || String(spec) }))
      : [
          { label: "Category", value: product.category?.title || "Electronics" },
          { label: "Model SKU", value: product.sku || product.id },
        ],
    shippingNotice: product.shippingNotice || "Free express delivery across India & Official Brand Warranty",
    mainImage: product.images?.[0] || product.mainImage || "/category-smartphone.png",
    images: Array.isArray(product.media) && product.media.length > 0
      ? [...new Set([product.mainImage, ...product.media.map((media: any) => media.url)])]
      : product.images,
  };
}

export default function ProductDetail({
  initialProduct,
  initialRelatedProducts = [],
  productId,
}: ProductDetailProps) {
  const searchParams = useSearchParams();
  const { addItem, wishlistItems, toggleWishlistItem } = useCart();
  const searchProductId = searchParams?.get("id") || searchParams?.get("product");
  const [apiProduct, setApiProduct] = useState<ProductDetailItem | null>(null);

  const product = useMemo(() => {
    if (apiProduct) return apiProduct;
    if (initialProduct) return initialProduct;
    return getProductById(searchProductId);
  }, [apiProduct, initialProduct, searchProductId]);

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

  const productImages = useMemo(
    () => [...new Set([product.mainImage, ...(product.images || [])].filter(Boolean))],
    [product.images, product.mainImage]
  );
  const hasOneProductImage = productImages.length === 1;

  const addProductToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug || product.id,
      name: product.name,
      price: priceToNumber(product.price),
      image: product.mainImage,
      category: product.category,
    });
  };

  const isFavorite = wishlistItems.some((item) => item.id === product.id);

  const toggleProductWishlist = () => {
    toggleWishlistItem({
      id: product.id,
      slug: product.slug || product.id,
      name: product.name,
      price: priceToNumber(product.price),
      oldPrice: product.oldPrice ? priceToNumber(product.oldPrice) : undefined,
      image: product.mainImage,
      category: product.category,
    });
  };
  const [recentDisplayedIds, setRecentDisplayedIds] = useState<string[]>([]);

  return (
    <div className="min-h-dvh bg-white px-4 py-4 text-slate-900 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className={`no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 sm:grid sm:mx-0 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0 ${
            hasOneProductImage ? "sm:grid-cols-1" : "sm:grid-cols-2"
          }`}>
            {productImages.map((image, index) => (
              <div key={image} className="group relative flex aspect-square min-w-[85vw] shrink-0 snap-start items-center justify-center overflow-hidden rounded-[24px] bg-white p-4 sm:min-w-0 sm:p-6">
                <div className="relative h-full w-full">
                  <Image
                    src={image}
                    alt={`${product.name} image ${index + 1}`}
                    fill
                    className="object-contain object-top p-2 transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, 85vw"
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-600">
              {product.category}
            </span>

            <h1 className="mt-2.5 text-lg font-medium leading-snug tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
              {product.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
                {formatINR(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-slate-400 line-through sm:text-xl">
                  {formatINR(product.oldPrice)}
                </span>
              )}
              {product.discount && (
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#0a7ae6] sm:text-sm">
                  {product.discount}
                </span>
              )}
            </div>

            <ProductDescriptionContent description={product.description} />

            {product.features.length > 0 && (
              <div className="mb-8 border-t border-slate-100 pt-6">
                <h3 className="mb-4 text-sm font-medium text-slate-900">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => {
                    const featureText =
                      typeof feature === "string"
                        ? feature
                        : (feature as any)?.featureText ||
                          (feature as any)?.text ||
                          (feature as any)?.title ||
                          (feature as any)?.name ||
                          String(feature);
                    return (
                      <li key={`feature-${idx}`} className="flex items-center gap-3 text-sm text-slate-600 sm:text-[15px]">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-700">
                          <Check className="size-3 stroke-[2.5]" />
                        </span>
                        <span>{featureText}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <p className="mb-6 text-[11px] leading-relaxed text-slate-400">{product.shippingNotice}</p>

            <div className="flex items-center gap-3">
              <Link
                href={`/checkout?product=${encodeURIComponent(product.slug || product.id)}`}
                onClick={addProductToCart}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#0a7ae6] text-sm font-medium text-white shadow-md shadow-blue-500/10 transition-all hover:bg-[#086ac9] active:scale-[0.99] sm:h-14 sm:rounded-full sm:text-base"
              >
                Buy Now
              </Link>

              <button
                type="button"
                onClick={toggleProductWishlist}
                aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-all sm:size-14 ${
                  isFavorite
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                <Heart className={`size-5 stroke-[1.8] ${isFavorite ? "fill-red-500" : ""}`} />
              </button>

              <button
                type="button"
                onClick={addProductToCart}
                aria-label="Add to shopping bag"
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-800 transition-all hover:border-slate-400 hover:bg-slate-50 sm:size-14 sm:rounded-2xl"
              >
                <ShoppingBag className="size-5 stroke-[1.8]" />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
              <div className="flex flex-col items-center p-2 text-center">
                <Truck className="mb-1 size-4 text-slate-400 sm:size-5" />
                <span className="text-[10px] font-medium text-slate-600 sm:text-[11px]">Express Delivery</span>
              </div>
              <div className="flex flex-col items-center p-2 text-center">
                <ShieldCheck className="mb-1 size-4 text-slate-400 sm:size-5" />
                <span className="text-[10px] font-medium text-slate-600 sm:text-[11px]">Brand Warranty</span>
              </div>
              <div className="flex flex-col items-center p-2 text-center">
                <RotateCcw className="mb-1 size-4 text-slate-400 sm:size-5" />
                <span className="text-[10px] font-medium text-slate-600 sm:text-[11px]">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

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
  );
}
