# Deploy Checklist

Checklist ini untuk deploy landing page, waitlist, Web3, dan Bankr tanpa mengaktifkan fitur game on-chain yang belum siap.

## Vercel Environment

Public env:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

Server-only env:

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
X_CLIENT_ID=
X_CLIENT_SECRET=
BANKR_API_BASE_URL=https://api.bankr.bot
BANKR_API_KEY=
BANKR_ADMIN_TOKEN=
ADMIN_CONSOLE_TOKEN=
CLAIM_SIGNING_SECRET=
MEKI_STORAGE_DRIVER=supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:

- Jangan prefix secret dengan `NEXT_PUBLIC_`.
- `ADMIN_CONSOLE_TOKEN` boleh sama dengan `BANKR_ADMIN_TOKEN` untuk awal, tetapi lebih baik dipisah saat production.
- Gunakan Bankr API key dengan izin minimum.
- Jangan pakai Bankr wallet yang menyimpan dana besar untuk testing.

## OAuth Callback

Google:

```text
https://your-domain.com/api/auth/google/callback
```

X:

```text
https://your-domain.com/api/auth/x/callback
```

Local development:

```text
http://localhost:3000/api/auth/google/callback
http://localhost:3000/api/auth/x/callback
```

## WalletConnect

- Buat project id di WalletConnect Cloud.
- Isi `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.
- Ganti fallback demo sebelum production.

## Bankr

Langkah:

1. Buat akun/API key di Bankr.
2. Aktifkan fitur yang diperlukan di Bankr dashboard.
3. Isi `BANKR_API_KEY` di Vercel.
4. Isi `ADMIN_CONSOLE_TOKEN`.
5. Buka `/bankr`.
6. Login admin.
7. Jalankan prompt read-only dulu.

Endpoint lokal yang aktif:

- `/api/bankr/status`
- `/api/bankr/wallet`
- `/api/bankr/agent`
- `/api/bankr/job/:jobId`
- `/api/bankr/job/:jobId/cancel`

## Pre-Production Check

- `/` tampil sebagai landing page.
- `/waitlist` login Google/X/email siap.
- `/web3` wallet connect siap.
- `/bankr` terkunci admin gate.
- `/ops` menampilkan readiness env.
- `/game` tidak ditimpa oleh pekerjaan landing/admin.

## Jangan Aktifkan Dulu

- Token launch.
- Transfer otomatis dari Bankr agent.
- Swap otomatis.
- Reward finansial.
- x402 endpoint yang memproses private game logic.
- Claim on-chain tanpa validasi server.

## Storage Production

Backend draft saat ini memakai `.data/meki-store.json` untuk development lokal.

Untuk production Vercel/serverless, ganti adapter `lib/storage/json-store.ts` ke database persistent seperti:

- Supabase Postgres
- Neon Postgres
- Vercel Postgres
- Upstash Redis untuk data ringan

Jangan mengandalkan filesystem serverless untuk waitlist atau claim production.
