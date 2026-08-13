"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type CreatorVideoType = {
  id: string;
  title?: string | null;
  thumbnailUrl: string;
  videoUrl?: string | null;
  product?: {
    id: string;
    name: string;
    slug: string;
    mainImage: string;
  } | null;
};

const defaultVideos: CreatorVideoType[] = [
  { id: "1", title: "Earbuds Unboxing", thumbnailUrl: "/creator-earbuds.png" },
  { id: "2", title: "Night Drive Dashcam Test", thumbnailUrl: "/creator-dashcam.png" },
  { id: "3", title: "Smartwatch Daily Life Test", thumbnailUrl: "/creator-smartwatch.png" },
  { id: "4", title: "Cozy Cinema Projector Night", thumbnailUrl: "/creator-projector.png" },
];

export default function CreatorVideosSection() {
  const [videoList, setVideoList] = useState<CreatorVideoType[]>(defaultVideos);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/creator-videos");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setVideoList(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch creator videos:", err);
      }
    }
    fetchVideos();
  }, []);

  const videos = videoList.length > 0 ? videoList : defaultVideos;

  return (
    <section className="bg-white py-12 md:py-20 text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight mb-8">
          Approved by Creators
        </h2>
        
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-2 lg:grid lg:grid-cols-4 lg:gap-6">
          {videos.map((vid) => {
            const targetUrl = vid.product ? `/product/${vid.product.slug}` : "/shop";

            return (
              <Link
                key={vid.id}
                href={targetUrl}
                className="relative group aspect-[9/16] min-w-[72vw] snap-start overflow-hidden rounded-[10px] cursor-pointer bg-slate-900 sm:min-w-[48vw] lg:min-w-0"
              >
                <Image
                  src={vid.thumbnailUrl}
                  alt={vid.title || "Approved by Creators"}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 72vw, (max-width: 1024px) 48vw, 25vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/80 transition-colors duration-500" />
                
                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/25 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white/40 md:h-16 md:w-16">
                    <svg className="ml-1 h-4 w-4 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Title & Product Tag */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  {vid.title && (
                    <p className="text-xs sm:text-sm font-semibold leading-snug drop-shadow-md line-clamp-2">
                      {vid.title}
                    </p>
                  )}

                  {vid.product && (
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-white border border-white/30">
                      <span>Shop {vid.product.name}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
