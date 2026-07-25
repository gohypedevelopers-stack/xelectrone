"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

type XelectronProduct = {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  rating: number;
  reviews: number;
  href: string;
};

const xelectronProducts: XelectronProduct[] = [
  {
    id: "55gtv",
    title: "XElectron 55 Inch 4K Ultra HD Smart Google TV",
    category: "LED TVs",
    image: "https://www.xelectron.com/wp-content/uploads/2025/11/55-inch-TV-600x600.jpg",
    alt: "XElectron 55 Inch 4K Smart Google TV",
    price: "₹29,999",
    oldPrice: "₹49,999",
    discount: "40% off",
    rating: 4.5,
    reviews: 128,
    href: "/product/55-smart-tv",
  },
  {
    id: "c9-plus",
    title: "XElectron C9 Plus 1080P Smart Projector | 12600 Lumens",
    category: "Projectors",
    image: "https://www.xelectron.com/wp-content/uploads/2025/04/GraphicIMages-600x600.jpg",
    alt: "XElectron C9 Plus Smart Projector",
    price: "₹10,990",
    oldPrice: "₹19,999",
    discount: "45% off",
    rating: 4.3,
    reviews: 256,
    href: "/product/c9-projector",
  },
  {
    id: "techno-projector",
    title: "XElectron Techno Android 14 Smart HD Projector",
    category: "Projectors",
    image: "https://www.xelectron.com/wp-content/uploads/2025/02/6106a0clBHL._SL1254_-600x600.jpg",
    alt: "XElectron Techno Android 14 Smart Projector",
    price: "₹6,990",
    oldPrice: "₹21,999",
    discount: "68% off",
    rating: 4.1,
    reviews: 189,
    href: "/product/techno-projector",
  },
  {
    id: "iprojector-2-plus",
    title: "XElectron iProjector 2 Plus | Native 1080P 4K | 20000 Lumens",
    category: "Projectors",
    image: "https://www.xelectron.com/wp-content/uploads/2024/08/61yEHU9kqL._SL1500_-600x600.jpg",
    alt: "XElectron iProjector 2 Plus Smart Projector",
    price: "₹17,990",
    oldPrice: "₹39,999",
    discount: "55% off",
    rating: 4.6,
    reviews: 312,
    href: "/product/iprojector-2-plus",
  },
  {
    id: "24stv",
    title: "XElectron 24 Inch HD Ready LED TV | A+ Grade Panel",
    category: "LED TVs",
    image: "https://www.xelectron.com/wp-content/uploads/2023/04/Untitled-1-600x600.jpg",
    alt: "XElectron 24 Inch HD Ready LED TV",
    price: "₹6,499",
    oldPrice: "₹12,999",
    discount: "50% off",
    rating: 4.2,
    reviews: 94,
    href: "/product/24stv",
  },
  {
    id: "15-dpf",
    title: "XElectron 15.6 Inch Digital Photo Frame | WiFi | Touch",
    category: "Digital Photo Frames",
    image: "https://www.xelectron.com/wp-content/uploads/2025/06/15.6-inch-DPF-600x600.jpg",
    alt: "XElectron 15.6 Inch Digital Photo Frame",
    price: "₹8,499",
    oldPrice: "₹14,999",
    discount: "43% off",
    rating: 4.4,
    reviews: 76,
    href: "/product/15-dpf",
  },
  {
    id: "32-tv",
    title: "XElectron 32 Inch HD Ready Smart LED TV",
    category: "LED TVs",
    image: "https://www.xelectron.com/wp-content/uploads/2023/04/XElectron-32-inch-TVWDa-79IuL._SL1500_-600x600.jpg",
    alt: "XElectron 32 Inch HD Ready Smart LED TV",
    price: "₹8,999",
    oldPrice: "₹18,999",
    discount: "53% off",
    rating: 4.3,
    reviews: 157,
    href: "/product/32-tv",
  },
  {
    id: "8-dpf",
    title: "XElectron 8 Inch IPS Digital Photo Frame | White",
    category: "Digital Photo Frames",
    image: "https://www.xelectron.com/wp-content/uploads/2023/01/8-inch-DPF-W-600x600.jpg",
    alt: "XElectron 8 Inch Digital Photo Frame White",
    price: "₹2,999",
    oldPrice: "₹5,999",
    discount: "50% off",
    rating: 4.0,
    reviews: 203,
    href: "/product/8-dpf",
  },
];

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

export default function NewProductCardsSection() {
  return (
    <section className="bg-white px-4 pb-6 pt-12 sm:px-6 sm:pb-8 sm:pt-14 lg:px-8 lg:pb-8 lg:pt-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0a7ae6]">
              Our Products
            </p>
            <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-slate-900 sm:text-[28px]">
              Explore our complete range
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {xelectronProducts.map((product) => (
            <Link key={product.id} href={product.href} className="group block h-full" aria-label={`View ${product.title}`}>
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                <div className="relative flex h-[140px] items-center justify-center bg-slate-50/60 p-2 sm:h-[200px] sm:p-4 lg:h-[220px]">
                  <Image
                    src={product.image}
                    alt={product.alt}
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

                <div className="flex flex-1 flex-col p-2.5 sm:p-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#0a7ae6] sm:text-[11px] sm:tracking-[0.15em]">
                    {product.category}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-[12px] font-medium leading-4 text-slate-900 sm:text-[14px] sm:leading-5">
                    {product.title}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Rating value={product.rating} />
                    <span className="text-[10px] text-slate-500 sm:text-[11px]">({product.reviews})</span>
                  </div>

                  <div className="mt-auto flex items-baseline gap-1.5 pt-2.5 sm:pt-3">
                    <span className="text-[14px] font-bold text-slate-900 sm:text-[18px]">{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-[11px] text-slate-400 line-through sm:text-[13px]">{product.oldPrice}</span>
                    )}
                  </div>

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
      </div>
    </section>
  );
}
