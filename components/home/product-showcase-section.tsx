import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
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
  return (
    <section className="bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0a7ae6]">
              Featured Products
            </p>
            <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-slate-900 sm:text-[28px]">
              Products you can buy now
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.title}
              className="overflow-hidden rounded-none border border-black/10 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex h-full flex-col p-3.5">
                <div className="relative flex h-[175px] items-center justify-center rounded-none bg-[#fbfbfc] p-3">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-contain p-3"
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>

                <div className="mt-3 flex flex-1 flex-col">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    XElectron
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-[15px] font-medium leading-5 text-slate-900">
                    {product.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <Rating value={product.rating} />
                    <span className="text-[11px] text-slate-500">({product.reviews})</span>
                  </div>

                  <p className="mt-2 text-[12px] leading-5 text-slate-600">
                    {product.subtitle}
                  </p>

                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-[16px] font-semibold text-slate-900">
                      {product.price}
                    </span>
                    {product.oldPrice ? (
                      <span className="pb-0.5 text-[12px] text-slate-400 line-through">
                        {product.oldPrice}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href="/"
                      className="inline-flex h-9 items-center justify-center rounded-[4px] border border-[#0a7ae6] text-[12px] font-medium text-[#0a7ae6] transition-colors hover:bg-[#0a7ae6] hover:text-white"
                    >
                      Add to cart
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex h-9 items-center justify-center rounded-[4px] bg-[#0a7ae6] text-[12px] font-medium text-white transition-opacity hover:opacity-90"
                    >
                      Buy
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
