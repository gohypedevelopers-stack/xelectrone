import Image from "next/image";
import Link from "next/link";

export type StorefrontCategory = {
  id: string;
  title: string;
  slug: string;
  image: string;
};

export default function CategorySection({ categories }: { categories: StorefrontCategory[] }) {
  if (categories.length === 0) return null;

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
            const cacheBustSrc = `${category.image}${category.image.includes("?") ? "&" : "?"}v=category`;

            return (
              <Link
                key={category.id}
                href={`/shop?filter=${encodeURIComponent(category.slug)}`}
                className="group flex min-w-[130px] shrink-0 sm:min-w-[150px] lg:min-w-0 lg:flex-1 flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-2 sm:p-3 h-[145px] sm:h-[170px] lg:h-[190px] text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#0a7ae6] hover:shadow-md"
              >
                {/* CLEAN PRODUCT HERO IMAGE (FILLING CARD FULLY) */}
                <div className="relative flex h-full w-full items-center justify-center p-1 sm:p-1.5">
                  <div className="relative h-full w-full transition-transform duration-300 ease-out group-hover:scale-105">
                    <Image
                      src={cacheBustSrc}
                      alt={category.title}
                      fill
                      unoptimized
                      className="mix-blend-multiply object-contain filter drop-shadow-[0_4px_10px_rgba(15,23,42,0.08)]"
                      sizes="200px"
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
