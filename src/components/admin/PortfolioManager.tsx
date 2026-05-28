"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/constants";
import type { PortfolioImage } from "@/lib/types";

export function PortfolioManager() {
  const [category, setCategory] = useState<CategoryId>("small");
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/portfolio?category=${category}`);
    const data = await res.json();
    setImages(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");
    setIsError(false);

    let success = 0;
    let lastError = "";

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      form.append("category", category);
      const res = await fetch("/api/portfolio", { method: "POST", body: form });
      if (res.ok) {
        success++;
      } else {
        const data = await res.json();
        lastError = data.error ?? "Yükleme başarısız.";
      }
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";

    if (success > 0) {
      setIsError(false);
      setMessage(`${success} görsel yüklendi.`);
      loadImages();
    } else {
      setIsError(true);
      setMessage(lastError || "Görsel yüklenemedi.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu görseli silmek istediğine emin misin?")) return;
    const res = await fetch("/api/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) loadImages();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#222] bg-[#121212] p-5">
        <label className="mb-2 block text-sm font-medium text-accent">Kategori</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryId)}
          className="w-full rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-3 outline-none focus:border-accent"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <div className="mt-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            className="hidden"
            id="photo-upload"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <label
            htmlFor="photo-upload"
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 px-6 py-10 text-center transition hover:border-accent hover:bg-accent/10 ${
              uploading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <span className="text-3xl">📷</span>
            <span className="mt-2 font-semibold text-accent">
              {uploading ? "Yükleniyor..." : "Telefondan Fotoğraf Yükle"}
            </span>
            <span className="mt-1 text-xs text-muted">
              Galeriden seç veya kamera ile çek — birden fazla seçebilirsin
            </span>
          </label>
        </div>

        {message && (
          <p
            className={`mt-3 rounded-xl p-3 text-sm ${
              isError ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-[#222] bg-[#121212] p-5">
        <h3 className="mb-4 font-semibold">
          {CATEGORIES.find((c) => c.id === category)?.label} ({images.length})
        </h3>

        {loading ? (
          <p className="text-muted">Yükleniyor...</p>
        ) : images.length === 0 ? (
          <p className="text-muted">Bu kategoride henüz görsel yok.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-[#333]"
              >
                <Image
                  src={img.image_url}
                  alt={img.title ?? "Dövme"}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="absolute right-2 top-2 rounded-lg bg-red-600/90 px-2 py-1 text-xs font-bold opacity-0 transition group-hover:opacity-100"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
