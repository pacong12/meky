import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@rainbow-me/rainbowkit",
    "wagmi",
    "viem",
    "@wagmi/connectors",
    "@walletconnect/ethereum-provider",
    "@walletconnect/universal-provider",
    "@safe-global/safe-apps-sdk",
    "@safe-global/safe-apps-provider",
    "@reown/appkit",
    "@reown/appkit-ui",
    "@reown/appkit-scaffold-ui",
    "ox",
  ],
};

export default nextConfig;
