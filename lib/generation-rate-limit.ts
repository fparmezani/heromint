const GENERATION_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_GENERATIONS_PER_WINDOW = 3;

interface GenerationRateLimitEntry {
  count: number;
  resetAt: number;
}

// Keyed by IP or email
const generationAttempts = new Map<string, GenerationRateLimitEntry>();

export function getGenerationClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const vercelIp = request.headers.get("x-vercel-forwarded-for");

  return (
    forwardedFor?.split(",")[0]?.trim() ||
    vercelIp?.split(",")[0]?.trim() ||
    realIp?.trim() ||
    "unknown"
  );
}

export function checkGenerationRateLimit(identifier: string) {
  const now = Date.now();
  const current = generationAttempts.get(identifier);

  if (!current || current.resetAt <= now) {
    const resetAt = now + GENERATION_WINDOW_MS;
    generationAttempts.set(identifier, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: MAX_GENERATIONS_PER_WINDOW - 1,
      resetAt,
    };
  }

  if (current.count >= MAX_GENERATIONS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  generationAttempts.set(identifier, current);

  return {
    allowed: true,
    remaining: MAX_GENERATIONS_PER_WINDOW - current.count,
    resetAt: current.resetAt,
  };
}

/**
 * Reset rate limit for a given identifier (email or IP).
 * Called after a confirmed purchase so the user can generate again.
 */
export function resetGenerationRateLimit(identifier: string) {
  generationAttempts.delete(identifier);
}
