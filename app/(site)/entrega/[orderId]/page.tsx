"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Download, Mail, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { DeliveryOptions } from "@/components/delivery/DeliveryOptions";
import { supabase } from "@/lib/supabase";

interface OrderData {
  id: string;
  collectible_id: string;
  theme_name: string;
  package_type: string;
  payment_status: string;
  form_data: any;
  generated_images: Array<{
    id: string;
    image_url: string;
    template_used: string;
    file_name: string;
  }>;
  user: {
    email: string;
    name?: string;
  };
}

export default function EntregaPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);

  // Auto-polling interval reference
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (orderId) {
      loadOrderData();
    }
    
    // Cleanup polling on unmount
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Busca dados do pedido com imagens e usuário
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          generated_images (*),
          users!orders_user_id_fkey (email, name)
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        setError("Pedido não encontrado");
        return;
      }

      // Verifica se o pagamento foi aprovado
      if (data.payment_status !== 'paid') {
        setError("Pagamento ainda não foi confirmado. Aguardando confirmação do Asaas...");
        // Start polling if payment is still pending
        startPolling();
        return;
      }

      // Payment confirmed - stop polling and show order
      stopPolling();
      setOrder({
        ...data,
        user: data.users,
      });

    } catch (err) {
      console.error("Erro ao carregar pedido:", err);
      setError("Erro ao carregar dados do pedido");
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    // Clear any existing interval
    stopPolling();
    
    // Poll every 5 seconds for up to 5 minutes (60 attempts)
    let attempts = 0;
    const maxAttempts = 60;
    
    pollingRef.current = setInterval(async () => {
      attempts++;
      console.log(`🔄 [POLLING] Checking payment status... Attempt ${attempts}/${maxAttempts}`);
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('payment_status')
          .eq('id', orderId)
          .single();
        
        if (error) {
          console.error("Polling error:", error);
          return;
        }
        
        if (data?.payment_status === 'paid') {
          console.log("✅ [POLLING] Payment confirmed! Refreshing page...");
          stopPolling();
          // Reload full order data
          loadOrderData();
          return;
        }
        
        if (attempts >= maxAttempts) {
          console.log("⏰ [POLLING] Max attempts reached. Stopping.");
          stopPolling();
          setError("Pagamento ainda não confirmado após 5 minutos. Verifique na sua conta ou tente novamente.");
        }
      } catch (err) {
        console.error("Polling exception:", err);
      }
    }, 5000);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-[#0A0E1A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-[#0A0E1A]">
        <div className="section-container">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>

          <div className="max-w-md mx-auto text-center">
            <div className="bg-[#0F172A] border border-[#EF4444]/20 rounded-2xl p-8">
              <AlertCircle className="w-16 h-16 text-[#EF4444] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">Ops! Algo deu errado</h1>
              <p className="text-[#94A3B8] mb-6">{error}</p>
              
              <div className="space-y-3">
                <button
                  onClick={loadOrderData}
                  className="w-full bg-[#2563EB] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#1D4ED8] transition-colors"
                >
                  Tentar Novamente
                </button>
                <Link
                  href="/minha-conta"
                  className="block w-full bg-[#374151] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#4B5563] transition-colors text-center"
                >
                  Ver Minha Conta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

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

        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <CheckCircle className="w-20 h-20 text-[#22C55E] mx-auto mb-4" />
            <h1 className="font-impact text-4xl text-white tracking-wide mb-2">
              PAGAMENTO CONFIRMADO!
            </h1>
            <p className="text-[#94A3B8] text-lg">
              Suas imagens épicas estão prontas para download
            </p>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4">Resumo do Pedido</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#64748B]">Tema</p>
                <p className="text-white font-medium">{order.theme_name}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Pacote</p>
                <p className="text-white font-medium">{order.package_type}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Imagens</p>
                <p className="text-white font-medium">{order.generated_images.length}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Cliente</p>
                <p className="text-white font-medium">{order.user.name || order.user.email.split('@')[0]}</p>
              </div>
            </div>

            {/* Form Data Preview */}
            <div className="mt-4 pt-4 border-t border-[#1E293B]">
              <p className="text-[#64748B] text-sm mb-2">Dados do Card:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(order.form_data).map(([key, value]) => (
                  <span
                    key={key}
                    className="bg-[#1E293B] text-white text-xs px-2 py-1 rounded"
                  >
                    {key}: {value as string}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Delivery Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8"
          >
            <DeliveryOptions
              collectibleId={order.collectible_id}
              packageType={order.package_type}
              themeName={order.theme_name}
              generatedImages={order.generated_images.map(img => ({
                imageUrl: img.image_url,
                templateUsed: img.template_used,
              }))}
              onDeliveryComplete={() => setDeliveryCompleted(true)}
            />
          </motion.div>

          {/* Footer Actions */}
          {deliveryCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-8 space-y-4"
            >
              <p className="text-[#94A3B8]">
                Gostou do resultado? Crie mais cards épicos!
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/temas"
                  className="bg-[#2563EB] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#1D4ED8] transition-colors"
                >
                  Criar Novo Card
                </Link>
                <Link
                  href="/minha-conta"
                  className="bg-[#374151] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#4B5563] transition-colors"
                >
                  Minha Conta
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
