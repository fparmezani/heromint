"use client";

import { useState } from "react";
import { Mail, Download, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeliveryOptionsProps {
  collectibleId: string;
  packageType: string;
  themeName: string;
  generatedImages: Array<{ imageUrl: string; templateUsed?: string }>;
  onDeliveryComplete?: () => void;
}

export function DeliveryOptions({
  collectibleId,
  packageType,
  themeName,
  generatedImages,
  onDeliveryComplete,
}: DeliveryOptionsProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "download" | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleEmailDelivery = async () => {
    if (!email || !email.includes("@")) {
      alert("Por favor, digite um email válido");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/send-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectibleId,
          imageUrls: generatedImages,
          themeName,
          userEmail: email,
          userName: name,
          packageType,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsCompleted(true);
        setTimeout(() => {
          onDeliveryComplete?.();
        }, 3000);
      } else {
        alert("Erro ao enviar email: " + result.error);
      }
    } catch (error) {
      alert("Erro ao enviar email: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/download-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectibleId,
          imageUrls: generatedImages,
          themeName,
          packageType,
        }),
      });

      if (response.ok) {
        // Cria um blob e força o download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `HeroMint_${themeName}_${collectibleId}.${generatedImages.length === 1 ? 'png' : 'zip'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setIsCompleted(true);
        setTimeout(() => {
          onDeliveryComplete?.();
        }, 2000);
      } else {
        alert("Erro no download");
      }
    } catch (error) {
      alert("Erro no download: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-2xl"
      >
        <CheckCircle className="w-16 h-16 text-[#22C55E] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">
          🎉 Entrega Concluída!
        </h3>
        <p className="text-[#94A3B8]">
          {deliveryMethod === "email" 
            ? `Suas imagens foram enviadas para ${email}`
            : "Download iniciado com sucesso!"
          }
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          Como você quer receber suas imagens?
        </h3>
        <p className="text-[#94A3B8]">
          Escolha a forma mais conveniente para você
        </p>
      </div>

      {/* Delivery Method Selection */}
      {!deliveryMethod && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setDeliveryMethod("email")}
            className="p-6 bg-[#0F172A] border border-[#1E293B] rounded-xl hover:border-[#2563EB] transition-colors group"
          >
            <Mail className="w-8 h-8 text-[#2563EB] mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-white mb-2">📧 Receber por Email</h4>
            <p className="text-[#94A3B8] text-sm">
              Imagens enviadas diretamente para seu email como anexos
            </p>
          </button>

          <button
            onClick={() => setDeliveryMethod("download")}
            className="p-6 bg-[#0F172A] border border-[#1E293B] rounded-xl hover:border-[#22C55E] transition-colors group"
          >
            <Download className="w-8 h-8 text-[#22C55E] mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-white mb-2">💾 Download Direto</h4>
            <p className="text-[#94A3B8] text-sm">
              Baixar imagens diretamente no seu navegador
            </p>
          </button>
        </div>
      )}

      {/* Email Form */}
      <AnimatePresence>
        {deliveryMethod === "email" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6"
          >
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#2563EB]" />
              Enviar por Email
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Seu Nome (opcional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como você gostaria de ser chamado?"
                  className="w-full px-4 py-3 bg-[#1E293B] border border-[#334155] rounded-lg text-white placeholder-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-4 py-3 bg-[#1E293B] border border-[#334155] rounded-lg text-white placeholder-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeliveryMethod(null)}
                  className="flex-1 py-3 px-4 bg-[#374151] text-white rounded-lg hover:bg-[#4B5563] transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleEmailDelivery}
                  disabled={isLoading || !email}
                  className="flex-1 py-3 px-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Enviar Imagens
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Direct Download */}
      <AnimatePresence>
        {deliveryMethod === "download" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6"
          >
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-[#22C55E]" />
              Download Direto
            </h4>
            
            <p className="text-[#94A3B8] mb-6">
              {generatedImages.length === 1 
                ? "Sua imagem será baixada diretamente"
                : `Suas ${generatedImages.length} imagens serão baixadas em um arquivo ZIP`
              }
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeliveryMethod(null)}
                className="flex-1 py-3 px-4 bg-[#374151] text-white rounded-lg hover:bg-[#4B5563] transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleDirectDownload}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Preparando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Baixar Agora
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
