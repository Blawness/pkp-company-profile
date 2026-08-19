import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  (await draftMode()).disable();
  const url = new URL(req.url);
  const back = url.searchParams.get("back") ?? "/";
  // Only redirect to relative paths starting with "/" (avoid open-redirect).
  const safeBack = back.startsWith("/") && !back.startsWith("//") ? back : "/";
  redirect(safeBack);
}