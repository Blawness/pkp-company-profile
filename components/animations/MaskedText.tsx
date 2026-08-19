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
 */
export function MaskedText({
  text,
  as = "h2",
  className,
  delay = 0,
}: {
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const Tag = as;
  const words = text.split(" ");

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

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
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.06,
              ease,
            }}
          >
            {word}
            {i < words.length - 1 ? "\u0020" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
