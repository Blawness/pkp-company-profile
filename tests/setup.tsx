/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

import "@testing-library/jest-dom";
import { mock, afterEach } from "bun:test";
import React from "react";

// Pre-load RTL so it can register its own cleanup hooks correctly
const rtl = require("@testing-library/react");

afterEach(() => {
  rtl.cleanup();
});

// Mock next-intl
mock.module("next-intl", () => ({
  useLocale: () => "id",
  useTranslations: (namespace: string) => (key: string) =>
    `${namespace}.${key}`,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

// Mock next-themes
mock.module("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: () => {},
    resolvedTheme: "dark",
  }),
}));

// Mock framer-motion
mock.module("framer-motion", () => {
  const Div = ({ children, whileHover, whileTap, ...props }: any) => {
    return <div {...props}>{children}</div>;
  };
  const Button = ({ children, whileHover, whileTap, ...props }: any) => {
    return <button {...props}>{children}</button>;
  };
  return {
    motion: {
      div: Div,
      button: Button,
      section: Div,
      span: Div,
      nav: Div,
      p: Div,
      h1: Div,
      h2: Div,
      h3: Div,
    },
    AnimatePresence: ({ children }: any) => children,
  };
});

// Mock routing
mock.module("@/i18n/routing", () => ({
  useRouter: () => ({
    replace: () => {},
    push: () => {},
  }),
  usePathname: () => "/",
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  redirect: () => {},
  getPathname: () => "/",
  routing: {
    locales: ["id", "en"],
    defaultLocale: "id",
  },
}));
