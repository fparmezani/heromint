import { NextRequest, NextResponse } from "next/server";
import {
  generateMultipleCollectibleImages,
  MAX_FAMILY_REFERENCE_PHOTOS,
} from "@/lib/image-generation";
import { persistGeneratedImage } from "@/lib/generated-image-storage";
import { PACKAGE_CONFIG } from "@/types/collectible";
import type { PackageType } from "@/types/collectible";

// Allow up to 5 minutes for Replicate to generate the image
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme, formData, photoBase64, photosBase64, packageType } = body;

    if (!theme || !formData || !packageType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get number of versions based on package type
    const pkg = PACKAGE_CONFIG[packageType as PackageType];
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package type" }, { status: 400 });
    }

    // Support single photo (legacy) or multiple photos array
    const uploadedPhotos = photosBase64 && Array.isArray(photosBase64) && photosBase64.length > 0
      ? photosBase64
      : photoBase64
        ? photoBase64
        : undefined;

    if (theme === "futebol-familia") {
      const familyPhotos = Array.isArray(uploadedPhotos)
        ? uploadedPhotos
        : uploadedPhotos
          ? [uploadedPhotos]
          : [];
      const familySize = Number(formData.quantidadeMembros);

      if (familyPhotos.length === 0) {
        return NextResponse.json({ error: "Envie uma foto para cada membro da família." }, { status: 400 });
      }
      if (familyPhotos.length > MAX_FAMILY_REFERENCE_PHOTOS || familySize > MAX_FAMILY_REFERENCE_PHOTOS) {
        return NextResponse.json(
          { error: `A foto de família aceita no máximo ${MAX_FAMILY_REFERENCE_PHOTOS} membros.` },
          { status: 400 }
        );
      }
      if (familyPhotos.length !== familySize) {
        return NextResponse.json(
          { error: `Envie exatamente uma foto para cada membro da família (${familySize} fotos).` },
          { status: 400 }
        );
      }
    }

    const result = await generateMultipleCollectibleImages({
      theme,
      formData,
      uploadedImageBase64: uploadedPhotos,
      versions: pkg.versions,
    });

    const collectibleId = `heromint_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const images = await Promise.all(
      result.images.map(async (image, index) => {
        if (image.isMock || image.imageUrl.startsWith("data:")) {
          return image;
        }

        try {
          const persistedImageUrl = await persistGeneratedImage(
            image.imageUrl,
            collectibleId,
            index
          );
          return {
            ...image,
            imageUrl: persistedImageUrl,
          };
        } catch (uploadError) {
          console.error(`Failed to persist generated image ${index + 1}:`, uploadError);
          return image;
        }
      })
    );

    return NextResponse.json({
      collectibleId,
      images,
      totalGenerated: result.totalGenerated,
      packageType,
      theme,
      formData,
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Erro ao gerar card. Tente novamente." }, { status: 500 });
  }
}
