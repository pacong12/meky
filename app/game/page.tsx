import type { Metadata } from "next";
import GameClient from "@/components/game/GameClient";
import { Navbar } from "@/components/site/Navbar";

export const metadata: Metadata = {
  title: "Retromolt — Play",
  description: "Explore the pixel art world of Retromolt. Roam the village, find items, and unlock portal content.",
};

export default function GamePage() {
  return (
    <main className="w-full flex-1 flex flex-col bg-black">
      {/* Site Navbar */}
      <div className="bg-[#08080d]">
        <Navbar />
      </div>

      {/* Game Canvas Area — rendered by Client Component */}
      <GameClient />

      {/* Footer */}
      <footer className="text-center py-2 text-xs font-mono text-zinc-600 border-t border-zinc-800">
        WASD / Arrow Keys to move · E to interact · ESC to close dialog
      </footer>
    </main>
  );
}
