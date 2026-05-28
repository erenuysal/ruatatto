"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryItem } from "@/lib/gallery-data";

interface GalleryGridProps {
  title: string;
  id?: string;
  items: GalleryItem[];
}

export function GalleryGrid({ title, id, items }: GalleryGridProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-6 text-2xl font-bold text-accent md:text-3xl">{title}</h2>

      {items.length === 0 ? (
        <p className="text-muted">Henüz içerik eklenmedi.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => (
            <button
              key={item.src + i}
              type="button"
              className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-[#222] bg-[#121212]"
              onClick={() => setLightbox(item.src)}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-xl border border-[#555] px-3 py-2 text-sm"
            onClick={() => setLightbox(null)}
          >
            Kapat ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Büyük görsel"
            className="max-h-[86vh] max-w-[92vw] rounded-xl border border-[#333]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
