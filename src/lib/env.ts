export function trimEnv(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "") ?? "";
}

export function getSupabaseUrl() {
  return trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getAnonKey() {
  return trimEnv(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function getServiceKey() {
  return trimEnv(
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY,
  );
}

export function describeSupabaseConfig() {
  const url = getSupabaseUrl();
  const anon = getAnonKey();
  const service = getServiceKey();
  return {
    url: url || "EKSIK",
    anonKey: anon ? `${anon.slice(0, 16)}...` : "EKSIK",
    serviceKey: service ? `${service.slice(0, 16)}...` : "EKSIK",
    ready: Boolean(url && anon),
    adminReady: Boolean(url && service),
  };
}

export function explainFetchError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("fetch failed") || lower.includes("econnrefused") || lower.includes("enotfound")) {
    return "Supabase'e bağlanılamıyor. Proje muhtemelen DURAKLATILMIŞ — Supabase Dashboard → Restore project yap.";
  }
  if (lower.includes("abort")) {
    return "Bağlantı zaman aşımına uğradı. Supabase projesini kontrol et.";
  }
  if (lower.includes("invalid api key") || lower.includes("jwt")) {
    return "API key hatalı. Netlify env değişkenlerindeki key'leri Supabase'den yeniden kopyala.";
  }
  return message;
}
