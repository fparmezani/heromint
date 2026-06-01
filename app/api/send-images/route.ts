import { NextRequest, NextResponse } from "next/server";
import { sendEmail, createDeliveryEmailTemplate } from "@/lib/email-service";
import { isSandboxEnvironment } from "@/lib/environment";

export async function POST(request: NextRequest) {
  try {
    const { 
      collectibleId, 
      imageUrls, 
      themeName, 
      userEmail, 
      userName,
      packageType 
    } = await request.json();

    if (!collectibleId || !imageUrls || !userEmail || !Array.isArray(imageUrls)) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    // Em produção, verificaria se o pagamento foi aprovado
    if (!isSandboxEnvironment()) {
      // TODO: Verify the persisted payment status before sending images.
    }

    // Baixa todas as imagens e converte para anexos
    const attachments = await Promise.all(
      imageUrls.map(async (imageData: any, index: number) => {
        try {
          const response = await fetch(imageData.imageUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const buffer = await response.arrayBuffer();
          
          return {
            filename: `${themeName}_v${index + 1}_${imageData.templateUsed || 'card'}.png`,
            content: Buffer.from(buffer),
            contentType: 'image/png',
          };
        } catch (error) {
          console.error(`Erro ao baixar imagem ${index + 1}:`, error);
          return null;
        }
      })
    );

    // Remove anexos que falharam
    const validAttachments = attachments.filter(Boolean);

    if (validAttachments.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma imagem pôde ser processada" },
        { status: 500 }
      );
    }

    // Cria o template do email
    const emailHtml = createDeliveryEmailTemplate({
      userName: userName || userEmail.split('@')[0],
      themeName,
      packageType,
      totalImages: validAttachments.length,
      downloadUrl: `${process.env.NEXTAUTH_URL}/api/download-images?id=${collectibleId}`,
    });

    // Envia o email
    const emailResult = await sendEmail({
      to: userEmail,
      subject: `🎉 Suas imagens ${themeName} estão prontas! - HeroMint`,
      html: emailHtml,
      attachments: validAttachments as any[],
    });

    // Log da entrega
    const deliveryRecord = {
      collectibleId,
      userEmail,
      themeName,
      packageType,
      totalImages: validAttachments.length,
      deliveredAt: new Date().toISOString(),
      messageId: emailResult.messageId,
      environment: isSandboxEnvironment() ? 'sandbox' : 'production',
    };

    console.log('📧 Imagens enviadas por email:', deliveryRecord);

    return NextResponse.json({
      success: true,
      message: "Imagens enviadas por email com sucesso!",
      delivery: {
        totalImages: validAttachments.length,
        sentTo: userEmail,
        messageId: emailResult.messageId,
      },
    });

  } catch (error) {
    console.error("Erro no envio de email:", error);
    return NextResponse.json(
      { error: "Erro ao enviar email: " + (error as Error).message },
      { status: 500 }
    );
  }
}
