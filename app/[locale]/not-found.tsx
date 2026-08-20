import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const tButtons = useTranslations("Common.buttons");

  return (
    <main>
      <Section tone="forest" className="min-h-[70vh] content-center">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
          404
        </div>
        <h1 className="font-display text-display mt-6 max-w-3xl text-balance">
          {t("title")}
        </h1>
        <p className="mt-7 max-w-xl text-pretty text-base leading-8 text-white/70">
          {t("description")}
        </p>
        <div className="mt-10">
          <Button href="/" variant="solid" tone="light">
            {tButtons("backToHome")}
          </Button>
        </div>
      </Section>
    </main>
  );
}
