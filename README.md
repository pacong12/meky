# Meki Adventure

Web game retro top-down adventure berbasis Next.js. Fokus project ini adalah pengalaman game-first: pemain mengeksplorasi dunia pixel, berinteraksi dengan NPC, membuka item, dan menemukan konten website lewat gameplay.

## Dokumentasi

- [Konsep game](docs/retro-adventure-game.md)
- [Karakter dan dialog](docs/characters.md)
- [Module dan setup](docs/modules-and-setup.md)
- [MVP dan roadmap Web3](docs/web3-mvp.md)
- [Roadmap pembangunan game](docs/game-roadmap.md)
- [Sistem game: leveling, musuh, mining, reward](docs/game-systems.md)
- [Kebutuhan asset desain](docs/asset-requirements.md)
- [Rencana integrasi Bankr.bot](docs/bankr-integration.md)
- [Bankr prompt templates](docs/bankr-prompts.md)
- [Data schema](docs/data-schema.md)
- [Deploy checklist](docs/deploy-checklist.md)
- [x402 plan](docs/x402-plan.md)
- [Backend draft](docs/backend-draft.md)
- [Contract draft](docs/contracts.md)
- [Rate limit](docs/rate-limit.md)

## Development

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Halaman

- `/` landing page
- `/about` konsep game
- `/systems` sistem gameplay
- `/web3` wallet dan ownership layer
- `/bankr` console admin Bankr.bot
- `/ops` readiness board untuk deploy dan integrasi
- `/api-docs` dokumentasi endpoint backend
- `/admin` overview internal
- `/admin/waitlist` data waitlist
- `/admin/claims` data claim
- `/admin/rewards` catalog reward
- `/claim` reward claim flow
- `/roadmap` launch roadmap
- `/assets` asset brief
- `/waitlist` waitlist login Google, X, dan email
- `/game` playable game
- `/terms` terms awal
- `/privacy` privacy awal

## Catatan Kerja

- Implementasi gameplay sedang dikerjakan manual.
- Jangan menimpa file game tanpa koordinasi.
- Jangan jalankan `npm run lint` atau `npm run build` kecuali diminta.
- Hindari aset, nama, musik, sprite, map, atau simbol dari franchise Nintendo/Zelda secara langsung.

## Environment

Bankr.bot:

```bash
BANKR_API_BASE_URL=https://api.bankr.bot
BANKR_API_KEY=your_bankr_api_key
BANKR_ADMIN_TOKEN=change_this_admin_console_token
```

`BANKR_API_KEY` dan `BANKR_ADMIN_TOKEN` harus tetap server-only. Jangan pakai prefix `NEXT_PUBLIC_`.
