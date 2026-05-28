import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";

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
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json({ error: "Dosya gerekli." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${folder}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage
    .from("portfolio")
    .upload(fileName, buffer, { contentType: file.type || "image/jpeg", upsert: true });

  if (error) {
    return NextResponse.json(
      { error: `Yükleme hatası: ${error.message}. Storage'da 'portfolio' bucket public olmalı.` },
      { status: 500 },
    );
  }

  const { data } = admin.storage.from("portfolio").getPublicUrl(fileName);
  revalidateTag("site-settings");
  return NextResponse.json({ url: data.publicUrl });
}
