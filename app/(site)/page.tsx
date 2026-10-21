import { ClosingCta } from "@/components/landing/ClosingCta";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { InstallSection } from "@/components/landing/InstallGuide";
import { StatsRow } from "@/components/landing/StatsRow";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <StatsRow />
      <Features />
      <InstallSection />
      <ClosingCta />
    </>
  );
}
