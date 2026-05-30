"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Layers, Lock } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "IA Avançada",
    description: "Tecnologia de ponta que transforma suas fotos em artes épicas com detalhes impressionantes.",
    gradient: "from-[#FBBF24] to-[#F59E0B]",
    glow: "rgba(251,191,36,0.2)",
  },
  {
    icon: Shield,
    title: "Qualidade Premium",
    description: "Seus cards em alta resolução, prontos para imprimir, compartilhar e colecionar.",
    gradient: "from-[#7C3AED] to-[#6D28D9]",
    glow: "rgba(124,58,237,0.2)",
  },
  {
    icon: Layers,
    title: "Colecao Futebol",
    description: "Escolha entre retrato de jogador, figurinha colecionavel e foto especial com toda a familia.",
    gradient: "from-[#2563EB] to-[#1D4ED8]",
    glow: "rgba(37,99,235,0.2)",
  },
  {
    icon: Lock,
    title: "Compra Segura",
    description: "Pagamento 100% seguro e entrega instantânea dos seus cards após a confirmação.",
    gradient: "from-[#22C55E] to-[#16A34A]",
    glow: "rgba(34,197,94,0.2)",
  },
];

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-20">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#94A3B8] text-sm tracking-widest uppercase mb-3 font-medium">
            Por que escolher o
          </p>
          <h2 className="font-impact text-4xl md:text-5xl text-white tracking-wide">
            <span className="gradient-text">HEROMINT</span>?
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 flex flex-col gap-4 card-hover"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  style={{ boxShadow: `0 8px 24px ${benefit.glow}` }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-bold text-white text-base mb-2">{benefit.title}</h3>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{benefit.description}</p>
                </div>

                {/* Bottom accent */}
                <div className={`h-0.5 bg-gradient-to-r ${benefit.gradient} opacity-30 group-hover:opacity-100 transition-opacity rounded-full`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
