# Roadmap Pembangunan Game

Roadmap ini dibuat untuk membantu membangun Meki Adventure secara bertahap. Fokusnya adalah membuat game yang playable dulu, lalu baru memperluas konten, polish, dan Web3.

## Prinsip Utama

- Game harus bisa dimainkan tanpa wallet.
- Core loop harus jelas sebelum menambah fitur.
- Web3 masuk sebagai lapisan reward/koleksi, bukan syarat bermain.
- Setiap milestone harus menghasilkan sesuatu yang bisa dicoba.
- Jangan menyalin aset, nama, musik, map, atau simbol dari game Nintendo/Zelda.

## Milestone 0: Fondasi Project

Status: sebagian besar sudah ada.

Target:

- Next.js project siap.
- 8bitcn/shadcn siap untuk UI retro.
- Folder asset game tersedia.
- Dokumentasi konsep tersedia.
- Landing page mengarah ke `/game`.

Checklist:

- [x] Landing page retro selesai.
- [x] Route `/game` tersedia.
- [x] Sprite awal tersedia.
- [x] Dokumen karakter tersedia.
- [x] Dokumen module/setup tersedia.

## Milestone 1: Playable Prototype

Tujuan: membuktikan game bisa dimainkan dalam 1 sampai 3 menit.

Fitur wajib:

- Player bisa bergerak dengan `WASD` dan arrow keys.
- Collision dasar dengan tembok/pohon/air.
- Satu map kecil.
- Satu NPC tutorial.
- Satu dialog box.
- Satu peti.
- Satu item/kunci.
- Satu pintu/objective selesai.

Deliverable:

- Player masuk map.
- Bicara dengan NPC.
- Ambil item dari peti.
- Gunakan item untuk membuka pintu atau area.
- Ada pesan selesai.

Kriteria selesai:

- Bisa dimainkan dari awal sampai objective selesai.
- Tidak butuh membaca instruksi panjang.
- Tidak ada bug besar seperti player tembus map atau dialog terkunci.

## Milestone 2: Game Feel

Tujuan: membuat prototype terasa enak dimainkan.

Fitur:

- Animasi idle dan walk.
- Arah hadap karakter.
- Interact prompt yang jelas.
- Kamera/framing nyaman.
- Respons input lebih halus.
- Feedback saat membuka peti, mengambil item, dan membuka pintu.

Polish:

- Sprite player konsisten.
- NPC terlihat berbeda.
- Tile map lebih rapi.
- Dialog tidak menutupi aksi penting.
- Mobile control dasar jika target mobile.

Kriteria selesai:

- Player tahu apa yang bisa diinteraksikan.
- Movement terasa responsif.
- Tampilan tidak terasa seperti debug prototype.

## Milestone 3: Content Website Dalam Game

Tujuan: konten website mulai hidup di dalam gameplay.

Area konten:

- Profil: NPC guide.
- Project: builder/crafter NPC atau gedung workshop.
- Skill: archivist/library.
- Contact: shrine/portal.

Fitur:

- NPC membuka panel konten.
- Project bisa dibuka dari objek/area.
- Skill ditampilkan sebagai badge/item.
- Contact muncul sebagai portal akhir.

Kriteria selesai:

- Website bisa dinavigasi lewat game.
- Konten tidak terasa seperti landing page biasa.
- Player bisa menemukan semua section utama lewat eksplorasi.

## Milestone 4: Map dan Quest

Tujuan: memberi struktur petualangan yang lebih jelas.

Map awal:

- Village.
- Forest.
- Cave.
- Shrine.

Quest awal:

1. Bicara dengan Guide.
2. Cari Forest Key.
3. Buka gerbang Cave.
4. Temui Archivist.
5. Aktifkan Shrine.
6. Buka contact/end screen.

Fitur:

- Quest state.
- Objective HUD kecil.
- Area lock/unlock.
- Minimal 2 puzzle ringan.

Kriteria selesai:

- Ada progres yang terasa.
- Player tidak bingung tujuan berikutnya.
- Map tetap kecil tapi punya rasa eksplorasi.

## Milestone 5: Save Progress

Tujuan: progres tidak hilang saat refresh.

Fitur:

- Save inventory.
- Save completed objectives.
- Save unlocked areas.
- Save opened chests.
- Reset progress button.

