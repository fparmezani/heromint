export const FOOTBALL_FAMILY_PROMPT = `Create a premium HeroMint Family Collection football card.

MAIN GOAL:
- Transform an entire family into a legendary football family collectible card.
- Preserve all faces and family relationships.

FORMAT:
- Vertical orientation, aspect ratio 2:3, resolution 1024x1536.

FAMILY COMPOSITION:
- Show exactly {{QUANTIDADE_MEMBROS}} family members standing together with arms naturally around shoulders or backs.
- Preserve every face, apparent age, gender presentation, skin tone, hair, glasses, facial hair and distinctive feature.
- Do not mix facial features, create extra people or omit any family member.
- Use references for identity only. Do not copy original poses, gestures, clothing, props or backgrounds.
- Hands must be relaxed or around relatives. Never use thumbs-up gestures or crossed arms.

VISUAL IDENTITY:
- Premium football family collectible with yellow, green and blue colors.
- Professional football stadium, cinematic stadium lights, softly blurred crowd.
- Matching fictional yellow, green and blue football jerseys with number 10.
- Fictional branding only. Do not use a real club crest.

CARD COPY:
- Top-left: "FAMILY 2026".
- Top-right: "LEGENDS COLLECTION".
- Vertical side identifier: "UNITED".
- Family name: "{{NOME_FAMILIA}}".
- Family stats: "LOVE 100 | UNITY 100 | MEMORIES INFINITE".
- Family motto: "Together we play. Together we win."
- League: "FAMILY LEGENDS".

SCENE OVERRIDES:
- Background: {{BACKGROUND}}.
- Clothing: {{OUTFIT}}.
- Country: {{PAIS}}.
- Favorite team information: {{TIME}}.

AVOID:
- Individual player card, single person, cropped family members, deformed faces, extra people, missing people.
- Real football club logos, FIFA, Nike or Adidas logos, watermark, low resolution, blurred faces.
- Thumbs-up gestures, crossed arms, raised hands, props, food and drinks.`;

function replacePlaceholders(
  prompt: string,
  formData: Record<string, string>,
  memberCount: number,
  background: string,
  outfit: string
): string {
  const replacements: Record<string, string> = {
    "{{NOME_FAMILIA}}": formData.nomeFamilia || "FAMILIA",
    "{{PAIS}}": formData.pais || "Brasil",
    "{{TIME}}": formData.time || "nao informado",
    "{{QUANTIDADE_MEMBROS}}": String(memberCount),
    "{{BACKGROUND}}": background,
    "{{OUTFIT}}": outfit,
  };

  return Object.entries(replacements).reduce(
    (result, [placeholder, replacement]) => result.replaceAll(placeholder, replacement),
    prompt
  );
}

export function buildFootballFamilyPrompt(
  formData: Record<string, string>,
  memberCount: number,
  background: string,
  outfit: string
): string {
  return replacePlaceholders(FOOTBALL_FAMILY_PROMPT, formData, memberCount, background, outfit);
}
