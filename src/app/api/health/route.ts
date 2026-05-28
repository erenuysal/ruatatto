import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { describeSupabaseConfig, testSupabaseConnection } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const config = describeSupabaseConfig();
  const publicTest = await testSupabaseConnection(false);
  let adminTest: { ok: boolean; error?: string } = { ok: false, error: "Service key yok" };
  if (config.adminReady) {
    adminTest = await testSupabaseConnection(true);
  }

  return NextResponse.json({ config, publicTest, adminTest });
}
