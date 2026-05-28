"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/site-settings";
import { DEFAULT_SETTINGS } from "@/lib/site-settings";

async function uploadImage(file: File, folder: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız");
  return data.url as string;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-accent">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-3 text-sm outline-none focus:border-accent";

export function SiteContentManager() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/settings");
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setIsError(false);
      setMessage("Site ayarları kaydedildi. Ana sayfayı yenile.");
    } else {
      setIsError(true);
      setMessage(data.error ?? "Kaydetme hatası.");
    }
  }

  async function handleUpload(
    file: File,
    folder: string,
    updater: (url: string) => void,
  ) {
    try {
      const url = await uploadImage(file, folder);
      updater(url);
      setIsError(false);
      setMessage("Görsel yüklendi. Kaydet butonuna bas.");
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : "Yükleme hatası");
    }
  }

  if (loading) return <p className="text-muted">Yükleniyor...</p>;

  return (
    <div className="space-y-6">
      {message && (
        <p className={`rounded-xl p-3 text-sm ${isError ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
          {message}
        </p>
      )}

      <section className="rounded-2xl border border-[#222] bg-[#121212] p-5 space-y-4">
        <h3 className="font-semibold text-accent">Tema Renkleri</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ana renk (mor)">
            <input type="color" value={settings.theme.accent} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, accent: e.target.value } })} className="h-12 w-full cursor-pointer rounded-xl" />
          </Field>
          <Field label="Açık vurgu rengi">
            <input type="color" value={settings.theme.accentLight} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, accentLight: e.target.value } })} className="h-12 w-full cursor-pointer rounded-xl" />
          </Field>
          <Field label="Arka plan">
            <input type="color" value={settings.theme.background} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, background: e.target.value } })} className="h-12 w-full cursor-pointer rounded-xl" />
          </Field>
          <Field label="Kart rengi">
            <input type="color" value={settings.theme.card} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, card: e.target.value } })} className="h-12 w-full cursor-pointer rounded-xl" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-[#222] bg-[#121212] p-5 space-y-4">
        <h3 className="font-semibold text-accent">Logo & Marka</h3>
        <Field label="Site adı">
          <input className={inputClass} value={settings.branding.name} onChange={(e) => setSettings({ ...settings, branding: { ...settings.branding, name: e.target.value } })} />
        </Field>
        <Field label="Logo">
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "branding", (url) => setSettings({ ...settings, branding: { ...settings.branding, logoUrl: url } }))} />
          <p className="text-xs text-muted">Mevcut: {settings.branding.logoUrl}</p>
        </Field>
      </section>

      <section className="rounded-2xl border border-[#222] bg-[#121212] p-5 space-y-4">
        <h3 className="font-semibold text-accent">Anasayfa (Hero)</h3>
        <Field label="Hero fotoğrafı">
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "hero", (url) => setSettings({ ...settings, hero: { ...settings.hero, imageUrl: url } }))} />
        </Field>
        <Field label="Üst etiket">
          <input className={inputClass} value={settings.hero.kicker} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, kicker: e.target.value } })} />
        </Field>
        <Field label="Ana başlık">
          <input className={inputClass} value={settings.hero.title} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, title: e.target.value } })} />
        </Field>
        <Field label="Sanatçı adı">
          <input className={inputClass} value={settings.hero.artist} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, artist: e.target.value } })} />
        </Field>
        <Field label="Alt açıklama">
          <textarea className={inputClass} rows={3} value={settings.hero.subtitle} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subtitle: e.target.value } })} />
        </Field>
      </section>

      <section className="rounded-2xl border border-[#222] bg-[#121212] p-5 space-y-4">
        <h3 className="font-semibold text-accent">Ben Kimim?</h3>
        <Field label="Fotoğraf">
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "about", (url) => setSettings({ ...settings, about: { ...settings.about, imageUrl: url } }))} />
        </Field>
        <Field label="1. paragraf">
          <textarea className={inputClass} rows={3} value={settings.about.paragraph1} onChange={(e) => setSettings({ ...settings, about: { ...settings.about, paragraph1: e.target.value } })} />
        </Field>
        <Field label="2. paragraf">
          <textarea className={inputClass} rows={3} value={settings.about.paragraph2} onChange={(e) => setSettings({ ...settings, about: { ...settings.about, paragraph2: e.target.value } })} />
        </Field>
      </section>

      <section className="rounded-2xl border border-[#222] bg-[#121212] p-5 space-y-4">
        <h3 className="font-semibold text-accent">İletişim</h3>
        <Field label="WhatsApp (905xxxxxxxxx)">
          <input className={inputClass} value={settings.contact.whatsapp} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, whatsapp: e.target.value } })} />
        </Field>
        <Field label="Instagram URL">
          <input className={inputClass} value={settings.contact.instagram} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, instagram: e.target.value } })} />
        </Field>
        <Field label="Konum metni">
          <input className={inputClass} value={settings.contact.location} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, location: e.target.value } })} />
        </Field>
        <Field label="Google Maps URL">
          <input className={inputClass} value={settings.contact.maps} onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, maps: e.target.value } })} />
        </Field>
      </section>

      <section className="rounded-2xl border border-[#222] bg-[#121212] p-5 space-y-4">
        <h3 className="font-semibold text-accent">SEO Ayarları</h3>
        <Field label="Sayfa başlığı (title)">
          <input className={inputClass} value={settings.seo.title} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, title: e.target.value } })} />
        </Field>
        <Field label="Meta açıklama">
          <textarea className={inputClass} rows={2} value={settings.seo.description} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, description: e.target.value } })} />
        </Field>
        <Field label="Anahtar kelimeler (virgülle)">
          <input className={inputClass} value={settings.seo.keywords} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, keywords: e.target.value } })} />
        </Field>
        <Field label="Sosyal medya görseli (OG)">
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "seo", (url) => setSettings({ ...settings, seo: { ...settings.seo, ogImage: url } }))} />
          <p className="text-xs text-muted">Mevcut: {settings.seo.ogImage}</p>
        </Field>
      </section>

      <button type="button" onClick={save} disabled={saving} className="w-full rounded-xl bg-accent py-3 font-bold text-[#0b0210] disabled:opacity-50">
        {saving ? "Kaydediliyor..." : "Tüm Site Ayarlarını Kaydet"}
      </button>
    </div>
  );
}
