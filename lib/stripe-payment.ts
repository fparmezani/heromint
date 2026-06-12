import type Stripe from "stripe";
import {
  findPendingOrderForStripePayment,
  updateOrderPaymentStatus,
} from "@/lib/supabase";

export function getStripeSessionPaymentId(session: Stripe.Checkout.Session) {
  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.id;
}

export async function confirmOrderFromStripeSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return null;
  }

  const paymentId = getStripeSessionPaymentId(session);
  let orderId = session.client_reference_id;

  if (!orderId) {
    const customerEmail = session.customer_details?.email || session.customer_email;
    if (!customerEmail || typeof session.amount_total !== "number") {
      return null;
    }

    const pendingOrder = await findPendingOrderForStripePayment(
      customerEmail,
      session.amount_total,
      paymentId,
      new Date(session.created * 1000)
    );
    orderId = pendingOrder?.id || null;
  }

  if (!orderId) {
    return null;
  }

  await updateOrderPaymentStatus(orderId, "paid", paymentId);
  const customerEmail = session.customer_details?.email || session.customer_email || null;
  return { orderId, customerEmail };
}
