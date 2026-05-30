import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrCreateUser, saveGeneratedImages, updateOrderPaymentStatus } from "@/lib/supabase";
import { isSandboxEnvironment } from "@/lib/environment";
import { PACKAGE_CONFIG } from "@/types/collectible";

export async function POST(request: NextRequest) {
  try {
    const { 
      userEmail,
      userName,
      collectibleId, 
      themeName, 
      packageType, 
      formData,
      generatedImages,
      isDevMode = false
    } = await request.json();

    if (!userEmail || !collectibleId || !themeName || !packageType || !formData) {
      return NextResponse.json(
        { error: "Dados obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Busca ou cria usuário
    const user = await getOrCreateUser(userEmail, userName);
    
    // Calcula valor total
    const packageConfig = PACKAGE_CONFIG[packageType as keyof typeof PACKAGE_CONFIG];
    if (!packageConfig) {
      return NextResponse.json(
        { error: "Tipo de pacote inválido" },
        { status: 400 }
      );
    }

    // Cria pedido no banco
    const order = await createOrder({
      user_id: user.id,
      collectible_id: collectibleId,
      theme_name: themeName,
      package_type: packageType,
      total_amount: packageConfig.price,
      form_data: formData,
    });

    // Em modo desenvolvimento ou sandbox, marca como pago automaticamente
    if (isDevMode || isSandboxEnvironment()) {
      await updateOrderPaymentStatus(order.id, 'paid', `dev_payment_${Date.now()}`);
      
      // Salva imagens geradas se fornecidas
      if (generatedImages && generatedImages.length > 0) {
        const imageRecords = generatedImages.map((img: any, index: number) => ({
          order_id: order.id,
          image_url: img.imageUrl,
          template_used: img.templateUsed || 'unknown',
          file_name: `${themeName}_v${index + 1}_${img.templateUsed || 'card'}.png`,
        }));
        
        await saveGeneratedImages(imageRecords);
      }

      return NextResponse.json({
        success: true,
        message: "Pedido processado com sucesso (modo desenvolvimento)",
        order: {
          id: order.id,
          collectible_id: collectibleId,
          status: 'paid',
          redirect_url: `/entrega/${order.id}`,
        },
      });
    }

    // Em produção, retorna dados para pagamento real
    return NextResponse.json({
      success: true,
      message: "Pedido criado, redirecionando para pagamento",
      order: {
        id: order.id,
        collectible_id: collectibleId,
        status: 'pending',
        payment_url: getPaymentUrl(packageType, order.id),
      },
    });

  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

function getPaymentUrl(packageType: string, orderId: string): string {
  // Aqui você pode adicionar parâmetros para identificar o pedido no callback
  const baseUrls: Record<string, string> = {
    individual: "https://www.asaas.com/c/60vtiurluc6gmh3w",
    premium: "https://www.asaas.com/c/1gg8ttm0exyb26w3",
    completo: "https://www.asaas.com/c/completo-10-images", // TODO: Criar link
  };
  
  const baseUrl = baseUrls[packageType];
  if (!baseUrl) {
    throw new Error("Link de pagamento não configurado para este pacote");
  }
  
  // Adiciona parâmetros para rastreamento (se o Asaas suportar)
  return `${baseUrl}?order_id=${orderId}`;
}
