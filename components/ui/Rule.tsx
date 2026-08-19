import { cn } from "@/lib/cn";

export function Rule({
  tone = "ink",
  accent = false,
  className,
}: {
  tone?: "ink" | "light";
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative border-t",
        tone === "light" ? "border-white/20" : "border-hairline",
        className,
      )}
    >
      {accent && (
        <span className="absolute -top-px left-0 block h-px w-16 bg-brass" />
      )}
    </div>
  );
}
