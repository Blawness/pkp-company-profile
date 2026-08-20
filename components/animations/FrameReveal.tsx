"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Media reveal: the image rises and settles back from a slight push-in.
 *
 * Deliberately transform-and-opacity only. An earlier version animated
 * `clip-path`, which most browsers do not composite — every frame repainted
 * the full-size image, which is what made the reveal stutter.
 */
export function FrameReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={{ willChange: "transform, opacity" }}
        initial={{ y: "8%", scale: 1.06, opacity: 0 }}
        whileInView={{ y: "0%", scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease }}
      >
        {children}
      </motion.div>
    </div>
  );
}
