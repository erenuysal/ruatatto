import type { SiteSettings } from "@/lib/site-settings";
import { SITE } from "@/lib/constants";

export function JsonLd({ settings }: { settings: SiteSettings }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: settings.branding.name,
    description: settings.seo.description,
    url: SITE.url,
    image: settings.seo.ogImage.startsWith("http")
      ? settings.seo.ogImage
      : `${SITE.url}${settings.seo.ogImage}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.contact.location,
      addressCountry: "TR",
    },
    sameAs: [settings.contact.instagram],
    founder: {
      "@type": "Person",
      name: settings.hero.artist,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
