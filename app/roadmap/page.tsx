import { Flag, Gamepad2, Sparkles, Wallet } from "lucide-react";

import { PageHero, PageShell } from "@/components/site/RetroPage";

const phases = [
  ["Alpha", "Core Adventure", "Map, NPC, dialog, inventory, mining, musuh dasar.", Gamepad2],
  ["Beta", "Player Progress", "Save, quest state, XP, area unlock, upgrade.", Flag],
  ["Genesis", "Wallet Layer", "Wallet opsional, identity, claim eligibility.", Wallet],
  ["Season 1", "Collectible Rewards", "Badge, cosmetic, seasonal quest.", Sparkles],
];

export default function RoadmapPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Launch roadmap"
        title="Stage select for every release."
        text="Roadmap dibuat seperti stage select: tiap fase punya unlock, reward, dan fokus berbeda."
      />
      <section className="bg-[#fff4c4] px-5 py-14 text-[#08080d] sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-4">
            {phases.map(([phase, title, text, Icon], index) => {
              const PhaseIcon = Icon as typeof Gamepad2;
              return (
                <article key={phase as string} className="relative border-4 border-[#08080d] bg-white p-5 shadow-[8px_8px_0_#08080d]">
                  <div className="absolute -top-5 left-5 border-4 border-[#08080d] bg-[#ffd166] px-3 py-1 font-mono text-xs font-black uppercase">
                    Stage {index + 1}
                  </div>
                  <div className="mt-5 grid h-20 w-20 place-items-center border-4 border-[#08080d] bg-[#1b2b72]">
                    <PhaseIcon className="size-10 text-[#ffd166]" />
                  </div>
                  <p className="mt-5 font-mono text-xs font-black uppercase text-[#e63946]">{phase as string}</p>
                  <h2 className="mt-2 font-mono text-xl font-black uppercase">{title as string}</h2>
                  <p className="mt-3 text-sm font-medium leading-6 text-[#243044]">{text as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
