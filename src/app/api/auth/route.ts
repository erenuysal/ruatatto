import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  createAdminToken,
  verifyAdminToken,
} from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin şifresi yapılandırılmamış." },
      { status: 500 },
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Hatalı şifre." }, { status: 401 });
  }

  const token = await createAdminToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}

export async function GET(request: Request) {
  const token = request.headers.get("cookie")?.match(/ruatatto_admin=([^;]+)/)?.[1];
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }
  const authenticated = await verifyAdminToken(token);
  return NextResponse.json({ authenticated });
}
