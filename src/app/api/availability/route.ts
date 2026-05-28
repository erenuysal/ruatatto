import { addDays, format } from "date-fns";
import { NextResponse } from "next/server";
import { computeAvailableSlots } from "@/lib/availability";
import { isAdminAuthenticated } from "@/lib/auth";
import { createServiceClient, getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  normalizeWorkingHours,
  prepareHoursForUpsert,
} from "@/lib/working-hours";
import type { WorkingHours } from "@/lib/types";

async function fetchAvailabilityData(from: string, days: number) {
  if (!isSupabaseConfigured()) {
    return {
      hours: normalizeWorkingHours([]),
      blockedDates: [],
      blockedSlots: [],
      appointments: [],
    };
  }

  const supabase = getSupabase();
  const to = format(addDays(new Date(from), days), "yyyy-MM-dd");

  const [hoursRes, blockedDatesRes, blockedSlotsRes, appointmentsRes] =
    await Promise.all([
      supabase.from("working_hours").select("*"),
      supabase.from("blocked_dates").select("*"),
      supabase.from("blocked_slots").select("*"),
      supabase
        .from("appointments")
        .select("*")
        .gte("appointment_date", from)
        .lte("appointment_date", to),
    ]);

  return {
    hours: normalizeWorkingHours(hoursRes.data ?? []),
    blockedDates: blockedDatesRes.data ?? [],
    blockedSlots: blockedSlotsRes.data ?? [],
    appointments: appointmentsRes.data ?? [],
    errors: [hoursRes.error, blockedDatesRes.error, blockedSlotsRes.error, appointmentsRes.error]
      .filter(Boolean)
      .map((e) => e!.message),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const settings = searchParams.get("settings") === "1";

  if (settings) {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const data = await fetchAvailabilityData(format(new Date(), "yyyy-MM-dd"), 1);
    return NextResponse.json({
      working_hours: data.hours,
      blocked_dates: data.blockedDates,
      blocked_slots: data.blockedSlots,
    });
  }

  const days = Number(searchParams.get("days") ?? 60);
  const from = searchParams.get("from") ?? format(new Date(), "yyyy-MM-dd");
  const data = await fetchAvailabilityData(from, days);

  const slots = computeAvailableSlots(
    new Date(from),
    days,
    data.hours,
    data.blockedDates,
    data.blockedSlots,
    data.appointments,
  );

  return NextResponse.json(slots);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  let admin;
  try {
    admin = createServiceClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Supabase bağlantı hatası.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const body = await request.json();

  if (body.type === "working_hours") {
    const hours = prepareHoursForUpsert(body.hours as WorkingHours[]);
    const { error } = await admin
      .from("working_hours")
      .upsert(hours, { onConflict: "day_of_week" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (body.type === "blocked_date") {
    const { error } = await admin.from("blocked_dates").insert({
      blocked_date: body.date,
      reason: body.reason ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (body.type === "blocked_slot") {
    const { error } = await admin.from("blocked_slots").insert({
      slot_date: body.date,
      slot_time: body.time,
      reason: body.reason ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  let admin;
  try {
    admin = createServiceClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Supabase bağlantı hatası.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const body = await request.json();

  if (body.type === "blocked_date") {
    const { error } = await admin
      .from("blocked_dates")
      .delete()
      .eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (body.type === "blocked_slot") {
    const { error } = await admin
      .from("blocked_slots")
      .delete()
      .eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
}
