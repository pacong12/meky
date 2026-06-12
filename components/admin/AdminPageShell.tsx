import Link from "next/link";
import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin/access";

import { AdminLoginPanel } from "./AdminLoginPanel";

const adminNav = [
  ["/admin", "Overview"],
  ["/admin/waitlist", "Waitlist"],
  ["/admin/claims", "Claims"],
  ["/admin/rewards", "Rewards"],
  ["/ops", "Ops"],
  ["/bankr", "Bankr"],
];

export async function AdminPageShell({
  title,
  text,
  redirectTo,
  searchParams,
  children,
}: {
  title: string;
  text: string;
  redirectTo: string;
  searchParams?: Promise<{ admin?: string }>;
  children: React.ReactNode;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const hasAdminSession = isValidAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );

  return (
    <main className="min-h-screen bg-[#08080d] text-[#fff4c4]">
      <section className="border-b-8 border-[#08080d] bg-[#1b2b72] px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex border-4 border-[#08080d] bg-[#e63946] px-3 py-2 font-mono text-xs font-black uppercase text-white shadow-[4px_4px_0_#08080d]"
          >
            Meki Admin
          </Link>
          <h1 className="mt-6 font-mono text-4xl font-black uppercase tracking-normal text-[#fff4c4] [text-shadow:5px_5px_0_#08080d] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl border-l-8 border-[#ffd166] bg-[#08080d]/75 px-5 py-4 font-mono text-sm font-bold leading-7 text-white shadow-[6px_6px_0_#08080d]">
            {text}
          </p>
          <nav className="mt-6 flex flex-wrap gap-3">
            {adminNav.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="border-2 border-[#08080d] bg-[#fff4c4] px-3 py-2 font-mono text-[11px] font-black uppercase text-[#1b2b72] shadow-[3px_3px_0_#08080d]"
              >
                {label}
              </Link>
            ))}
            {hasAdminSession ? (
              <Link
                href="/api/admin/logout"
                className="border-2 border-[#08080d] bg-[#ffd166] px-3 py-2 font-mono text-[11px] font-black uppercase text-[#08080d] shadow-[3px_3px_0_#08080d]"
              >
                Logout
              </Link>
            ) : null}
          </nav>
        </div>
      </section>
      {hasAdminSession ? (
        <section className="px-5 py-10 sm:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </section>
      ) : (
        <AdminLoginPanel redirectTo={redirectTo} invalid={params?.admin === "invalid"} />
      )}
    </main>
  );
}
