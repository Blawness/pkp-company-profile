import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/animations/Reveal";
import { MaskedText } from "@/components/animations/MaskedText";

export function IndexedItem({
  index,
  title,
  href,
  className,
  children,
}: {
  index: number;
  title: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const label = String(index).padStart(2, "0");

  return (
    <div
      className={cn(
        "group grid gap-4 border-t border-hairline py-12 transition-colors duration-500 hover:border-brass/50 md:grid-cols-[8rem_1fr] md:gap-10",
        className,
      )}
    >
      <Reveal y={16}>
        <div className="font-display text-4xl text-brass/70 transition-all duration-500 group-hover:text-brass md:text-5xl">
          {label}
        </div>
      </Reveal>

      <div>
        {href ? (
          <Link href={href} className="block no-underline">
            <MaskedText
              as="h3"
              text={title}
              className="font-display text-2xl transition-colors duration-300 group-hover:text-forest-700 md:text-3xl"
            />
          </Link>
        ) : (
          <MaskedText
            as="h3"
            text={title}
            className="font-display text-2xl md:text-3xl"
          />
        )}

        {children && (
          <Reveal delay={0.15}>
            <div className="mt-4 max-w-2xl text-base leading-8 text-ink-muted">
              {children}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
