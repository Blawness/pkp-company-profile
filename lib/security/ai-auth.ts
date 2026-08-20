/**
 * Authentication helper for /api/ai/* routes.
 *
 * Legitimate callers are signed-in admin-kit users (the NextAuth session
 * cookie issued by /api/auth). Server-to-server callers (cron jobs,
 * scripts) with no session may use the shared-secret bypass via the
 * X-AI-Secret header (env AI_API_SECRET). Without a session AND without a
 * secret, the request is 401'd.
 */

import { auth } from "@blawness/admin-kit/auth";
import { timingSafeEqual } from "node:crypto";

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

  // 2) Signed-in admin-kit session (NextAuth cookie).
  try {
    const session = await auth();
    return !!session?.user;
  } catch {
    return false;
  }
}

// Retained for API tests that mock this module; nothing is cached anymore.
export function __resetAiAuthCacheForTests(): void {}
