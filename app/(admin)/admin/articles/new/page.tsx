import ArticlesForm from "@blawness/admin-kit/screens/articles/form";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return <ArticlesForm searchParams={Promise.resolve(sp)} />;
}