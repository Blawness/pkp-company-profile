import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function HeroSection({
  imageUrl,
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  size = "lg",
  priority = false,
}: {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  size?: "sm" | "lg";
  priority?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-950 text-white">
      {imageUrl ? (
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={imageUrl}
            alt=""
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/90 to-forest-950/60" />
        </div>
      ) : null}

      <div
        className={
          size === "lg"
            ? "relative mx-auto max-w-[1200px] px-6 pb-20 pt-28 md:px-10 md:pb-28 md:pt-36"
            : "relative mx-auto max-w-[1200px] px-6 pb-16 pt-24 md:px-10 md:pb-20 md:pt-28"
        }
      >
        <h1 className="font-display text-display max-w-[16ch] text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-white/70">
            {subtitle}
          </p>
        )}
        {ctaHref && ctaLabel ? (
          <div className="mt-10">
            <Button href={ctaHref} variant="solid" tone="light">
              {ctaLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
