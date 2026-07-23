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

  const product = useMemo(() => {
    if (initialProduct) return initialProduct;
    return getProductById(productId);
  }, [initialProduct, productId]);

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
                  className="object-contain -rotate-6 scale-110 p-2"
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

          <div className="pt-1 lg:pl-4">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400 sm:text-[13px]">
              {product.category}
            </p>

            <h1 className="mb-3 text-2xl font-medium tracking-tight text-slate-900 leading-[1.1] sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-slate-900 text-slate-900" />
                <span className="font-semibold text-slate-900">({product.rating})</span>
              </div>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">{product.reviewsCount}</span>
            </div>

            <p className="mb-8 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-base">
              {product.description}
            </p>

            <div className="mb-8 flex items-baseline gap-3">
              <span className="text-3xl font-medium tracking-tight text-slate-900 sm:text-5xl">
                {product.price}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-slate-400 line-through">
                  {product.oldPrice}
                </span>
              )}
              {product.discount && (
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0a7ae6] sm:text-sm">
                  {product.discount}
                </span>
              )}
            </div>

            {product.colors.length > 0 && (
              <div className="mb-8 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        aria-label={`Select ${color.name} color`}
                        className={`relative flex size-8 items-center justify-center rounded-full transition-all ${
                          isSelected
                            ? "scale-105 ring-2 ring-slate-900 ring-offset-2"
                            : "opacity-80 hover:scale-105 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: color.bg }}
                      >
                        {isSelected && <span className="size-2 rounded-full bg-white opacity-90" />}
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
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-600 sm:text-[15px]">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-700">
                        <Check className="size-3 stroke-[2.5]" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specs.length > 0 && (
              <div className="mb-8 border-t border-slate-100 pt-6">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Specifications</h3>
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="rounded-xl bg-slate-50 p-2.5">
                      <span className="block text-[11px] uppercase tracking-wider text-slate-400">
                        {spec.label}
                      </span>
                      <span className="font-semibold text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mb-6 text-[11px] leading-relaxed text-slate-400">{product.shippingNotice}</p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#0a7ae6] text-sm font-medium text-white shadow-md shadow-blue-500/10 transition-all hover:bg-[#086ac9] active:scale-[0.99] sm:h-14 sm:rounded-full sm:text-base"
              >
                Buy Now
              </button>

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




