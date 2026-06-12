import type {
  EnemyDefinitionRecord,
  MiningResourceRecord,
  RewardDefinitionRecord,
} from "./schemas";

export const rewardCatalog: RewardDefinitionRecord[] = [
  {
    rewardId: "badge_first_clear",
    type: "badge",
    name: "First Clear Badge",
    description: "Unlocked after the first tutorial objective is completed.",
    requiredObjectiveId: "objective_first_clear",
    chainId: 84532,
    active: true,
  },
  {
    rewardId: "title_cave_runner",
    type: "title",
    name: "Cave Runner",
    description: "A cosmetic title for clearing the first mining route.",
    requiredObjectiveId: "objective_first_mine",
    active: true,
  },
  {
    rewardId: "frame_crystal_scout",
    type: "profile_frame",
    name: "Crystal Scout Frame",
    description: "Profile frame for finding the first crystal node.",
    requiredObjectiveId: "objective_first_crystal",
    chainId: 84532,
    active: false,
  },
  {
    rewardId: "skin_red_scarf",
    type: "cosmetic",
    name: "Red Scarf Skin",
    description: "Optional player cosmetic for early waitlist supporters.",
    requiredObjectiveId: "objective_waitlist_founder",
    active: false,
  },
];

export const miningResources: MiningResourceRecord[] = [
  {
    resourceId: "stone",
    name: "Stone",
    rarity: "common",
    baseDropRate: 0.75,
    xpReward: 2,
  },
  {
    resourceId: "copper",
    name: "Copper",
    rarity: "uncommon",
    baseDropRate: 0.35,
    xpReward: 5,
  },
  {
    resourceId: "crystal",
    name: "Crystal",
    rarity: "rare",
    baseDropRate: 0.12,
    xpReward: 12,
  },
  {
    resourceId: "ancient_fragment",
    name: "Ancient Fragment",
    rarity: "epic",
    baseDropRate: 0.035,
    xpReward: 30,
  },
];

export const enemyCatalog: EnemyDefinitionRecord[] = [
  {
    enemyId: "slime_green",
    name: "Green Slime",
    level: 1,
    hp: 18,
    attack: 3,
    xpReward: 8,
    dropTable: ["stone"],
  },
  {
    enemyId: "bugling_scout",
    name: "Bugling Scout",
    level: 2,
    hp: 28,
    attack: 5,
    xpReward: 14,
    dropTable: ["stone", "copper"],
  },
  {
    enemyId: "crystal_guard",
    name: "Crystal Guard",
    level: 4,
    hp: 70,
    attack: 11,
    xpReward: 36,
    dropTable: ["copper", "crystal"],
  },
];

export function findReward(rewardId: string) {
  return rewardCatalog.find((reward) => reward.rewardId === rewardId) || null;
}
