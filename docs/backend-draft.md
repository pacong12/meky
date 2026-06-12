# Backend Draft

Backend draft ini menghubungkan landing/waitlist/Web3/Bankr tanpa mengganggu gameplay manual.

## Storage

Implementasi awal:

```text
lib/storage/json-store.ts
lib/storage/supabase-store.ts
lib/storage/store.ts
```

Default storage:

```text
.data/meki-store.json
```

Catatan:

- `.data/` di-ignore git.
- Cocok untuk development lokal.
- Untuk production serverless, ganti adapter ini ke Postgres/Supabase/Neon.
- API dan halaman sudah dibuat lewat fungsi backend, jadi adapter bisa diganti tanpa ubah UI besar.

## Storage Driver

Development:

```text
MEKI_STORAGE_DRIVER=json
MEKI_STORAGE_DIR=.data
```

Production Supabase REST:

```text
MEKI_STORAGE_DRIVER=supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

SQL schema:

```text
docs/database-schema.sql
```

## Waitlist Backend

File:

```text
lib/game/backend.ts
app/api/waitlist/route.ts
app/api/auth/google/callback/route.ts
app/api/auth/x/callback/route.ts
app/api/admin/waitlist/route.ts
app/api/admin/summary/route.ts
```

Semua join via email, Google, dan X sekarang disimpan ke backend adapter.

## Reward Catalog

File:

```text
lib/game/rewards.ts
app/api/rewards/route.ts
```

Reward awal:

- `badge_first_clear`
- `title_cave_runner`
- `frame_crystal_scout`
- `skin_red_scarf`

Reward yang `active: true` bisa dibuat eligible oleh claim API.

## Claim API Draft

File:

```text
app/api/claims/route.ts
```

Endpoint:

- `GET /api/claims`
  - List claim draft.
  - Wajib admin session.

- `POST /api/claims`
  - Request claim eligibility.

Body:

```json
{
  "walletAddress": "0x0000000000000000000000000000000000000000",
  "rewardId": "badge_first_clear",
  "objectiveId": "objective_first_clear",
  "playerId": "optional-player-id"
}
```

Complete draft:

```json
{
  "action": "complete",
  "claimId": "claim_id",
  "transactionHash": "0xabc123"
}
```

Complete action wajib admin session.

Status:

- `eligible` jika reward aktif dan objective cocok.
- `rejected` jika reward tidak aktif, objective salah, atau duplicate claim.
- `claimed` jika claim ditandai selesai.

## Economy Report

File:

```text
lib/game/economy.ts
app/api/economy/report/route.ts
```

Report berisi:

- total waitlist
- waitlist by provider
- reward count
- claim status
- duplicate claim risk
- mining resources
- enemy XP summary

## Admin/Ops

File:

```text
app/ops/page.tsx
middleware.ts
```

`/ops` sekarang menampilkan:

- readiness env
- waitlist backend records
- reward/claim metrics
- economy report JSON
- page map
- next actions

API internal diproteksi middleware dan route-level session check.
