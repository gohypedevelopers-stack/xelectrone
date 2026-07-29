import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/components/home/content";

export default function CategorySection() {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pr-2 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:pb-0 sm:pr-0 lg:grid-cols-5 lg:gap-8">
          {categories.map((category) => {
            const hrefId = category.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <Link
                key={category.title}
                href={`/product?id=${hrefId}`}
                className="group flex min-w-[42vw] snap-start flex-col items-center text-center sm:min-w-0"
              >
                {/* CIRCLE BACKGROUND & POPPING PRODUCT HERO IMAGE */}
                <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40 lg:h-44 lg:w-44">
                  {/* Background Soft Circle */}
                  <div className="absolute h-28 w-28 rounded-full bg-[#f1f4f8] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-50/80 group-hover:shadow-md sm:h-32 sm:w-32 lg:h-36 lg:w-36" />

                  {/* Foreground Product Image */}
                  <div className="relative z-10 h-22 w-22 transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-108 sm:h-26 sm:w-26 lg:h-30 lg:w-30">
                    <Image
                      src={category.src}
                      alt={category.alt}
                      fill
                      className="object-contain filter drop-shadow-[0_8px_16px_rgba(15,23,42,0.12)]"
                      sizes="(min-width: 1024px) 140px, 110px"
                    />
                  </div>
                </div>

                {/* CATEGORY TITLE & LINK */}
                <h3 className="mt-3 text-sm font-semibold text-slate-800 transition-colors duration-200 group-hover:text-[#0a7ae6] sm:mt-4 sm:text-base lg:text-[17px]">
                  {category.title}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#0a7ae6] transition-all duration-200 group-hover:gap-1.5">
                  View Collection <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
