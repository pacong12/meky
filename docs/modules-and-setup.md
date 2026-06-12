# Module dan Setup

Dokumen ini mencatat kebutuhan module untuk UI retro, game, audio, dan integrasi website. Tujuannya supaya dependency project jelas dan implementasi game manual tidak tertabrak.

## Runtime Utama

Project memakai:

- `next`: framework aplikasi web
- `react`: UI dan state
- `react-dom`: rendering React di browser
- `typescript`: type system
- `tailwindcss`: styling utility

## UI Retro dan Komponen

Komponen UI berasal dari shadcn dan 8bitcn.

Package penting:

- `shadcn`: CLI/component generator
- `@base-ui/react`: dependency dari preset shadcn yang sempat dipakai
- `radix-ui`: paket agregat Radix
- `@radix-ui/react-*`: primitive UI untuk komponen shadcn/8bitcn
- `class-variance-authority`: variant style untuk komponen
- `clsx`: conditional class
- `tailwind-merge`: merge class Tailwind
- `lucide-react`: icon
- `next-themes`: theme mode
- `nuqs`: query-state untuk theme selector 8bitcn
- `sonner`: toast notification
- `vaul`: drawer
- `cmdk`: command menu
- `react-day-picker`: calendar/date picker
- `date-fns`: format tanggal
- `embla-carousel-react`: carousel
- `recharts`: chart
- `input-otp`: input OTP
- `react-resizable-panels`: resizable layout
- `tw-animate-css`: animation utility

Folder terkait:

```text
components/
  ui/
  ui/8bit/
app/
  retro-globals.css
components.json
```

## Module Game

Untuk prototype top-down retro, game bisa dibuat tanpa engine besar memakai React + canvas.

Module opsional yang sudah tersedia:

- `howler`: audio, musik, sound effect
- `@types/howler`: type definitions untuk Howler
- `phaser`: game engine 2D jika butuh scene, physics, tilemap, dan asset loader yang lebih matang
- `kaboom`: game library lama, sudah terpasang tetapi tidak disarankan untuk fitur baru karena package memberi warning sudah tidak maintained
- `motion`: animasi UI, bukan wajib untuk gameplay

Rekomendasi implementasi:

- Gunakan React + canvas untuk prototype kecil.
- Gunakan Phaser jika game berkembang menjadi banyak map, scene, collision layer, dan asset animation.
- Hindari mencampur dua engine game sekaligus.

## Module Web3

Module Web3 sudah tersedia sebagai fondasi non-game. Game tetap harus bisa dimainkan tanpa wallet.

Package yang dipakai:

- `wagmi`: React hooks untuk wallet dan contract interaction
- `viem`: client Ethereum modern untuk query dan transaction
- `@rainbow-me/rainbowkit`: UI connect wallet
- `@tanstack/react-query`: query/cache layer yang dibutuhkan wagmi/RainbowKit
- `zod`: validasi payload dan response

Environment:

```text
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

Nilai ini dibutuhkan untuk WalletConnect/RainbowKit. Project tetap bisa dikembangkan tanpa contract, tetapi wallet connect production sebaiknya memakai project ID yang valid.

Catatan:

- Jangan simpan private key di frontend.
- Jangan kirim reward on-chain dari client tanpa validasi server.
- Wallet connect sebaiknya opsional.
- Progress gameplay tetap disimpan lokal/server dulu, lalu Web3 menjadi lapisan claim/koleksi.

## Struktur File yang Disarankan

Jangan wajib langsung dipakai semua. Struktur ini hanya pegangan jika implementasi mulai membesar.

```text
app/
  game/
    page.tsx

components/
  game/
    RetroAdventure.tsx
    GameCanvas.tsx
    DialogueBox.tsx
    MobileControls.tsx
    InventoryHud.tsx

lib/
  game/
    maps.ts
    entities.ts
    collision.ts
    input.ts
    state.ts
    audio.ts

public/
  game/
    sprites/
    tiles/
    audio/
```

Jika Web3 sudah masuk:

```text
components/
  web3/
    Web3Providers.tsx
    WalletStatus.tsx

lib/
  web3/
    config.ts

app/
  api/
    game/
      progress/
      claim/
```

## Aturan Integrasi Game Manual

Karena gameplay sedang dikerjakan manual:

- Jangan overwrite `components/game/*` tanpa izin.
- Jangan overwrite `app/game/*` tanpa izin.
- Perubahan pendukung sebaiknya di docs, config, atau komponen UI terpisah.
- Jika perlu mengubah file game, baca file penuh dulu dan patch kecil saja.
- Jangan jalankan lint/build otomatis kecuali diminta.

## Asset

Asset game sebaiknya diletakkan di:

```text
public/game/sprites/
public/game/tiles/
public/game/audio/
```

Format yang disarankan:

- Sprite: `.png`
- Tileset: `.png`
- Audio pendek: `.wav` atau `.ogg`
- Musik loop: `.ogg` atau `.mp3`

Semua asset harus original, buatan sendiri, generated, atau berlisensi bebas.

## Catatan Legal

Game boleh terinspirasi dari top-down adventure retro, tetapi jangan memakai:

- Nama Link, Zelda, Hyrule, Triforce, Master Sword
- Sprite, map, musik, sound effect, logo, atau simbol Nintendo
- Desain item yang terlalu identik dengan franchise tertentu

Identitas game harus tetap original.
