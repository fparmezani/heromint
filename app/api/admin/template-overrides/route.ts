import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllTemplateOverrides, saveTemplateOverride } from "@/lib/supabase";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "fparmezani@gmail.com";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const overrides = await getAllTemplateOverrides();
    return NextResponse.json({ overrides });
  } catch (error) {
    console.error("[TEMPLATE-OVERRIDES] GET error:", error);
    return NextResponse.json({ error: "Failed to load overrides" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { themeId, config } = await request.json();
    if (!themeId || typeof config !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await saveTemplateOverride(themeId, config);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TEMPLATE-OVERRIDES] POST error:", error);
    return NextResponse.json({ error: "Failed to save overrides" }, { status: 500 });
  }
}
