import { isValidAdminSessionFromRequest } from "@/lib/admin/request";

export const BANKR_API_BASE_URL =
  process.env.BANKR_API_BASE_URL || "https://api.bankr.bot";

export const BANKR_API_KEY = process.env.BANKR_API_KEY || "";

export const BANKR_ADMIN_TOKEN = process.env.BANKR_ADMIN_TOKEN || "";

export function isBankrConfigured() {
  return Boolean(BANKR_API_KEY);
}

export function isBankrAdminRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (BANKR_ADMIN_TOKEN && authHeader === `Bearer ${BANKR_ADMIN_TOKEN}`) {
    return true;
  }

  return isValidAdminSessionFromRequest(request);
}
