function trimEnv(value: string | undefined) {
  return value?.trim() ?? "";
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
    url: url ? `${url.slice(0, 30)}...` : "EKSIK",
    anonKey: anon ? `${anon.slice(0, 12)}...` : "EKSIK",
    serviceKey: service ? `${service.slice(0, 12)}...` : "EKSIK",
    ready: Boolean(url && anon),
    adminReady: Boolean(url && service),
  };
}
