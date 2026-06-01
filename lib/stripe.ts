import Stripe from "stripe";

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY or STRIPE_API_KEY is not set");
  }

  return new Stripe(secretKey);
}

export function getStripeWebhookSecret(): string {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  return webhookSecret;
}
