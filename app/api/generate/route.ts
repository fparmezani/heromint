import { NextRequest, NextResponse } from "next/server";
import { generateMultipleCollectibleImages } from "@/lib/image-generation";
import { PACKAGE_CONFIG } from "@/types/collectible";
import type { PackageType } from "@/types/collectible";

// Allow up to 5 minutes for Replicate to generate the image
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme, formData, photoBase64, packageType } = body;

    if (!theme || !formData || !packageType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get number of versions based on package type
    const pkg = PACKAGE_CONFIG[packageType as PackageType];
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package type" }, { status: 400 });
    }

    const result = await generateMultipleCollectibleImages({
      theme,
      formData,
      uploadedImageBase64: photoBase64 ?? undefined,
      versions: pkg.versions,
    });

    const collectibleId = `heromint_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    return NextResponse.json({
      collectibleId,
      images: result.images,
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
