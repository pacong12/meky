import type { Metadata } from "next";
import GameClient from "@/components/game/GameClient";

export const metadata: Metadata = {
  title: "Meki Adventure — Retro Top-Down Game",
  description: "Eksplorasi dunia pixel art interaktif dari Meki Adventure. Jelajahi Meki Village, temukan item, dan buka portal konten website.",
};

export default function GamePage() {
  return (
    <main className="w-full flex-1 flex flex-col bg-black">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-yellow-500/20">
        <div className="font-mono font-bold text-yellow-400 text-sm tracking-widest">
          ◈ MEKI ADVENTURE
        </div>
        <div className="text-xs font-mono text-zinc-500">
          Pixel Quest · v0.1 Prototype
        </div>
      </header>

      {/* Game Canvas Area — rendered by Client Component */}
      <GameClient />

      {/* Footer */}
      <footer className="text-center py-2 text-xs font-mono text-zinc-600 border-t border-zinc-800">
        WASD / Arrow Keys untuk bergerak · E untuk berinteraksi · ESC untuk menutup dialog
      </footer>
    </main>
  );
}
