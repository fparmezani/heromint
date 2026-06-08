"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, UserCircle, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Como Funciona", href: "/futebol#como-funciona" },
  { label: "Colecao Futebol", href: "/futebol" },
  { label: "Temas", href: "/temas" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userLabel = session?.user?.name || session?.user?.email || "Minha conta";
  const userImage = session?.user?.image;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1E293B] bg-[#020617]/90 backdrop-blur-xl">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/futebol" className="flex items-center gap-2 group">
            <Image
              src="/heromint-logo-cards.png"
              alt="HeroMint"
              width={64}
              height={64}
              className="h-12 w-12 md:h-16 md:w-16 object-contain group-hover:scale-105 transition-transform"
              priority
            />
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
            {isAuthenticated ? (
              <>
                <Link href="/minha-conta" className="btn-secondary px-4 text-sm h-10 rounded-xl gap-2 max-w-48">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={userLabel}
                      width={24}
                      height={24}
                      className="h-6 w-6 shrink-0 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <UserCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{userLabel}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/futebol" })}
                  className="p-2.5 text-[#94A3B8] hover:text-white transition-colors"
                  aria-label="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="btn-secondary px-5 text-sm h-10 rounded-xl">
                Entrar
              </Link>
            )}
            <Link href="/futebol" className="btn-primary px-5 text-sm h-10 rounded-xl gap-1.5">
              <Zap className="w-4 h-4" />
              Criar Card de Futebol
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
                {isAuthenticated ? (
                  <>
                    <Link href="/minha-conta" className="btn-secondary w-full text-sm h-12 rounded-xl gap-2" onClick={() => setMobileOpen(false)}>
                      {userImage ? (
                        <Image
                          src={userImage}
                          alt={userLabel}
                          width={24}
                          height={24}
                          className="h-6 w-6 shrink-0 rounded-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <UserCircle className="w-4 h-4" />
                      )}
                      <span className="truncate">{userLabel}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/futebol" })}
                      className="btn-secondary w-full text-sm h-12 rounded-xl gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </>
                ) : (
                  <Link href="/auth/signin" className="btn-secondary w-full text-sm h-12 rounded-xl" onClick={() => setMobileOpen(false)}>
                    Entrar
                  </Link>
                )}
                <Link href="/futebol" className="btn-primary w-full text-sm h-12 rounded-xl" onClick={() => setMobileOpen(false)}>
                  <Zap className="w-4 h-4" />
                  Criar Card de Futebol
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
