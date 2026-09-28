// ============================================================
// MOCK DATA — Ikatan Periset Indonesia
// Ganti dengan Supabase queries ketika sudah terhubung
// ============================================================

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  avatar?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  imageUrl: string;
  category: string;
  author: string;
};

export type Employee = {
  id: string;
  name: string;
  nip: string;
  bidangRiset: string;
  jabatan: string;
  email: string;
  phone: string;
  status: "aktif" | "nonaktif";
  lokasiHub?: string;
};

export type ResearchHub = {
  id: string;
  name: string;
  shortName: string;
  region: "Jawa-Banten" | "Sumatera" | "Kalimantan" | "Sulawesi" | "Bali-Nusra" | "Maluku-Papua";
  city: string;
  province: string;
  perisetCount: number;
  fokusRiset: string;
  facilities: string[];
  x: number;
  y: number;
};

export type ProgramKerja = {
  id: string;
  nama: string;
  divisi: string;
  tenggat: string;
  status: "belum-mulai" | "berjalan" | "selesai" | "tertunda";
  progress: number;
  penanggungJawab: string;
};

export type MonevItem = {
  id: string;
  programId: string;
  namaProgram: string;
  indikator: string;
  target: string;
  realisasi: string;
  capaian: number;
  periode: string;
  keterangan: string;
};

// ─── Users ────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Dr. Ahmad Rizki",
    email: "admin@periset.or.id",
    role: "admin",
    avatar: "",
  },
  {
    id: "u2",
    name: "Siti Nurhaliza",
    email: "operator@periset.or.id",
    role: "operator",
    avatar: "",
  },
];

// Default login credential (mock)
export const MOCK_CREDENTIALS = {
  email: "admin@periset.or.id",
  password: "admin123",
};

