import { createClient } from "@supabase/supabase-js";
import { serverSupabaseOptions } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

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

  // Serve from Supabase Storage
  const supabase = createClient(supabaseUrl, supabaseKey, serverSupabaseOptions);
  const { data: blob, error } = await supabase
    .storage
    .from("generated-images")
    .download(filename);

  if (error || !blob) {
    return Response.json({ error: "Image not found" }, { status: 404 });
  }

  const arrayBuffer = await blob.arrayBuffer();
  return new Response(arrayBuffer, {
    headers: {
      "Content-Type": getContentType(filename),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
