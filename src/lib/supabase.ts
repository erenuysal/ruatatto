import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getAnonKey, getServiceKey, getSupabaseUrl } from "./env";

let client: SupabaseClient | null = null;

const fetchWithTimeout: typeof fetch = async (input, init) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

function createSupabaseClient(key: string) {
  const url = getSupabaseUrl();
  if (!url || !key) {
    throw new Error("Supabase URL veya API key yapılandırılmamış.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: fetchWithTimeout },
  });
}

export function getSupabase() {
  if (!client) {
    client = createSupabaseClient(getAnonKey());
  }
  return client;
}

export function createServiceClient() {
  return createSupabaseClient(getServiceKey());
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getAnonKey());
}

export function isServiceConfigured() {
  return Boolean(getSupabaseUrl() && getServiceKey());
}

export async function testSupabaseConnection(useService = false) {
  try {
    const db = useService ? createServiceClient() : getSupabase();
    const { error } = await db.from("working_hours").select("id").limit(1);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bağlantı hatası";
    return { ok: false, error: message };
  }
}

// Re-export env helpers
export { getSupabaseUrl, getAnonKey, getServiceKey } from "./env";
export { describeSupabaseConfig } from "./env";
