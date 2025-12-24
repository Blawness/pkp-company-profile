import { NextResponse } from "next/server";

const SECRET_ENV = process.env.DRAFT_PREVIEW_SECRET;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (!SECRET_ENV || secret !== SECRET_ENV) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true, draftMode: true });
  // Simple flag to hint client/app to enable draft mode. Real Next.js Draft Mode may require a server-side toggle.
  res.cookies.set("draftMode", "1", { path: "/" });
  return res;
}


