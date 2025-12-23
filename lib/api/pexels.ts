export type PexelsPhoto = {
  id: number;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  photographer: string;
  photographer_url: string;
};

type PexelsSearchResponse = {
  photos: PexelsPhoto[];
};

function getPexelsKey() {
  return process.env.PEXELS_API_KEY || process.env.NEXT_PUBLIC_PEXELS_API_KEY || "";
}

export async function searchPexelsPhotos(query: string, perPage = 1) {
  const key = getPexelsKey();
  if (!key) return { photos: [] as PexelsPhoto[] };

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url.toString(), {
    headers: { Authorization: key },
    // Cache for 12 hours
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!res.ok) return { photos: [] as PexelsPhoto[] };
  const data = (await res.json()) as PexelsSearchResponse;
  return data;
}


