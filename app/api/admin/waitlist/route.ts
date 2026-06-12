import { NextResponse } from "next/server";

import { isValidAdminSessionFromRequest } from "@/lib/admin/request";
import { listWaitlistUsers } from "@/lib/game/backend";

export async function GET(request: Request) {
  if (!isValidAdminSessionFromRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const users = await listWaitlistUsers();
  return NextResponse.json({
    total: users.length,
    users,
  });
}
