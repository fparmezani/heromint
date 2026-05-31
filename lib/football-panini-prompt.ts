export const FOOTBALL_PANINI_PROMPT = `Create a classic premium HeroMint football album sticker inspired by tournament collections.

REFERENCE IMAGES:
- The first reference image is the real player. Preserve the exact face, age, hair, skin tone and gender presentation.
- The second reference image is the exact selected {{TIME}} crest. Use it accurately only beside the team name in the lower information panel.

NON-NEGOTIABLE VISUAL RULES:
- Do NOT use a globe, earth icon, world map or planet icon anywhere.
- Show a generic white football trophy silhouette in the top-right area with clearly legible text "COPA 2026".
- Show clearly legible text "2026" in the top-left area.
- Use a clean bright yellow Brazil-inspired jersey with green details and number 10, without any club crest on the chest, shirt or sleeves.
- The supplied {{TIME}} crest MUST appear only in the lower information panel beside the team name. Never place it on the player's uniform.
- Use the player photo for facial identity only. Do not copy hand gestures or thumbs-up poses.
- Keep arms and hands outside the visible frame.

LAYOUT:
- Vertical 2:3 sticker, 1024x1536.
- Vibrant turquoise and teal background with a subtle oversized rounded "26" graphic.
- Thin clean white rounded sticker edge only, no metallic frame.
- Right side: small circular Brazil-inspired flag and vertical text "BRASIL".
- Bottom panel: player "{{NOME}}", stats "{{DATA_NASCIMENTO}} | {{ALTURA}} | {{PESO}}", team "{{TIME}}" and supplied crest.

AVOID:
- Globe, earth icon, world map, planet icon, missing year, missing trophy.
- Club crest on the jersey, club crest on the player's chest, club crest on sleeves, invented or altered club crest, club uniform, Nike, Adidas, Puma, Panini or FIFA logos.
- Thumbs-up gesture, visible hands, distorted face, extra people, watermark, unreadable typography.`;

function formatHeight(height?: string): string {
  return height ? `${height} cm` : "altura nao informada";
}

function formatWeight(weight?: string): string {
  return weight ? `${weight} kg` : "peso nao informado";
}

function replacePlaceholders(prompt: string, formData: Record<string, string>): string {
  const replacements: Record<string, string> = {
    "{{NOME}}": formData.nome || "JOGADOR",
    "{{GENERO}}": formData.genero || "nao informado",
    "{{PAIS}}": formData.pais || "Brasil",
    "{{TIME}}": formData.time || "Clube",
    "{{DATA_NASCIMENTO}}": formData.dataNascimento || "data nao informada",
    "{{ALTURA}}": formatHeight(formData.altura),
    "{{PESO}}": formatWeight(formData.peso),
    "{{POSICAO}}": formData.posicao || "posicao nao informada",
  };

  return Object.entries(replacements).reduce(
    (result, [placeholder, replacement]) => result.replaceAll(placeholder, replacement),
    prompt
  );
}

export function buildFootballPaniniPrompt(formData: Record<string, string>): string {
  return replacePlaceholders(FOOTBALL_PANINI_PROMPT, formData);
}
