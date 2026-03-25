"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";

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
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/92 via-zinc-950/55 to-zinc-950/12 dark:from-black/88 dark:via-black/48 dark:to-black/12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/55 via-transparent to-zinc-950/30 lg:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 15% 35%, rgba(13,148,136,0.1), transparent 55%)",
          }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto grid min-h-[min(92vh,880px)] max-w-7xl lg:grid-cols-2 lg:gap-0">
        <div className="flex flex-col justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            className="max-w-xl"
            variants={contentParent}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeIn}
              className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.06]"
            >
              {title}
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-zinc-300 sm:text-[1.05rem]"
            >
              {subtitle}
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={primaryHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-pkp-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-pkp-teal-700"
                >
                  {primaryLabel}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={secondaryHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.1]"
                >
                  {secondaryLabel}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <div className="hidden min-h-0 lg:block" aria-hidden />
      </div>
    </section>
  );
}
