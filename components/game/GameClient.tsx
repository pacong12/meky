"use client";

import dynamic from "next/dynamic";

const RetroAdventure = dynamic(
  () => import("@/components/game/RetroAdventure"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-black text-yellow-400 font-mono text-sm animate-pulse">
        Memuat Meki Adventure...
      </div>
    ),
  }
);

export default function GameClient() {
  return (
    <div className="flex-1 flex items-center justify-center bg-black p-4">
      <RetroAdventure />
    </div>
  );
}
