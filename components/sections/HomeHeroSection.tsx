"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { StatBlock } from "@/components/ui/StatBlock";

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

  const contentParent = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.6,
        ease,
      },
    },
  };

  return (
    <section className="relative isolate overflow-hidden text-white">
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.75,
          ease,
        }}
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-forest-950/40 lg:hidden"
          aria-hidden
        />
      </motion.div>

      <div className="relative z-10 mx-auto grid min-h-[min(94vh,900px)] max-w-[1200px] px-6 md:px-10 lg:grid-cols-2 lg:gap-0">
        <div className="flex flex-col justify-center py-20 lg:py-28">
          <motion.div
            className="max-w-xl"
            variants={contentParent}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeIn}
              className="font-display text-display text-balance"
            >
              {title}
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="mt-7 max-w-lg text-pretty text-base leading-8 text-white/75 sm:text-[1.05rem]"
            >
              {subtitle}
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button href={primaryHref} variant="solid" tone="light">
                {primaryLabel}
              </Button>
              <Button href={secondaryHref} variant="outline" tone="light">
                {secondaryLabel}
              </Button>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-14">
              <StatBlock tone="light" />
            </motion.div>
          </motion.div>
        </div>

        <div className="hidden min-h-0 lg:block" aria-hidden />
      </div>
    </section>
  );
}
