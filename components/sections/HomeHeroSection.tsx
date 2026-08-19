"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { StatBlock } from "@/components/ui/StatBlock";
import { MaskedText } from "@/components/animations/MaskedText";

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeHeroSection({
  imageUrl,
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  priority = false,
}: {
  imageUrl: string;
  title: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  priority?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Background drifts slower than the page, so the hero feels like a fixed
  // plate the content slides over rather than a picture that scrolls away.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const fadeIn = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.9, ease },
    },
  };

  const parent = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.14,
        delayChildren: reduceMotion ? 0 : 0.45,
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-forest-950 text-white"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduceMotion ? undefined : { y: bgY }}
      >
        {/* Slow push-in: the frame keeps moving long after the page settles. */}
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 18, ease: "linear" }}
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-forest-950/50"
          aria-hidden
        />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto grid min-h-[min(96vh,940px)] max-w-[1200px] px-6 md:px-10 lg:grid-cols-12 lg:gap-0"
        style={
          reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }
        }
      >
        <div className="flex flex-col justify-center py-24 lg:col-span-8 lg:py-32">
          <motion.div variants={parent} initial="hidden" animate="visible">
            <motion.div
              variants={fadeIn}
              className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-brass"
            >
              <span aria-hidden className="block h-px w-12 bg-brass" />
              PT Presisi Konsulindo Prima
            </motion.div>

            <MaskedText
              as="h1"
              text={title}
              delay={0.5}
              className="font-display text-display mt-8"
            />

            <motion.p
              variants={fadeIn}
              className="mt-8 max-w-xl text-pretty text-base leading-8 text-white/75 sm:text-[1.05rem]"
            >
              {subtitle}
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <Button href={primaryHref} variant="solid" tone="light">
                {primaryLabel}
              </Button>
              <Button href={secondaryHref} variant="outline" tone="light">
                {secondaryLabel}
              </Button>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-16">
              <StatBlock tone="light" />
            </motion.div>
          </motion.div>
        </div>

        <div className="hidden lg:col-span-4 lg:block" aria-hidden />
      </motion.div>

      {/* Scroll cue: a hairline that keeps drawing itself downward. */}
      {!reduceMotion && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-6 z-10 hidden h-24 w-px overflow-hidden bg-white/15 md:left-10 md:block"
        >
          <motion.span
            className="block h-1/2 w-px bg-brass"
            initial={{ y: "-100%" }}
            animate={{ y: "200%" }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.6,
            }}
          />
        </div>
      )}
    </section>
  );
}
