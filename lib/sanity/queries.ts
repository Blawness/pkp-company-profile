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

export const portfoliosQuery = `*[_type == "portfolio" && defined(slug.current)] | order(publishedAt desc, _createdAt desc) {
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  client,
  year,
  tags,
  publishedAt
}[0...12]`;

export const portfolioBySlugQuery = `*[_type == "portfolio" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  client,
  location,
  year,
  tags,
  publishedAt,
  gallery,
  body
}`;
