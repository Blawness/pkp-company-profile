import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "link";
type Tone = "forest" | "light";

const base =
  "inline-flex min-h-11 items-center justify-center text-sm font-semibold transition";

const styles: Record<Variant, Record<Tone, string>> = {
  solid: {
    forest: "rounded-full bg-forest-950 px-7 text-white hover:bg-forest-900",
    light: "rounded-full bg-white px-7 text-forest-950 hover:bg-white/90",
  },
  outline: {
    forest:
      "rounded-full border border-hairline px-7 text-ink hover:border-forest-700 hover:text-forest-700",
    light:
      "rounded-full border border-white/30 px-7 text-white hover:border-white/60",
  },
  link: {
    forest:
      "gap-2 border-b border-forest-700/40 pb-1 text-forest-700 hover:border-forest-700",
    light: "gap-2 border-b border-white/40 pb-1 text-white hover:border-white",
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
      {children}
    </Link>
  );
}
