import { cn } from "@/lib/cn";
import { Rule } from "@/components/ui/Rule";

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
          {eyebrow}
        </div>
      )}
      <Rule className={cn("mt-4", align === "center" && "mx-auto w-24")} />
      <h2 className="font-display text-h2 mt-6 text-balance">{title}</h2>
      {lead && (
        <p className="mt-5 text-pretty text-base leading-8 opacity-80">
          {lead}
        </p>
      )}
    </div>
  );
}
