import { HeroSection } from "@/components/landing/HeroSection";
import { ThemeUniverseSection } from "@/components/landing/ThemeUniverseSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ThemeUniverseSection />
      <BenefitsSection />
      <HowItWorksSection />
      <FinalCTASection />
    </>
  );
}
