import { addDays, format } from "date-fns";
import { NextResponse } from "next/server";
import { computeAvailableSlots } from "@/lib/availability";
import { isAdminAuthenticated } from "@/lib/auth";
import { createServiceClient, supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? 60);
  const from = searchParams.get("from") ?? format(new Date(), "yyyy-MM-dd");

  const [hoursRes, blockedDatesRes, blockedSlotsRes, appointmentsRes] =
    await Promise.all([
      supabase.from("working_hours").select("*"),
      supabase.from("blocked_dates").select("*"),
      supabase.from("blocked_slots").select("*"),
      supabase
        .from("appointments")
        .select("*")
        .gte("appointment_date", from)
        .lte("appointment_date", format(addDays(new Date(from), days), "yyyy-MM-dd")),
    ]);

  const slots = computeAvailableSlots(
    new Date(from),
    days,
    hoursRes.data ?? [],
    blockedDatesRes.data ?? [],
    blockedSlotsRes.data ?? [],
    appointmentsRes.data ?? [],
  );

  return NextResponse.json(slots);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const body = await request.json();
  const admin = createServiceClient();

  if (body.type === "working_hours") {
    const { error } = await admin
      .from("working_hours")
      .upsert(body.hours, { onConflict: "day_of_week" });
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

  const body = await request.json();
  const admin = createServiceClient();

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
