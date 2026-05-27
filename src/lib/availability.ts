import {
  addDays,
  format,
  getDay,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
} from "date-fns";
import { tr } from "date-fns/locale";
import { TIME_SLOTS } from "./constants";
import type {
  Appointment,
  AvailableSlot,
  BlockedDate,
  BlockedSlot,
  WorkingHours,
} from "./types";

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function isWithinWorkingHours(
  slotTime: string,
  hours: WorkingHours | undefined,
) {
  if (!hours || !hours.is_active) return false;
  const slot = timeToMinutes(slotTime);
  const start = timeToMinutes(hours.start_time.slice(0, 5));
  const end = timeToMinutes(hours.end_time.slice(0, 5));
  return slot >= start && slot < end;
}

export function computeAvailableSlots(
  fromDate: Date,
  days: number,
  workingHours: WorkingHours[],
  blockedDates: BlockedDate[],
  blockedSlots: BlockedSlot[],
  appointments: Appointment[],
): AvailableSlot[] {
  const today = startOfDay(new Date());
  const slots: AvailableSlot[] = [];

  const hoursByDay = new Map<number, WorkingHours>();
  for (const h of workingHours) {
    hoursByDay.set(h.day_of_week, h);
  }

  const blockedDateSet = new Set(blockedDates.map((d) => d.blocked_date));
  const blockedSlotSet = new Set(
    blockedSlots.map((s) => `${s.slot_date}|${s.slot_time.slice(0, 5)}`),
  );
  const bookedSet = new Set(
    appointments
      .filter((a) => a.status !== "cancelled")
      .map((a) => `${a.appointment_date}|${a.appointment_time.slice(0, 5)}`),
  );

  for (let i = 0; i < days; i++) {
    const date = addDays(fromDate, i);
    const dateStr = format(date, "yyyy-MM-dd");

    if (isBefore(date, today)) continue;
    if (blockedDateSet.has(dateStr)) continue;

    const dayHours = hoursByDay.get(getDay(date));
    if (!dayHours?.is_active) continue;

    for (const time of TIME_SLOTS) {
      if (!isWithinWorkingHours(time, dayHours)) continue;

      const key = `${dateStr}|${time}`;
      const available =
        !blockedSlotSet.has(key) && !bookedSet.has(key);

      slots.push({ date: dateStr, time, available });
    }
  }

  return slots;
}

export function groupSlotsByDate(slots: AvailableSlot[]) {
  const map = new Map<string, AvailableSlot[]>();
  for (const slot of slots) {
    const existing = map.get(slot.date) ?? [];
    existing.push(slot);
    map.set(slot.date, existing);
  }
  return map;
}

export function formatDateTr(dateStr: string, pattern = "d MMMM yyyy, EEEE") {
  return format(parseISO(dateStr), pattern, { locale: tr });
}

export function formatDateShort(dateStr: string) {
  return format(parseISO(dateStr), "d MMM", { locale: tr });
}

export function isDateSelectable(dateStr: string, slots: AvailableSlot[]) {
  return slots.some((s) => s.date === dateStr && s.available);
}

export function getAvailableTimesForDate(
  dateStr: string,
  slots: AvailableSlot[],
) {
  return slots.filter((s) => s.date === dateStr && s.available);
}

export { isSameDay };
