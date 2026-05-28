import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteSettingsFresh } from "@/lib/get-settings";
import { mergeSettings, type SiteSettings } from "@/lib/site-settings";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  const settings = await getSiteSettingsFresh();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase yapılandırılmamış." }, { status: 503 });
  }

  let admin;
  try {
    admin = createServiceClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Supabase bağlantı hatası.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const body = (await request.json()) as Partial<SiteSettings>;
  const current = await getSiteSettingsFresh();
  const merged = mergeSettings({ ...current, ...body });

  const { error } = await admin.from("site_settings").upsert(
    { key: "main", value: merged, updated_at: new Date().toISOString() },
    { onConflict: "key" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateTag("site-settings");
  return NextResponse.json({ success: true, settings: merged });
}
