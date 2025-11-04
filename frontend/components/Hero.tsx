"use client";

import { Shield, Lock, Users } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-32 pb-16 px-6">
      <div className="container mx-auto text-center">
        <div className="flex flex-col items-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Fully Homomorphic Encryption</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Secret Chain Deal
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Submit and manage encrypted deal offers on-chain using FHEVM technology.
            Your offers remain private until all parties reveal.
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="p-6 border border-border/50 rounded-lg bg-card">
              <Lock className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Encrypted Offers</h3>
              <p className="text-sm text-muted-foreground">
                Offers are encrypted on-chain using FHE
              </p>
            </div>

            <div className="p-6 border border-border/50 rounded-lg bg-card">
              <Shield className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Private Processing</h3>
              <p className="text-sm text-muted-foreground">
                Compute on encrypted data without decryption
              </p>
            </div>

            <div className="p-6 border border-border/50 rounded-lg bg-card">
              <Users className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Multi-Party Deals</h3>
              <p className="text-sm text-muted-foreground">
                Fair negotiation with multiple parties
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

