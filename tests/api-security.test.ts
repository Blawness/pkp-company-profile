import { describe, it, expect, mock, beforeEach } from "bun:test";
import { POST as generatePost } from "../app/api/ai/generate/route";
import { POST as planPost } from "../app/api/ai/plan-post-ideas/route";

// Mock dependencies
mock.module("@/lib/ai/aiSettings", () => ({
  getAiSettings: async () => ({
    enabled: true,
    model: "gemini-test",
    temperature: 0.7,
    maxTokens: 100,
    defaultLanguage: "id",
    tone: "professional",
  }),
}));

mock.module("@/lib/ai/gemini", () => ({
  generateTextWithRetry: async () => JSON.stringify({ title: "Test Title", ideas: [] }),
  parseJsonResponse: (text: string) => JSON.parse(text),
}));

mock.module("@/lib/api/pexels", () => ({
  getHeroImageUrl: async () => "https://example.com/image.jpg",
}));

mock.module("@/lib/sanity/client", () => ({
  getSanityClient: () => ({
    fetch: async () => [],
  }),
}));

// Mock GoogleGenerativeAI
mock.module("@google/generative-ai", () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        generateContent: async () => ({ response: { text: () => "{}" } }),
      };
    }
  },
}));

// Setup env
process.env.GOOGLE_API_KEY = "dummy_key";

describe("API Security", () => {
  describe("Generate Endpoint", () => {
    it("should reject missing prompt", async () => {
      const req = new Request("http://localhost/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const res = await generatePost(req);
      expect(res.status).toBe(400);
    });

    it("should reject oversized prompt", async () => {
        const longPrompt = "a".repeat(5000);
        const req = new Request("http://localhost/api/ai/generate", {
            method: "POST",
            body: JSON.stringify({ prompt: longPrompt }),
        });
        const res = await generatePost(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toContain("too long");
    });
  });

  describe("Plan Post Ideas Endpoint", () => {
     it("should reject oversized seed", async () => {
        const longSeed = "a".repeat(1000);
        const req = new Request("http://localhost/api/ai/plan-post-ideas", {
            method: "POST",
            body: JSON.stringify({ seed: longSeed }),
        });
        const res = await planPost(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toContain("too long");
     });

     it("should reject invalid count", async () => {
        const req = new Request("http://localhost/api/ai/plan-post-ideas", {
            method: "POST",
            body: JSON.stringify({ count: 100 }),
        });
        const res = await planPost(req);
        expect(res.status).toBe(400);
     });
  });
});
