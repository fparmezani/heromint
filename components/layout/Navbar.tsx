"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Coleções", href: "#colecoes" },
  { label: "Preços", href: "#precos" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1E293B] bg-[#020617]/90 backdrop-blur-xl">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-impact text-xl tracking-wider text-white leading-none">HEROMINT</span>
              <span className="text-[10px] text-[#94A3B8] leading-none tracking-widest uppercase">Forje sua versão épica.</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#94A3B8] hover:text-white transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/entrar" className="btn-secondary px-5 text-sm h-10 rounded-xl">
              Entrar
            </Link>
            <Link href="/temas" className="btn-primary px-5 text-sm h-10 rounded-xl gap-1.5">
              <Zap className="w-4 h-4" />
              Criar Agora
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-[#94A3B8] hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[#1E293B] bg-[#0F172A]"
          >
            <div className="section-container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 text-[#94A3B8] hover:text-white transition-colors font-medium border-b border-[#1E293B] last:border-0"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/entrar" className="btn-secondary w-full text-sm h-12 rounded-xl" onClick={() => setMobileOpen(false)}>
                  Entrar
                </Link>
                <Link href="/temas" className="btn-primary w-full text-sm h-12 rounded-xl" onClick={() => setMobileOpen(false)}>
                  <Zap className="w-4 h-4" />
                  Criar Agora
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
