import sharp from "sharp";
import { getClubCrestDataUri } from "@/lib/football-2026-prompt";

const CARD_WIDTH = 2048;
const CARD_HEIGHT = 3072;

function escapeSvgText(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character];
  });
}

function formatBirthDate(value?: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}-${month}-${year}` : value;
}

function formatStats(formData: Record<string, string>) {
  return [
    formatBirthDate(formData.dataNascimento),
    formData.altura ? `${formData.altura} cm` : "",
    formData.peso ? `${formData.peso} kg` : "",
  ].filter(Boolean).join(" | ");
}

function getCountryCode(country?: string) {
  return country?.trim().toLowerCase() === "brasil"
    ? "BRA"
    : (country || "BRA").slice(0, 3).toUpperCase();
}

function dataUriToBuffer(dataUri: string | null) {
  if (!dataUri) return null;
  const match = dataUri.match(/^data:image\/[^;]+;base64,(.+)$/);
  return match ? Buffer.from(match[1], "base64") : null;
}

function createFootball2026Overlay(formData: Record<string, string>) {
  const name = escapeSvgText((formData.nome || "JOGADOR").toUpperCase());
  const team = escapeSvgText((formData.time || "").toUpperCase());
  const stats = escapeSvgText(formatStats(formData));
  const countryCode = escapeSvgText(getCountryCode(formData.pais));

  return Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 1024 1536" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0F172A"/>
          <stop offset="100%" stop-color="#07101F"/>
        </linearGradient>
      </defs>
      <rect x="7" y="7" width="1010" height="1522" rx="45" fill="none" stroke="#D4AF37" stroke-width="14"/>
      <rect x="31" y="31" width="962" height="1474" rx="34" fill="none" stroke="#F5D76E" stroke-opacity="0.72" stroke-width="4"/>

      <path d="M53 149V74Q53 53 74 53H149 M875 53H950Q971 53 971 74V149 M53 1387V1462Q53 1483 74 1483H149 M875 1483H950Q971 1483 971 1462V1387"
        fill="none" stroke="#D4AF37" stroke-width="9" stroke-linecap="round"/>

      <rect x="74" y="71" width="159" height="86" rx="24" fill="#07101F" fill-opacity="0.82" stroke="#D4AF37" stroke-width="4"/>
      <text x="153" y="130" text-anchor="middle" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="54" font-weight="800">2026</text>

      <g transform="translate(812 63)" fill="#F8FAFC">
        <path d="M31 4h74v20c0 29-12 49-31 58v19h25v16H37v-16h25V82C43 73 31 53 31 24V4zm-22 13h22v16H22c3 19 11 32 26 40l-8 13C19 75 9 52 9 17zm96 0h22c0 35-10 58-31 69l-8-13c15-8 23-21 26-40h-9V17z"/>
        <text x="68" y="156" text-anchor="middle" font-family="Arial, sans-serif" font-size="35" font-weight="800">COPA</text>
        <text x="68" y="193" text-anchor="middle" font-family="Arial, sans-serif" font-size="35" font-weight="800">2026</text>
      </g>

      <g transform="translate(902 348)">
        <circle cx="0" cy="0" r="47" fill="#009C3B" stroke="#F8FAFC" stroke-width="4"/>
        <path d="M-34 0L0-25L34 0L0 25Z" fill="#FFDF00"/>
        <circle cx="0" cy="0" r="14" fill="#002776"/>
      </g>
      <text x="919" y="586" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="63" font-weight="800"
        transform="rotate(-90 919 586)">${countryCode}</text>

      <rect x="77" y="1202" width="870" height="278" rx="32" fill="url(#panel)" stroke="#D4AF37" stroke-width="6"/>
      <text x="512" y="1284" text-anchor="middle" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="78" font-weight="800">${name}</text>
      <path d="M137 1310H887" stroke="#D4AF37" stroke-width="3"/>
      <text x="512" y="1366" text-anchor="middle" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="36" font-weight="700">${stats}</text>
      <path d="M137 1396H887" stroke="#D4AF37" stroke-opacity="0.5" stroke-width="2"/>
      <text x="512" y="1451" text-anchor="middle" fill="#D4AF37" font-family="Arial, sans-serif" font-size="42" font-weight="800" letter-spacing="3">${team}</text>
      <path d="M870 1412l14 29 32 5-23 22 6 32-29-15-29 15 6-32-23-22 32-5z" fill="#D4AF37"/>
    </svg>
  `);
}

export async function renderFinalCard(
  imageBuffer: Buffer,
  templateUsed: string | undefined,
  formData: Record<string, string> = {}
) {
  if (templateUsed !== "futebol-2026") return imageBuffer;

  const composites: sharp.OverlayOptions[] = [
    { input: createFootball2026Overlay(formData), top: 0, left: 0 },
  ];
  const crestBuffer = dataUriToBuffer(getClubCrestDataUri(formData.time));

  if (crestBuffer) {
    composites.push({
      input: await sharp(crestBuffer).resize(184, 184, { fit: "contain" }).png().toBuffer(),
      top: 2764,
      left: 230,
    });
  }

  return sharp(imageBuffer)
    .resize(CARD_WIDTH, CARD_HEIGHT, { fit: "cover", position: "centre" })
    .composite(composites)
    .png({ compressionLevel: 6, adaptiveFiltering: true })
    .toBuffer();
}
