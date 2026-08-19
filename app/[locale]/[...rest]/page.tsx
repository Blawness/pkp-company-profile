import { notFound } from "next/navigation";

/**
 * Catch-all so unmatched paths fall into the `[locale]` segment and render
 * `app/[locale]/not-found.tsx`. Without it Next serves its built-in 404 page,
 * which carries none of the site's layout or translations.
 */
export default function CatchAllNotFound() {
  notFound();
}
