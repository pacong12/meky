import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Coins,
  Gamepad2,
  Pickaxe,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wallet,
} from "lucide-react";

import { WalletStatus } from "@/components/web3/WalletStatus";
import { SiteFooter } from "@/components/site/RetroPage";
import { Navbar } from "@/components/site/Navbar";

const web3Pillars = [
  {
    title: "Play First",
    text: "The game is fully playable without a wallet. Web3 only adds identity, claims, and collectibles.",
    icon: Gamepad2,
  },
  {
    title: "Earn Badges",
    text: "Quests, mining, and boss clears unlock cosmetic badges that can be claimed on-chain later.",
    icon: Trophy,
  },
  {
    title: "Optional Wallet",
    text: "Wallet connect is used for ownership and reward claims — never to lock core gameplay.",
    icon: Wallet,
  },
];

const claimFlow = [
  "Clear quest",
  "Validate progress",
  "Connect wallet",
  "Claim badge",
];

const systems = [
  {
    title: "Leveling",
    text: "XP, HP, attack, stamina, and full character progression system.",
    icon: Sparkles,
  },
  {
    title: "Mining",
    text: "Stone, copper, crystal, and ancient fragments — gather resources for upgrades.",
    icon: Pickaxe,
  },
  {
    title: "Rewards",
    text: "Items, coins, unlocks, badges, and cosmetics — no pay-to-win mechanics.",
    icon: Coins,
  },
  {
    title: "Security",
    text: "High-value rewards are server-validated before being claimed on-chain.",
    icon: ShieldCheck,
  },
];

