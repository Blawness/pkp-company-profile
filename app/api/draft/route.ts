import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug");
  const type = url.searchParams.get("type"); // "post" | "portfolio" | undefined
  const expected = process.env.DRAFT_PREVIEW_SECRET;

  // Constant-time secret comparison + reject when secret is not configured.
  if (!expected || !secret) {
    return NextResponse.json(
      { ok: false, error: "Invalid secret" },
      { status: 403 },
    );
  }
  const a = Buffer.from(secret);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json(
      { ok: false, error: "Invalid secret" },
      { status: 403 },
    );
  }

  // Enable real Next.js Draft Mode so subsequent page renders fetch drafts.
  (await draftMode()).enable();

  // Redirect to the targeted preview page (or home when no slug given).
  let target = "/";
  if (slug && typeof slug === "string" && /^[a-z0-9-]+$/.test(slug)) {
    const path =
      type === "portfolio" ? `portofolio/${slug}` : `artikel/${slug}`;
    target = `/${path}`;
  }
  redirect(target);
}