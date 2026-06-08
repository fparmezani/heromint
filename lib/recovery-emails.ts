import { createRecoveryEmailTemplate, sendEmail } from "@/lib/email-service";
import { isAdminEmail } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

const RECOVERY_DELAY_HOURS = 12;
const RECOVERY_COOLDOWN_DAYS = 7;
const RECOVERY_LIMIT_PER_RUN = 50;
const RECOVERY_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/futebol`
  : "https://heromint.net/futebol";

type RecoveryStatus = "pending" | "sent" | "skipped_paid" | "skipped_recent" | "failed";

export interface RecoveryEmailEvent {
  id: string;
  user_email: string;
  user_name: string | null;
  collectible_id: string | null;
  theme_name: string;
  package_type: string;
  status: RecoveryStatus;
  email_sent_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecoveryCandidate {
  id: string;
  source: "event" | "order";
  user_email: string;
  user_name: string | null;
  collectible_id: string | null;
  theme_name: string;
  package_type: string;
  created_at: string;
}

interface RecoveryEventInsert {
  user_email: string;
  user_name?: string | null;
  collectible_id: string;
  theme_name: string;
  package_type: string;
  form_data: Record<string, unknown>;
  client_ip: string;
}

export interface RecoveryRunResult {
  success: boolean;
  scanned: number;
  sent: number;
  skippedPaid: number;
  skippedRecent: number;
  failed: number;
  errors: string[];
}

export interface RecoveryDashboardData {
  sentToday: number;
  sentLast7Days: number;
  pendingEligible: number;
  pendingTotal: number;
  eligibleCandidates: RecoveryCandidate[];
  recentEvents: RecoveryEmailEvent[];
  setupRequired: boolean;
}

function getDateHoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function getDateDaysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getFirstName(name?: string | null) {
  return name?.trim().split(/\s+/)[0] || "";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isRecoverableEmail(email: string) {
  return !isAdminEmail(email);
}

function uniqueCandidatesByEmail(candidates: RecoveryCandidate[]) {
  const byEmail = new Map<string, RecoveryCandidate>();

  for (const candidate of candidates) {
    const email = normalizeEmail(candidate.user_email);
    if (!isRecoverableEmail(email)) continue;

    const current = byEmail.get(email);
    if (!current || new Date(candidate.created_at).getTime() > new Date(current.created_at).getTime()) {
      byEmail.set(email, { ...candidate, user_email: email });
    }
  }

  return Array.from(byEmail.values())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function isMissingRecoveryTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const maybeError = error as { code?: string; message?: string; details?: string | null };
  const text = `${maybeError.message || ""} ${maybeError.details || ""}`.toLowerCase();

  return (
    maybeError.code === "42P01" ||
    maybeError.code === "PGRST205" ||
    maybeError.code === "PGRST202" ||
    text.includes("recovery_email_events") ||
    text.includes("could not find the table") ||
    text.includes("schema cache")
  );
}

async function updateEvents(ids: string[], status: RecoveryStatus, lastError?: string) {
  if (ids.length === 0) return;

  const update: Record<string, string | null> = {
    status,
    updated_at: new Date().toISOString(),
    last_error: lastError || null,
  };

  if (status === "sent") {
    update.email_sent_at = new Date().toISOString();
  }

  const { error } = await supabaseAdmin
    .from("recovery_email_events")
    .update(update)
    .in("id", ids);

  if (error) throw error;
}

async function hasPaidOrderAfter(email: string, createdAt: string) {
  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("id")
    .ilike("email", normalizeEmail(email))
    .maybeSingle();

  if (userError) throw userError;
  if (!user?.id) return false;

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("user_id", user.id)
    .eq("payment_status", "paid")
    .gte("updated_at", createdAt)
    .limit(1)
    .maybeSingle();

  if (orderError) throw orderError;
  return Boolean(order);
}

async function hasRecentRecoveryEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from("recovery_email_events")
    .select("id")
    .ilike("user_email", normalizeEmail(email))
    .eq("status", "sent")
    .gte("email_sent_at", getDateDaysAgo(RECOVERY_COOLDOWN_DAYS).toISOString())
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

function mapEventToCandidate(event: RecoveryEmailEvent): RecoveryCandidate {
  return {
    id: event.id,
    source: "event",
    user_email: event.user_email,
    user_name: event.user_name,
    collectible_id: event.collectible_id,
    theme_name: event.theme_name,
    package_type: event.package_type,
    created_at: event.created_at,
  };
}

type PendingOrderRow = {
  id: string;
  collectible_id: string;
  theme_name: string;
  package_type: string;
  form_data?: Record<string, unknown> | null;
  created_at: string;
  users?: { email?: string | null; name?: string | null } | { email?: string | null; name?: string | null }[] | null;
};

function getOrderUser(order: PendingOrderRow) {
  return Array.isArray(order.users) ? order.users[0] : order.users;
}

function mapOrderToCandidate(order: PendingOrderRow): RecoveryCandidate | null {
  const user = getOrderUser(order);
  if (!user?.email) return null;

  return {
    id: order.id,
    source: "order",
    user_email: normalizeEmail(user.email),
    user_name: user.name || null,
    collectible_id: order.collectible_id,
    theme_name: order.theme_name,
    package_type: order.package_type,
    created_at: order.created_at,
  };
}

async function getPendingOrderCandidates(cutoff?: string, limit = RECOVERY_LIMIT_PER_RUN) {
  let query = supabaseAdmin
    .from("orders")
    .select(`
      id,
      collectible_id,
      theme_name,
      package_type,
      form_data,
      created_at,
      users!orders_user_id_fkey (email, name)
    `)
    .eq("payment_status", "pending")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (cutoff) {
    query = query.lte("created_at", cutoff);
  }

  const { data, error } = await query;
  if (error) throw error;

  return ((data || []) as PendingOrderRow[])
    .map(mapOrderToCandidate)
    .filter((candidate): candidate is RecoveryCandidate => Boolean(candidate))
    .filter((candidate) => isRecoverableEmail(candidate.user_email));
}

async function insertSentEventsForOrderCandidates(candidates: RecoveryCandidate[]) {
  const orderCandidates = candidates.filter((candidate) => candidate.source === "order");
  if (orderCandidates.length === 0) return;

  const { error } = await supabaseAdmin
    .from("recovery_email_events")
    .insert(orderCandidates.map((candidate) => ({
      user_email: normalizeEmail(candidate.user_email),
      user_name: candidate.user_name,
      collectible_id: candidate.collectible_id,
      theme_name: candidate.theme_name,
      package_type: candidate.package_type,
      form_data: {},
      status: "sent",
      email_sent_at: new Date().toISOString(),
    })));

  if (error && !isMissingRecoveryTableError(error)) {
    throw error;
  }
}

export async function recordGeneratedPreviewForRecovery(event: RecoveryEventInsert) {
  const { error } = await supabaseAdmin
    .from("recovery_email_events")
    .insert([{
      user_email: normalizeEmail(event.user_email),
      user_name: event.user_name || null,
      collectible_id: event.collectible_id,
      theme_name: event.theme_name,
      package_type: event.package_type,
      form_data: event.form_data,
      client_ip: event.client_ip,
      status: "pending",
    }]);

  if (error) {
    // Keep image generation working while the production DB receives the migration.
    console.error("[RECOVERY] Failed to record generated preview:", error);
  }
}

export async function getRecoveryDashboardData(): Promise<RecoveryDashboardData> {
  const eligibleCutoff = getDateHoursAgo(RECOVERY_DELAY_HOURS).toISOString();
  const todayStart = getStartOfToday().toISOString();
  const last7DaysStart = getDateDaysAgo(7).toISOString();

  const [
    sentToday,
    sentLast7Days,
    pendingEligible,
    pendingTotal,
    eligibleEvents,
    pendingEvents,
    recentEvents,
    eligibleOrders,
    pendingOrders,
  ] = await Promise.all([
    supabaseAdmin
      .from("recovery_email_events")
      .select("id", { count: "exact", head: true })
      .eq("status", "sent")
      .gte("email_sent_at", todayStart),
    supabaseAdmin
      .from("recovery_email_events")
      .select("id", { count: "exact", head: true })
      .eq("status", "sent")
      .gte("email_sent_at", last7DaysStart),
    supabaseAdmin
      .from("recovery_email_events")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .lte("created_at", eligibleCutoff),
    supabaseAdmin
      .from("recovery_email_events")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabaseAdmin
      .from("recovery_email_events")
      .select("id, user_email, user_name, collectible_id, theme_name, package_type, status, email_sent_at, last_error, created_at, updated_at")
      .eq("status", "pending")
      .lte("created_at", eligibleCutoff)
      .order("created_at", { ascending: true })
      .limit(RECOVERY_LIMIT_PER_RUN),
    supabaseAdmin
      .from("recovery_email_events")
      .select("id, user_email, user_name, collectible_id, theme_name, package_type, status, email_sent_at, last_error, created_at, updated_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(200),
    supabaseAdmin
      .from("recovery_email_events")
      .select("id, user_email, user_name, collectible_id, theme_name, package_type, status, email_sent_at, last_error, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(20),
    getPendingOrderCandidates(eligibleCutoff),
    getPendingOrderCandidates(undefined, 200),
  ]);

  const errors = [sentToday.error, sentLast7Days.error, pendingEligible.error, pendingTotal.error, eligibleEvents.error, pendingEvents.error, recentEvents.error]
    .filter(Boolean);

  if (errors.some(isMissingRecoveryTableError)) {
    return {
      sentToday: 0,
      sentLast7Days: 0,
      pendingEligible: eligibleOrders.length,
      pendingTotal: pendingOrders.length,
      eligibleCandidates: eligibleOrders,
      recentEvents: [],
      setupRequired: true,
    };
  }

  if (errors.length > 0) {
    throw errors[0];
  }

  const eventCandidates = ((eligibleEvents.data || []) as RecoveryEmailEvent[])
    .map(mapEventToCandidate)
    .filter((candidate) => isRecoverableEmail(candidate.user_email));
  const pendingEventCandidates = ((pendingEvents.data || []) as RecoveryEmailEvent[])
    .map(mapEventToCandidate)
    .filter((candidate) => isRecoverableEmail(candidate.user_email));
  const eligibleCandidates = uniqueCandidatesByEmail([...eventCandidates, ...eligibleOrders])
    .slice(0, RECOVERY_LIMIT_PER_RUN);

  return {
    sentToday: sentToday.count || 0,
    sentLast7Days: sentLast7Days.count || 0,
    pendingEligible: eligibleCandidates.length,
    pendingTotal: uniqueCandidatesByEmail([
      ...pendingEventCandidates,
      ...pendingOrders,
    ]).length,
    eligibleCandidates,
    recentEvents: (recentEvents.data || []) as RecoveryEmailEvent[],
    setupRequired: false,
  };
}

export async function runRecoveryEmailTask(): Promise<RecoveryRunResult> {
  const cutoff = getDateHoursAgo(RECOVERY_DELAY_HOURS).toISOString();
  const [{ data, error }, orderCandidates] = await Promise.all([
    supabaseAdmin
    .from("recovery_email_events")
    .select("id, user_email, user_name, collectible_id, theme_name, package_type, status, email_sent_at, last_error, created_at, updated_at")
    .eq("status", "pending")
    .lte("created_at", cutoff)
    .order("created_at", { ascending: true })
      .limit(RECOVERY_LIMIT_PER_RUN),
    getPendingOrderCandidates(cutoff),
  ]);

  if (error) {
    if (isMissingRecoveryTableError(error)) {
      return {
        success: false,
        scanned: 0,
        sent: 0,
        skippedPaid: 0,
        skippedRecent: 0,
        failed: 0,
        errors: ["Aplique o SQL database/add-recovery-email-events.sql antes de enviar emails."],
      };
    }

    throw error;
  }

  const eventCandidates = ((data || []) as RecoveryEmailEvent[]).map(mapEventToCandidate);
  const candidates = uniqueCandidatesByEmail([...eventCandidates, ...orderCandidates])
    .slice(0, RECOVERY_LIMIT_PER_RUN);
  const groups = new Map<string, RecoveryCandidate[]>();

  for (const candidate of candidates) {
    const email = normalizeEmail(candidate.user_email);
    groups.set(email, [...(groups.get(email) || []), candidate]);
  }

  const result: RecoveryRunResult = {
    success: true,
    scanned: candidates.length,
    sent: 0,
    skippedPaid: 0,
    skippedRecent: 0,
    failed: 0,
    errors: [],
  };

  for (const [email, emailCandidates] of groups) {
    if (!isRecoverableEmail(email)) {
      result.skippedRecent += emailCandidates.length;
      continue;
    }

    const eventIds = eventCandidates
      .filter((candidate) => normalizeEmail(candidate.user_email) === email)
      .map((candidate) => candidate.id);
    const oldestCandidate = emailCandidates[0];

    try {
      if (await hasPaidOrderAfter(email, oldestCandidate.created_at)) {
        await updateEvents(eventIds, "skipped_paid", "Pagamento detectado antes do envio.");
        result.skippedPaid += emailCandidates.length;
        continue;
      }

      if (await hasRecentRecoveryEmail(email)) {
        await updateEvents(eventIds, "skipped_recent", "Email de recuperacao enviado recentemente.");
        result.skippedRecent += emailCandidates.length;
        continue;
      }

      const html = createRecoveryEmailTemplate({
        userName: getFirstName(oldestCandidate.user_name),
        recoveryUrl: RECOVERY_URL,
      });

      await sendEmail({
        to: email,
        subject: "Seu card HeroMint ficou quase pronto",
        html,
      });

      await updateEvents(eventIds, "sent");
      await insertSentEventsForOrderCandidates(emailCandidates);
      result.sent += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      await updateEvents(eventIds, "failed", message);
      result.failed += emailCandidates.length;
      result.errors.push(`${email}: ${message}`);
    }
  }

  result.success = result.failed === 0;
  return result;
}
