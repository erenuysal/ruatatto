"use client";

import { useCallback, useEffect, useState } from "react";
import { TIME_SLOTS, WEEKDAYS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import type { BlockedDate, BlockedSlot, WorkingHours } from "@/lib/types";

export function AvailabilityManager() {
  const [hours, setHours] = useState<WorkingHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockTimeDate, setNewBlockTimeDate] = useState("");
  const [newBlockTime, setNewBlockTime] = useState<string>(TIME_SLOTS[0]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const [h, d, s] = await Promise.all([
      supabase.from("working_hours").select("*").order("day_of_week"),
      supabase.from("blocked_dates").select("*").order("blocked_date"),
      supabase.from("blocked_slots").select("*").order("slot_date"),
    ]);
    setHours(h.data ?? []);
    setBlockedDates(d.data ?? []);
    setBlockedSlots(s.data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveHours() {
    const res = await fetch("/api/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "working_hours", hours }),
    });
    if (res.ok) setMessage("Çalışma saatleri kaydedildi.");
    else setMessage("Kaydetme hatası.");
  }

  function updateHour(day: number, field: keyof WorkingHours, value: string | boolean) {
    setHours((prev) => {
      const existing = prev.find((h) => h.day_of_week === day);
      if (existing) {
        return prev.map((h) =>
          h.day_of_week === day ? { ...h, [field]: value } : h,
        );
      }
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          day_of_week: day,
          start_time: "10:00",
          end_time: "19:00",
          is_active: true,
          [field]: value,
        } as WorkingHours,
      ];
    });
  }

  async function addBlockedDate() {
    if (!newBlockDate) return;
    await fetch("/api/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "blocked_date", date: newBlockDate }),
    });
    setNewBlockDate("");
    load();
  }

  async function addBlockedSlot() {
    if (!newBlockTimeDate) return;
    await fetch("/api/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "blocked_slot",
        date: newBlockTimeDate,
        time: newBlockTime,
      }),
    });
    setNewBlockTimeDate("");
    load();
  }

  async function removeBlockedDate(id: string) {
    await fetch("/api/availability", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "blocked_date", id }),
    });
    load();
  }

  async function removeBlockedSlot(id: string) {
    await fetch("/api/availability", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "blocked_slot", id }),
    });
    load();
  }

  return (
    <div className="space-y-5">
      {message && (
        <p className="rounded-xl bg-green-500/10 p-3 text-sm text-green-400">{message}</p>
      )}

      <div className="rounded-2xl border border-[#222] bg-[#121212] p-5">
        <h3 className="mb-4 font-semibold text-accent">Haftalık Çalışma Saatleri</h3>
        <div className="space-y-3">
          {WEEKDAYS.map((day) => {
            const h = hours.find((x) => x.day_of_week === day.value);
            return (
              <div
                key={day.value}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-[#333] p-3"
              >
                <label className="flex w-28 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={h?.is_active ?? false}
                    onChange={(e) =>
                      updateHour(day.value, "is_active", e.target.checked)
                    }
                  />
                  {day.label}
                </label>
                <input
                  type="time"
                  value={h?.start_time?.slice(0, 5) ?? "10:00"}
                  disabled={!h?.is_active}
                  onChange={(e) => updateHour(day.value, "start_time", e.target.value)}
                  className="rounded-lg border border-[#333] bg-[#0a0a0a] px-2 py-1 text-sm disabled:opacity-40"
                />
                <span className="text-muted">—</span>
                <input
                  type="time"
                  value={h?.end_time?.slice(0, 5) ?? "19:00"}
                  disabled={!h?.is_active}
                  onChange={(e) => updateHour(day.value, "end_time", e.target.value)}
                  className="rounded-lg border border-[#333] bg-[#0a0a0a] px-2 py-1 text-sm disabled:opacity-40"
                />
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={saveHours}
          className="mt-4 rounded-xl bg-accent px-5 py-2.5 font-bold text-[#0b0210]"
        >
          Saatleri Kaydet
        </button>
      </div>

      <div className="rounded-2xl border border-[#222] bg-[#121212] p-5">
        <h3 className="mb-4 font-semibold text-accent">Kapalı Günler</h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={newBlockDate}
            onChange={(e) => setNewBlockDate(e.target.value)}
            className="rounded-xl border border-[#333] bg-[#0a0a0a] px-3 py-2"
          />
          <button
            type="button"
            onClick={addBlockedDate}
            className="rounded-xl bg-accent/20 px-4 py-2 text-sm text-accent"
          >
            Günü Kapat
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {blockedDates.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between rounded-lg border border-[#333] px-3 py-2 text-sm"
            >
              <span>{d.blocked_date}</span>
              <button
                type="button"
                onClick={() => removeBlockedDate(d.id)}
                className="text-red-400"
              >
                Kaldır
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-[#222] bg-[#121212] p-5">
        <h3 className="mb-4 font-semibold text-accent">Kapalı Saatler</h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={newBlockTimeDate}
            onChange={(e) => setNewBlockTimeDate(e.target.value)}
            className="rounded-xl border border-[#333] bg-[#0a0a0a] px-3 py-2"
          />
          <select
            value={newBlockTime}
            onChange={(e) => setNewBlockTime(e.target.value)}
            className="rounded-xl border border-[#333] bg-[#0a0a0a] px-3 py-2"
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addBlockedSlot}
            className="rounded-xl bg-accent/20 px-4 py-2 text-sm text-accent"
          >
            Saati Kapat
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {blockedSlots.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-lg border border-[#333] px-3 py-2 text-sm"
            >
              <span>
                {s.slot_date} — {s.slot_time.slice(0, 5)}
              </span>
              <button
                type="button"
                onClick={() => removeBlockedSlot(s.id)}
                className="text-red-400"
              >
                Kaldır
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
