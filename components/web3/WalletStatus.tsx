"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Gamepad2, Wallet } from "lucide-react";

export function WalletStatus() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!ready) {
          return (
            <div className="h-16 border-4 border-[#08080d] bg-[#151826] shadow-[7px_7px_0_#08080d]" />
          );
        }

        if (!connected) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className="inline-flex h-16 w-full items-center justify-center gap-3 border-4 border-[#08080d] bg-[#ffd166] px-7 font-mono text-sm font-black uppercase text-[#08080d] shadow-[7px_7px_0_#08080d] transition-transform hover:-translate-y-1 active:translate-y-1 sm:w-auto"
            >
              <Wallet className="size-5" />
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              type="button"
              onClick={openChainModal}
              className="inline-flex h-16 w-full items-center justify-center gap-3 border-4 border-[#08080d] bg-[#e63946] px-7 font-mono text-sm font-black uppercase text-white shadow-[7px_7px_0_#08080d] transition-transform hover:-translate-y-1 active:translate-y-1 sm:w-auto"
            >
              Switch Network
            </button>
          );
        }

        return (
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openChainModal}
              className="inline-flex h-16 items-center justify-center gap-3 border-4 border-[#08080d] bg-[#fff4c4] px-5 font-mono text-xs font-black uppercase text-[#08080d] shadow-[7px_7px_0_#08080d] transition-transform hover:-translate-y-1 active:translate-y-1"
            >
              <Gamepad2 className="size-5" />
              {chain.name}
            </button>
            <button
              type="button"
              onClick={openAccountModal}
              className="inline-flex h-16 items-center justify-center gap-3 border-4 border-[#08080d] bg-[#ffd166] px-5 font-mono text-xs font-black uppercase text-[#08080d] shadow-[7px_7px_0_#08080d] transition-transform hover:-translate-y-1 active:translate-y-1"
            >
              <Wallet className="size-5" />
              {account.displayName}
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
