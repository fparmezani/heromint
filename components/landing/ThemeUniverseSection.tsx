"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock3 } from "lucide-react";
import { isThemeAvailable, themes } from "@/lib/themes";

export function ThemeUniverseSection() {
  const availableThemes = themes.filter((theme) => isThemeAvailable(theme.id));
  const upcomingThemes = themes.filter((theme) => !isThemeAvailable(theme.id));

  return (
    <section id="colecoes" className="py-20 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />
      </div>

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[#22C55E] text-xs font-bold uppercase tracking-[0.25em] mb-3">Disponivel agora</p>
          <h2 className="font-impact text-4xl md:text-5xl text-white tracking-wide">
            ESCOLHA SEU CARD DE <span className="gradient-text">FUTEBOL</span>
          </h2>
          <p className="text-[#94A3B8] mt-3 max-w-2xl mx-auto">
            Tres formatos para transformar sua foto em uma lembranca esportiva premium.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableThemes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-[#0F172A] border border-green-500/20 rounded-3xl p-6 hover:border-green-500/60 hover:-translate-y-1 transition-all"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-3xl mb-5`}>
                {theme.icon}
              </div>
              <h3 className="text-white text-xl font-bold mb-2">{theme.name}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">{theme.description}</p>
              <Link href={`/criar/${theme.id}`} className="btn-primary w-full h-11 rounded-xl text-sm">
                Criar Agora
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-[#1E293B] bg-[#0F172A]/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock3 className="w-4 h-4 text-[#94A3B8]" />
            <p className="text-[#94A3B8] text-xs font-bold uppercase tracking-[0.2em]">Outros temas em breve</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {upcomingThemes.map((theme) => (
              <span key={theme.id} className="px-3 py-2 rounded-lg bg-[#1E293B] text-[#94A3B8] text-xs">
                {theme.icon} {theme.name}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/temas" className="btn-secondary px-8 text-sm inline-flex">
            Ver Colecao Completa
          </Link>
        </div>
      </div>
    </section>
  );
}
