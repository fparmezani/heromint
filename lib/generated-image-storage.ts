import sharp from "sharp";
import { uploadImage } from "./cloudinary";
import { uploadImageToStorage } from "./supabase";

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
    process.env.CLOUDINARY_API_KEY?.trim() &&
    process.env.CLOUDINARY_API_SECRET?.trim()
  );
}

function hasSupabaseStorageConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim())
  );
}

function sanitizeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "_");
}

function getExtension(contentType: string | null, sourceUrl: string) {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("gif")) return "gif";

  const extension = sourceUrl.match(/\.(png|webp|gif|jpe?g)(?:$|\?)/i)?.[1]?.toLowerCase();
  return extension === "jpeg" ? "jpg" : extension || "jpg";
}

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

function createWatermarkSvg(width: number, height: number, traceId: string) {
  const watermark = "HEROMINT PREVIEW";
  const safeTraceId = escapeSvgText(traceId);
  const tileWidth = Math.max(250, Math.round(width / 2.4));
  const tileHeight = Math.max(180, Math.round(height / 5));
  const fontSize = Math.max(28, Math.round(width / 20));
  const columns = Math.ceil(width / tileWidth) + 2;
  const rows = Math.ceil(height / tileHeight) + 2;
  const labels: string[] = [];
  const diagonals: string[] = [];

  for (let row = -1; row < rows; row++) {
    for (let column = -1; column < columns; column++) {
      labels.push(
        `<text x="${column * tileWidth}" y="${row * tileHeight}" ` +
        `fill="white" fill-opacity="0.36" font-family="Arial, sans-serif" ` +
        `font-size="${fontSize}" font-weight="700" letter-spacing="3" ` +
        `transform="rotate(-25 ${column * tileWidth} ${row * tileHeight})">${watermark}</text>`
      );
    }
  }

  for (let offset = -height; offset < width + height; offset += Math.max(120, Math.round(width / 3))) {
    diagonals.push(
      `<line x1="${offset}" y1="0" x2="${offset + height}" y2="${height}" ` +
      `stroke="#FBBF24" stroke-opacity="0.62" stroke-width="4" stroke-dasharray="10 7"/>`,
      `<line x1="${offset + height}" y1="0" x2="${offset}" y2="${height}" ` +
      `stroke="#FBBF24" stroke-opacity="0.62" stroke-width="4" stroke-dasharray="10 7"/>`
    );
  }

  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
    `${diagonals.join("")}${labels.join("")}` +
    `<text x="50%" y="50%" text-anchor="middle" fill="#FBBF24" fill-opacity="0.9" ` +
    `stroke="#111827" stroke-width="2" font-family="Arial, sans-serif" ` +
    `font-size="${Math.max(44, Math.round(width / 8))}" font-weight="800">HEROMINT</text>` +
    `<text x="50%" y="56%" text-anchor="middle" fill="#FBBF24" fill-opacity="0.9" ` +
    `stroke="#111827" stroke-width="1" font-family="Arial, sans-serif" ` +
    `font-size="${Math.max(28, Math.round(width / 14))}" font-weight="800">PREVIEW</text>` +
    `<rect x="0" y="${height - 78}" width="${width}" height="78" fill="#0F172A" fill-opacity="0.86"/>` +
    `<text x="50%" y="${height - 45}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" ` +
    `font-size="${Math.max(17, Math.round(width / 28))}" font-weight="700">PREVIEW ONLY - PURCHASE REQUIRED FOR DOWNLOAD</text>` +
    `<text x="50%" y="${height - 18}" text-anchor="middle" fill="#FBBF24" font-family="Arial, sans-serif" ` +
    `font-size="${Math.max(15, Math.round(width / 32))}" font-weight="700">${safeTraceId}</text>` +
    `</svg>`
  );
}

export async function generateProtectedPreview(imageBuffer: Buffer, traceId: string) {
  const resizedPreview = await sharp(imageBuffer)
    .resize({ width: 768, height: 1152, fit: "inside", withoutEnlargement: true })
    .blur(1.1)
    .toBuffer();
  const metadata = await sharp(resizedPreview).metadata();
  const width = metadata.width || 1024;
  const height = metadata.height || 1536;

  return sharp(resizedPreview)
    .composite([{ input: createWatermarkSvg(width, height, traceId), top: 0, left: 0 }])
    .jpeg({ quality: 66, mozjpeg: true })
    .toBuffer();
}

export interface PersistedGeneratedImage {
  imageUrl: string;
  previewImageUrl: string;
}

export async function persistGeneratedImage(
  sourceUrl: string,
  collectibleId: string,
  index: number,
  traceLabel = collectibleId
): Promise<PersistedGeneratedImage> {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Unable to persist generated image: HTTP ${response.status}`);
  }

  const imageBuffer = Buffer.from(await response.arrayBuffer());
  const previewBuffer = await generateProtectedPreview(
    imageBuffer,
    `${traceLabel} - ${collectibleId}`
  );

  if (hasCloudinaryConfig()) {
    try {
      const folder = `heromint/generated/${collectibleId}`;
      const persistedImage = await uploadImage(
        `data:${response.headers.get("content-type") || "image/jpeg"};base64,${imageBuffer.toString("base64")}`,
        folder
      );
      const previewImage = await uploadImage(
        `data:image/jpeg;base64,${previewBuffer.toString("base64")}`,
        `heromint/generated/${collectibleId}`
      );
      return {
        imageUrl: persistedImage.url,
        previewImageUrl: previewImage.url,
      };
    } catch (error) {
      console.error("Cloudinary upload failed, trying Supabase Storage:", error);
    }
  }

  // Fallback: Supabase Storage (works on Vercel serverless)
  if (hasSupabaseStorageConfig()) {
    try {
      const ext = getExtension(response.headers.get("content-type"), sourceUrl);
      const filename = `${sanitizeFilename(collectibleId)}_v${index + 1}.${ext}`;
      const previewFilename = `${sanitizeFilename(collectibleId)}_v${index + 1}_preview.jpg`;
      const contentType = response.headers.get("content-type") || "image/jpeg";

      const [originalResult, previewResult] = await Promise.all([
        uploadImageToStorage("generated-images", filename, imageBuffer, contentType),
        uploadImageToStorage("generated-images", previewFilename, previewBuffer, "image/jpeg"),
      ]);

      return {
        imageUrl: originalResult.publicUrl,
        previewImageUrl: previewResult.publicUrl,
      };
    } catch (error) {
      console.error("Supabase Storage upload failed:", error);
    }
  }

  throw new Error("No storage provider configured. Please set up Cloudinary or Supabase Storage.");
}

// Backwards compatibility - local filesystem is not used on Vercel serverless
// Images are now served directly from Supabase Storage or Cloudinary
export function getGeneratedImagesDirectory() {
  return "";
}
