import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { getGameBackendSummary } from "@/lib/game/backend";

type AdminPageProps = {
  searchParams?: Promise<{ admin?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const summary = await getGameBackendSummary();

  return (
    <AdminPageShell
      title="Admin Overview"
      text="Dashboard internal untuk waitlist, claim, reward, economy, dan readiness."
      redirectTo="/admin"
      searchParams={searchParams}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Waitlist" value={summary.waitlist.length} />
        <Metric label="Rewards" value={summary.rewards.length} />
        <Metric label="Claims" value={summary.claims.length} />
        <Metric label="Risk" value={summary.report.claims.duplicateRisk} />
      </div>
    </AdminPageShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="border-4 border-[#08080d] bg-[#fff4c4] p-5 text-[#08080d] shadow-[7px_7px_0_#000]">
      <p className="font-mono text-xs font-black uppercase text-[#e63946]">
        {label}
      </p>
      <p className="mt-3 font-mono text-4xl font-black uppercase">{value}</p>
    </article>
  );
}
