import { NextRequest, NextResponse } from "next/server";
import { getGenerationClientIp } from "@/lib/generation-rate-limit";
import { hasPurchaseForIp } from "@/lib/purchase-ip-tracker";

export async function GET(request: NextRequest) {
  const clientIp = getGenerationClientIp(request);

  return NextResponse.json({
    eligible: !hasPurchaseForIp(clientIp),
    coupon: "AMIGO40",
    discountPercent: 40,
  });
}
