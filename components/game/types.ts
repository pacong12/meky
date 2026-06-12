export type TileType = "." | "W" | "T" | "~" | "P" | "S" | "D" | "#";

/**
 * Enemy behavior types:
 * - idle    : diam di tempat, serang jika player mendekat
 * - patrol  : bolak-balik sepanjang sumbu (patrolAxis) antara patrolMin..patrolMax
 * - wander  : jalan acak di sekitar patrolHome (default lama)
 * - guard   : wander dekat patrolHome, tapi chase jika player masuk detectRadius
 * - chase   : langsung kejar player jika masuk detectRadius, kembali ke home jika keluar chaseRadius
 */
export type EnemyBehavior = "idle" | "patrol" | "wander" | "guard" | "chase";

export interface Entity {
  id: string;
  x: number;
  y: number;
  type: "npc" | "chest" | "door" | "sign" | "shrine" | "enemy" | "collectible" | "mining_node" | "quest_board";
  name?: string;
  dialogue?: string[];
  dialogueIndex?: number;
  isOpen?: boolean;
  isLocked?: boolean;
  requiresItem?: string;
  givesItem?: string;
  action?: "profile" | "projects" | "skills" | "contact" | "none";
  // Animasi & Gerak NPC
  dir?: "down" | "up" | "left" | "right";
  moving?: boolean;
  startX?: number;
  startY?: number;
  currPixelX?: number;
  currPixelY?: number;
  targetX?: number;
  targetY?: number;
  moveCooldown?: number;
  // Combat stats
  hp?: number;
  maxHp?: number;
  isHit?: boolean;
  hitTimer?: number;
  isDead?: boolean;
  deathTimer?: number;
  patrolHomeX?: number;
  patrolHomeY?: number;
  isAttacking?: boolean;
  attackTimer?: number;
  attackCooldown?: number;
  respawnTimer?: number;
  // Enemy behavior system
  behavior?: EnemyBehavior;
  speed?: number;          // pixel per frame
  damage?: number;         // HP taken from player per hit
  xpReward?: number;       // XP given to player on kill
  attackRange?: number;    // tile multiplier for attack trigger
  detectRadius?: number;   // tile radius to start chasing (guard/chase)
  chaseRadius?: number;    // tile radius to abandon chase (chase/guard)
  patrolAxis?: "horizontal" | "vertical";
  patrolMin?: number;      // min tile on the patrol axis
  patrolMax?: number;      // max tile on the patrol axis
  patrolFixed?: number;    // fixed coord on the other axis
  isChasing?: boolean;     // runtime flag: currently chasing player
  collectibleType?: "ancient_fragment" | "stone_chip" | "copper_bit" | "glow_crystal";
  collectibleState?: "spawn" | "idle" | "sparkle" | "collected";
  collectibleTimer?: number;
  spawnVelX?: number;
  spawnVelY?: number;
  animFrame?: number;
  // Mining Node system
  miningNodeType?: "stone" | "copper" | "crystal" | "ancient";
  miningNodeHp?: number;
  miningNodeMaxHp?: number;
  miningNodeRequiredToolLevel?: number;
  miningNodeRespawnTimer?: number;
  miningNodeHitTimer?: number;
}

export interface QuestObjective {
  type: "talk" | "collect" | "defeat" | "mine" | "visit";
  target: string; // npcId, itemId, enemy name prefix, miningNodeType, or shrine
  amount: number;
  current: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  xpReward: number;
  coinReward: number;
  itemReward?: string;
  status: "locked" | "active" | "completed" | "claimed";
}

export type SpriteMap = Record<string, HTMLImageElement>;
