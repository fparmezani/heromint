"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PhotoGuide } from "./PhotoGuide";

interface UploadZoneProps {
  value?: string;
  onChange: (url: string) => void;
}

export function UploadZone({ value, onChange }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Por favor, envie apenas imagens.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 10MB.");
        return;
      }

      setError(null);

      // Show the actual image immediately using a local object URL
      const localUrl = URL.createObjectURL(file);
      onChange(localUrl);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative rounded-2xl overflow-hidden border-2 border-[#22C55E]/30 aspect-[3/4] max-w-xs mx-auto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Sua foto" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-1.5 text-[#22C55E] text-sm font-medium">
                <ImageIcon className="w-4 h-4" />
                Foto selecionada ✓
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <label
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-4 w-full min-h-[240px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-[#2563EB] bg-[#2563EB]/10"
                  : "border-[#1E293B] bg-[#0F172A] hover:border-[#2563EB]/50 hover:bg-[#0F172A]/80"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
              />
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center">
                <Upload className="w-7 h-7 text-white" />
              </div>
              <div className="text-center px-4">
                <p className="text-white font-medium mb-1">
                  Arraste sua foto aqui ou{" "}
                  <span className="text-[#2563EB] underline">clique para selecionar</span>
                </p>
                <p className="text-[#94A3B8] text-sm">PNG, JPG ou WEBP • Máx. 10MB</p>
              </div>
            </label>
            <PhotoGuide />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-2 text-sm text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
