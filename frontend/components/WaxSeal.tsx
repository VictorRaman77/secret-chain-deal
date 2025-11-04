"use client";

import { useState } from "react";
import Image from "next/image";

interface WaxSealProps {
  onBreak?: () => void;
  className?: string;
}

export const WaxSeal = ({ onBreak, className = "" }: WaxSealProps) => {
  const [isBroken, setIsBroken] = useState(false);

  const handleClick = () => {
    setIsBroken(true);
    setTimeout(() => {
      onBreak?.();
    }, 600);
  };

  return (
    <div
      className={`relative cursor-pointer group ${className}`}
      onClick={handleClick}
    >
      <Image
        src="/wax-seal.png"
        alt="Wax Seal"
        width={96}
        height={96}
        className={`w-24 h-24 transition-all duration-300 ${
          isBroken ? "animate-seal-break" : "group-hover:scale-110"
        }`}
        style={{
          filter: isBroken ? "none" : "drop-shadow(0 4px 20px hsl(180 85% 55% / 0.3))",
        }}
      />
      {!isBroken && (
        <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full animate-glow-pulse" />
      )}
    </div>
  );
};

