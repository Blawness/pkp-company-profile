"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

type Tag = "h1" | "h2" | "h3" | "div";

/**
 * Headline that rises word by word from behind a mask.
 *
 * The words are separate spans, so the text stays one continuous string for
 * assistive tech and for copy/paste. With reduced motion the words render
 * plainly — no masks, no transforms.
 *
 * Each word uses *named* variants rather than inline initial/animate objects.
 * Framer Motion propagates a parent's variant state down the React tree, and a
 * child that only has inline objects cannot resolve an inherited "visible" —
 * it would stay parked at its initial offset, invisible behind the mask.
 *
 * `trigger="mount"` is for headlines above the fold, where waiting on an
 * intersection is pointless; "view" is the default for everything below.
 */
export function MaskedText({
  text,
  as = "h2",
  className,
  delay = 0,
  trigger = "view",
}: {
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
  trigger?: "view" | "mount";
}) {
  const reduceMotion = useReducedMotion();
  const Tag = as;
  const words = text.split(" ");

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const motionState =
    trigger === "mount"
      ? { animate: "visible" as const }
      : {
          whileInView: "visible" as const,
          viewport: { once: true, margin: "-60px" },
        };

  return (
    <Tag className={cn("[text-wrap:balance]", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          data-word
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%" },
              visible: {
                y: 0,
                transition: { duration: 0.9, delay: delay + i * 0.06, ease },
              },
            }}
            initial="hidden"
            {...motionState}
          >
            {word}
            {i < words.length - 1 ? "\u0020" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
