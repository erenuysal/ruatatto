"use client";

import { addDays, format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  formatDateShort,
  formatDateTr,
  getAvailableTimesForDate,
  groupSlotsByDate,
  isDateSelectable,
} from "@/lib/availability";
import type { AvailableSlot } from "@/lib/types";
import { SITE } from "@/lib/constants";

export function BookingClient() {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/availability?days=45")
      .then((r) => r.json())
      .then((data) => {
        setSlots(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => groupSlotsByDate(slots), [slots]);

  const dates = useMemo(() => {
    const list: string[] = [];
    for (let i = 0; i < 45; i++) {
      const d = format(addDays(new Date(), i), "yyyy-MM-dd");
      if (isDateSelectable(d, slots)) list.push(d);
    }
    return list;
  }, [slots]);

  const timesForDate = selectedDate
    ? getAvailableTimesForDate(selectedDate, slots)
    : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          name,
          phone,
          email,
          message,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({ ok: false, text: data.error ?? "Randevu oluşturulamadı." });
      } else {
        setResult({
          ok: true,
          text: "Randevu talebin alındı! En kısa sürede seninle iletişime geçeceğim.",
        });
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setSelectedDate(null);
        setSelectedTime(null);
      }
    } catch {
      setResult({ ok: false, text: "Bağlantı hatası. Lütfen tekrar dene." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-light">
          Online Randevu
        </p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Müsait Gün ve Saat Seç</h1>
        <p className="mt-3 text-muted">
          Yeşil işaretli günlerde boş saatler var. Dolu saatler otomatik gizlenir.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#222] bg-[#121212] p-8 text-center text-muted">
          Müsaitlik bilgisi yükleniyor...
        </div>
      ) : dates.length === 0 ? (
        <div className="rounded-2xl border border-[#222] bg-[#121212] p-8 text-center">
          <p className="text-muted">Şu an müsait randevu saati bulunmuyor.</p>
          <a
            href={`https://wa.me/${SITE.whatsapp}?text=Merhaba%20RuaTattoo%2C%20randevu%20almak%20istiyorum.`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-accent px-5 py-3 font-bold text-[#0b0210]"
          >
            WhatsApp ile Ulaş
          </a>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-[#222] bg-[#121212] p-5">
            <h2 className="mb-4 font-semibold text-accent">1. Gün Seç</h2>
            <div className="grid max-h-[420px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {dates.map((date) => {
                const availableCount =
                  grouped.get(date)?.filter((s) => s.available).length ?? 0;
                const selected = selectedDate === date;
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                    className={`rounded-xl border p-3 text-left text-sm transition ${
                      selected
                        ? "border-accent bg-accent/15 text-accent"
                        : "border-[#333] hover:border-accent/50"
                    }`}
                  >
                    <div className="font-semibold">{formatDateShort(date)}</div>
                    <div className="mt-1 text-xs text-muted">{availableCount} boş saat</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#222] bg-[#121212] p-5">
              <h2 className="mb-4 font-semibold text-accent">2. Saat Seç</h2>
              {!selectedDate ? (
                <p className="text-sm text-muted">Önce bir gün seç.</p>
              ) : timesForDate.length === 0 ? (
                <p className="text-sm text-muted">Bu gün için boş saat kalmadı.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {timesForDate.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedTime(slot.time)}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                        selectedTime === slot.time
                          ? "border-accent bg-accent text-[#0b0210]"
                          : "border-[#333] hover:border-accent/50"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
              {selectedDate && (
                <p className="mt-3 text-xs text-muted">
                  {formatDateTr(selectedDate)}
                </p>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#222] bg-[#121212] p-5"
            >
              <h2 className="mb-4 font-semibold text-accent">3. Bilgilerini Gir</h2>
              <div className="space-y-3">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ad Soyad *"
                  className="w-full rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-3 outline-none focus:border-accent"
                />
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Telefon *"
                  type="tel"
                  className="w-full rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-3 outline-none focus:border-accent"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta (opsiyonel)"
                  type="email"
                  className="w-full rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-3 outline-none focus:border-accent"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Dövme fikrin, boyut, referans..."
                  rows={3}
                  className="w-full rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-3 outline-none focus:border-accent"
                />
              </div>

              {result && (
                <p
                  className={`mt-4 rounded-xl p-3 text-sm ${
                    result.ok
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {result.text}
                </p>
              )}

              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || submitting}
                className="mt-4 w-full rounded-xl bg-accent py-3 font-bold text-[#0b0210] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Gönderiliyor..." : "Randevu Talebi Gönder"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
