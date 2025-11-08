"use client";

import { Card } from "@/components/ui/card";
import { FileText, Lock, CheckCircle, Unlock, ArrowRight } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    icon: FileText,
    title: "Create Offer",
    description: "Draft your diplomatic proposal with terms and conditions",
    detail: "Define your negotiation terms privately before encryption",
  },
  {
    icon: Lock,
    title: "Encrypt & Submit",
    description: "Your offer is encrypted on-chain, invisible to other parties",
    detail: "FHE ensures your data stays private even on public blockchain",
  },
  {
    icon: CheckCircle,
    title: "All Parties Finalize",
    description: "Each party submits their encrypted offer independently",
    detail: "No party can see others' offers until everyone commits",
  },
  {
    icon: Unlock,
    title: "Simultaneous Reveal",
    description: "All offers decrypt simultaneously when everyone finalizes",
    detail: "Fair revelation prevents strategic advantage from timing",
  },
];

export const HowItWorks = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="pb-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, encrypted negotiations that prevent information leakage and ensure fairness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card
                className={`p-5 sm:p-6 bg-gradient-card border-border transition-all duration-500 group cursor-pointer
                  ${hoveredIndex === index ? "border-primary shadow-lg scale-[1.02]" : "hover:border-primary/50 hover:shadow-card"}
                `}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  transform: hoveredIndex === index ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300
                    ${hoveredIndex === index ? "bg-primary/30 scale-110" : "bg-muted group-hover:bg-primary/20"}
                  `}>
                    <step.icon className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300
                      ${hoveredIndex === index ? "text-primary" : "text-primary/80"}
                    `} />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className={`text-xs sm:text-sm font-semibold transition-colors duration-300
                      ${hoveredIndex === index ? "text-primary" : "text-muted-foreground"}
                    `}>
                      Step {index + 1}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">{step.title}</h3>
                    <p className={`text-xs sm:text-sm transition-all duration-300
                      ${hoveredIndex === index ? "text-foreground/80" : "text-muted-foreground"}
                    `}>
                      {hoveredIndex === index ? step.detail : step.description}
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* Connector arrow between cards (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className={`w-5 h-5 transition-all duration-300
                    ${hoveredIndex === index || hoveredIndex === index + 1 ? "text-primary scale-125" : "text-muted-foreground/30"}
                  `} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

