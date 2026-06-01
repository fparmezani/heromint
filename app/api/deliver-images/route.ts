import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { uploadMultipleImages, downloadImageAsBuffer } from "@/lib/google-drive";
import { isSandboxEnvironment } from "@/lib/environment";

export async function POST(request: NextRequest) {
  try {
    // Verifica autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const { collectibleId, paymentId, imageUrls, themeName, packageType } = await request.json();

    if (!collectibleId || !imageUrls || !Array.isArray(imageUrls)) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    // Em produção, verificaria se o pagamento foi aprovado
    if (!isSandboxEnvironment()) {
      // TODO: Verify the persisted payment status before delivering images.
      // if (paymentStatus !== 'approved') {
      //   return NextResponse.json({ error: "Pagamento não aprovado" }, { status: 403 });
      // }
    }

    // Baixa as imagens e converte para Buffer
    const imageBuffers = await Promise.all(
      imageUrls.map(async (imageData: any, index: number) => {
        const buffer = await downloadImageAsBuffer(imageData.imageUrl);
        return {
          buffer,
          templateUsed: imageData.templateUsed || 'unknown',
          index,
        };
      })
    );

    // Faz upload para Google Drive do usuário
    const uploadResults = await uploadMultipleImages({
      images: imageBuffers,
      accessToken: session.accessToken as string,
      userEmail: session.user.email,
      collectibleId,
      themeName: themeName || 'Card',
    });

    // Salva registro da entrega (opcional - banco de dados)
    const deliveryRecord = {
      collectibleId,
      userEmail: session.user.email,
      paymentId,
      packageType,
      deliveredAt: new Date().toISOString(),
      driveFiles: uploadResults,
      environment: isSandboxEnvironment() ? 'sandbox' : 'production',
    };

    console.log('📦 Imagens entregues:', deliveryRecord);

    return NextResponse.json({
      success: true,
      message: "Imagens entregues com sucesso!",
      delivery: {
        totalImages: uploadResults.length,
        driveFolder: "HeroMint Cards",
        files: uploadResults.map(file => ({
          fileName: file.fileName,
          viewLink: file.webViewLink,
        })),
      },
    });

  } catch (error) {
    console.error("Erro na entrega de imagens:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