// ─── Berita ────────────────────────────────────────────────
export const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "Konferensi Nasional Periset Indonesia 2026 Resmi Dibuka",
    summary:
      "Ribuan periset dari seluruh penjuru Indonesia berkumpul dalam ajang tahunan bergengsi yang membahas inovasi riset terkini di berbagai bidang.",
    content: `Konferensi Nasional Periset Indonesia 2026 resmi dibuka pada Senin, 21 September 2026 di Jakarta Convention Center. Acara yang dihadiri oleh lebih dari 3.000 periset dari seluruh Indonesia ini mengusung tema "Inovasi Riset untuk Indonesia Emas 2045".

Ketua Ikatan Periset Indonesia, Prof. Dr. Bambang Susanto, dalam sambutan pembukaan menyampaikan bahwa konferensi ini merupakan wadah penting bagi para periset untuk berbagi hasil riset terbaru dan membangun jejaring kolaborasi antar lembaga riset di Indonesia.

Konferensi berlangsung selama tiga hari (21-23 September 2026) dengan menampilkan lebih dari 200 sesi presentasi, workshop, dan panel diskusi. Berbagai topik riset diangkat mulai dari teknologi informasi, kesehatan, energi terbarukan, hingga sosial humaniora.

Selain itu, pameran inovasi riset juga digelar bersamaan dengan konferensi, menampilkan hasil-hasil riset terapan yang siap diimplementasikan di masyarakat. Lebih dari 50 lembaga riset dan universitas berpartisipasi dalam pameran tersebut.`,
    date: "2026-09-21",
    imageUrl: "https://picsum.photos/seed/conf2026/800/450",
    category: "Acara",
    author: "Redaksi IPI",
  },
  {
    id: "2",
    title: "Periset Indonesia Raih Penghargaan Riset Terbaik ASEAN",
    summary:
      "Tim periset dari Ikatan Periset Indonesia berhasil meraih penghargaan bergengsi di tingkat ASEAN atas inovasi dalam bidang energi terbarukan.",
    content: `Tim periset Indonesia yang tergabung dalam Ikatan Periset Indonesia (IPI) berhasil meraih penghargaan ASEAN Research Excellence Award 2026 dalam kategori Energi Terbarukan. Penghargaan diserahkan dalam ASEAN Science and Technology Conference yang berlangsung di Singapura pada 15 September 2026.

Tim yang dipimpin oleh Dr. Maya Putri dari Divisi Energi dan Lingkungan IPI ini berhasil mengembangkan teknologi panel surya berbasis material lokal yang memiliki efisiensi 23% lebih tinggi dibandingkan panel surya konvensional dengan biaya produksi 40% lebih rendah.

"Ini adalah bukti bahwa periset Indonesia mampu bersaing di tingkat internasional. Kami berterima kasih atas dukungan IPI dan seluruh komunitas periset Indonesia," ujar Dr. Maya Putri usai menerima penghargaan.

Ke depannya, tim riset ini berencana untuk melakukan uji coba implementasi teknologi tersebut di 10 desa terpencil di Indonesia sebagai bagian dari program riset terapan IPI.`,
    date: "2026-09-15",
    imageUrl: "https://picsum.photos/seed/award2026/800/450",
    category: "Prestasi",
    author: "Tim Komunikasi IPI",
  },
  {
    id: "3",
    title: "Program Beasiswa Riset IPI 2027 Dibuka",
    summary:
      "Ikatan Periset Indonesia membuka pendaftaran beasiswa riset untuk 100 periset muda Indonesia yang ingin melanjutkan studi dan penelitian.",
    content: `Ikatan Periset Indonesia (IPI) resmi membuka pendaftaran Program Beasiswa Riset IPI 2027 mulai 1 Oktober 2026. Program ini menyediakan beasiswa penuh untuk 100 periset muda Indonesia yang ingin melanjutkan riset atau studi lanjut di dalam maupun luar negeri.

Beasiswa mencakup biaya tuition fee, biaya hidup, asuransi kesehatan, dan dana riset. Selain itu, para penerima beasiswa akan mendapat mentoring dari periset senior IPI dan akses ke jaringan riset internasional.

Syarat pendaftaran:
- Warga Negara Indonesia
- Usia maksimal 35 tahun
- Memiliki minimal 2 publikasi ilmiah di jurnal terindeks
- Proposal riset yang relevan dengan prioritas riset nasional

Pendaftaran dilakukan secara online melalui portal resmi IPI dan ditutup pada 31 Desember 2026. Pengumuman penerima beasiswa akan dilakukan pada Maret 2027.`,
    date: "2026-09-10",
    imageUrl: "https://picsum.photos/seed/beasiswa2027/800/450",
    category: "Program",
    author: "Divisi Program IPI",
  },
  {
    id: "4",
    title: "Kolaborasi IPI dan BRIN dalam Riset Ketahanan Pangan",
    summary:
      "Ikatan Periset Indonesia menandatangani MoU dengan BRIN untuk program riset kolaboratif dalam mendukung ketahanan pangan nasional.",
    content: `Ikatan Periset Indonesia (IPI) dan Badan Riset dan Inovasi Nasional (BRIN) resmi menandatangani Memorandum of Understanding (MoU) tentang program riset kolaboratif dalam bidang ketahanan pangan nasional. Penandatanganan berlangsung di Gedung BRIN, Jakarta, pada 5 September 2026.

Program kolaborasi ini akan mencakup penelitian bersama dalam pengembangan varietas unggul tanaman pangan, teknologi pertanian presisi, dan sistem pangan berkelanjutan. Total anggaran yang dialokasikan untuk program ini mencapai Rp 50 miliar selama 3 tahun.

"Kolaborasi ini merupakan langkah strategis untuk memperkuat ekosistem riset Indonesia, khususnya dalam menghadapi tantangan ketahanan pangan di tengah perubahan iklim global," ujar Ketua IPI, Prof. Dr. Bambang Susanto.

Program akan dimulai pada Januari 2027 dan melibatkan lebih dari 200 periset dari kedua lembaga.`,
    date: "2026-09-05",
    imageUrl: "https://picsum.photos/seed/mou2026/800/450",
    category: "Kolaborasi",
    author: "Redaksi IPI",
  },
  {
    id: "5",
    title: "Workshop Metodologi Riset Kualitatif Angkatan XII",
    summary:
      "IPI menyelenggarakan workshop metodologi riset kualitatif untuk periset muda, dipandu oleh pakar dari Universitas Indonesia dan UGM.",
    content: `Ikatan Periset Indonesia (IPI) kembali menyelenggarakan Workshop Metodologi Riset Kualitatif Angkatan XII pada 28-30 Agustus 2026 di Yogyakarta. Workshop ini diikuti oleh 150 peserta dari berbagai daerah di Indonesia.

Workshop dipandu oleh dua pakar terkemuka: Prof. Dr. Hendra Kurniawan dari Universitas Indonesia dan Dr. Ratna Dewi dari Universitas Gadjah Mada. Materi workshop mencakup desain penelitian kualitatif, teknik pengumpulan data, analisis tematik, dan penulisan laporan riset.

Peserta mendapatkan pengalaman praktis melalui simulasi penelitian lapangan di komunitas lokal Yogyakarta. Selain itu, sesi mentoring one-on-one dengan fasilitator juga disediakan untuk membantu peserta mengembangkan proposal riset masing-masing.

Workshop ini merupakan bagian dari program peningkatan kapasitas periset Indonesia yang diselenggarakan IPI secara berkala sepanjang tahun.`,
    date: "2026-08-28",
    imageUrl: "https://picsum.photos/seed/workshop2026/800/450",
    category: "Workshop",
    author: "Divisi Pendidikan IPI",
  },
  {
    id: "6",
    title: "Jurnal Riset IPI Terindeks Scopus",
    summary:
      "Jurnal Ilmiah Periset Indonesia (JIPI) resmi terindeks dalam database Scopus, meningkatkan pengakuan internasional publikasi riset Indonesia.",
    content: `Jurnal Ilmiah Periset Indonesia (JIPI) yang diterbitkan oleh Ikatan Periset Indonesia resmi diterima dan terindeks dalam database Scopus, salah satu database publikasi ilmiah terkemuka di dunia. Pengumuman ini diterima pada 20 Agustus 2026 dan disambut dengan suka cita oleh komunitas periset Indonesia.

Pengindeksan JIPI di Scopus merupakan hasil dari kerja keras selama tiga tahun dalam meningkatkan standar kualitas jurnal, mulai dari proses peer review yang ketat, konsistensi penerbitan, hingga peningkatan kualitas artikel yang dipublikasikan.

"Ini adalah pencapaian bersejarah bagi komunitas periset Indonesia. Dengan terindeksnya JIPI di Scopus, artikel-artikel periset Indonesia akan lebih mudah diakses oleh komunitas ilmiah internasional," ujar Editor-in-Chief JIPI, Prof. Dr. Suhardi.

JIPI terbit enam kali dalam setahun dan menerima artikel dalam bahasa Indonesia dan Inggris dari berbagai bidang ilmu.`,
    date: "2026-08-20",
    imageUrl: "https://picsum.photos/seed/scopus2026/800/450",
    category: "Publikasi",
    author: "Redaksi JIPI",
  },
];

