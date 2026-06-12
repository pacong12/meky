# Rate Limit

Rate limit awal ada di:

```text
lib/security/rate-limit.ts
```

Endpoint yang sudah dilimit:

- `POST /api/waitlist`
  - 8 request per menit per IP.

- `POST /api/claims`
  - 12 request per menit per IP.

- `POST /api/bankr/agent`
  - 10 request per menit per IP.

- `GET /api/auth/google/callback`
  - 20 request per menit per IP.

- `GET /api/auth/x/callback`
  - 20 request per menit per IP.

Catatan:

- Implementasi sekarang in-memory.
- Cocok untuk development dan single long-running server.
- Untuk production scale, ganti ke Redis/Upstash agar limit konsisten antar instance.
