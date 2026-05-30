import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import promptSpec from "@/docs/theme-prompts/futebol-2026.json";
import { BRAZILIAN_CLUBS } from "@/lib/themes";

const CLUB_CREST_DIRECTORY = path.join(process.cwd(), "lib", "escudos");

function formatHeight(height?: string): string {
  return height ? `${height} cm` : "altura nao informada";
}

function formatWeight(weight?: string): string {
  return weight ? `${weight} kg` : "peso nao informado";
}

function getCountryCode(country?: string): string {
  return country?.trim().toLowerCase() === "brasil" ? "BRA" : (country || "BRA").slice(0, 3).toUpperCase();
}

function replacePlaceholders(value: string, formData: Record<string, string>): string {
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
    value
  );
}

export function buildFootball2026Prompt(formData: Record<string, string>): string {
  const resolvedSpec = replacePlaceholders(JSON.stringify(promptSpec, null, 2), formData);

  return `Use this HeroMint Futebol 2026 JSON specification as the authoritative image-generation brief.
The first reference image is the real person. The second reference image is the selected club crest.
Preserve the person's identity exactly and reproduce the supplied club crest accurately.

NON-NEGOTIABLE VISUAL RULES:
- The player MUST wear a bright yellow Brazil-inspired jersey with green collar and green sleeve details.
- Do NOT use the selected club's uniform, stripes, colors or jersey design.
- Use the supplied club crest only as a small chest badge and in the bottom-left information area.
- The image MUST fill the entire rectangular canvas edge-to-edge.
- ABSOLUTELY NO outer border, NO gold frame, NO metallic frame, NO rounded card outline, NO beveled edges, NO ornamental corners and NO margin.

FORM DATA:
- NOME: ${formData.nome || "JOGADOR"}
- GENERO: ${formData.genero || "nao informado"}
- PAIS: ${formData.pais || "Brasil"}
- TIME: ${formData.time || "Clube"}
- DATA DE NASCIMENTO: ${formData.dataNascimento || "nao informada"}
- ALTURA: ${formatHeight(formData.altura)}
- PESO: ${formatWeight(formData.peso)}
- POSICAO: ${formData.posicao || "nao informada"}

RESOLVED JSON SPECIFICATION:
${resolvedSpec}`;
}

export function getClubCrestDataUri(team?: string): string | null {
  const crestPath = getClubCrestPath(team);
  if (!crestPath) {
    return null;
  }

  const crest = readFileSync(crestPath);
  return `data:image/png;base64,${crest.toString("base64")}`;
}

export function hasClubCrest(team?: string): team is string {
  return Boolean(getClubCrestPath(team));
}

function getClubCrestPath(team?: string): string | null {
  if (!team || !BRAZILIAN_CLUBS.includes(team)) {
    return null;
  }

  const expectedFilename = `${team}.png`.normalize("NFC");
  const crestFilename = readdirSync(CLUB_CREST_DIRECTORY).find(
    (filename) => filename.normalize("NFC") === expectedFilename
  );

  return crestFilename ? path.join(CLUB_CREST_DIRECTORY, crestFilename) : null;
}
