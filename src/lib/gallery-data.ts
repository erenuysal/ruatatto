import type { CategoryId } from "./constants";

/** Statik galeri görselleri — public/images altındaki dosyalar */
export const STATIC_GALLERY: Record<CategoryId, string[]> = {
  done: [
    "/images/Dones/done1.jpg",
    "/images/Dones/done2.jpg",
    "/images/Dones/done3.jpg",
    "/images/Dones/done4.jpg",
    "/images/Dones/done5.jpg",
    "/images/Dones/done6.jpg",
    "/images/Dones/done7.jpg",
    "/images/Dones/done8.jpg",
    "/images/Dones/done9.jpg",
    "/images/Dones/done10.jpg",
    "/images/Dones/done11.jpg",
    "/images/Dones/done12.jpg",
    "/images/Dones/done13.jpg",
  ],
  small: [
    "/images/Minimals/min1.jpg",
    "/images/Minimals/min2.jpg",
    "/images/Minimals/min3.jpg",
    "/images/Minimals/min4.jpg",
    "/images/Minimals/min5.jpg",
  ],
  medium: [
    "/images/Mediums/med1.jpg",
    "/images/Mediums/med2.jpg",
    "/images/Mediums/med3.jpg",
    "/images/Mediums/med4.jpg",
    "/images/Mediums/med5.jpg",
  ],
  big: [
    "/images/Bigs/big1.jpg",
    "/images/Bigs/big2.jpg",
    "/images/Bigs/big3.jpg",
    "/images/Bigs/big4.jpg",
    "/images/Bigs/big5.jpg",
  ],
};

export interface GalleryItem {
  src: string;
  alt: string;
}

export function mergeGalleryItems(
  category: CategoryId,
  title: string,
  remote: { image_url: string; title: string | null }[],
): GalleryItem[] {
  if (remote.length > 0) {
    return remote.map((img) => ({
      src: img.image_url,
      alt: img.title ?? title,
    }));
  }
  return STATIC_GALLERY[category].map((src) => ({ src, alt: title }));
}
