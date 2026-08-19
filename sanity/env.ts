// Minimal env shim for portfolio image URLs (full migration pending).
// Articles are now in Postgres (admin-kit); portfolios still reference
// Sanity-hosted images until R2 is set up.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-07';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? '';
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
