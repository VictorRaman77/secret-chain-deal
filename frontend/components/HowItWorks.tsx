"use client";

import { Card } from "@/components/ui/card";
import { FileText, Lock, CheckCircle, Unlock } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Create Offer",
    description: "Draft your diplomatic proposal with terms and conditions",
  },
  {
    icon: Lock,
    title: "Encrypt & Submit",
    description: "Your offer is encrypted on-chain, invisible to other parties",
  },
  {
    icon: CheckCircle,
    title: "All Parties Finalize",
    description: "Each party submits their encrypted offer independently",
  },
  {
    icon: Unlock,
    title: "Simultaneous Reveal",
    description: "All offers decrypt simultaneously when everyone finalizes",
  },
];

export const HowItWorks = () => {
  return (
    <section className="pb-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, encrypted negotiations that prevent information leakage and ensure fairness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="p-6 bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-card group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Step {index + 1}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

