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

  return (
    <div className="space-y-4 rounded-2xl border border-[#222] bg-[#121212] p-5 text-sm">
      <h3 className="font-semibold text-accent">Supabase Bağlantı Durumu</h3>

      <div className="space-y-2 text-muted">
        <p>URL: {data.config.url}</p>
        <p>Anon Key: {data.config.anonKey}</p>
        <p>Secret Key: {data.config.serviceKey}</p>
      </div>

      <StatusRow label="Genel okuma (site)" ok={data.publicTest.ok} error={data.publicTest.error} />
      <StatusRow label="Admin yazma (panel)" ok={data.adminTest.ok} error={data.adminTest.error} />

      {!data.adminTest.ok && (
        <div className="rounded-xl bg-yellow-500/10 p-4 text-yellow-300">
          <p className="font-medium">Admin işlemleri çalışmıyorsa:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            <li>Netlify → Environment variables → SUPABASE_SERVICE_ROLE_KEY kontrol et</li>
            <li>Supabase → SQL Editor → fix-policies.sql çalıştır</li>
            <li>Supabase projesi aktif mi? (paused değil)</li>
            <li>Key&apos;lerde boşluk/satır sonu olmamalı</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function StatusRow({ label, ok, error }: { label: string; ok: boolean; error?: string }) {
  return (
    <div className={`rounded-xl p-3 ${ok ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
      <p className="font-medium">{label}: {ok ? "OK" : "HATA"}</p>
      {error && <p className="mt-1 text-xs">{error}</p>}
    </div>
  );
}
