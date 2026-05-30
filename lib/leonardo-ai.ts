// Leonardo AI integration for collectible image generation
// Uses the Leonardo Vision XL or PhotoReal models for best quality

interface LeonardoGenerationRequest {
  prompt: string;
  imageBase64?: string;
  modelId?: string;
  width?: number;
  height?: number;
  numImages?: number;
  guidance_scale?: number;
  negative_prompt?: string;
}

interface LeonardoGenerationResponse {
  sdGenerationJob: {
    generationId: string;
    apiCreditCost: number;
    status: string;
  };
}

interface LeonardoImageResult {
  id: string;
  url: string;
  nsfw: boolean;
}

const API_BASE = "https://api.leonardo.ai/rest/v1";
const API_KEY = (process.env.LEONARDO_API_KEY ?? "").trim();

// Leonardo AI model IDs
const MODELS = {
  photoReal: "aa77f04e-3934-4f69-9ffb-13d205601afa",    // PhotoReal - very realistic
  visionXL: "6bef9f1b-29cb-40c2-b45a-667c4b22d4a8",     // Leonardo Vision XL
  ultraRealistic: "e0cf4d7f-3dda-461d-be7f-d00d4f1f8082", // Ultra Realistic
};

async function generateWithLeonardo(
  request: LeonardoGenerationRequest
): Promise<string> {
  const modelId = request.modelId ?? MODELS.photoReal;

  // Step 1: Submit generation request
  const generateResponse = await fetch(`${API_BASE}/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      prompt: request.prompt,
      negative_prompt:
        request.negative_prompt ??
        "blurry, low quality, distorted, cut off, watermark",
      modelId,
      width: request.width ?? 512,
      height: request.height ?? 768,
      guidance_scale: request.guidance_scale ?? 7.5,
      num_images: request.numImages ?? 1,
      photoReal: modelId === MODELS.photoReal,
    }),
  });

  if (!generateResponse.ok) {
    throw new Error(
      `Leonardo generation failed: ${generateResponse.statusText}`
    );
  }

  const genData = (await generateResponse.json()) as LeonardoGenerationResponse;
  const generationId = genData.sdGenerationJob.generationId;

  // Step 2: Poll for completion (with timeout)
  const maxAttempts = 120; // 2 minutes with 1 second polling
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 1000)); // Wait 1 second

    const statusResponse = await fetch(
      `${API_BASE}/generations/${generationId}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    if (!statusResponse.ok) {
      throw new Error(`Leonardo status check failed: ${statusResponse.statusText}`);
    }

    const statusData = await statusResponse.json();
    const job = statusData.generationJob ?? statusData.sdGenerationJob;

    if (job?.status === "COMPLETE") {
      // Return the first generated image URL
      const images = job.generatedImages as LeonardoImageResult[];
      if (images && images.length > 0) {
        return images[0].url;
      }
      throw new Error("No images returned from Leonardo");
    }

    if (job?.status === "FAILED") {
      throw new Error(`Leonardo generation failed: ${job.failureReason ?? "Unknown"}`);
    }

    attempts++;
  }

  throw new Error("Leonardo generation timeout after 2 minutes");
}

