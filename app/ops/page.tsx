import Link from "next/link";
import { cookies } from "next/headers";
import {
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  ExternalLink,
  ServerCog,
} from "lucide-react";

import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import {
  CreamSection,
  DarkSection,
  PageHero,
  PageShell,
} from "@/components/site/RetroPage";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin/access";
import { getGameBackendSummary } from "@/lib/game/backend";
import { getOpsReadiness } from "@/lib/ops/readiness";

const pages = [
  ["/", "Landing"],
  ["/waitlist", "Waitlist"],
  ["/web3", "Web3"],
  ["/claim", "Claim"],
  ["/bankr", "Bankr"],
  ["/admin", "Admin"],
  ["/api-docs", "API Docs"],
  ["/roadmap", "Roadmap"],
  ["/assets", "Assets"],
  ["/game", "Game"],
];

const nextActions = [
  "Isi env production di Vercel.",
  "Daftarkan OAuth callback Google dan X.",
  "Ganti WalletConnect demo project id.",
  "Buat Bankr API key dengan izin minimum.",
  "Aktifkan x402 hanya setelah claim dan anti-cheat stabil.",
];

type OpsPageProps = {
  searchParams?: Promise<{
    admin?: string;
  }>;
};

export default async function OpsPage({ searchParams }: OpsPageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const hasAdminSession = isValidAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );
  const readiness = getOpsReadiness();
  const summary = hasAdminSession ? await getGameBackendSummary() : null;

  return (
    <PageShell>
      <PageHero
        eyebrow="Ops Readiness"
        title="Deploy board for Meki."
        text="Halaman ini merangkum kesiapan env, halaman, Web3, waitlist, Bankr, dan langkah production tanpa membuka secret."
      />
      {!hasAdminSession ? (
        <AdminLoginPanel redirectTo="/ops" invalid={params?.admin === "invalid"} />
      ) : null}
      <CreamSection>
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <article className="border-4 border-[#08080d] bg-white p-5 shadow-[8px_8px_0_#08080d]">
            <ServerCog className="size-9 text-[#e63946]" />
            <h2 className="mt-5 font-display text-3xl font-black uppercase">
              {readiness.percent}% Ready
            </h2>
            <p className="mt-3 font-pixel-body text-sm font-normal leading-6 text-[#243044]">
              {readiness.configuredCount} dari {readiness.total} kebutuhan env
              utama sudah terdeteksi.
            </p>
          </article>
          <div className="grid gap-4 sm:grid-cols-2">
            {readiness.items.map((item) => {
              const Icon = item.configured ? CheckCircle2 : CircleDashed;

              return (
                <article
                  key={item.key}
                  className="border-4 border-[#08080d] bg-[#fff4c4] p-4 shadow-[6px_6px_0_#08080d]"
                >
                  <Icon
                    className={
                      item.configured
                        ? "size-7 text-[#1f7a3f]"
                        : "size-7 text-[#e63946]"
                    }
                  />
                  <h3 className="mt-3 font-display text-[11px] font-black uppercase">
                    {item.label}
                  </h3>
                  <p className="mt-2 font-pixel-body text-sm font-normal leading-6 text-[#243044]">
                    {item.note}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </CreamSection>
      {summary ? (
        <section className="border-b-8 border-[#08080d] bg-[#ffd166] px-5 py-12 text-[#08080d] sm:px-8">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-4">
            <OpsMetric label="Waitlist" value={summary.waitlist.length} />
            <OpsMetric label="Rewards" value={summary.rewards.length} />
            <OpsMetric label="Claims" value={summary.claims.length} />
            <OpsMetric label="Duplicate Risk" value={summary.report.claims.duplicateRisk} />
          </div>
          <div className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-2">
            <section className="border-4 border-[#08080d] bg-white p-5 shadow-[8px_8px_0_#08080d]">
              <h2 className="font-display text-lg font-black uppercase">
                Waitlist Backend
              </h2>
              <div className="mt-4 max-h-80 overflow-auto border-4 border-[#08080d] bg-[#fff4c4] p-4">
                {summary.waitlist.length ? (
                  summary.waitlist.map((user) => (
                    <div
                      key={`${user.provider}:${user.id || user.email || user.handle}`}
                      className="mb-3 border-4 border-[#08080d] bg-white p-3 last:mb-0"
                    >
                      <p className="font-display text-[10px] font-black uppercase text-[#e63946]">
                        {user.provider}
                      </p>
                      <p className="mt-1 font-pixel-body text-sm font-normal">
                        {user.name || user.handle || user.email || "Unnamed player"}
                      </p>
                      <p className="mt-1 font-pixel-body text-xs font-normal text-[#243044]">
                        {user.email || user.handle || user.joinedAt}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="font-display text-[10px] font-black uppercase">
                    No waitlist records yet.
                  </p>
                )}
              </div>
            </section>
            <section className="border-4 border-[#08080d] bg-[#111827] p-5 text-[#fff4c4] shadow-[8px_8px_0_#08080d]">
              <h2 className="font-display text-lg font-black uppercase text-[#ffd166]">
                Economy Report
              </h2>
              <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap border-4 border-[#000] bg-[#08080d] p-4 font-pixel-body text-xs leading-6 text-[#d7e7c4]">
                {JSON.stringify(summary.report, null, 2)}
              </pre>
            </section>
          </div>
        </section>
      ) : null}
      <DarkSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="border-4 border-[#08080d] bg-[#111827] p-5 shadow-[8px_8px_0_#000]">
            <ClipboardCheck className="size-8 text-[#ffd166]" />
            <h2 className="mt-4 font-display text-lg font-black uppercase text-[#fff4c4]">
              Page Map
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {pages.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center justify-between border-4 border-[#08080d] bg-[#fff4c4] px-4 py-3 font-display text-[10px] font-black uppercase text-[#08080d] shadow-[5px_5px_0_#000]"
                >
                  {label}
                  <ExternalLink className="size-4" />
                </Link>
              ))}
            </div>
          </section>
          <section className="border-4 border-[#08080d] bg-[#1b2b72] p-5 shadow-[8px_8px_0_#000]">
            <h2 className="font-display text-lg font-black uppercase text-[#ffd166]">
              Next Actions
            </h2>
            <div className="mt-5 grid gap-3">
              {nextActions.map((action, index) => (
                <div
                  key={action}
                  className="grid grid-cols-[44px_1fr] border-4 border-[#08080d] bg-[#fff4c4] text-[#08080d] shadow-[5px_5px_0_#000]"
                >
                  <span className="grid place-items-center border-r-4 border-[#08080d] font-display text-[10px] font-black">
                    {index + 1}
                  </span>
                  <p className="px-4 py-3 font-pixel-body text-sm font-normal">{action}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DarkSection>
    </PageShell>
  );
}

function OpsMetric({ label, value }: { label: string; value: number }) {
  return (
    <article className="border-4 border-[#08080d] bg-[#fff4c4] p-5 shadow-[7px_7px_0_#08080d]">
      <p className="font-display text-[10px] font-black uppercase text-[#e63946]">
        {label}
      </p>
      <p className="mt-3 font-display text-4xl font-black uppercase">{value}</p>
    </article>
  );
}
