"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#FBBF24] text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Sua historia no futebol
          </p>
          <h2 className="font-impact text-4xl md:text-6xl text-white tracking-wide mb-4">
            PRONTO PARA ENTRAR EM <span className="gradient-text">CAMPO?</span>
          </h2>
          <p className="text-[#94A3B8] text-lg mb-8 max-w-2xl mx-auto">
            Escolha seu formato favorito e transforme suas fotos em imagens esportivas premium.
          </p>
          <Link href="/futebol" className="btn-primary px-8 text-base animate-glow-pulse inline-flex">
            <Zap className="w-5 h-5" />
            VER COLECAO FUTEBOL
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
