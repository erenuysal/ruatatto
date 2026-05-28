import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  explainFetchError,
  getAnonKey,
  getServiceKey,
  getSupabaseUrl,
} from "./env";

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

async function pingSupabase(key: string) {
  const url = getSupabaseUrl();
  const res = await fetchWithTimeout(`${url}/rest/v1/`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });

  if (res.status === 503 || res.status === 502) {
    return {
      ok: false as const,
      error:
        "Supabase projesi DURAKLATILMIŞ (503). supabase.com → projen → Restore project.",
    };
  }

  if (!res.ok && res.status !== 401 && res.status !== 404) {
    return {
      ok: false as const,
      error: `Supabase HTTP ${res.status}. URL ve key'leri kontrol et.`,
    };
  }

  return { ok: true as const };
}

export async function testSupabaseConnection(useService = false) {
  const key = useService ? getServiceKey() : getAnonKey();
  if (!getSupabaseUrl() || !key) {
    return { ok: false, error: "URL veya API key eksik." };
  }

  try {
    const ping = await pingSupabase(key);
    if (!ping.ok) return ping;

    const db = useService ? createServiceClient() : getSupabase();
    const { error } = await db.from("working_hours").select("id").limit(1);
    if (error) {
      if (error.message.includes("does not exist") || error.code === "42P01") {
        return {
          ok: false,
          error: "working_hours tablosu yok. fix-policies.sql dosyasını çalıştır.",
        };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Bağlantı hatası";
    return { ok: false, error: explainFetchError(raw) };
  }
}

export { getSupabaseUrl, getAnonKey, getServiceKey } from "./env";
export { describeSupabaseConfig, explainFetchError } from "./env";
