import { CLUB_CREST_DATA_URIS } from "@/lib/club-crest-data";

export const FOOTBALL_2026_PROMPT = `Create a premium football player portrait.

REFERENCE IMAGE:
- The uploaded reference image is the real person. Preserve the EXACT face, apparent age, hairstyle, skin tone and gender presentation perfectly. Do NOT change identity, do NOT age up or down, do NOT change gender.

PLAYER PORTRAIT REQUIREMENTS:
- The person wears a clean bright yellow Brazil national team jersey with green collar and green sleeve details, number 10 on the chest in green.
- The jersey chest is completely PLAIN — NO crest, NO logo, NO shield, NO badge, NO emblem, NO team mark of any kind on the jersey fabric.
- Only the green number 10 is allowed on the chest.
- Deep navy background with subtle green and yellow sports accents.
- Night football stadium atmosphere with softly blurred crowd silhouettes in stands, green field visible in background.
- Ambient stadium lighting from BEHIND the person — backlit rim light effect only, NO direct spotlight hitting the face.
- Subtle warm ambient glow, soft bokeh lights in background, NOT washing out skin tones.
- The person's skin tone remains natural and accurate — do NOT overexpose or lighten the face.
- 4K ultra premium quality, cinematic sports photography with controlled lighting.
- Photorealistic, high contrast, glossy finish.
- Chest-up portrait facing camera directly, natural expression.
- Fill entire frame edge-to-edge with the person and background.
- ABSOLUTELY NO outer border, NO frame, NO margin, NO ornamental elements.

CRITICAL - NO TEXT OF ANY KIND:
- NO text anywhere on the image — no names, no numbers other than the 10, no labels, no branding text.
- NO "HEROMINT", NO "PREVIEW", NO "SAMPLE", NO "DEMO", NO watermark words.
- NO "PURCHASE REQUIRED", NO "DOWNLOAD", NO commercial text.
- NO semi-transparent overlays, NO diagonal text, NO stamped markings.
- If ANY text appears on the image, REMOVE IT COMPLETELY.

AVOID:
- Club crest on the jersey, club crest on chest, club crest on sleeves.
- FIFA, Panini, Nike, Adidas, Puma or any brand logos.
- Visible hands, visible forearms, thumbs-up gesture.
- Distorted face, blurry features, low quality.`;

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

// Prompt for flux-kontext-pro: no crest reference since crest is added programmatically
const FOOTBALL_2026_PROMPT_KONTEXT = `Create a single premium HeroMint Futebol 2026 sports card.

REFERENCE IMAGE:
- The uploaded reference image is the real player. Preserve the EXACT face, apparent age, hairstyle, skin tone and gender presentation. Do NOT change the person's identity, age, or appearance in any way.

NON-NEGOTIABLE VISUAL RULES:
- The player MUST wear a clean bright yellow Brazil-inspired jersey with green collar and green sleeve details, number 10 on the chest, no brand logo and ABSOLUTELY NO club crest on the jersey.
- The jersey MUST be completely PLAIN on the chest area — no crest, no logo, no shield, no badge, no emblem, no team mark of any kind on the jersey fabric.
- Fill the entire rectangular canvas edge-to-edge.
- ABSOLUTELY NO outer border, gold frame, metallic frame, rounded card outline, beveled edge, ornamental corner or margin.
- Use the player reference for FACIAL IDENTITY ONLY. Do NOT copy body pose, arm position or hand gestures.
- REMOVE thumbs-up gestures completely. Keep both hands and forearms outside the visible frame.
- Frame the player from chest up in a sober official player portrait.
- CRITICAL: Preserve the person's EXACT AGE. If the person is a child, keep them as a child. If adult, keep as adult. Do NOT age up or age down.
- CRITICAL: Preserve the person's EXACT GENDER appearance. Do NOT change gender presentation.

LAYOUT:
- Vertical 2:3 sports card artwork, 1024x1536.
- Deep navy background with subtle green and yellow sports accents.
- Top-left: clearly legible text "2026".
- Top-right: generic white football trophy silhouette with clearly legible text "COPA 2026".
- Right side: small circular {{PAIS}}-inspired flag and vertical text "{{PAIS_CODIGO}}".
- Lower panel: dark navy flat information area without enclosing border or gold outline.
- Player name: "{{NOME}}".
- Stats: "{{DATA_NASCIMENTO}} | {{ALTURA}} | {{PESO}}".
- Team: "{{TIME}}".

CRITICAL — JERSEY CREST RULE (HIGHEST PRIORITY):
- The player's yellow jersey must have ZERO crests, ZERO logos, ZERO shields, ZERO badges, ZERO emblems on the chest, sleeves, or any part of the jersey.
- Only the Brazil-style number 10 is allowed on the chest.
- If any club crest appears on the jersey, REMOVE IT COMPLETELY.

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

export function buildFootball2026PromptForKontext(formData: Record<string, string>): string {
  return replacePlaceholders(FOOTBALL_2026_PROMPT_KONTEXT, formData);
}

export function getClubCrestDataUri(team?: string): string | null {
  if (!team) return null;
  return CLUB_CREST_DATA_URIS[team.normalize("NFC")] || null;
}

export function hasClubCrest(team?: string): team is string {
  return Boolean(getClubCrestDataUri(team));
}
