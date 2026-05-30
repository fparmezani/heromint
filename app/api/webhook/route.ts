import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    // In production, verify Stripe webhook:
    // const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    //
    // if (event.type === "checkout.session.completed") {
    //   const session = event.data.object as Stripe.Checkout.Session;
    //   const { collectibleId } = session.metadata!;
    //
    //   await prisma.$transaction([
    //     prisma.order.updateMany({
    //       where: { stripeSessionId: session.id },
    //       data: { status: "paid", paidAt: new Date() },
    //     }),
    //     prisma.collectible.update({
    //       where: { id: collectibleId },
    //       data: { isPaid: true, status: "paid" },
    //     }),
    //   ]);
    // }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}

// Raw body parsing is handled by Next.js App Router automatically for POST routes
