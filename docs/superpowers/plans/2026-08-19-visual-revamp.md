# Revamp Visual Situs Publik PKP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengganti tampilan seluruh halaman publik dengan bahasa visual "Institutional Gravitas" — hijau tua sebagai kanvas dominan, heading serif berskala besar, hairline 1px menggantikan shadow — lewat satu set primitif komponen.

**Architecture:** Token-first. Token semantik baru ditulis di `app/globals.css` (`@theme`), enam primitif presentational dibangun di `components/ui/`, lalu setiap halaman publik ditulis ulang memakai primitif itu. Dark mode dilepas dari situs publik; token `.dark` dan `--color-pkp-*` tetap ada karena area admin (`@blawness/admin-kit`) memakai stylesheet yang sama.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (`@theme` inline, tanpa file config), next-intl v4, framer-motion, Radix UI, bun test + happy-dom + Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-19-visual-revamp-design.md`

## Global Constraints

- Revamp ini **murni presentational**. Jangan ubah `app/(admin)/**`, `app/api/**`, `db/**`, `lib/api/**`, `middleware.ts`, `i18n/**`.
- `tests/seo.test.ts`, `tests/data.test.ts`, `tests/lib-security.test.ts`, `tests/api-ai-security.test.ts` harus lulus **tanpa dimodifikasi**. Kalau salah satunya gagal, itu regresi — perbaiki kodenya, bukan tesnya.
- Token lama di `app/globals.css` yang **wajib dipertahankan**: seluruh blok `.dark { ... }`, `--color-navy`, `--color-brand`, `--color-gold`, dan semua `--color-pkp-*`. Area admin merender dengan token itu.
- Palet baru (nilai persis, jangan diubah): `--color-forest-950: #0B2A1E`, `--color-forest-900: #123A2A`, `--color-forest-700: #1A5C42`, `--color-canvas: #FBFAF7`, `--color-paper: #FFFFFF`, `--color-ink: #111812`, `--color-ink-muted: #5A6560`, `--color-brass: #A8792C`, `--color-hairline: rgba(17,24,18,0.12)`.
- Aturan bentuk: tanpa `shadow-*` di komponen publik; radius hanya `rounded-none`/`rounded-sm`, kecuali tombol CTA yang memakai `rounded-full`; pemisah memakai border 1px `border-hairline`; padding section `py-24 md:py-32`; container konten `max-w-[1200px]`.
- Heading memakai `font-serif` (Instrument Serif), body memakai Geist Sans. Eyebrow: 12px, `uppercase`, `tracking-[0.18em]`.
- Setiap key i18n baru **wajib** ditambahkan ke `messages/id.json` DAN `messages/en.json` dalam commit yang sama.
- Tidak boleh ada angka statistik atau klaim kredensial hardcoded di markup. Semuanya lewat `lib/data/credentials.ts`, dan tidak dirender selama `credentials.enabled === false`.
- Perintah verifikasi: `bun test`, `bun run typecheck`, `bun run lint`, `bun run build`.
- Setelah setiap task: commit. Pesan commit bahasa Inggris, format Conventional Commits.

---

### Task 1: Fondasi — token, font serif, data kredensial, penjaga i18n

**Files:**
- Modify: `app/globals.css`
- Modify: `app/[locale]/layout.tsx`
- Create: `lib/data/credentials.ts`
- Test: `tests/credentials.test.ts`
- Test: `tests/i18n-parity.test.ts`

**Interfaces:**
- Consumes: tidak ada (task pertama).
- Produces:
  - `credentials` dari `@/lib/data/credentials` bertipe `Credentials`:
    ```ts
    export type StatItem = { value: string; label: string };
    export type LegalEntity = { label: string; value: string };
    export type Credentials = {
      enabled: boolean;
      foundedYear: number | null;
      legalEntities: LegalEntity[];
      stats: StatItem[];
    };
    ```
  - Kelas warna Tailwind: `bg-forest-950`, `bg-forest-900`, `text-forest-700`, `bg-canvas`, `bg-paper`, `text-ink`, `text-ink-muted`, `text-brass`, `border-hairline`.
  - Utility font: `font-serif` (variabel CSS `--font-instrument-serif`).

- [ ] **Step 1: Tulis tes yang gagal untuk data kredensial**

Buat `tests/credentials.test.ts`:

```ts
import { expect, test, describe } from "bun:test";
import { credentials } from "@/lib/data/credentials";

describe("credentials", () => {
  test("disabled by default so no unverified numbers ship", () => {
    expect(credentials.enabled).toBe(false);
  });

  test("has empty placeholders while legal has not confirmed", () => {
    expect(credentials.foundedYear).toBeNull();
    expect(credentials.stats).toEqual([]);
    expect(credentials.legalEntities).toEqual([]);
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `bun test tests/credentials.test.ts`
Expected: FAIL — `Cannot find module '@/lib/data/credentials'`

- [ ] **Step 3: Buat file kredensial**

Buat `lib/data/credentials.ts`:

```ts
export type StatItem = { value: string; label: string };
export type LegalEntity = { label: string; value: string };

export type Credentials = {
  /** Set ke true hanya setelah tim legal mengonfirmasi angka di bawah. */
  enabled: boolean;
  foundedYear: number | null;
  legalEntities: LegalEntity[];
  stats: StatItem[];
};

export const credentials: Credentials = {
  enabled: false,
  foundedYear: null,
  legalEntities: [],
  stats: [],
};
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `bun test tests/credentials.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Tulis tes paritas key i18n**

Buat `tests/i18n-parity.test.ts`:

```ts
import { expect, test, describe } from "bun:test";
import id from "@/messages/id.json";
import en from "@/messages/en.json";

