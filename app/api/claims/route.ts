import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { isValidAdminSessionFromRequest } from "@/lib/admin/request";
import {
  listRewardClaims,
  markRewardClaimCompleted,
  requestRewardClaim,
} from "@/lib/game/backend";
import { walletAddressSchema } from "@/lib/game/schemas";
import { enforceRateLimit } from "@/lib/security/rate-limit";

const claimRequestSchema = z.object({
  walletAddress: walletAddressSchema,
  rewardId: z.string().min(1),
  objectiveId: z.string().min(1),
  playerId: z.string().min(1).optional(),
});

const claimCompleteSchema = z.object({
  claimId: z.string().min(1),
  transactionHash: z.string().regex(/^0x[a-fA-F0-9]+$/),
  signature: z.string().min(1).optional(),
});

export async function GET(request: Request) {
  if (!isValidAdminSessionFromRequest(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const claims = await listRewardClaims();
  return NextResponse.json({
    total: claims.length,
    claims,
  });
}

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "claims", 12, 60 * 1000);
  if (limited) return limited;

  try {
    const body = await request.json();

    if (body?.action === "complete") {
      if (!isValidAdminSessionFromRequest(request)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const input = claimCompleteSchema.parse(body);
      const claim = await markRewardClaimCompleted(input);

      if (!claim) {
        return NextResponse.json({ message: "Claim not found." }, { status: 404 });
      }

      return NextResponse.json({ claim });
    }

    const input = claimRequestSchema.parse(body);
    const claim = await requestRewardClaim(input);

    return NextResponse.json({ claim }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid claim request.", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Failed to process claim request." },
      { status: 500 },
    );
  }
}
