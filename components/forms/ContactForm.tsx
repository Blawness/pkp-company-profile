"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("Contact.form");
  const tButtons = useTranslations("Common.buttons");

  const ContactSchema = z.object({
    name: z.string().min(2, t("validation.nameMin")),
    email: z.string().email(t("validation.emailInvalid")),
    message: z.string().min(10, t("validation.messageMin")),
  });

  type ContactValues = z.infer<typeof ContactSchema>;

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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
      <div>
        <label
          htmlFor="contact-name"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted"
        >
          {t("name")}
        </label>
        <input
          id="contact-name"
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={nameErrorId}
          className={cn(
            "mt-3 w-full border-0 border-b border-hairline bg-transparent pb-3 text-base text-ink outline-none transition",
            "placeholder:text-ink-muted/60 focus:border-forest-700",
          )}
          placeholder={t("namePlaceholder")}
          {...register("name")}
        />
        {errors.name ? (
          <div id={nameErrorId} className="mt-2 text-sm text-brass">
            {errors.name.message}
          </div>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted"
        >
          {t("email")}
        </label>
        <input
          id="contact-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={emailErrorId}
          className={cn(
            "mt-3 w-full border-0 border-b border-hairline bg-transparent pb-3 text-base text-ink outline-none transition",
            "placeholder:text-ink-muted/60 focus:border-forest-700",
          )}
          placeholder={t("emailPlaceholder")}
          {...register("email")}
        />
        {errors.email ? (
          <div id={emailErrorId} className="mt-2 text-sm text-brass">
            {errors.email.message}
          </div>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted"
        >
          {t("message")}
        </label>
        <textarea
          id="contact-message"
          autoComplete="off"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={messageErrorId}
          rows={6}
          className={cn(
            "mt-3 w-full border-0 border-b border-hairline bg-transparent pb-3 text-base text-ink outline-none transition",
            "placeholder:text-ink-muted/60 focus:border-forest-700",
          )}
          placeholder={t("messagePlaceholder")}
          {...register("message")}
        />
        {errors.message ? (
          <div id={messageErrorId} className="mt-2 text-sm text-brass">
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
            "inline-flex min-h-11 items-center justify-center rounded-full px-8 text-sm font-semibold text-white transition",
            "bg-forest-950 hover:bg-forest-900 disabled:opacity-50 disabled:hover:bg-forest-950",
          )}
          type="submit"
        >
          {isSubmitting ? tButtons("sending") : tButtons("send")}
        </motion.button>
      </div>

      <div aria-live="polite">
        {status === "missing" ? (
          <div className="text-sm text-ink-muted">{t("missing")}</div>
        ) : null}
        {status === "success" ? (
          <div className="text-sm text-forest-700">{t("success")}</div>
        ) : null}
        {status === "error" ? (
          <div className="text-sm text-brass" role="alert">
            {t("error")}
          </div>
        ) : null}
      </div>
    </form>
  );
}
