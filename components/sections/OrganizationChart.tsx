import { useTranslations } from "next-intl";

export type OrgNode = {
  title: string;
  name?: string;
  children?: OrgNode[];
};

function NodeCard({ node }: { node: OrgNode }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-zinc-950">
      <div className="font-semibold text-zinc-900 dark:text-zinc-100">
        {node.title}
      </div>
      {node.name ? (
        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          {node.name}
        </div>
      ) : null}
    </div>
  );
}

function renderTree(node: OrgNode) {
  return (
    <div className="grid gap-4">
      <NodeCard node={node} />
      {node.children?.length ? (
        <div className="grid gap-4 pl-4 md:pl-6">
          {node.children.map((c, idx) => (
            <div key={idx} className="grid gap-3">
              {renderTree(c)}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function OrganizationChart({ data }: { data: OrgNode }) {
  const t = useTranslations("About.organization");

  return (
    <div className="rounded-2xl border border-black/10 bg-zinc-50 p-6 dark:border-white/10 dark:bg-zinc-950/40">
      {renderTree(data)}
      <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
        {t("footer")}
      </div>
    </div>
  );
}
