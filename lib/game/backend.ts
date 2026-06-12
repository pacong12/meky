import { randomUUID } from "crypto";

import { storage } from "@/lib/storage/store";

import { signRewardClaim, verifyRewardClaimSignature } from "./claim-signing";
import { createEconomyReport } from "./economy";
import { findReward, rewardCatalog } from "./rewards";
import {
  rewardClaimSchema,
  waitlistUserSchema,
  type RewardClaimRecord,
  type WaitlistUserRecord,
} from "./schemas";

const WAITLIST_COLLECTION = "waitlist";
const CLAIM_COLLECTION = "rewardClaims";

export async function saveWaitlistUser(user: WaitlistUserRecord) {
  const parsed = waitlistUserSchema.parse(user);
  const id =
    parsed.id ||
    parsed.email ||
    parsed.handle ||
    `${parsed.provider}:${parsed.joinedAt}`;

  return storage.upsertRecord<WaitlistUserRecord & { storageId: string }>(
    WAITLIST_COLLECTION,
    "storageId",
    { ...parsed, storageId: `${parsed.provider}:${id}` },
  );
}

export async function listWaitlistUsers() {
  return storage.listRecords<WaitlistUserRecord & { storageId?: string }>(
    WAITLIST_COLLECTION,
  );
}

export async function listRewardClaims() {
  return storage.listRecords<RewardClaimRecord>(CLAIM_COLLECTION);
}

export async function requestRewardClaim(input: {
  walletAddress: string;
  rewardId: string;
  objectiveId: string;
  playerId?: string;
}) {
  const reward = findReward(input.rewardId);
  const now = new Date().toISOString();

  if (!reward || !reward.active) {
    const claim = rewardClaimSchema.parse({
      claimId: `claim_${randomUUID()}`,
      walletAddress: input.walletAddress,
      rewardId: input.rewardId,
      objectiveId: input.objectiveId,
      playerId: input.playerId,
      status: "rejected",
      createdAt: now,
    });
    return storage.appendRecord(CLAIM_COLLECTION, claim);
  }

  if (reward.requiredObjectiveId !== input.objectiveId) {
    const claim = rewardClaimSchema.parse({
      claimId: `claim_${randomUUID()}`,
      walletAddress: input.walletAddress,
      rewardId: input.rewardId,
      objectiveId: input.objectiveId,
      playerId: input.playerId,
      status: "rejected",
      createdAt: now,
    });
    return storage.appendRecord(CLAIM_COLLECTION, claim);
  }

  const duplicate = await storage.findRecord<RewardClaimRecord>(
    CLAIM_COLLECTION,
    (claim) =>
      claim.walletAddress.toLowerCase() === input.walletAddress.toLowerCase() &&
      claim.rewardId === input.rewardId &&
      ["eligible", "signed", "claimed"].includes(claim.status),
  );

  if (duplicate) {
    const claim = rewardClaimSchema.parse({
      claimId: `claim_${randomUUID()}`,
      walletAddress: input.walletAddress,
      rewardId: input.rewardId,
      objectiveId: input.objectiveId,
      playerId: input.playerId,
      status: "rejected",
      createdAt: now,
    });
    return storage.appendRecord(CLAIM_COLLECTION, claim);
  }

  const claim = rewardClaimSchema.parse({
    claimId: `claim_${randomUUID()}`,
    walletAddress: input.walletAddress,
    rewardId: input.rewardId,
    objectiveId: input.objectiveId,
    playerId: input.playerId,
    status: "eligible",
    createdAt: now,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  });

  const signedClaim = rewardClaimSchema.parse({
    ...claim,
    status: "signed",
    signature: signRewardClaim(claim),
  });

  return storage.appendRecord(CLAIM_COLLECTION, signedClaim);
}

export async function markRewardClaimCompleted(input: {
  claimId: string;
  transactionHash: string;
  signature?: string;
}) {
  const claims = await listRewardClaims();
  const claim = claims.find((item) => item.claimId === input.claimId);

  if (!claim) {
    return null;
  }

  if (!verifyRewardClaimSignature(claim, input.signature || claim.signature)) {
    return null;
  }

  const updated = rewardClaimSchema.parse({
    ...claim,
    status: "claimed",
    transactionHash: input.transactionHash,
    claimedAt: new Date().toISOString(),
  });

  return storage.upsertRecord(CLAIM_COLLECTION, "claimId", updated);
}

export async function getGameBackendSummary() {
  const waitlist = await listWaitlistUsers();
  const claims = await listRewardClaims();

  return {
    waitlist,
    claims,
    rewards: rewardCatalog,
    report: createEconomyReport({ waitlist, claims }),
  };
}
