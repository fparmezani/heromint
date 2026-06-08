"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Download, 
  Package, 
  CreditCard,
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { getUserOrders, getOrCreateUser, type Order, type GeneratedImage, type User as AccountUser } from "@/lib/supabase";
import { PACKAGE_CONFIG } from "@/types/collectible";
import { CardTemplate } from "@/components/preview/CardTemplate";

interface OrderWithImages extends Order {
  generated_images: GeneratedImage[];
}

function getDownloadExtension(contentType: string, imageCount: number) {
  if (imageCount > 1) return "zip";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("png")) return "png";
  return "jpg";
}

function OrderImageCarousel({
  order,
  onImageUnavailable,
}: {
  order: OrderWithImages;
  onImageUnavailable: (orderId: string, imageId: string) => void;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = order.generated_images.filter((image) => !image.indisponivel);
  const safeActiveImageIndex = Math.min(activeImageIndex, Math.max(images.length - 1, 0));
  const activeImage = images[safeActiveImageIndex];
  const hasMultipleImages = images.length > 1;

  if (!activeImage) {
    return null;
  }

  const showPrevious = () => {
    setActiveImageIndex((safeActiveImageIndex - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setActiveImageIndex((safeActiveImageIndex + 1) % images.length);
  };

  return (
    <div className="mb-4 flex justify-center">
      <div className="relative w-full max-w-xs overflow-hidden rounded-xl border border-[#1E293B] bg-[#020617] aspect-[2/3]">
        <div className="h-full w-full">
          <CardTemplate
            themeId={activeImage.template_used}
            photoUrl={activeImage.image_url}
            generatedImageUrl={activeImage.image_url}
            formData={order.form_data as Record<string, string>}
            showWatermark={false}
          />
        </div>

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-xs text-white">
          Imagem {safeActiveImageIndex + 1} de {images.length}
        </span>
      </div>
    </div>
  );
}

export default function MinhaContaPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<OrderWithImages[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AccountUser | null>(null);
  const ordersCarouselRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const email = session?.user?.email || "";
  const visibleOrders = orders.filter((order) => (
    order.generated_images.some((image) => !image.indisponivel)
  ));

  const loadAccount = useCallback(async (accountEmail: string) => {
    setLoading(true);
    try {
      // Busca ou cria usuário
      const userData = await getOrCreateUser(accountEmail, session?.user?.name || undefined);
      setUser(userData);
      
      // Busca pedidos do usuário
      const userOrders = await getUserOrders(userData.id);
      setOrders(userOrders);
      
      setIsLoggedIn(true);
      
      // Salva no localStorage para próximas visitas
      localStorage.setItem("heromint_user_email", accountEmail);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao acessar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Polling para pedidos pendentes
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userId = user?.id;

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    
    pollingRef.current = setInterval(async () => {
      if (!userId) return;
      
      try {
        await fetch("/api/stripe/reconcile", { method: "POST" });
        const userOrders = await getUserOrders(userId);
        setOrders(userOrders);
        
        // Para polling se não houver pedidos pendentes
        const hasPending = userOrders.some(o => o.payment_status === 'pending');
        if (!hasPending && pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch (error) {
        console.error("Erro ao atualizar pedidos:", error);
      }
    }, 5000);
  }, [userId]);

  useEffect(() => {
    if (status !== "authenticated" || !email || isLoggedIn || loading) return;

    const timeoutId = window.setTimeout(() => {
      void loadAccount(email);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [email, isLoggedIn, loadAccount, loading, status]);

  // Inicia polling quando houver pedidos pendentes
  useEffect(() => {
    const hasPending = orders.some(o => o.payment_status === 'pending');
    if (hasPending && isLoggedIn) {
      startPolling();
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [orders, isLoggedIn, startPolling]);

  const handleRefreshOrders = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await fetch("/api/stripe/reconcile", { method: "POST" });
      const userOrders = await getUserOrders(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImages = async (order: OrderWithImages) => {
    const availableImages = order.generated_images.filter((image) => !image.indisponivel);

    if (availableImages.length === 0) {
      alert("Nenhuma imagem disponível para download.");
      return;
    }

    try {
      const response = await fetch("/api/download-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectibleId: order.collectible_id,
          imageUrls: availableImages.map(img => ({
            imageUrl: img.image_url,
            templateUsed: img.template_used,
          })),
          themeName: order.theme_name,
          packageType: order.package_type,
          formData: order.form_data,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `HeroMint_${order.theme_name}_${order.collectible_id}.${getDownloadExtension(blob.type, availableImages.length)}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        const result = await response.json().catch(() => null);
        alert("Erro no download: " + (result?.error || "Não foi possível preparar o arquivo."));
      }
    } catch (error) {
      alert("Erro no download: " + error);
    }
  };

  const handleImageUnavailable = (orderId: string, imageId: string) => {
    setOrders((currentOrders) => currentOrders.map((order) => (
      order.id === orderId
        ? {
            ...order,
            generated_images: order.generated_images.filter((image) => image.id !== imageId),
          }
        : order
    )));

    void fetch("/api/generated-images/mark-unavailable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    }).catch((error) => {
      console.error("Erro ao marcar imagem indisponível:", error);
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-[#22C55E]";
      case "pending": return "text-[#FBBF24]";
      case "failed": return "text-[#EF4444]";
      default: return "text-[#94A3B8]";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid": return "✅ Pago";
      case "pending": return "⏳ Pendente";
      case "failed": return "❌ Falhou";
      case "refunded": return "🔄 Reembolsado";
      default: return status;
    }
  };

  const scrollOrders = (direction: "previous" | "next") => {
    ordersCarouselRef.current?.scrollBy({
      left: direction === "previous" ? -420 : 420,
      behavior: "smooth",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-[#0A0E1A]">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl" />
        </div>

        <div className="section-container relative z-10">
          <Link
            href="/futebol"
            className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>

          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <User className="w-16 h-16 text-[#2563EB] mx-auto mb-4" />
                <h1 className="font-impact text-3xl text-white tracking-wide mb-2">
                  MINHA CONTA
                </h1>
                <p className="text-[#94A3B8]">
                  Acesse suas compras e baixe suas imagens
                </p>
              </div>

              <div className="space-y-4">
                {status === "authenticated" ? (
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-[#1E293B] px-4 py-3 text-sm text-[#94A3B8]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando sua conta...
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/minha-conta" })}
                    className="w-full bg-[#2563EB] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#1D4ED8] flex items-center justify-center gap-2 transition-colors"
                  >
                    <>
                      <User className="w-4 h-4" />
                      Entrar com Google
                    </>
                  </button>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-[#1E293B] text-center">
                <p className="text-[#64748B] text-sm">
                  Use sua conta Google para acessar seu histórico de pedidos
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0A0E1A]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/futebol"
              className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div>
              <h1 className="font-impact text-3xl text-white tracking-wide">
                MINHA CONTA
              </h1>
              <p className="text-[#94A3B8]">
                Bem-vindo, {user?.name || email.split("@")[0]}!
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setOrders([]);
              localStorage.removeItem("heromint_user_email");
              void signOut({ callbackUrl: "/futebol" });
            }}
            className="text-[#94A3B8] hover:text-white transition-colors text-sm"
          >
            Sair
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[#2563EB]" />
              <div>
                <p className="text-2xl font-bold text-white">{visibleOrders.length}</p>
                <p className="text-[#94A3B8] text-sm">Pedidos Realizados</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Download className="w-8 h-8 text-[#22C55E]" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {visibleOrders.filter(o => o.payment_status === 'paid').length}
                </p>
                <p className="text-[#94A3B8] text-sm">Prontos para Download</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-[#FBBF24]" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(visibleOrders.reduce((sum, o) => o.payment_status === 'paid' ? sum + o.total_amount : sum, 0))}
                </p>
                <p className="text-[#94A3B8] text-sm">Total Gasto</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">Histórico de Pedidos</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRefreshOrders}
                disabled={loading}
                className="rounded-full border border-[#1E293B] bg-[#0F172A] p-2 text-white transition-colors hover:border-[#2563EB] disabled:opacity-50"
                aria-label="Atualizar pedidos"
                title="Atualizar pedidos"
              >
                <Loader2 className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              {visibleOrders.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollOrders("previous")}
                    className="rounded-full border border-[#1E293B] bg-[#0F172A] p-2 text-white transition-colors hover:border-[#2563EB]"
                    aria-label="Pedido anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollOrders("next")}
                    className="rounded-full border border-[#1E293B] bg-[#0F172A] p-2 text-white transition-colors hover:border-[#2563EB]"
                    aria-label="Próximo pedido"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {visibleOrders.length === 0 ? (
            <div className="text-center py-12 bg-[#0F172A] border border-[#1E293B] rounded-xl">
              <Package className="w-16 h-16 text-[#64748B] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum pedido encontrado</h3>
              <p className="text-[#94A3B8] mb-6">
                Você ainda não fez nenhuma compra com este email
              </p>
              <Link
                href="/temas"
                className="btn-primary inline-flex items-center gap-2 px-6 h-12 rounded-xl"
              >
                <Package className="w-4 h-4" />
                Criar Meu Primeiro Card
              </Link>
            </div>
          ) : (
            <div
              ref={ordersCarouselRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
            >
              {visibleOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-[88vw] max-w-md shrink-0 snap-start bg-[#0F172A] border border-[#1E293B] rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {order.theme_name}
                    </h3>
                    <p className="text-[#94A3B8] text-sm">
                      Pedido #{order.collectible_id}
                    </p>
                  </div>
                  <span className={`font-medium ${getStatusColor(order.payment_status)}`}>
                    {getStatusText(order.payment_status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-[#64748B]">Pacote</p>
                    <p className="text-white font-medium">
                      {PACKAGE_CONFIG[order.package_type as keyof typeof PACKAGE_CONFIG]?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748B]">Imagens</p>
                    <p className="text-white font-medium">
                      {order.generated_images.filter((image) => !image.indisponivel).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#64748B]">Valor</p>
                    <p className="text-white font-medium">{formatPrice(order.total_amount)}</p>
                  </div>
                  <div>
                    <p className="text-[#64748B]">Data</p>
                    <p className="text-white font-medium">{formatDate(order.created_at)}</p>
                  </div>
                </div>

                {order.payment_status === 'paid' && order.generated_images.some((image) => !image.indisponivel) && (
                  <div className="pt-4 border-t border-[#1E293B]">
                    <OrderImageCarousel order={order} onImageUnavailable={handleImageUnavailable} />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDownloadImages(order)}
                        className="flex-1 bg-[#22C55E] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#16A34A] transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Baixar Imagens
                      </button>
                      <Link
                        href={`/preview/${order.collectible_id}`}
                        className="bg-[#2563EB] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                )}

                {order.payment_status === 'pending' && (
                  <div className="pt-4 border-t border-[#1E293B]">
                    <p className="text-[#FBBF24] text-sm mb-3">
                      ⏳ Aguardando confirmação do pagamento
                    </p>
                    <Link
                      href={`/entrega/${order.id}`}
                      className="w-full bg-[#22C55E] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#16A34A] transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <CreditCard className="w-4 h-4" />
                      Verificar Pagamento
                    </Link>
                  </div>
                )}
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
