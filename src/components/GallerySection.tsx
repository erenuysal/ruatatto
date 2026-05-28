import { GalleryGrid } from "@/components/GalleryGrid";
import type { CategoryId } from "@/lib/constants";
import { mergeGalleryItems } from "@/lib/gallery-data";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

interface GallerySectionProps {
  category: CategoryId;
  title: string;
  id?: string;
}

export async function GallerySection({ category, title, id }: GallerySectionProps) {
  let remote: { image_url: string; title: string | null }[] = [];

  if (isSupabaseConfigured()) {
    try {
      const { data } = await getSupabase()
        .from("portfolio_images")
        .select("image_url, title")
        .eq("category", category)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      remote = data ?? [];
    } catch {
      /* statik galeriye düş */
    }
  }

  const items = mergeGalleryItems(category, title, remote);

  return <GalleryGrid title={title} id={id} items={items} />;
}
