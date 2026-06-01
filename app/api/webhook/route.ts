import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { confirmOrderFromStripeSession } from "@/lib/stripe-payment";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    const event = getStripe().webhooks.constructEvent(
      body,
      signature,
      getStripeWebhookSecret()
    );

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = await confirmOrderFromStripeSession(session);
      return NextResponse.json({ received: true, processed: Boolean(orderId) });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[STRIPE WEBHOOK] Error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