export async function generateCollectibleImageLeonardo(
  theme: string,
  formData: Record<string, string>,
  uploadedImageBase64?: string
): Promise<string> {
  const nome = Object.values(formData)[0] ?? "the person";

  const prompts: Record<string, string> = {
    "futebol-2026": `EXTREME CLOSE-UP TIGHT PORTRAIT FILLING THE ENTIRE IMAGE EDGE-TO-EDGE. ${nome} as professional football player. CRITICAL: No margins, no empty space, fills entire frame completely. Face to lower chest visible. FACING CAMERA directly. Keep face EXACTLY THE SAME. WEARING BRIGHT YELLOW AND GREEN BRAZILIAN SELEÇÃO JERSEY with Nike logo visible, NUMBER 10 clearly on chest, CBF shield. DRAMATIC STADIUM BACKGROUND filling entire edges - bright floodlights overhead, stadium lights, dark evening sky. Professional photorealistic sports card. FILLS COMPLETE IMAGE EDGE-TO-EDGE. Ultra high quality, 8K.`,

    "hero-card": `EXTREME CLOSE-UP FILLING THE ENTIRE IMAGE EDGE-TO-EDGE. ${nome} as fantasy warrior. CRITICAL: No margins, fills frame completely. Face to shoulders visible. FACING CAMERA. Keep face EXACTLY THE SAME. Epic dark fantasy armor with glowing PURPLE RUNES and GOLD ACCENTS. Dramatic dark magical battlefield background filling entire edges. FILLS COMPLETE IMAGE EDGE-TO-EDGE. Cinematic photorealistic movie quality. Ultra high resolution.`,

    "profissional-premium": `EXTREME CLOSE-UP FILLING THE ENTIRE IMAGE EDGE-TO-EDGE. ${nome} executive. CRITICAL: No margins, fills frame completely. Face to chest visible. FACING CAMERA directly. Keep face EXACTLY THE SAME. Sharp tailored DARK BUSINESS SUIT, white dress shirt. Modern luxury office background with FLOOR-TO-CEILING WINDOWS showing city skyline at dusk. FILLS COMPLETE IMAGE EDGE-TO-EDGE. Professional corporate quality. Ultra high quality.`,

    "reino-medieval": `EXTREME CLOSE-UP FILLING THE ENTIRE IMAGE EDGE-TO-EDGE. ${nome} medieval knight. CRITICAL: No margins, fills frame completely. Face to shoulders visible. FACING CAMERA. Keep face EXACTLY THE SAME. FULL MEDIEVAL ARMOR with royal golden cape, house crest. Dramatic castle courtyard background filling entire edges. FILLS COMPLETE IMAGE EDGE-TO-EDGE. Cinematic photorealistic movie quality. Ultra high resolution.`,

    "escola-de-magia": `EXTREME CLOSE-UP FILLING THE ENTIRE IMAGE EDGE-TO-EDGE. ${nome} wizard student. CRITICAL: No margins, fills frame completely. Face to shoulders visible. FACING CAMERA. Keep face EXACTLY THE SAME. Dark WIZARD ROBE with GREEN AND SILVER, holding GLOWING MAGICAL WAND. Magical academy background filling entire edges. FILLS COMPLETE IMAGE EDGE-TO-EDGE. Cinematic magical photorealistic quality. Ultra high resolution.`,

    "baby-hero": `EXTREME CLOSE-UP FILLING THE ENTIRE IMAGE EDGE-TO-EDGE. ${nome} young superhero. CRITICAL: No margins, fills frame completely. Face to shoulders visible. FACING CAMERA. Keep face EXACTLY THE SAME. BRIGHT COLORFUL SUPERHERO COSTUME with RED CAPE. Comic book style city background filling entire edges. FILLS COMPLETE IMAGE EDGE-TO-EDGE. Fun heroic vibrant cinematic quality. Ultra high quality.`,

    "family-pack": `EXTREME CLOSE-UP FILLING THE ENTIRE IMAGE EDGE-TO-EDGE. ${nome} family portrait. CRITICAL: No margins, fills frame completely. Face visible. FACING CAMERA. Keep appearance EXACTLY THE SAME. Warm professional family style with GOLDEN HOUR sunlight, bokeh background filling entire edges. FILLS COMPLETE IMAGE EDGE-TO-EDGE. Professional portrait quality. Ultra high quality.`,

    "pet-star": `EXTREME CLOSE-UP FILLING THE ENTIRE IMAGE EDGE-TO-EDGE. ${nome} regal pet. CRITICAL: No margins, fills frame completely. Face centered and visible. FACING CAMERA. Keep features EXACTLY THE SAME. GOLDEN CROWN on head. Luxurious VELVET THRONE background filling entire edges with royal decorations. FILLS COMPLETE IMAGE EDGE-TO-EDGE. Regal cinematic lighting. Ultra high quality.`,

    "battle-card": `EXTREME CLOSE-UP FILLING THE ENTIRE IMAGE EDGE-TO-EDGE. ${nome} battle warrior. CRITICAL: No margins, fills frame completely. Face to shoulders visible. FACING CAMERA. Keep face EXACTLY THE SAME. COMBAT GEAR with warrior attitude. Dark dramatic ARENA BACKGROUND filling entire edges with LIGHTNING EFFECTS. FILLS COMPLETE IMAGE EDGE-TO-EDGE. Cinematic action quality. Ultra high resolution.`,

    "avatar-poster": `EXTREME CLOSE-UP FILLING THE ENTIRE IMAGE EDGE-TO-EDGE. ${nome} cinematic avatar. CRITICAL: No margins, fills frame completely. Face to shoulders visible. FACING CAMERA forward. Keep face EXACTLY THE SAME. ${formData.estiloVisual ?? "Cyberpunk city"} background filling entire edges with ${formData.energiaPrincipal ?? "electric"} ENERGY EFFECTS. FILLS COMPLETE IMAGE EDGE-TO-EDGE. Movie poster quality. Ultra high quality, 8K.`,
  };

  const prompt =
    prompts[theme] ??
    `Professional trading card of ${nome}. CLOSE-UP portrait filling entire frame. FACING CAMERA. Keep face EXACTLY THE SAME. Epic themed background. Ultra high quality photorealistic.`;

  return generateWithLeonardo({
    prompt,
    imageBase64: uploadedImageBase64,
    modelId: MODELS.photoReal,
    width: 512,
    height: 768,
    guidance_scale: 7.5,
  });
}
