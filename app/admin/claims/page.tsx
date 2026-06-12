import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { listRewardClaims } from "@/lib/game/backend";

type PageProps = {
  searchParams?: Promise<{ admin?: string }>;
};

export default async function AdminClaimsPage({ searchParams }: PageProps) {
  const claims = await listRewardClaims();

  return (
    <AdminPageShell
      title="Claims"
      text="Draft claim reward, eligibility, rejected attempts, dan transaction hash."
      redirectTo="/admin/claims"
      searchParams={searchParams}
    >
      <div className="grid gap-4">
        {claims.length ? (
          claims.map((claim) => (
            <article
              key={claim.claimId}
              className="border-4 border-[#08080d] bg-[#fff4c4] p-4 text-[#08080d] shadow-[6px_6px_0_#000]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-mono text-lg font-black uppercase">
                  {claim.rewardId}
                </h2>
                <span className="border-4 border-[#08080d] bg-[#ffd166] px-3 py-2 font-mono text-xs font-black uppercase">
                  {claim.status}
                </span>
              </div>
              <p className="mt-3 break-all text-sm font-bold text-[#243044]">
                {claim.walletAddress}
              </p>
              <p className="mt-2 text-sm font-bold text-[#243044]">
                Objective: {claim.objectiveId}
              </p>
              {claim.transactionHash ? (
                <p className="mt-2 break-all text-xs font-bold text-[#243044]">
                  Tx: {claim.transactionHash}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <p className="border-4 border-[#08080d] bg-[#fff4c4] p-5 font-mono text-sm font-black uppercase text-[#08080d]">
            No claim records yet.
          </p>
        )}
      </div>
    </AdminPageShell>
  );
}
