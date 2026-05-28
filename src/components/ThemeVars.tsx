import type { SiteSettings } from "@/lib/site-settings";

export function ThemeVars({ settings }: { settings: SiteSettings }) {
  const css = `:root {
    --site-accent: ${settings.theme.accent};
    --site-accent-light: ${settings.theme.accentLight};
    --site-bg: ${settings.theme.background};
    --site-card: ${settings.theme.card};
  }`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
