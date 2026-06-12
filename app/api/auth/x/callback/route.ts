import { NextResponse } from "next/server";

import {
  WAITLIST_COOKIE,
  encodeWaitlistUser,
  getSiteUrl,
} from "@/lib/auth/waitlist";
import { saveWaitlistUser } from "@/lib/game/backend";
import { enforceRateLimit } from "@/lib/security/rate-limit";

type XTokenResponse = {
  access_token?: string;
};

type XProfileResponse = {
  data?: {
    id?: string;
    name?: string;
    username?: string;
    profile_image_url?: string;
  };
};

function readCookie(request: Request, name: string) {
  return request.headers
    .get("cookie")
    ?.split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, "oauth-x", 20, 60 * 1000);
  if (limited) return limited;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  const origin = url.origin;
  const redirectUri = `${getSiteUrl(origin)}/api/auth/x/callback`;
  const cookieState = readCookie(request, "meki_x_oauth_state");
  const verifier = readCookie(request, "meki_x_oauth_verifier");

  if (!code || !state || !cookieState || state !== cookieState || !verifier || !clientId) {
    return NextResponse.redirect(new URL("/waitlist?error=x", request.url));
  }

  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (clientSecret) {
    headers.Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
  }

  const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers,
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
  });
  const token = (await tokenResponse.json()) as XTokenResponse;

  if (!token.access_token) {
    return NextResponse.redirect(new URL("/waitlist?error=x_token", request.url));
  }

  const profileResponse = await fetch(
    "https://api.twitter.com/2/users/me?user.fields=profile_image_url",
    { headers: { Authorization: `Bearer ${token.access_token}` } }
  );
  const profile = (await profileResponse.json()) as XProfileResponse;

  const user = {
    provider: "x" as const,
    id: profile.data?.id,
    name: profile.data?.name,
    handle: profile.data?.username,
    picture: profile.data?.profile_image_url,
    joinedAt: new Date().toISOString(),
  };

  await saveWaitlistUser(user);

  const response = NextResponse.redirect(new URL("/waitlist?joined=x", request.url));
  response.cookies.delete("meki_x_oauth_state");
  response.cookies.delete("meki_x_oauth_verifier");
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
