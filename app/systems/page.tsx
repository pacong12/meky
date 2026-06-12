import { Coins, Heart, Pickaxe, Shield, Sparkles, Swords } from "lucide-react";

import { PageShell, PageHero, DarkSection } from "@/components/site/RetroPage";

const systems = [
  { title: "Level", value: "10", text: "XP cap awal", icon: Sparkles, color: "#ffd166" },
  { title: "Combat", value: "4", text: "enemy archetype", icon: Swords, color: "#e63946" },
  { title: "Mining", value: "4", text: "resource tier", icon: Pickaxe, color: "#5eead4" },
  { title: "Inventory", value: "6", text: "item category", icon: Coins, color: "#6ab04c" },
  { title: "Health", value: "5", text: "starting HP", icon: Heart, color: "#ff6b6b" },
  { title: "Security", value: "2", text: "validation layer", icon: Shield, color: "#9b5de5" },
];

export default function SystemsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Game systems"
        title="A stat board for the adventure."
        text="Systems page dibuat seperti debug/status screen retro: angka, stat, resource, dan security layer terlihat cepat."
      />
      <DarkSection>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {systems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="relative overflow-hidden border-4 border-[#08080d] bg-[#111827] p-5 shadow-[8px_8px_0_#000]">
                <div className="absolute right-4 top-4 h-16 w-16 border-4 border-[#08080d]" style={{ background: item.color }} />
                <Icon className="relative z-10 size-9 text-[#fff4c4]" />
                <div className="mt-8 font-mono text-6xl font-black leading-none" style={{ color: item.color }}>
                  {item.value}
                </div>
                <h2 className="mt-4 font-mono text-lg font-black uppercase text-[#fff4c4]">{item.title}</h2>
                <p className="mt-2 font-mono text-xs font-black uppercase text-[#ffd166]">{item.text}</p>
                <div className="mt-5 h-4 border-4 border-[#08080d] bg-[#fff4c4]">
                  <div className="h-full w-2/3" style={{ background: item.color }} />
                </div>
              </article>
            );
          })}
        </div>
      </DarkSection>
    </PageShell>
  );
}
