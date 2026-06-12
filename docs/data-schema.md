# Data Schema

Dokumen ini menjelaskan kontrak data awal untuk Meki Adventure. Implementasi TypeScript/Zod ada di `lib/game/schemas.ts`.

## Waitlist User

Dipakai untuk login Google, X, email, dan nanti bisa dihubungkan ke wallet.

Field utama:

- `provider`: `google`, `x`, atau `email`
- `id`: id provider OAuth
- `email`
- `name`
- `handle`
- `picture`
- `walletAddress`
- `joinedAt`

## Game Progress

Progress tetap off-chain dulu.

Field utama:

- `playerId`
- `walletAddress`
- `completedObjectives`
- `inventory`
- `unlockedAreas`
- `achievements`
- `level`
- `xp`
- `updatedAt`

## Reward Definition

Reward yang aman untuk awal adalah badge, cosmetic, title, profile frame, atau item off-chain.

Field utama:

- `rewardId`
- `type`
- `name`
- `description`
- `requiredObjectiveId`
- `chainId`
- `contractAddress`
- `tokenId`
- `metadataUri`
- `active`

## Reward Claim

Claim dipakai setelah server memvalidasi objective.

Status:

- `draft`
- `eligible`
- `signed`
- `claimed`
- `rejected`
- `expired`

Field utama:

- `claimId`
- `playerId`
- `walletAddress`
- `rewardId`
- `objectiveId`
- `status`
- `signature`
- `transactionHash`
- `createdAt`
- `expiresAt`
- `claimedAt`

## Mining Resource

Resource awal:

- `stone`
- `copper`
- `crystal`
- `ancient_fragment`

Field utama:

- `resourceId`
- `name`
- `rarity`
- `baseDropRate`
- `xpReward`

## Enemy Definition

Field utama:

- `enemyId`
- `name`
- `level`
- `hp`
- `attack`
- `xpReward`
- `dropTable`

## Audit Event

Dipakai untuk anti-cheat, claim log, dan laporan Bankr agent.

Event awal:

- `objective_completed`
- `item_collected`
- `resource_mined`
- `enemy_defeated`
- `claim_requested`
- `claim_completed`
- `bankr_agent_prompt`
