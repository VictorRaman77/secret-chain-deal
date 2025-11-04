import { TopNav } from "@/components/TopNav";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { NegotiationTable } from "@/components/NegotiationTable";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <div className="h-14" />
      <Hero />
      <HowItWorks />
      <NegotiationTable />
    </div>
  );
}
