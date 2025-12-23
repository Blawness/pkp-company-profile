"use client";

import * as React from "react";
import type { OrgNode } from "@/lib/data/organization";
import { motion } from "framer-motion";

function NodeCard({ node }: { node: OrgNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm dark:border-white/10 dark:bg-zinc-950"
    >
      <div className="font-semibold text-zinc-900 dark:text-zinc-100">
        {node.title}
      </div>
      {node.name ? (
        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{node.name}</div>
      ) : null}
    </motion.div>
  );
}

function renderTree(node: OrgNode) {
  return (
    <div className="grid gap-4">
      <NodeCard node={node} />
      {node.children?.length ? (
        <div className="grid gap-4 pl-4 md:pl-6">
          {node.children.map((c) => (
            <div key={c.title} className="grid gap-3">
              {renderTree(c)}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function OrganizationChart({ data }: { data: OrgNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-zinc-50 p-6 dark:border-white/10 dark:bg-zinc-950/40">
      {renderTree(data)}
      <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
        Struktur organisasi dapat disesuaikan sesuai dokumen resmi perusahaan.
      </div>
    </div>
  );
}


