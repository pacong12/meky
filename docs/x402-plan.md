# x402 Plan

x402 untuk Meki Adventure sebaiknya menjadi layanan agent-facing setelah gameplay, claim, dan anti-cheat stabil. Jangan jadikan x402 syarat bermain.

Sumber Bankr:

- https://docs.bankr.bot/x402-cloud/quick-start
- https://docs.bankr.bot/x402-cloud/security
- https://docs.bankr.bot/x402-cloud/cli-reference

## Prinsip

- x402 hanya untuk API berbayar tambahan.
- Gameplay gratis tetap berjalan tanpa x402.
- Endpoint tidak menyimpan secret di response.
- Jangan kirim PII player ke metadata pembayaran.
- Jangan taruh private anti-cheat logic penuh di endpoint publik.

## Kandidat Endpoint

### `meki-game-report`

Fungsi:

- Membuat ringkasan ekonomi.
- Membaca aggregate mining, claim, enemy, dan quest.
- Output untuk agent/admin.

Harga awal:

- `$0.01` sampai `$0.05` USDC per request.

Status:

- Cocok sebagai x402 pertama karena read-only.

### `meki-asset-brief`

Fungsi:

- Membuat brief asset pixel art.
- Input: character, enemy, item, biome, rarity.
- Output: ukuran sprite, palette, animasi, naming.

Harga awal:

- `$0.01` sampai `$0.03` USDC per request.

Status:

- Aman karena tidak menyentuh wallet/claim.

### `meki-badge-metadata`

Fungsi:

- Membaca rarity dan metadata badge.
- Bisa dipakai marketplace atau agent explorer.

Status:

- Tunggu sampai reward contract jelas.

### `meki-quest-verify`

Fungsi:

- Verifikasi objective/quest.

Status:

- Jangan jadikan endpoint x402 awal karena raw anti-cheat terlalu sensitif.

## Bankr CLI Flow

Menurut docs Bankr x402 Cloud:

```text
bankr x402 init
bankr x402 add meki-game-report
bankr x402 deploy
bankr x402 env set KEY=VALUE
bankr x402 list
bankr x402 revenue meki-game-report
```

Handler berada di folder `x402/`. Contoh handler sudah disiapkan:

```text
x402/meki-game-report/index.ts
x402/meki-asset-brief/index.ts
bankr.x402.example.json
```

## Security

- Env x402 diset lewat `bankr x402 env set`.
- Secret tidak ditulis di log.
- Output endpoint harus aggregate, bukan raw private user data.
- Set harga rendah saat testing.
- Pakai endpoint read-only dulu.
- Simpan request logs secukupnya untuk audit.

## Launch Order

1. Deploy `meki-asset-brief`.
2. Deploy `meki-game-report` dengan dummy aggregate.
3. Hubungkan ke data aggregate production.
4. Tambah `meki-badge-metadata`.
5. Evaluasi `meki-quest-verify` setelah anti-cheat matang.
