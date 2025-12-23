"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection({
  imageUrl,
  title,
  subtitle,
  ctaHref,
  ctaLabel,
}: {
  imageUrl?: string;
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        {/* background */}
        <div
          className="h-full w-full bg-center bg-cover"
          style={{
            backgroundImage: imageUrl
              ? `url(${imageUrl})`
              : "linear-gradient(135deg, #1a4d3a, #0d9488)",
          }}
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-pretty text-sm leading-7 text-white/80 md:text-base">
            {subtitle}
          </p>

          <div className="mt-8 flex justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-full bg-pkp-teal-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-pkp-teal-700"
              >
                {ctaLabel}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


