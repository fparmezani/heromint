import { NextRequest, NextResponse } from "next/server";
import { isPackageAvailable, PACKAGE_CONFIG } from "@/types/collectible";
import type { PackageType } from "@/types/collectible";

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, string>;

    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries()) as Record<string, string>;
    }

    const { collectibleId, packageType } = body;

    if (!collectibleId || !packageType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!isPackageAvailable(packageType)) {
      return NextResponse.json({ error: "Package not available yet" }, { status: 400 });
    }

    const pkg = PACKAGE_CONFIG[packageType as PackageType];
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package type" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // In production, create Stripe session:
    // const session = await stripe.checkout.sessions.create({
    //   mode: "payment",
    //   payment_method_types: ["card"],
    //   line_items: [{ price_data: { currency: "brl", product_data: { name: `HeroMint — ${pkg.label}` }, unit_amount: pkg.price }, quantity: 1 }],
    //   metadata: { collectibleId, theme, packageType },
    //   success_url: `${appUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${appUrl}/preview/${collectibleId}`,
    // });
    // return NextResponse.redirect(session.url!);

    // Demo: redirect to success page
    return NextResponse.redirect(`${appUrl}/sucesso?session_id=demo_session_${collectibleId}`);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
