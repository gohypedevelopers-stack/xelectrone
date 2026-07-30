"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { productsCatalog, type ProductDetailItem } from "@/lib/products-data";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { Star, ArrowRight, SlidersHorizontal } from "lucide-react";

// Rating Component
function Rating({ value }: { value: number }) {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <Star
          key={star}
          className={`size-3.5 ${star <= Math.round(value) ? "fill-[#ff7a00] text-[#ff7a00]" : "fill-slate-200 text-slate-200"}`}
        />
      ))}
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterParam = searchParams.get("filter") || "all";

  // List of all products
  const allProducts = Object.values(productsCatalog);

  // Filter products based on search param
  const getFilteredProducts = () => {
    if (filterParam === "new-arrivals") {
      return allProducts.filter(p => ["yuqos-neosound-flex", "techno-projector", "smartphone", "8-dpf"].includes(p.id));
    }
    if (filterParam === "best-sellers") {
      return allProducts.filter(p => ["55-smart-tv", "c9-projector", "iprojector-2-plus", "wireless-headphones"].includes(p.id));
    }
    if (filterParam === "all") {
      return allProducts;
    }
    // Filter by category slug
    const categoryFiltered = allProducts.filter(p => p.categorySlug === filterParam);
    if (categoryFiltered.length > 0) {
      return categoryFiltered;
    }
    return allProducts; // Fallback to all
  };

  const filteredProducts = getFilteredProducts();

  // Related products: get products not currently shown in the filter
  const shownIds = new Set(filteredProducts.map(p => p.id));
  const relatedProducts = allProducts.filter(p => !shownIds.has(p.id)).slice(0, 4);

  const handleFilterChange = (filter: string) => {
    if (filter === "all") {
      router.push("/shop");
    } else {
      router.push(`/shop?filter=${filter}`);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl uppercase italic">
          {filterParam === "new-arrivals" && "New Arrivals"}
          {filterParam === "best-sellers" && "Best Sellers"}
          {filterParam === "all" && "All Products"}
          {filterParam !== "new-arrivals" && filterParam !== "best-sellers" && filterParam !== "all" && (
            filteredProducts[0]?.category || filterParam.replace("-", " ")
          )}
        </h1>
        <p className="mt-3 text-slate-500 text-sm md:text-base max-w-xl">
          Explore our premium setup gear designed for ultimate performance, convenience, and immersive entertainment.
        </p>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group block h-full"
              aria-label={`View ${product.name}`}
            >
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                {/* Image Container */}
                <div className="relative flex h-[140px] items-center justify-center bg-slate-50/60 p-2 sm:h-[250px] sm:p-4 lg:h-[280px]">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105 sm:p-4"
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                  />
                  {product.discount && (
                    <span className="absolute left-2 top-2 rounded-[2px] bg-[#0a7ae6] px-1.5 py-0.5 text-[9px] font-semibold text-white sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col p-2.5 sm:p-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#0a7ae6] sm:text-[11px] sm:tracking-[0.15em]">
                    {product.category}
                  </p>
                  <h3 className="mt-1 truncate text-[12px] font-medium leading-4 text-slate-900 sm:text-[14px]">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Rating value={product.rating} />
                    <span className="text-[10px] text-slate-500 sm:text-[11px]">({product.reviewsCount})</span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto flex items-baseline gap-1.5 pt-2.5 sm:pt-3">
                    <span className="text-[13px] font-medium text-slate-900 sm:text-[15px]">{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-[11px] text-slate-400 line-through sm:text-[13px]">{product.oldPrice}</span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                    <span className="inline-flex h-8 items-center justify-center rounded-md border border-[#0a7ae6] px-1 text-[10px] font-medium text-[#0a7ae6] truncate transition-colors group-hover:bg-[#0a7ae6]/5 sm:h-10 sm:text-[13px]">
                      Add to cart
                    </span>
                    <span className="inline-flex h-8 items-center justify-center rounded-md bg-[#0a7ae6] px-1 text-[10px] font-medium text-white truncate transition-opacity group-hover:opacity-90 sm:h-10 sm:text-[13px]">
                      Buy now
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-slate-400">No products found matching this filter.</p>
        </div>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-slate-100 pt-16">
          <div className="mb-8 flex flex-col items-center text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0a7ae6]">
              Recommendations
            </p>
            <h2 className="mt-1.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              You May Also Like
            </h2>
            <div className="mt-3 h-0.5 w-12 rounded-full bg-[#0a7ae6]" />
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:grid-cols-4">
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group block h-full"
                aria-label={`View ${product.name}`}
              >
                <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                  {/* Image Container */}
                  <div className="relative flex h-[120px] items-center justify-center bg-slate-50/60 p-2 sm:h-[180px] sm:p-4">
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      sizes="220px"
                    />
                    {product.discount && (
                      <span className="absolute left-2 top-2 rounded-[2px] bg-[#0a7ae6] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                        {product.discount}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col p-2.5 sm:p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#0a7ae6]">
                      {product.category}
                    </p>
                    <h3 className="mt-1 truncate text-[12px] font-medium leading-4 text-slate-900 sm:text-[14px]">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Rating value={product.rating} />
                      <span className="text-[10px] text-slate-500">({product.reviewsCount})</span>
                    </div>

                    {/* Price */}
                    <div className="mt-auto flex items-baseline gap-1.5 pt-2.5">
                      <span className="text-[14px] font-bold text-slate-900 sm:text-[16px]">{product.price}</span>
                      {product.oldPrice && (
                        <span className="text-[11px] text-slate-400 line-through">{product.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-slate-400">Loading products...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </main>
  );
}
