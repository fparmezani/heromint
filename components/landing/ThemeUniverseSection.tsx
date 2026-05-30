"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { themes } from "@/lib/themes";

const BADGE_STYLES: Record<string, string> = {
  Popular: "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30",
  Novo: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
  Premium: "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/30",
  Família: "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30",
};

const GRADIENT_BORDERS: Record<string, string> = {
  "futebol-2026": "hover:border-green-500/50 hover:shadow-green-500/20",
  "hero-card": "hover:border-purple-500/50 hover:shadow-purple-500/20",
  "profissional-premium": "hover:border-blue-500/50 hover:shadow-blue-500/20",
  "reino-medieval": "hover:border-amber-500/50 hover:shadow-amber-500/20",
  "escola-de-magia": "hover:border-violet-500/50 hover:shadow-violet-500/20",
  "baby-hero": "hover:border-pink-500/50 hover:shadow-pink-500/20",
  "family-pack": "hover:border-teal-500/50 hover:shadow-teal-500/20",
  "pet-star": "hover:border-yellow-500/50 hover:shadow-yellow-500/20",
  "battle-card": "hover:border-red-500/50 hover:shadow-red-500/20",
  "avatar-poster": "hover:border-indigo-500/50 hover:shadow-indigo-500/20",
};

export function ThemeUniverseSection() {
  return (
    <section id="colecoes" className="py-20 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />
      </div>

      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E293B] bg-[#0F172A] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <span className="text-[#94A3B8] text-xs tracking-widest uppercase font-medium">Universos Disponíveis</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
          </div>
          <h2 className="font-impact text-4xl md:text-5xl text-white tracking-wide">
            ESCOLHA SEU <span className="gradient-text">UNIVERSO</span>
          </h2>
        </motion.div>

        {/* Theme grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link href={`/criar/${theme.id}`}>
                <div
                  className={`group relative bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${GRADIENT_BORDERS[theme.id] || ""}`}
                >
                  {/* Badge */}
                  <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${BADGE_STYLES[theme.badge]}`}>
                    {theme.badge}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {theme.icon}
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <p className="text-white text-xs font-bold leading-tight">{theme.name}</p>
                  </div>

                  {/* Glow overlay */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/5 to-transparent" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link href="/temas" className="btn-secondary px-8 text-sm inline-flex">
            Ver Todos os Temas →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
