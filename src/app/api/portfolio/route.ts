import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createServiceClient, getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { CategoryId } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!isSupabaseConfigured()) {
    return NextResponse.json([]);
  }

  let query = getSupabase()
    .from("portfolio_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
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

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const category = formData.get("category") as CategoryId | null;
  const title = (formData.get("title") as string) || null;

  if (!file || !category) {
    return NextResponse.json({ error: "Dosya ve kategori gerekli." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage
    .from("portfolio")
    .upload(fileName, buffer, { contentType: file.type || "image/jpeg", upsert: false });

  if (uploadError) {
    return NextResponse.json(
      { error: `Yükleme hatası: ${uploadError.message}. Supabase Storage'da 'portfolio' bucket'ı public olmalı.` },
      { status: 500 },
    );
  }

  const { data: urlData } = admin.storage.from("portfolio").getPublicUrl(fileName);

  const { data, error } = await admin
    .from("portfolio_images")
    .insert({ category, image_url: urlData.publicUrl, title, sort_order: 0 })
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
  if (!id) {
    return NextResponse.json({ error: "ID gerekli." }, { status: 400 });
  }

  const { data: image } = await admin
    .from("portfolio_images")
    .select("image_url")
    .eq("id", id)
    .single();

  if (image?.image_url) {
    const path = image.image_url.split("/portfolio/")[1];
    if (path) {
      await admin.storage.from("portfolio").remove([decodeURIComponent(path)]);
    }
  }

  const { error } = await admin.from("portfolio_images").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