function flatten(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  if (Array.isArray(obj)) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flatten(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("i18n message parity", () => {
  test("id and en expose the exact same key set", () => {
    const idKeys = flatten(id).sort();
    const enKeys = flatten(en).sort();
    const missingInEn = idKeys.filter((k) => !enKeys.includes(k));
    const missingInId = enKeys.filter((k) => !idKeys.includes(k));

    expect(missingInEn).toEqual([]);
    expect(missingInId).toEqual([]);
  });
});
```

- [ ] **Step 6: Jalankan tes paritas**

Run: `bun test tests/i18n-parity.test.ts`
Expected: PASS. Kalau FAIL, itu ketimpangan key yang sudah ada sebelumnya — perbaiki `messages/en.json` atau `messages/id.json` sampai set key-nya identik, lalu jalankan lagi.

- [ ] **Step 7: Tambahkan token baru ke `app/globals.css`**

Di dalam blok `@theme inline { ... }` yang sudah ada, **tambahkan** (jangan hapus token `--color-navy`, `--color-brand`, `--color-gold`, `--color-pkp-*` yang sudah ada):

```css
  /* Institutional Gravitas — palet situs publik */
  --color-forest-950: #0b2a1e;
  --color-forest-900: #123a2a;
  --color-forest-700: #1a5c42;
  --color-canvas: #fbfaf7;
  --color-paper: #ffffff;
  --color-ink: #111812;
  --color-ink-muted: #5a6560;
  --color-brass: #a8792c;
  --color-hairline: rgba(17, 24, 18, 0.12);

  --font-serif: var(--font-instrument-serif), Georgia, serif;
```

Lalu di bawah blok `body { ... }` yang sudah ada, tambahkan:

```css
.font-display {
  font-family: var(--font-serif);
  font-weight: 400;
  letter-spacing: -0.02em;
}

.text-display {
  font-size: clamp(2.75rem, 6vw, 4.75rem);
  line-height: 1.04;
}

.text-h2 {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  line-height: 1.12;
}
```

- [ ] **Step 8: Muat font serif di layout**

Di `app/[locale]/layout.tsx`, ubah baris import font:

```ts
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
```

Tambahkan setelah deklarasi `geistMono`:

```ts
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});
```

Lalu pada `<body>`, ubah `className` menjadi:

```tsx
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
```

- [ ] **Step 9: Verifikasi build dan tes**

Run: `bun run typecheck && bun test && bun run build`
Expected: typecheck bersih, semua tes lulus, build sukses. Font Instrument Serif terunduh saat build — kalau jaringan memblokirnya, laporkan; jangan ganti ke `<link>` eksternal.

- [ ] **Step 10: Commit**

```bash
git add app/globals.css "app/[locale]/layout.tsx" lib/data/credentials.ts tests/credentials.test.ts tests/i18n-parity.test.ts messages
git commit -m "feat(design): add institutional palette tokens, serif display font, credentials config"
```

---

### Task 2: Primitif tata letak — `Section`, `Rule`, `SectionHead`

**Files:**
- Create: `components/ui/Section.tsx`
- Create: `components/ui/Rule.tsx`
- Create: `components/ui/SectionHead.tsx`
- Test: `tests/ui-primitives.test.tsx`

**Interfaces:**
- Consumes: token warna dari Task 1; `cn` dari `@/lib/cn` (signature: `cn(...classes: Array<string | false | null | undefined>): string`).
- Produces:
  ```ts
  type Tone = "canvas" | "forest" | "paper";
  function Section(props: { tone?: Tone; bleed?: boolean; className?: string; id?: string; children: React.ReactNode }): JSX.Element;
  function Rule(props: { tone?: "ink" | "light"; accent?: boolean; className?: string }): JSX.Element;
  function SectionHead(props: { eyebrow?: string; title: string; lead?: string; align?: "left" | "center"; className?: string }): JSX.Element;
  ```
  `SectionHead` merender `title` sebagai `<h2>`.

- [ ] **Step 1: Tulis tes yang gagal**

Buat `tests/ui-primitives.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `bun test tests/ui-primitives.test.tsx`
Expected: FAIL — modul `@/components/ui/Section` tidak ditemukan.

- [ ] **Step 3: Implementasi `Section`**

Buat `components/ui/Section.tsx`:

```tsx
import { cn } from "@/lib/cn";

export type Tone = "canvas" | "forest" | "paper";

const toneClass: Record<Tone, string> = {
  canvas: "bg-canvas text-ink",
  paper: "bg-paper text-ink",
  forest: "bg-forest-950 text-white",
};

export function Section({
  tone = "canvas",
  bleed = false,
  className,
  id,
  children,
}: {
  tone?: Tone;
  bleed?: boolean;
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("py-24 md:py-32", toneClass[tone], className)}
    >
      {bleed ? (
        children
      ) : (
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          {children}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Implementasi `Rule`**

Buat `components/ui/Rule.tsx`:

```tsx
import { cn } from "@/lib/cn";

