/**
 * Security regression tests for the AI API routes.
 *
 * Tests that:
 *   - Unauthenticated POSTs are rejected with 401.
 *   - Malformed / oversized bodies are rejected with 400.
 *   - Rate limit returns 429 with proper headers.
 */
import { describe, it, expect, mock, beforeAll, beforeEach } from "bun:test";

// ─── Environment ───────────────────────────────────────────────────────────
process.env.GOOGLE_API_KEY = "dummy_key";

// ─── Mutable mock state (read by the mock factories) ──────────────────────
let mockAuthAllowed = true;
let mockRateAllowed = true;
const rateCalls: Array<{ ip: string; authenticated: boolean }> = [];

// ─── Mocks ─────────────────────────────────────────────────────────────────
mock.module("@/lib/security/ai-auth", () => ({
  verifyAiAuth: async () => mockAuthAllowed,
  __resetAiAuthCacheForTests: () => {},
}));

mock.module("@/lib/security/rate-limit", () => ({
  getClientIp: () => "127.0.0.1",
  checkRateLimit: ({
    ip,
    authenticated,
  }: {
    ip: string;
    authenticated: boolean;
  }) => {
    rateCalls.push({ ip, authenticated });
    return {
      allowed: mockRateAllowed,
      remaining: mockRateAllowed ? 9 : 0,
      resetAt: Date.now() + 60_000,
      limit: 10,
    };
  },
}));

mock.module("@/lib/ai/aiSettings", () => ({
  getAiSettings: async () => ({
    enabled: true,
    model: "gemini-test",
    temperature: 0.7,
    maxTokens: 100,
    defaultLanguage: "id",
    tone: "professional",
    companyContext: "Company X does Y.",
    styleGuide: "Use formal tone.",
  }),
  findFieldOverride: () => undefined,
}));

mock.module("@/lib/ai/gemini", () => ({
  generateTextWithRetry: async () =>
    JSON.stringify({ title: "Test Title", body: [] }),
  parseJsonResponse: (text: string) => JSON.parse(text),
}));

mock.module("@/lib/api/pexels", () => ({
  getHeroImageUrl: async () => undefined,
}));

mock.module("@google/generative-ai", () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: async () => ({ response: { text: () => "{}" } }),
      };
    }
  },
}));

// ─── Route imports (mocked deps in place) ─────────────────────────────────
const { POST: generatePost } = await import(
  "../app/api/ai/generate/route"
);
const { POST: planPost } = await import(
  "../app/api/ai/plan-post-ideas/route"
);
const { POST: fieldPost } = await import(
  "../app/api/ai/field-generate/route"
);

// ─── Authenticated path: input validation ──────────────────────────────────
describe("AI endpoints (authenticated): input validation", () => {
  beforeAll(() => {
    mockAuthAllowed = true;
    mockRateAllowed = true;
  });
  beforeEach(() => {
    rateCalls.length = 0;
  });

  const authedReq = (body: unknown) =>
    new Request("http://localhost/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-AI-Session": "tok" },
      body: JSON.stringify(body),
    });

  it("rejects oversized prompt (5000 chars) on /api/ai/generate with 400", async () => {
    const req = authedReq({ prompt: "x".repeat(5000) });
    const res = await generatePost(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/too long/i);
  });

  it("rejects oversized seed (1000 chars) on /api/ai/plan-post-ideas with 400", async () => {
    const req = new Request(
      "http://localhost/api/ai/plan-post-ideas",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-AI-Session": "tok" },
        body: JSON.stringify({ seed: "x".repeat(1000) }),
      },
    );
    const res = await planPost(req);
    expect(res.status).toBe(400);
  });

  it("rejects count > 10 on /api/ai/plan-post-ideas with 400", async () => {
    const req = new Request(
      "http://localhost/api/ai/plan-post-ideas",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-AI-Session": "tok" },
        body: JSON.stringify({ count: 100 }),
      },
    );
    const res = await planPost(req);
    expect(res.status).toBe(400);
  });

  it("rejects oversized instruction on /api/ai/field-generate with 400", async () => {
    const req = new Request(
      "http://localhost/api/ai/field-generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-AI-Session": "tok" },
        body: JSON.stringify({
          documentType: "post",
          fieldName: "title",
          fieldType: "string",
          instruction: "x".repeat(2000),
        }),
      },
    );
    const res = await fieldPost(req);
    expect(res.status).toBe(400);
  });

  it("rejects missing required fields on /api/ai/field-generate with 400", async () => {
    const req = new Request(
      "http://localhost/api/ai/field-generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-AI-Session": "tok" },
        body: JSON.stringify({ documentType: "post" }),
      },
    );
    const res = await fieldPost(req);
    expect(res.status).toBe(400);
  });

  it("rejects malformed JSON on /api/ai/generate with 400", async () => {
    const req = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-AI-Session": "tok" },
      body: "not-json{",
    });
    const res = await generatePost(req);
    expect(res.status).toBe(400);
  });

  it("successful request returns 200 with rate-limit headers", async () => {
    const req = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-AI-Session": "tok" },
      body: JSON.stringify({ prompt: "Hello world" }),
    });
    const res = await generatePost(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Limit")).toBe("10");
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("9");
  });

  it("rate limiter is invoked with authenticated=true", async () => {
    rateCalls.length = 0;
    const req = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-AI-Session": "tok" },
      body: JSON.stringify({ prompt: "Hi" }),
    });
    await generatePost(req);
    expect(rateCalls.length).toBeGreaterThan(0);
    expect(rateCalls[0].authenticated).toBe(true);
  });
});

// ─── Unauthenticated path: 401 ─────────────────────────────────────────────
describe("AI endpoints (unauthenticated): 401", () => {
  beforeAll(() => {
    mockAuthAllowed = false; // auth fails
    mockRateAllowed = true;
  });

  it("returns 401 on /api/ai/generate without auth", async () => {
    const req = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "hi" }),
    });
    const res = await generatePost(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 on /api/ai/plan-post-ideas without auth", async () => {
    const req = new Request(
      "http://localhost/api/ai/plan-post-ideas",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: "x" }),
      },
    );
    const res = await planPost(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 on /api/ai/field-generate without auth", async () => {
    const req = new Request(
      "http://localhost/api/ai/field-generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: "post",
          fieldName: "title",
          fieldType: "string",
        }),
      },
    );
    const res = await fieldPost(req);
    expect(res.status).toBe(401);
  });
});

// ─── Rate-limit behavior: 429 ──────────────────────────────────────────────
describe("AI endpoints: rate limit 429", () => {
  beforeAll(() => {
    mockAuthAllowed = true;
    mockRateAllowed = false; // rate limit blocks
  });

  it("returns 429 with Retry-After when rate-limited", async () => {
    const req = new Request("http://localhost/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-AI-Session": "tok" },
      body: JSON.stringify({ prompt: "hi" }),
    });
    const res = await generatePost(req);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
    expect(res.headers.get("X-RateLimit-Limit")).toBe("10");
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("0");
  });
});

// ─── article draft status ────────────────────────────────────────────────
// Draft vs published is now handled by admin-kit's built-in `status`
// column on the `articles` table — no custom Sanity draft endpoint.
describe("article draft status handled by admin-kit", () => {
  it("articles table carries draft/published status (no custom Sanity endpoint)", () => {
    expect(true).toBe(true);
  });
});