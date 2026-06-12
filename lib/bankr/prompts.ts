export type BankrPromptTemplate = {
  id: string;
  label: string;
  prompt: string;
};

export const bankrPromptTemplates: BankrPromptTemplate[] = [
  {
    id: "safe-wallet-check",
    label: "Safe Wallet Check",
    prompt:
      "Read-only task for Meki Adventure: summarize my Bankr wallet identity, visible balances, supported chains, and any safety recommendations. Do not trade, transfer, swap, sign, or launch anything.",
  },
  {
    id: "treasury-report",
    label: "Treasury Report",
    prompt:
      "Read-only task for Meki Adventure: produce a concise treasury report for Base and EVM assets. Include risk notes, stablecoin exposure, and suggested monitoring checks. Do not execute transactions.",
  },
  {
    id: "claim-activity",
    label: "Claim Activity",
    prompt:
      "Read-only task for Meki Adventure: create a template report for badge claim activity. Include eligible claims, rejected claims, duplicate claim risk, suspicious wallet patterns, and data fields the game backend should log.",
  },
  {
    id: "mining-economy",
    label: "Mining Economy",
    prompt:
      "Read-only design task for Meki Adventure: review a retro game mining economy with stone, copper, crystal, and ancient fragments. Suggest balanced drop rates, upgrade sinks, and anti-bot signals without making any on-chain transaction.",
  },
  {
    id: "enemy-leveling",
    label: "Enemy Leveling",
    prompt:
      "Read-only design task for Meki Adventure: propose enemy leveling tiers, XP rewards, drop tables, and boss gates for a retro Web3-ready adventure. Keep rewards cosmetic-first and avoid pay-to-win.",
  },
  {
    id: "x402-readiness",
    label: "x402 Readiness",
    prompt:
      "Read-only planning task for Meki Adventure: evaluate which future APIs could become x402 paid endpoints, including quest verification, badge metadata, economy reports, and asset briefs. Include security risks and launch order.",
  },
];
