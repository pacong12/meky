import { z } from "zod";

export const walletAddressSchema = z
  .string()
  .trim()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Expected an EVM wallet address.");

export const waitlistProviderSchema = z.enum(["google", "x", "email"]);

export const waitlistUserSchema = z.object({
  provider: waitlistProviderSchema,
  id: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().min(1).max(120).optional(),
  handle: z.string().min(1).max(80).optional(),
  picture: z.string().url().optional(),
  walletAddress: walletAddressSchema.optional(),
  joinedAt: z.string().datetime(),
});

export const gameProgressSchema = z.object({
  playerId: z.string().min(1).optional(),
  walletAddress: walletAddressSchema.optional(),
  completedObjectives: z.array(z.string().min(1)).default([]),
  inventory: z.array(z.string().min(1)).default([]),
  unlockedAreas: z.array(z.string().min(1)).default([]),
  achievements: z.array(z.string().min(1)).default([]),
  level: z.number().int().min(1).default(1),
  xp: z.number().int().min(0).default(0),
  updatedAt: z.string().datetime(),
});

export const rewardTypeSchema = z.enum([
  "badge",
  "cosmetic",
  "title",
  "profile_frame",
  "offchain_item",
]);

export const rewardDefinitionSchema = z.object({
  rewardId: z.string().min(1),
  type: rewardTypeSchema,
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  requiredObjectiveId: z.string().min(1),
  chainId: z.number().int().positive().optional(),
  contractAddress: walletAddressSchema.optional(),
  tokenId: z.string().optional(),
  metadataUri: z.string().url().optional(),
  active: z.boolean().default(false),
});

export const claimStatusSchema = z.enum([
  "draft",
  "eligible",
  "signed",
  "claimed",
  "rejected",
  "expired",
]);

export const rewardClaimSchema = z.object({
  claimId: z.string().min(1),
  playerId: z.string().min(1).optional(),
  walletAddress: walletAddressSchema,
  rewardId: z.string().min(1),
  objectiveId: z.string().min(1),
  status: claimStatusSchema,
  signature: z.string().optional(),
  transactionHash: z.string().regex(/^0x[a-fA-F0-9]+$/).optional(),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  claimedAt: z.string().datetime().optional(),
});

export const miningResourceSchema = z.object({
  resourceId: z.string().min(1),
  name: z.string().min(1).max(80),
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
  baseDropRate: z.number().min(0).max(1),
  xpReward: z.number().int().min(0),
});

export const enemyDefinitionSchema = z.object({
  enemyId: z.string().min(1),
  name: z.string().min(1).max(80),
  level: z.number().int().min(1),
  hp: z.number().int().positive(),
  attack: z.number().int().min(0),
  xpReward: z.number().int().min(0),
  dropTable: z.array(z.string().min(1)).default([]),
});

export const gameAuditEventSchema = z.object({
  eventId: z.string().min(1),
  playerId: z.string().min(1).optional(),
  walletAddress: walletAddressSchema.optional(),
  type: z.enum([
    "objective_completed",
    "item_collected",
    "resource_mined",
    "enemy_defeated",
    "claim_requested",
    "claim_completed",
    "bankr_agent_prompt",
  ]),
  payload: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string().datetime(),
});

export type WaitlistUserRecord = z.infer<typeof waitlistUserSchema>;
export type GameProgressRecord = z.infer<typeof gameProgressSchema>;
export type RewardDefinitionRecord = z.infer<typeof rewardDefinitionSchema>;
export type RewardClaimRecord = z.infer<typeof rewardClaimSchema>;
export type MiningResourceRecord = z.infer<typeof miningResourceSchema>;
export type EnemyDefinitionRecord = z.infer<typeof enemyDefinitionSchema>;
export type GameAuditEventRecord = z.infer<typeof gameAuditEventSchema>;
