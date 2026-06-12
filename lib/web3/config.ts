import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "viem/chains";
import { http } from "wagmi";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meki-adventure.vercel.app";

export const web3Chains = [baseSepolia, base] as const;

export const wagmiConfig = getDefaultConfig({
  appName: "Meki Adventure",
  appDescription: "Retro Web3 adventure game with optional collectible rewards.",
  appUrl: siteUrl,
  appIcon: "/favicon.ico",
  chains: web3Chains,
  projectId: walletConnectProjectId,
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});

export const primaryWeb3Chain = baseSepolia;
