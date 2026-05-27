import type { CategoryId } from "./constants";

export interface PortfolioImage {
  id: string;
  category: CategoryId;
  image_url: string;
  title: string | null;
  sort_order: number;
  created_at: string;
}

export interface WorkingHours {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
}

export interface BlockedSlot {
  id: string;
  slot_date: string;
  slot_time: string;
  reason: string | null;
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  message: string | null;
  status: AppointmentStatus;
  created_at: string;
}

export interface AvailableSlot {
  date: string;
  time: string;
  available: boolean;
}
