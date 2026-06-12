# Rencana Integrasi Bankr.bot

Dokumen ini merangkum hal penting dari dokumentasi Bankr.bot dan bagaimana Meki Adventure bisa masuk ke ekosistem Bankr nanti.

Sumber utama:

- Bankr Docs: https://docs.bankr.bot/
- Platform Overview: https://docs.bankr.bot/getting-started/overview/
- Quick Start: https://docs.bankr.bot/getting-started/quick-start/
- Agent API: https://docs.bankr.bot/agent-api/overview/
- Wallet API: https://docs.bankr.bot/wallet-api/overview/
- x402 Cloud: https://docs.bankr.bot/x402-cloud/overview/
- Apps SDK: https://docs.bankr.bot/apps/sdk/

## Ringkasan Bankr

Bankr adalah infrastruktur untuk AI agent dengan crypto support. Konsep utamanya:

- Agent punya wallet.
- Agent bisa menjalankan prompt, trading, DeFi action, token launching, dan wallet operation.
- Agent bisa memakai API, CLI, skill, plugin, atau app.
- Bankr mendukung beberapa chain seperti Base, Ethereum, Polygon, Unichain, World Chain, Arbitrum, BNB Chain, Solana, dan Hyperliquid.
- Bankr menekankan model self-funding agent: agent wallet, token launch, trading fees, lalu fee bisa membiayai compute.

## Bagian Bankr yang Relevan Untuk Meki

Untuk Meki Adventure, bagian yang paling relevan:

1. **Wallet API**
   - Baca wallet info.
   - Baca portfolio.
   - Transfer, sign, submit transaction jika API key punya izin.
   - Cocok untuk dashboard/admin atau agent-side wallet operation.

2. **Agent API**
   - Submit prompt ke Bankr agent.
   - Poll job result.
   - Cocok untuk command natural-language seperti cek harga, cek wallet, atau trigger action.

3. **x402 Cloud**
   - Deploy paid API endpoint.
   - Payment otomatis memakai x402.
   - Settlement USDC di Base.
   - Bisa dipakai nanti untuk API berbayar seperti analytics, quest verification, atau premium agent service.

4. **Apps SDK**
   - App berbasis iframe + server-side scripts.
   - Bisa dipakai jika Meki ingin membuat mini app/dashboard di dalam Bankr ecosystem.

5. **Token Launching**
   - Bankr punya jalur launch token agent.
   - Ini bukan prioritas awal Meki, tetapi bisa jadi fase jauh setelah game dan komunitas jelas.

## Strategi Integrasi Meki

Urutan yang paling sehat:

### Phase 1: Prepare

- Landing page Web3 siap.
- Wallet connect eksternal tetap opsional.
- Progress game tidak bergantung Bankr.
- Dokumentasi asset, reward, claim, dan roadmap siap.

### Phase 2: Bankr Readiness

- Siapkan environment server-only:

```text
BANKR_API_KEY=
BANKR_API_URL=https://api.bankr.bot
```

- Jangan expose `BANKR_API_KEY` ke frontend.
- Buat wrapper server untuk request Bankr.
- Mulai dari read-only operation.

### Phase 3: Agent Utility

Ide command Bankr agent untuk Meki:

- "show Meki treasury balance"
- "summarize today claim activity"
- "check BASE gas and token price"
- "generate quest economy report"
- "notify when badge claim volume spikes"

Agent API flow:

```text
Server -> POST /agent/prompt -> jobId
Server -> GET /agent/job/{jobId} -> result
```

### Phase 4: x402 Service

Possible x402 endpoints:

- `/quest-verify`
  - Paid/agent-callable quest verification API.

- `/badge-metadata`
  - Dynamic badge metadata or rarity info.

- `/game-report`
  - Generate economy/quest analytics.

- `/asset-brief`
  - Paid agent endpoint for generating asset/design brief.

Important:

- Do not put critical private game logic entirely in paid public endpoint.
- Keep anti-cheat and claim eligibility protected server-side.

### Phase 5: Bankr App

Possible Bankr App:

- Meki dashboard.
- Claim dashboard.
- Agent treasury dashboard.
- Game economy dashboard.

App SDK structure from docs:

- `index.html` rendered inside sandboxed iframe.
- Optional server-side scripts callable from iframe.
- Shared data can use Bankr app key-value style storage.

## Security Rules

Bankr docs strongly warn that API keys with agent/wallet access are sensitive.

Rules for this repo:

- Never put `BANKR_API_KEY` in client code.
- Never prefix Bankr API key with `NEXT_PUBLIC_`.
- Keep Bankr requests in server routes only.
- Start with read-only endpoints.
- Use allowlist/IP restriction if enabled in Bankr dashboard.
- Use limited funds for testing.
- Do not give write permission until claim/security model is ready.
- Revoke leaked keys immediately.

