import { bankrRequest } from "./client";

export type BankrWalletInfo = {
  success: boolean;
  wallets?: Array<{
    chain: string;
    address: string;
  }>;
  socialAccounts?: Array<{
    platform: string;
    username: string;
  }>;
  refCode?: string;
  bankrClub?: {
    active: boolean;
    subscriptionType?: string;
    renewOrCancelOn?: number;
  };
  leaderboard?: {
    score?: number;
    rank?: number;
  };
};

export function getBankrWalletInfo() {
  return bankrRequest<BankrWalletInfo>("/wallet/me");
}
