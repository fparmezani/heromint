import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { confirmOrderFromStripeSession } from "@/lib/stripe-payment";
import { getOrderImages, updateGeneratedImageUrl, uploadImageToStorage } from "@/lib/supabase";
import { upscaleImage } from "@/lib/image-upscale";
import { resetGenerationRateLimit } from "@/lib/generation-rate-limit";

const UPSCALABLE_THEMES = new Set(["futebol-2026", "futebol-panini"]);

async function upscaleOrderImages(orderId: string) {
  try {
    const images = await getOrderImages(orderId);
    await Promise.all(
      (images ?? [])
        .filter((img) => UPSCALABLE_THEMES.has(img.template_used))
        .map(async (img) => {
          try {
            const upscaledUrl = await upscaleImage(img.image_url, 2);
            const res = await fetch(upscaledUrl);
            if (!res.ok) throw new Error(`Failed to fetch upscaled image: ${res.status}`);
            const buffer = Buffer.from(await res.arrayBuffer());
            const stored = await uploadImageToStorage(
              "generated-images",
              img.file_name.replace(/\.(jpg|jpeg|png|webp)$/i, "_2k.jpg"),
              buffer,
              "image/jpeg"
            );
            await updateGeneratedImageUrl(img.id, stored.publicUrl);
            console.log(`[WEBHOOK] Upscaled image ${img.id}`);
          } catch (err) {
            console.error(`[WEBHOOK] Upscale failed for image ${img.id}:`, err);
          }
        })
    );
  } catch (err) {
    console.error(`[WEBHOOK] upscaleOrderImages failed for order ${orderId}:`, err);
  }
}

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
      const result = await confirmOrderFromStripeSession(session);

      if (result) {
        const { orderId, customerEmail } = result;
        if (customerEmail) {
          resetGenerationRateLimit(customerEmail);
        }
        upscaleOrderImages(orderId);
      }

      return NextResponse.json({ received: true, processed: Boolean(result) });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[STRIPE WEBHOOK] Error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