// ─── Research Hubs Indonesia ──────────────────────────────
export const RESEARCH_HUBS: ResearchHub[] = [
  {
    id: "hub-gatsu",
    name: "BRIN Gatot Subroto",
    shortName: "Gatot Subroto",
    region: "Jawa-Banten",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    perisetCount: 45,
    fokusRiset: "Kebijakan Riset & Manajemen Inovasi Nasional",
    facilities: ["Pusat Data Riset Nasional", "Ruang Sidang Majelis Etik", "Inkubator Kebijakan"],
    x: 310,
    y: 345,
  },
  {
    id: "hub-serpong",
    name: "BRIN Serpong (B.J. Habibie)",
    shortName: "Serpong",
    region: "Jawa-Banten",
    city: "Tangerang Selatan",
    province: "Banten",
    perisetCount: 68,
    fokusRiset: "Teknologi Nuklir, Nanomaterial & Energi Bersih",
    facilities: ["Reaktor Riset Serba Guna", "Lab Nanoteknologi", "Fasilitas Pengujian Polimer"],
    x: 295,
    y: 352,
  },
  {
    id: "hub-cibinong",
    name: "KST Soekarno Cibinong",
    shortName: "Cibinong",
    region: "Jawa-Banten",
    city: "Bogor",
    province: "Jawa Barat",
    perisetCount: 54,
    fokusRiset: "Genomika Hayati, Bioteknologi Tropis & Biodiversitas",
    facilities: ["National Herbarium Bogoriense", "Lab Cryo-EM", "Bank Gen Nusantara"],
    x: 318,
    y: 360,
  },
  {
    id: "hub-bandung",
    name: "BRIN Samaun Samadikun Bandung",
    shortName: "Bandung",
    region: "Jawa-Banten",
    city: "Bandung",
    province: "Jawa Barat",
    perisetCount: 38,
    fokusRiset: "Mikroelektronika, Antariksa & Instrumentasi Cerdas",
    facilities: ["Cleanroom Semikonduktor", "Observatorium Astronomi", "Lab Satelit Nano"],
    x: 345,
    y: 365,
  },
  {
    id: "hub-yogya",
    name: "BRIN Yogyakarta / Karangsambung",
    shortName: "Yogyakarta",
    region: "Jawa-Banten",
    city: "Sleman / Kebumen",
    province: "DI Yogyakarta",
    perisetCount: 32,
    fokusRiset: "Geosains Dinamis, Arkeologi & Kebencanaan",
    facilities: ["Kawasan Konservasi Geologi", "Lab Spektrometri Massa", "Stasiun Gempa Merapi"],
    x: 410,
    y: 375,
  },
  {
    id: "hub-surabaya",
    name: "BRIN Sukolilo Surabaya",
    shortName: "Surabaya",
    region: "Jawa-Banten",
    city: "Surabaya",
    province: "Jawa Timur",
    perisetCount: 29,
    fokusRiset: "Teknologi Maritim, Bioproses & Fabrikasi Presisi",
    facilities: ["Tow-tank Hidrodinamika", "Lab Fabrikasi Sensor Maritim"],
    x: 470,
    y: 372,
  },
  {
    id: "hub-medan",
    name: "BRIN Kawasan Sumatera (Medan)",
    shortName: "Medan",
    region: "Sumatera",
    city: "Medan",
    province: "Sumatera Utara",
    perisetCount: 26,
    fokusRiset: "Agroindustri Tropis & Bio-Refinery Sawit Berkelanjutan",
    facilities: ["Lab Bioproses Agrikultur", "Pusat Uji Varietas Kelapa Sawit"],
    x: 135,
    y: 120,
  },
  {
    id: "hub-lampung",
    name: "BRIN Lampung",
    shortName: "Lampung",
    region: "Sumatera",
    city: "Bandar Lampung",
    province: "Lampung",
    perisetCount: 18,
    fokusRiset: "Ketahanan Pangan Sumatera & Teknologi Pascapanen",
    facilities: ["Pilot Plant Ekstraksi Pati", "Lab Mikrobiologi Pangan"],
    x: 245,
    y: 305,
  },
  {
    id: "hub-ikn",
    name: "KST Nusantara IKN",
    shortName: "IKN Nusantara",
    region: "Kalimantan",
    city: "Sepaku",
    province: "Kalimantan Timur",
    perisetCount: 22,
    fokusRiset: "Restorasi Hutan Hujan Tropis & Smart Eco-City",
    facilities: ["Kanopi Tower Pengamatan Ekologi", "Lab Sensor IoT Hutan"],
    x: 480,
    y: 235,
  },
  {
    id: "hub-makassar",
    name: "BRIN Makassar",
    shortName: "Makassar",
    region: "Sulawesi",
    city: "Makassar",
    province: "Sulawesi Selatan",
    perisetCount: 25,
    fokusRiset: "Biodiversitas Laut Dalam & Bioprospeksi Terumbu Karang",
    facilities: ["Kapal Riset Wallacea", "Aquarium Bioprospeksi Laut"],
    x: 565,
    y: 285,
  },
  {
    id: "hub-denpasar",
    name: "BRIN Denpasar",
    shortName: "Denpasar",
    region: "Bali-Nusra",
    city: "Denpasar / Tabanan",
    province: "Bali",
    perisetCount: 19,
    fokusRiset: "Etnobotani Tradisional & Konservasi Sumber Genetik",
    facilities: ["Kebun Raya Eka Karya", "Bank Plasma Nutfah Tumbuhan Obat"],
    x: 525,
    y: 385,
  },
  {
    id: "hub-ambon",
    name: "BRIN Ambon",
    shortName: "Ambon",
    region: "Maluku-Papua",
    city: "Ambon",
    province: "Maluku",
    perisetCount: 14,
    fokusRiset: "Oseanografi Fisika & Bio-akustik Laut Banda",
    facilities: ["Pusat Oseanografi Banda", "Mooring Buoy Sensor Laut"],
    x: 745,
    y: 260,
  },
  {
    id: "hub-jayapura",
    name: "BRIN Jayapura / Biak",
    shortName: "Papua / Biak",
    region: "Maluku-Papua",
    city: "Jayapura & Biak",
    province: "Papua",
    perisetCount: 16,
    fokusRiset: "Biodiversitas Pegunungan Tengah & Telemetri Antariksa",
    facilities: ["Stasiun Pelacak Satelit Biak", "Herbarium Papuaensis"],
    x: 920,
    y: 250,
  },
];

