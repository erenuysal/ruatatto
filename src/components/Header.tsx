"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { BrandingSettings } from "@/lib/site-settings";

const NAV = [
  { href: "/#anasayfa", label: "Anasayfa" },
  { href: "/#hakkimda", label: "Ben kimim?" },
  { href: "/#eserlerim", label: "Eserlerim" },
  { href: "/#small", label: "Small" },
  { href: "/#medium", label: "Medium" },
  { href: "/#big", label: "Big" },
  { href: "/randevu", label: "Randevu" },
  { href: "/#iletisim", label: "İletişim" },
];

export function Header({ branding }: { branding: BrandingSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-wide">
          <Image
            src={branding.logoUrl}
            alt={branding.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl object-contain"
            priority
          />
          <span>{branding.name}</span>
        </Link>

        <button
          type="button"
          className="ml-auto rounded-xl border border-accent px-3 py-2 text-sm text-accent md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Kapat ✕" : "☰ Menü"}
        </button>

        <nav
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-full flex-col gap-2 border-b border-[#1f1f1f] bg-[#0a0a0a] p-4 md:static md:ml-auto md:flex md:flex-row md:border-0 md:bg-transparent md:p-0`}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={isHome || item.href.startsWith("/#") ? item.href : item.href}
              className={`rounded-full px-3 py-2 text-sm transition hover:text-accent ${
                pathname === item.href ? "text-accent" : "text-white"
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
