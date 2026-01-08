export type ServiceSection = {
  id: string; // Used as key for translation
};

export type MainService = {
  id:
    | "konsultasi-hukum-pertanahan"
    | "pengurusan-sertifikat-tanah"
    | "pengukuran-lahan";
  imageQuery?: string;
  imageUrl?: string;
  sectionIds: string[];
};

export const services: MainService[] = [
  {
    id: "konsultasi-hukum-pertanahan",
    imageQuery: "lawyer desk documents",
    imageUrl: "https://i.imgur.com/zWVfFts.png",
    sectionIds: ["faq", "legal-study"],
  },
  {
    id: "pengurusan-sertifikat-tanah",
    imageQuery: "land certificate map",
    imageUrl: "https://i.imgur.com/C35dax8.png",
    sectionIds: ["first-time", "rights", "transfer", "split-merge", "lsd"],
  },
  {
    id: "pengukuran-lahan",
    imageQuery: "land surveyor measurement",
    imageUrl: "https://i.imgur.com/oydFSec.png",
    sectionIds: ["scope", "docs"],
  },
] as const;
