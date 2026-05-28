import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

export function getAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    ""
  );
}

export function getServiceKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    ""
  );
}

export function getSupabase() {
  if (!client) {
    const url = getSupabaseUrl();
    const key = getAnonKey();
    if (!url || !key) {
      throw new Error("Supabase URL veya anon key yapılandırılmamış.");
    }
    client = createClient(url, key);
  }
  return client;
}

export function createServiceClient() {
  const url = getSupabaseUrl();
  const key = getServiceKey();
  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY (secret key) Netlify ortam değişkenlerine eklenmeli.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getAnonKey());
}

export function isServiceConfigured() {
  return Boolean(getSupabaseUrl() && getServiceKey());
}
