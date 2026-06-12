import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { listWaitlistUsers } from "@/lib/game/backend";

type PageProps = {
  searchParams?: Promise<{ admin?: string }>;
};

export default async function AdminWaitlistPage({ searchParams }: PageProps) {
  const users = await listWaitlistUsers();

  return (
    <AdminPageShell
      title="Waitlist"
      text="Data early access dari Google, X, dan email."
      redirectTo="/admin/waitlist"
      searchParams={searchParams}
    >
      <div className="grid gap-4">
        {users.length ? (
          users.map((user) => (
            <article
              key={`${user.provider}:${user.id || user.email || user.handle || user.joinedAt}`}
              className="border-4 border-[#08080d] bg-[#fff4c4] p-4 text-[#08080d] shadow-[6px_6px_0_#000]"
            >
              <p className="font-mono text-xs font-black uppercase text-[#e63946]">
                {user.provider}
              </p>
              <h2 className="mt-2 font-mono text-xl font-black uppercase">
                {user.name || user.handle || user.email || "Unnamed player"}
              </h2>
              <p className="mt-2 text-sm font-bold text-[#243044]">
                {user.email || user.handle || "No contact"} / {user.joinedAt}
              </p>
            </article>
          ))
        ) : (
          <p className="border-4 border-[#08080d] bg-[#fff4c4] p-5 font-mono text-sm font-black uppercase text-[#08080d]">
            No waitlist records yet.
          </p>
        )}
      </div>
    </AdminPageShell>
  );
}
