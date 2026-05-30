"use client";

import Image from "next/image";
import { WatermarkOverlay } from "./WatermarkOverlay";

interface PreviewCardProps {
  imageUrl: string;
  isPaid?: boolean;
}

export function PreviewCard({ imageUrl, isPaid = false }: PreviewCardProps) {
  return (
    <div className="relative aspect-[2/3] w-full max-w-sm mx-auto">
      <img
        src={imageUrl}
        alt="Card preview"
        className={`w-full h-full object-cover ${isPaid ? "" : "blur-[1px]"}`}
      />
      {!isPaid && <WatermarkOverlay />}
      {isPaid && (
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#22C55E] text-white text-xs font-bold">
          ✓ Pago
        </div>
      )}
    </div>
  );
}
