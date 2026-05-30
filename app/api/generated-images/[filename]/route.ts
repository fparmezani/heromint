import { readFile } from "node:fs/promises";
import path from "node:path";
import { getGeneratedImagesDirectory } from "@/lib/generated-image-storage";

function getContentType(filename: string) {
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".webp")) return "image/webp";
  if (filename.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/generated-images/[filename]">
) {
  const { filename } = await params;
  const safeFilename = path.basename(filename);

  if (safeFilename !== filename) {
    return Response.json({ error: "Invalid filename" }, { status: 400 });
  }

  try {
    const data = await readFile(path.join(getGeneratedImagesDirectory(), safeFilename));
    const responseData = Uint8Array.from(data).buffer;
    return new Response(responseData, {
      headers: {
        "Content-Type": getContentType(safeFilename),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return Response.json({ error: "Image not found" }, { status: 404 });
  }
}
