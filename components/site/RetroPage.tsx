import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/8bit/card";

export const siteNav = [
  { href: "/about", label: "About" },
  { href: "/systems", label: "Systems" },
  { href: "/web3", label: "Web3" },
  { href: "/bankr", label: "Bankr" },
  { href: "/ops", label: "Ops" },
  { href: "/api-docs", label: "API" },
  { href: "/admin", label: "Admin" },
  { href: "/claim", label: "Claim" },
  { href: "/waitlist", label: "Waitlist" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/assets", label: "Assets" },
];

export function SiteHeader() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Link
        href="/"
        className="border-4 border-[#08080d] bg-[#e63946] px-3 py-2 font-display text-[11px] font-black uppercase leading-none text-white shadow-[4px_4px_0_#08080d]"
      >
        Meki Web3
      </Link>
      <nav className="hidden items-center gap-3 font-display text-[10px] font-black uppercase sm:flex">
        {siteNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border-4 border-[#08080d] bg-[#fff4c4] px-3 py-2 font-display text-[10px] font-black uppercase text-[#1b2b72] shadow-[4px_4px_0_#08080d] hover:-translate-y-1 hover:bg-[#ffd166]"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/game"
          className="border-4 border-[#08080d] bg-[#e63946] px-3 py-2 font-display text-[10px] font-black uppercase text-white shadow-[4px_4px_0_#08080d] hover:-translate-y-1 hover:bg-[#ff4d5e]"
        >
          Play
        </Link>
      </nav>
    </header>
  );
}

export function RetroBackdrop() {
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
      <div className="absolute inset-0 [background-image:linear-gradient(90deg,rgba(255,255,255,.08)_2px,transparent_2px),linear-gradient(rgba(255,255,255,.08)_2px,transparent_2px)] [background-size:32px_32px]" />
    </div>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#08080d] text-[#fff4c4]">
      {children}
      <SiteFooter />
    </main>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#08080d] px-5 py-8 text-[#fff4c4] sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 border-4 border-[#000] bg-[#111827] p-5 shadow-[7px_7px_0_#000] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-[10px] font-black uppercase text-[#ffd166]">
          Meki Adventure
        </p>
        <nav className="flex flex-wrap gap-3 font-display text-[10px] font-black uppercase">
          <Link href="/terms" className="hover:text-[#ffd166]">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-[#ffd166]">
            Privacy
          </Link>
          <Link href="/assets" className="hover:text-[#ffd166]">
            Assets
          </Link>
          <Link href="/game" className="hover:text-[#ffd166]">
            Play
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b-8 border-[#08080d] bg-[#1b2b72]">
      <RetroBackdrop />
      <SiteHeader />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8">
        <div className="inline-flex border-4 border-[#08080d] bg-[#ffd166] px-4 py-2 font-display text-[10px] font-black uppercase text-[#08080d] shadow-[5px_5px_0_#08080d]">
          {eyebrow}
        </div>
        <h1 className="mt-6 max-w-4xl font-display text-[2.6rem] font-black uppercase leading-[0.98] tracking-normal text-[#fff4c4] [text-shadow:5px_5px_0_#08080d] sm:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl border-l-8 border-[#ffd166] bg-[#08080d]/75 px-5 py-4 font-pixel-body text-sm font-normal leading-7 text-white shadow-[6px_6px_0_#08080d] sm:text-base">
          {text}
        </p>
      </div>
    </section>
  );
}

export function CreamSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-b-8 border-[#08080d] bg-[#fff4c4] px-5 py-12 text-[#08080d] sm:px-8">
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function DarkSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-b-8 border-[#08080d] bg-[#090a12] px-5 py-12 text-[#fff4c4] sm:px-8">
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function PixelCard({
  title,
  text,
  icon: Icon,
  dark = false,
}: {
  title: string;
  text: string;
  icon?: LucideIcon;
  dark?: boolean;
}) {
  return (
      <Card
        font="retro"
        className={
          dark
            ? "border-[#08080d] bg-[#1b2b72] shadow-[7px_7px_0_#000]"
          : "border-[#08080d] bg-[#fff4c4] shadow-[7px_7px_0_#08080d]"
      }
    >
      <div className="p-5">
        {Icon ? (
          <Icon
            className={dark ? "size-8 text-[#ffd166]" : "size-8 text-[#1b2b72]"}
          />
        ) : null}
        <h2
          className={
            dark
              ? "mt-4 font-display text-lg font-black uppercase text-[#ffd166]"
              : "mt-4 font-display text-lg font-black uppercase text-[#08080d]"
          }
        >
          {title}
        </h2>
        <p
          className={
            dark
              ? "mt-3 font-pixel-body text-sm font-normal leading-6 text-[#fff4c4]"
              : "mt-3 font-pixel-body text-sm font-normal leading-6 text-[#243044]"
          }
        >
          {text}
        </p>
      </div>
    </Card>
  );
}

export function PageCta({ label = "Play Game" }: { label?: string }) {
  return (
    <Link
      href="/game"
      className="inline-flex h-14 items-center justify-center border-4 border-[#08080d] bg-[#e63946] px-6 font-display text-[10px] font-black uppercase text-white shadow-[6px_6px_0_#000] transition-transform hover:-translate-y-1 active:translate-y-1"
    >
      {label}
    </Link>
  );
}
