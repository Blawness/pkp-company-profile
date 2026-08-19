import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { dataset, projectId } from '../env';

const builder = projectId && dataset
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

/**
 * Build a Sanity CDN URL for an image. Returns null when Sanity env vars
 * are not configured (e.g. in fresh dev environments before migration is
 * complete). Callers must handle the null case.
 */
export const urlFor = (source: SanityImageSource) => {
  if (!builder) {
    return {
      width: () => ({
        height: () => ({
          quality: () => ({
            url: () => '',
          }),
          url: () => '',
        }),
        quality: () => ({
          url: () => '',
        }),
        url: () => '',
      }),
      url: () => '',
    } as unknown as ReturnType<ReturnType<typeof createImageUrlBuilder>['image']>;
  }
  return builder.image(source);
};
