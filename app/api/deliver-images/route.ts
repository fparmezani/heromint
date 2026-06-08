import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Usuario nao autenticado" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { error: "Entrega via Google Drive desativada." },
    { status: 410 }
  );
}
