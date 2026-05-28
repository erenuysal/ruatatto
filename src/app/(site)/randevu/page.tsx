import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { BookingClient } from "./BookingClient";

export const metadata: Metadata = {
  title: `Randevu Al | ${SITE.name}`,
  description: "Online randevu sistemi — müsait gün ve saatleri gör, randevu talebi oluştur.",
};

export default function BookingPage() {
  return <BookingClient />;
}
