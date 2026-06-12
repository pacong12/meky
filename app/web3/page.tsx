import { BadgeCheck, LockKeyhole, Server, Wallet } from "lucide-react";

import { PageHero, PageShell } from "@/components/site/RetroPage";
import { WalletStatus } from "@/components/web3/WalletStatus";

const terminals = [
  ["Wallet", "Optional identity, not a gameplay gate.", Wallet],
  ["Eligibility", "Quest progress unlocks claim rights.", LockKeyhole],
  ["Validation", "Server checks prevent fake reward claims.", Server],
  ["Badge", "Collectible rewards stay cosmetic first.", BadgeCheck],
];

export default function Web3Page() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Web3 terminal"
        title="Connect when the reward is ready."
        text="Halaman Web3 dibuat seperti terminal wallet: ringkas, teknis, dan jelas bahwa wallet tidak wajib untuk bermain."
      />
      <section className="bg-[#090a12] px-5 py-12 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-4 border-[#08080d] bg-[#111827] p-5 shadow-[8px_8px_0_#000]">
            <p className="font-mono text-xs font-black uppercase text-[#ffd166]">Wallet status</p>
            <h2 className="mt-4 font-mono text-3xl font-black uppercase text-[#fff4c4]">Player identity module</h2>
            <p className="mt-4 text-sm font-medium leading-6 text-[#d7e7c4]">
              Base Sepolia disiapkan sebagai chain utama development. Wallet
              connect menjadi optional layer untuk claim dan identity.
            </p>
            <div className="mt-8">
              <WalletStatus />
            </div>
          </div>
          <div className="grid gap-4">
            {terminals.map(([title, text, Icon]) => {
              const TerminalIcon = Icon as typeof Wallet;
              return (
                <article key={title as string} className="grid grid-cols-[72px_1fr] border-4 border-[#08080d] bg-[#1b2b72] shadow-[6px_6px_0_#000]">
                  <div className="grid place-items-center border-r-4 border-[#08080d] bg-[#ffd166]">
                    <TerminalIcon className="size-8 text-[#08080d]" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-mono text-base font-black uppercase text-[#fff4c4]">{title as string}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-[#d7e7c4]">{text as string}</p>
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
