"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PortfolioImage } from "@/lib/types";

interface GalleryProps {
  category: string;
  title: string;
  id?: string;
  fallbackPrefix?: string;
  fallbackCount?: number;
}

export function Gallery({
  category,
  title,
  id,
  fallbackPrefix,
  fallbackCount = 20,
}: GalleryProps) {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [fallbacks, setFallbacks] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/portfolio?category=${category}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
          setLoading(false);
          return;
        }
      } catch {
        /* fallback below */
      }

      if (fallbackPrefix) {
        const found: string[] = [];
        for (let i = 1; i <= fallbackCount; i++) {
          const url = `${fallbackPrefix}${i}.jpg`;
          try {
            const head = await fetch(url, { method: "HEAD" });
            if (head.ok) found.push(url);
            else if (found.length > 0) break;
          } catch {
            if (found.length > 0) break;
          }
        }
        setFallbacks(found);
      }
      setLoading(false);
    }
    load();
  }, [category, fallbackPrefix, fallbackCount]);

  const displayUrls =
    images.length > 0
      ? images.map((img) => ({ src: img.image_url, alt: img.title ?? title }))
      : fallbacks.map((src) => ({ src, alt: title }));

  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-6 text-2xl font-bold text-accent md:text-3xl">{title}</h2>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-[#121212]" />
          ))}
        </div>
      ) : displayUrls.length === 0 ? (
        <p className="text-muted">Henüz içerik eklenmedi.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {displayUrls.map((item, i) => (
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
