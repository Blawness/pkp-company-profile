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

/**
 * Regression guard for two separate ways this component went blank.
 *
 * First: Framer Motion propagates a parent's variant state down the tree; a
 * child holding only inline initial/animate objects cannot resolve an inherited
 * "visible" and stays parked at its initial offset, hidden behind the mask.
 *
 * Second, and the one that shipped: the scroll trigger sat on the word itself.
 * `whileInView` is an IntersectionObserver, and an observed element's
 * intersection rect is clipped by its ancestors' overflow — a word parked at
 * 130% inside `overflow-hidden` has zero visible area, so it could never report
 * itself in view and every h2 on the site stayed invisible forever. The trigger
 * therefore belongs on the unclipped heading, and the words follow by variant
 * propagation.
 *
 * The rendered DOM cannot show any of this (the test mock drops motion props),
 * so assert on the element tree the component returns.
 */
describe("MaskedText variant contract", () => {
  const wordSpans = (node: any): any[] => {
    if (!node || typeof node !== "object") return [];
    const kids = React.Children.toArray(node.props?.children ?? []);
    if (node.props?.["data-word"] !== undefined) {
      return kids.filter((k: any) => k?.props?.variants);
    }
    return kids.flatMap((k) => wordSpans(k));
  };

  test("each word animates via named variants, not inline objects", () => {
    const tree: any = MaskedText({ text: "Kepastian Hukum", as: "h1" });
    const spans = wordSpans(tree);

    expect(spans.length).toBe(2);
    expect(tree.props.initial).toBe("hidden");
    for (const span of spans) {
      expect(span.props.variants.hidden).toBeDefined();
      expect(span.props.variants.visible).toBeDefined();
    }
  });

  test("mount trigger animates without waiting on an intersection", () => {
    const tree: any = MaskedText({
      text: "Judul",
      as: "h1",
      trigger: "mount",
    });

    expect(tree.props.initial).toBe("hidden");
    expect(tree.props.animate).toBe("visible");
    expect(tree.props.whileInView).toBeUndefined();
  });

  test("view trigger waits for the element to scroll in", () => {
    const tree: any = MaskedText({ text: "Judul", as: "h2" });

    expect(tree.props.initial).toBe("hidden");
    expect(tree.props.whileInView).toBe("visible");
    expect(tree.props.animate).toBeUndefined();
  });

  test("the scroll trigger never sits on the clipped word", () => {
    // A word parked below its `overflow-hidden` mask has an empty intersection
    // rect, so an observer attached to it can never fire.
    const tree: any = MaskedText({ text: "Judul Panjang", as: "h2" });

    for (const span of wordSpans(tree)) {
      expect(span.props.whileInView).toBeUndefined();
      expect(span.props.animate).toBeUndefined();
      expect(span.props.viewport).toBeUndefined();
    }
  });
});

describe("MaskedText typography", () => {
  test("word gaps live outside the mask, not inside it", () => {
    // A trailing space inside an inline-block mask is stripped by CSS
    // white-space handling, so words collide unpredictably.
    const { container } = render(
      <MaskedText as="h2" text="Konsultasi Pertanahan" />,
    );
    const masks = [...container.querySelectorAll("[data-word]")];

    expect(masks.length).toBe(2);
    for (const mask of masks) {
      expect(mask.textContent).toBe(mask.textContent?.trim());
    }
  });

  test("the heading still reads as one spaced sentence", () => {
    render(<MaskedText as="h2" text="Konsultasi Pertanahan Tanah" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Konsultasi Pertanahan Tanah");
  });

  test("mask leaves room for descenders instead of shearing them", () => {
    const { container } = render(<MaskedText as="h2" text="Pengurusan" />);
    const mask = container.querySelector("[data-word]") as HTMLElement;
    // padding-bottom (with a matching negative margin) is what keeps the
    // tails of g/y/p inside the visible box.
    expect(mask.className).toContain("pb-[0.2em]");
    expect(mask.className).toContain("-mb-[0.2em]");
  });
});