// ─── Karyawan / Periset ────────────────────────────────────
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "e1",
    name: "Prof. Dr. Bambang Susanto",
    nip: "197801012005011001",
    bidangRiset: "Kebijakan Riset & Inovasi",
    jabatan: "Ketua Umum",
    email: "bambang.susanto@periset.or.id",
    phone: "081234567890",
    status: "aktif",
    lokasiHub: "BRIN Gatot Subroto",
  },
  {
    id: "e2",
    name: "Dr. Maya Putri",
    nip: "198503152010012002",
    bidangRiset: "Energi Terbarukan",
    jabatan: "Kepala Divisi Energi",
    email: "maya.putri@periset.or.id",
    phone: "081234567891",
    status: "aktif",
    lokasiHub: "BRIN Serpong (B.J. Habibie)",
  },
  {
    id: "e3",
    name: "Dr. Hendra Wijaya",
    nip: "197912202008011003",
    bidangRiset: "Bioteknologi",
    jabatan: "Peneliti Utama",
    email: "hendra.wijaya@periset.or.id",
    phone: "081234567892",
    status: "aktif",
    lokasiHub: "KST Soekarno Cibinong",
  },
  {
    id: "e4",
    name: "Siti Rahayu, M.Sc.",
    nip: "199002102015012004",
    bidangRiset: "Sosial Humaniora",
    jabatan: "Peneliti Madya",
    email: "siti.rahayu@periset.or.id",
    phone: "081234567893",
    status: "aktif",
    lokasiHub: "BRIN Yogyakarta / Karangsambung",
  },
  {
    id: "e5",
    name: "Budi Santoso, M.T.",
    nip: "198807122012011005",
    bidangRiset: "Teknologi Informasi & AI",
    jabatan: "Peneliti Madya",
    email: "budi.santoso@periset.or.id",
    phone: "081234567894",
    status: "aktif",
    lokasiHub: "BRIN Samaun Samadikun Bandung",
  },
  {
    id: "e6",
    name: "Dewi Lestari, S.Si.",
    nip: "199506302020012006",
    bidangRiset: "Ilmu Lingkungan & Hutan Tropis",
    jabatan: "Peneliti Pertama",
    email: "dewi.lestari@periset.or.id",
    phone: "081234567895",
    status: "aktif",
    lokasiHub: "KST Nusantara IKN",
  },
  {
    id: "e7",
    name: "Agus Prasetyo, M.Si.",
    nip: "198204152014011007",
    bidangRiset: "Kelautan & Perikanan",
    jabatan: "Peneliti Muda",
    email: "agus.prasetyo@periset.or.id",
    phone: "081234567896",
    status: "nonaktif",
    lokasiHub: "BRIN Sukolilo Surabaya",
  },
  {
    id: "e8",
    name: "Rina Kusumawati, Ph.D.",
    nip: "197706082007012008",
    bidangRiset: "Kesehatan Masyarakat & Virologi",
    jabatan: "Kepala Divisi Kesehatan",
    email: "rina.kusumawati@periset.or.id",
    phone: "081234567897",
    status: "aktif",
    lokasiHub: "BRIN Gatot Subroto",
  },
  {
    id: "e9",
    name: "Dr. Ir. Tengku Iskandar, M.Eng.",
    nip: "198108172006041009",
    bidangRiset: "Agroindustri & Biosintesis",
    jabatan: "Peneliti Utama",
    email: "tengku.iskandar@periset.or.id",
    phone: "081234567898",
    status: "aktif",
    lokasiHub: "BRIN Kawasan Sumatera (Medan)",
  },
  {
    id: "e10",
    name: "Dr. Andi Bau Massepe",
    nip: "198611252011011010",
    bidangRiset: "Oseanografi & Ekosistem Terumbu Karang",
    jabatan: "Peneliti Madya",
    email: "andi.bau@periset.or.id",
    phone: "081234567899",
    status: "aktif",
    lokasiHub: "BRIN Makassar",
  },
  {
    id: "e11",
    name: "Ida Bagus Sudharma, M.Si.",
    nip: "198904032014021011",
    bidangRiset: "Etnobotani & Farmasi Herbal",
    jabatan: "Peneliti Muda",
    email: "ib.sudharma@periset.or.id",
    phone: "081234567811",
    status: "aktif",
    lokasiHub: "BRIN Denpasar",
  },
  {
    id: "e12",
    name: "Dr. Yolanda Rumere, M.Sc.",
    nip: "198709122013012012",
    bidangRiset: "Biodiversitas Endemik Papua & Ekologi",
    jabatan: "Peneliti Madya",
    email: "yolanda.rumere@periset.or.id",
    phone: "081234567812",
    status: "aktif",
    lokasiHub: "BRIN Jayapura / Biak",
  },
];

