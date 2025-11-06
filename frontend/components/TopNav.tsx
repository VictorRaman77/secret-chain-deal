"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Shield, Wifi, WifiOff } from "lucide-react";
import { useChainId, useAccount } from "wagmi";

const NETWORK_NAMES: Record<number, string> = {
  31337: "Hardhat",
  11155111: "Sepolia",
  1: "Ethereum",
};

const NETWORK_COLORS: Record<number, string> = {
  31337: "bg-amber-500",
  11155111: "bg-blue-500",
  1: "bg-emerald-500",
};

export const TopNav = () => {
  const chainId = useChainId();
  const { isConnected } = useAccount();

  const networkName = NETWORK_NAMES[chainId] || `Chain ${chainId}`;
  const networkColor = NETWORK_COLORS[chainId] || "bg-gray-500";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Secret Chain Deal</h1>
              <p className="text-xs text-muted-foreground">Encrypted Negotiation Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                {isConnected ? (
                  <Wifi className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-red-500" />
                )}
                <span className={`w-2 h-2 rounded-full ${networkColor}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {networkName}
                </span>
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

