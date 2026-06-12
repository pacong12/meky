import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/8bit/button";

export function AdminLoginPanel({
  redirectTo,
  invalid = false,
}: {
  redirectTo: string;
  invalid?: boolean;
}) {
  return (
    <section className="border-b-8 border-[#08080d] bg-[#090a12] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-xl border-4 border-[#08080d] bg-[#fff4c4] p-5 text-[#08080d] shadow-[8px_8px_0_#000]">
        <div className="flex items-center gap-3">
          <LockKeyhole className="size-7 text-[#e63946]" />
          <h2 className="font-display text-xl font-black uppercase">
            Admin Gate
          </h2>
        </div>
        <p className="mt-4 font-pixel-body text-sm font-normal leading-6 text-[#243044]">
          Masukkan admin token untuk membuka console internal.
        </p>
        {invalid ? (
          <p className="mt-4 border-4 border-[#08080d] bg-[#e63946] px-4 py-3 font-display text-[10px] font-black uppercase text-white">
            Token salah atau belum diset di environment.
          </p>
        ) : null}
        <form action="/api/admin/login" method="post" className="mt-6">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <label className="block font-display text-[10px] font-black uppercase">
            Admin token
          </label>
          <input
            name="token"
            type="password"
            className="mt-2 w-full border-4 border-[#08080d] bg-white px-4 py-3 font-pixel-body text-sm font-normal outline-none focus:bg-[#ffd166]"
            placeholder="ADMIN_CONSOLE_TOKEN"
            required
          />
          <Button
            type="submit"
            font="retro"
            variant="default"
            size="lg"
            className="mt-5 w-full"
          >
            Open Console
          </Button>
        </form>
      </div>
    </section>
  );
}
