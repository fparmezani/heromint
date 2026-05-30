import promptSpec from "@/docs/theme-prompts/futebol-familia.json";

function replacePlaceholders(value: string, formData: Record<string, string>, memberCount: number): string {
  const replacements: Record<string, string> = {
    "{{NOME_FAMILIA}}": formData.nomeFamilia || "FAMILIA",
    "{{PAIS}}": formData.pais || "Brasil",
    "{{TIME}}": formData.time || "nao informado",
    "{{QUANTIDADE_MEMBROS}}": String(memberCount),
  };

  return Object.entries(replacements).reduce(
    (result, [placeholder, replacement]) => result.replaceAll(placeholder, replacement),
    value
  );
}

export function buildFootballFamilyPrompt(
  formData: Record<string, string>,
  memberCount: number,
  background: string,
  outfit: string
): string {
  const resolvedSpec = replacePlaceholders(JSON.stringify(promptSpec, null, 2), formData, memberCount);

  return `Use this HeroMint Futebol Familia JSON specification as the authoritative image-generation brief.
Each uploaded reference image contains one different real family member. Use exactly one person from each reference.

CRITICAL IDENTITY PRESERVATION:
- Preserve all ${memberCount} faces exactly as provided.
- Preserve each person's apparent age, gender presentation, skin tone, hair, glasses, facial hair and distinctive features.
- Do not mix facial features between people.
- Do not create extra people or omit any family member.
- Use references for identity only. Do not copy original poses, gestures, clothing, props or backgrounds.
- Place the family close together with arms naturally around shoulders or backs.
- Hands must be relaxed or around relatives. Never use thumbs-up gestures or crossed arms.

SCENE OVERRIDES:
- Background: ${background}
- Clothing: ${outfit}
- Use fictional football branding only. Do not use a real club crest in the family card.

FORM DATA:
- NOME DA FAMILIA: ${formData.nomeFamilia || "FAMILIA"}
- QUANTIDADE DE MEMBROS: ${memberCount}
- PAIS: ${formData.pais || "Brasil"}
- TIME DO CORACAO: ${formData.time || "nao informado"}

RESOLVED JSON SPECIFICATION:
${resolvedSpec}`;
}
