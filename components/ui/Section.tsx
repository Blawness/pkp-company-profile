import { cn } from "@/lib/cn";

export type Tone = "canvas" | "forest" | "paper";

const toneClass: Record<Tone, string> = {
  canvas: "bg-canvas text-ink",
  paper: "bg-paper text-ink",
  forest: "bg-forest-950 text-white",
};

export function Section({
  tone = "canvas",
  bleed = false,
  className,
  id,
  children,
}: {
  tone?: Tone;
  bleed?: boolean;
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("py-24 md:py-32", toneClass[tone], className)}
    >
      {bleed ? (
        children
      ) : (
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          {children}
        </div>
      )}
    </section>
  );
}
