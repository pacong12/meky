import { NextResponse } from "next/server";

import { WAITLIST_COOKIE } from "@/lib/auth/waitlist";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/waitlist", request.url));
  response.cookies.delete(WAITLIST_COOKIE);
  return response;
}
