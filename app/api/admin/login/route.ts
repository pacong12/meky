import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  getAdminToken,
  isAdminToken,
} from "@/lib/admin/access";

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = String(formData.get("token") || "");
  const requestedRedirect = String(formData.get("redirectTo") || "/bankr");
  const redirectTo = requestedRedirect.startsWith("/")
    ? requestedRedirect
    : "/bankr";
  const configuredToken = getAdminToken();

  if (!configuredToken || !isAdminToken(token)) {
    return NextResponse.redirect(
      new URL(`${redirectTo}?admin=invalid`, request.url),
    );
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionValue(configuredToken), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
