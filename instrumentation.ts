/**
 * Next.js instrumentation hook. Runs once per server process at boot.
 *
 * For admin-kit: importing `./rbac` here (node runtime only) registers the
 * RBAC bundle so server actions / route handlers can resolve permissions
 * via `getActiveRbac()`. Without this, the first request that hits a
 * built-in screen throws "RBAC not configured".
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./rbac");
  }
}
