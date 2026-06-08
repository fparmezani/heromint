import { supabaseAdmin, type Order } from "@/lib/supabase";

type DashboardOrder = Pick<
  Order,
  "id" | "theme_name" | "package_type" | "total_amount" | "payment_status" | "created_at"
> & {
  users?: { email?: string | null } | { email?: string | null }[] | null;
};

export interface AdminDashboardData {
  cardsCreated: number;
  cardsCreatedChange: string;
  revenue: number;
  revenueChange: string;
  paidOrders: number;
  paidOrdersChange: string;
  conversionRate: number;
  conversionChange: string;
  recentOrders: DashboardOrder[];
}

function isInRange(date: string, start: Date, end: Date) {
  const timestamp = new Date(date).getTime();
  return timestamp >= start.getTime() && timestamp < end.getTime();
}

function formatChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? "0%" : "+100%";
  }

  const percentage = ((current - previous) / previous) * 100;
  const rounded = Math.round(percentage * 10) / 10;
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

function getMonthBoundaries() {
  const now = new Date();
  return {
    currentMonthStart: new Date(now.getFullYear(), now.getMonth(), 1),
    nextMonthStart: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    previousMonthStart: new Date(now.getFullYear(), now.getMonth() - 1, 1),
  };
}

async function getAvailableImages() {
  const { data, error } = await supabaseAdmin
    .from("generated_images")
    .select("id, created_at, indisponivel")
    .eq("indisponivel", false);

  if (!error) {
    return (data || []) as { id: string; created_at: string }[];
  }

  // Keep the dashboard available while older databases receive the migration.
  if (error.code !== "42703") throw error;

  const { data: fallbackData, error: fallbackError } = await supabaseAdmin
    .from("generated_images")
    .select("id, created_at");

  if (fallbackError) throw fallbackError;
  return (fallbackData || []) as { id: string; created_at: string }[];
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [{ data: orders, error: ordersError }, availableImages] =
    await Promise.all([
      supabaseAdmin
        .from("orders")
        .select("id, theme_name, package_type, total_amount, payment_status, created_at, users!orders_user_id_fkey (email)")
        .order("created_at", { ascending: false }),
      getAvailableImages(),
    ]);

  if (ordersError) throw ordersError;

  const allOrders = (orders || []) as DashboardOrder[];
  const paidOrders = allOrders.filter((order) => order.payment_status === "paid");
  const { currentMonthStart, nextMonthStart, previousMonthStart } = getMonthBoundaries();
  const currentMonthOrders = allOrders.filter((order) =>
    isInRange(order.created_at, currentMonthStart, nextMonthStart)
  );
  const previousMonthOrders = allOrders.filter((order) =>
    isInRange(order.created_at, previousMonthStart, currentMonthStart)
  );
  const currentMonthPaidOrders = currentMonthOrders.filter(
    (order) => order.payment_status === "paid"
  );
  const previousMonthPaidOrders = previousMonthOrders.filter(
    (order) => order.payment_status === "paid"
  );
  const currentMonthCards = availableImages.filter((image) =>
    isInRange(image.created_at, currentMonthStart, nextMonthStart)
  ).length;
  const previousMonthCards = availableImages.filter((image) =>
    isInRange(image.created_at, previousMonthStart, currentMonthStart)
  ).length;
  const currentMonthRevenue = currentMonthPaidOrders.reduce(
    (total, order) => total + order.total_amount,
    0
  );
  const previousMonthRevenue = previousMonthPaidOrders.reduce(
    (total, order) => total + order.total_amount,
    0
  );
  const conversionRate = allOrders.length > 0 ? (paidOrders.length / allOrders.length) * 100 : 0;
  const currentMonthConversion =
    currentMonthOrders.length > 0 ? (currentMonthPaidOrders.length / currentMonthOrders.length) * 100 : 0;
  const previousMonthConversion =
    previousMonthOrders.length > 0 ? (previousMonthPaidOrders.length / previousMonthOrders.length) * 100 : 0;

  return {
    cardsCreated: availableImages.length,
    cardsCreatedChange: formatChange(currentMonthCards, previousMonthCards),
    revenue: paidOrders.reduce((total, order) => total + order.total_amount, 0),
    revenueChange: formatChange(currentMonthRevenue, previousMonthRevenue),
    paidOrders: paidOrders.length,
    paidOrdersChange: formatChange(currentMonthPaidOrders.length, previousMonthPaidOrders.length),
    conversionRate,
    conversionChange: formatChange(currentMonthConversion, previousMonthConversion),
    recentOrders: allOrders.slice(0, 10),
  };
}
