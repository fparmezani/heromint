import Replicate from "replicate";

const replicate = new Replicate({
  auth: (process.env.REPLICATE_API_TOKEN ?? "").trim(),
});

export async function generateWithStableDiffusion(
  theme: string,
  formData: Record<string, string>,
  uploadedImageBase64?: string
): Promise<string> {
  const nome = Object.values(formData)[0] ?? "JOGADOR";

  const prompts: Record<string, string> = {
    "futebol-2026": `Professional football player ${nome}, wearing yellow and green Brazilian Seleção jersey number 10, face to chest, stadium background with lights, photorealistic, high quality`,
    "hero-card": `Fantasy warrior ${nome}, dark armor with purple runes, facing camera, dramatic battlefield background`,
    "profissional-premium": `Professional executive portrait ${nome}, dark business suit, modern office background`,
    "reino-medieval": `Medieval knight ${nome}, full armor with golden cape, castle background`,
    "escola-de-magia": `Wizard student ${nome}, dark robe with green embroidery, magical academy hallway`,
    "baby-hero": `Young superhero ${nome}, colorful costume with red cape, comic book style city background`,
    "family-pack": `Family portrait of ${nome}, warm golden hour lighting, nature background`,
    "pet-star": `Regal pet ${nome}, golden crown, velvet throne background`,
    "battle-card": `Battle warrior ${nome}, combat gear, dark arena with lightning effects`,
    "avatar-poster": `Cinematic avatar ${nome}, futuristic background with energy effects`,
  };

  const prompt = prompts[theme] || `Professional character portrait of ${nome}, high quality`;

  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion",
      {
        input: {
          prompt,
          num_outputs: 1,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          width: 512,
          height: 768,
        },
      }
    );

    const imageUrl = Array.isArray(output) ? String(output[0]) : String(output);
    return imageUrl;
  } catch (err) {
    console.error("Stable Diffusion error:", err);
    throw err;
  }
}
