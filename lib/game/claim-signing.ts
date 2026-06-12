import { createHmac, timingSafeEqual } from "crypto";

import type { RewardClaimRecord } from "./schemas";

export function getClaimSigningSecret() {
  return process.env.CLAIM_SIGNING_SECRET || process.env.ADMIN_CONSOLE_TOKEN || "";
}

export function createClaimSigningPayload(claim: RewardClaimRecord) {
  return [
    claim.claimId,
    claim.walletAddress.toLowerCase(),
    claim.rewardId,
    claim.objectiveId,
    claim.expiresAt || "",
  ].join("|");
}

export function signRewardClaim(claim: RewardClaimRecord) {
  const secret = getClaimSigningSecret();

  if (!secret) {
    return "";
  }

  return createHmac("sha256", secret)
    .update(createClaimSigningPayload(claim))
    .digest("hex");
}

export function verifyRewardClaimSignature(
  claim: RewardClaimRecord,
  signature?: string,
) {
  const expected = signRewardClaim(claim);

  if (!expected || !signature) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}
