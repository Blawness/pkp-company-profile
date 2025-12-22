---
name: Company Profile Website Plan
overview: Membangun website company profile PT Presisi Konsulindo Prima menggunakan Next.js 15 dengan App Router, Tailwind CSS 4, Radix UI components, Bun sebagai package manager/build tool, dan gambar dari Pexels. Fokus pada struktur baru dengan layanan utama Konsultasi Hukum Pertanahan dan Jasa Pengurusan Sertifikat Tanah.
todos:
  - id: setup-project
    content: Initialize Next.js project dengan TypeScript menggunakan Bun, install dependencies (Tailwind 4, Radix UI, icons), setup config files
    status: in_progress
  - id: create-layout
    content: Buat komponen Layout, Header dengan navigation menu (Radix), dan Footer dengan informasi kontak
    status: pending
    dependencies:
      - setup-project
  - id: create-data-layer
    content: Buat file data untuk services (semua layanan dan sub-layanan) dan company info (visi, misi, kontak)
    status: pending
    dependencies:
      - setup-project
  - id: home-page
    content: Implementasi halaman utama dengan HeroSection, ServiceCard preview, AboutSection singkat, dan VisionMission
    status: pending
    dependencies:
      - create-layout
      - create-data-layer
  - id: services-page
    content: Buat halaman layanan dengan ServiceDetail component menggunakan Radix Accordion untuk semua sub-layanan
    status: pending
    dependencies:
      - create-layout
      - create-data-layer
  - id: about-page
    content: Buat halaman tentang kami dengan informasi lengkap perusahaan
    status: pending
    dependencies:
      - create-layout
      - create-data-layer
  - id: contact-page
    content: Buat halaman kontak dengan ContactForm (integrasi Formspree/EmailJS, validasi dengan Zod), dan informasi kontak
    status: pending
    dependencies:
      - create-layout
  - id: organization-section
    content: Buat komponen OrganizationChart untuk menampilkan struktur organisasi di halaman tentang kami
    status: pending
    dependencies:
      - create-data-layer
      - about-page
  - id: dark-mode
    content: Implementasi dark mode dengan next-themes, ThemeToggle component, dan styling untuk dark theme
    status: pending
    dependencies:
      - create-layout
  - id: pexels-integration
    content: Setup Pexels API integration, buat utility untuk fetch images, dan implementasi di komponen yang memerlukan gambar
    status: pending
    dependencies:
      - setup-project
  - id: animations
    content: "Implementasi animasi dengan Framer Motion: scroll animations, page transitions, micro-interactions, dan stagger effects"
    status: pending
    dependencies:
      - home-page
      - services-page
      - about-page
      - contact-page
  - id: article-placeholder
    content: Buat halaman artikel sebagai placeholder dengan struktur dasar (kosong untuk sekarang)
    status: pending
    dependencies:
      - create-layout
  - id: color-profile-setup
    content: Setup Tailwind config dengan color profile yang sama dengan website existing (dark green header, teal buttons, green/blue/brown logo colors)
    status: pending
    dependencies:
      - setup-project
  - id: styling-polish
    content: Apply Tailwind styling dengan color profile yang sudah ditentukan, responsive design, dan optimasi images dari Pexels
    status: pending
    dependencies:
      - home-page
      - services-page
      - about-page
      - contact-page
      - dark-mode
      - animations
      - color-profile-setup
---

# Rencana Pembangunan Website Company Profile PT Presisi Konsulindo Prima

## Teknologi Stack

- **Next.js 15** dengan App Router
- **Tailwind CSS 4** untuk styling
- **Radix UI** untuk komponen interaktif (Dialog, Accordion, Tabs, Navigation Menu)
- **TypeScript** untuk type safety
- **Pexels API** untuk gambar dinamis (memerlukan API key)
- **Lucide React** untuk ikon
- **Framer Motion** untuk animasi kompleks dan micro-interactions
- **Formspree** atau **EmailJS** untuk form kontak (service pihak ketiga)

## Struktur Halaman

### 1. Halaman Utama (`/`)

- Hero section dengan CTA
- Ringkasan layanan utama (cards)
- Tentang perusahaan (singkat)
- Visi & Misi
- CTA section

### 2. Halaman Layanan (`/layanan`)

- Overview layanan
- Dua layanan utama dengan detail lengkap:
- **Konsultasi Hukum Pertanahan**
    - Layanan bantuan dan FAQ
    - Layanan Kajian Hukum
