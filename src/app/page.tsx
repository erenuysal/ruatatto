import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { SITE } from "@/lib/constants";
import { GallerySection } from "@/components/GallerySection";

function GallerySkeleton({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-6 text-2xl font-bold text-accent md:text-3xl">{title}</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-[#121212]" />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <section id="anasayfa" className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-[1.2fr_0.8fr] md:py-16">
        <div className="animate-fade-up overflow-hidden rounded-2xl border border-[#222] bg-[#121212]">
          <div className="relative aspect-[4/5] md:aspect-auto md:h-[480px]">
            <Image
              src="/images/hero.jpg"
              alt="Öne çıkan dövme çalışması"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
        </div>

        <div className="animate-fade-up flex flex-col justify-center [animation-delay:100ms]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-light">
            {SITE.name}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            Sanat, teninle buluştuğunda{" "}
            <span className="ml-1 inline-block rounded-full bg-accent/15 px-3 py-1 text-lg text-accent md:text-xl">
              {SITE.artist}
            </span>
          </h1>
          <p className="mt-4 text-lg text-[#d4d4d4]">
            Fine line ve black&grey dövmeler. Çalışmalarımı keşfet, online randevu al veya
            WhatsApp üzerinden iletişime geç.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/randevu"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-[#0b0210] transition hover:brightness-110"
            >
              Randevu Al →
            </Link>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=Merhaba%20RuaTattoo%2C%20randevu%20almak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-accent px-5 py-3 font-semibold text-accent transition hover:bg-accent/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section id="hakkimda" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-6 text-2xl font-bold text-accent md:text-3xl">Ben kimim?</h2>
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#222] bg-[#121212] md:aspect-auto md:h-full md:min-h-[320px]">
            <Image
              src="/images/bio.jpg"
              alt={SITE.artist}
              fill
              className="object-cover"
              sizes="280px"
            />
          </div>
          <div className="rounded-2xl border border-[#222] bg-[#121212] p-6 text-[#d4d4d4] leading-relaxed">
            <p>
              Merhaba, ben <strong className="text-white">Melike</strong>. Görsel sanatlar
              mezunuyum ve uzun yıllardır dövme tasarımı yapıyorum. Dövme benim için yalnızca
              bir görsel değil; aynı zamanda bir anlam, duygu ve hikâye.
            </p>
            <p className="mt-4">
              Her müşterimle, onların hayatına dokunan bir anıyı ya da özel bir simgeyi deriye
              işlemek benim için ayrı bir yolculuk. Randevu sürecinden tasarıma, uygulamadan
              iyileşme aşamasına kadar her adımda özenli ve titiz çalışırım.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<GallerySkeleton title="Eserlerim" />}>
        <GallerySection id="eserlerim" category="done" title="Eserlerim" />
      </Suspense>
      <Suspense fallback={<GallerySkeleton title="Small Tattoos" />}>
        <GallerySection id="small" category="small" title="Small Tattoos" />
      </Suspense>
      <Suspense fallback={<GallerySkeleton title="Medium Tattoos" />}>
        <GallerySection id="medium" category="medium" title="Medium Tattoos" />
      </Suspense>
      <Suspense fallback={<GallerySkeleton title="Big Tattoos" />}>
        <GallerySection id="big" category="big" title="Big Tattoos" />
      </Suspense>

      <section id="iletisim" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-6 text-2xl font-bold text-accent md:text-3xl">İletişim</h2>
        <div className="rounded-2xl border border-[#222] bg-[#121212] p-6">
          <p className="text-[#d4d4d4]">
            Randevu, fiyat ve tasarım için bana ulaşabilirsin. Online randevu sisteminden
            müsait saatleri görebilir veya doğrudan WhatsApp üzerinden yazabilirsin.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/randevu"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-[#0b0210]"
            >
              Online Randevu
            </Link>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=Merhaba%20RuaTattoo%2C%20randevu%20almak%20istiyorum.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-accent px-5 py-3 text-accent hover:bg-accent/10"
            >
              WhatsApp
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-accent px-5 py-3 text-accent hover:bg-accent/10"
            >
              Instagram
            </a>
            <a
              href={SITE.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-accent px-5 py-3 text-accent hover:bg-accent/10"
            >
              Konum — {SITE.location}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
