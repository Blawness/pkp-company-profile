import { NextResponse } from "next/server";
import { createClient, type ClientConfig, type SanityDocumentStub } from "@sanity/client";
import path from "path";
import dns from "node:dns/promises";

type ArticlePayload = {
  title: string;
  slug: string;
  excerpt?: string;
  body?: unknown[];
  coverImageUrl?: string;
  publishedAt?: string;
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

const isPrivateIp = (ip: string) => {
  // Check IPv6 localhost
  if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") return true;

  // Check IPv4
  const parts = ip.split(".").map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    // 127.0.0.0/8
    if (parts[0] === 127) return true;
    // 10.0.0.0/8
    if (parts[0] === 10) return true;
    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0/16
    if (parts[0] === 169 && parts[1] === 254) return true;
  }
  return false;
};

const validateUrl = async (urlStr: string) => {
  try {
    const url = new URL(urlStr);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    // Resolve DNS to prevent rebinding/bypasses
    try {
        const result = await dns.lookup(url.hostname);
        const address = result.address;
        if (isPrivateIp(address)) {
            console.warn(`Blocked resolved private IP: ${address} for host ${url.hostname}`);
            return false;
        }
    } catch (e) {
        // DNS failure (or maybe it's an IP already?)
        // If lookup fails, we can't trust it.
        return false;
    }

    return true;
  } catch {
    return false;
  }
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
  if (providedToken !== expectedToken) {
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
  // If a cover image URL is provided, attempt to upload as a Sanity image asset
  let uploadedCoverAssetRef: string | undefined;
  if (coverImageUrl) {
    const isValid = await validateUrl(coverImageUrl);
    if (!isValid) {
        // Log potential SSRF attempt
        console.warn(`Blocked invalid or private URL: ${coverImageUrl}`);
        // Proceed without image rather than crashing or exposing detail
        uploadedCoverAssetRef = undefined;
    } else {
        try {
        // Timeout 5s, Max 5MB
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const imageResponse = await fetch(coverImageUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!imageResponse.ok) throw new Error("Fetch failed");

        const contentLength = imageResponse.headers.get("content-length");
        if (contentLength && parseInt(contentLength, 10) > 5 * 1024 * 1024) {
            throw new Error("Image too large");
        }

        const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
        const arrayBuffer = await imageResponse.arrayBuffer();

        // Double check size after download in case Content-Length was missing/fake
        if (arrayBuffer.byteLength > 5 * 1024 * 1024) {
             throw new Error("Image too large");
        }

        const imageBuffer = Buffer.from(arrayBuffer);
        // Upload asset to Sanity
        // Asset upload to Sanity (type-safe approach)
        const asset = await client.assets.upload("image", imageBuffer, {
            filename: path.basename(coverImageUrl),
            contentType,
        });
        uploadedCoverAssetRef = asset?._id;
        } catch (err) {
        // ignore image upload failure; proceed without coverImage
        console.error("Failed to upload cover image:", err);
        uploadedCoverAssetRef = undefined;
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
