import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function generateCustomizedPrompt(
  photoBase64: string,
  theme: string,
  formData: Record<string, string>
): Promise<string> {
  const nome = formData.nome || "the person";

  const themePrompts: Record<string, string> = {
    "futebol-2026": `Analyze this photo and create a detailed prompt to transform the person into a premium football card character:
- Keep their face, expression, and distinctive features EXACTLY the same
- Describe their current appearance (pose, clothing, facial features, hair, skin tone)
- Create a detailed description of how to transform them into: professional football player in bright yellow/green Brazilian Seleção jersey, number 10 on chest, stadium background with floodlights, dramatic cinematic lighting, professional sports card quality
- Make the transformation feel natural while keeping all their facial features identical`,

    "hero-card": `Analyze this photo and create a detailed prompt to transform them into a dark fantasy warrior:
- Keep their face and features EXACTLY the same
- Describe what you see (pose, expression, distinctive features)
- Create prompt for: fantasy warrior armor with purple glowing runes, dark magical battlefield background, cinematic photorealistic quality
- Maintain their face perfectly`,

    "profissional-premium": `Analyze this photo and create a detailed prompt for a premium business portrait:
- Preserve their face and features exactly
- Note their current appearance and style
- Transform into: executive in tailored dark suit, modern office with city skyline, professional corporate quality
- Keep face identical`,

    "reino-medieval": `Analyze this photo and transform into medieval knight:
- Keep face and features the same
- Describe current appearance
- Transform into: full medieval knight armor with royal cape, castle background, cinematic quality
- Face stays identical`,

    "escola-de-magia": `Analyze this photo and transform into wizard:
- Keep face features the same
- Note current appearance
- Transform into: dark wizard robe with green accents, glowing wand, magical academy background
- Face unchanged`,

    "baby-hero": `Analyze this photo and transform into young superhero:
- Keep face identical
- Note current style and expression
- Transform into: colorful superhero costume with cape, comic book style background
- Face stays the same`,

    "family-pack": `Analyze this photo for family portrait transformation:
- Keep face and features the same
- Note appearance and expression
- Transform into: warm golden hour family portrait lighting, nature background, professional family photo quality
- Face identical`,

    "pet-star": `Analyze this photo and transform into regal pet star:
- Keep face and features the same
- Note current appearance
- Transform into: golden crown, velvet throne, regal dramatic lighting
- Face stays identical`,

    "battle-card": `Analyze this photo and transform into battle warrior:
- Keep face the same
- Describe current appearance
- Transform into: combat gear, dark battle arena with lightning, cinematic action quality
- Face unchanged`,

    "avatar-poster": `Analyze this photo and transform into cinematic avatar:
- Keep face identical
- Note appearance
- Transform into: cyberpunk style, futuristic city background, neon lights, movie poster quality
- Face stays the same`,
  };

  const systemPrompt = themePrompts[theme] || `Analyze this photo and create a detailed transformation prompt while keeping the person's face exactly the same`;

  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: photoBase64.replace(/^data:image\/[^;]+;base64,/, ""),
              },
            },
            {
              type: "text",
              text: `Create a detailed, specific prompt for this image transformation. Include details you observe about: pose, lighting, facial features, expression, current clothing, and hair. Then describe exactly how to transform this while KEEPING THE FACE IDENTICAL. Make it visual and detailed for image generation.`,
            },
          ],
        },
      ],
    });

    const prompt =
      response.content[0].type === "text" ? response.content[0].text : "";
    console.log(`✅ Claude Vision generated customized prompt`);
    return prompt;
  } catch (err) {
    console.error(`❌ Claude Vision failed:`, err);
    throw err;
  }
}
