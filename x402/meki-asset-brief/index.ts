type AssetBriefInput = {
  assetType?: "character" | "enemy" | "item" | "biome" | "badge";
  name?: string;
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
  animationCount?: number;
};

export default async function handler(request: Request) {
  const input = (await request.json().catch(() => ({}))) as AssetBriefInput;
  const assetType = input.assetType || "item";
  const name = input.name || "Unnamed Meki Asset";
  const rarity = input.rarity || "common";

  return {
    service: "meki-asset-brief",
    status: "template",
    brief: {
      name,
      assetType,
      rarity,
      canvas: assetType === "badge" ? "128x128" : "32x32 base sprite",
      palette:
        "Use a limited retro palette with strong silhouette contrast and no copied franchise symbols.",
      animations: input.animationCount || (assetType === "character" ? 4 : 1),
      export:
        "PNG sprite sheet with transparent background, nearest-neighbor scaling, and original naming.",
    },
    generatedAt: new Date().toISOString(),
  };
}
