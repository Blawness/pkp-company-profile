"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { MainService } from "@/lib/data/services";
import { ArrowRight } from "lucide-react";

export function ServiceCard({ service }: { service: MainService }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950"
    >
      <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {service.title}
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {service.description}
      </p>

      <div className="mt-5">
        <Link
          href={`/layanan#${service.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-pkp-teal-700 hover:text-pkp-teal-600 dark:text-pkp-teal-600 dark:hover:text-pkp-teal-600/90"
        >
          Lihat detail <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}