// ─── Program Kerja ─────────────────────────────────────────
export const MOCK_PROGRAMS: ProgramKerja[] = [
  {
    id: "p1",
    nama: "Penyusunan Roadmap Riset Nasional 2027-2032",
    divisi: "Divisi Kebijakan",
    tenggat: "2026-12-31",
    status: "berjalan",
    progress: 65,
    penanggungJawab: "Prof. Dr. Bambang Susanto",
  },
  {
    id: "p2",
    nama: "Program Beasiswa Riset IPI 2027",
    divisi: "Divisi Program",
    tenggat: "2026-12-31",
    status: "berjalan",
    progress: 40,
    penanggungJawab: "Dr. Rina Kusumawati",
  },
  {
    id: "p3",
    nama: "Konferensi Nasional Periset Indonesia 2026",
    divisi: "Divisi Acara",
    tenggat: "2026-09-23",
    status: "selesai",
    progress: 100,
    penanggungJawab: "Siti Rahayu",
  },
  {
    id: "p4",
    nama: "Riset Kolaborasi Ketahanan Pangan (MoU BRIN)",
    divisi: "Divisi Riset Terapan",
    tenggat: "2027-01-31",
    status: "belum-mulai",
    progress: 0,
    penanggungJawab: "Dr. Maya Putri",
  },
  {
    id: "p5",
    nama: "Workshop Metodologi Riset Seri 2026",
    divisi: "Divisi Pendidikan",
    tenggat: "2026-11-30",
    status: "berjalan",
    progress: 75,
    penanggungJawab: "Dr. Hendra Wijaya",
  },
  {
    id: "p6",
    nama: "Pengembangan Portal Riset Digital IPI",
    divisi: "Divisi IT",
    tenggat: "2026-10-31",
    status: "tertunda",
    progress: 30,
    penanggungJawab: "Budi Santoso",
  },
  {
    id: "p7",
    nama: "Penerbitan Jurnal JIPI Vol. 12",
    divisi: "Divisi Publikasi",
    tenggat: "2026-10-15",
    status: "berjalan",
    progress: 80,
    penanggungJawab: "Dewi Lestari",
  },
];