- **Jasa Pengurusan Sertifikat Tanah**
    - Pendaftaran Tanah Pertama Kali
    - Pengurusan Sertifikat Hak Atas Tanah
    - Balik Nama Sertifikat
    - Pemecahan atau Penggabungan Sertifikat
    - Pengurusan Legalitas Pemanfaatan Tanah LSD

### 3. Halaman Tentang Kami (`/tentang-kami`)

- Sejarah perusahaan
- Visi & Misi lengkap
- Struktur organisasi (jika ada)
- Tim (opsional)

### 4. Halaman Kontak (`/kontak`)

- Form kontak dengan integrasi Formspree/EmailJS
- Informasi kontak (email, telepon, alamat)
- Map lokasi (opsional)

### 5. Halaman Artikel/Blog (`/artikel`)

- Struktur placeholder (kosong untuk sekarang)
- Siap untuk konten di masa depan

## Struktur Komponen

### Layout Components

- `Header` - Navigation dengan Radix Navigation Menu
- `Footer` - Footer dengan informasi kontak dan links
- `Layout` - Wrapper utama

### Page Components

- `HeroSection` - Hero dengan gambar dari Pexels
- `ServiceCard` - Card untuk layanan
- `ServiceDetail` - Detail layanan dengan Accordion (Radix)
- `ContactForm` - Form kontak dengan validasi
- `AboutSection` - Section tentang perusahaan
- `VisionMission` - Visi & Misi section
- `OrganizationChart` - Struktur organisasi dengan visualisasi
- `ThemeToggle` - Dark mode toggle button

### UI Components (Radix-based)

- `Accordion` - Untuk FAQ dan detail layanan
- `Dialog` - Untuk modal/form
- `Tabs` - Untuk navigasi layanan (jika diperlukan)
- `NavigationMenu` - Menu navigasi utama
- `ThemeProvider` - Context untuk dark mode

## File Structure

```javascript
pkp-company-profile/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                 # Home page
│   ├── layanan/
│   │   └── page.tsx            # Services page
│   ├── tentang-kami/
│   │   └── page.tsx            # About page
│   ├── kontak/
│   │   └── page.tsx            # Contact page
│   └── artikel/
│       └── page.tsx            # Blog page (optional)
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── ServiceDetail.tsx
│   │   ├── AboutSection.tsx
│   │   └── VisionMission.tsx
│   ├── ui/
│   │   ├── Accordion.tsx       # Radix wrapper
│   │   ├── Dialog.tsx          # Radix wrapper
│   │   └── NavigationMenu.tsx  # Radix wrapper
│   └── forms/
│       └── ContactForm.tsx
├── lib/
│   ├── data/
│   │   ├── services.ts         # Data layanan
│   │   └── company.ts          # Data perusahaan
│   └── utils.ts
├── public/
│   └── images/                 # Static images (jika tidak menggunakan Pexels API)
├── styles/
│   └── globals.css             # Tailwind imports & custom styles
├── package.json
├── tailwind.config.ts          # Tailwind 4 config
├── tsconfig.json
└── next.config.js
```



## Implementasi Detail

### 1. Setup Project (Bun)

- Initialize Next.js dengan TypeScript menggunakan Bun: `bun create next@latest --ts`
- Install Tailwind CSS 4, Radix UI, Framer Motion, next-themes, Formspree/EmailJS dengan `bun add`
- Pastikan scripts menggunakan `bun run dev`, `bun run build`, `bun run lint`
- Setup Tailwind config dengan custom colors sesuai brand dari website existing
- Setup dark mode dengan next-themes
- Setup Pexels API integration dengan environment variables
- Commit `bun.lockb` sebagai lockfile

### 2. Data Layer

- File `lib/data/services.ts` berisi struktur data layanan dengan semua sub-layanan
- File `lib/data/company.ts` berisi data perusahaan (visi, misi, kontak)
- File `lib/data/organization.ts` berisi data struktur organisasi lengkap

### 3. Color Profile (Mengikuti Website Existing)

Berdasarkan website existing, color palette yang digunakan:**Primary Colors:**

- **Dark Green** (`#1a4d3a` atau serupa) - Header background
- **Teal/Dark Teal** (`#0d9488` atau serupa) - CTA buttons, accents
- **Green** (various shades) - Logo, brand elements
- Light green: `#10b981`
- Medium green: `#059669`
- Dark green: `#047857`

