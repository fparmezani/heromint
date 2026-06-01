import sharp from "sharp";

const MAX_REFERENCE_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_REFERENCE_IMAGE_DIMENSION = 2048;

function decodeDataUri(dataUri: string) {
  const match = dataUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/);

  if (!match) {
    throw new Error("Invalid image data");
  }

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length === 0 || buffer.length > MAX_REFERENCE_IMAGE_BYTES) {
    throw new Error("Image size is not supported");
  }

  return buffer;
}

export async function normalizeReferenceImage(dataUri: string) {
  const source = decodeDataUri(dataUri);

  try {
    const normalized = await sharp(source)
      .rotate()
      .resize({
        width: MAX_REFERENCE_IMAGE_DIMENSION,
        height: MAX_REFERENCE_IMAGE_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer();

    return `data:image/jpeg;base64,${normalized.toString("base64")}`;
  } catch {
    throw new Error("Image format is not supported");
  }
}

export async function normalizeReferenceImages(images: string | string[]) {
  if (Array.isArray(images)) {
    return Promise.all(images.map(normalizeReferenceImage));
  }

  return normalizeReferenceImage(images);
}
