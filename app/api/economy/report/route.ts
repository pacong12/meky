import { NextResponse } from "next/server";

import { getGameBackendSummary } from "@/lib/game/backend";

export async function GET() {
  const summary = await getGameBackendSummary();
  return NextResponse.json(summary.report);
}
