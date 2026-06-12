import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "meki_admin_session";

export function getAdminToken() {
  return process.env.ADMIN_CONSOLE_TOKEN || process.env.BANKR_ADMIN_TOKEN || "";
}

export function createAdminSessionValue(token: string) {
  return createHmac("sha256", token).update("meki-admin-session").digest("hex");
}

export function isValidAdminSession(value?: string) {
  const token = getAdminToken();

  if (!token || !value) {
    return false;
  }

  const expected = createAdminSessionValue(token);
  const actualBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export function isAdminToken(value: string) {
  const token = getAdminToken();

  if (!token || !value) {
    return false;
  }

  const actualBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(token);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}
