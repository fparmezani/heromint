"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Sparkles, Star, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10 w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span className="text-[#FBBF24] text-xs font-bold tracking-wider uppercase">
                Sua foto no universo do futebol
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-impact text-[58px] md:text-[76px] lg:text-[84px] leading-[0.9] tracking-wide text-white mb-6"
            >
              ENTRE EM CAMPO
              <br />
              COMO UMA <span className="gradient-text">LENDA.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#94A3B8] text-lg leading-relaxed mb-8 max-w-lg"
            >
              Crie retratos de jogador, figurinhas colecionaveis e fotos especiais com sua familia.
              Escolha seu formato e viva sua paixao pelo futebol.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <Link href="/temas" className="btn-primary px-7 text-base animate-glow-pulse">
                <Zap className="w-5 h-5" />
                Criar Meu Card de Futebol
              </Link>
              <Link href="#como-funciona" className="btn-secondary px-7 text-base">
                <Play className="w-4 h-4" />
                Ver Como Funciona
              </Link>
            </motion.div>

            <div className="flex items-center gap-3 text-sm text-[#94A3B8]">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>
              Imagens esportivas premium geradas com IA
            </div>
          </div>

          <div className="relative h-[430px] md:h-[560px] flex items-center justify-center">
            <div className="absolute w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl" />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="relative h-full w-full"
            >
              <Image
                src="/hero-football-card-showcase.png"
                alt="Card HeroMint de jogador de futebol"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
