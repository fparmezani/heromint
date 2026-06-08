"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Gift } from "lucide-react";

interface FirstPurchasePromotion {
  eligible: boolean;
  coupon: string;
  discountPercent: number;
}

export function FirstPurchaseCouponBanner() {
  const [promotion, setPromotion] = useState<FirstPurchasePromotion | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/promotions/first-purchase")
      .then((response) => response.json())
      .then((result: FirstPurchasePromotion) => {
        if (isMounted && result.eligible) {
          setPromotion(result);
        }
      })
      .catch(() => {
        // The banner is promotional only; checkout should keep working if it fails.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!promotion?.eligible) {
    return null;
  }

  const handleCopyCoupon = async () => {
    await navigator.clipboard.writeText(promotion.coupon);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#FBBF24]/40 bg-[#FBBF24]/10 p-4 shadow-[0_0_30px_rgba(251,191,36,0.16)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FBBF24] via-[#22C55E] to-[#2563EB]" />
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FBBF24] text-[#0F172A]">
          <Gift className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FBBF24]">
            Primeira compra
          </p>
          <h3 className="mt-1 text-xl font-black text-white">
            Ganhe {promotion.discountPercent}% de desconto
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[#CBD5E1]">
            Use o cupom <span className="font-bold text-white">{promotion.coupon}</span>. Basta aplicar este código na compra e o desconto é aplicado automaticamente.
          </p>

          <button
            type="button"
            onClick={handleCopyCoupon}
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Cupom copiado" : `Copiar ${promotion.coupon}`}
          </button>
        </div>
      </div>
    </div>
  );
}
