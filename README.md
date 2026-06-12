# 🎮 Retromolt

Retromolt is a web-based, retro top-down adventure game built with **Next.js**. 

Designed with a **play-first philosophy**, Retromolt allows players to explore a rich pixel art world, interact with NPCs, complete quests, and unlock optional Web3 collectible rewards. Wallets are entirely optional: players can start playing immediately and choose to connect a wallet only when they are ready to claim rewards.

---

## 📖 Table of Contents
1. [Documentation](#-documentation)
2. [Project Architecture & Pages](#-project-architecture--pages)
3. [Getting Started](#-getting-started)
4. [Environment Variables](#%EF%B8%8F-environment-variables)
5. [Development Guidelines](#%EF%B8%8F-development-guidelines)

---

## 📚 Documentation

Detailed design docs, game specifications, and roadmaps can be found in the `/docs` folder:

*   **Gameplay & Systems:**
    *   [Game Concept](docs/retro-adventure-game.md) - Core gameplay loops, visual style, and target audience.
    *   [Game Systems](docs/game-systems.md) - Details on leveling, mining, enemies, and rewards.
    *   [Character & Dialogue](docs/characters.md) - NPC profiles, dialogue trees, and narrative structure.
*   **Web3 & Integrations:**
    *   [Web3 MVP & Roadmap](docs/web3-mvp.md) - Wallet connection, NFT contracts, and claiming.
    *   [Bankr.bot Integration](docs/bankr-integration.md) - Discord bot integration and administrative automation.
    *   [Bankr Prompt Templates](docs/bankr-prompts.md) - System prompt templates for Bankr.bot.
    *   [Smart Contract Drafts](docs/contracts.md) - Solidity contract ideas for collectible items.
*   **Infrastructure & Plans:**
    *   [Deployment Checklist](docs/deploy-checklist.md) - Steps for staging and production release.
    *   [x402 Execution Plan](docs/x402-plan.md) - Architectural milestones and phases.
    *   [Backend Architecture](docs/backend-draft.md) - Server routes, API boundaries, and database thoughts.
    *   [Data Schema](docs/data-schema.md) - JSON structure schemas for state synchronization.
    *   [Design Assets](docs/asset-requirements.md) - Required graphics, sprites, and maps.
    *   [Rate Limiting Policy](docs/rate-limit.md) - Security measures for game APIs.

---

## 🗺️ Project Architecture & Pages

The application is structured into the following routes:

| Route | Description | Visibility |
| :--- | :--- | :--- |
| `/` | Landing page featuring game information and CTAs | Public |
| `/game` | The interactive top-down game client | Public |
| `/about` | Deep dive into the game concept and values | Public |
| `/systems` | Summary of gameplay, leveling, and mechanics | Public |
| `/web3` | Wallet status and ownership verification dashboard | Public |
| `/waitlist` | Waitlist registration using Google, X (Twitter), or Email | Public |
| `/claim` | Reward claiming wizard for earned in-game collectibles | Public |
| `/roadmap` | Game development and release schedule | Public |
| `/assets` | Asset guidelines and design briefs | Public |
| `/api-docs` | Documentation of backend API endpoints | Developer |
| `/ops` | Readiness board for deployment and system integration | Developer |
| `/bankr` | Admin console control center for Bankr.bot | Developer / Admin |
| `/admin` | Internal administration panel | Admin |
| `/admin/waitlist` | Manage and review waitlist applicants | Admin |
| `/admin/claims` | Review and sign reward claims | Admin |
| `/admin/rewards` | Define and catalog in-game reward items | Admin |
| `/terms` | Terms of Service | Legal |
| `/privacy` | Privacy Policy | Legal |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or later recommended)
- npm or yarn

### Installation & Setup

1. Clone the repository and navigate to the directory:
   ```bash
   git clone <repository-url>
   cd retromolt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your local environment file:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required configurations (see below).

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the game and site.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Key | Description | Type |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID for Wagmi config | Public |
| `NEXT_PUBLIC_SITE_URL` | Base canonical domain of the website | Public |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID for waitlist auth | Server-only |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Server-only |
| `X_CLIENT_ID` | X (Twitter) OAuth Client ID | Server-only |
| `X_CLIENT_SECRET` | X (Twitter) OAuth Client Secret | Server-only |
| `BANKR_API_BASE_URL` | Bankr.bot API entry point (Default: `https://api.bankr.bot`) | Server-only |
| `BANKR_API_KEY` | Secret credentials to authenticate with Bankr API | Server-only |
| `BANKR_ADMIN_TOKEN` | Token securing the admin console of Bankr dashboard | Server-only |
| `ADMIN_CONSOLE_TOKEN` | Token securing the main admin endpoints | Server-only |
| `CLAIM_SIGNING_SECRET` | Key used to sign cryptographic proof for claim transactions | Server-only |
| `MEKI_STORAGE_DRIVER` | Database/Storage driver (e.g., `json` or `supabase`) | Server-only |
| `MEKI_STORAGE_DIR` | Local directory path if using `json` storage (Default: `.data`) | Server-only |
| `SUPABASE_URL` | Supabase project URL (if storage driver is `supabase`) | Server-only |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role API key | Server-only |

> [!WARNING]
> Keep `BANKR_API_KEY`, `ADMIN_CONSOLE_TOKEN`, `CLAIM_SIGNING_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` secure. Do not expose them to the frontend; never prefix them with `NEXT_PUBLIC_`.

---

## 🛠️ Development Guidelines

To maintain repository health, please follow these guidelines:

*   **Gameplay Development:** The core game client is undergoing active work. Do not overwrite or refactor game logic files without coordination.
*   **IP Protection:** Avoid using names, assets, sound files, sprite designs, maps, or references that directly resemble Nintendo or Zelda intellectual property. Use original/free retro assets.
*   **Testing & Builds:** Do not run production builds (`npm run build`) or global linters on production main branch unless requested.
