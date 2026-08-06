## 2024-05-22 - [CRITICAL] Unsecured AI Generation Endpoints
**Vulnerability:** The AI generation endpoints (/api/ai/generate and /api/ai/plan-post-ideas) lack authentication and input validation. Anyone can send requests to these endpoints, potentially incurring high costs (API abuse) and causing Denial of Service (DoS) via large payloads.
**Learning:** Serverless functions are publicly accessible by default. Relying on client-side obscurity (only calling it from the Studio) is not security. Even internal tools need validation and auth.
**Prevention:**
1. Always validate inputs using Zod or similar libraries (max length, types).
2. Implement authentication (e.g., verify Sanity session or shared secret) for sensitive actions.
3. Sanitize error messages to avoid leaking implementation details.

## 2024-05-22 - [HIGH] SSRF and DoS in Push Article API
**Vulnerability:** The /api/push-article endpoint fetches arbitrary URLs provided in the 'coverImageUrl' field without validation. This allows Server-Side Request Forgery (SSRF) targeting internal networks (e.g., localhost, metadata services) and Denial of Service (DoS) by pointing to large files which are loaded entirely into memory.
**Learning:** Never trust a URL provided by a user (or even a trusted system). Always validate the protocol, host, and content size before fetching.
**Prevention:**
1. Validate URL scheme (http/https).
2. Block requests to private IP ranges (127.0.0.1, 10.0.0.0/8, etc.) and localhost.
3. Check Content-Length before downloading.
4. Set a timeout and size limit on the download stream.
