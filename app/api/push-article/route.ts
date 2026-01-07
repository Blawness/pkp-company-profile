import { NextResponse } from "next/server";
import { createClient, type ClientConfig, type SanityDocumentStub } from "@sanity/client";
import path from "path";

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
    try {
      const imageResponse = await fetch(coverImageUrl);
      const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
      const arrayBuffer = await imageResponse.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      // Upload asset to Sanity
      // Asset upload to Sanity (type-safe approach)
      const asset = await client.assets.upload("image", imageBuffer, {
        filename: path.basename(coverImageUrl),
        contentType,
      });
      uploadedCoverAssetRef = asset?._id;
    } catch {
      // ignore image upload failure; proceed without coverImage
      uploadedCoverAssetRef = undefined;
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


