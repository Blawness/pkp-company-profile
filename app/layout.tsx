import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/animations/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PT Presisi Konsulindo Prima",
    template: "%s | PT Presisi Konsulindo Prima",
  },
  description: "Konsultasi hukum pertanahan & pengurusan sertifikat tanah",
  openGraph: {
    type: "website",
    siteName: "PT Presisi Konsulindo Prima",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="min-h-dvh bg-white text-zinc-900 dark:bg-black dark:text-zinc-100">
            <Header />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
