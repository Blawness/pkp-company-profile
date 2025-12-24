export type ServiceSection = {
  title: string;
  items: (string | { question: string; answer: string })[];
};

export type MainService = {
  id:
    | "konsultasi-hukum-pertanahan"
    | "pengurusan-sertifikat-tanah"
    | "pengukuran-lahan";
  title: string;
  description: string;
  imageQuery: string;
  sections: ServiceSection[];
};

export const services: MainService[] = [
  {
    id: "konsultasi-hukum-pertanahan",
    title: "Konsultasi Hukum Pertanahan",
    description:
      "Ditujukan untuk membantu klien memahami, menganalisa, dan menyelesaikan berbagai permasalahan hukum yang berkaitan dengan tanah dan pemanfaatannya.",
    imageQuery: "lawyer desk documents",
    sections: [
      {
        title: "Layanan bantuan dan FAQ",
        items: [
          {
            question:
              "Apa saja persyaratan mengajukan permohonan sertifikat hak guna bangunan untuk pertama kali?",
            answer:
              "Persyaratan umum meliputi KTP, KK, bukti perolehan tanah (seperti Akta Jual Beli), bukti pembayaran PBB tahun terakhir, dan surat pernyataan penguasaan fisik bidang tanah.",
          },
          {
            question: "Bagaimana tata cara permohonan sertifikat yang tepat?",
            answer:
              "Proses diawali dengan pengumpulan dokumen alas hak, pendaftaran di kantor pertanahan, dilanjutkan dengan pengukuran fisik oleh petugas, pengumuman data fisik dan yuridis, hingga akhirnya penerbitan sertifikat.",
          },
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
    imageQuery: "land certificate map",
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
  {
    id: "pengukuran-lahan",
    title: "Pengukuran Lahan",
    description:
      "Ditujukan untuk membantu memastikan data ukur dan batas bidang tanah tersusun jelas sebagai dasar administrasi, perencanaan, maupun proses lanjutan yang diperlukan.",
    imageQuery: "land surveyor measurement",
    sections: [
      {
        title: "Cakupan Layanan",
        items: [
          "Pengukuran bidang tanah sesuai kebutuhan klien",
          "Identifikasi dan penegasan batas bidang tanah (berdasarkan dokumen/penunjukan pihak terkait)",
          "Penyusunan ringkasan hasil pengukuran untuk kebutuhan administrasi",
        ],
      },
      {
        title: "Dokumen & Data yang Umum Dibutuhkan",
        items: [
          "Dokumen kepemilikan/alas hak (jika ada)",
          "Identitas pemohon/pihak terkait",
          "Informasi lokasi dan batas-batas yang diketahui",
        ],
      },
    ],
  },
] as const;
