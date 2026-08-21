import { expect, test, describe } from "bun:test";
import { render, screen } from "./test-utils";
import React from "react";
import { Button } from "@/components/ui/Button";
import { StatBlock } from "@/components/ui/StatBlock";
import { IndexedItem } from "@/components/ui/IndexedItem";

describe("Button", () => {
  test("renders a link with the given href", () => {
    render(<Button href="/kontak">Hubungi</Button>);
    const link = screen.getByRole("link", { name: "Hubungi" });
    expect(link.getAttribute("href")).toBe("/kontak");
  });

  test("solid variant is a pill, never a shadowed box", () => {
    render(<Button href="/kontak">Hubungi</Button>);
    const link = screen.getByRole("link", { name: "Hubungi" });
    expect(link.className).toContain("rounded-full");
    expect(link.className).not.toContain("shadow");
  });

  test("link variant renders without a filled background", () => {
    render(
      <Button href="/layanan" variant="link">
        Lihat
      </Button>,
    );
    const link = screen.getByRole("link", { name: /Lihat/ });
    expect(link.className).not.toContain("rounded-full");
  });
});

describe("StatBlock", () => {
  test("renders nothing when credentials are not yet confirmed", () => {
    const { container } = render(<StatBlock />);
    expect(container.innerHTML).toBe("");
  });

  test("renders nothing for an empty item list", () => {
    const { container } = render(<StatBlock items={[]} />);
    expect(container.innerHTML).toBe("");
  });

  test("renders values and labels when items are supplied", () => {
    render(
      <StatBlock
        items={[
          { value: "500+", label: "Bidang tanah" },
          { value: "2015", label: "Berdiri" },
        ]}
      />,
    );
    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(screen.getByText("Bidang tanah")).toBeInTheDocument();
    expect(screen.getByText("2015")).toBeInTheDocument();
  });
});

describe("IndexedItem", () => {
  test("pads the index to two digits", () => {
    render(<IndexedItem index={1} title="Konsultasi" />);
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  test("renders title as a heading and links when href is given", () => {
    render(
      <IndexedItem index={3} title="Pengukuran" href="/layanan#ukur">
        Deskripsi layanan.
      </IndexedItem>,
    );
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText("Deskripsi layanan.")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.textContent).toContain("Pengukuran");
    expect(screen.getByRole("link").getAttribute("href")).toBe("/layanan#ukur");
  });
});
