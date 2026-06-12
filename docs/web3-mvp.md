# MVP dan Roadmap Web3

Dokumen ini mendefinisikan MVP untuk Meki Adventure sebagai web game retro yang nantinya bisa berkembang menjadi Web3 game. Prinsip utamanya: game harus seru dan playable dulu, Web3 hanya menambah kepemilikan, koleksi, dan progres, bukan menjadi hambatan utama.

## Prinsip MVP

- Playable sebelum Web3.
- Wallet bersifat opsional.
- Tidak ada pay-to-win di versi awal.
- Progress dasar bisa berjalan tanpa login.
- Item on-chain hanya untuk reward/koleksi yang sudah divalidasi.
- Jangan menyalin aset, nama, musik, atau simbol franchise Nintendo/Zelda.

## MVP V1: Playable Web Game

Target V1 adalah membuktikan bahwa game-nya menarik dimainkan.

Fitur wajib:

- Landing page retro dengan CTA ke game.
- Halaman `/game`.
- Karakter bisa bergerak.
- Collision dasar.
- Minimal 1 map kecil.
- Minimal 1 NPC tutorial.
- Minimal 1 peti/item.
- Minimal 1 objective selesai.
- Dialog box.
- Inventory lokal sederhana.

Fitur tidak wajib di V1:

- Wallet connect.
- NFT.
- Marketplace.
- Smart contract.
- Multiplayer.
- Token reward.

Output V1:

- Game bisa dimainkan 1 sampai 3 menit.
- Player paham tujuan tanpa membaca dokumentasi panjang.
- Ada rasa progres dari eksplorasi, item, dan interaksi.

## MVP V2: Account dan Progress

Target V2 adalah menyimpan progres tanpa langsung masuk on-chain.

Fitur:

- Save progress di `localStorage`.
- Optional account/login sederhana.
- Progress schema: area terbuka, item ditemukan, NPC sudah ditemui.
- Achievement lokal.
- Basic anti-cheat ringan di sisi server jika mulai ada reward.

Data progress contoh:

```ts
type GameProgress = {
  playerId?: string;
  completedObjectives: string[];
  inventory: string[];
  unlockedAreas: string[];
  achievements: string[];
  updatedAt: string;
};
```

## MVP V3: Wallet Optional

Target V3 adalah membuat wallet sebagai identitas tambahan, bukan syarat bermain.

Fitur:

- Connect wallet.
- Tampilkan wallet address pendek.
- Link progress lokal ke wallet.
- Wallet-gated claim untuk reward kosmetik.
- Tidak ada transaksi wajib untuk masuk game.

Module yang disarankan:

- `wagmi`
- `viem`
- `@rainbow-me/rainbowkit`
- `zod`

## MVP V4: Collectible Reward

Target V4 adalah reward Web3 pertama.

Reward yang cocok:

- Badge petualangan.
- Skin karakter.
- Title/profile frame.
- Trophy setelah menyelesaikan objective.

Reward yang sebaiknya dihindari di awal:

- Token ekonomi kompleks.
- Marketplace internal.
- Item yang memengaruhi kekuatan gameplay.
- NFT mint tanpa validasi progress.

Flow claim:

1. Player menyelesaikan objective.
2. Game menyimpan progress.
3. Server memvalidasi objective.
4. Server membuat claim eligibility.
5. Player connect wallet.
6. Player claim badge/kosmetik.

## Arsitektur Minimum Web3

```text
Game Client
  -> local progress
  -> optional wallet connect
  -> claim request

API Server
  -> validate objective
  -> create claim eligibility
  -> rate limit
  -> anti-cheat checks

Smart Contract
  -> mint badge/cosmetic
  -> verify claim signature
```

## Smart Contract Scope Awal

Contract pertama cukup sederhana:

- `AdventureBadge`
- ERC-721 atau ERC-1155
- Mint berdasarkan signed claim
- 1 wallet hanya bisa claim badge tertentu satu kali
- Metadata menunjuk ke asset original

Jangan mulai dari token ekonomi. Mulai dari collectible badge dulu.

## Data yang Perlu Disiapkan

Gameplay:

- Objective ID
- Item ID
- Area ID
- NPC ID
- Achievement ID

Web3:

- Wallet address
- Claim ID
- Badge ID
- Claim status
- Transaction hash

Asset:

- Badge image
- Badge metadata
- Character skin
- Cosmetic preview

## Security Checklist

- Jangan percaya progress dari client begitu saja jika reward bernilai.
- Jangan expose private key di frontend.
- Gunakan signed claim atau server-controlled mint authorization.
- Rate limit endpoint claim.
- Simpan log claim.
- Batasi duplicate claim.
- Hindari reward finansial sampai anti-cheat matang.

## Roadmap Ringkas

1. **V1 Playable**
   Game retro bisa dimainkan tanpa Web3.

2. **V2 Progress**
   Save progress dan achievement lokal/server.

3. **V3 Wallet**
   Wallet opsional untuk identitas dan claim.

4. **V4 Badge**
   Collectible Web3 pertama.

5. **V5 Seasonal Content**
   Quest/event terbatas dengan badge kosmetik.

## Keputusan MVP Saat Ini

Untuk sekarang, MVP yang dikerjakan adalah:

- Landing page retro.
- Playable game manual.
- Dokumentasi gameplay.
- Dokumentasi Web3 roadmap.
- Struktur module yang siap berkembang.

Belum dikerjakan:

- Wallet connect.
- Smart contract.
- NFT mint.
- Token.
- Marketplace.
