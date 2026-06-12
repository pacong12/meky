import {
  BookOpen,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";

import {
  CreamSection,
  DarkSection,
  PageHero,
  PageShell,
} from "@/components/site/RetroPage";

const endpoints = [
  {
    method: "POST",
    path: "/api/waitlist",
    auth: "Public + rate limit",
    body: "formData: name, email",
    note: "Join waitlist email fallback and save backend record.",
  },
  {
    method: "GET",
    path: "/api/admin/waitlist",
    auth: "Admin session",
    body: "-",
    note: "List waitlist records.",
  },
  {
    method: "GET",
    path: "/api/rewards",
    auth: "Public",
    body: "-",
    note: "Read reward catalog.",
  },
  {
    method: "GET",
    path: "/api/claims",
    auth: "Admin session",
    body: "-",
    note: "List claim records.",
  },
  {
    method: "POST",
    path: "/api/claims",
    auth: "Public + rate limit",
    body: "walletAddress, rewardId, objectiveId, playerId?",
    note: "Create eligible/signed or rejected claim draft.",
  },
  {
    method: "POST",
    path: "/api/claims",
    auth: "Admin session for complete action",
    body: "action=complete, claimId, transactionHash, signature?",
    note: "Mark claim as claimed after tx confirmation.",
  },
  {
    method: "GET",
    path: "/api/economy/report",
    auth: "Public read-only",
    body: "-",
    note: "Aggregate waitlist, reward, claim, mining, and enemy report.",
  },
  {
    method: "POST",
    path: "/api/bankr/agent",
    auth: "Admin session + rate limit",
    body: "prompt, threadId?, maxMode?",
    note: "Submit prompt to Bankr Agent API.",
  },
  {
    method: "GET",
    path: "/api/bankr/wallet",
    auth: "Admin session",
    body: "-",
    note: "Read Bankr wallet info via /wallet/me.",
  },
];

const docs = [
  ["Backend", "docs/backend-draft.md"],
  ["Schema", "docs/data-schema.md"],
  ["Deploy", "docs/deploy-checklist.md"],
  ["Bankr", "docs/bankr-integration.md"],
  ["Contracts", "docs/contracts.md"],
];

export default function ApiDocsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="API Docs"
        title="Backend map for Meki."
        text="Dokumentasi endpoint waitlist, reward, claim, economy, Bankr, dan admin agar game manual bisa nyambung ke backend."
      />
      <CreamSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DocCard
            icon={TerminalSquare}
            title="Public API"
            text="Waitlist, rewards, claim request, and economy report."
          />
          <DocCard
            icon={LockKeyhole}
            title="Admin API"
            text="Waitlist list, claim list, Bankr agent, and internal summary."
          />
          <DocCard
            icon={ShieldCheck}
            title="Security"
            text="Admin cookie, rate limit, signed claim draft, and server-only env."
          />
          <DocCard
            icon={KeyRound}
            title="Storage"
            text="JSON dev adapter or Supabase REST production adapter."
          />
        </div>
      </CreamSection>
      <DarkSection>
        <div className="grid gap-4">
          {endpoints.map((endpoint) => (
            <article
              key={`${endpoint.method}:${endpoint.path}:${endpoint.auth}`}
              className="border-4 border-[#08080d] bg-[#fff4c4] p-4 text-[#08080d] shadow-[6px_6px_0_#000]"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="border-4 border-[#08080d] bg-[#e63946] px-3 py-2 font-mono text-xs font-black uppercase text-white">
                  {endpoint.method}
                </span>
                <h2 className="break-all font-mono text-base font-black uppercase">
                  {endpoint.path}
                </h2>
              </div>
              <p className="mt-3 text-sm font-bold text-[#243044]">
                Auth: {endpoint.auth}
              </p>
              <p className="mt-2 text-sm font-bold text-[#243044]">
                Body: {endpoint.body}
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#243044]">
                {endpoint.note}
              </p>
            </article>
          ))}
        </div>
      </DarkSection>
      <CreamSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {docs.map(([label, filePath]) => (
            <article
              key={filePath}
              className="border-4 border-[#08080d] bg-white p-4 font-mono text-xs font-black uppercase text-[#08080d] shadow-[6px_6px_0_#08080d]"
            >
              <BookOpen className="mb-4 size-7 text-[#1b2b72]" />
              <p>{label}</p>
              <p className="mt-3 break-all text-[10px] text-[#243044]">
                {filePath}
              </p>
            </article>
          ))}
        </div>
      </CreamSection>
    </PageShell>
  );
}

function DocCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof TerminalSquare;
  title: string;
  text: string;
}) {
  return (
    <article className="border-4 border-[#08080d] bg-white p-5 shadow-[7px_7px_0_#08080d]">
      <Icon className="size-8 text-[#e63946]" />
      <h2 className="mt-4 font-mono text-base font-black uppercase">
        {title}
      </h2>
      <p className="mt-3 text-sm font-bold leading-6 text-[#243044]">{text}</p>
    </article>
  );
}
