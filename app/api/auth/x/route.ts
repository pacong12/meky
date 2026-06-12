import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { getSiteUrl } from "@/lib/auth/waitlist";

function challenge(verifier: string) {
  return createHash("sha256").update(verifier).digest("base64url");
}

export async function GET(request: Request) {
  const clientId = process.env.X_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(new URL("/waitlist?error=x_config", request.url));
  }

  const origin = new URL(request.url).origin;
  const redirectUri = `${getSiteUrl(origin)}/api/auth/x/callback`;
  const state = randomBytes(24).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const url = new URL("https://twitter.com/i/oauth2/authorize");

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "tweet.read users.read offline.access");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge(verifier));
  url.searchParams.set("code_challenge_method", "S256");

  const response = NextResponse.redirect(url);
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  };

  response.cookies.set("meki_x_oauth_state", state, cookieOptions);
  response.cookies.set("meki_x_oauth_verifier", verifier, cookieOptions);

  return response;
}
