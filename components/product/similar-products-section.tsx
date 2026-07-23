import Image from "next/image";
import Link from "next/link";
import type { SimilarProductCard } from "@/lib/products-data";

interface SimilarProductsSectionProps {
  products: SimilarProductCard[];
}

export default function SimilarProductsSection({ products }: SimilarProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-10 border-t border-slate-100 bg-white pt-8 sm:mt-12 sm:pt-10 lg:mt-16 lg:pt-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-[clamp(1.6rem,3.8vw,4.25rem)] font-medium uppercase leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-[clamp(2rem,3.8vw,4.25rem)]">
            Get Similar Product
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 px-4 sm:grid-cols-2 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:gap-4 lg:px-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group flex min-h-[320px] flex-col rounded-[12px] border border-slate-100 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:min-h-[360px]"
            >
              <p className="text-[11px] leading-none text-slate-400">{product.category}</p>
              <h3 className="mt-1 text-[16px] font-medium tracking-[-0.04em] text-slate-950 sm:text-[20px]">
                {product.name}
              </h3>

              <div className="relative mt-3 flex flex-1 items-center justify-center overflow-hidden rounded-[10px] bg-white py-3 sm:py-4">
                <Image
                  src={product.image}
                  alt={product.alt}
                  width={360}
                  height={360}
                  className="h-[180px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-[240px]"
                />
              </div>

              <div className="mt-4 flex items-end justify-between gap-3">
                <span className="text-[16px] font-medium tracking-[-0.04em] text-slate-950 sm:text-[20px]">
                  {product.price}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-900 transition-colors group-hover:border-[#0a7ae6] group-hover:bg-[#0a7ae6] group-hover:text-white sm:px-4 sm:py-2 sm:text-[12px]">
                  Buy
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

