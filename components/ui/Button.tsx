import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "link";
type Tone = "forest" | "light";

const base =
  "group relative inline-flex min-h-11 items-center justify-center overflow-hidden text-sm font-semibold transition duration-300";

const styles: Record<Variant, Record<Tone, string>> = {
  solid: {
    forest: "rounded-full bg-forest-950 px-8 text-white hover:bg-forest-900",
    light: "rounded-full bg-white px-8 text-forest-950 hover:bg-white/90",
  },
  outline: {
    forest:
      "rounded-full border border-hairline px-8 text-ink hover:border-forest-700 hover:text-forest-700",
    light:
      "rounded-full border border-white/30 px-8 text-white hover:border-white/70",
  },
  link: {
    forest: "gap-3 pb-1 text-forest-700",
    light: "gap-3 pb-1 text-white",
  },
};

export function Button({
  href,
  variant = "solid",
  tone = "forest",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, styles[variant][tone], className)}>
      <span className="relative z-10 inline-flex items-center gap-3">
        {children}
        {variant === "link" && (
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5"
          >
            →
          </span>
        )}
      </span>

      {variant === "link" && (
        <>
          <span
            aria-hidden
            className={cn(
              "absolute bottom-0 left-0 h-px w-full",
              tone === "light" ? "bg-white/30" : "bg-forest-700/30",
            )}
          />
          <span
            aria-hidden
            className={cn(
              "absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100",
              tone === "light" ? "bg-white" : "bg-forest-700",
            )}
          />
        </>
      )}
    </Link>
  );
}
