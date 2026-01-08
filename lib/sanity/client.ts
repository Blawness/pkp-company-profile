import { createClient } from "@sanity/client";
import type { ClientConfig } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

/**
 * Returns a configured Sanity client.
 * If preview mode is enabled, a read token may be required.
 */
export const getSanityClient = (preview: boolean) => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    // Jika sedang dalam proses build, jangan throw error agar build tidak gagal di CI
    if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "test") {
      console.warn("Sanity configuration missing. Skipping client creation during build/test.");
      // Return a minimal mock client to avoid build errors
      return {
        fetch: async () => [],
        assets: { upload: async () => ({ _id: "dummy" }) },
        create: async () => ({ _id: "dummy", slug: { current: "" } }),
      } as unknown as ReturnType<typeof createClient>;
    }

    throw new Error(
      "Missing Sanity configuration. Please check NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET environment variables."
    );
  }

  type EnrichedConfig = ClientConfig & { token?: string };
  const config: EnrichedConfig = {
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2023-11-01",
    useCdn: !preview,
    // Be explicit to avoid environment-dependent defaults.
    // - published: production pages
    // - drafts: preview mode (requires token and useCdn: false)
    perspective: preview ? "drafts" : "published",
  };

  const token = process.env.SANITY_READ_TOKEN;
  if (token) {
    config.token = token;
  }

  return createClient(config);
};

export type SanityPostPreview = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  coverImage?: any;
  publishedAt?: string;
  body?: unknown[];
};


