import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildOrganizationSchema,
  buildProfessionalServiceSchema,
} from "@/lib/seo/schema";
import { company } from "@/lib/data/company";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pkp-company-profile.vercel.app";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Common" });
  const tHome = await getTranslations({ locale, namespace: "Home" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: tHome("description"),
    openGraph: {
      type: "website",
      siteName: t("title"),
      locale: locale === "id" ? "id_ID" : "en_US",
      url: siteUrl,
      title: t("title"),
      description: tHome("description"),
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

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
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd data={schemas} />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="min-h-dvh bg-white text-zinc-900 dark:bg-black dark:text-zinc-100">
              <Header />
              <PageTransition>{children}</PageTransition>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
