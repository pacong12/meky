import { NextResponse } from "next/server";

import { rewardCatalog } from "@/lib/game/rewards";

export async function GET() {
  return NextResponse.json({
    total: rewardCatalog.length,
    rewards: rewardCatalog,
  });
}
