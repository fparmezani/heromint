"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, Heart } from "lucide-react";
import type { PackageType } from "@/types/collectible";
import { isPackageAvailable, PACKAGE_CONFIG } from "@/types/collectible";

interface PackageSelectorProps {
  value: PackageType;
  onChange: (pkg: PackageType) => void;
}

const PACKAGE_ICONS = {
  individual: Zap,
  premium: Star,
  completo: Crown,
  "futebol-familia": Heart,
};

const PACKAGE_POPULAR: Partial<Record<PackageType, boolean>> = {
  premium: true,
};

export function PackageSelector({ value, onChange }: PackageSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {(Object.entries(PACKAGE_CONFIG) as [PackageType, typeof PACKAGE_CONFIG[PackageType]][])
        .filter(([key]) => isPackageAvailable(key))
        .map(([key, pkg]) => {
        const Icon = PACKAGE_ICONS[key];
        const isSelected = value === key;
        const isPopular = PACKAGE_POPULAR[key];

        return (
          <motion.button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
              isSelected
                ? "border-[#7C3AED] bg-[#7C3AED]/10"
                : "border-[#1E293B] bg-[#0F172A] hover:border-[#2563EB]/50"
            }`}
          >
            {/* Popular badge */}
            {isPopular && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-bg text-white text-[10px] font-bold uppercase tracking-wider">
                Mais Popular
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected ? "gradient-bg" : "bg-[#1E293B]"
                }`}
              >
                <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-[#94A3B8]"}`} />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <p className="font-bold text-white text-base">{pkg.label}</p>
                  <p className="font-impact text-2xl gradient-text">
                    R$ {(pkg.price / 100).toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <p className="text-[#94A3B8] text-sm mt-0.5">{pkg.description}</p>
              </div>

              {/* Checkmark */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected ? "gradient-bg border-transparent" : "border-[#1E293B]"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>
          </motion.button>
        );
        })}
    </div>
  );
}
