import { cookies } from "next/headers";
import Link from "next/link";
import { Mail, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/8bit/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/8bit/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";

import {
  WAITLIST_COOKIE,
  decodeWaitlistUser,
} from "@/lib/auth/waitlist";
import { PageHero, PageShell } from "@/components/site/RetroPage";

const providerLabel = {
  google: "Google",
  x: "X",
  email: "Email",
};

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const cookieStore = await cookies();
  const user = decodeWaitlistUser(cookieStore.get(WAITLIST_COOKIE)?.value);
  const joined = typeof params.joined === "string" ? params.joined : null;
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <PageShell>
      <PageHero
        eyebrow="Waitlist access"
        title="Reserve your player slot."
        text="Join the Meki Adventure waitlist with Google, X, or email. Wallet stays optional; social login is only for early access updates."
      />

      <section className="bg-[#ffd166] px-5 py-12 text-[#08080d] sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-8 border-[#08080d] bg-[#fff4c4] p-5 shadow-[12px_12px_0_#08080d]">
            <div className="border-4 border-[#08080d] bg-[#1b2b72] px-4 py-3 font-display text-[10px] font-black uppercase text-[#fff4c4]">
              Login terminal
            </div>

            {user ? (
              <Card font="retro" className="mt-5 border-[#08080d] bg-white shadow-[8px_8px_0_#08080d]">
                <CardHeader className="p-5">
                  <div className="flex items-center gap-4">
                    <Avatar variant="pixel" className="size-16">
                      {user.picture ? <AvatarImage src={user.picture} alt={user.name || "Waitlist user"} /> : null}
                      <AvatarFallback className="rounded-none border-4 border-[#08080d] bg-[#ffd166] font-display text-[10px] font-black text-[#08080d]">
                        <UserPlus className="size-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-display text-[10px] font-black uppercase text-[#e63946]">
                        Joined via {providerLabel[user.provider]}
                      </p>
                      <CardTitle className="mt-1 font-display text-xl font-black uppercase text-[#08080d]">
                        {user.name || user.handle || user.email || "Early player"}
                      </CardTitle>
                      {user.email ? (
                        <p className="mt-1 font-pixel-body text-sm font-normal text-[#243044]">
                          {user.email}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <CardContent className="p-0 pt-6">
                    <Link
                      href="/api/auth/logout"
                      className="inline-flex h-14 items-center justify-center border-4 border-[#08080d] bg-[#e63946] px-5 font-display text-[10px] font-black uppercase text-white shadow-[5px_5px_0_#08080d] transition-transform hover:-translate-y-1 active:translate-y-1"
                    >
                      Leave session
                    </Link>
                  </CardContent>
                </CardHeader>
              </Card>
            ) : (
              <div className="mt-5 grid gap-4">
                <Link
                  href="/api/auth/google"
                  className="inline-flex h-16 items-center justify-center border-4 border-[#08080d] bg-white px-5 font-display text-[10px] font-black uppercase shadow-[6px_6px_0_#08080d] transition-transform hover:-translate-y-1 active:translate-y-1"
                >
                  Continue with Google
                </Link>
                <Link
                  href="/api/auth/x"
                  className="inline-flex h-16 items-center justify-center border-4 border-[#08080d] bg-[#08080d] px-5 font-display text-[10px] font-black uppercase text-white shadow-[6px_6px_0_#08080d] transition-transform hover:-translate-y-1 active:translate-y-1"
                >
                  Continue with X
                </Link>
              </div>
            )}

            {joined ? (
              <p className="mt-5 border-4 border-[#08080d] bg-[#6ab04c] px-4 py-3 font-display text-[10px] font-black uppercase text-white">
                Waitlist joined with {joined}.
              </p>
            ) : null}
            {error ? (
              <p className="mt-5 border-4 border-[#08080d] bg-[#e63946] px-4 py-3 font-display text-[10px] font-black uppercase text-white">
                Login needs configuration or retry: {error}.
              </p>
            ) : null}
          </div>

          <div className="border-8 border-[#08080d] bg-[#1b2b72] p-5 text-[#fff4c4] shadow-[12px_12px_0_#08080d]">
            <div className="border-4 border-[#08080d] bg-[#ffd166] px-4 py-3 font-display text-[10px] font-black uppercase text-[#08080d]">
              Email fallback
            </div>
            <form action="/api/waitlist" method="post" className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="font-display text-[10px] font-black uppercase text-[#ffd166]">
                  Name
                </span>
                <input
                  name="name"
                  placeholder="Kira"
                  className="h-14 border-4 border-[#08080d] bg-[#fff4c4] px-4 font-pixel-body text-sm font-normal text-[#08080d] outline-none"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-display text-[10px] font-black uppercase text-[#ffd166]">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="player@meki.quest"
                  className="h-14 border-4 border-[#08080d] bg-[#fff4c4] px-4 font-pixel-body text-sm font-normal text-[#08080d] outline-none"
                />
              </label>
              <Button type="submit" font="retro" variant="default" size="lg">
                <Mail className="size-5" />
                Join Waitlist
              </Button>
            </form>
            <div className="mt-6 border-4 border-[#08080d] bg-[#08080d] px-4 py-3 font-display text-[10px] font-black uppercase text-[#ffd166]">
              Social login requires OAuth env keys before production.
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
