import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin/access";

export async function GET(request: Request) {
  const redirectTo = new URL("/bankr", request.url);
  const response = NextResponse.redirect(redirectTo);
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
