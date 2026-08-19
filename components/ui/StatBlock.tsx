import { credentials, type StatItem } from "@/lib/data/credentials";
import { cn } from "@/lib/cn";

export function StatBlock({
  items,
  tone = "light",
  className,
}: {
  items?: StatItem[];
  tone?: "forest" | "light";
  className?: string;
}) {
  const resolved = items ?? (credentials.enabled ? credentials.stats : []);
  if (resolved.length === 0) return null;

  return (
    <dl
      className={cn(
        "flex flex-wrap divide-x",
        tone === "light" ? "divide-white/20" : "divide-hairline",
        className,
      )}
    >
      {resolved.map((item) => (
        <div key={item.label} className="px-6 first:pl-0">
          <dt className="text-xs uppercase tracking-[0.18em] opacity-70">
            {item.label}
          </dt>
          <dd className="font-display mt-2 text-3xl">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
