import { NextResponse } from "next/server";
import { createClient, type ClientConfig, type SanityDocumentStub } from "@sanity/client";
import path from "path";
import dns from "node:dns/promises";
import { timingSafeEqual } from "node:crypto";

type ArticlePayload = {
  title: string;
  slug: string;
  excerpt?: string;
  body?: unknown[];
  coverImageUrl?: string;
  publishedAt?: string;
};

// Block private/loopback/link-local IPv4 ranges and IPv6 loopback.
// Prevents SSRF pivots to cloud metadata (169.254.169.254), localhost, etc.
const isPrivateIp = (ip: string) => {
  if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") return true;

  const parts = ip.split(".").map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    if (parts[0] === 127) return true;        // 127.0.0.0/8  loopback
    if (parts[0] === 10) return true;         // 10.0.0.0/8   private
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12
    if (parts[0] === 192 && parts[1] === 168) return true;   // 192.168.0.0/16
    if (parts[0] === 169 && parts[1] === 254) return true;   // 169.254.0.0/16 link-local / cloud metadata
    if (parts[0] === 0) return true;          // 0.0.0.0/8
  }
  return false;
};

// Validate a URL before fetching it server-side:
// 1. protocol must be http(s)
// 2. hostname must resolve to a non-private IP (defeats DNS rebinding)
const validateUrl = async (urlStr: string) => {
  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  try {
    const { address } = await dns.lookup(url.hostname);
    if (isPrivateIp(address)) {
      console.warn(`[push-article] Blocked resolved private IP ${address} for host ${url.hostname}`);
      return false;
    }
  } catch {
    // DNS failure: cannot trust the host, refuse.
    return false;
  }
  return true;
};

// Constant-time string compare to prevent timing oracles on the bearer token.
const safeTokenEquals = (a: string, b: string) => {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
};

// Build a Sanity client with optional write token from env
const buildSanityClient = () => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  
  if (!projectId || !dataset) {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set");
  }
  
  const config: ClientConfig = {
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2023-11-01",
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN
  };
  
  return createClient(config);
};

export async function POST(req: Request) {
  // Ensure write token is configured
  const expectedToken = process.env.SANITY_WRITE_TOKEN;
  if (!expectedToken) {
    return NextResponse.json({ ok: false, error: "server_write_token_not_configured" }, { status: 500 });
  }
  // Simple server-to-server auth via Bearer token or custom header
  const authHeader = req.headers.get("Authorization");
  let providedToken: string | null = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    providedToken = authHeader.slice(7);
  } else {
    const headerToken = req.headers.get("x-sanity-write-token");
    if (headerToken) providedToken = headerToken;
  }
  if (!providedToken || !safeTokenEquals(providedToken, expectedToken)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  // Basic payload validation
  let payload: ArticlePayload;
  try {
    payload = (await req.json()) as ArticlePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }
  const { title, slug, excerpt, body, coverImageUrl, publishedAt } = payload;
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ ok: false, error: "missing_or_invalid_title" }, { status: 400 });
  }
  if (!slug || typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ ok: false, error: "missing_or_invalid_slug" }, { status: 400 });
  }
  if (excerpt && typeof excerpt !== "string") {
    return NextResponse.json({ ok: false, error: "invalid_excerpt" }, { status: 400 });
  }
  if (body && !Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  if (publishedAt && isNaN(new Date(publishedAt).getTime())) {
    return NextResponse.json({ ok: false, error: "invalid_publishedAt" }, { status: 400 });
  }
  // Continue with main flow using validated payload
  const client = buildSanityClient();
  // If a cover image URL is provided, attempt to upload as a Sanity image asset.
  // Guarded against SSRF (private IPs) and DoS (size + timeout).
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
  const FETCH_TIMEOUT_MS = 5000;
  let uploadedCoverAssetRef: string | undefined;
  if (coverImageUrl) {
    const isSafe = await validateUrl(coverImageUrl);
    if (!isSafe) {
      console.warn(`[push-article] Rejected unsafe coverImageUrl`);
      uploadedCoverAssetRef = undefined;
    } else {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      try {
        const imageResponse = await fetch(coverImageUrl, { signal: controller.signal });
        if (!imageResponse.ok) throw new Error(`Image fetch failed: ${imageResponse.status}`);

        const declaredLen = imageResponse.headers.get("content-length");
        if (declaredLen && parseInt(declaredLen, 10) > MAX_IMAGE_BYTES) {
          throw new Error("Image too large (content-length)");
        }
        const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
        const arrayBuffer = await imageResponse.arrayBuffer();
        if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) {
          throw new Error("Image too large (post-download check)");
        }
        const imageBuffer = Buffer.from(arrayBuffer);
        const asset = await client.assets.upload("image", imageBuffer, {
          filename: path.basename(coverImageUrl),
          contentType,
        });
        uploadedCoverAssetRef = asset?._id;
      } catch (err) {
        console.warn("[push-article] coverImage upload failed:", err);
        uploadedCoverAssetRef = undefined;
      } finally {
        clearTimeout(timeoutId);
      }
    }
  }
  const doc: SanityDocumentStub = {
    _type: "post",
    title,
    slug: { current: slug },
    excerpt,
    body: body ?? [],
  };
  if (uploadedCoverAssetRef) {
    doc.coverImage = { _type: "image", asset: { _ref: uploadedCoverAssetRef } };
  } else if (coverImageUrl) {
    // Fallback: not implemented yet
  }
  if (publishedAt) {
    doc.publishedAt = publishedAt;
  }

  const created = await client.create(doc);
  return NextResponse.json({ ok: true, id: created._id, slug: (created.slug as { current: string })?.current ?? slug });
}


