"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface WaxSealProps {
  onBreak?: () => void;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const WaxSeal = ({ onBreak, className = "", isLoading = false, disabled = false }: WaxSealProps) => {
  const [isBroken, setIsBroken] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled || isProcessing || isBroken) return;

    setIsProcessing(true);
    setIsBroken(true);
    
    // Wait for animation before calling onBreak
    setTimeout(async () => {
      try {
        await onBreak?.();
      } finally {
        setIsProcessing(false);
      }
    }, 600);
  };

  const showLoading = isLoading || isProcessing;
  const isClickable = !showLoading && !disabled && !isBroken;

  return (
    <div
      className={`relative ${isClickable ? "cursor-pointer" : "cursor-not-allowed"} group ${className}`}
      onClick={handleClick}
    >
      {showLoading ? (
        <div className="w-24 h-24 flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-primary/20 animate-pulse" />
            <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      ) : (
        <>
          <Image
            src="/wax-seal.png"
            alt="Wax Seal"
            width={96}
            height={96}
            className={`w-24 h-24 transition-all duration-300 ${
              isBroken ? "animate-seal-break" : isClickable ? "group-hover:scale-110 group-hover:rotate-3" : "opacity-50"
            }`}
            style={{
              filter: isBroken ? "none" : "drop-shadow(0 4px 20px hsl(180 85% 55% / 0.3))",
            }}
          />
          {!isBroken && isClickable && (
            <>
              <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full animate-glow-pulse" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs text-primary/80 whitespace-nowrap">Click to reveal</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

