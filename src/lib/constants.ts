export const SITE = {
  name: "RuaTattoo",
  title: "RuaTattoo | Sanat, teninle buluştuğunda",
  description:
    "Fine line & black&grey dövmeler. Özel tasarım dövme çalışmaları. Randevu al, portfolyoyu keşfet.",
  url: "https://ruatatto.com",
  artist: "Melike Kipritçi",
  whatsapp: "905384160167",
  instagram: "https://www.instagram.com/melikekipritci.ink/",
  maps:
    "https://www.google.com/maps/search/?api=1&query=Rua+Tattoo+Kdz+Ere%C4%9Fli",
  location: "Kdz. Ereğli",
} as const;

export const CATEGORIES = [
  { id: "done", label: "Eserlerim", slug: "eserlerim" },
  { id: "small", label: "Small Tattoos", slug: "small" },
  { id: "medium", label: "Medium Tattoos", slug: "medium" },
  { id: "big", label: "Big Tattoos", slug: "big" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const;

export const WEEKDAYS = [
  { value: 1, label: "Pazartesi" },
  { value: 2, label: "Salı" },
  { value: 3, label: "Çarşamba" },
  { value: 4, label: "Perşembe" },
  { value: 5, label: "Cuma" },
  { value: 6, label: "Cumartesi" },
  { value: 0, label: "Pazar" },
] as const;
