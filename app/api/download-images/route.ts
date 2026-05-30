import { NextRequest, NextResponse } from "next/server";
import { isSandboxEnvironment } from "@/lib/environment";
import JSZip from "jszip";

export async function POST(request: NextRequest) {
  try {
    const { collectibleId, imageUrls, themeName, userEmail, packageType } = await request.json();

    if (!collectibleId || !imageUrls || !Array.isArray(imageUrls)) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    // Em produção, verificaria se o pagamento foi aprovado
    if (!isSandboxEnvironment()) {
      // TODO: Verificar status do pagamento no Asaas
      // const paymentStatus = await verifyAsaasPayment(paymentId);
      // if (paymentStatus !== 'approved') {
      //   return NextResponse.json({ error: "Pagamento não aprovado" }, { status: 403 });
      // }
    }

    // Baixa todas as imagens
    const imageBuffers = await Promise.all(
      imageUrls.map(async (imageData: any, index: number) => {
        try {
          const response = await fetch(imageData.imageUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const buffer = await response.arrayBuffer();
          return {
            buffer: Buffer.from(buffer),
            filename: `${themeName}_v${index + 1}_${imageData.templateUsed || 'card'}.png`,
            templateUsed: imageData.templateUsed,
          };
        } catch (error) {
          console.error(`Erro ao baixar imagem ${index + 1}:`, error);
          return null;
        }
      })
    );

    // Remove imagens que falharam
    const validImages = imageBuffers.filter(Boolean);

    if (validImages.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma imagem pôde ser processada" },
        { status: 500 }
      );
    }

    // Se for apenas uma imagem, retorna diretamente
    if (validImages.length === 1) {
      const image = validImages[0]!;
      return new NextResponse(image.buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${image.filename}"`,
          'Content-Length': image.buffer.length.toString(),
        },
      });
    }

    // Se forem múltiplas imagens, cria um ZIP
    const zip = new JSZip();
    
    validImages.forEach((image) => {
      if (image) {
        zip.file(image.filename, image.buffer);
      }
    });

    // Adiciona um arquivo README
    const readmeContent = `
HeroMint - Suas Imagens Épicas
==============================

Tema: ${themeName}
Pacote: ${packageType}
Total de imagens: ${validImages.length}
Gerado em: ${new Date().toLocaleString('pt-BR')}

Obrigado por usar o HeroMint!
Visite: https://heromint.com

© 2026 HeroMint - Transformando fotos em lendas
    `;
    
    zip.file("README.txt", readmeContent);

    // Gera o ZIP
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipFilename = `HeroMint_${themeName}_${collectibleId}.zip`;

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("Erro no download de imagens:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
