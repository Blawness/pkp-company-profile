import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";

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
        "grid gap-4 border-t border-hairline py-10 md:grid-cols-[6rem_1fr] md:gap-10",
        className,
      )}
    >
      <div className="font-display text-2xl text-brass">{label}</div>
      <div>
        <h3 className="font-display text-2xl md:text-3xl">
          {href ? (
            <Link
              href={href}
              className="transition hover:text-forest-700"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {children && (
          <div className="mt-4 max-w-2xl text-base leading-8 text-ink-muted">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
