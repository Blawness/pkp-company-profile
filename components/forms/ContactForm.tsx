"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

const ContactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

type ContactValues = z.infer<typeof ContactSchema>;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContactForm() {
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  const action = formspreeId ? `https://formspree.io/f/${formspreeId}` : "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const [status, setStatus] = React.useState<
    "idle" | "success" | "error" | "missing"
  >(action ? "idle" : "missing");

  async function onSubmit(values: ContactValues) {
    if (!action) {
      setStatus("missing");
      return;
    }

    try {
      setStatus("idle");
      const res = await fetch(action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  const nameErrorId = errors.name ? "contact-name-error" : undefined;
  const emailErrorId = errors.email ? "contact-email-error" : undefined;
  const messageErrorId = errors.message ? "contact-message-error" : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-1">
        <label
          htmlFor="contact-name"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Nama
        </label>
        <input
          id="contact-name"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={nameErrorId}
          className={cn(
            "h-11 rounded-xl border bg-white px-3 text-sm outline-none transition",
            "border-black/10 focus:ring-2 focus:ring-pkp-teal-600/30 dark:bg-zinc-950 dark:border-white/10",
          )}
          placeholder="Nama Anda"
          {...register("name")}
        />
        {errors.name ? (
          <div id={nameErrorId} className="text-xs text-red-600">
            {errors.name.message}
          </div>
        ) : null}
      </div>

      <div className="grid gap-1">
        <label
          htmlFor="contact-email"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={emailErrorId}
          className={cn(
            "h-11 rounded-xl border bg-white px-3 text-sm outline-none transition",
            "border-black/10 focus:ring-2 focus:ring-pkp-teal-600/30 dark:bg-zinc-950 dark:border-white/10",
          )}
          placeholder="nama@email.com"
          {...register("email")}
        />
        {errors.email ? (
          <div id={emailErrorId} className="text-xs text-red-600">
            {errors.email.message}
          </div>
        ) : null}
      </div>

      <div className="grid gap-1">
        <label
          htmlFor="contact-message"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Pesan
        </label>
        <textarea
          id="contact-message"
          autoComplete="off"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={messageErrorId}
          rows={6}
          className={cn(
            "rounded-xl border bg-white px-3 py-3 text-sm outline-none transition",
            "border-black/10 focus:ring-2 focus:ring-pkp-teal-600/30 dark:bg-zinc-950 dark:border-white/10",
          )}
          placeholder="Jelaskan kebutuhan Anda..."
          {...register("message")}
        />
        {errors.message ? (
          <div id={messageErrorId} className="text-xs text-red-600">
            {errors.message.message}
          </div>
        ) : null}
      </div>

      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting || status === "missing"}
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition",
            "bg-pkp-teal-600 hover:bg-pkp-teal-700 disabled:opacity-50 disabled:hover:bg-pkp-teal-600",
          )}
          type="submit"
        >
          {isSubmitting ? "Mengirim..." : "Kirim"}
        </motion.button>
      </div>

      <div aria-live="polite">
        {status === "missing" ? (
          <div className="text-xs text-zinc-500">
            Form belum aktif: set `NEXT_PUBLIC_FORMSPREE_ID` di `.env.local`.
          </div>
        ) : null}
        {status === "success" ? (
          <div className="text-xs text-emerald-600">
            Pesan terkirim. Terima kasih!
          </div>
        ) : null}
        {status === "error" ? (
          <div className="text-xs text-red-600" role="alert">
            Gagal mengirim pesan. Coba lagi beberapa saat.
          </div>
        ) : null}
      </div>
    </form>
  );
}
