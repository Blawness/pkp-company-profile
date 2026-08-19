"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Hairline separator. On scroll it draws itself from the left rather than
 * simply appearing, which is what makes a section feel deliberate.
 */
export function Rule({
  tone = "ink",
  accent = false,
  className,
}: {
  tone?: "ink" | "light";
  accent?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const line = tone === "light" ? "bg-white/20" : "bg-hairline";

  return (
    <div
      aria-hidden="true"
      className={cn("relative h-px w-full border-hairline", className)}
    >
      <motion.span
        className={cn("absolute inset-0 block origin-left", line)}
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease }}
      />
      {accent && (
        <motion.span
          className="absolute inset-y-0 left-0 block w-16 origin-left bg-brass"
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
        />
      )}
    </div>
  );
}
