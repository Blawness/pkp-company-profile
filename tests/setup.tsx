/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
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

// Mock framer-motion. Each motion.<tag> renders that same HTML tag so the
// mock preserves semantics (a motion.h1 must still expose the heading role).
mock.module("framer-motion", () => {
  const strip = ({
    children,
    whileHover,
    whileTap,
    whileInView,
    initial,
    animate,
    exit,
    transition,
    variants,
    viewport,
    layout,
    layoutId,
    ...props
  }: any) => ({ children, props });

  const tag = (name: string) => {
    const Component = (allProps: any) => {
      const { children, props } = strip(allProps);
      return React.createElement(name, props, children);
    };
    Component.displayName = `motion.${name}`;
    return Component;
  };

  const motion = new Proxy({} as Record<string, unknown>, {
    get: (target, name: string) => {
      if (!target[name]) target[name] = tag(name);
      return target[name];
    },
  });

  return {
    motion,
    AnimatePresence: ({ children }: any) => children,
    useReducedMotion: () => true,
    // Scroll-linked values: the test DOM never scrolls, so these stand in
    // with inert values rather than pretending to animate.
    useScroll: () => ({
      scrollY: { get: () => 0, on: () => () => {} },
      scrollYProgress: { get: () => 0, on: () => () => {} },
    }),
    useTransform: () => 0,
    useMotionValueEvent: () => {},
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
