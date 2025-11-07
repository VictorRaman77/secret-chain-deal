"use client";

import { Shield, Lock, Users } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="container mx-auto text-center">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-8">
            <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm text-primary font-medium">Fully Homomorphic Encryption</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Secret Chain Deal
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto px-2">
            Submit and manage encrypted deal offers on-chain using FHEVM technology.
            Your offers remain private until all parties reveal.
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="p-4 sm:p-6 border border-border/50 rounded-lg bg-card hover:bg-card/80 transition-colors">
              <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3 sm:mb-4 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">Encrypted Offers</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Offers are encrypted on-chain using FHE
              </p>
            </div>

            <div className="p-4 sm:p-6 border border-border/50 rounded-lg bg-card hover:bg-card/80 transition-colors">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3 sm:mb-4 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">Private Processing</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Compute on encrypted data without decryption
              </p>
            </div>

            <div className="p-4 sm:p-6 border border-border/50 rounded-lg bg-card hover:bg-card/80 transition-colors sm:col-span-2 md:col-span-1">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-3 sm:mb-4 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">Multi-Party Deals</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Fair negotiation with multiple parties
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

