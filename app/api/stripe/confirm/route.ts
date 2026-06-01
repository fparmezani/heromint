import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { updateOrderPaymentStatus } from "@/lib/supabase";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const appUrl = getPublicAppUrl(request);

  if (!sessionId) {
    return redirectToAccount(appUrl, "missing");
  }

  try {
    const checkoutSession = await getStripe().checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status !== "paid" || !checkoutSession.client_reference_id) {
      return redirectToAccount(appUrl, "pending");
    }

    const paymentId =
      typeof checkoutSession.payment_intent === "string"
        ? checkoutSession.payment_intent
        : checkoutSession.id;

    await updateOrderPaymentStatus(checkoutSession.client_reference_id, "paid", paymentId);

    return redirectToAccount(appUrl, "confirmed");
  } catch (error) {
    console.error("[STRIPE CONFIRM] Error:", error);
    return redirectToAccount(appUrl, "error");
  }
}

function getPublicAppUrl(request: Request): string {
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configuredAppUrl) {
    return configuredAppUrl.replace(/\/$/, "");
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto") || "https";

  if (forwardedHost) {
    return `${forwardedProtocol}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

function redirectToAccount(appUrl: string, paymentStatus: string) {
  return NextResponse.redirect(new URL(`/minha-conta?payment=${paymentStatus}`, appUrl));
}
