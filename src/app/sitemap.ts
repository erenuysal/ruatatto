import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getSiteSettings } from "@/lib/get-settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();

  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/randevu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: settings.seo.title,
  };
}
