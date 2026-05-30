"use client";

import { useState } from "react";
import { CreditCard, Loader2, User, Download } from "lucide-react";
// import { useSession, signIn } from "next-auth/react"; // Descomente após instalar
import type { PackageType } from "@/types/collectible";
import { getPaymentLink, hasPaymentLink } from "@/lib/payment-config";
import { isSandboxEnvironment } from "@/lib/environment";

interface PaymentButtonProps {
  collectibleId: string;
  packageType: PackageType;
  price: number;
  generatedImages?: Array<{ imageUrl: string; templateUsed?: string }>;
  themeName: string;
}

export function PaymentButton({
  collectibleId,
  packageType,
  price,
  generatedImages = [],
  themeName,
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  // const { data: session } = useSession(); // Descomente após instalar

  // Mock session para desenvolvimento
  const session = null; // Substitua por useSession() após instalar

  const handlePaymentFlow = async () => {
    // Se não estiver logado, redireciona para login
    if (!session) {
      const callbackUrl = encodeURIComponent(window.location.href);
      window.location.href = `/auth/signin?callbackUrl=${callbackUrl}`;
      return;
    }

    // Se estiver em sandbox, simula entrega direta
    if (isSandboxEnvironment()) {
      await handleSandboxDelivery();
      return;
    }

    // Em produção, redireciona para pagamento real
    if (hasPaymentLink(packageType)) {
      window.open(getPaymentLink(packageType), "_blank");
    }
  };

  const handleSandboxDelivery = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/deliver-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectibleId,
          paymentId: `sandbox_${Date.now()}`,
          imageUrls: generatedImages,
          themeName,
          packageType,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          `🎉 Imagens entregues com sucesso!\n\n` +
          `📁 Pasta: ${result.delivery.driveFolder}\n` +
          `📸 Total: ${result.delivery.totalImages} imagens\n\n` +
          `Verifique seu Google Drive!`
        );
      } else {
        alert("Erro na entrega: " + result.error);
      }
    } catch (error) {
      alert("Erro ao entregar imagens: " + error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonText = () => {
    if (isProcessing) return "Entregando...";
    if (!session) return "Fazer Login e Pagar";
    if (isSandboxEnvironment()) return "Entregar Imagens (Teste)";
    return `Finalizar Pagamento - R$ ${(price / 100).toFixed(2).replace(".", ",")}`;
  };

  const getButtonIcon = () => {
    if (isProcessing) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (!session) return <User className="w-5 h-5" />;
    if (isSandboxEnvironment()) return <Download className="w-5 h-5" />;
    return <CreditCard className="w-5 h-5" />;
  };

  const isDisabled = isProcessing || (!hasPaymentLink(packageType) && !isSandboxEnvironment());

  return (
    <button
      onClick={handlePaymentFlow}
      disabled={isDisabled}
      className={`w-full text-base h-14 rounded-2xl flex items-center justify-center gap-3 font-medium transition-all ${
        isDisabled
          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
          : !session
          ? "bg-[#4285F4] text-white hover:bg-[#3367D6] animate-glow-pulse"
          : isSandboxEnvironment()
          ? "bg-[#FBBF24] text-black hover:bg-[#F59E0B]"
          : "btn-primary animate-glow-pulse"
      }`}
    >
      {getButtonIcon()}
      {getButtonText()}
    </button>
  );
}
