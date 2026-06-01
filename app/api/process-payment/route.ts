import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrCreateUser, saveGeneratedImages, updateOrderPaymentStatus } from "@/lib/supabase";
import { isSandboxEnvironment } from "@/lib/environment";
import { isPackageAvailable, PACKAGE_CONFIG } from "@/types/collectible";
import { readGeneratedImageToken } from "@/lib/generated-image-token";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPaymentLink } from "@/lib/payment-config";

interface GeneratedPaymentImage {
  imageUrl: string;
  templateUsed?: string;
  deliveryToken?: string;
  isMock?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [PAYMENT] Iniciando processamento de pagamento...');
    
    const requestBody = await request.json();
    console.log('📦 [PAYMENT] Dados recebidos:', JSON.stringify(requestBody, null, 2));
    
    const { 
      userEmail,
      userName,
      collectibleId, 
      themeName, 
      packageType, 
      formData,
      generatedImages,
      isDevMode = false
    } = requestBody;
    const session = await getServerSession(authOptions);
    const effectiveUserEmail = session?.user?.email || userEmail;
    const effectiveUserName = session?.user?.name || userName;

    console.log('✅ [PAYMENT] Dados extraídos:', {
      userEmail: effectiveUserEmail,
      userName: effectiveUserName,
      collectibleId,
      themeName,
      packageType,
      hasFormData: !!formData,
      hasGeneratedImages: !!generatedImages,
      isDevMode
    });

    if (!effectiveUserEmail || !collectibleId || !themeName || !packageType || !formData) {
      console.log('❌ [PAYMENT] Dados obrigatórios faltando');
      return NextResponse.json(
        { error: "Dados obrigatórios faltando" },
        { status: 400 }
      );
    }
    if (
      !Array.isArray(generatedImages) ||
      generatedImages.length === 0 ||
      (generatedImages as GeneratedPaymentImage[]).some((image) => image.isMock)
    ) {
      return NextResponse.json(
        { error: "Imagem real ainda nao foi gerada. Tente novamente antes de pagar." },
        { status: 400 }
      );
    }
    if (!isPackageAvailable(packageType)) {
      return NextResponse.json(
        { error: "Pacote ainda nÃ£o disponÃ­vel" },
        { status: 400 }
      );
    }

    console.log('👤 [PAYMENT] Buscando ou criando usuário...');
    // Busca ou cria usuário
    const user = await getOrCreateUser(effectiveUserEmail, effectiveUserName);
    console.log('✅ [PAYMENT] Usuário obtido:', { id: user.id, email: user.email });
    
    console.log('💰 [PAYMENT] Calculando valor total...');
    // Calcula valor total
    const packageConfig = PACKAGE_CONFIG[packageType as keyof typeof PACKAGE_CONFIG];
    if (!packageConfig) {
      console.log('❌ [PAYMENT] Tipo de pacote inválido:', packageType);
      return NextResponse.json(
        { error: "Tipo de pacote inválido" },
        { status: 400 }
      );
    }
    console.log('✅ [PAYMENT] Pacote configurado:', { type: packageType, price: packageConfig.price });

    console.log('📝 [PAYMENT] Criando pedido no banco...');
    // Cria pedido no banco
    const order = await createOrder({
      user_id: user.id,
      collectible_id: collectibleId,
      theme_name: themeName,
      package_type: packageType,
      total_amount: packageConfig.price,
      form_data: formData,
    });

    if (generatedImages && generatedImages.length > 0 && !isSandboxEnvironment() && !isDevMode) {
      const imageRecords = (generatedImages as GeneratedPaymentImage[]).map((img, index) => ({
        order_id: order.id,
        image_url: img.deliveryToken
          ? readGeneratedImageToken(img.deliveryToken, collectibleId).imageUrl
          : img.imageUrl,
        template_used: img.templateUsed || 'unknown',
        file_name: `${themeName}_v${index + 1}_${img.templateUsed || 'card'}.png`,
      }));

      await saveGeneratedImages(imageRecords);
    }
    console.log('✅ [PAYMENT] Pedido criado:', { id: order.id, status: order.payment_status });

    console.log('🔧 [PAYMENT] Verificando modo de desenvolvimento...');
    // Em modo desenvolvimento ou sandbox, marca como pago automaticamente
    if (isDevMode || isSandboxEnvironment()) {
      console.log('🧪 [PAYMENT] Modo desenvolvimento ativo - processando automaticamente');
      
      console.log('💳 [PAYMENT] Atualizando status do pagamento...');
      await updateOrderPaymentStatus(order.id, 'paid', `dev_payment_${Date.now()}`);
      console.log('✅ [PAYMENT] Status atualizado para "paid"');
      
      // Salva imagens geradas se fornecidas
      if (generatedImages && generatedImages.length > 0) {
        console.log('🖼️ [PAYMENT] Salvando imagens geradas...', { count: generatedImages.length });
        
        const imageRecords = (generatedImages as GeneratedPaymentImage[]).map((img, index) => ({
          order_id: order.id,
          image_url: img.deliveryToken
            ? readGeneratedImageToken(img.deliveryToken, collectibleId).imageUrl
            : img.imageUrl,
          template_used: img.templateUsed || 'unknown',
          file_name: `${themeName}_v${index + 1}_${img.templateUsed || 'card'}.png`,
        }));
        
        console.log('📸 [PAYMENT] Registros de imagem preparados:', imageRecords);
        await saveGeneratedImages(imageRecords);
        console.log('✅ [PAYMENT] Imagens salvas no banco');
      } else {
        console.log('⚠️ [PAYMENT] Nenhuma imagem para salvar');
      }

      console.log('🎉 [PAYMENT] Processamento concluído com sucesso');
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

    console.log('🏭 [PAYMENT] Modo produção - preparando Stripe Payment Link');
    return NextResponse.json({
      success: true,
      message: "Pedido criado, redirecionando para pagamento",
      order: {
        id: order.id,
        collectible_id: collectibleId,
        status: 'pending',
        payment_url: getPaymentUrl(packageType, order.id, effectiveUserEmail),
      },
    });

  } catch (error: unknown) {
    const normalizedError = error instanceof Error ? error : new Error("Erro desconhecido");
    console.error("❌ [PAYMENT] ERRO CRÍTICO:", error);
    console.error("❌ [PAYMENT] Stack trace:", normalizedError.stack);
    console.error("❌ [PAYMENT] Tipo do erro:", typeof error);
    console.error("❌ [PAYMENT] Mensagem:", normalizedError.message);
    
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        details: normalizedError.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

function getPaymentUrl(packageType: string, orderId: string, userEmail: string): string {
  const baseUrl = getPaymentLink(packageType as keyof typeof PACKAGE_CONFIG);

  if (!baseUrl) {
    throw new Error(`Link de pagamento Stripe não configurado para o pacote: ${packageType}`);
  }

  const paymentUrl = new URL(baseUrl);
  paymentUrl.searchParams.set("client_reference_id", orderId);
  paymentUrl.searchParams.set("prefilled_email", userEmail);
  return paymentUrl.toString();
}
