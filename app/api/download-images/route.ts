import { NextRequest, NextResponse } from "next/server";
import { isSandboxEnvironment } from "@/lib/environment";
import JSZip from "jszip";

function sanitizeFilename(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "") || "heromint";
}

function getImageFileInfo(contentType: string | null, imageUrl: string) {
  if (contentType?.includes("png")) return { contentType: "image/png", extension: "png" };
  if (contentType?.includes("webp")) return { contentType: "image/webp", extension: "webp" };
  if (contentType?.includes("gif")) return { contentType: "image/gif", extension: "gif" };
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }

  const extension = imageUrl.match(/\.(png|webp|gif|jpe?g)(?:$|\?)/i)?.[1]?.toLowerCase();
  if (extension === "png") return { contentType: "image/png", extension };
  if (extension === "webp") return { contentType: "image/webp", extension };
  if (extension === "gif") return { contentType: "image/gif", extension };
  return { contentType: "image/jpeg", extension: "jpg" };
}

interface DownloadImageData {
  imageUrl: string;
  templateUsed?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { collectibleId, imageUrls, themeName, packageType } = await request.json();

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

    // Baixa todas as imagens
    const imageBuffers = await Promise.all(
      imageUrls.map(async (imageData: DownloadImageData, index: number) => {
        try {
          const sourceUrl = new URL(imageData.imageUrl, request.url).toString();
          const response = await fetch(sourceUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.arrayBuffer();
          const fileInfo = getImageFileInfo(response.headers.get("content-type"), sourceUrl);
          return {
            data,
            filename: `${sanitizeFilename(themeName)}_v${index + 1}_${sanitizeFilename(imageData.templateUsed || "card")}.${fileInfo.extension}`,
            contentType: fileInfo.contentType,
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
      return new Response(image.data, {
        headers: {
          'Content-Type': image.contentType,
          'Content-Disposition': `attachment; filename="${image.filename}"`,
          'Content-Length': image.data.byteLength.toString(),
        },
      });
    }

    // Se forem múltiplas imagens, cria um ZIP
    const zip = new JSZip();
    
    validImages.forEach((image) => {
      if (image) {
        zip.file(image.filename, image.data);
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
    const zipData = await zip.generateAsync({ type: "arraybuffer" });
    const zipFilename = `HeroMint_${sanitizeFilename(themeName)}_${sanitizeFilename(collectibleId)}.zip`;

    return new Response(zipData, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
        'Content-Length': zipData.byteLength.toString(),
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
