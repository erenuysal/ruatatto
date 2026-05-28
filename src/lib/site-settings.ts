import { SITE } from "./constants";

export interface ThemeSettings {
  accent: string;
  accentLight: string;
  background: string;
  card: string;
}

export interface BrandingSettings {
  name: string;
  logoUrl: string;
}

export interface HeroSettings {
  imageUrl: string;
  kicker: string;
  title: string;
  artist: string;
  subtitle: string;
}

export interface AboutSettings {
  imageUrl: string;
  paragraph1: string;
  paragraph2: string;
}

export interface ContactSettings {
  whatsapp: string;
  instagram: string;
  maps: string;
  location: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export interface SiteSettings {
  theme: ThemeSettings;
  branding: BrandingSettings;
  hero: HeroSettings;
  about: AboutSettings;
  contact: ContactSettings;
  seo: SeoSettings;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  theme: {
    accent: "#8b5cf6",
    accentLight: "#a78bfa",
    background: "#0a0a0a",
    card: "#121212",
  },
  branding: {
    name: SITE.name,
    logoUrl: "/images/logo.png",
  },
  hero: {
    imageUrl: "/images/hero.jpg",
    kicker: SITE.name,
    title: "Sanat, teninle buluştuğunda",
    artist: SITE.artist,
    subtitle:
      "Fine line ve black&grey dövmeler. Çalışmalarımı keşfet, online randevu al veya WhatsApp üzerinden iletişime geç.",
  },
  about: {
    imageUrl: "/images/bio.jpg",
    paragraph1:
      "Merhaba, ben Melike. Görsel sanatlar mezunuyum ve uzun yıllardır dövme tasarımı yapıyorum. Dövme benim için yalnızca bir görsel değil; aynı zamanda bir anlam, duygu ve hikâye.",
    paragraph2:
      "Her müşterimle, onların hayatına dokunan bir anıyı ya da özel bir simgeyi deriye işlemek benim için ayrı bir yolculuk. Randevu sürecinden tasarıma, uygulamadan iyileşme aşamasına kadar her adımda özenli ve titiz çalışırım.",
  },
  contact: {
    whatsapp: SITE.whatsapp,
    instagram: SITE.instagram,
    maps: SITE.maps,
    location: SITE.location,
  },
  seo: {
    title: SITE.title,
    description: SITE.description,
    keywords:
      "dövme, tattoo, fine line, black grey, Kdz Ereğli, Melike Kipritçi, RuaTattoo, dövme randevu",
    ogImage: "/images/og-cover.jpg",
  },
};

export function mergeSettings(partial: Partial<SiteSettings> | null): SiteSettings {
  if (!partial) return DEFAULT_SETTINGS;
  return {
    theme: { ...DEFAULT_SETTINGS.theme, ...partial.theme },
    branding: { ...DEFAULT_SETTINGS.branding, ...partial.branding },
    hero: { ...DEFAULT_SETTINGS.hero, ...partial.hero },
    about: { ...DEFAULT_SETTINGS.about, ...partial.about },
    contact: { ...DEFAULT_SETTINGS.contact, ...partial.contact },
    seo: { ...DEFAULT_SETTINGS.seo, ...partial.seo },
  };
}
