import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { uploadImage } from "./cloudinary";

const GENERATED_IMAGES_DIR = path.join(process.cwd(), ".generated-images");

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
    process.env.CLOUDINARY_API_KEY?.trim() &&
    process.env.CLOUDINARY_API_SECRET?.trim()
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

export async function persistGeneratedImage(
  sourceUrl: string,
  collectibleId: string,
  index: number
): Promise<string> {
  if (hasCloudinaryConfig()) {
    try {
      const persistedImage = await uploadImage(
        sourceUrl,
        `heromint/generated/${collectibleId}`
      );
      return persistedImage.url;
    } catch (error) {
      console.error("Cloudinary upload failed, using local storage:", error);
    }
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Unable to persist generated image: HTTP ${response.status}`);
  }

  const extension = getExtension(response.headers.get("content-type"), sourceUrl);
  const filename = `${sanitizeFilename(collectibleId)}_v${index + 1}.${extension}`;

  await mkdir(GENERATED_IMAGES_DIR, { recursive: true });
  await writeFile(
    path.join(GENERATED_IMAGES_DIR, filename),
    Buffer.from(await response.arrayBuffer())
  );

  return `/api/generated-images/${filename}`;
}

export function getGeneratedImagesDirectory() {
  return GENERATED_IMAGES_DIR;
}
