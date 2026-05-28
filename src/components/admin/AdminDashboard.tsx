"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const SiteContentManager = dynamic(
  () => import("./SiteContentManager").then((m) => ({ default: m.SiteContentManager })),
  { loading: () => <p className="text-muted">Yükleniyor...</p> },
);
const PortfolioManager = dynamic(
  () => import("./PortfolioManager").then((m) => ({ default: m.PortfolioManager })),
  { loading: () => <p className="text-muted">Yükleniyor...</p> },
);
const AppointmentsManager = dynamic(
  () => import("./AppointmentsManager").then((m) => ({ default: m.AppointmentsManager })),
  { loading: () => <p className="text-muted">Yükleniyor...</p> },
);
const AvailabilityManager = dynamic(
  () => import("./AvailabilityManager").then((m) => ({ default: m.AvailabilityManager })),
  { loading: () => <p className="text-muted">Yükleniyor...</p> },
);
const SystemStatus = dynamic(
  () => import("./SystemStatus").then((m) => ({ default: m.SystemStatus })),
  { loading: () => <p className="text-muted">Yükleniyor...</p> },
);

type Tab = "site" | "portfolio" | "appointments" | "availability" | "system";

interface Props {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>("site");

  const tabs: { id: Tab; label: string }[] = [
    { id: "site", label: "Site & Tema" },
    { id: "portfolio", label: "Görseller" },
    { id: "appointments", label: "Randevular" },
    { id: "availability", label: "Müsaitlik" },
    { id: "system", label: "Sistem" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-accent">Yönetim Paneli</h1>
          <p className="text-sm text-muted">Site içeriği, görseller, randevular.</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-[#333] px-4 py-2 text-sm hover:border-red-500/50 hover:text-red-400"
        >
          Çıkış
        </button>
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl border border-[#222] bg-[#121212] p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
              tab === t.id ? "bg-accent text-[#0b0210]" : "text-muted hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "site" && <SiteContentManager />}
      {tab === "portfolio" && <PortfolioManager />}
      {tab === "appointments" && <AppointmentsManager />}
      {tab === "availability" && <AvailabilityManager />}
      {tab === "system" && <SystemStatus />}
    </div>
  );
}
