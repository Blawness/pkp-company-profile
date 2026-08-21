export type OrgNode = {
  title: string;
  name?: string;
  children?: OrgNode[];
};

function Node({ node, level }: { node: OrgNode; level: number }) {
  const isRoot = level === 0;

  return (
    <div className={isRoot ? "text-center" : ""}>
      <div
        className={
          isRoot
            ? "font-display mx-auto w-fit border border-white/25 px-8 py-5 text-2xl"
            : // Stacked on phones each division carries its own rule. Side by
              // side the rule moves up to the grid container so the branch
              // reads as one continuous line instead of three loose segments.
              "border-t border-white/20 pt-5 text-sm font-semibold uppercase tracking-[0.12em] md:border-t-0"
        }
      >
        {node.title}
        {node.name ? (
          <div className="mt-1 text-xs uppercase tracking-[0.14em] text-white/50">
            {node.name}
          </div>
        ) : null}
      </div>

      {node.children?.length ? (
        <>
          {isRoot && (
            <span aria-hidden className="mx-auto block h-10 w-px bg-white/25" />
          )}
          <div
            className={
              isRoot
                ? "grid gap-10 text-left md:grid-cols-3 md:border-t md:border-white/20"
                : "mt-4 grid gap-3"
            }
          >
            {node.children.map((child) =>
              isRoot ? (
                <Node key={child.title} node={child} level={level + 1} />
              ) : (
                <div
                  key={child.title}
                  className="text-sm leading-7 text-white/70"
                >
                  {child.title}
                </div>
              ),
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function OrganizationChart({ data }: { data: OrgNode }) {
  return <Node node={data} level={0} />;
}
