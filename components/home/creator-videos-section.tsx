"use client";

import Image from "next/image";

const videos = [
  { id: 1, image: "/creator-earbuds.png" },
  { id: 2, image: "/creator-dashcam.png" },
  { id: 3, image: "/creator-smartwatch.png" },
  { id: 4, image: "/creator-projector.png" },
];

export default function CreatorVideosSection() {
  return (
    <section className="bg-white py-12 md:py-20 text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight mb-8">
          Approved by Creators
        </h2>
        
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-2 lg:grid lg:grid-cols-4 lg:gap-6">
          {videos.map((vid) => (
            <div 
              key={vid.id} 
              className="relative group aspect-[9/16] min-w-[72vw] snap-start overflow-hidden rounded-[10px] cursor-pointer bg-slate-200 sm:min-w-[48vw] lg:min-w-0"
            >
              <Image
                src={vid.image}
                alt="Creator Video"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 72vw, (max-width: 1024px) 48vw, 25vw"
              />
              
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/25 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white/40 md:h-16 md:w-16">
                  <svg className="ml-1 h-4 w-4 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

