/**
 * Authentication helper for /api/ai/* routes.
 *
 * The only legitimate caller is the Sanity Studio (signed-in editor).
 * Studio actions carry the user's session token via the X-AI-Session
 * header, which we verify server-side by hitting Sanity's /users/me.
 *
 * We also accept a shared-secret bypass (X-AI-Secret, env AI_API_SECRET)
 * for server-to-server callers (cron jobs, scripts) that have no Sanity
 * session. Without a session AND without a secret, the request is 401'd.
 *
 * Successful session verifications are cached in-process for 60s to
 * avoid hammering Sanity's API on every Studio action click.
 */

import { timingSafeEqual } from "node:crypto";

const SESSION_CACHE_TTL_MS = 60_000;
const sessionCache = new Map<string, { ok: boolean; expiresAt: number }>();

async function verifySanitySession(token: string): Promise<boolean> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return false;
  try {
    const res = await fetch(
      `https://${projectId}.api.sanity.io/v1/users/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function verifyAiAuth(req: Request): Promise<boolean> {
  // 1) Optional shared-secret bypass for server-to-server callers.
  const expectedSecret = process.env.AI_API_SECRET;
  const providedSecret = req.headers.get("x-ai-secret");
  if (expectedSecret && providedSecret && safeEqual(providedSecret, expectedSecret)) {
    return true;
  }

  // 2) Sanity Studio session token (primary path).
  const sessionToken = req.headers.get("x-ai-session");
  if (!sessionToken) return false;

  const cached = sessionCache.get(sessionToken);
  if (cached && cached.expiresAt > Date.now()) return cached.ok;

  const ok = await verifySanitySession(sessionToken);
  sessionCache.set(sessionToken, { ok, expiresAt: Date.now() + SESSION_CACHE_TTL_MS });
  return ok;
}

// Test-only helper to reset the cache between unit tests.
export function __resetAiAuthCacheForTests(): void {
  sessionCache.clear();
}