"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

export function PhotoGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      <div className="rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/5 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-[#2563EB]" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">Selecione o gênero correto</p>
          <p className="text-[#94A3B8] text-xs">Escolha "Homem" ou "Mulher" para melhorar o resultado da imagem gerada.</p>
        </div>
      </div>
    </motion.div>
  );
}
