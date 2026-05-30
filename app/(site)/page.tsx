import { HeroSection } from "@/components/landing/HeroSection";
import { ThemeUniverseSection } from "@/components/landing/ThemeUniverseSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ThemeUniverseSection />
      <HowItWorksSection />
      <BenefitsSection />
      <FinalCTASection />
    </>
  );
}
