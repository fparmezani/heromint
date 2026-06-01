import Stripe from "stripe";
import { NextResponse } from "next/server";
import { updateOrderPaymentStatus } from "@/lib/supabase";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";

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

      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true, processed: false });
      }

      if (!session.client_reference_id) {
        console.warn("[STRIPE WEBHOOK] Checkout Session without client_reference_id:", session.id);
        return NextResponse.json({ received: true, processed: false });
      }

      const paymentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.id;

      await updateOrderPaymentStatus(session.client_reference_id, "paid", paymentId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[STRIPE WEBHOOK] Error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
