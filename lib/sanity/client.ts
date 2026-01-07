import { createClient } from "@sanity/client";
import type { ClientConfig } from "@sanity/client";

/**
 * Returns a configured Sanity client.
 * If preview mode is enabled, a read token may be required.
 */
export const getSanityClient = (preview: boolean) => {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;

  if (!projectId || !dataset) {
    // Jika sedang dalam proses build, jangan throw error agar build tidak gagal di CI
    if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "test") {
      console.warn("Sanity configuration missing. Skipping client creation during build/test.");
      // Return dummy client atau handle di tempat lain
      return {
        fetch: async () => [],
        assets: { upload: async () => ({ _id: "dummy" }) },
      } as any;
    }

    throw new Error(
      "Missing Sanity configuration. Please check SANITY_PROJECT_ID and SANITY_DATASET environment variables."
    );
  }

  type EnrichedConfig = ClientConfig & { token?: string };
  const config: EnrichedConfig = {
    projectId,
    dataset,
    apiVersion: process.env.SANITY_API_VERSION ?? "2023-11-01",
    useCdn: !preview,
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
  coverImage?: { asset?: { url?: string } };
  publishedAt?: string;
  body?: unknown[];
};


