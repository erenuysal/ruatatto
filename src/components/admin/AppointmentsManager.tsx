"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDateTr } from "@/lib/availability";
import type { Appointment, AppointmentStatus } from "@/lib/types";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Bekliyor",
  confirmed: "Onaylandı",
  cancelled: "İptal",
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  confirmed: "bg-green-500/15 text-green-400",
  cancelled: "bg-red-500/15 text-red-400",
};

export function AppointmentsManager() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const url =
      filter === "all" ? "/api/appointments" : `/api/appointments?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setAppointments(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: AppointmentStatus) {
    await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Randevuyu silmek istediğine emin misin?")) return;
    await fetch("/api/appointments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "Tümü" },
          { id: "pending", label: "Bekleyen" },
          { id: "confirmed", label: "Onaylı" },
          { id: "cancelled", label: "İptal" },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-sm ${
              filter === f.id
                ? "bg-accent text-[#0b0210]"
                : "border border-[#333] text-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Yükleniyor...</p>
      ) : appointments.length === 0 ? (
        <p className="rounded-2xl border border-[#222] bg-[#121212] p-6 text-muted">
          Randevu bulunamadı.
        </p>
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-[#222] bg-[#121212] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{a.customer_name}</p>
                  <a href={`tel:${a.customer_phone}`} className="text-sm text-accent">
                    {a.customer_phone}
                  </a>
                  {a.customer_email && (
                    <p className="text-sm text-muted">{a.customer_email}</p>
                  )}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[a.status]}`}
                >
                  {STATUS_LABELS[a.status]}
                </span>
              </div>

              <p className="mt-3 text-sm">
                <span className="text-accent">📅</span>{" "}
                {formatDateTr(a.appointment_date)} —{" "}
                {a.appointment_time.slice(0, 5)}
              </p>

              {a.message && (
                <p className="mt-2 rounded-xl bg-[#0a0a0a] p-3 text-sm text-[#d4d4d4]">
                  {a.message}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {a.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(a.id, "confirmed")}
                    className="rounded-lg bg-green-600/20 px-3 py-1.5 text-sm text-green-400"
                  >
                    Onayla
                  </button>
                )}
                {a.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(a.id, "cancelled")}
                    className="rounded-lg bg-yellow-600/20 px-3 py-1.5 text-sm text-yellow-400"
                  >
                    İptal Et
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="rounded-lg bg-red-600/20 px-3 py-1.5 text-sm text-red-400"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
