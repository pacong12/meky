import { BadgeCheck, Gamepad2, Server, Wallet } from "lucide-react";

import { PageHero, PageShell } from "@/components/site/RetroPage";

const steps = [
  ["A", "Clear Quest", "Player menyelesaikan objective di game.", Gamepad2],
  ["B", "Validate", "Progress dicek sebelum reward dibuka.", Server],
  ["C", "Connect", "Wallet hanya dipakai saat player siap claim.", Wallet],
  ["D", "Claim Badge", "Badge/cosmetic masuk sebagai collectible.", BadgeCheck],
];

export default function ClaimPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Claim machine"
        title="A safe reward pipeline."
        text="Claim page dibuat seperti mesin arcade: masukkan progress valid, keluarkan badge collectible."
      />
      <section className="bg-[#ffd166] px-5 py-12 text-[#08080d] sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 lg:grid-cols-4">
            {steps.map(([code, title, text, Icon]) => {
              const StepIcon = Icon as typeof Gamepad2;
              return (
                <article key={code as string} className="relative min-h-72 border-8 border-[#08080d] bg-[#fff4c4] p-5 shadow-[10px_10px_0_#08080d]">
                  <div className="absolute -right-4 -top-4 grid h-16 w-16 place-items-center border-4 border-[#08080d] bg-[#e63946] font-mono text-2xl font-black text-white">
                    {code as string}
                  </div>
                  <StepIcon className="size-12 text-[#1b2b72]" />
                  <h2 className="mt-10 font-mono text-2xl font-black uppercase">{title as string}</h2>
                  <p className="mt-4 text-sm font-bold leading-6 text-[#243044]">{text as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
