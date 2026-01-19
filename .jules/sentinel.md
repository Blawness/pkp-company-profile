## 2024-05-22 - [CRITICAL] Unsecured AI Generation Endpoints
**Vulnerability:** The AI generation endpoints (/api/ai/generate and /api/ai/plan-post-ideas) lack authentication and input validation. Anyone can send requests to these endpoints, potentially incurring high costs (API abuse) and causing Denial of Service (DoS) via large payloads.
**Learning:** Serverless functions are publicly accessible by default. Relying on client-side obscurity (only calling it from the Studio) is not security. Even internal tools need validation and auth.
**Prevention:**
1. Always validate inputs using Zod or similar libraries (max length, types).
2. Implement authentication (e.g., verify Sanity session or shared secret) for sensitive actions.
3. Sanitize error messages to avoid leaking implementation details.
