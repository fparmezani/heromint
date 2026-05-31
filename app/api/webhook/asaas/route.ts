import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ── ASAAS WEBHOOK ──────────────────────────────────────────────────────────
// Receives payment notifications from Asaas and updates order status
// Asaas sends events like: PAYMENT_CONFIRMED, PAYMENT_RECEIVED, etc.
// ─────────────────────────────────────────────────────────────────────────────

interface AsaasWebhookPayload {
  event: string;
  payment?: {
    id: string;
    externalReference?: string;
    status: string;
    value: number;
    description?: string;
    billingType?: string;
    invoiceUrl?: string;
    bankSlipUrl?: string;
    transactionReceiptUrl?: string;
    dateCreated?: string;
    paymentDate?: string;
    customer?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validate webhook token (if configured) - DISABLED FOR TESTING
    // const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;
    // if (webhookToken) {
    //   const authHeader = request.headers.get("asaas-access-token") || 
    //                      request.headers.get("authorization");
    //   const providedToken = authHeader?.replace("Bearer ", "").trim();
    //   
    //   if (providedToken !== webhookToken) {
    //     console.warn("❌ [ASAAS WEBHOOK] Invalid token received");
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //   }
    // }

    // 2. Parse webhook payload
    const payload: AsaasWebhookPayload = await request.json();
    
    console.log("🔔 [ASAAS WEBHOOK] Event received:", {
      event: payload.event,
      paymentId: payload.payment?.id,
      status: payload.payment?.status,
      externalReference: payload.payment?.externalReference,
    });

    // 2. Validate payload
    if (!payload.event || !payload.payment) {
      console.error("❌ [ASAAS WEBHOOK] Invalid payload:", payload);
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { event, payment } = payload;
    
    // 3. Only process confirmed/received payments
    const successEvents = ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED", "PAYMENT_RECEIVED_IN_CASH"];
    
    if (!successEvents.includes(event)) {
      console.log(`ℹ️ [ASAAS WEBHOOK] Ignoring event: ${event}`);
      return NextResponse.json({ received: true, processed: false, reason: "Event not processed" });
    }

    // 4. Find order by external reference (order_id passed in payment link)
    let orderId: string | undefined;
    
    // Try externalReference first (set when creating payment via API)
    if (payment.externalReference) {
      orderId = payment.externalReference;
    }
    
    // Fallback: try to extract order_id from description
    if (!orderId && payment.description) {
      const match = payment.description.match(/order[_-]?id[=:]?\s*([a-f0-9-]{36})/i);
      if (match) {
        orderId = match[1];
      }
    }

    if (!orderId) {
      console.warn("⚠️ [ASAAS WEBHOOK] Could not determine order_id from webhook. Payment ID:", payment.id);
      // Still return 200 so Asaas doesn't retry
      return NextResponse.json({ 
        received: true, 
        processed: false, 
        reason: "Order ID not found in payload" 
      });
    }

    // 5. Update order status in Supabase
    console.log(`📝 [ASAAS WEBHOOK] Updating order ${orderId} to 'paid'`);
    
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        payment_id: payment.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select();

    if (error) {
      console.error("❌ [ASAAS WEBHOOK] Supabase error:", error);
      return NextResponse.json({ 
        error: "Database error", 
        details: error.message,
        code: error.code,
        orderId: orderId 
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ [ASAAS WEBHOOK] Order ${orderId} not found in database`);
      return NextResponse.json({ 
        received: true, 
        processed: false, 
        reason: "Order not found",
        orderId: orderId
      });
    }

    console.log(`✅ [ASAAS WEBHOOK] Order ${orderId} updated successfully`);
    
    return NextResponse.json({ 
      received: true, 
      processed: true,
      orderId: orderId,
      paymentId: payment.id,
    });

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    console.error("❌ [ASAAS WEBHOOK] Unhandled error:", err.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET is not supported for webhooks
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
