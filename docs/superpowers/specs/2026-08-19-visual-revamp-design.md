# Revamp Visual Situs Publik PKP — Institutional Gravitas

Tanggal: 2026-08-19
Status: disetujui untuk masuk tahap implementation plan

## Masalah

Situs publik PT Presisi Konsulindo Prima memakai pola SaaS generik: container
`max-w-6xl`, kartu `rounded-2xl` bershadow, hijau hanya sebagai aksen kecil, satu
skala tipografi sans untuk semua. Tampilannya tidak menyampaikan otoritas yang
diharapkan dari penyedia jasa konsultasi hukum pertanahan.

## Tujuan

Bangun bahasa visual "Institutional Gravitas" — hijau tua sebagai kanvas dominan,
tipografi serif berskala besar, garis hairline menggantikan shadow — lalu terapkan
ke seluruh halaman publik lewat satu set primitif komponen.

Non-tujuan: perubahan pada area admin, API, skema database, routing, atau i18n
runtime. Revamp ini murni presentational.

## Keputusan yang sudah diambil

| Keputusan | Pilihan |
| --- | --- |
| Arah visual | Institutional Gravitas (hijau tua dominan, serif display) |
| Cakupan | Seluruh halaman publik + header/footer |
| Dark mode | Dibuang dari situs publik |
| Tipografi | Tambah serif via `next/font/google`, body tetap Geist Sans |
| Angka & kredensial | Placeholder di config, tidak dirender sampai diisi |
| Pendekatan | Token-first rewrite + primitif komponen |

## Fondasi visual

### Token warna

Menggantikan isi `@theme` di `app/globals.css`.

| Token | Nilai | Peran |
| --- | --- | --- |
| `--color-forest-950` | `#0B2A1E` | Kanvas gelap: hero, footer, CTA band |
| `--color-forest-900` | `#123A2A` | Permukaan gelap sekunder |
| `--color-forest-700` | `#1A5C42` | Aksen di kanvas terang, link |
| `--color-canvas` | `#FBFAF7` | Latar halaman (ivory) |
| `--color-paper` | `#FFFFFF` | Kartu/panel di atas ivory |
| `--color-ink` | `#111812` | Teks utama |
| `--color-ink-muted` | `#5A6560` | Teks sekunder |
| `--color-brass` | `#A8792C` | Aksen langka: rule, angka, hover |
| `--color-hairline` | `rgba(17,24,18,.12)` | Garis 1px |

Token lama (`--color-pkp-*`, `--color-navy`, `--color-brand`, `--color-gold`) dan
blok `.dark` **tetap dipertahankan** karena `@blawness/admin-kit` merender area
admin dengan token tersebut lewat `app/globals.css` yang sama.

### Tipografi

- Heading: `Instrument Serif` via `next/font/google`, self-hosted, di-bind ke
  `--font-serif`.
- Body/UI: Geist Sans (sudah ada).
- Skala: display `clamp(2.75rem, 6vw, 4.75rem)` tracking `-0.02em`; h2
  `clamp(2rem, 3.5vw, 2.75rem)`; body 16px/1.75; eyebrow 12px uppercase tracking
  `0.18em`.

### Aturan bentuk

- Radius: `rounded-none` atau `rounded-sm` di mana-mana; pengecualian hanya tombol
  CTA berbentuk pill.
- Shadow dihapus total; pemisah visual memakai hairline 1px.
- Padding section `py-24 md:py-32`.
- Container dua tingkat: `max-w-[1200px]` untuk konten, full-bleed untuk band gelap.

## Primitif komponen

Semua di `components/ui/`.

| Komponen | Props | Fungsi |
| --- | --- | --- |
| `Section` | `tone: "canvas" \| "forest" \| "paper"`, `bleed?` | Padding vertikal, container, dan inversi warna otomatis |
| `SectionHead` | `eyebrow`, `title`, `lead?`, `align?` | Eyebrow + rule brass + heading serif + lead |
| `Rule` | `tone?` | Hairline 1px dengan segmen brass opsional |
| `Button` | `variant: "solid" \| "outline" \| "link"`, `tone` | Menggantikan tombol yang kini di-inline per halaman |
| `StatBlock` | `items[]` | Baris angka + label dipisah hairline vertikal |
| `IndexedItem` | `index`, `title`, `children` | Item bernomor `01/02/03` serif brass |

`StatBlock` hanya merender jika `credentials.enabled === true`.

## Struktur halaman

- **Home** — hero band `forest` setinggi viewport (display serif, sub, dua CTA,
  `StatBlock` di kaki hero) → section canvas "Tentang" grid asimetris 5/7 dengan
  foto full-bleed → "Tiga Pilar Layanan" memakai `IndexedItem` 01/02/03 dipisah
  hairline → visi/misi dengan misi bernomor → CTA band `forest`.
