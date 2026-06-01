import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getStripe } from "@/lib/stripe";
import { confirmOrderFromStripeSession } from "@/lib/stripe-payment";

export async function POST() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  try {
    const checkoutSessions = await getStripe().checkout.sessions.list({
      limit: 100,
      status: "complete",
      customer_details: { email },
    });

    let confirmedOrders = 0;
    for (const checkoutSession of checkoutSessions.data) {
      const orderId = await confirmOrderFromStripeSession(checkoutSession);
      if (orderId) confirmedOrders += 1;
    }

    return NextResponse.json({ success: true, confirmedOrders });
  } catch (error) {
    console.error("[STRIPE RECONCILE] Error:", error);
    return NextResponse.json({ error: "Erro ao verificar pagamentos" }, { status: 500 });
  }
}
