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
      // 128px top and bottom stacked to 256px between adjacent section
      // contents — on the shorter bands that was more padding than content.
      className={cn("py-20 md:py-24", toneClass[tone], className)}
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
