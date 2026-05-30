"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Wand2, Star, Camera, CheckCircle2 } from "lucide-react";

interface GeneratingPageProps {
  themeName: string;
  themeIcon: string;
  packageType: "individual" | "premium" | "completo" | "futebol-familia";
  currentStep: number;
  totalSteps: number;
}

const SAMPLE_CARDS = [
  {
    id: "futebol",
    theme: "Futebol",
    image: "/api/placeholder/200/280",
    gradient: "from-green-600 to-yellow-500",
  },
  {
    id: "hero",
    theme: "Hero Card",
    image: "/api/placeholder/200/280", 
    gradient: "from-purple-700 to-indigo-900",
  },
  {
    id: "profissional",
    theme: "Profissional",
    image: "/api/placeholder/200/280",
    gradient: "from-slate-700 to-blue-900",
  },
  {
    id: "medieval",
    theme: "Medieval",
    image: "/api/placeholder/200/280",
    gradient: "from-amber-700 to-red-900",
  },
  {
    id: "magia",
    theme: "Escola de Magia",
    image: "/api/placeholder/200/280",
    gradient: "from-violet-700 to-fuchsia-900",
  },
];

const LOADING_MESSAGES = [
  "🎨 Analisando sua foto...",
  "🧠 Aplicando inteligência artificial...",
  "✨ Criando arte épica...",
  "🎭 Adicionando efeitos especiais...",
  "🖼️ Finalizando seu card...",
];

const PACKAGE_INFO = {
  individual: { versions: 1, label: "Card Individual" },
  premium: { versions: 5, label: "Pack Premium" },
  completo: { versions: 10, label: "Pack Completo" },
  "futebol-familia": { versions: 1, label: "Futebol Família" },
};

export function GeneratingPage({
  themeName,
  themeIcon,
  packageType,
  currentStep,
  totalSteps,
}: GeneratingPageProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const packageInfo = PACKAGE_INFO[packageType];
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    setShowCards(true);
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E1A] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#7C3AED]/5 to-transparent rounded-full animate-spin-slow" />
      </div>

      {/* Floating cards */}
      <AnimatePresence>
        {showCards && (
          <div className="absolute inset-0 pointer-events-none">
            {SAMPLE_CARDS.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.5, y: 100 }}
                animate={{
                  opacity: 0.3,
                  scale: 0.8,
                  y: 0,
                  x: [0, 20, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  delay: index * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className={`absolute w-32 h-44 rounded-xl bg-gradient-to-br ${card.gradient} shadow-2xl`}
                style={{
                  left: `${15 + index * 15}%`,
                  top: `${20 + (index % 2) * 40}%`,
                }}
              >
                <div className="absolute inset-2 bg-black/20 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold text-center px-2">
                    {card.theme}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          {/* Theme icon */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            {themeIcon}
          </motion.div>

          {/* Title */}
          <h1 className="font-impact text-4xl md:text-5xl text-white mb-4 tracking-wide">
            CRIANDO SEU CARD
          </h1>
          <h2 className="text-2xl md:text-3xl gradient-text font-bold mb-8">
            {themeName}
          </h2>

          {/* Package info */}
          <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-[#334155]/30">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Star className="w-6 h-6 text-[#FBBF24]" />
              <span className="text-white font-bold text-lg">{packageInfo.label}</span>
              <Star className="w-6 h-6 text-[#FBBF24]" />
            </div>
            <p className="text-[#94A3B8] text-sm">
              Gerando {packageInfo.versions} {packageInfo.versions === 1 ? "versão" : "versões"} diferentes do seu card
            </p>
          </div>

          {/* Loading message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-[#94A3B8] text-lg font-medium">
                {LOADING_MESSAGES[messageIndex]}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm text-[#94A3B8] mb-2">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-[#1E293B] rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              </motion.div>
            </div>
          </div>

          {/* Photo quality tips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-full max-w-md mx-auto mb-6"
          >
            <div className="bg-[#1E293B]/40 backdrop-blur-sm rounded-xl p-4 border border-[#22C55E]/20">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-[#22C55E]" />
                <span className="text-[#22C55E] text-xs font-semibold uppercase tracking-wider">
                  Dica para resultado perfeito
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] mt-0.5 shrink-0" />
                  <span className="text-[#94A3B8] text-xs">Rosto próximo e centralizado</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] mt-0.5 shrink-0" />
                  <span className="text-[#94A3B8] text-xs">Boa iluminação frontal</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] mt-0.5 shrink-0" />
                  <span className="text-[#94A3B8] text-xs">Expressão natural visível</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] mt-0.5 shrink-0" />
                  <span className="text-[#94A3B8] text-xs">Fundo simples sem poluição</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Animated icons */}
          <div className="flex justify-center gap-6">
            {[Sparkles, Zap, Wand2].map((Icon, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  delay: index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Icon className="w-8 h-8 text-[#7C3AED]" />
              </motion.div>
            ))}
          </div>

          {/* Estimated time */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-[#64748B] text-sm mt-6"
          >
            Tempo estimado: {packageInfo.versions * 30} segundos
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