const roadmap = [
  {
    phase: "Alpha",
    title: "Core Adventure",
    text: "Movement, map, quests, NPCs, items, mining, and basic enemies.",
  },
  {
    phase: "Beta",
    title: "Player Progress",
    text: "Inventory, XP, quest state, unlocked areas, and local/server progress sync.",
  },
  {
    phase: "Genesis",
    title: "Wallet Layer",
    text: "Optional wallet connect for identity and reward eligibility.",
  },
  {
    phase: "Season 1",
    title: "Collectible Rewards",
    text: "Badges and cosmetics as first Web3 rewards after quest validation.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080d] text-[#fff4c4]">
      <section className="relative isolate min-h-[90svh] overflow-hidden border-b-8 border-[#08080d] bg-[#1b2b72]">
        <RetroBackdrop />

        <Navbar />

        <div className="relative z-10 mx-auto grid min-h-[calc(90svh-84px)] w-full max-w-6xl items-center gap-8 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[0.98fr_1.02fr]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex border-4 border-[#08080d] bg-[#ffd166] px-4 py-2 font-display text-[10px] font-black uppercase text-[#08080d] shadow-[5px_5px_0_#08080d]">
              Play first. Collect later.
            </div>
            <h1 className="max-w-3xl font-display text-[2.55rem] font-black uppercase leading-[0.95] tracking-normal text-[#fff4c4] [text-shadow:5px_5px_0_#08080d] sm:text-7xl lg:text-8xl">
              Retromolt
              <span className="block text-[#ffd166]">Web3 Ready</span>
            </h1>
            <p className="mt-6 max-w-xl border-l-8 border-[#ffd166] bg-[#08080d]/75 px-5 py-4 font-pixel-body text-sm font-normal leading-7 text-white shadow-[6px_6px_0_#08080d] sm:text-base">
              Retromolt is built as a playable retro game first, then expands
              into collectible badges, wallet identity, and validated reward
              claims.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
              <Link
              href="/game"
                className="inline-flex h-16 items-center justify-center gap-3 border-4 border-[#08080d] bg-[#e63946] px-7 font-display text-[10px] font-black uppercase text-white shadow-[7px_7px_0_#08080d] transition-transform hover:-translate-y-1 active:translate-y-1"
              >
                <Play className="size-5 fill-current" />
                Play Game
              </Link>
              <WalletStatus />
            </div>
            <Link
              href="/waitlist"
              className="mt-5 inline-flex border-4 border-[#08080d] bg-[#fff4c4] px-5 py-3 font-display text-[10px] font-black uppercase text-[#08080d] shadow-[6px_6px_0_#08080d] transition-transform hover:-translate-y-1 active:translate-y-1"
            >
              Join waitlist with Google or X
            </Link>

            <div className="mt-8 grid max-w-xl grid-cols-3 border-4 border-[#08080d] bg-[#fff4c4] font-display text-[#08080d] shadow-[6px_6px_0_#08080d]">
              <HudCell label="Chain" value="Base" />
              <HudCell label="Mode" value="Free" />
              <HudCell label="NFT" value="Badge" />
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden border-8 border-[#08080d] bg-[#13204d] shadow-[12px_12px_0_#08080d] sm:min-h-[520px]">
            <div className="absolute inset-0 [background-image:linear-gradient(90deg,rgba(255,255,255,.12)_2px,transparent_2px),linear-gradient(rgba(255,255,255,.12)_2px,transparent_2px)] [background-size:32px_32px]" />
            <div className="absolute left-4 right-4 top-4 border-4 border-[#08080d] bg-[#fff4c4] px-4 py-3 font-display text-[10px] font-black uppercase text-[#08080d] shadow-[5px_5px_0_#08080d]">
              Claim terminal: badge locked
            </div>

            <div className="absolute left-1/2 top-24 h-52 w-52 -translate-x-1/2 border-8 border-[#08080d] bg-[#ffd166] shadow-[10px_10px_0_#08080d]">
              <div className="absolute inset-5 border-4 border-[#08080d] bg-[#1b2b72]" />
              <BadgeCheck className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 text-[#fff4c4]" />
              <div className="absolute -bottom-12 left-1/2 w-40 -translate-x-1/2 border-4 border-[#08080d] bg-[#e63946] px-3 py-2 text-center font-display text-[10px] font-black uppercase text-white shadow-[5px_5px_0_#08080d]">
                First Clear
              </div>
            </div>

            <Image
              src="/game/sprites/player.png"
              alt="Kira player character"
              width={160}
              height={160}
              className="absolute bottom-12 left-6 h-32 w-32 object-contain [image-rendering:pixelated] sm:h-40 sm:w-40"
              priority
            />
            <Image
              src="/game/sprites/guide.png"
              alt="Eldrin guide character"
              width={140}
              height={140}
              className="absolute bottom-14 right-8 h-28 w-28 object-contain [image-rendering:pixelated] sm:h-36 sm:w-36"
              priority
            />

            <div className="absolute bottom-4 left-4 right-4 border-4 border-[#08080d] bg-[#08080d] px-4 py-3 font-display text-[10px] font-black uppercase text-[#ffd166] shadow-[5px_5px_0_#000]">
              No wallet required to play. Wallet is for claim.
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-8 border-[#08080d] bg-[#ffd166] px-5 py-10 text-[#08080d] sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
          {web3Pillars.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="border-4 border-[#08080d] bg-[#fff4c4] p-5 shadow-[7px_7px_0_#08080d]"
              >
                <Icon className="mb-4 size-8 text-[#e63946]" />
                <h2 className="font-display text-sm font-black uppercase">
                  {item.title}
                </h2>
                <p className="mt-3 font-pixel-body text-sm font-normal leading-6 text-[#243044]">
                  {item.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="systems"
        className="border-b-8 border-[#08080d] bg-[#fff4c4] px-5 py-12 text-[#08080d] sm:px-8"
      >
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="inline-flex border-4 border-[#08080d] bg-[#e63946] px-3 py-2 font-display text-[10px] font-black uppercase text-white shadow-[4px_4px_0_#08080d]">
              Game Systems
            </p>
            <h2 className="mt-5 max-w-md font-display text-3xl font-black uppercase leading-tight tracking-normal sm:text-5xl">
              Gameplay first, ownership later.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {systems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="border-4 border-[#08080d] bg-white p-5 shadow-[7px_7px_0_#08080d]"
                >
                  <Icon className="mb-5 size-8 text-[#1b2b72]" />
                  <h3 className="font-display text-sm font-black uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-pixel-body text-sm font-normal leading-6 text-[#243044]">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="claim" className="border-b-8 border-[#08080d] bg-[#090a12] px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="inline-flex border-4 border-[#08080d] bg-[#ffd166] px-3 py-2 font-display text-[10px] font-black uppercase text-[#08080d] shadow-[4px_4px_0_#000]">
                Reward Claim
              </p>
              <h2 className="mt-5 font-display text-3xl font-black uppercase tracking-normal text-[#fff4c4] [text-shadow:4px_4px_0_#000] sm:text-5xl">
                Badge flow
              </h2>
            </div>
            <Link
              href="/game"
              className="inline-flex h-14 items-center justify-center gap-2 border-4 border-[#08080d] bg-[#e63946] px-6 font-display text-[10px] font-black uppercase text-white shadow-[6px_6px_0_#000] transition-transform hover:-translate-y-1 active:translate-y-1"
            >
              <Gamepad2 className="size-4" />
              Start Quest
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {claimFlow.map((step, index) => (
              <article
                key={step}
                className="border-4 border-[#08080d] bg-[#1b2b72] p-5 shadow-[7px_7px_0_#000]"
              >
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center border-4 border-[#08080d] bg-[#ffd166] font-display text-[10px] font-black text-[#08080d]">
                  {index + 1}
                </div>
                <h3 className="font-display text-sm font-black uppercase text-[#fff4c4]">
                  {step}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff4c4] px-5 py-12 text-[#08080d] sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="inline-flex border-4 border-[#08080d] bg-[#1b2b72] px-3 py-2 font-display text-[10px] font-black uppercase text-white shadow-[4px_4px_0_#08080d]">
            Launch Roadmap
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-4">
            {roadmap.map((item) => (
              <article
                key={item.phase}
                className="border-4 border-[#08080d] bg-white p-5 shadow-[7px_7px_0_#08080d]"
              >
                <div className="mb-5 inline-flex border-4 border-[#08080d] bg-[#ffd166] px-3 py-2 font-display text-[10px] font-black uppercase">
                  {item.phase}
                </div>
                <h3 className="font-display text-sm font-black uppercase">
                  {item.title}
                </h3>
                <p className="mt-3 font-pixel-body text-sm font-normal leading-6 text-[#243044]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-8 border-[#08080d] bg-[#090a12] px-5 py-12 text-[#fff4c4] sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="inline-flex border-4 border-[#08080d] bg-[#ffd166] px-3 py-2 font-display text-[10px] font-black uppercase text-[#08080d] shadow-[4px_4px_0_#000]">
            The Creator
          </p>
          <div className="mt-8 border-4 border-[#08080d] bg-[#1b2b72] p-6 shadow-[8px_8px_0_#000]">
            <div className="grid gap-6 md:grid-cols-[160px_1fr] items-center">
              <div className="relative mx-auto w-40 h-40 border-4 border-[#08080d] bg-[#ffd166] p-2 shadow-[5px_5px_0_#08080d]">
                <Image
                  src="/game/sprites/builder.png"
                  alt="Sususegareq Developer & Owner Avatar"
                  width={140}
                  height={140}
                  className="w-full h-full object-contain [image-rendering:pixelated]"
                />
              </div>
              <div className="text-left">
                <div className="inline-flex border-2 border-[#08080d] bg-[#e63946] px-2 py-1 font-display text-[8px] font-black uppercase text-white mb-2 shadow-[2px_2px_0_#08080d]">
                  Developer & Owner
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-[#ffd166]">
                  Sususegareq
                </h3>
                <p className="mt-3 font-pixel-body text-base leading-6 text-slate-200 max-w-2xl">
                  Meet the builder behind Retromolt. Building this pixel art world from scratch, crafting gameplay systems, Web3 connections, and responsive retro mechanics.
                </p>
                <div className="mt-5">
                  <a
                    href="https://x.com/Sususegareq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-4 border-[#08080d] bg-[#ffd166] px-4 py-2 font-display text-[10px] font-black uppercase text-[#08080d] shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 hover:bg-white active:translate-y-0.5"
                  >
                    Follow on X
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function HudCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r-4 border-[#08080d] px-3 py-3 last:border-r-0">
      <div className="font-display text-[10px] font-black uppercase">{label}</div>
      <div className="mt-1 font-display text-lg font-black uppercase">{value}</div>
    </div>
  );
}

function RetroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_2px,transparent_2px)] bg-[length:100%_32px] opacity-35" />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-[#1b2b72]" />
      <div className="absolute left-[7%] top-[18%] h-4 w-4 bg-[#ffd166] shadow-[16px_0_0_#ffd166,32px_0_0_#ffd166,16px_16px_0_#ffd166]" />
      <div className="absolute left-[12%] top-[34%] h-10 w-20 bg-[#2f4aa0]" />
      <div className="absolute left-[10%] top-[40%] h-10 w-28 bg-[#213782]" />
      <div className="absolute right-[10%] top-[28%] h-8 w-24 bg-[#2f4aa0]" />
      <div className="absolute right-[7%] top-[35%] h-12 w-36 bg-[#213782]" />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[#1f7a3f]" />
      <div className="absolute inset-x-0 bottom-0 h-[18%] bg-[#c47a34]" />
      <div className="absolute inset-x-0 bottom-[18%] h-7 bg-[#53a84e]" />
      <div className="absolute bottom-[24%] left-[6%] h-16 w-16 bg-[#207a3c] shadow-[32px_0_0_#14532d,64px_16px_0_#207a3c,160px_-8px_0_#14532d,220px_28px_0_#207a3c]" />
      <div className="absolute bottom-[22%] right-[6%] h-16 w-16 bg-[#207a3c] shadow-[-32px_0_0_#14532d,-80px_24px_0_#207a3c,-180px_-10px_0_#14532d]" />
      <div className="absolute inset-0 [background-image:linear-gradient(90deg,rgba(255,255,255,.08)_2px,transparent_2px),linear-gradient(rgba(255,255,255,.08)_2px,transparent_2px)] [background-size:32px_32px]" />
    </div>
  );
}
