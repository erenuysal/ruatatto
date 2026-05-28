import type { WorkingHours } from "./types";
import { WEEKDAYS } from "./constants";

/** Veritabanı boşsa veya okunamazsa kullanılacak varsayılan saatler */
export const DEFAULT_WORKING_HOURS: WorkingHours[] = WEEKDAYS.map((day) => ({
  id: `default-${day.value}`,
  day_of_week: day.value,
  start_time: "10:00:00",
  end_time: day.value === 6 ? "17:00:00" : "19:00:00",
  is_active: day.value !== 0,
}));

export function normalizeWorkingHours(hours: WorkingHours[] | null | undefined) {
  if (!hours?.length) return DEFAULT_WORKING_HOURS;
  return hours;
}

export function formatTimeForDb(time: string) {
  if (time.length === 5) return `${time}:00`;
  return time;
}

export function prepareHoursForUpsert(
  hours: WorkingHours[],
): Omit<WorkingHours, "id">[] {
  return hours.map(({ day_of_week, start_time, end_time, is_active }) => ({
    day_of_week,
    start_time: formatTimeForDb(start_time),
    end_time: formatTimeForDb(end_time),
    is_active,
  }));
}
