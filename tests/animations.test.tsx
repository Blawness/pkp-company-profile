/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, test, describe, mock } from "bun:test";
import React from "react";

// The shared setup mock reports reduced motion, which short-circuits both
// components. Override it here so the animated path is the one under test.
mock.module("framer-motion", () => {
  const tag = (name: string) => {
    const Component = ({
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
      ...props
    }: any) => React.createElement(name, props, children);
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
    useReducedMotion: () => false,
  };
});

import { render, screen } from "./test-utils";
import { Reveal } from "@/components/animations/Reveal";
import { MaskedText } from "@/components/animations/MaskedText";

describe("Reveal", () => {
  test("always renders its children", () => {
    render(
      <Reveal>
        <p>isi penting</p>
      </Reveal>,
    );
    expect(screen.getByText("isi penting")).toBeInTheDocument();
  });
});

describe("MaskedText", () => {
  test("renders the full text as one accessible string", () => {
    render(<MaskedText as="h1" text="Kepastian Hukum Atas Tanah" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Kepastian Hukum Atas Tanah");
  });

  test("splits into per-word masks for the stagger", () => {
    const { container } = render(<MaskedText as="h2" text="Tiga Pilar" />);
    expect(container.querySelectorAll("[data-word]").length).toBe(2);
  });

  test("keeps the heading class on the element itself", () => {
    render(<MaskedText as="h2" text="Judul" className="font-display" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.className).toContain("font-display");
  });
});
