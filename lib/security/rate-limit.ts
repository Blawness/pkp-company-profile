/**
 * In-memory IP-based rate limiter for /api/ai/* routes.
 *
 * Single-instance (Node.js) only. For multi-instance / serverless,
 * replace with a shared store (Redis, Upstash, etc.). The constants
 * are configurable via env so ops can tune them without a redeploy.
 *
 * Defaults: 10 req/hour per IP for unauthenticated, 200 req/hour for
 * authenticated (defense-in-depth on top of auth).
 */

type Bucket = { timestamps: number[] };
const buckets = new Map<string, Bucket>();

const WINDOW_MS = parseInt(
  process.env.AI_RATE_WINDOW_MS ?? String(60 * 60 * 1000),
  10,
);
const MAX_PER_WINDOW = parseInt(process.env.AI_RATE_MAX ?? "10", 10);
const AUTH_MAX_PER_WINDOW = parseInt(
  process.env.AI_RATE_AUTH_MAX ?? "200",
  10,
);

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let cleanupStarted = false;

function ensureCleanup(): void {
  if (cleanupStarted || typeof setInterval === "undefined") return;
  cleanupStarted = true;
  const id = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);
      if (bucket.timestamps.length === 0) buckets.delete(key);
    }
  }, CLEANUP_INTERVAL_MS);
  id.unref?.();
}

export function getClientIp(req: Request): string {
  // x-forwarded-for is set by Vercel / most reverse proxies. Take the leftmost
  // (original client) IP, falling back to x-real-ip or "unknown".
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function checkRateLimit({
  ip,
  authenticated,
}: {
  ip: string;
  authenticated: boolean;
}): { allowed: boolean; remaining: number; resetAt: number; limit: number } {
  ensureCleanup();
  const limit = authenticated ? AUTH_MAX_PER_WINDOW : MAX_PER_WINDOW;
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { timestamps: [] };
  // Drop expired timestamps (sliding window).
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

  if (bucket.timestamps.length >= limit) {
    buckets.set(ip, bucket);
    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.timestamps[0] + WINDOW_MS,
      limit,
    };
  }
  bucket.timestamps.push(now);
  buckets.set(ip, bucket);
  return {
    allowed: true,
    remaining: limit - bucket.timestamps.length,
    resetAt: now + WINDOW_MS,
    limit,
  };
}