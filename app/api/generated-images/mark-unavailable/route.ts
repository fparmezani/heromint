import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { markGeneratedImageUnavailable } from "@/lib/supabase";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const { imageId } = await request.json();

    if (!imageId || typeof imageId !== "string") {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }

    const image = await markGeneratedImageUnavailable(imageId);
    return NextResponse.json({ image });
  } catch (error) {
    console.error("Failed to mark generated image as unavailable:", error);
    return NextResponse.json({ error: "Erro ao atualizar imagem." }, { status: 500 });
  }
}
