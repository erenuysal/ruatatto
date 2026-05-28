import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeVars } from "@/components/ThemeVars";
import { JsonLd } from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/get-settings";
import { SITE } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const ogImage = settings.seo.ogImage.startsWith("http")
    ? settings.seo.ogImage
    : `${SITE.url}${settings.seo.ogImage}`;

  return {
    title: settings.seo.title,
    description: settings.seo.description,
    keywords: settings.seo.keywords.split(",").map((k) => k.trim()),
    metadataBase: new URL(SITE.url),
    alternates: { canonical: "/" },
    openGraph: {
      title: settings.seo.title,
      description: settings.seo.description,
      url: SITE.url,
      siteName: settings.branding.name,
      locale: "tr_TR",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: settings.branding.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo.title,
      description: settings.seo.description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <>
      <ThemeVars settings={settings} />
      <JsonLd settings={settings} />
      <Header branding={settings.branding} />
      <main>{children}</main>
      <Footer contact={settings.contact} branding={settings.branding} />
    </>
  );
}
