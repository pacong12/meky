type GameReportInput = {
  period?: "daily" | "weekly" | "seasonal";
  includeMining?: boolean;
  includeClaims?: boolean;
  includeEnemies?: boolean;
};

export default async function handler(request: Request) {
  const input = (await request.json().catch(() => ({}))) as GameReportInput;
  const period = input.period || "daily";

  return {
    service: "meki-game-report",
    period,
    status: "template",
    summary:
      "This x402 handler is a read-only template. Connect aggregate game data after claim and anti-cheat systems are stable.",
    sections: {
      mining: input.includeMining ?? true,
      claims: input.includeClaims ?? true,
      enemies: input.includeEnemies ?? true,
    },
    recommendedNextStep:
      "Replace placeholder counts with server-side aggregate metrics, never raw player secrets.",
    generatedAt: new Date().toISOString(),
  };
}
