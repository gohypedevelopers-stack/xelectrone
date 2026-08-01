"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { products } from "@/components/home/content";

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

export default function ProductShowcaseSection() {
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="bg-white px-4 py-6 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0a7ae6]">
              Featured Products
            </p>
            <h2 className="mt-1 text-[22px] font-normal tracking-[-0.03em] text-slate-900 sm:text-[28px]">
              Products you can buy now
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group block h-full"
              aria-label={`View ${product.title}`}
            >
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <div className="flex flex-1 flex-col p-2.5 sm:p-4 lg:p-5">
                  <div className="relative flex h-[140px] items-center justify-center overflow-hidden rounded-md bg-slate-50/60 p-2 sm:h-[235px] sm:p-4 lg:h-[270px]">
                    <button
                      type="button"
                      aria-label={`Add ${product.title} to wishlist`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-2.5 right-2.5 z-10 flex size-8 items-center justify-center rounded-full bg-white/90 shadow-sm text-slate-400 backdrop-blur-xs transition-all duration-200 hover:scale-110 hover:bg-white hover:text-red-500 active:scale-95"
                    >
                      <Heart
                        className={`size-4 transition-colors ${
                          wishlist[product.id]
                            ? "fill-red-500 text-red-500"
                            : "text-slate-400 hover:text-red-500"
                        }`}
                      />
                    </button>
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03] sm:p-3"
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 50vw"
                    />
                  </div>

                  <div className="mt-2.5 flex flex-1 flex-col sm:mt-4">
                    <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400 sm:text-[11px] sm:tracking-[0.18em]">
                      XElectron
                    </p>
                    <h3 className="mt-1 truncate text-[12px] font-medium leading-4 text-slate-900 sm:text-[16px] sm:leading-5">
                      {product.title}
                    </h3>

                    <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2">
                      <Rating value={product.rating} />
                      <span className="text-[10px] text-slate-500 sm:text-[11px]">({product.reviews})</span>
                    </div>

                    <p className="mt-1.5 hidden line-clamp-2 text-[11px] leading-4 text-slate-600 sm:block sm:text-[12px]">
                      {product.subtitle}
                    </p>

                    <div className="mt-auto flex items-baseline gap-1.5 pt-2.5 sm:pt-3">
                      <span className="text-[13px] font-medium text-slate-900 sm:text-[15px]">
                        {product.price}
                      </span>
                      {product.oldPrice ? (
                        <span className="text-[11px] text-slate-400 line-through sm:text-[12px]">
                          {product.oldPrice}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:mt-4">
                      <span className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-[#0a7ae6] px-1 text-[10px] font-medium text-[#0a7ae6] truncate transition-colors hover:bg-[#0a7ae6] hover:text-white sm:h-10 sm:text-[12px]">
                        Add to cart
                      </span>
                      <span className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md bg-[#0a7ae6] px-1 text-[10px] font-medium text-white truncate transition-opacity hover:opacity-90 sm:h-10 sm:text-[12px]">
                        Buy
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}



