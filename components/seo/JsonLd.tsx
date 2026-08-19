type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

/**
 * Make a JSON-encoded payload safe to embed inside a `<script>` tag.
 *
 * `JSON.stringify` does not escape `<` or `/`, so an attacker who can
 * influence any string in `data` (e.g. CMS content) could insert
 * `</script>` and break out of the JSON-LD block, leading to stored XSS.
 *
 * Replacing `</` with `<\/` neutralises the breakout sequence without
 * producing invalid JSON (the JSON spec treats `\/` as a valid escaped
 * solidus inside any string).
 */
const safeJsonForScript = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: safeJsonForScript(data) }}
    />
  );
}
