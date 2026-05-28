import type { BrandingSettings, ContactSettings } from "@/lib/site-settings";

export function Footer({
  contact,
  branding,
}: {
  contact: ContactSettings;
  branding: BrandingSettings;
}) {
  return (
    <footer className="mt-16 border-t border-[#1f1f1f] px-4 py-8 text-center text-sm text-muted">
      <p>
        © {new Date().getFullYear()} {branding.name} • Tüm hakları saklıdır.
      </p>
      <p className="mt-2">
        <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          Instagram
        </a>
        {" · "}
        <a href={contact.maps} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          {contact.location}
        </a>
      </p>
    </footer>
  );
}
