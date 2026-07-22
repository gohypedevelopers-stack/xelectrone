import Image from "next/image";
import Link from "next/link";
import { categories } from "@/components/home/content";

export default function CategorySection() {
  return (
    <section className="bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1400px]">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0 sm:pr-0 lg:grid-cols-5 lg:gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="flex min-w-[34vw] snap-start flex-col items-center text-center sm:min-w-0"
            >
              <div className="flex size-[92px] items-center justify-center rounded-full bg-[#f1f3f5] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:size-[132px] lg:size-[146px]">
                <Image
                  src={category.src}
                  alt={category.alt}
                  width={120}
                  height={120}
                  className="h-[60px] w-[60px] object-contain sm:h-[86px] sm:w-[86px] lg:h-[88px] lg:w-[88px]"
                />
              </div>
              <h3 className="mt-3 text-[10px] font-medium text-slate-800 sm:mt-5 sm:text-[12px] lg:text-[13px]">
                {category.title}
              </h3>
              <Link
                href="/"
                className="mt-1 text-[8px] font-medium text-[#4f86c6] transition-opacity hover:opacity-70 sm:text-[10px]"
              >
                View Collection
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
