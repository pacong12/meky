import { NextResponse } from "next/server";

import { isValidAdminSessionFromRequest } from "@/lib/admin/request";
import { getGameBackendSummary } from "@/lib/game/backend";

export async function GET(request: Request) {
  if (!isValidAdminSessionFromRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const summary = await getGameBackendSummary();
  return NextResponse.json({
    counts: {
      waitlist: summary.waitlist.length,
      rewards: summary.rewards.length,
      claims: summary.claims.length,
    },
    report: summary.report,
  });
}
