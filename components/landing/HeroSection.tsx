"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Play, Star, ChevronRight, Zap } from "lucide-react";

function CollectibleCard({
  title,
  subtitle,
  gradient,
  rotate,
  delay,
  scale = 1,
  zIndex = 0,
}: {
  title: string;
  subtitle: string;
  gradient: string;
  rotate: number;
  delay: number;
  scale?: number;
  zIndex?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: rotate - 5 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      style={{ zIndex }}
      className="absolute"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
        className={`w-[140px] md:w-[160px] h-[200px] md:h-[220px] rounded-2xl ${gradient} border border-white/20 shadow-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
        style={{ transform: `scale(${scale})` }}
      >
        <div className="h-full flex flex-col p-3 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl">
              {subtitle === "Futebol 2026" ? "⚽" : subtitle === "Hero Card" ? "⚔️" : subtitle === "Reino Medieval" ? "🏰" : subtitle === "Escola de Magia" ? "🪄" : "🎬"}
            </div>
          </div>
          <div className="relative">
            <p className="text-white font-bold text-sm leading-tight">{title}</p>
            <p className="text-white/70 text-xs">{subtitle}</p>
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-white/10" />
      </motion.div>
    </motion.div>
  );
}

function MainCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="relative z-20"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="w-[200px] md:w-[240px] h-[280px] md:h-[340px] rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #065f46 0%, #064e3b 40%, #022c22 100%)",
          border: "2px solid rgba(251,191,36,0.4)",
          boxShadow: "0 0 60px rgba(251,191,36,0.3), 0 0 120px rgba(37,99,235,0.2)",
        }}
      >
        {/* Card top accent */}
        <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500" />

        <div className="p-4 flex flex-col h-full relative">
          {/* Top badges */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-yellow-400 text-xs font-bold tracking-widest">2026</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>

          {/* Player avatar area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 border-2 border-yellow-400/30 flex items-center justify-center overflow-hidden relative">
              <div className="text-5xl">👤</div>
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent" />
            </div>
          </div>

          {/* Player info */}
          <div className="border-t border-yellow-400/20 pt-3 mt-2">
            <p className="text-white font-black text-base md:text-lg leading-tight">LUCAS SILVA</p>
            <p className="text-yellow-300/80 text-xs mb-2">15-05-2003 | 1,78m | 72 kg</p>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <span className="text-[8px]">🏆</span>
              </div>
              <span className="text-white/70 text-[10px] uppercase tracking-wider">SÃO PAULO FC</span>
            </div>
          </div>

          {/* Glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="section-container relative z-10 w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="flex flex-col">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 self-start"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10">
                <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span className="text-[#FBBF24] text-xs font-bold tracking-wider uppercase">
                  Colecionáveis digitais gerados por IA
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="font-impact text-[56px] md:text-[72px] lg:text-[80px] leading-[0.9] tracking-wide text-white mb-2">
                TRANSFORME
                <br />
                SUA FOTO EM
              </h1>
              <h1 className="font-impact text-[56px] md:text-[72px] lg:text-[80px] leading-[0.9] tracking-wide gradient-text">
                UMA LENDA.
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#94A3B8] text-lg leading-relaxed mb-8 max-w-md"
            >
              Crie cards, figurinhas, avatares e pôsteres épicos.
              <br />
              Seja um jogador, um herói, um mago ou quem você quiser ser.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <Link href="/temas" className="btn-primary px-7 text-base animate-glow-pulse">
                <Zap className="w-5 h-5" />
                Criar Meu Card Agora
              </Link>
              <Link href="#como-funciona" className="btn-secondary px-7 text-base">
                <Play className="w-4 h-4" />
                Ver Como Funciona
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {["👤", "👤", "👤", "👤"].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#020617] bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-xs"
                  >
                    {_}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                  ))}
                </div>
                <p className="text-xs text-[#94A3B8]">
                  <span className="text-white font-bold">+10.000</span> usuários já transformaram suas fotos em lendas épicas!
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right side - Card stack */}
          <div className="relative flex items-center justify-center h-[420px] md:h-[520px]">
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-[#2563EB]/20 rounded-full blur-3xl" />
            </div>

            {/* Platform */}
            <div className="absolute bottom-8 w-64 h-8 bg-gradient-to-r from-transparent via-[#2563EB]/20 to-transparent rounded-full blur-sm" />

            {/* Background cards */}
            <div className="relative w-full h-full flex items-center justify-center">
              <CollectibleCard
                title="Hero Card"
                subtitle="Hero Card"
                gradient="bg-gradient-to-br from-purple-800 to-indigo-950"
                rotate={-18}
                delay={0.5}
                zIndex={10}
              />
              <CollectibleCard
                title="LUCAS S."
                subtitle="Futebol 2026"
                gradient="bg-gradient-to-br from-green-700 to-emerald-950"
                rotate={-10}
                delay={0.4}
                zIndex={12}
              />
              <MainCard />
              <CollectibleCard
                title="Reino"
                subtitle="Reino Medieval"
                gradient="bg-gradient-to-br from-amber-800 to-red-950"
                rotate={10}
                delay={0.4}
                zIndex={12}
              />
              <CollectibleCard
                title="Mago"
                subtitle="Escola de Magia"
                gradient="bg-gradient-to-br from-violet-800 to-fuchsia-950"
                rotate={18}
                delay={0.5}
                zIndex={10}
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
              className="absolute top-8 right-4 glass-card rounded-xl px-3 py-2 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs text-white font-medium">IA Gerando Agora</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: "spring" }}
              className="absolute bottom-16 right-0 glass-card rounded-xl px-3 py-2"
            >
              <div className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-[#FBBF24]" />
                <span className="text-xs text-[#94A3B8]">Pronto em <span className="text-white font-bold">30 seg</span></span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
