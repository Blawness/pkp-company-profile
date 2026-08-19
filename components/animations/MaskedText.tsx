"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type Tag = "h1" | "h2" | "h3" | "div";

/**
 * Headline whose words rise from behind a mask.
 *
 * Two details carry the typography, and both were wrong the first time:
 *
 * - The gap between words is a real text node *between* the masks. Put inside
 *   an inline-block, a trailing space is stripped by CSS white-space handling
 *   and whatever survives gets clipped, so word gaps collapse at random.
 * - The mask carries `pb-[0.2em]` with a matching `-mb-[0.2em]`. Without that
 *   slack the box is shorter than the face's descenders and shears the tails
 *   off g, y, p and j. The negative margin keeps the baseline where it was.
 *
 * The resting word must therefore start further down than 100% — 130% clears
 * the padded box so no ascender peeks through before the animation runs.
 *
 * Each word uses *named* variants rather than inline initial/animate objects.
 * Framer Motion propagates a parent's variant state down the React tree, and a
 * child that only has inline objects cannot resolve an inherited "visible" —
 * it would stay parked below the mask, invisible.
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
    <Tag className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {i > 0 ? " " : null}
          <span
            data-word
            className="inline-block overflow-hidden pb-[0.2em] -mb-[0.2em] align-bottom"
          >
            <motion.span
              className="inline-block"
              style={{ willChange: "transform" }}
              variants={{
                hidden: { y: "130%" },
                visible: {
                  y: 0,
                  transition: { duration: 0.6, delay: delay + i * 0.045, ease },
                },
              }}
              initial="hidden"
              {...motionState}
            >
              {word}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
