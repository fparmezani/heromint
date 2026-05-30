"use client";

import { motion } from "framer-motion";
import { List, User, Upload, Wand2, CreditCard, Download, ChevronRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: List,
    title: "Escolha o Tema",
    description: "Selecione o universo e o tipo de card que você quer criar.",
  },
  {
    number: "02",
    icon: User,
    title: "Preencha os Dados",
    description: "Responda algumas perguntas para personalizar seu card.",
  },
  {
    number: "03",
    icon: Upload,
    title: "Envie sua Foto",
    description: "Faça o upload da sua foto para nossa IA trabalhar sua mágica.",
  },
  {
    number: "04",
    icon: Wand2,
    title: "Geramos seu Card",
    description: "Veja um preview com marca d'água do seu card épico.",
  },
  {
    number: "05",
    icon: CreditCard,
    title: "Faça o Pagamento",
    description: "Escolha o plano e finalize seu pagamento de forma segura.",
  },
  {
    number: "06",
    icon: Download,
    title: "Receba e Baixe",
    description: "Baixe seu card em alta resolução e compartilhe sua nova identidade!",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 bg-[#0F172A]/50">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E293B] bg-[#0F172A] mb-4">
            <span className="text-[#94A3B8] text-xs tracking-widest uppercase font-medium">Simples e rápido</span>
          </div>
          <h2 className="font-impact text-4xl md:text-5xl text-white tracking-wide">
            COMO <span className="gradient-text">FUNCIONA</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 flex gap-4 card-hover h-full">
                  {/* Number + Icon */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-impact text-2xl gradient-text">{step.number}</span>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-bold text-white text-base mb-2">{step.title}</h3>
                    <p className="text-[#94A3B8] text-sm leading-relaxed">{step.description}</p>
                  </div>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && index % 3 !== 2 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-6 h-6 rounded-full bg-[#1E293B] flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-[#2563EB]" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
