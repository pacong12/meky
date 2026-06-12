import { Bot, Cable, LockKeyhole, ServerCog } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { BankrConsole } from "@/components/bankr/BankrConsole";
import {
  CreamSection,
  DarkSection,
  PageHero,
  PageShell,
  PixelCard,
} from "@/components/site/RetroPage";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin/access";

const readiness = [
  {
    title: "Server-only API",
    text: "Bankr API key disimpan di env backend dan dipanggil lewat route lokal.",
    icon: LockKeyhole,
  },
  {
    title: "Agent Commands",
    text: "Prompt Bankr dipakai untuk operasi admin, laporan ekonomi, dan treasury check.",
    icon: Bot,
  },
  {
    title: "Wallet Readiness",
    text: "Endpoint wallet memakai /wallet/me agar siap setelah /agent/me deprecated.",
    icon: Cable,
  },
  {
    title: "Admin Gate",
    text: "Console butuh BANKR_ADMIN_TOKEN sebelum bisa memanggil endpoint sensitif.",
    icon: ServerCog,
  },
];

type BankrPageProps = {
  searchParams?: Promise<{
    admin?: string;
  }>;
};

export default async function BankrPage({ searchParams }: BankrPageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const hasAdminSession = isValidAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );

  return (
    <PageShell>
      <PageHero
        eyebrow="Bankr.bot Console"
        title="Agent layer for the game economy."
        text="Bankr diposisikan sebagai terminal admin untuk wallet, agent prompt, laporan reward, dan integrasi x402 nanti."
      />
      <CreamSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {readiness.map((item) => (
            <PixelCard key={item.title} {...item} />
          ))}
        </div>
      </CreamSection>
      {hasAdminSession ? (
        <DarkSection>
          <div className="mb-6 flex justify-end">
            <Link
              href="/api/admin/logout"
              className="border-4 border-[#08080d] bg-[#ffd166] px-4 py-2 font-mono text-xs font-black uppercase text-[#08080d] shadow-[5px_5px_0_#000]"
            >
              Logout Admin
            </Link>
          </div>
          <BankrConsole />
        </DarkSection>
      ) : (
        <AdminLoginPanel redirectTo="/bankr" invalid={params?.admin === "invalid"} />
      )}
    </PageShell>
  );
}
