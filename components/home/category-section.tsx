"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categories as defaultCategories } from "@/components/home/content";
import { resolveCategoryImage, getCategoryFallbackImage } from "@/lib/shared/category-utils";

export type StorefrontCategory = {
  id: string;
  title: string;
  slug: string;
  image: string;
};

function CategoryCardImage({ category }: { category: StorefrontCategory }) {
  const fallback = getCategoryFallbackImage(category.slug, category.title);
  const resolved = resolveCategoryImage(category.image, category.slug, category.title);
  const [imgSrc, setImgSrc] = useState(resolved);

  return (
    <Image
      src={imgSrc}
      alt={category.title}
      fill
      unoptimized
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
      className="mix-blend-multiply object-contain filter drop-shadow-[0_4px_10px_rgba(15,23,42,0.08)]"
      sizes="200px"
    />
  );
}

export default function CategorySection({ categories }: { categories?: StorefrontCategory[] }) {
  const displayCategories =
    categories && categories.length > 0
      ? categories
      : defaultCategories.map((cat) => ({
          id: cat.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: cat.title,
          slug: cat.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          image: resolveCategoryImage(cat.src, cat.title, cat.title),
        }));

  if (!displayCategories || displayCategories.length === 0) return null;

  return (
    <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* SECTION HEADER */}
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0a7ae6]">
            Categories
          </p>
          <div className="inline-block relative">
            <h2 className="mt-1.5 text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Shop by Category
            </h2>
            <div className="mt-2 h-0.5 w-12 rounded-full bg-[#0a7ae6] ml-auto" />
          </div>
        </div>

        {/* SINGLE ROW CATEGORIES STRIP WITH NO BACKGROUND ARTIFACTS */}
        <div className="no-scrollbar flex w-full items-center justify-start gap-3.5 overflow-x-auto pt-4 pb-6 sm:gap-4 lg:justify-between">
          {displayCategories.map((category) => {
            return (
              <Link
                key={category.id}
                href={`/shop?filter=${encodeURIComponent(category.slug)}`}
                className="group flex min-w-[130px] shrink-0 sm:min-w-[150px] lg:min-w-0 lg:flex-1 flex-col items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-3.5 h-[160px] sm:h-[185px] lg:h-[205px] text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#0a7ae6] hover:shadow-md"
              >
                {/* CLEAN PRODUCT HERO IMAGE */}
                <div className="relative h-[105px] sm:h-[125px] lg:h-[140px] w-full flex items-center justify-center p-1">
                  <div className="relative h-full w-full transition-transform duration-300 ease-out group-hover:scale-105">
                    <CategoryCardImage category={category} />
                  </div>
                </div>

                {/* CATEGORY TITLE */}
                <h3 className="mt-1 text-xs sm:text-sm font-semibold text-slate-800 transition-colors duration-200 group-hover:text-[#0a7ae6] line-clamp-1 leading-tight w-full px-1">
                  {category.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
