"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Star,
  Check,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import {
  getProductById,
  getSimilarProducts,
  ProductDetailItem,
} from "@/lib/products-data";
import SimilarProductsSection from "@/components/product/similar-products-section";

interface ProductDetailProps {
  initialProduct?: ProductDetailItem;
}

export default function ProductDetail({ initialProduct }: ProductDetailProps) {
  const searchParams = useSearchParams();
  const productId = searchParams?.get("id") || searchParams?.get("product");
  const [apiProduct, setApiProduct] = useState<ProductDetailItem | null>(null);

  const product = useMemo(() => {
    if (apiProduct) return apiProduct;
    if (initialProduct) return initialProduct;
    return getProductById(productId);
  }, [apiProduct, initialProduct, productId]);

  useEffect(() => {
    const targetId = productId || initialProduct?.id || initialProduct?.slug;
    if (!targetId) return;

    fetch(`/api/products/${encodeURIComponent(targetId)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const p = json.data;
          setApiProduct({
            id: p.id,
            slug: p.slug || p.id,
            name: p.name,
            category: p.category?.title || p.category || "Electronics",
            categorySlug: p.category?.slug || "general",
            price: typeof p.price === "number" ? `₹${p.price.toLocaleString("en-IN")}` : String(p.price),
            oldPrice: p.compareAtPrice ? `₹${p.compareAtPrice.toLocaleString("en-IN")}` : undefined,
            discount: p.compareAtPrice && p.price ? `${Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)}% off` : undefined,
            rating: p.rating || 4.8,
            reviewsCount: `${p.reviewCount || 120} Reviews`,
            description: p.description || "High quality XElectron product with premium build and official brand warranty.",
            colors: p.colors || [{ name: "Standard", bg: "#1e1e24" }],
            features: Array.isArray(p.features) && p.features.length > 0
              ? p.features.map((f: any) => typeof f === "string" ? f : f.featureText || f.text || f.title || f.name || String(f))
              : ["Official Brand Warranty", "High Performance Build", "Fast Express Shipping"],
            specs: p.specs || [
              { label: "Category", value: p.category?.title || "Electronics" },
              { label: "Model SKU", value: p.sku || p.id },
            ],
            shippingNotice: "Free express delivery across India & Official Brand Warranty",
            mainImage: p.images?.[0] || p.mainImage || "/category-smartphone.png",
          });
        }
      })
      .catch(() => {
        // Silent fallback to static catalog
      });
  }, [productId, initialProduct]);

  const similarProducts = useMemo(() => getSimilarProducts(product.id, 4), [product.id]);

  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || "Standard"
  );
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (product.colors[0]) {
      setSelectedColor(product.colors[0].name);
    }
  }, [product]);

  return (
    <div className="min-h-dvh bg-white px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[1440px]">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs text-slate-400 sm:text-sm"
        >
          <Link href="/" className="transition-colors hover:text-slate-700">
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="transition-colors hover:text-slate-700">
            Products
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 sm:grid sm:mx-0 sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0">
            <div className="group relative flex aspect-[4/5] min-w-[62vw] shrink-0 snap-start items-center justify-center overflow-hidden rounded-[24px] bg-white p-4 sm:min-w-0 sm:p-6">
              <div className="relative h-full w-full">
                <Image
                  src={product.mainImage}
                  alt={`${product.name} main view`}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, 62vw"
                  priority
                />
              </div>
            </div>

            <div className="relative flex aspect-[4/5] min-w-[62vw] shrink-0 snap-start items-center justify-center overflow-hidden rounded-[24px] bg-white p-4 sm:min-w-0 sm:p-6">
              <div className="relative h-full w-full opacity-95">
                <Image
                  src={product.mainImage}
                  alt={`${product.name} detail view`}
                  fill
                  className="object-contain scale-125 translate-y-4 p-2"
                  sizes="(min-width: 1024px) 25vw, 62vw"
                />
              </div>
            </div>

            <div className="relative flex aspect-[4/5] min-w-[62vw] shrink-0 snap-start items-center justify-center overflow-hidden rounded-[24px] bg-white p-4 sm:min-w-0 sm:p-6">
              <div className="relative h-full w-full">
                <Image
                  src={product.mainImage}
                  alt={`${product.name} top profile`}
                  fill
                  className="object-contain scale-150 -translate-y-6 rotate-12 p-2"
                  sizes="(min-width: 1024px) 25vw, 62vw"
                />
              </div>
            </div>

            <div className="relative flex aspect-[4/5] min-w-[62vw] shrink-0 snap-start items-center justify-center overflow-hidden rounded-[24px] bg-white p-4 sm:min-w-0 sm:p-6">
              <div className="relative h-full w-full">
                <Image
                  src={product.mainImage}
                  alt={`${product.name} side profile`}
                  fill
                  className="object-contain scale-125 translate-x-4 p-2"
                  sizes="(min-width: 1024px) 25vw, 62vw"
                />
              </div>
            </div>

            <div className="relative flex aspect-[4/5] min-w-[62vw] shrink-0 snap-start items-center justify-center overflow-hidden rounded-[24px] bg-white p-4 sm:min-w-0 sm:p-6">
              <div className="relative h-full w-full">
                <Image
                  src={product.mainImage}
                  alt={`${product.name} top down`}
                  fill
                  className="object-contain rotate-90 scale-105 p-2"
                  sizes="(min-width: 1024px) 25vw, 62vw"
                />
              </div>
            </div>

            <div className="relative flex aspect-[4/5] min-w-[62vw] shrink-0 snap-start items-center justify-center overflow-hidden rounded-[24px] bg-white p-4 sm:min-w-0 sm:p-6">
              <div className="relative h-full w-full">
                <Image
                  src={product.mainImage}
                  alt={`${product.name} texture closeup`}
                  fill
                  className="object-contain scale-175 translate-x-4 translate-y-4 p-2"
                  sizes="(min-width: 1024px) 25vw, 62vw"
                />
              </div>
            </div>
          </div>

          <div>
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
              {product.category}
            </span>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="size-4 fill-current" />
                <span className="text-sm font-bold text-slate-900">{product.rating}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-500 sm:text-sm">
                {product.reviewsCount}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {product.price}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-slate-400 line-through sm:text-xl">
                  {product.oldPrice}
                </span>
              )}
              {product.discount && (
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#0a7ae6] sm:text-sm">
                  {product.discount}
                </span>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {product.description}
            </p>

            {product.colors.length > 0 && (
              <div className="mt-6">
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Select Finish
                </span>
                <div className="mt-3 flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`group relative flex size-8 items-center justify-center rounded-full transition-transform hover:scale-110 ${
                          isSelected ? "ring-2 ring-[#0a7ae6] ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: color.bg }}
                        aria-label={`Select ${color.name} color`}
                      >
                        {isSelected && (
                          <Check className="size-4 text-white drop-shadow-md" />
                        )}
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-medium text-slate-800 sm:text-sm">
                    {selectedColor}
                  </span>
                </div>
              </div>
            )}

            {product.features.length > 0 && (
              <div className="mb-8 border-t border-slate-100 pt-6">
                <h3 className="mb-4 text-sm font-semibold text-slate-900">Key Features</h3>
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

            {product.specs.length > 0 && (
              <div className="mb-8 border-t border-slate-100 pt-6">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Specifications</h3>
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  {product.specs.map((spec, idx) => {
                    const labelText = typeof spec === "object" && spec ? spec.label : `Spec ${idx + 1}`;
                    const valueText = typeof spec === "object" && spec ? spec.value : String(spec);
                    return (
                      <div key={labelText ? `${labelText}-${idx}` : `spec-${idx}`} className="rounded-xl bg-slate-50 p-2.5">
                        <span className="block text-[11px] uppercase tracking-wider text-slate-400">
                          {labelText}
                        </span>
                        <span className="font-semibold text-slate-900">{valueText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="mb-6 text-[11px] leading-relaxed text-slate-400">{product.shippingNotice}</p>

            <div className="flex items-center gap-3">
              <Link
                href={`/checkout?product=${encodeURIComponent(product.slug || product.id)}`}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#0a7ae6] text-sm font-medium text-white shadow-md shadow-blue-500/10 transition-all hover:bg-[#086ac9] active:scale-[0.99] sm:h-14 sm:rounded-full sm:text-base"
              >
                Buy Now
              </Link>

              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                aria-label="Add to wishlist"
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

        <SimilarProductsSection products={similarProducts} />
      </div>
    </div>
  );
}




