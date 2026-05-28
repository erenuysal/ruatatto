import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createServiceClient, getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  if (!isSupabaseConfigured()) {
    return NextResponse.json([]);
  }

  let query = getSupabase()
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Randevu sistemi yapılandırılmamış." }, { status: 503 });
  }

  const body = await request.json();
  const { date, time, name, phone, email, message } = body;

  if (!date || !time || !name || !phone) {
    return NextResponse.json(
      { error: "Tarih, saat, isim ve telefon gerekli." },
      { status: 400 },
    );
  }

  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("appointments")
    .select("id")
    .eq("appointment_date", date)
    .eq("appointment_time", time)
    .neq("status", "cancelled")
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Bu saat dolu. Lütfen başka bir saat seçin." },
      { status: 409 },
    );
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      appointment_date: date,
      appointment_time: time,
      customer_name: name,
      customer_phone: phone,
      customer_email: email || null,
      message: message || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
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

  const { id, status } = await request.json();
  if (!id || !status) {
    return NextResponse.json({ error: "ID ve durum gerekli." }, { status: 400 });
  }

  const { data, error } = await admin
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
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

  const { id } = await request.json();
  const { error } = await admin.from("appointments").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
