import type { Metadata } from "next";
import { ThemeGrid } from "@/components/themes/ThemeGrid";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Temas — HeroMint",
  description: "Escolha entre 10 temas épicos e transforme sua foto em um colecionável digital premium.",
};

export default function TemasPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C3AED]/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1E293B] bg-[#0F172A] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span className="text-[#94A3B8] text-xs tracking-widest uppercase font-medium">10 universos disponíveis</span>
          </div>
          <h1 className="font-impact text-5xl md:text-6xl text-white tracking-wide mb-4">
            ESCOLHA SEU <span className="gradient-text">UNIVERSO</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Cada tema cria uma experiência única. Escolha o que mais combina com você e comece a forjar sua lenda.
          </p>
        </div>

        {/* Grid */}
        <ThemeGrid />
      </div>
    </div>
  );
}
