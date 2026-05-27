"use client";

import { useState } from "react";
import { PortfolioManager } from "./PortfolioManager";
import { AppointmentsManager } from "./AppointmentsManager";
import { AvailabilityManager } from "./AvailabilityManager";

type Tab = "portfolio" | "appointments" | "availability";

interface Props {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>("portfolio");

  const tabs: { id: Tab; label: string }[] = [
    { id: "portfolio", label: "Görseller" },
    { id: "appointments", label: "Randevular" },
    { id: "availability", label: "Müsaitlik" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-accent">Yönetim Paneli</h1>
          <p className="text-sm text-muted">Telefondan görsel yükle, randevuları yönet.</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-[#333] px-4 py-2 text-sm hover:border-red-500/50 hover:text-red-400"
        >
          Çıkış
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto rounded-xl border border-[#222] bg-[#121212] p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id
                ? "bg-accent text-[#0b0210]"
                : "text-muted hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "portfolio" && <PortfolioManager />}
      {tab === "appointments" && <AppointmentsManager />}
      {tab === "availability" && <AvailabilityManager />}
    </div>
  );
}
