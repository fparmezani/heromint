"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Sparkles, Share2, CheckCircle, Zap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SucessoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#22C55E]/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C3AED]/8 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-lg mx-auto text-center">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#22C55E]/10 border-2 border-[#22C55E]/30 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-[#22C55E]" />
              </div>
              <div className="absolute -inset-4 rounded-full bg-[#22C55E]/10 blur-xl" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-impact text-4xl md:text-5xl text-white tracking-wide mb-3">
              PAGAMENTO <span className="text-[#22C55E]">CONFIRMADO!</span>
            </h1>
            <p className="text-[#94A3B8] text-lg mb-8">
              Seu card épico está pronto para download em alta resolução!
            </p>
          </motion.div>

          {/* Card mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="w-48 h-64 mx-auto rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shadow-2xl relative overflow-hidden border border-white/10"
              style={{ boxShadow: "0 0 60px rgba(37,99,235,0.4), 0 0 120px rgba(124,58,237,0.2)" }}
            >
              <Sparkles className="w-20 h-20 text-white/60" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col gap-3"
          >
            <button className="btn-primary w-full h-14 rounded-2xl text-base animate-glow-pulse">
              <Download className="w-5 h-5" />
              Baixar Card em PNG
            </button>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/temas" className="btn-secondary h-12 rounded-xl text-sm">
                <Zap className="w-4 h-4" />
                Criar Outro Card
              </Link>
              <a
                href={`https://wa.me/?text=${encodeURIComponent("Veja meu card épico criado no HeroMint! 🔥 heromint.com.br")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary h-12 rounded-xl text-sm"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </a>
            </div>
          </motion.div>

          {sessionId && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xs text-[#94A3B8] mt-6"
            >
              ID da sessão: {sessionId.slice(0, 20)}...
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense>
      <SucessoContent />
    </Suspense>
  );
}
