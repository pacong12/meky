type ReadinessItem = {
  key: string;
  label: string;
  configured: boolean;
  note: string;
};

function hasEnv(name: string) {
  return Boolean(process.env[name]);
}

export function getOpsReadiness() {
  const items: ReadinessItem[] = [
    {
      key: "site-url",
      label: "Site URL",
      configured: hasEnv("NEXT_PUBLIC_SITE_URL"),
      note: "Dipakai untuk OAuth callback dan metadata deploy.",
    },
    {
      key: "walletconnect",
      label: "WalletConnect",
      configured: hasEnv("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"),
      note: "Dibutuhkan RainbowKit wallet connect produksi.",
    },
    {
      key: "google",
      label: "Google OAuth",
      configured: hasEnv("GOOGLE_CLIENT_ID") && hasEnv("GOOGLE_CLIENT_SECRET"),
      note: "Dibutuhkan untuk login waitlist Google.",
    },
    {
      key: "x",
      label: "X OAuth",
      configured: hasEnv("X_CLIENT_ID") && hasEnv("X_CLIENT_SECRET"),
      note: "Dibutuhkan untuk login waitlist X.",
    },
    {
      key: "bankr-api",
      label: "Bankr API",
      configured: hasEnv("BANKR_API_KEY"),
      note: "Server-only key untuk wallet dan agent API.",
    },
    {
      key: "admin",
      label: "Admin Console",
      configured: hasEnv("ADMIN_CONSOLE_TOKEN") || hasEnv("BANKR_ADMIN_TOKEN"),
      note: "Mengunci halaman /bankr dan API internal.",
    },
    {
      key: "storage",
      label: "Production Storage",
      configured:
        process.env.MEKI_STORAGE_DRIVER === "supabase" &&
        hasEnv("SUPABASE_URL") &&
        hasEnv("SUPABASE_SERVICE_ROLE_KEY"),
      note: "Gunakan Supabase/Postgres untuk waitlist dan claim production.",
    },
    {
      key: "claim-signing",
      label: "Claim Signing",
      configured: hasEnv("CLAIM_SIGNING_SECRET"),
      note: "Server secret untuk signed claim draft.",
    },
  ];

  const configuredCount = items.filter((item) => item.configured).length;

  return {
    items,
    configuredCount,
    total: items.length,
    percent: Math.round((configuredCount / items.length) * 100),
  };
}