**Secondary Colors:**

- **Blue** (`#0ea5e9` atau serupa) - Logo wavy line, accents
- **Brownish-Gold/Tan** (`#d97706` atau `#a16207`) - Logo base, earth tones

**Neutral Colors:**

- **White** (`#ffffff`) - Text pada dark backgrounds, backgrounds
- **Dark Gray** (`#374151` atau `#1f2937`) - Text pada light backgrounds
- **Black** (`#000000`) - Headings pada light backgrounds

**Semantic Colors:**

- Background overlays: Semi-transparent dark overlay untuk readability
- Hero section: Blurred natural landscape background

**Tailwind Config:**

```typescript
colors: {
  primary: {
    dark: '#1a4d3a',      // Header background
    DEFAULT: '#059669',   // Main green
    light: '#10b981',     // Light green
  },
  teal: {
    DEFAULT: '#0d9488',   // CTA buttons
    dark: '#0f766e',
  },
  blue: {
    DEFAULT: '#0ea5e9',   // Logo accent
  },
  earth: {
    DEFAULT: '#d97706',   // Brownish-gold
    dark: '#a16207',
  },
  // ... default grays, whites, blacks
}
```



### 4. Styling Strategy

- Tailwind 4 dengan custom theme colors sesuai color profile di atas
- Responsive design (mobile-first)
- Dark mode dengan toggle switch (next-themes) - menggunakan color profile yang sama dengan adjustments
- Animasi kompleks dengan Framer Motion:
- Scroll-triggered animations
- Page transitions
- Micro-interactions pada buttons dan cards
- Parallax effects pada hero section
- Stagger animations untuk list items
- Typography: Clean sans-serif, bold untuk headings, regular untuk body text

### 5. Images dari Pexels API

- Integrasi Pexels API dengan environment variable `NEXT_PUBLIC_PEXELS_API_KEY`
- Server-side fetching untuk optimasi
- Kategori gambar: landscape (natural parks, trees), construction, legal documents, drone mapping, survey
- Hero section: Gunakan gambar natural landscape (trees, park) dengan blur effect seperti website existing
- Fallback images jika API gagal
- Optimize images dengan Next.js Image component
- Caching strategy untuk performa

### 6. Form Kontak

- Integrasi dengan Formspree atau EmailJS
- Validasi client-side dengan React Hook Form atau Zod
- Loading states dan success/error handling
- Environment variable untuk form endpoint

### 7. Content Management

- Hardcode content dalam TypeScript files untuk MVP
- Struktur data yang mudah di-maintain dan extend
- Bahasa Indonesia saja (tidak perlu i18n untuk sekarang)

## Fitur Utama

1. **Responsive Navigation** - Mobile-friendly dengan hamburger menu (Radix Navigation Menu)
2. **Service Details** - Accordion untuk detail layanan yang dapat di-expand dengan animasi
3. **Contact Form** - Form dengan integrasi Formspree/EmailJS dan validasi client-side
4. **Dark Mode** - Toggle dark/light mode dengan next-themes, persist di localStorage
5. **Animasi Lengkap** - Scroll animations, page transitions, micro-interactions dengan Framer Motion
6. **Pexels API Integration** - Dynamic images dari Pexels dengan caching
7. **Struktur Organisasi** - Visualisasi struktur organisasi dengan data lengkap
8. **SEO Optimization** - Meta tags, structured data, Open Graph
9. **Performance** - Image optimization, code splitting, lazy loading
10. **Accessibility** - ARIA labels, keyboard navigation (Radix handles this)

## Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "framer-motion": "^11.0.0",
    "next-themes": "^0.3.0",
    "lucide-react": "^0.400.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.4.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0"
  }
}
```

Install dengan Bun:

- `bun add next react react-dom @radix-ui/react-accordion @radix-ui/react-dialog @radix-ui/react-navigation-menu framer-motion next-themes lucide-react tailwindcss typescript zod react-hook-form @hookform/resolvers`
- Lockfile: `bun.lockb`

## Environment Variables

File `.env.local` diperlukan:

```javascript
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key
NEXT_PUBLIC_FORMSPREE_ID=your_formspree_id
# atau
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```



## Prioritas Implementasi

1. **Phase 1**: Setup project, layout dasar, halaman utama
2. **Phase 2**: Halaman layanan dengan detail lengkap