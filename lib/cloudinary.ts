import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export async function uploadImage(
  base64Image: string,
  folder = "heromint"
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    resource_type: "image",
    quality: "auto:best",
    fetch_format: "auto",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getWatermarkedUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        overlay: {
          font_family: "Arial",
          font_size: 40,
          text: "HEROMINT PREVIEW",
          font_weight: "bold",
        },
        color: "white",
        opacity: 40,
        angle: -45,
        gravity: "center",
      },
    ],
  });
}
