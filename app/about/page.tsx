import Image from "next/image";
import { BookOpen, Gamepad2, ShieldCheck, Trophy } from "lucide-react";

import { PageShell, PageHero, SiteHeader, RetroBackdrop } from "@/components/site/RetroPage";

const values = [
  ["01", "Playable First", "Enter the game without a wallet, complete quests, then choose when to connect."],
  ["02", "Original Retro", "8-bit top-down visuals with an original world, characters, items, and lore."],
  ["03", "Collectible Layer", "Badges and cosmetics are ownership rewards, not required progression items."],
  ["04", "Validated Claims", "High-value rewards must come from validated in-game progress."],
];

export default function AboutPage() {
  return (
    <PageShell>
      <section className="relative isolate overflow-hidden border-b-8 border-[#08080d] bg-[#263b80]">
        <RetroBackdrop />
        <SiteHeader />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="inline-flex border-4 border-[#08080d] bg-[#ffd166] px-4 py-2 font-mono text-xs font-black uppercase text-[#08080d] shadow-[5px_5px_0_#08080d]">
              About cartridge
            </div>
            <h1 className="mt-6 font-mono text-5xl font-black uppercase leading-none text-[#fff4c4] [text-shadow:5px_5px_0_#08080d] sm:text-7xl">
              What is Retromolt?
            </h1>
            <p className="mt-6 border-l-8 border-[#ffd166] bg-[#08080d]/80 px-5 py-4 font-mono text-sm font-bold leading-7 text-white shadow-[6px_6px_0_#08080d]">
              A retro adventure game that turns portfolio, quest, resource,
              and collectible systems into a playable Web3-ready world.
            </p>
          </div>
          <div className="relative min-h-[420px] border-8 border-[#08080d] bg-[#fff4c4] p-6 text-[#08080d] shadow-[12px_12px_0_#08080d]">
            <div className="absolute right-5 top-5 border-4 border-[#08080d] bg-[#e63946] px-3 py-2 font-mono text-xs font-black uppercase text-white">
              Manual Pg. 01
            </div>
            <Image
              src="/game/sprites/player.png"
              alt="Kira player sprite"
              width={160}
              height={160}
              className="mx-auto mt-10 h-40 w-40 object-contain [image-rendering:pixelated]"
              priority
            />
            <div className="mt-8 grid gap-3">
              {values.map(([num, title, text]) => (
                <div key={title} className="grid grid-cols-[56px_1fr] border-4 border-[#08080d] bg-white">
                  <div className="grid place-items-center bg-[#ffd166] font-mono text-lg font-black">
                    {num}
                  </div>
                  <div className="border-l-4 border-[#08080d] p-3">
                    <h2 className="font-mono text-sm font-black uppercase">{title}</h2>
                    <p className="mt-1 text-sm font-medium leading-5 text-[#243044]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
