import sanityClient from "@sanity/client";
import type { ClientConfig } from "@sanity/client";

/**
 * Returns a configured Sanity client.
 * If preview mode is enabled, a read token may be required.
 */
export const getSanityClient = (preview: boolean) => {
  type EnrichedConfig = ClientConfig & { token?: string };
  const config: EnrichedConfig = {
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET!,
    apiVersion: process.env.SANITY_API_VERSION ?? "2023-11-01",
    useCdn: !preview,
  };
  const token = process.env.SANITY_READ_TOKEN;
  if (token) {
    config.token = token;
  }
  return sanityClient(config);
};

export type SanityPostPreview = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  coverImage?: { asset?: { _ref?: string; _id?: string } };
  publishedAt?: string;
  body?: unknown[];
};

export const postsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt
}[0...12]`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  body
}`;


