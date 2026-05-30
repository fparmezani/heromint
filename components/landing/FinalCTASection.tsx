"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const floatingCards = [
  { emoji: "🎬", label: "Avatar", gradient: "from-gray-700 to-blue-900", rotate: -8, x: -30, delay: 0 },
  { emoji: "🏰", label: "Medieval", gradient: "from-amber-800 to-red-900", rotate: 0, x: 0, delay: 0.5 },
  { emoji: "🪄", label: "Magia", gradient: "from-violet-800 to-fuchsia-900", rotate: 8, x: 30, delay: 1 },
];

export function FinalCTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - CTA content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-impact text-4xl md:text-5xl lg:text-6xl text-white tracking-wide mb-4 leading-tight">
              PRONTO PARA{" "}
              <span className="gradient-text">FORJAR</span>
              <br />
              SUA LENDA?
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8 leading-relaxed">
              Junte-se a milhares de pessoas que já transformaram suas fotos em cards épicos.
            </p>
            <Link href="/temas" className="btn-primary px-8 text-base animate-glow-pulse inline-flex">
              <Zap className="w-5 h-5" />
              CRIAR MEU CARD AGORA
            </Link>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { value: "+10K", label: "Cards criados" },
                { value: "98%", label: "Satisfação" },
                { value: "30s", label: "Tempo de geração" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-impact text-2xl gradient-text">{stat.value}</div>
                  <div className="text-[#94A3B8] text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-64 flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center w-full">
              {floatingCards.map((card, index) => (
                <motion.div
                  key={card.label}
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: card.delay, ease: "easeInOut" }}
                  style={{
                    marginLeft: index === 0 ? 0 : -20,
                    transform: `rotate(${card.rotate}deg) translateX(${card.x}px)`,
                  }}
                  className={`w-32 h-48 rounded-2xl bg-gradient-to-br ${card.gradient} border border-white/20 shadow-2xl flex flex-col items-center justify-center gap-2`}
                >
                  <div className="text-4xl">{card.emoji}</div>
                  <div className="text-white text-xs font-bold">{card.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
