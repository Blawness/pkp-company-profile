/**
 * Renders Tiptap-produced HTML for a published article, after running
 * it through admin-kit's `sanitizeHtml` to strip dangerous tags
 * (script, iframe, on-handlers, etc.).
 *
 * Tiptap outputs well-formed semantic HTML, but the raw HTML still comes
 * from a database row that any admin editor can put anything in. Sanitise
 * before injecting into the DOM via `dangerouslySetInnerHTML`.
 */
import { sanitizeHtml } from "@blawness/admin-kit";

export function ArticleContent({ html }: { html: string | null }) {
  if (!html) return null;
  const safe = sanitizeHtml(html);
  return (
    <div
      className="prose prose-zinc dark:prose-invert max-w-none"
      // Sanitised via admin-kit (strips <script>, event handlers, etc.)
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}