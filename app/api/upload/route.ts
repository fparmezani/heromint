import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
    }

    // In production, upload to Cloudinary:
    // const bytes = await file.arrayBuffer();
    // const buffer = Buffer.from(bytes);
    // const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
    // const result = await uploadImage(base64);
    // return NextResponse.json({ url: result.url, publicId: result.publicId });

    // Demo: return a placeholder URL
    return NextResponse.json({
      url: `https://placehold.co/800x1000/0F172A/7C3AED?text=Uploaded+Photo`,
      publicId: `demo_${Date.now()}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
