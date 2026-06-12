import { NextResponse } from "next/server";

import { WAITLIST_COOKIE, encodeWaitlistUser } from "@/lib/auth/waitlist";
import { saveWaitlistUser } from "@/lib/game/backend";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "waitlist", 8, 60 * 1000);
  if (limited) return limited;

  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const name = String(formData.get("name") || "").trim();

  if (!email || !email.includes("@")) {
    return NextResponse.redirect(new URL("/waitlist?error=email", request.url));
  }

  const user = {
    provider: "email" as const,
    email,
    name: name || email.split("@")[0],
    joinedAt: new Date().toISOString(),
  };

  await saveWaitlistUser(user);

  const response = NextResponse.redirect(new URL("/waitlist?joined=email", request.url));
  response.cookies.set(
    WAITLIST_COOKIE,
    encodeWaitlistUser(user),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    }
  );

  return response;
}