// ─── Monev ─────────────────────────────────────────────────
export const MOCK_MONEV: MonevItem[] = [
  {
    id: "m1",
    programId: "p1",
    namaProgram: "Penyusunan Roadmap Riset Nasional 2027-2032",
    indikator: "Draft Roadmap Selesai",
    target: "1 Dokumen",
    realisasi: "0.65 Dokumen (draft 65%)",
    capaian: 65,
    periode: "Q3 2026",
    keterangan: "Sedang dalam proses konsultasi publik",
  },
  {
    id: "m2",
    programId: "p2",
    namaProgram: "Program Beasiswa Riset IPI 2027",
    indikator: "Jumlah Pendaftar",
    target: "500 Pendaftar",
    realisasi: "200 Pendaftar",
    capaian: 40,
    periode: "Q3 2026",
    keterangan: "Pendaftaran baru dibuka Oktober 2026",
  },
  {
    id: "m3",
    programId: "p3",
    namaProgram: "Konferensi Nasional Periset Indonesia 2026",
    indikator: "Jumlah Peserta",
    target: "3000 Peserta",
    realisasi: "3250 Peserta",
    capaian: 108,
    periode: "Q3 2026",
    keterangan: "Melebihi target, acara berjalan sukses",
  },
  {
    id: "m4",
    programId: "p5",
    namaProgram: "Workshop Metodologi Riset Seri 2026",
    indikator: "Jumlah Sesi Workshop",
    target: "4 Sesi",
    realisasi: "3 Sesi",
    capaian: 75,
    periode: "Q3 2026",
    keterangan: "Sesi ke-4 dijadwalkan November 2026",
  },
  {
    id: "m5",
    programId: "p7",
    namaProgram: "Penerbitan Jurnal JIPI Vol. 12",
    indikator: "Artikel Terbit",
    target: "30 Artikel",
    realisasi: "24 Artikel",
    capaian: 80,
    periode: "Q3 2026",
    keterangan: "6 artikel masih dalam proses review",
  },
  {
    id: "m6",
    programId: "p6",
    namaProgram: "Pengembangan Portal Riset Digital IPI",
    indikator: "Fitur Terselesaikan",
    target: "10 Fitur",
    realisasi: "3 Fitur",
    capaian: 30,
    periode: "Q3 2026",
    keterangan: "Terkendala anggaran dan SDM IT",
  },
];
