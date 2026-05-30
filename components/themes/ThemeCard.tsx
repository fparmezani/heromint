"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Theme } from "@/types/theme";

const BADGE_STYLES: Record<string, string> = {
  Popular: "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30",
  Novo: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
  Premium: "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/30",
  Família: "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30",
};

interface ThemeCardProps {
  theme: Theme;
  index?: number;
}

export function ThemeCard({ theme, index = 0 }: ThemeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <div className="group relative bg-[#0F172A] border border-[#1E293B] rounded-3xl overflow-hidden card-hover flex flex-col h-full">
        {/* Preview visual */}
        <div
          className={`h-40 bg-gradient-to-br ${theme.gradient} flex items-center justify-center relative overflow-hidden`}
          style={{ backgroundColor: theme.bgColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 to-transparent" />
          <div className="relative z-10 text-7xl group-hover:scale-110 transition-transform duration-300">
            {theme.icon}
          </div>
          {/* Badge */}
          <div className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${BADGE_STYLES[theme.badge]}`}>
            {theme.badge}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div>
            <h3 className="font-bold text-white text-lg mb-1">{theme.name}</h3>
            <p className="text-[#94A3B8] text-sm leading-relaxed">{theme.description}</p>
          </div>

          {/* Fields preview */}
          <div className="flex flex-wrap gap-1.5">
            {theme.fields.slice(0, 3).map((field) => (
              <span
                key={field.key}
                className="text-[10px] text-[#94A3B8] bg-[#1E293B] px-2 py-0.5 rounded-md"
              >
                {field.label}
              </span>
            ))}
            {theme.fields.length > 3 && (
              <span className="text-[10px] text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded-md">
                +{theme.fields.length - 3} mais
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-auto pt-3">
            <Link
              href={`/criar/${theme.id}`}
              className="btn-primary w-full text-sm h-12 rounded-xl text-center"
            >
              Criar Agora
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
