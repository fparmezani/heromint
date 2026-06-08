const PURCHASE_IP_TTL_MS = 180 * 24 * 60 * 60 * 1000;

const purchaseIps = new Map<string, number>();

function pruneExpiredPurchaseIps(now = Date.now()) {
  for (const [ip, expiresAt] of purchaseIps) {
    if (expiresAt <= now) {
      purchaseIps.delete(ip);
    }
  }
}

export function hasPurchaseForIp(ip: string) {
  pruneExpiredPurchaseIps();
  return purchaseIps.has(ip);
}

export function markPurchaseStartedForIp(ip: string) {
  pruneExpiredPurchaseIps();
  purchaseIps.set(ip, Date.now() + PURCHASE_IP_TTL_MS);
}
