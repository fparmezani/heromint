"use client";

import { Gift } from "lucide-react";

export function FirstPurchaseCouponBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#FBBF24]/40 bg-[#FBBF24]/10 p-4 shadow-[0_0_30px_rgba(251,191,36,0.16)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FBBF24] via-[#22C55E] to-[#2563EB]" />
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FBBF24] text-[#0F172A]">
          <Gift className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FBBF24]">
            Valor de lancamento
          </p>
          <h3 className="mt-1 text-xl font-black text-white">
            Preco promocional liberado
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">
            O desconto ja esta aplicado no pagamento. Voce ve o valor antigo riscado e paga apenas o preco de lancamento.
          </p>
        </div>
      </div>
    </div>
  );
}
