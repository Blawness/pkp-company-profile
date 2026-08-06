import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { POST } from "../app/api/push-article/route";

// Mock Sanity Client
const mockCreate = mock(() => Promise.resolve({ _id: "new-doc-id", slug: { current: "test-slug" } }));
const mockUpload = mock(() => Promise.resolve({ _id: "image-asset-id" }));

mock.module("@sanity/client", () => ({
  createClient: () => ({
    create: mockCreate,
    assets: { upload: mockUpload },
  }),
}));

// Mock DNS
// Note: We mock both default export and named export to be safe with how it's imported
const mockLookup = mock(async (hostname: string) => {
    if (hostname === "localhost") return { address: "127.0.0.1" };
    if (hostname === "localtest.me") return { address: "127.0.0.1" };
    if (hostname === "example.com") return { address: "93.184.216.34" };
    return { address: hostname }; // assume it's an IP if unknown
});

mock.module("node:dns/promises", () => ({
  default: {
    lookup: mockLookup
  },
  lookup: mockLookup
}));

// Setup Env
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test-project";
process.env.NEXT_PUBLIC_SANITY_DATASET = "test-dataset";
process.env.SANITY_WRITE_TOKEN = "valid-token";

describe("Push Article API Security", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    mockCreate.mockClear();
    mockUpload.mockClear();
    mockLookup.mockClear();
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const createRequest = (payload: unknown) => new Request("http://localhost/api/push-article", {
    method: "POST",
    headers: {
      "Authorization": "Bearer valid-token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  it("should block localhost URL (SSRF)", async () => {
    const payload = {
      title: "SSRF Test",
      slug: "ssrf-test",
      coverImageUrl: "http://localhost:3000/secret"
    };

    const mockFetch = mock(() => Promise.resolve(new Response("ok")));
    global.fetch = mockFetch;

    await POST(createRequest(payload));

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should block private IP URL (SSRF)", async () => {
     const payload = {
       title: "Private IP Test",
       slug: "private-ip-test",
       coverImageUrl: "http://169.254.169.254/latest"
     };

     const mockFetch = mock(() => Promise.resolve(new Response("ok")));
     global.fetch = mockFetch;

     await POST(createRequest(payload));

     expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should block DNS rebinding / localtest.me", async () => {
     const payload = {
       title: "DNS Rebind Test",
       slug: "dns-rebind-test",
       coverImageUrl: "http://localtest.me/secret"
     };

     const mockFetch = mock(() => Promise.resolve(new Response("ok")));
     global.fetch = mockFetch;

     await POST(createRequest(payload));

     expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should reject large content length (DoS)", async () => {
     const payload = {
       title: "DoS Test",
       slug: "dos-test",
       coverImageUrl: "https://example.com/large.jpg"
     };

     const mockFetch = mock(() => Promise.resolve(new Response("large", {
         headers: { "content-length": "10000000" } // 10MB
     })));
     global.fetch = mockFetch;

     await POST(createRequest(payload));

     // It should fetch (to check headers) but NOT upload
     expect(mockFetch).toHaveBeenCalled();
     expect(mockUpload).not.toHaveBeenCalled();
  });

  it("should allow public URL", async () => {
     const payload = {
       title: "Public URL Test",
       slug: "public-url-test",
       coverImageUrl: "https://example.com/image.jpg"
     };

     const mockFetch = mock(() => Promise.resolve(new Response("fake-image-data")));
     global.fetch = mockFetch;

     await POST(createRequest(payload));

     expect(mockFetch).toHaveBeenCalled();
     expect(mockUpload).toHaveBeenCalled();
  });
});
