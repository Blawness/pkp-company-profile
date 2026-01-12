## 2025-05-25 - [Enable AVIF Support]
**Learning:** Next.js allows enabling AVIF image format via `next.config.ts`, which significantly reduces image sizes compared to WebP (typically ~20%). This is a high-impact, low-risk configuration change.
**Action:** Always check `next.config.ts` for `formats` array in `images` configuration. If missing or only `webp`, add `avif` (and ensure `sharp` is available if needed, though Next.js often handles fallbacks).
