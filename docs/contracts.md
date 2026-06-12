# Contract Draft

Draft contract ada di:

```text
contracts/MekiAdventureBadge.sol
```

Status:

- Belum deploy.
- Belum ada Hardhat/Foundry setup.
- Belum install OpenZeppelin.
- Dipakai sebagai target desain untuk claim badge/cosmetic.

## Contract

`MekiAdventureBadge` adalah ERC-1155 untuk reward kosmetik.

Fitur:

- Owner bisa set signer.
- Owner bisa aktif/nonaktif token id.
- Claim pakai signature.
- Claim id hanya bisa dipakai sekali.
- Claim punya expiry.

## Dependency Yang Dibutuhkan Nanti

```text
@openzeppelin/contracts
hardhat atau foundry
```

## Signing Model

Contract draft memakai payload:

```text
claimId
wallet
tokenId
expiresAt
```

Backend saat ini memakai HMAC draft di `lib/game/claim-signing.ts`. Untuk deploy contract, backend perlu diganti ke ECDSA signing dengan private key server-side.

## Production Rules

- Jangan expose private signer ke frontend.
- Gunakan signer khusus reward, bukan wallet treasury utama.
- Simpan claim id dan transaction hash.
- Reward awal tetap cosmetic/badge.
- Jangan token economy sebelum gameplay dan anti-cheat matang.
