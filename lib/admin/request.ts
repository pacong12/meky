import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "./access";

export function readRequestCookie(request: Request, name: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
}

export function isValidAdminSessionFromRequest(request: Request) {
  return isValidAdminSession(readRequestCookie(request, ADMIN_SESSION_COOKIE));
}
