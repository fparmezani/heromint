import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

/**
 * Upscale an image URL using Real-ESRGAN on Replicate (~$0.002/image).
 * Returns the upscaled image URL.
 */
export async function upscaleImage(imageUrl: string, scale = 2): Promise<string> {
  const output = await replicate.run("nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee2d96b07b32c71da6e0", {
    input: {
      image: imageUrl,
      scale,
      face_enhance: false,
    },
  });

  const result = Array.isArray(output) ? String(output[0]) : String(output);
  if (!result || result === "undefined") {
    throw new Error("Upscale retornou resultado vazio");
  }
  return result;
}
