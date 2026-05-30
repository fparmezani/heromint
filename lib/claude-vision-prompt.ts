import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function generateCustomizedPrompt(
  photoBase64: string,
  theme: string,
  formData: Record<string, string>
): Promise<string> {
  const nome = formData.nome || "the person";

  const themePrompts: Record<string, string> = {
    "futebol-2026": `Analyze this photo and create a detailed prompt to transform the uploaded person into a premium football portrait.
CRITICAL: The person is a ${formData.genero === "Feminino" ? "woman" : formData.genero === "Masculino" ? "man" : "person"} — the output MUST be a ${formData.genero === "Feminino" ? "woman" : formData.genero === "Masculino" ? "man" : "person"}.
- Preserve the exact same individual from the reference image
- Preserve apparent age, child/adult proportions, face shape, expression, hairstyle, skin tone, and ALL distinctive features
- Do not change the person's gender under any circumstances
- Do not make a child look like an adult professional athlete
- Describe their current appearance precisely
- Change only clothing and background into: bright yellow/green Brazilian-inspired football jersey, number 10 on chest, stadium background with floodlights, dramatic cinematic lighting
- Keep the face and identity perfectly recognizable from the original photo`,

    "futebol-familia": `Analyze this photo and describe this person's FACE and APPEARANCE in EXTREME detail so an AI image generator can recreate them faithfully in a family football photograph.

DESCRIBE EXHAUSTIVELY:
- Gender and apparent age
- Face shape (oval, round, square, heart-shaped, long, etc.)
- Skin tone, complexion, and any skin marks
- Eye color, eye shape, eyebrow shape and thickness
- Nose shape and size
- Mouth shape, smile characteristics, lip fullness
- Hair color, length, texture, and exact style
- Any facial hair (beard, mustache, stubble, or clean-shaven)
- ALL distinctive features (glasses, freckles, moles, scars, dimples, accessories)
- Build and body type
- Current expression and demeanor

CRITICAL: The generated image MUST recreate this EXACT person's face — not a generic lookalike. Describe every unique facial feature so precisely that no one else could match this description.`,



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
      model: "claude-3-sonnet-20240229",
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
              text: `Create an EXTREMELY detailed image generation prompt for this exact person. Your task is to describe this individual so precisely that an AI image generator can recreate their appearance faithfully.

Describe in detail:
- Exact gender
- Apparent age range
- Face shape (oval, round, square, heart-shaped, etc.)
- Skin tone and complexion
- Eye color, eye shape, eyebrows
- Nose shape and size
- Mouth and smile characteristics
- Hair color, length, texture, and style
- Any facial hair (beard, mustache, stubble, or clean-shaven)
- Distinctive features (moles, freckles, scars, glasses, accessories)
- Build/body type
- Expression and demeanor

Then describe how to place this exact person into the requested theme: change ONLY the clothing and background, keeping this same individual's face, body, and identity completely unchanged.`,


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
