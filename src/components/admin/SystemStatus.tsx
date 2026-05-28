"use client";

import { useEffect, useState } from "react";

interface HealthData {
  config: { url: string; anonKey: string; serviceKey: string; ready: boolean; adminReady: boolean };
  publicTest: { ok: boolean; error?: string };
  adminTest: { ok: boolean; error?: string };
}

export function SystemStatus() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Kontrol ediliyor...</p>;
  if (!data) return <p className="text-red-400">Durum alınamadı.</p>;

  const isPaused = [data.publicTest.error, data.adminTest.error].some(
    (e) => e?.includes("DURAKLATILMIŞ") || e?.includes("fetch failed"),
  );

  return (
    <div className="space-y-4">
      {isPaused && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-red-300">
          <p className="text-lg font-bold">Supabase projesi çalışmıyor</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
            <li>
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">
                supabase.com/dashboard
              </a>
              {" "}→ Rua-Tattoo projesini aç
            </li>
            <li>
              Proje duraklatılmışsa <strong>Restore project</strong> butonuna bas (1-2 dk bekle)
            </li>
            <li>Project Settings → API → URL&apos;nin Netlify ile aynı olduğunu doğrula:</li>
          </ol>
          <code className="mt-2 block rounded-lg bg-black/40 p-3 text-xs text-white">
            {data.config.url}
          </code>
        </div>
      )}

      <div className="rounded-2xl border border-[#222] bg-[#121212] p-5 text-sm">
        <h3 className="mb-4 font-semibold text-accent">Supabase Bağlantı Durumu</h3>

        <div className="mb-4 space-y-1 rounded-xl bg-black/30 p-3 font-mono text-xs text-muted">
          <p>URL: {data.config.url}</p>
          <p>Anon: {data.config.anonKey}</p>
          <p>Secret: {data.config.serviceKey}</p>
        </div>

        <StatusRow label="Genel okuma (site)" ok={data.publicTest.ok} error={data.publicTest.error} />
        <StatusRow label="Admin yazma (panel)" ok={data.adminTest.ok} error={data.adminTest.error} />

        {!data.adminTest.ok && !isPaused && (
          <div className="mt-4 rounded-xl bg-yellow-500/10 p-4 text-yellow-300 text-xs">
            <p className="font-medium mb-2">Kontrol listesi:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Netlify → SUPABASE_SERVICE_ROLE_KEY = Secret key (tam kopyala)</li>
              <li>Netlify → NEXT_PUBLIC_SUPABASE_ANON_KEY = Publishable key</li>
              <li>SQL Editor → fix-policies.sql çalıştır</li>
              <li>Storage → portfolio bucket public olmalı</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusRow({ label, ok, error }: { label: string; ok: boolean; error?: string }) {
  return (
    <div className={`mb-2 rounded-xl p-3 ${ok ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
      <p className="font-medium">{label}: {ok ? "OK ✓" : "HATA ✗"}</p>
      {error && <p className="mt-1 text-xs leading-relaxed">{error}</p>}
    </div>
  );
}
