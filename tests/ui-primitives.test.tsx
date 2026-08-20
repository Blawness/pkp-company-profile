import { expect, test, describe } from "bun:test";
import { render, screen } from "./test-utils";
import React from "react";
import { Section } from "@/components/ui/Section";
import { Rule } from "@/components/ui/Rule";
import { SectionHead } from "@/components/ui/SectionHead";

describe("Section", () => {
  test("defaults to the canvas tone", () => {
    const { container } = render(<Section>isi</Section>);
    const section = container.querySelector("section");
    expect(section?.className).toContain("bg-canvas");
    expect(screen.getByText("isi")).toBeInTheDocument();
  });

  test("forest tone paints the dark band and inverts text", () => {
    const { container } = render(<Section tone="forest">isi</Section>);
    const section = container.querySelector("section");
    expect(section?.className).toContain("bg-forest-950");
    expect(section?.className).toContain("text-white");
  });

  test("bleed removes the inner container width cap", () => {
    const { container } = render(<Section bleed>isi</Section>);
    expect(container.innerHTML).not.toContain("max-w-[1200px]");
  });

  test("non-bleed wraps children in the content container", () => {
    const { container } = render(<Section>isi</Section>);
    expect(container.innerHTML).toContain("max-w-[1200px]");
  });
});

describe("Rule", () => {
  test("renders a hairline separator", () => {
    const { container } = render(<Rule />);
    const rule = container.firstElementChild as HTMLElement;
    expect(rule.className).toContain("border-hairline");
    expect(rule.getAttribute("aria-hidden")).toBe("true");
  });

  test("accent adds the brass segment", () => {
    const { container } = render(<Rule accent />);
    expect(container.innerHTML).toContain("bg-brass");
  });
});

describe("SectionHead", () => {
  test("renders eyebrow, heading, and lead", () => {
    render(
      <SectionHead eyebrow="Layanan" title="Tiga Pilar" lead="Deskripsi." />,
    );
    expect(screen.getByText("Layanan")).toBeInTheDocument();
    expect(screen.getByText("Deskripsi.")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Tiga Pilar");
  });

  test("heading uses the serif display style", () => {
    render(<SectionHead title="Tiga Pilar" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.className).toContain("font-display");
  });

  test("omits eyebrow and lead when not provided", () => {
    const { container } = render(<SectionHead title="Judul" />);
    expect(container.querySelectorAll("p").length).toBe(0);
  });
});
