import { cn } from "@/lib/cn";
import { Rule } from "@/components/ui/Rule";
import { Reveal } from "@/components/animations/Reveal";
import { MaskedText } from "@/components/animations/MaskedText";

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
        <Reveal y={12}>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
            {eyebrow}
          </div>
        </Reveal>
      )}
      <Rule accent className={cn("mt-4", align === "center" && "mx-auto w-24")} />
      <MaskedText
        as="h2"
        text={title}
        delay={0.1}
        className="font-display text-h2 mt-6"
      />
      {lead && (
        <Reveal delay={0.2}>
          <p className="mt-5 text-pretty text-base leading-8 opacity-80">
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
