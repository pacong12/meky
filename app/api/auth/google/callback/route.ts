import { NextResponse } from "next/server";

import {
  WAITLIST_COOKIE,
  encodeWaitlistUser,
  getSiteUrl,
} from "@/lib/auth/waitlist";
import { saveWaitlistUser } from "@/lib/game/backend";
import { enforceRateLimit } from "@/lib/security/rate-limit";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleUserInfo = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
};

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, "oauth-google", 20, 60 * 1000);
  if (limited) return limited;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const origin = url.origin;
  const redirectUri = `${getSiteUrl(origin)}/api/auth/google/callback`;

  const cookieState = request.headers
    .get("cookie")
    ?.split("; ")
    .find((cookie) => cookie.startsWith("meki_google_oauth_state="))
    ?.split("=")[1];

  if (!code || !state || !cookieState || state !== cookieState || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/waitlist?error=google", request.url));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const token = (await tokenResponse.json()) as GoogleTokenResponse;

  if (!token.access_token) {
    return NextResponse.redirect(new URL("/waitlist?error=google_token", request.url));
  }

  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  const profile = (await profileResponse.json()) as GoogleUserInfo;

  const user = {
    provider: "google" as const,
    id: profile.sub,
    email: profile.email,
    name: profile.name,
    picture: profile.picture,
    joinedAt: new Date().toISOString(),
  };

  await saveWaitlistUser(user);

  const response = NextResponse.redirect(new URL("/waitlist?joined=google", request.url));
  response.cookies.delete("meki_google_oauth_state");
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
