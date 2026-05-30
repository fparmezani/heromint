export interface Order {
  id: string;
  collectibleId: string;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt: Date;
  paidAt?: Date | null;
}
