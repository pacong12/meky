import type { WaitlistUserRecord } from "@/lib/game/schemas";
import { waitlistUserSchema } from "@/lib/game/schemas";

export type WaitlistUser = {
  provider: "google" | "x" | "email";
  id?: string;
  email?: string;
  name?: string;
  handle?: string;
  picture?: string;
  joinedAt: string;
};

export const WAITLIST_COOKIE = "meki_waitlist_user";

export function encodeWaitlistUser(user: WaitlistUser) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

export function decodeWaitlistUser(value?: string): WaitlistUser | null {
  if (!value) return null;

  try {
    const user = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    return waitlistUserSchema.parse(user) satisfies WaitlistUserRecord;
  } catch {
    return null;
  }
}

export function getSiteUrl(origin?: string) {
  return process.env.NEXT_PUBLIC_SITE_URL || origin || "http://localhost:3000";
}
