import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { updateOrderPaymentStatus } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/minha-conta?payment=missing", url.origin));
  }

  try {
    const checkoutSession = await getStripe().checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status !== "paid" || !checkoutSession.client_reference_id) {
      return NextResponse.redirect(new URL("/minha-conta?payment=pending", url.origin));
    }

    const paymentId =
      typeof checkoutSession.payment_intent === "string"
        ? checkoutSession.payment_intent
        : checkoutSession.id;

    await updateOrderPaymentStatus(checkoutSession.client_reference_id, "paid", paymentId);

    return NextResponse.redirect(new URL("/minha-conta?payment=confirmed", url.origin));
  } catch (error) {
    console.error("[STRIPE CONFIRM] Error:", error);
    return NextResponse.redirect(new URL("/minha-conta?payment=error", url.origin));
  }
}
