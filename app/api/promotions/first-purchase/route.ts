import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    eligible: true,
    name: "Valor de lancamento",
    discountApplied: true,
  });
}
