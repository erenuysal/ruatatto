import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#1f1f1f] px-4 py-8 text-center text-sm text-muted">
      <p>
        © {new Date().getFullYear()} {SITE.name} • {SITE.artist} • Tüm hakları saklıdır.
      </p>
      <p className="mt-2">
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          Instagram
        </a>
        {" · "}
        <a href={SITE.maps} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          {SITE.location}
        </a>
      </p>
    </footer>
  );
}
