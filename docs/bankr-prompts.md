# Bankr Prompt Templates

Template ini dipakai untuk command Bankr yang aman. Semua prompt sengaja diawali dengan read-only agar agent tidak melakukan swap, transfer, sign, atau token launch tanpa keputusan manual.

Implementasi ada di `lib/bankr/prompts.ts` dan tersedia di halaman `/bankr`.

## Safe Wallet Check

Tujuan:

- Cek identity wallet.
- Cek balances yang terlihat.
- Cek chain yang relevan.
- Minta rekomendasi keamanan.

## Treasury Report

Tujuan:

- Ringkas aset treasury.
- Catat risiko stablecoin/token.
- Buat daftar monitoring.

## Claim Activity

Tujuan:

- Membantu desain laporan claim.
- Mendeteksi duplicate claim.
- Mendeteksi pola wallet mencurigakan.
- Menentukan field backend yang wajib dilog.

## Mining Economy

Tujuan:

- Menyeimbangkan drop rate.
- Menentukan resource sink.
- Menentukan sinyal anti-bot.

## Enemy Leveling

Tujuan:

- Membantu tier musuh.
- Menentukan XP reward.
- Menentukan drop table.
- Menentukan boss gate.

## x402 Readiness

Tujuan:

- Menilai endpoint mana yang cocok jadi paid API.
- Menentukan urutan launch x402.
- Mencatat risiko keamanan.
