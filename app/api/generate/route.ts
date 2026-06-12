import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  generateMultipleCollectibleImages,
  MAX_FAMILY_REFERENCE_PHOTOS,
} from "@/lib/image-generation";
import { persistGeneratedImage } from "@/lib/generated-image-storage";
import { createGeneratedImageToken } from "@/lib/generated-image-token";
import { shouldBypassWatermark } from "@/lib/environment";
import { checkGenerationRateLimit, getGenerationClientIp, resetGenerationRateLimit } from "@/lib/generation-rate-limit";
import { hasClubCrest } from "@/lib/football-2026-prompt";
import { isPackageAvailable, PACKAGE_CONFIG } from "@/types/collectible";
import type { PackageType } from "@/types/collectible";
import { isThemeAvailable } from "@/lib/themes";
import { normalizeReferenceImages } from "@/lib/reference-image";
import { getThemeById } from "@/lib/themes";
import { recordGeneratedPreviewForRecovery } from "@/lib/recovery-emails";

// Allow up to 5 minutes for Replicate to generate the image
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8);

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Faca login com Google para gerar seu preview.", errorCode: requestId },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const clientIp = getGenerationClientIp(request);

    // Check by email first (more reliable than IP), then IP as fallback
    const emailRateLimit = checkGenerationRateLimit(userEmail);
    const ipRateLimit = emailRateLimit.allowed ? checkGenerationRateLimit(clientIp) : emailRateLimit;
    const rateLimit = emailRateLimit.allowed ? ipRateLimit : emailRateLimit;

    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetAt).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      });

      return NextResponse.json(
        {
          error: `Limite diario de previews atingido. Tente novamente apos ${resetDate}.`,
          isRateLimit: true,
          resetAt: rateLimit.resetAt,
          errorCode: requestId,
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000)).toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { theme, formData, photoBase64, photosBase64, packageType } = body;

    if (!theme || !formData || !packageType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!isThemeAvailable(theme)) {
      return NextResponse.json({ error: "Theme not available yet" }, { status: 400 });
    }
    if (!isPackageAvailable(packageType)) {
      return NextResponse.json({ error: "Package not available yet" }, { status: 400 });
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

    let normalizedPhotos = uploadedPhotos;
    if (uploadedPhotos) {
      try {
        normalizedPhotos = await normalizeReferenceImages(uploadedPhotos);
      } catch (error) {
        console.error(`[GENERATE ${requestId}] Reference image normalization failed:`, error);
        return NextResponse.json(
          {
            error: "Nao foi possivel ler a foto enviada. Tente outra foto em formato JPG ou PNG.",
            errorCode: requestId,
          },
          { status: 400 }
        );
      }
    }

    if (theme === "futebol-familia") {
      const familyPhotos = Array.isArray(normalizedPhotos)
        ? normalizedPhotos
        : normalizedPhotos
          ? [normalizedPhotos]
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

    if (theme === "futebol-2026" || theme === "futebol-panini") {
      const playerPhotos = Array.isArray(normalizedPhotos)
        ? normalizedPhotos
        : normalizedPhotos
          ? [normalizedPhotos]
          : [];

      if (playerPhotos.length === 0) {
        return NextResponse.json({ error: "Envie uma foto do jogador." }, { status: 400 });
      }
      if (!hasClubCrest(formData.time)) {
        return NextResponse.json({ error: "Selecione um time com escudo disponível." }, { status: 400 });
      }
    }

    const result = await generateMultipleCollectibleImages({
      theme,
      formData,
      uploadedImageBase64: normalizedPhotos,
      versions: pkg.versions,
    });

    if (result.images.some((image) => image.isMock)) {
      throw new Error("Image provider returned a mock fallback");
    }

    const collectibleId = `heromint_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const traceLabel =
      formData.nome ||
      formData.nomeFamilia ||
      formData.nomeJogador1 ||
      "HeroMint";
    const bypassWatermark = shouldBypassWatermark();

    const images = await Promise.all(
      result.images.map(async (image, index) => {
        // Skip watermark/persist in sandbox/test mode
        if (bypassWatermark) {
          return {
            ...image,
            imageUrl: image.imageUrl,
            previewImageUrl: image.imageUrl,
            originalImageUrl: image.imageUrl,
            deliveryToken: createGeneratedImageToken({
              collectibleId,
              imageUrl: image.imageUrl,
            }),
          };
        }

        try {
          const persistedImage = await persistGeneratedImage(
            image.imageUrl,
            collectibleId,
            index,
            traceLabel
          );
          return {
            ...image,
            imageUrl: persistedImage.previewImageUrl,
            previewImageUrl: persistedImage.previewImageUrl,
            deliveryToken: createGeneratedImageToken({
              collectibleId,
              imageUrl: persistedImage.imageUrl,
            }),
          };
        } catch (uploadError) {
          console.error(`Failed to persist generated image ${index + 1}:`, uploadError);
          throw new Error("Unable to create protected preview");
        }
      })
    );
    await recordGeneratedPreviewForRecovery({
      user_email: session.user.email,
      user_name: session.user.name,
      collectible_id: collectibleId,
      theme_name: getThemeById(theme)?.name || theme,
      package_type: packageType,
      form_data: formData,
      client_ip: clientIp,
    });

    return NextResponse.json({
      collectibleId,
      images,
      totalGenerated: result.totalGenerated,
      packageType,
      theme,
      formData,
    });
  } catch (error) {
    console.error(`[GENERATE ${requestId}] Generate error:`, error);
    return NextResponse.json(
      {
        error: "Nao foi possivel gerar o card com esta foto. Tente novamente ou envie outra foto.",
        errorCode: requestId,
      },
      { status: 500 }
    );
  }
}
