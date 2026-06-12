import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { rewardCatalog } from "@/lib/game/rewards";

type PageProps = {
  searchParams?: Promise<{ admin?: string }>;
};

export default async function AdminRewardsPage({ searchParams }: PageProps) {
  return (
    <AdminPageShell
      title="Rewards"
      text="Catalog badge, cosmetic, title, dan frame yang siap disambungkan ke claim."
      redirectTo="/admin/rewards"
      searchParams={searchParams}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {rewardCatalog.map((reward) => (
          <article
            key={reward.rewardId}
            className="border-4 border-[#08080d] bg-[#fff4c4] p-4 text-[#08080d] shadow-[6px_6px_0_#000]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-mono text-lg font-black uppercase">
                {reward.name}
              </h2>
              <span className="border-4 border-[#08080d] bg-[#ffd166] px-3 py-2 font-mono text-xs font-black uppercase">
                {reward.active ? "Active" : "Draft"}
              </span>
            </div>
            <p className="mt-3 text-sm font-bold leading-6 text-[#243044]">
              {reward.description}
            </p>
            <p className="mt-3 font-mono text-xs font-black uppercase text-[#e63946]">
              {reward.type} / {reward.requiredObjectiveId}
            </p>
          </article>
        ))}
      </div>
    </AdminPageShell>
  );
}
