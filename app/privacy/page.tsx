import { Database, EyeOff, Wallet } from "lucide-react";

import { PageHero, PageShell } from "@/components/site/RetroPage";

const privacy = [
  { title: "Local Progress", text: "Progress game dapat disimpan lokal melalui browser sebelum server progress aktif.", icon: Database },
  { title: "Wallet Address", text: "Wallet address bersifat publik di blockchain dan dapat dipakai untuk claim eligibility.", icon: Wallet },
  { title: "No Private Keys", text: "Aplikasi tidak meminta, menyimpan, atau mengelola private key player.", icon: EyeOff },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Privacy terminal"
        title="Data, wallet, and player privacy."
        text="Privacy page dibuat seperti terminal data: apa yang disimpan, apa yang publik, dan apa yang tidak pernah diminta."
      />
      <section className="bg-[#fff4c4] px-5 py-12 text-[#08080d] sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_1fr_1fr]">
          {privacy.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="overflow-hidden border-4 border-[#08080d] bg-white shadow-[8px_8px_0_#08080d]">
                <div className="h-5 bg-[repeating-linear-gradient(90deg,#e63946_0_16px,#ffd166_16px_32px,#1b2b72_32px_48px)]" />
                <div className="p-5">
                  <Icon className="mb-5 size-10 text-[#1b2b72]" />
                  <h2 className="font-mono text-xl font-black uppercase">{item.title}</h2>
                  <p className="mt-3 text-sm font-medium leading-6 text-[#243044]">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
