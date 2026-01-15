import { createClient } from "@sanity/client";
import type { ClientConfig } from "@sanity/client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Returns a configured Sanity client.
 * If preview mode is enabled, a read token may be required.
 */
export const getSanityClient = (preview: boolean) => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    // Jika sedang dalam proses build, jangan throw error agar build tidak gagal di CI
    if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "test" || process.env.CI) {
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
    // Add timeout to prevent hanging during build
    timeout: 10000, // 10 seconds
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
  coverImage?: SanityImageSource;
  publishedAt?: string;
  body?: unknown[];
};

export type SanityPortfolioPreview = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  coverImage?: SanityImageSource;
  publishedAt?: string;
  client?: string;
  year?: string;
  tags?: string[];
};


