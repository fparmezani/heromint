import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { ThemeGrid } from "@/components/themes/ThemeGrid";

export const metadata: Metadata = {
  title: "Colecao Futebol - HeroMint",
  description: "Escolha entre Futebol 2026, Futebol Panini e Futebol Familia para transformar suas fotos em imagens esportivas premium.",
};

export default function TemasPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C3AED]/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1E293B] bg-[#0F172A] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span className="text-[#94A3B8] text-xs tracking-widest uppercase font-medium">
              Colecao Futebol disponivel agora
            </span>
          </div>
          <h1 className="font-impact text-5xl md:text-6xl text-white tracking-wide mb-4">
            VIVA SUA PAIXAO PELO <span className="gradient-text">FUTEBOL</span>
          </h1>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Crie retratos de jogador, figurinhas colecionaveis ou uma foto especial com toda a familia no estadio.
          </p>
        </div>

        <ThemeGrid />
      </div>
    </div>
  );
}
