"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CreditCard, Shield, Star, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { CardTemplate } from "@/components/preview/CardTemplate";
import { FirstPurchaseCouponBanner } from "@/components/payment/FirstPurchaseCouponBanner";
import { PACKAGE_CONFIG } from "@/types/collectible";
import type { PackageType } from "@/types/collectible";
import { hasPaymentLink } from "@/lib/payment-config";
import { isSandboxEnvironment, shouldBypassWatermark } from "@/lib/environment";
import { trackHotjarEvent } from "@/lib/hotjar-events";

interface PreviewData {
  collectibleId: string;
  theme: string;
  themeName: string;
  themeIcon: string;
  packageType: PackageType;
  formData: Record<string, string>;
  photoUrl?: string; // legacy single photo
  photoUrls?: string[]; // new multiple photos
  generatedImageUrl?: string; // from Replicate (may not exist if mock) - backward compatibility
  generatedImages?: Array<{ imageUrl: string; previewImageUrl?: string; originalImageUrl?: string; deliveryToken?: string; promptUsed: string; isMock: boolean; templateUsed?: string }>; // multiple images
  totalGenerated?: number;
  isMock?: boolean;
}

export default function PreviewPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isTestingPayment, setIsTestingPayment] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const { data: session } = useSession();
  const paymentEmail = session?.user?.email;
  const paymentUserName = session?.user?.name;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const raw = localStorage.getItem(`heromint_preview_${id}`);
      if (raw) {
        try {
          setData(JSON.parse(raw));
        } catch {
          // ignore parse errors
        }
      }
      setLoading(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [id]);

  // Verifica se há um pedido pendente no localStorage
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const pendingOrder = localStorage.getItem('heromint_pending_order_id');
      if (pendingOrder) {
        setPendingOrderId(pendingOrder);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handlePaymentFlow = () => {
    if (!paymentEmail || !paymentEmail.includes("@")) {
      trackHotjarEvent("google_login_required", {
        source: "preview_payment",
        theme: data?.theme,
        package: data?.packageType,
      });
      setShowLoginForm(true);
      return;
    }
    
    if (isSandboxEnvironment()) {
      handleDevPayment();
    } else {
      handleProductionPayment();
    }
  };

  const handleDevPayment = async () => {
    if (!data) return;
    
    trackHotjarEvent("sandbox_payment_started", {
      theme: data.theme,
      package: data.packageType,
    });
    setIsTestingPayment(true);
    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: paymentEmail,
          userName: paymentUserName,
          collectibleId: data.collectibleId,
          themeName: data.themeName,
          packageType: data.packageType,
          formData: data.formData,
          generatedImages: data.generatedImages?.map(img => ({
            imageUrl: img.imageUrl,
            templateUsed: img.templateUsed,
            deliveryToken: img.deliveryToken,
          })) || [],
          isDevMode: true,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        trackHotjarEvent("sandbox_payment_completed", {
          theme: data.theme,
          package: data.packageType,
        });
        // Redireciona para página de entrega
        window.location.href = result.order.redirect_url;
      } else {
        alert('Erro no processamento: ' + result.error);
      }
    } catch (error) {
      alert('Erro ao processar: ' + error);
    } finally {
      setIsTestingPayment(false);
    }
  };

  const handleProductionPayment = async () => {
    if (!data) return;
    
    trackHotjarEvent("payment_order_started", {
      provider: "stripe",
      theme: data.theme,
      package: data.packageType,
    });
    setIsTestingPayment(true);
    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: paymentEmail,
          userName: paymentUserName,
          collectibleId: data.collectibleId,
          themeName: data.themeName,
          packageType: data.packageType,
          formData: data.formData,
          generatedImages: data.generatedImages?.map(img => ({
            imageUrl: img.imageUrl,
            templateUsed: img.templateUsed,
            deliveryToken: img.deliveryToken,
          })) || [],
          isDevMode: false,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        trackHotjarEvent("stripe_checkout_started", {
          theme: data.theme,
          package: data.packageType,
        });
        // Use a same-tab redirect: browsers may block a popup after awaiting
        // the server request that creates the pending order.
        setPendingOrderId(result.order.id);
        localStorage.setItem('heromint_pending_order_id', result.order.id);
        window.location.assign(result.order.payment_url);
      } else {
        alert('Erro no processamento: ' + result.error);
      }
    } catch (error) {
      alert('Erro ao processar: ' + error);
    } finally {
      setIsTestingPayment(false);
    }
  };

  const handleGoogleSignIn = () => {
    trackHotjarEvent("google_login_started", {
      source: "preview_payment",
      theme: data?.theme,
      package: data?.packageType,
    });
    void signIn("google", { callbackUrl: window.location.href });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-[#94A3B8]">Preview não encontrado ou expirado.</p>
        <Link href="/temas" className="btn-primary px-6 h-12 rounded-xl text-sm inline-flex">
          Criar um novo card
        </Link>
      </div>
    );
  }

  const pkg = PACKAGE_CONFIG[data.packageType];
  const hasMultipleImages = data.generatedImages && data.generatedImages.length > 1;
  const currentImage = data.generatedImages?.[selectedImageIndex] || { 
    imageUrl: data.generatedImageUrl, 
    previewImageUrl: undefined,
    originalImageUrl: data.generatedImageUrl,
    isMock: data.isMock || false,
    templateUsed: data.theme
  };
  
  // Use the template specified for this image, or fall back to the original theme
  const currentTemplate = currentImage.templateUsed || data.theme;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        {/* Back */}
        <Link
          href="/temas"
          className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos temas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Left: card preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-center mb-2">
              {isSandboxEnvironment() ? (
                <>
                  <p className="text-[#FBBF24] text-sm font-medium">🧪 Modo Sandbox - Sem marca d&apos;água</p>
                  <p className="text-xs text-[#FBBF24]/80">Ambiente de teste ativo</p>
                </>
              ) : (
                <>
                  <p className="text-[#94A3B8] text-sm font-medium">Preview com marca d&apos;água</p>
                  <p className="text-xs text-[#94A3B8]/60">Finalize o pagamento para baixar sem marca d&apos;água</p>
                </>
              )}
            </div>

            {/* Multiple images selector */}
            {hasMultipleImages && (
              <div className="flex flex-col gap-2 w-full max-w-sm">
                <div className="text-center">
                  <p className="text-sm text-[#94A3B8]">
                    Versão {selectedImageIndex + 1} de {data.generatedImages?.length}
                  </p>
                  {currentImage.templateUsed && (
                    <p className="text-xs text-[#FBBF24] font-medium">
                      {currentImage.templateUsed === "futebol-2026" ? "🏆 Estilo Copa 2026" : "🎯 Estilo Panini"}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                  {data.generatedImages?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors relative ${
                        selectedImageIndex === index
                          ? "bg-[#2563EB] text-white"
                          : "bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155]"
                      }`}
                    >
                      {index + 1}
                      {image.templateUsed === "futebol-panini" && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00B4A6] rounded-full"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="w-full max-w-sm aspect-[9/11]">
              <CardTemplate
                themeId={currentTemplate}
                photoUrl={data.photoUrls?.[0] ?? data.photoUrl ?? ""}
                generatedImageUrl={
                  currentImage.isMock
                    ? undefined
                    : shouldBypassWatermark()
                      ? currentImage.originalImageUrl || currentImage.imageUrl
                      : currentImage.previewImageUrl || currentImage.imageUrl
                }
                formData={data.formData}
                showWatermark={!shouldBypassWatermark()}
              />
            </div>

            <p className="text-xs text-[#94A3B8] text-center max-w-xs">
              Esta é uma versão protegida do seu card. Após o pagamento, você baixa a imagem em alta resolução sem marca d&apos;água.
            </p>
          </motion.div>

          {/* Right: Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div>
              <h1 className="font-impact text-3xl text-white tracking-wide mb-1">
                SEU CARD ESTÁ PRONTO!
              </h1>
              <p className="text-[#94A3B8]">
                Finalize o pagamento para liberar a imagem em alta resolução sem marca d&apos;água.
              </p>
              {hasPaymentLink(data.packageType) && (
                <div className="mt-3 p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg">
                  <p className="text-[#22C55E] text-sm font-medium">
                    ✅ Pagamento disponível! Clique no botão abaixo para finalizar.
                  </p>
                  <p className="text-[#94A3B8] text-xs mt-1">
                    Você será redirecionado ao Stripe para concluir o pagamento com segurança.
                  </p>
                </div>
              )}
              {!hasPaymentLink(data.packageType) && (
                <div className="mt-3 p-3 bg-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-lg">
                  <p className="text-[#FBBF24] text-sm font-medium">
                    ⏳ Link de pagamento para o Pacote Completo em breve!
                  </p>
                </div>
              )}
            </div>

            <FirstPurchaseCouponBanner />

            {/* Order details */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 flex flex-col gap-0">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-3">Resumo do Pedido</h3>

              {[
                { label: "Tema", value: `${data.themeIcon} ${data.themeName}` },
                { label: "Pacote", value: pkg?.label },
                { label: "Versões", value: `${pkg?.versions} ${pkg?.versions === 1 ? "imagem" : "imagens"}` },
                ...Object.entries(data.formData).slice(0, 3).map(([key, val]) => ({
                  label: key.charAt(0).toUpperCase() + key.slice(1),
                  value: val,
                })),
              ].map((row, i, arr) => (
                <div
                  key={row.label + i}
                  className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-[#1E293B]" : ""}`}
                >
                  <span className="text-[#94A3B8] text-sm">{row.label}</span>
                  <span className="text-white text-sm font-medium">{row.value}</span>
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 mt-1 border-t border-[#1E293B]">
                <span className="text-white font-bold">Total</span>
                <span className="font-impact text-2xl gradient-text">
                  R$ {pkg ? (pkg.price / 100).toFixed(2).replace(".", ",") : "0,00"}
                </span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Shield, label: "Pagamento 100% Seguro" },
                { icon: Star, label: "Alta Resolução" },
                { icon: CreditCard, label: "Entrega Imediata" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
                  <Icon className="w-3.5 h-3.5 text-[#22C55E]" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handlePaymentFlow}
              disabled={isTestingPayment}
              className="btn-primary w-full text-base h-14 rounded-2xl animate-glow-pulse flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestingPayment ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {paymentEmail ?
                    `Finalizar Pagamento - R$ ${pkg ? (pkg.price / 100).toFixed(2).replace(".", ",") : "0,00"}` :
                    "Entrar com Google e Pagar"
                  }
                </>
              )}
            </button>

            {/* Botão para verificar entrega após pagamento */}
            {pendingOrderId && (
              <div className="mt-3 p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg">
                <p className="text-[#22C55E] text-xs font-medium mb-2 text-center">
                  ✅ Pagamento iniciado! Já concluiu no Stripe?
                </p>
                <Link
                  href={`/entrega/${pendingOrderId}`}
                  className="w-full bg-[#22C55E] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#16A34A] transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verificar Meu Pagamento
                </Link>
              </div>
            )}

            <p className="text-xs text-[#94A3B8] text-center">
              Stripe • Pagamento seguro
            </p>

            {/* Sandbox testing button */}
            {isSandboxEnvironment() && (
              <div className="mt-4 p-3 bg-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-lg">
                <p className="text-[#FBBF24] text-xs font-medium mb-2 text-center">
                  🧪 Ambiente de Teste (Sandbox)
                </p>
                <button
                  onClick={handleDevPayment}
                  disabled={isTestingPayment}
                  className="w-full bg-[#FBBF24] text-black font-medium py-2 px-4 rounded-lg hover:bg-[#F59E0B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isTestingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Simulando...
                    </>
                  ) : (
                    <>
                      🧪 Simular Pagamento (Teste)
                    </>
                  )}
                </button>
                <p className="text-[#FBBF24] text-xs text-center mt-2">
                  Remove marca d&apos;água sem pagamento real
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Login Modal */}
        {showLoginForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                Entrar com Google
              </h3>
              <p className="text-[#94A3B8] text-center mb-6">
                Para proteger sua compra e entregar a imagem corretamente, entre com sua conta Google.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowLoginForm(false)}
                    className="flex-1 py-3 px-4 bg-[#374151] text-white rounded-lg hover:bg-[#4B5563] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex-1 py-3 px-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Entrar com Google
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#1E293B] text-center">
                <p className="text-[#64748B] text-xs">
                  Login por email e senha não está disponível.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
