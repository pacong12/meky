import { enemyCatalog, miningResources, rewardCatalog } from "./rewards";
import type { RewardClaimRecord, WaitlistUserRecord } from "./schemas";

export function createEconomyReport({
  waitlist,
  claims,
}: {
  waitlist: WaitlistUserRecord[];
  claims: RewardClaimRecord[];
}) {
  const claimCountByStatus = claims.reduce<Record<string, number>>((acc, claim) => {
    acc[claim.status] = (acc[claim.status] || 0) + 1;
    return acc;
  }, {});

  const waitlistByProvider = waitlist.reduce<Record<string, number>>((acc, user) => {
    acc[user.provider] = (acc[user.provider] || 0) + 1;
    return acc;
  }, {});

  return {
    generatedAt: new Date().toISOString(),
    waitlist: {
      total: waitlist.length,
      byProvider: waitlistByProvider,
    },
    rewards: {
      total: rewardCatalog.length,
      active: rewardCatalog.filter((reward) => reward.active).length,
      web3Ready: rewardCatalog.filter((reward) => reward.chainId).length,
    },
    claims: {
      total: claims.length,
      byStatus: claimCountByStatus,
      duplicateRisk:
        claims.length -
        new Set(claims.map((claim) => `${claim.walletAddress}:${claim.rewardId}`)).size,
    },
    mining: {
      resources: miningResources,
      rarestResource: miningResources.reduce((rarest, resource) =>
        resource.baseDropRate < rarest.baseDropRate ? resource : rarest,
      ),
    },
    enemies: {
      total: enemyCatalog.length,
      highestLevel: Math.max(...enemyCatalog.map((enemy) => enemy.level)),
      totalXpAvailable: enemyCatalog.reduce((sum, enemy) => sum + enemy.xpReward, 0),
    },
  };
}