export function Rule({
  tone = "ink",
  accent = false,
  className,
}: {
  tone?: "ink" | "light";
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative border-t",
        tone === "light" ? "border-white/20" : "border-hairline",
        className,
      )}
    >
      {accent && (
        <span className="absolute -top-px left-0 block h-px w-16 bg-brass" />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Implementasi `SectionHead`**

Buat `components/ui/SectionHead.tsx`:

```tsx
import { cn } from "@/lib/cn";
import { Rule } from "@/components/ui/Rule";

export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
          {eyebrow}
        </div>
      )}
      <Rule className={cn("mt-4", align === "center" && "mx-auto w-24")} />
      <h2 className="font-display text-h2 mt-6 text-balance">{title}</h2>
      {lead && (
        <p className="mt-5 text-pretty text-base leading-8 opacity-80">
          {lead}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Jalankan tes, pastikan lulus**

Run: `bun test tests/ui-primitives.test.tsx`
Expected: PASS (9 tests)

- [ ] **Step 7: Commit**

```bash
git add components/ui/Section.tsx components/ui/Rule.tsx components/ui/SectionHead.tsx tests/ui-primitives.test.tsx
git commit -m "feat(ui): add Section, Rule, and SectionHead layout primitives"
```

---

### Task 3: Primitif konten — `Button`, `StatBlock`, `IndexedItem`

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/StatBlock.tsx`
- Create: `components/ui/IndexedItem.tsx`
- Test: `tests/ui-content-primitives.test.tsx`

**Interfaces:**
- Consumes: `Rule` dari Task 2; `credentials` dari Task 1; `Link` dari `@/i18n/routing` (di test sudah di-mock jadi `<a href>`).
- Produces:
  ```ts
  function Button(props: {
    href: string;
    variant?: "solid" | "outline" | "link";
    tone?: "forest" | "light";
    className?: string;
    children: React.ReactNode;
  }): JSX.Element; // merender <Link> dari @/i18n/routing

  function StatBlock(props: { items?: StatItem[]; tone?: "forest" | "light"; className?: string }): JSX.Element | null;
  // items default: credentials.stats. Mengembalikan null saat credentials.enabled === false ATAU items kosong.

  function IndexedItem(props: { index: number; title: string; href?: string; className?: string; children?: React.ReactNode }): JSX.Element;
  // index dirender dua digit dengan padding nol: 1 -> "01"
  ```

- [ ] **Step 1: Tulis tes yang gagal**

Buat `tests/ui-content-primitives.test.tsx`:

```tsx
import { expect, test, describe } from "bun:test";
import { render, screen } from "./test-utils";
import React from "react";
import { Button } from "@/components/ui/Button";
import { StatBlock } from "@/components/ui/StatBlock";
import { IndexedItem } from "@/components/ui/IndexedItem";

describe("Button", () => {
  test("renders a link with the given href", () => {
    render(<Button href="/kontak">Hubungi</Button>);
    const link = screen.getByText("Hubungi");
    expect(link.getAttribute("href")).toBe("/kontak");
  });

  test("solid variant is a pill, never a shadowed box", () => {
    render(<Button href="/kontak">Hubungi</Button>);
    const link = screen.getByText("Hubungi");
    expect(link.className).toContain("rounded-full");
    expect(link.className).not.toContain("shadow");
  });

  test("link variant renders without a filled background", () => {
    render(
      <Button href="/layanan" variant="link">
        Lihat
      </Button>,
    );
    const link = screen.getByText("Lihat");
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
    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/layanan#ukur",
    );
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `bun test tests/ui-content-primitives.test.tsx`
Expected: FAIL — modul `@/components/ui/Button` tidak ditemukan.

- [ ] **Step 3: Implementasi `Button`**

Buat `components/ui/Button.tsx`:

```tsx
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "link";
type Tone = "forest" | "light";

const base =
  "inline-flex min-h-11 items-center justify-center text-sm font-semibold transition";

const styles: Record<Variant, Record<Tone, string>> = {
  solid: {
    forest: "rounded-full bg-forest-950 px-7 text-white hover:bg-forest-900",
    light: "rounded-full bg-white px-7 text-forest-950 hover:bg-white/90",
  },
  outline: {
    forest:
      "rounded-full border border-hairline px-7 text-ink hover:border-forest-700 hover:text-forest-700",
    light:
      "rounded-full border border-white/30 px-7 text-white hover:border-white/60",
  },
  link: {
    forest:
      "gap-2 border-b border-forest-700/40 pb-1 text-forest-700 hover:border-forest-700",
    light: "gap-2 border-b border-white/40 pb-1 text-white hover:border-white",
  },
};

export function Button({
  href,
  variant = "solid",
  tone = "forest",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, styles[variant][tone], className)}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 4: Implementasi `StatBlock`**

Buat `components/ui/StatBlock.tsx`:

```tsx
import { credentials, type StatItem } from "@/lib/data/credentials";
import { cn } from "@/lib/cn";

export function StatBlock({
  items,
  tone = "light",
  className,
}: {
  items?: StatItem[];
  tone?: "forest" | "light";
  className?: string;
}) {
  const resolved = items ?? (credentials.enabled ? credentials.stats : []);
  if (resolved.length === 0) return null;

  return (
    <dl
      className={cn(
        "flex flex-wrap divide-x",
        tone === "light" ? "divide-white/20" : "divide-hairline",
        className,
      )}
    >
      {resolved.map((item) => (
        <div key={item.label} className="px-6 first:pl-0">
          <dt className="text-xs uppercase tracking-[0.18em] opacity-70">
            {item.label}
          </dt>
          <dd className="font-display mt-2 text-3xl">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

Catatan: `dt` dirender sebelum `dd` agar label terbaca screen reader lebih dulu; urutan visual dibalik lewat ukuran, bukan CSS order.

- [ ] **Step 5: Implementasi `IndexedItem`**

Buat `components/ui/IndexedItem.tsx`:

```tsx
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function IndexedItem({
  index,
  title,
  href,
  className,
  children,
}: {
  index: number;
  title: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const label = String(index).padStart(2, "0");

  return (
    <div
      className={cn(
        "grid gap-4 border-t border-hairline py-10 md:grid-cols-[6rem_1fr] md:gap-10",
        className,
      )}
    >
      <div className="font-display text-2xl text-brass">{label}</div>
      <div>
        <h3 className="font-display text-2xl md:text-3xl">{title}</h3>
        {children && (
          <div className="mt-4 max-w-2xl text-base leading-8 text-ink-muted">
            {children}
          </div>
        )}
        {href && (
          <Link
            href={href}
            className="mt-6 inline-flex items-center gap-2 border-b border-forest-700/40 pb-1 text-sm font-semibold text-forest-700 hover:border-forest-700"
          >
            {title}
          </Link>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Jalankan tes, pastikan lulus**

Run: `bun test tests/ui-content-primitives.test.tsx`
Expected: PASS (8 tests)

- [ ] **Step 7: Commit**

```bash
git add components/ui/Button.tsx components/ui/StatBlock.tsx components/ui/IndexedItem.tsx tests/ui-content-primitives.test.tsx
git commit -m "feat(ui): add Button, StatBlock, and IndexedItem content primitives"
```

---

### Task 4: Shell — lepas dark mode, restyle Header dan BaseLayout

**Files:**
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/BaseLayout.tsx`
- Delete: `components/layout/ThemeToggle.tsx`
- Modify: `tests/layout-components.test.tsx:29-60`
- Test: `tests/layout-components.test.tsx`

**Interfaces:**
- Consumes: token warna Task 1; `cn` dari `@/lib/cn`.
- Produces: `Header` tanpa tombol tema; `BaseLayout` tanpa `ThemeProvider`, root `div` memakai `bg-canvas text-ink`.

Catatan penting: `components/providers/ThemeProvider.tsx` **jangan dihapus** — area admin bisa memakainya. Yang dilepas hanya pemakaiannya di `BaseLayout` (layout publik).

- [ ] **Step 1: Ubah tes layout supaya menuntut header tanpa tombol tema**

Di `tests/layout-components.test.tsx`, hapus seluruh blok `describe("ThemeToggle", ...)` beserta `import { ThemeToggle } ...` di bagian atas file, lalu tambahkan blok berikut di dalam `describe("Layout Components", ...)`:

```tsx
  describe("Header", () => {
    test("renders the main navigation links", () => {
      render(<Header />);
      expect(screen.getByText("Common.nav.home")).toBeInTheDocument();
      expect(screen.getByText("Common.nav.contact")).toBeInTheDocument();
    });

    test("no longer renders a theme toggle", () => {
      const { container } = render(<Header />);
      const themeButton = container.querySelector(
        '[aria-label*="tema" i], [aria-label*="theme" i]',
      );
      expect(themeButton).toBeNull();
    });
  });
```

Tambahkan importnya di bagian atas file:

```tsx
import { Header } from "@/components/layout/Header";
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `bun test tests/layout-components.test.tsx`
Expected: FAIL pada "no longer renders a theme toggle" — `ThemeToggle` masih dirender oleh `Header`.

- [ ] **Step 3: Hapus `ThemeToggle` dari `Header` dan restyle**

Di `components/layout/Header.tsx`:

1. Hapus baris `import { ThemeToggle } from "@/components/layout/ThemeToggle";`
2. Hapus kedua pemakaian `<ThemeToggle />` (di blok desktop dan blok mobile).
3. Ganti `className` elemen `<header>` menjadi:

```tsx
    <header className="sticky top-0 z-50 border-b border-white/10 bg-forest-950">
```

4. Ganti container di dalamnya menjadi container lebar baru:

```tsx
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 md:px-10">
```

5. Ganti nama perusahaan pada logo menjadi serif:

```tsx
            <div className="font-display truncate text-[15px] tracking-tight text-white sm:text-base lg:whitespace-nowrap">
              PT PRESISI KONSULINDO PRIMA
            </div>
```

6. Ganti `className` link nav aktif/non-aktif menjadi:

```tsx
                        className={cn(
                          "whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.12em] text-white/70 transition hover:text-white",
                          active && "text-white",
                        )}
```

7. Di panel mobile (`Dialog.Content`), ganti kelasnya jadi kanvas terang tanpa shadow dan tanpa `dark:`:

```tsx
              <Dialog.Content className="fixed right-0 top-0 h-full w-[85%] max-w-sm border-l border-hairline bg-canvas p-8 outline-none">
                <Dialog.Title className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
                  Menu
                </Dialog.Title>
```

8. Ganti kelas tiap link di panel mobile:

```tsx
                          className={cn(
                            "font-display border-b border-hairline py-4 text-xl",
                            active ? "text-forest-700" : "text-ink",
                          )}
```

Pastikan `<nav className="flex flex-col gap-2">` diubah jadi `<nav className="mt-8 flex flex-col">`.

- [ ] **Step 4: Hapus file `ThemeToggle`**

```bash
git rm components/layout/ThemeToggle.tsx
```

- [ ] **Step 5: Lepas `ThemeProvider` dari layout publik**

Di `components/layout/BaseLayout.tsx`:

1. Hapus baris `import { ThemeProvider } from "@/components/providers/ThemeProvider";`
2. Hapus tag `<ThemeProvider>` dan `</ThemeProvider>`.
3. Ganti `div` pembungkus menjadi:

```tsx
        <div className="min-h-dvh bg-canvas text-ink">
```

- [ ] **Step 6: Jalankan tes dan typecheck**

Run: `bun test tests/layout-components.test.tsx && bun run typecheck`
Expected: semua tes lulus, typecheck bersih (tidak ada referensi tersisa ke `ThemeToggle`).

- [ ] **Step 7: Verifikasi area admin tidak ikut rusak**

Run: `bun run build`
Expected: build sukses, termasuk route `/admin`. Kalau build gagal karena `next-themes` di area admin, kembalikan `ThemeProvider` **hanya** di `app/(admin)/admin/layout.tsx`, bukan di `BaseLayout`.

- [ ] **Step 8: Commit**

```bash
git add -A components/layout tests/layout-components.test.tsx
git commit -m "feat(layout): drop public dark mode and restyle header shell"
```

---

### Task 5: Footer institusional

**Files:**
- Modify: `components/layout/Footer.tsx`
- Test: `tests/layout-components.test.tsx`

**Interfaces:**
- Consumes: `Rule` (Task 2), `credentials` (Task 1), `company` dari `@/lib/data/company` (field yang dipakai: `company.contact.email`, `.phone`, `.address`, `.mapsUrl`).
- Produces: `Footer` band `forest-950`.

- [ ] **Step 1: Tulis tes yang gagal**

Tambahkan ke `tests/layout-components.test.tsx`, di dalam `describe("Layout Components", ...)`:

```tsx
  describe("Footer", () => {
    test("renders contact details and menu links", () => {
      render(<Footer />);
      expect(screen.getByText("Common.footer.menu")).toBeInTheDocument();
      expect(screen.getByText("Common.nav.contact")).toBeInTheDocument();
    });

    test("hides legal credentials while they are unconfirmed", () => {
      const { container } = render(<Footer />);
      expect(container.textContent).not.toContain("NIB");
    });
  });
```

Tambahkan import di atas file:

```tsx
import { Footer } from "@/components/layout/Footer";
```

- [ ] **Step 2: Jalankan tes, pastikan gagal atau lulus sebagian**

Run: `bun test tests/layout-components.test.tsx`
Expected: tes pertama mungkin sudah lulus (footer lama juga merender menu). Lanjut ke implementasi supaya gayanya benar.

- [ ] **Step 3: Tulis ulang `Footer`**

Ganti isi `components/layout/Footer.tsx` menjadi:

```tsx
import { Link } from "@/i18n/routing";
import { company } from "@/lib/data/company";
import { credentials } from "@/lib/data/credentials";
import { useTranslations } from "next-intl";

export function Footer() {
  const tCommon = useTranslations("Common");
  const tCompany = useTranslations("Company");
  const tFooter = useTranslations("Common.footer");

  const menuItems = [
    { href: "/", label: tCommon("nav.home") },
    { href: "/layanan", label: tCommon("nav.services") },
    { href: "/tentang-kami", label: tCommon("nav.about") },
    { href: "/portofolio", label: tCommon("nav.portfolio") },
    { href: "/artikel", label: tCommon("nav.articles") },
    { href: "/kontak", label: tCommon("nav.contact") },
  ];

  return (
    <footer className="bg-forest-950 text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-2xl leading-snug">
              {tCompany("name")}
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
              {tFooter("description")}
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
              {tFooter("menu")}
            </div>
            <div className="mt-6 grid gap-3 text-sm">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  className="text-white/70 transition hover:text-white"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
              {tFooter("contact")}
            </div>
            <div className="mt-6 grid gap-3 text-sm text-white/70">
              <div>{company.contact.email}</div>
              <div>{company.contact.phone}</div>
              <div className="leading-7">{company.contact.address}</div>
              <a
                className="w-fit border-b border-white/40 pb-1 text-white transition hover:border-white"
                href={company.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Maps
              </a>
            </div>

            {credentials.enabled && credentials.legalEntities.length > 0 && (
              <dl className="mt-8 grid gap-2 text-xs text-white/60">
                {credentials.legalEntities.map((entity) => (
                  <div key={entity.label} className="flex gap-2">
                    <dt className="uppercase tracking-[0.14em]">
                      {entity.label}
                    </dt>
                    <dd>{entity.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1200px] px-6 py-6 text-xs text-white/50 md:px-10">
          {tFooter("rights", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `bun test tests/layout-components.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/layout/Footer.tsx tests/layout-components.test.tsx
git commit -m "feat(layout): rebuild footer as an institutional forest band"
```

---

### Task 6: Homepage — hero forest, tentang asimetris, tiga pilar bernomor

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `components/sections/HomeHeroSection.tsx`
- Modify: `messages/id.json`, `messages/en.json`
- Test: `tests/sections.test.tsx`

**Interfaces:**
- Consumes: `Section`, `SectionHead`, `Rule` (Task 2); `Button`, `StatBlock`, `IndexedItem` (Task 3).
- Produces: `HomeHeroSection` dengan props tak berubah (`imageUrl`, `title`, `subtitle`, `primaryHref`, `primaryLabel`, `secondaryHref`, `secondaryLabel`, `priority`) — jadi pemanggilnya di `app/[locale]/page.tsx` tidak perlu diubah kecuali untuk gaya.

Key i18n baru yang ditambahkan ke `messages/id.json` DAN `messages/en.json`:

`Home.services.eyebrow`, `Home.services.title`, `Home.services.lead`, `Home.about.eyebrow`, `Home.visionMission.eyebrow`.

Nilai `id.json`:
```json
"services": {
  "eyebrow": "Layanan",
  "title": "Tiga pilar layanan pertanahan",
  "lead": "Dari kajian hukum sampai penerbitan sertifikat dan pengukuran bidang — satu alur pendampingan yang terukur."
}
```
Nilai `en.json`:
```json
"services": {
  "eyebrow": "Services",
  "title": "Three pillars of land services",
  "lead": "From legal review to certificate issuance and land measurement — one accountable process end to end."
}
```
Tambahkan juga `"eyebrow": "Tentang Kami"` / `"eyebrow": "About Us"` di dalam objek `Home.about`, dan `"eyebrow": "Visi & Misi"` / `"eyebrow": "Vision & Mission"` di dalam objek `Home.visionMission`.

- [ ] **Step 1: Tulis tes yang gagal untuk hero**

Tambahkan ke `tests/sections.test.tsx` di dalam `describe("Section Components", ...)`:

```tsx
  describe("HomeHeroSection", () => {
    test("renders title, subtitle, and both calls to action", () => {
      render(
        <HomeHeroSection
          imageUrl="/hero.jpg"
          title="Kepastian Hukum"
          subtitle="Pendampingan legalitas lahan."
          primaryHref="/kontak"
          primaryLabel="Konsultasi"
          secondaryHref="/layanan"
          secondaryLabel="Lihat Layanan"
        />,
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toBe("Kepastian Hukum");
      expect(heading.className).toContain("font-display");
      expect(screen.getByText("Konsultasi").getAttribute("href")).toBe(
        "/kontak",
      );
      expect(screen.getByText("Lihat Layanan").getAttribute("href")).toBe(
        "/layanan",
      );
    });
  });
```

Tambahkan import:

```tsx
import { HomeHeroSection } from "@/components/sections/HomeHeroSection";
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `bun test tests/sections.test.tsx`
Expected: FAIL pada assertion `font-display` — heading lama memakai `font-semibold` sans.

- [ ] **Step 3: Restyle `HomeHeroSection`**

Di `components/sections/HomeHeroSection.tsx`, ubah bagian-bagian berikut (struktur framer-motion dan logika `useReducedMotion` dipertahankan apa adanya):

1. Overlay gradien — ganti tiga `div` overlay menjadi dua, memakai warna forest:

```tsx
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-forest-950/40 lg:hidden"
          aria-hidden
        />
```

2. Container grid:

```tsx
      <div className="relative z-10 mx-auto grid min-h-[min(94vh,900px)] max-w-[1200px] px-6 md:px-10 lg:grid-cols-2 lg:gap-0">
```

3. Heading:

```tsx
            <motion.h1
              variants={fadeIn}
              className="font-display text-display text-balance"
            >
              {title}
            </motion.h1>
```

4. Subtitle:

```tsx
            <motion.p
              variants={fadeIn}
              className="mt-7 max-w-lg text-pretty text-base leading-8 text-white/75 sm:text-[1.05rem]"
            >
              {subtitle}
            </motion.p>
```

5. Tombol — ganti kedua `<Link>` inline dengan `Button`, hapus `motion.div` pembungkus `whileHover`/`whileTap` (efek scale bertabrakan dengan kesan institusional):

```tsx
            <motion.div
              variants={fadeIn}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button href={primaryHref} variant="solid" tone="light">
                {primaryLabel}
              </Button>
              <Button href={secondaryHref} variant="outline" tone="light">
                {secondaryLabel}
              </Button>
            </motion.div>
```

6. Tambahkan `StatBlock` di bawah tombol, masih di dalam `motion.div` konten induk:

```tsx
            <motion.div variants={fadeIn} className="mt-14">
              <StatBlock tone="light" />
            </motion.div>
```

7. Perbarui import di bagian atas file:

```tsx
import { Button } from "@/components/ui/Button";
import { StatBlock } from "@/components/ui/StatBlock";
```

Hapus import `Link` dari `@/i18n/routing` jika sudah tidak dipakai.

- [ ] **Step 4: Jalankan tes hero, pastikan lulus**

Run: `bun test tests/sections.test.tsx`
Expected: tes `HomeHeroSection` PASS. Tes `ServiceCard` masih lulus (belum disentuh).

- [ ] **Step 5: Tulis ulang body homepage**

Di `app/[locale]/page.tsx`, ganti isi `return` pada `export default function Home()` menjadi:

```tsx
  return (
    <main>
      <HomeHero />

      <Section tone="canvas">
        <div className="grid gap-14 md:grid-cols-12 md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden md:col-span-5">
            <AboutImage />
          </div>
          <div className="md:col-span-7">
            <SectionHead
              eyebrow={t("about.eyebrow")}
              title={tCompany("name")}
              lead={tCompany("description")}
            />
            <div className="mt-8">
              <Button href="/tentang-kami" variant="link">
                {tButtons("moreAboutUs")}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          eyebrow={t("services.eyebrow")}
          title={t("services.title")}
          lead={t("services.lead")}
        />
        <div className="mt-16">
          {services.map((s, i) => (
            <IndexedItem
              key={s.id}
              index={i + 1}
              title={tServices(`list.${s.id}.title`)}
              href={`/layanan#${s.id}`}
            >
              {tServices(`list.${s.id}.description`)}
            </IndexedItem>
          ))}
        </div>
      </Section>

      <Section tone="canvas">
        <SectionHead
          eyebrow={t("visionMission.eyebrow")}
          title={t("visionMission.vision")}
          lead={tCompany("vision")}
        />
        <div className="mt-16">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
            {t("visionMission.mission")}
          </div>
          <ol className="mt-8 grid gap-0">
            {tCompany.raw("mission").map((m: string, i: number) => (
              <li
                key={m}
                className="grid gap-4 border-t border-hairline py-8 md:grid-cols-[6rem_1fr] md:gap-10"
              >
                <span className="font-display text-xl text-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="max-w-3xl text-base leading-8 text-ink-muted">
                  {m}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="forest">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="font-display text-h2 text-balance">
              {tCompany("tagline")}
            </div>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
              {t("visionMission.ctaDescription")}
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <Button href="/kontak" variant="solid" tone="light">
              {tButtons("contact")}
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
```

Tambahkan import berikut di atas file dan hapus import `ServiceCard`:

```tsx
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Button } from "@/components/ui/Button";
import { IndexedItem } from "@/components/ui/IndexedItem";
```

Tambahkan hook translasi layanan di dalam `Home()`:

```tsx
  const tServices = useTranslations("Services");
```

- [ ] **Step 6: Tambahkan key i18n baru**

Edit `messages/id.json` dan `messages/en.json` sesuai daftar key dan nilai di blok **Interfaces** task ini.

- [ ] **Step 7: Verifikasi**

Run: `bun test && bun run typecheck && bun run build`
Expected: semua lulus, termasuk `tests/i18n-parity.test.ts` (bukti key `id` dan `en` seimbang).

- [ ] **Step 8: Commit**

```bash
git add "app/[locale]/page.tsx" components/sections/HomeHeroSection.tsx messages tests/sections.test.tsx
git commit -m "feat(home): rebuild homepage with forest hero and indexed service pillars"
```

---

### Task 7: Halaman Layanan + restyle `Accordion` dan `HeroSection`

**Files:**
- Modify: `app/[locale]/layanan/page.tsx`
- Modify: `components/ui/Accordion.tsx`
- Modify: `components/sections/HeroSection.tsx`
- Delete: `components/sections/ServiceCard.tsx`
- Modify: `tests/sections.test.tsx`
- Modify: `tests/ui-components.test.tsx`

**Interfaces:**
- Consumes: `Section`, `SectionHead`, `IndexedItem`, `Button`, `Rule`.
- Produces: `HeroSection` dengan props tetap (`title`, `subtitle`) tapi merender band `forest` dengan `<h1 className="font-display text-display">`. Dipakai oleh halaman Tentang Kami, Layanan, Portofolio, Artikel, dan Kontak — jadi restyle di sini menguntungkan task berikutnya.

- [ ] **Step 1: Perbarui tes `HeroSection` dan hapus tes `ServiceCard`**

Di `tests/sections.test.tsx`: hapus seluruh blok `describe("ServiceCard", ...)` dan importnya (`ServiceCard`, `MainService`). Ganti tes `HeroSection` menjadi:

```tsx
  describe("HeroSection", () => {
    test("renders a serif h1 on the forest band", () => {
      const { container } = render(
        <HeroSection title="Layanan" subtitle="Deskripsi layanan." />,
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toBe("Layanan");
      expect(heading.className).toContain("font-display");
      expect(container.innerHTML).toContain("bg-forest-950");
      expect(screen.getByText("Deskripsi layanan.")).toBeInTheDocument();
    });
  });
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `bun test tests/sections.test.tsx`
Expected: FAIL — `font-display` / `bg-forest-950` belum ada di `HeroSection`.

- [ ] **Step 3: Tulis ulang `HeroSection`**

Baca `components/sections/HeroSection.tsx` lebih dulu untuk mempertahankan signature propsnya, lalu ganti bagian render menjadi struktur ini (pertahankan prop opsional yang sudah ada; jangan mengubah nama prop):

```tsx
    <section className="bg-forest-950 text-white">
      <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-28 md:px-10 md:pb-28 md:pt-36">
        <h1 className="font-display text-display max-w-4xl text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-white/70">
            {subtitle}
          </p>
        )}
      </div>
    </section>
```

- [ ] **Step 4: Restyle `Accordion` jadi garis**

Di `components/ui/Accordion.tsx`, ganti kelas Tailwind pada `AccordionItem`, `AccordionTrigger`, dan `AccordionContent` menjadi (hapus semua varian `dark:`, semua `rounded-*`, semua `shadow-*`):

- `AccordionItem`: `"border-b border-hairline"`
- `AccordionTrigger`: `"flex w-full items-center justify-between gap-6 py-6 text-left font-display text-xl transition hover:text-forest-700"`
- `AccordionContent`: `"pb-8 text-base leading-8 text-ink-muted"`

Jangan ubah struktur Radix atau nama export.

- [ ] **Step 5: Tulis ulang halaman Layanan**

Baca `app/[locale]/layanan/page.tsx` lebih dulu untuk memetakan key translasi yang dipakai (`Services.list.<id>.title`, `.description`, dan `Services.sections.<sectionId>.*`). Pertahankan semua key dan `generateMetadata` apa adanya; yang diganti hanya markup:

- Bagian atas: `<HeroSection title={t("title")} subtitle={t("description")} />`
- Untuk setiap layanan di `services`: bungkus dengan `<Section tone={i % 2 === 0 ? "canvas" : "paper"} id={service.id}>`, di dalamnya `SectionHead` (eyebrow = nomor `01`/`02`/`03`, title = judul layanan, lead = deskripsi), lalu daftar sub-layanan sebagai baris `border-t border-hairline py-8` dengan judul `font-display text-xl` dan deskripsi `text-ink-muted`.
- Gambar layanan (`service.imageUrl`): tampilkan `aspect-[3/2]` tanpa radius dan tanpa shadow.
- FAQ (jika halaman ini memuat accordion FAQ): bungkus dalam `<Section tone="canvas">` dengan `SectionHead`.
- Tutup halaman dengan band CTA yang sama persis seperti di homepage Task 6 Step 5 (`<Section tone="forest">` + tagline + `Button` `tone="light"` ke `/kontak`).

Hapus semua kelas `dark:` di file ini.

- [ ] **Step 6: Hapus `ServiceCard`**

```bash
git rm components/sections/ServiceCard.tsx
```

Pastikan tidak ada yang mengimpornya:

Run: `grep -rn "ServiceCard" app components tests`
Expected: tidak ada hasil.

- [ ] **Step 7: Verifikasi**

Run: `bun test && bun run typecheck && bun run build`
Expected: semua lulus.

- [ ] **Step 8: Commit**

```bash
git add -A "app/[locale]/layanan" components/ui/Accordion.tsx components/sections tests
git commit -m "feat(services): rebuild services page with hairline rows and serif hero"
```

---

### Task 8: Halaman Tentang Kami + `OrganizationChart`

**Files:**
- Modify: `app/[locale]/tentang-kami/page.tsx`
- Modify: `components/sections/OrganizationChart.tsx`
- Test: `tests/sections.test.tsx`

**Interfaces:**
- Consumes: `HeroSection` (hasil restyle Task 7), `Section`, `SectionHead`, `Rule`, `Button`.
- Produces: `OrganizationChart` dengan props tidak berubah; dirender sebagai diagram garis di atas kanvas `forest`.

- [ ] **Step 1: Tulis tes yang gagal untuk `OrganizationChart`**

Tambahkan ke `tests/sections.test.tsx`:

```tsx
  describe("OrganizationChart", () => {
    test("renders divisions as hairline nodes without cards", () => {
      const { container } = render(<OrganizationChart />);
      expect(container.innerHTML).not.toContain("rounded-2xl");
      expect(container.innerHTML).not.toContain("shadow");
      expect(container.innerHTML).not.toContain("dark:");
    });
  });
```

Tambahkan import:

```tsx
import { OrganizationChart } from "@/components/sections/OrganizationChart";
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `bun test tests/sections.test.tsx`
Expected: FAIL — markup lama masih memakai `rounded-2xl`/`dark:`.

- [ ] **Step 3: Restyle `OrganizationChart`**

Baca file lebih dulu untuk mempertahankan sumber data dan key translasinya. Ganti gaya tiap node menjadi:

- Node direktur: `"border border-white/25 px-8 py-5 text-center font-display text-xl"`
- Node divisi: `"border-t border-white/20 pt-5 text-sm leading-7 text-white/70"`
- Penghubung antar level: `<span aria-hidden className="mx-auto block h-10 w-px bg-white/25" />`
- Hapus seluruh kelas `dark:`, `rounded-*`, dan `shadow-*`.

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `bun test tests/sections.test.tsx`
Expected: PASS

- [ ] **Step 5: Tulis ulang halaman Tentang Kami**

Baca `app/[locale]/tentang-kami/page.tsx` lebih dulu; pertahankan `generateMetadata` dan seluruh key translasi. Ganti markup menjadi:

- `<HeroSection title={...} subtitle={...} />`
- `<Section tone="canvas">` untuk profil perusahaan, grid 12 kolom (5 gambar / 7 teks) memakai `SectionHead`.
- `<Section tone="paper">` untuk visi & misi; misi memakai daftar bernomor bergaris seperti pada homepage (Task 6 Step 5).
- `<Section tone="forest">` membungkus `<OrganizationChart />` dengan `SectionHead` di atasnya.
- Tutup dengan band CTA `forest` + `Button` ke `/kontak`.

Hapus semua kelas `dark:` di file ini.

- [ ] **Step 6: Verifikasi**

Run: `bun test && bun run typecheck && bun run build`
Expected: semua lulus.

- [ ] **Step 7: Commit**

```bash
git add -A "app/[locale]/tentang-kami" components/sections/OrganizationChart.tsx tests/sections.test.tsx
git commit -m "feat(about): rebuild about page and line-based organization chart"
```

---

### Task 9: Halaman Kontak + `ContactForm` field underline

**Files:**
- Modify: `app/[locale]/kontak/page.tsx`
- Modify: `components/forms/ContactForm.tsx`
- Test: `tests/contact-form.test.tsx`

**Interfaces:**
- Consumes: `HeroSection`, `Section`, `SectionHead`, `Button`.
- Produces: `ContactForm` dengan perilaku submit dan validasi **tidak berubah** — hanya kelas presentational yang diganti.

- [ ] **Step 1: Baca tes yang ada dan jalankan sebagai baseline**

Run: `bun test tests/contact-form.test.tsx`
Expected: PASS sebelum perubahan. Catat nama tesnya; semuanya harus tetap lulus setelah restyle. Kalau ada assertion yang mengunci kelas lama, ubah assertion itu saja, jangan perilakunya.

- [ ] **Step 2: Tambahkan tes gaya field**

Tambahkan ke `tests/contact-form.test.tsx`:

```tsx
  test("inputs use underline styling instead of boxed borders", () => {
    const { container } = render(<ContactForm />);
    const input = container.querySelector("input");
    expect(input?.className).toContain("border-b");
    expect(input?.className).not.toContain("rounded-lg");
  });
```

Kalau `describe` di file itu memakai nama lain, sisipkan tes ini di dalam blok yang sudah ada dan pakai cara render yang sama seperti tes tetangganya.

- [ ] **Step 3: Jalankan tes, pastikan gagal**

Run: `bun test tests/contact-form.test.tsx`
Expected: FAIL pada tes baru.

- [ ] **Step 4: Restyle `ContactForm`**

Di `components/forms/ContactForm.tsx`, ganti kelas presentational (jangan sentuh `react-hook-form`, resolver zod, atau handler submit):

- Label: `"text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted"`
- Input dan textarea: `"mt-3 w-full border-0 border-b border-hairline bg-transparent pb-3 text-base text-ink outline-none transition focus:border-forest-700"`
- Pesan error: `"mt-2 text-sm text-brass"`
- Tombol submit: `"mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-forest-950 px-8 text-sm font-semibold text-white transition hover:bg-forest-900 disabled:opacity-50"`
- Hapus semua kelas `dark:` dan `shadow-*`.

- [ ] **Step 5: Jalankan tes, pastikan lulus**

Run: `bun test tests/contact-form.test.tsx`
Expected: PASS, termasuk seluruh tes perilaku yang sudah ada sebelumnya.

- [ ] **Step 6: Tulis ulang halaman Kontak**

Baca `app/[locale]/kontak/page.tsx` lebih dulu; pertahankan `generateMetadata` dan key translasi. Ganti markup menjadi:

- `<HeroSection title={...} subtitle={...} />`
- `<Section tone="canvas" className="pt-0">` berisi grid 12 kolom: kolom kiri (`md:col-span-7`) panel `bg-paper border border-hairline p-8 md:p-12` berisi `<ContactForm />`; kolom kanan (`md:col-span-5`) panel `bg-forest-950 p-8 text-white md:p-12` berisi email, telepon, alamat, jam kerja, dan tautan Google Maps dari `company.contact`.
- Peta / tautan Maps memakai `Button variant="outline" tone="light"`.

Hapus semua kelas `dark:` di file ini.

- [ ] **Step 7: Verifikasi**

Run: `bun test && bun run typecheck && bun run build`
Expected: semua lulus.

- [ ] **Step 8: Commit**

```bash
git add -A "app/[locale]/kontak" components/forms/ContactForm.tsx tests/contact-form.test.tsx
git commit -m "feat(contact): split contact page and restyle form with underline fields"
```

---

### Task 10: Portofolio — index dan detail

**Files:**
- Modify: `app/[locale]/portofolio/page.tsx`
- Modify: `app/[locale]/portofolio/[slug]/page.tsx`
- Modify: `app/components/sections/PortfolioCard.tsx`
- Test: `tests/portfolio-card.test.tsx`

**Interfaces:**
- Consumes: `HeroSection`, `Section`, `SectionHead`, `Rule`, `Button`.
- Produces: `PortfolioCard` dengan props tidak berubah; dirender sebagai "record" bergaris, bukan kartu bershadow.

- [ ] **Step 1: Tulis tes yang gagal**

Baca `app/components/sections/PortfolioCard.tsx` untuk mengetahui bentuk propsnya, lalu buat `tests/portfolio-card.test.tsx` memakai props asli tersebut:

```tsx
import { expect, test, describe } from "bun:test";
import { render } from "./test-utils";
import React from "react";
import { PortfolioCard } from "@/app/components/sections/PortfolioCard";

describe("PortfolioCard", () => {
  test("renders as a hairline record without card chrome", () => {
    // Ganti props di bawah dengan props asli komponen ini.
    const { container } = render(<PortfolioCard /* props asli */ />);
    expect(container.innerHTML).not.toContain("rounded-2xl");
    expect(container.innerHTML).not.toContain("shadow");
    expect(container.innerHTML).not.toContain("dark:");
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `bun test tests/portfolio-card.test.tsx`
Expected: FAIL karena markup lama.

- [ ] **Step 3: Restyle `PortfolioCard`**

Ganti kelas presentational:

- Pembungkus: `"group grid gap-6 border-t border-hairline py-10"`
- Gambar: `"relative aspect-[3/2] w-full overflow-hidden"` (tanpa radius, tanpa border)
- Judul: `"font-display mt-6 text-2xl transition group-hover:text-forest-700"`
- Meta/kategori: `"text-xs uppercase tracking-[0.18em] text-brass"`
- Ringkasan: `"mt-3 max-w-2xl text-base leading-8 text-ink-muted"`
- Hapus semua `dark:`, `rounded-*`, `shadow-*`, dan efek `hover:-translate-y-*`.

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `bun test tests/portfolio-card.test.tsx`
Expected: PASS

- [ ] **Step 5: Tulis ulang halaman index portofolio**

Di `app/[locale]/portofolio/page.tsx`: pertahankan seluruh pengambilan data dan `generateMetadata`. Ganti markup jadi `<HeroSection />` + `<Section tone="canvas">` berisi grid `md:grid-cols-2 gap-x-14` dari `PortfolioCard`. State kosong: teks `text-ink-muted` di dalam blok `border-t border-hairline py-16`. Hapus semua `dark:`.

- [ ] **Step 6: Tulis ulang halaman detail portofolio**

Di `app/[locale]/portofolio/[slug]/page.tsx`: pertahankan pengambilan data, `generateMetadata`, dan `notFound()`. Ganti markup jadi:
- `<HeroSection title={portfolio.title} subtitle={...} />`
- Gambar utama full-bleed `aspect-[16/7]` tanpa radius.
- Isi di `<Section tone="canvas">` dengan kolom `max-w-[68ch] text-[1.0625rem] leading-8`.
- Blok meta (klien, lokasi, tahun — hanya field yang memang ada di data) sebagai `dl` bergaris `border-t border-hairline`.
- Tutup dengan band CTA `forest` + `Button` ke `/kontak`.

Hapus semua `dark:`.

- [ ] **Step 7: Verifikasi**

Run: `bun test && bun run typecheck && bun run build`
Expected: semua lulus.

- [ ] **Step 8: Commit**

```bash
git add -A "app/[locale]/portofolio" app/components/sections/PortfolioCard.tsx tests/portfolio-card.test.tsx
git commit -m "feat(portfolio): render portfolio as hairline records"
```

---

### Task 11: Artikel — index editorial dan halaman baca

**Files:**
- Modify: `app/[locale]/artikel/page.tsx`
- Modify: `app/[locale]/artikel/[slug]/page.tsx`
- Modify: `app/components/sections/ArticleCard.tsx`
- Modify: `components/article/ArticleContent.tsx`
- Test: `tests/article-card.test.tsx`

**Interfaces:**
- Consumes: `HeroSection`, `Section`, `SectionHead`, `Rule`, `Button`.
- Produces: `ArticleCard` dengan props tidak berubah, plus prop opsional baru `featured?: boolean` (default `false`) yang merender varian lebar untuk artikel teratas.

- [ ] **Step 1: Tulis tes yang gagal**

Baca `app/components/sections/ArticleCard.tsx` untuk propsnya, lalu buat `tests/article-card.test.tsx`:

```tsx
import { expect, test, describe } from "bun:test";
import { render } from "./test-utils";
import React from "react";
import { ArticleCard } from "@/app/components/sections/ArticleCard";

describe("ArticleCard", () => {
  test("renders without card chrome", () => {
    // Ganti props di bawah dengan props asli komponen ini.
    const { container } = render(<ArticleCard /* props asli */ />);
    expect(container.innerHTML).not.toContain("rounded-2xl");
    expect(container.innerHTML).not.toContain("shadow");
    expect(container.innerHTML).not.toContain("dark:");
  });

  test("featured variant renders a larger serif title", () => {
    const { container } = render(<ArticleCard featured /* props asli */ />);
    expect(container.innerHTML).toContain("font-display");
    expect(container.innerHTML).toContain("text-3xl");
  });
});
```

- [ ] **Step 2: Jalankan tes, pastikan gagal**

Run: `bun test tests/article-card.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Restyle `ArticleCard` dan tambahkan prop `featured`**

Tambahkan `featured = false` ke props. Kelas:

- Pembungkus: `"group grid gap-5 border-t border-hairline py-8"`
- Gambar (hanya jika `featured`): `"relative aspect-[16/8] w-full overflow-hidden"`
- Judul: `featured ? "font-display text-3xl md:text-4xl" : "font-display text-xl"`, ditambah `"transition group-hover:text-forest-700"`
- Tanggal/kategori: `"text-xs uppercase tracking-[0.18em] text-brass"`
- Ringkasan: `"max-w-2xl text-base leading-8 text-ink-muted"`
- Hapus semua `dark:`, `rounded-*`, `shadow-*`.

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `bun test tests/article-card.test.tsx`
Expected: PASS

- [ ] **Step 5: Tulis ulang index artikel**

Di `app/[locale]/artikel/page.tsx`: pertahankan pengambilan data, paginasi, dan `generateMetadata`. Markup baru: `<HeroSection />` lalu `<Section tone="canvas">` yang merender artikel pertama dengan `<ArticleCard featured />` full-width, sisanya dalam satu kolom list bergaris. Kontrol paginasi memakai `Button variant="link"`. Hapus semua `dark:`.

- [ ] **Step 6: Tulis ulang halaman baca artikel**

Di `app/[locale]/artikel/[slug]/page.tsx`: pertahankan pengambilan data, `generateMetadata`, JSON-LD, dan `notFound()`. Markup baru:
- Header artikel di band `forest`: eyebrow kategori, `<h1 className="font-display text-display max-w-4xl">`, meta tanggal/penulis di `text-white/60`.
- Gambar utama `aspect-[16/7]` tanpa radius.
- `<Section tone="canvas">` dengan `<div className="mx-auto max-w-[68ch]">` membungkus `<ArticleContent />`.
- Tutup dengan band CTA `forest` + `Button` ke `/kontak`.

Hapus semua `dark:`.

- [ ] **Step 7: Restyle `ArticleContent` (tipografi badan artikel)**

Di `components/article/ArticleContent.tsx`, ganti kelas prose menjadi:

- Pembungkus: `"text-[1.0625rem] leading-8 text-ink"`
- `h2` di dalam konten: `"font-display mt-14 text-3xl"`
- `h3`: `"font-display mt-10 text-2xl"`
- Paragraf: `"mt-6"`
- Daftar: `"mt-6 grid gap-3 pl-5"` dengan penanda `text-brass`
- Blockquote: `"mt-8 border-l-2 border-brass pl-6 italic text-ink-muted"`
- Tautan: `"border-b border-forest-700/40 text-forest-700 hover:border-forest-700"`
- Hapus semua `dark:`.

- [ ] **Step 8: Verifikasi**

Run: `bun test && bun run typecheck && bun run build`
Expected: semua lulus.

- [ ] **Step 9: Commit**

```bash
git add -A "app/[locale]/artikel" app/components/sections/ArticleCard.tsx components/article/ArticleContent.tsx tests/article-card.test.tsx
git commit -m "feat(articles): editorial index and reading layout"
```

---

### Task 12: Bersih-bersih dan verifikasi akhir

**Files:**
- Modify: `app/[locale]/not-found.tsx`
- Modify: file publik mana pun yang masih menyisakan `dark:`
- Test: `tests/no-dark-classes.test.ts` (baru)

**Interfaces:**
- Consumes: semua task sebelumnya.
- Produces: jaminan tidak ada kelas `dark:` tersisa di kode publik.

- [ ] **Step 1: Tulis tes penjaga**

Buat `tests/no-dark-classes.test.ts`:

```ts
import { expect, test, describe } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_ROOTS = ["app/[locale]", "app/components", "components"];
const SKIP = new Set(["node_modules", ".next"]);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    if (SKIP.has(entry)) return [];
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".tsx") || full.endsWith(".ts") ? [full] : [];
  });
}

describe("public surface has no dark-mode classes", () => {
  test("no file under the public roots contains a dark: variant", () => {
    const offenders = PUBLIC_ROOTS.flatMap(walk).filter((file) =>
      readFileSync(file, "utf8").includes("dark:"),
    );
    expect(offenders).toEqual([]);
  });
});
```

- [ ] **Step 2: Jalankan tes untuk melihat sisa pekerjaan**

Run: `bun test tests/no-dark-classes.test.ts`
Expected: FAIL dengan daftar file yang masih memakai `dark:` (paling tidak `app/[locale]/not-found.tsx`).

- [ ] **Step 3: Bersihkan setiap file yang terdaftar**

Untuk tiap file dalam daftar, hapus kelas `dark:` dan ganti warna hardcoded (`text-zinc-*`, `bg-white`, `bg-black`, `border-black/10`) dengan token: `text-ink`, `text-ink-muted`, `bg-canvas`, `bg-paper`, `border-hairline`. Untuk `app/[locale]/not-found.tsx`, pakai band `forest` dengan `<h1 className="font-display text-display">` dan `Button` ke `/`.

- [ ] **Step 4: Jalankan tes penjaga sampai lulus**

Run: `bun test tests/no-dark-classes.test.ts`
Expected: PASS

- [ ] **Step 5: Pastikan `ThemeToggle` benar-benar hilang**

Run: `grep -rn "ThemeToggle" app components tests`
Expected: tidak ada hasil.

- [ ] **Step 6: Verifikasi penuh**

Run: `bun test && bun run typecheck && bun run lint && bun run build`
Expected: seluruh tes lulus (termasuk `tests/seo.test.ts`, `tests/data.test.ts`, `tests/lib-security.test.ts`, `tests/api-ai-security.test.ts` yang tidak dimodifikasi), typecheck bersih, lint bersih, build sukses.

- [ ] **Step 7: Periksa manual di browser**

Run: `bun dev`
Buka dan periksa: `/`, `/tentang-kami`, `/layanan`, `/portofolio`, satu halaman detail portofolio, `/artikel`, satu halaman artikel, `/kontak`, `/en`, dan `/admin`. Konfirmasi: tidak ada flash tema, tidak ada shadow, area admin tetap tampil benar, dan tidak ada angka statistik yang muncul (karena `credentials.enabled === false`).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore(design): remove residual dark-mode classes from public surface"
```
