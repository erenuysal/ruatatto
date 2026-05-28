import { unstable_cache } from "next/cache";
import {
  DEFAULT_SETTINGS,
  mergeSettings,
  type SiteSettings,
} from "./site-settings";
import { getSupabase, isSupabaseConfigured } from "./supabase";

async function fetchSettingsFromDb(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS;

  try {
    const { data, error } = await getSupabase()
      .from("site_settings")
      .select("value")
      .eq("key", "main")
      .maybeSingle();

    if (error || !data?.value) return DEFAULT_SETTINGS;
    return mergeSettings(data.value as Partial<SiteSettings>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export const getSiteSettings = unstable_cache(
  fetchSettingsFromDb,
  ["site-settings-main"],
  { revalidate: 60, tags: ["site-settings"] },
);

export async function getSiteSettingsFresh(): Promise<SiteSettings> {
  return fetchSettingsFromDb();
}
