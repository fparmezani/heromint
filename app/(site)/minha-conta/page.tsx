"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Download, 
  Mail, 
  Calendar, 
  Package, 
  CreditCard,
  Eye,
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { getUserOrders, getOrCreateUser, type Order, type GeneratedImage } from "@/lib/supabase";
import { PACKAGE_CONFIG } from "@/types/collectible";

interface OrderWithImages extends Order {
  generated_images: GeneratedImage[];
}

export default function MinhaContaPage() {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<OrderWithImages[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleLogin = async () => {
    if (!email || !email.includes("@")) {
      alert("Por favor, digite um email válido");
      return;
    }

    setLoading(true);
    try {
      // Busca ou cria usuário
      const userData = await getOrCreateUser(email);
      setUser(userData);
      
      // Busca pedidos do usuário
      const userOrders = await getUserOrders(userData.id);
      setOrders(userOrders);
      
      setIsLoggedIn(true);
      
      // Salva no localStorage para próximas visitas
      localStorage.setItem("heromint_user_email", email);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao acessar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImages = async (order: OrderWithImages) => {
    try {
      const response = await fetch("/api/download-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectibleId: order.collectible_id,
          imageUrls: order.generated_images.map(img => ({
            imageUrl: img.image_url,
            templateUsed: img.template_used,
          })),
          themeName: order.theme_name,
          packageType: order.package_type,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `HeroMint_${order.theme_name}_${order.collectible_id}.${order.generated_images.length === 1 ? 'png' : 'zip'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Erro no download");
      }
    } catch (error) {
      alert("Erro no download: " + error);
    }
  };

  // Verifica se há email salvo no localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("heromint_user_email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

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
            href="/"
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
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email da Conta
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 bg-[#1E293B] border border-[#334155] rounded-lg text-white placeholder-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading || !email}
                  className="w-full bg-[#2563EB] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Acessando...
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      Acessar Minha Conta
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-[#1E293B] text-center">
                <p className="text-[#64748B] text-sm">
                  Digite o email usado nas suas compras para acessar o histórico
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
              href="/"
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
                <p className="text-2xl font-bold text-white">{orders.length}</p>
                <p className="text-[#94A3B8] text-sm">Pedidos Realizados</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Download className="w-8 h-8 text-[#22C55E]" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {orders.filter(o => o.payment_status === 'paid').length}
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
                  {formatPrice(orders.reduce((sum, o) => o.payment_status === 'paid' ? sum + o.total_amount : sum, 0))}
                </p>
                <p className="text-[#94A3B8] text-sm">Total Gasto</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-4">Histórico de Pedidos</h2>
          
          {orders.length === 0 ? (
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
            orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6"
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
                    <p className="text-white font-medium">{order.generated_images.length}</p>
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

                {order.payment_status === 'paid' && order.generated_images.length > 0 && (
                  <div className="flex gap-3 pt-4 border-t border-[#1E293B]">
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
                      Visualizar
                    </Link>
                  </div>
                )}

                {order.payment_status === 'pending' && (
                  <div className="pt-4 border-t border-[#1E293B]">
                    <p className="text-[#FBBF24] text-sm">
                      ⏳ Aguardando confirmação do pagamento
                    </p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
