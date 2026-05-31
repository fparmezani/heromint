import { CLUB_CREST_DATA_URIS } from "@/lib/club-crest-data";

export const FOOTBALL_2026_PROMPT = `Create a single premium HeroMint Futebol 2026 sports card.

REFERENCE IMAGES:
- The first reference image is the real player. Preserve the exact face, apparent age, hairstyle, skin tone and gender presentation.
- The second reference image is the selected {{TIME}} club crest. Reproduce it accurately only in the bottom-left information area.

NON-NEGOTIABLE VISUAL RULES:
- The player MUST wear a clean bright yellow Brazil-inspired jersey with green collar and green sleeve details, number 10 on the chest, no brand logo and absolutely no club crest on the jersey.
- Do NOT use the selected club uniform, stripes, colors or jersey design.
- The supplied {{TIME}} crest MUST appear only in the lower information panel. Never place it on the player's chest, shirt, sleeves or uniform.
- Fill the entire rectangular canvas edge-to-edge.
- ABSOLUTELY NO outer border, gold frame, metallic frame, rounded card outline, beveled edge, ornamental corner or margin.
- Use the player reference for FACIAL IDENTITY ONLY. Do NOT copy body pose, arm position or hand gestures.
- REMOVE thumbs-up gestures completely. Keep both hands and forearms outside the visible frame.
- Frame the player from chest up in a sober official player portrait.

LAYOUT:
- Vertical 2:3 sports card artwork, 1024x1536.
- Deep navy background with subtle green and yellow sports accents.
- Top-left: clearly legible text "2026".
- Top-right: generic white football trophy silhouette with clearly legible text "COPA 2026".
- Right side: small circular {{PAIS}}-inspired flag and vertical text "{{PAIS_CODIGO}}".
- Lower panel: dark navy flat information area without enclosing border or gold outline.
- Player name: "{{NOME}}".
- Stats: "{{DATA_NASCIMENTO}} | {{ALTURA}} | {{PESO}}".
- Team: "{{TIME}}" beside the supplied crest.

CRITICAL - NO WATERMARK OR OVERLAY TEXT:
- ABSOLUTELY NO watermark text, NO "PREVIEW" text, NO "HEROMINT" text, NO "SAMPLE" text, NO "DEMO" text.
- NO "PURCHASE REQUIRED" text, NO "DOWNLOAD" text, NO "FOR SALE" text, NO commercial overlay text of any kind.
- NO semi-transparent text overlay, NO diagonal repeated text, NO stamped text, NO sample markings.
- The image must be a clean final card artwork with only the layout elements described above.
- If any watermark-like text appears, remove it completely.

AVOID:
- Club crest on the jersey, club crest on the player's chest, club crest on sleeves, invented or altered club crest, additional club logos, club uniform, unrelated copyrighted logos.
- FIFA, Panini, Nike, Adidas or Puma logos.
- Outer border, gold frame, metallic frame, rounded outer frame, ornamental corners.
- Visible hands, visible forearms, thumbs-up gesture, copied pose, distorted face, unreadable typography, watermark.`;

function formatHeight(height?: string): string {
  return height ? `${height} cm` : "altura nao informada";
}

function formatWeight(weight?: string): string {
  return weight ? `${weight} kg` : "peso nao informado";
}

function getCountryCode(country?: string): string {
  return country?.trim().toLowerCase() === "brasil" ? "BRA" : (country || "BRA").slice(0, 3).toUpperCase();
}

function replacePlaceholders(prompt: string, formData: Record<string, string>): string {
  const replacements: Record<string, string> = {
    "{{NOME}}": formData.nome || "JOGADOR",
    "{{GENERO}}": formData.genero || "nao informado",
    "{{PAIS}}": formData.pais || "Brasil",
    "{{PAIS_CODIGO}}": getCountryCode(formData.pais),
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

export function buildFootball2026Prompt(formData: Record<string, string>): string {
  return replacePlaceholders(FOOTBALL_2026_PROMPT, formData);
}

export function getClubCrestDataUri(team?: string): string | null {
  if (!team) return null;
  return CLUB_CREST_DATA_URIS[team.normalize("NFC")] || null;
}

export function hasClubCrest(team?: string): team is string {
  return Boolean(getClubCrestDataUri(team));
}
