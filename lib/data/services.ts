export type ServiceSection = {
  title: string;
  items: string[];
};

export type MainService = {
  id: "konsultasi-hukum-pertanahan" | "pengurusan-sertifikat-tanah";
  title: string;
  description: string;
  sections: ServiceSection[];
};

export const services: MainService[] = [
  {
    id: "konsultasi-hukum-pertanahan",
    title: "Konsultasi Hukum Pertanahan",
    description:
      "Ditujukan untuk membantu klien memahami, menganalisa, dan menyelesaikan berbagai permasalahan hukum yang berkaitan dengan tanah dan pemanfaatannya.",
    sections: [
      {
        title: "Layanan bantuan dan FAQ",
        items: [
          "Apa saja persyaratan mengajukan permohonan sertifikat hak guna bangunan untuk pertama kali?",
          "Bagaimana tata cara permohonan sertifikat yang tepat?",
        ],
      },
      {
        title: "Layanan Kajian Hukum",
        items: [
          "Konsultasi permasalahan hukum",
          "Penyusunan dan pemberian legal opinion pertanahan",
          "Konsultasi kepatuhan terhadap peraturan pertanahan dan tata ruang yang berlaku",
        ],
      },
    ],
  },
  {
    id: "pengurusan-sertifikat-tanah",
    title: "Jasa Pengurusan Sertifikat Tanah",
    description:
      "Ditujukan untuk memastikan seluruh proses dilaksanakan sesuai peraturan yang berlaku, secara profesional, transparan, dan berintegritas.",
    sections: [
      {
        title: "Pendaftaran Tanah Pertama Kali",
        items: [
          "Pendampingan dan pemeriksaan fisik bidang tanah",
          "Validasi peta bidang tanah",
          "Pendampingan proses penerbitan sertifikat tanah",
        ],
      },
      {
        title: "Pengurusan Sertifikat Hak Atas Tanah",
        items: [
          "Pengurusan sertifikasi Hak Milik",
          "Pengurusan penerbitan, perpanjangan dan pembaruan sertifikat HGB",
          "Pengurusan penerbitan, perpanjangan dan pembaruan sertifikat HGU",
          "Pengurusan penerbitan, perpanjangan dan pembaruan sertifikat Hak Pakai",
        ],
      },
      {
        title: "Balik Nama Sertifikat",
        items: [
          "Pengecekan dan validasi sertifikat",
          "Pendampingan pembuatan akta PPAT",
          "Pendampingan pembayaran PPH dan BPHTB",
        ],
      },
      {
        title: "Pemecahan atau Penggabungan Sertifikat",
        items: ["Pengecekan dan validasi sertifikat", "Validasi dokumen hukum"],
      },
      {
        title: "Pendampingan Sertifikasi LSD (Lahan Sawah yang Dilindungi)",
        items: [
          "Pengurusan Legalitas Pemanfaatan Tanah Lahan Sawah yang Dilindungi (LSD)",
          "Pemenuhan dokumen perizinan peralihan LSD",
          "Pendampingan perizinan KKPR",
          "Pengurusan penerbitan rekomendasi LSD",
        ],
      },
    ],
  },
] as const;


