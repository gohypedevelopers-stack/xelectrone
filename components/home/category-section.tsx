import Image from "next/image";
import Link from "next/link";
import { categories } from "@/components/home/content";

export default function CategorySection() {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* SECTION HEADER */}
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0a7ae6]">
            Categories
          </p>
          <h2 className="mt-1.5 text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Shop by Category
          </h2>
          <div className="mt-3 h-0.5 w-12 rounded-full bg-[#0a7ae6]" />
        </div>

        {/* SINGLE ROW CATEGORIES STRIP WITH NO BACKGROUND ARTIFACTS & CACHE BUSTING */}
        <div className="no-scrollbar flex w-full items-center justify-start gap-3.5 overflow-x-auto pt-4 pb-6 sm:gap-4 lg:justify-between">
          {categories.map((category) => {
            let filterSlug = category.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            if (filterSlug === "led-tvs") {
              filterSlug = "smart-tvs";
            }
            const cacheBustSrc = `${category.src}?v=no-cache-4`;

            return (
              <Link
                key={category.title}
                href={`/shop?filter=${filterSlug}`}
                className="group flex min-w-[125px] shrink-0 sm:min-w-[150px] lg:min-w-0 lg:flex-1 flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-3.5 py-5 sm:px-4 sm:py-6 min-h-[150px] sm:min-h-[175px] lg:min-h-[190px] text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#0a7ae6] hover:shadow-sm"
              >
                {/* CLEAN PRODUCT HERO IMAGE (NO CIRCLE OR BOX BACKGROUND) */}
                <div className="relative flex h-26 w-26 items-center justify-center sm:h-30 sm:w-30 lg:h-32 lg:w-32">
                  <div className="relative h-22 w-22 transition-transform duration-300 ease-out group-hover:scale-108 sm:h-26 sm:w-26 lg:h-28 lg:w-28">
                    <Image
                      src={cacheBustSrc}
                      alt={category.alt}
                      fill
                      unoptimized
                      className="mix-blend-multiply object-contain filter drop-shadow-[0_4px_10px_rgba(15,23,42,0.08)]"
                      sizes="160px"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
