import { NextResponse, type NextRequest } from "next/server";

const adminCookieName = "meki_admin_session";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminAuthRoute =
    pathname === "/api/admin/login" || pathname === "/api/admin/logout";
  const isProtectedApi =
    pathname.startsWith("/api/bankr") ||
    (pathname.startsWith("/api/admin") && !isAdminAuthRoute);

  if (!isProtectedApi) {
    return NextResponse.next();
  }

  const hasBearer = Boolean(request.headers.get("authorization"));
  const hasAdminCookie = Boolean(request.cookies.get(adminCookieName)?.value);

  if (!hasBearer && !hasAdminCookie) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/bankr/:path*"],
};