- **Layanan** — hero ringkas; tiap sub-layanan (HM/HGB/HGU/Hak Pakai, LSD, balik
  nama, pemecahan/penggabungan) menjadi baris hairline. `Accordion` tetap dipakai
  untuk FAQ, di-restyle menjadi garis.
- **Tentang Kami** — visi/misi editorial; `OrganizationChart` di-restyle menjadi
  diagram garis di kanvas forest.
- **Portofolio** — grid 2 kolom; kartu menjadi "record" (nomor, judul serif, meta
  di hairline), foto rasio 3:2 tanpa radius.
- **Artikel** — index editorial: artikel teratas full-width, sisanya list bergaris.
  Detail: kolom `max-w-[68ch]`, 18px/1.8.
- **Kontak** — split; form di `paper` dengan field underline (bukan box), blok info
  kontak dan jam kerja di `forest`.
- **Header** — transparan di atas hero forest, menjadi solid + hairline saat scroll.
  `ThemeToggle` dihapus, `LanguageSwitcher` dipertahankan.
- **Footer** — band `forest`, empat kolom bergaris, alamat dan legalitas ditonjolkan.

## Data kredensial

`lib/data/credentials.ts`:

```ts
export const credentials = {
  enabled: false,          // set true setelah legal mengonfirmasi
  foundedYear: null,       // number
  legalEntities: [],       // { label, value }[]
  stats: [],               // { value, label }[]
} as const;
```

Selama `enabled === false`, `StatBlock` dan blok legalitas di footer tidak dirender
sama sekali. Tidak ada angka contoh yang boleh muncul di markup.

## i18n

Struktur baru memerlukan key tambahan (eyebrow dan lead per section). Setiap key
ditambahkan ke `messages/id.json` **dan** `messages/en.json` bersamaan. Makna copy
inti (visi, misi, deskripsi layanan) tidak diubah; hanya dirapikan agar muat pada
layout baru.

## Urutan implementasi

Setiap tahap berdiri sendiri; situs tetap dapat di-build di antara tahap.

1. **Fondasi** — token `@theme` baru di `app/globals.css`, font serif di
   `app/[locale]/layout.tsx`, `lib/data/credentials.ts`.
2. **Primitif** — enam komponen `components/ui/` beserta tesnya (TDD).
3. **Shell** — `Header`, `Footer`, `BaseLayout`.
4. **Home** — `app/[locale]/page.tsx`, `HomeHeroSection`, `ServiceCard` →
   `IndexedItem`.
5. **Layanan, Tentang Kami, Kontak** — termasuk `Accordion`, `OrganizationChart`,
   `ContactForm`.
6. **Portofolio & Artikel** — index dan detail, `PortfolioCard`, `ArticleCard`,
   `ArticleContent`.
7. **Bersih-bersih** — sapu sisa `dark:` di file publik, hapus `ThemeToggle.tsx`,
   jalankan `typecheck`, `lint`, `test`, `build`.

## Dampak file

Berubah: 21 file publik yang saat ini memakai `dark:`, ditambah enam file primitif
baru, `lib/data/credentials.ts`, serta `messages/id.json` dan `messages/en.json`.

Tidak disentuh: `app/(admin)/**`, `app/api/**`, `db/**`, `lib/api/**`,
`middleware.ts`, `i18n/**`.

## Testing

- Tes presentational yang ada (`tests/ui-components.test.tsx`,
  `tests/layout-components.test.tsx`, `tests/sections.test.tsx`,
  `tests/contact-form.test.tsx`) akan gagal karena meng-assert struktur lama.
  Diperbarui pada tahap yang mengubahnya, bukan ditunda ke akhir.
- Tes baru: setiap primitif (varian render, `tone` menghasilkan kelas yang benar);
  `StatBlock` tidak merender saat `enabled: false` dan merender saat `true`; header
  tidak lagi merender tombol tema; set key `messages/id.json` sama persis dengan
  `messages/en.json`.
- `tests/seo.test.ts`, `tests/data.test.ts`, `tests/lib-security.test.ts`, dan
  `tests/api-ai-security.test.ts` harus lulus tanpa perubahan — inilah bukti bahwa
  revamp murni presentational.

## Risiko

1. **Area admin ikut `app/globals.css`.** Setiap perubahan token diverifikasi
   dengan membuka `/admin` dan memastikan tampilannya tetap benar.
2. **Pelepasan `ThemeProvider`.** Provider hanya dilepas dari layout publik. Jika
   admin-kit ternyata membaca `next-themes` dari root, provider dikembalikan dan
   situs publik memakai `forcedTheme="light"`.
3. **Key i18n tertinggal di `en.json`.** Dicegah oleh tes pembanding set key.
