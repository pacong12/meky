import { BadgeCheck, ImageIcon, Music, Package, PanelsTopLeft, UserRound } from "lucide-react";

import { PageHero, PageShell } from "@/components/site/RetroPage";

const columns = [
  { title: "Sprites", text: "Player, NPC, enemy, mini boss.", icon: UserRound },
  { title: "Tilesets", text: "Village, forest, cave, shrine.", icon: ImageIcon },
  { title: "Items", text: "Keys, resources, potions, coins.", icon: Package },
  { title: "UI", text: "HUD, dialog, panels, claim frame.", icon: PanelsTopLeft },
  { title: "Audio", text: "SFX and loop music.", icon: Music },
  { title: "Badges", text: "Collectible reward images.", icon: BadgeCheck },
];

export default function AssetsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Production board"
        title="Asset checklist for design."
        text="Halaman asset dibuat seperti papan produksi: tiap kategori punya slot dan prioritas visual."
      />
      <section className="bg-[#fff4c4] px-5 py-12 text-[#08080d] sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="border-4 border-[#08080d] bg-white shadow-[7px_7px_0_#08080d]">
                  <div className="flex items-center justify-between border-b-4 border-[#08080d] bg-[#1b2b72] p-4 text-[#fff4c4]">
                    <h2 className="font-mono text-lg font-black uppercase">{item.title}</h2>
                    <span className="font-mono text-xs font-black">#{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr]">
                    <div className="grid place-items-center border-r-4 border-[#08080d] bg-[#ffd166]">
                      <Icon className="size-9 text-[#08080d]" />
                    </div>
                    <p className="p-4 text-sm font-bold leading-6 text-[#243044]">{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