Storage awal:

- `localStorage`

Struktur data contoh:

```ts
type GameProgress = {
  inventory: string[];
  openedChests: string[];
  completedObjectives: string[];
  unlockedAreas: string[];
  lastSavedAt: string;
};
```

Kriteria selesai:

- Refresh halaman tidak menghapus progress.
- Reset bisa mengembalikan game ke awal.

## Milestone 6: Audio dan Atmosfer

Tujuan: menambah feel retro tanpa mengganggu.

Fitur:

- Sound effect jalan/interaksi.
- Sound peti.
- Sound item pickup.
- Sound pintu terbuka.
- Musik loop pendek.
- Mute toggle.

Module:

- `howler`

Kriteria selesai:

- Audio bisa dimatikan.
- Tidak ada musik/aset audio berlisensi Nintendo.
- Sound tidak terlalu keras atau repetitif.

## Milestone 7: UI Retro Lengkap

Tujuan: semua panel terasa bagian dari game.

UI:

- Start screen.
- Pause menu.
- Inventory HUD.
- Dialog box.
- Quest HUD.
- Project modal.
- Contact/end screen.

Komponen:

- 8bit button.
- 8bit dialog/card.
- Health/xp/mana bar jika cocok.

Kriteria selesai:

- UI konsisten retro.
- Tidak ada card modern yang terasa keluar dari tema.
- Text tetap terbaca di desktop dan mobile.

## Milestone 8: Web3 Foundation

Tujuan: menyiapkan wallet tanpa mengganggu pemain non-wallet.

Fitur:

- Optional connect wallet.
- Tampilkan address pendek.
- Link progress ke wallet.
- Tidak ada transaksi wajib.

Module:

- `wagmi`
- `viem`
- `@rainbow-me/rainbowkit`
- `@tanstack/react-query`
- `zod`

Kriteria selesai:

- Game tetap playable tanpa wallet.
- Wallet connect tidak muncul sebagai blocker.
- Tidak ada private key di frontend.

## Milestone 9: Web3 Collectible Badge

Tujuan: reward Web3 pertama.

Fitur:

- Badge untuk menyelesaikan quest.
- Claim eligibility dari server.
- Mint/claim hanya setelah objective valid.
- Status claim tersimpan.

Flow:

1. Player menyelesaikan quest.
2. Progress divalidasi.
3. Player connect wallet.
4. Player claim badge.
5. Badge muncul di profile/inventory.

Kriteria selesai:

- Tidak bisa claim berulang tanpa aturan.
- Tidak bisa claim hanya dengan memalsukan state client.
- Badge adalah kosmetik, bukan pay-to-win.

## Milestone 10: Content Expansion

Tujuan: menambah replay value.

Ide:

- Area baru.
- Quest musiman.
- NPC baru.
- Puzzle baru.
- Cosmetic skin.
- Badge event.
- Leaderboard off-chain.

Kriteria selesai:

- Konten baru tidak merusak core loop.
- Asset tetap original.
- Progress lama tetap kompatibel.

## Prioritas Saat Ini

Urutan paling sehat untuk dikerjakan:

1. Selesaikan playable prototype.
2. Rapikan movement, collision, dan dialog.
3. Masukkan konten website ke NPC/object.
4. Tambah quest state dan save progress.
5. Baru masuk wallet optional.

## Backlog Ide

- Mini dungeon 3 ruangan.
- Puzzle tombol dan pintu.
- Peti rahasia.
- NPC yang berubah dialog setelah quest selesai.
- Cosmetic hat/skin.
- Achievement lokal.
- Badge Web3 untuk first clear.
- Seasonal quest.

## Risiko

- Terlalu cepat masuk Web3 sebelum game seru.
- Terlalu banyak map sebelum core loop stabil.
- UI terlalu landing-page dan bukan game.
- Asset tidak konsisten.
- Scope melebar ke token/marketplace terlalu awal.

## Definisi MVP Selesai

MVP game dianggap selesai jika:

- Player bisa mulai dari landing page.
- Masuk `/game`.
- Menyelesaikan satu quest kecil.
- Melihat minimal satu konten website dari interaksi game.
- Progress sederhana bisa disimpan.
- Game tetap original dan tidak memakai aset IP pihak lain.
