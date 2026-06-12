import { FileText, ShieldCheck, Wallet } from "lucide-react";

import { PageHero, PageShell } from "@/components/site/RetroPage";

const terms = [
  ["Play Access", "Game dapat dimainkan tanpa wallet. Wallet dipakai untuk claim dan ownership reward.", FileText],
  ["Original Assets", "Asset harus original, dibuat sendiri, generated, atau memiliki lisensi yang sesuai.", ShieldCheck],
  ["Wallet Risk", "Player bertanggung jawab atas wallet, signature, dan transaksi yang mereka setujui.", Wallet],
];

export default function TermsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Legal console"
        title="Terms of play."
        text="Terms awal untuk deploy. Isi final bisa diperluas saat contract, claim, dan server progress sudah aktif."
      />
      <section className="bg-[#090a12] px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-5xl border-8 border-[#08080d] bg-[#fff4c4] p-5 text-[#08080d] shadow-[12px_12px_0_#000]">
          <div className="border-4 border-[#08080d] bg-[#1b2b72] px-4 py-3 font-mono text-sm font-black uppercase text-[#fff4c4]">
            Terms cartridge log
          </div>
          <div className="mt-5 divide-y-4 divide-[#08080d] border-4 border-[#08080d] bg-white">
            {terms.map(([title, text, Icon]) => {
              const TermIcon = Icon as typeof FileText;
              return (
                <article key={title as string} className="grid gap-4 p-5 sm:grid-cols-[64px_1fr]">
                  <div className="grid h-16 w-16 place-items-center border-4 border-[#08080d] bg-[#ffd166]">
                    <TermIcon className="size-8" />
                  </div>
                  <div>
                    <h2 className="font-mono text-lg font-black uppercase">{title as string}</h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-[#243044]">{text as string}</p>
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
