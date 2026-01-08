import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationSchema, buildProfessionalServiceSchema } from "@/lib/seo/schema";
import { company } from "@/lib/data/company";
import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pkp-company-profile.vercel.app";

interface BaseLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export async function BaseLayout({ children, locale }: BaseLayoutProps) {
  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();
  const tCompany = await getTranslations("Company");

  const schemaData = {
    name: tCompany("name"),
    description: tCompany("description"),
    email: company.contact.email,
    phone: company.contact.phone,
    address: company.contact.address,
    mapsUrl: company.contact.mapsUrl,
  };

  const schemas = [
    buildOrganizationSchema(siteUrl, schemaData),
    buildProfessionalServiceSchema(siteUrl, schemaData),
  ];

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider>
        <div className="min-h-dvh bg-white text-zinc-900 dark:bg-black dark:text-zinc-100">
          <JsonLd data={schemas} />
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
