import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { runRecoveryEmailTask } from "@/lib/recovery-emails";

export async function POST() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Acesso restrito ao administrador" },
      { status: 403 }
    );
  }

  try {
    const result = await runRecoveryEmailTask();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[RECOVERY API] Failed to run recovery emails:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
