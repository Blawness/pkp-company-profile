import ArticlesForm from "@blawness/admin-kit/screens/articles/form";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ id?: string; error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  // ArticlesForm reads `?id=` from searchParams to decide edit vs new.
  return <ArticlesForm searchParams={Promise.resolve({ ...sp, id })} />;
}