## API Wrapper Plan

Recommended file structure:

```text
lib/
  bankr/
    config.ts
    client.ts
    agent.ts
    wallet.ts

app/
  api/
    bankr/
      agent/
        route.ts
      wallet/
        route.ts
```

Frontend must call local API routes, not Bankr directly.

Example boundary:

```text
Browser
  -> /api/bankr/agent
    -> server validates request
    -> server calls https://api.bankr.bot
```

## Meki Use Cases

### For Game Operations

- Monitor reward claim stats.
- Summarize player economy.
- Watch treasury/agent wallet.
- Generate balance reports.
- Send agent commands for admin tasks.

### For Community

- Let community ask the agent about current game stats.
- Publish quest reports.
- Build Bankr app dashboard.
- Add x402 paid endpoints for external agents.

### For Web3 Economy

- Start with badge/cosmetic.
- Avoid token launch until community and utility are clear.
- If token launch happens later, it should fund infrastructure or agent compute, not become a rushed game currency.

## What Not To Do Yet

- Do not launch a Meki token before gameplay/community are mature.
- Do not connect Bankr write operations to player reward claims without backend validation.
- Do not expose Bankr API key in browser.
- Do not make paid x402 endpoint required to play the game.
- Do not move core game resource economy on-chain too early.

## Immediate Next Steps

1. Add server-only env keys when ready.
2. Create a Bankr account/API key outside the repo.
3. Start with read-only wrapper.
4. Use the admin-only dashboard page for wallet and agent checks.
5. Add x402 endpoint only after claim/economy logic is stable.

## Fit With Current Meki Roadmap

Best fit:

- Current app wallet connect remains player-facing.
- Bankr becomes agent/admin/economy infrastructure.
- x402 can later monetize API services for agents.
- Bankr App can become a companion dashboard.
- Token launching is a late-stage option, not the next feature.

Related docs:

- `docs/deploy-checklist.md`
- `docs/x402-plan.md`
- `docs/bankr-prompts.md`
- `docs/data-schema.md`

## Implementasi Saat Ini

File yang sudah disiapkan:

```text
lib/bankr/config.ts
lib/bankr/client.ts
lib/bankr/agent.ts
lib/bankr/wallet.ts
components/bankr/BankrConsole.tsx
app/bankr/page.tsx
app/api/bankr/status/route.ts
app/api/bankr/wallet/route.ts
app/api/bankr/agent/route.ts
app/api/bankr/job/[jobId]/route.ts
app/api/bankr/job/[jobId]/cancel/route.ts
```

Environment:

```text
BANKR_API_BASE_URL=https://api.bankr.bot
BANKR_API_KEY=
BANKR_ADMIN_TOKEN=
```

Route lokal:

- `GET /api/bankr/status`
  - Mengecek apakah Bankr env sudah disiapkan.

- `GET /api/bankr/wallet`
  - Memanggil Bankr `GET /wallet/me`.
  - Wajib `Authorization: Bearer BANKR_ADMIN_TOKEN`.

- `POST /api/bankr/agent`
  - Memanggil Bankr `POST /agent/prompt`.
  - Body: `prompt`, optional `threadId`, optional `maxMode`.
  - Wajib `Authorization: Bearer BANKR_ADMIN_TOKEN`.

- `GET /api/bankr/job/:jobId`
  - Memanggil Bankr `GET /agent/job/{jobId}`.
  - Dipakai untuk polling hasil agent.
  - Wajib `Authorization: Bearer BANKR_ADMIN_TOKEN`.

- `POST /api/bankr/job/:jobId/cancel`
  - Memanggil Bankr `POST /agent/job/{jobId}/cancel`.
  - Wajib `Authorization: Bearer BANKR_ADMIN_TOKEN`.

Halaman admin:

- `/bankr`
  - Console kecil untuk wallet check, submit prompt, poll job, dan cancel job.
  - Token admin dimasukkan manual di browser, lalu dikirim sebagai bearer token ke API lokal.
  - Jangan dibuka untuk publik tanpa proteksi tambahan jika sudah memakai API key produksi.

## Catatan Dokumentasi Terbaru

Bankr docs menyebut `POST /agent/prompt` menerima prompt maksimal 10.000 karakter dan mengembalikan `jobId` untuk dipoll. Polling dilakukan lewat `GET /agent/job/{jobId}`. Untuk wallet identity, gunakan `GET /wallet/me`; `GET /agent/me` sudah deprecated dan dijadwalkan hilang pada 2026-06-15.
