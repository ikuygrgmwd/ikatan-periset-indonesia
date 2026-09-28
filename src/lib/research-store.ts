// Browser-local demo database. Authorization here models application permissions;
// production must enforce the same rules in a server-side database/auth service.
export type Role = "admin" | "periset";
export type Account = {
  id: string;
  name: string;
  email: string;
  role: Role;
  password: string;
};
export type Profile = {
  userId: string;
  bio: string;
  avatar: string;
  locationId: string;
  bidangRiset: string;
  jabatan: string;
  nip: string;
  phone: string;
  status: "aktif" | "nonaktif";
  notifications: {
    emailBerita: boolean;
    emailProgram: boolean;
    emailMonev: boolean;
    systemAlert: boolean;
  };
};
export type PortfolioKind = "publications" | "copyrights" | "works";
export type PortfolioEntry = {
  id: string;
  userId: string;
  title: string;
  year: number;
  description: string;
  publisher: string;
  identifier: string;
  url: string;
  createdAt: string;
  updatedAt: string;
};
export type Database = {
  version: 1;
  accounts: Account[];
  profiles: Profile[];
  publications: PortfolioEntry[];
  copyrights: PortfolioEntry[];
  works: PortfolioEntry[];
};
export const LOCATIONS = [
  {
    id: "medan",
    name: "Medan",
    region: "Sumatra Utara",
    lon: 98.67,
    lat: 3.59,
  },
  {
    id: "padang",
    name: "Padang",
    region: "Sumatra Barat",
    lon: 100.35,
    lat: -0.95,
  },
  {
    id: "jakarta",
    name: "Jakarta",
    region: "DKI Jakarta",
    lon: 106.85,
    lat: -6.21,
  },
  {
    id: "bandung",
    name: "Bandung",
    region: "Jawa Barat",
    lon: 107.62,
    lat: -6.92,
  },
  {
    id: "yogyakarta",
    name: "Yogyakarta",
    region: "DI Yogyakarta",
    lon: 110.37,
    lat: -7.8,
  },
  {
    id: "surabaya",
    name: "Surabaya",
    region: "Jawa Timur",
    lon: 112.75,
    lat: -7.25,
  },
  { id: "denpasar", name: "Denpasar", region: "Bali", lon: 115.22, lat: -8.65 },
  {
    id: "pontianak",
    name: "Pontianak",
    region: "Kalimantan Barat",
    lon: 109.34,
    lat: -0.03,
  },
  {
    id: "samarinda",
    name: "Samarinda",
    region: "Kalimantan Timur",
    lon: 117.15,
    lat: -0.5,
  },
  {
    id: "makassar",
    name: "Makassar",
    region: "Sulawesi Selatan",
    lon: 119.41,
    lat: -5.15,
  },
  {
    id: "manado",
    name: "Manado",
    region: "Sulawesi Utara",
    lon: 124.84,
    lat: 1.47,
  },
  {
    id: "kupang",
    name: "Kupang",
    region: "Nusa Tenggara Timur",
    lon: 123.61,
    lat: -10.18,
  },
  { id: "ambon", name: "Ambon", region: "Maluku", lon: 128.18, lat: -3.7 },
  {
    id: "jayapura",
    name: "Jayapura",
    region: "Papua",
    lon: 140.72,
    lat: -2.53,
  },
] as const;
export const PORTFOLIO_LABELS: Record<PortfolioKind, string> = {
  publications: "Publikasi",
  copyrights: "Hak Cipta / Paten",
  works: "Karya Lainnya",
};
export const DB_KEY = "ipi_database_v1";
export const SESSION_KEY = "ipi_session_v1";
export function emptyProfile(userId: string, locationId = "jakarta"): Profile {
  return {
    userId,
    locationId,
    bio: "",
    avatar: "",
    bidangRiset: "",
    jabatan: "Periset",
    nip: "",
    phone: "",
    status: "aktif",
    notifications: {
      emailBerita: true,
      emailProgram: true,
      emailMonev: false,
      systemAlert: true,
    },
  };
}
export function createSeedDatabase(): Database {
  const accounts: Account[] = [
    {
      id: "u1",
      name: "Dr. Ahmad Rizki",
      email: "admin@periset.id",
      role: "admin",
      password: "admin123",
    },
    {
      id: "admin2",
      name: "Dr. Ratna Dewi",
      email: "admin2@periset.id",
      role: "admin",
      password: "admin123",
    },
  ];
  const names = [
    "Dr. Maya Putri",
    "Siti Nurhaliza, M.Sc.",
    "Dr. Hendra Wijaya",
    "Siti Rahayu, M.Sc.",
    "Budi Santoso, M.T.",
    "Dewi Lestari, S.Si.",
    "Agus Prasetyo, M.Si.",
    "Rina Kusumawati, Ph.D.",
    "Dr. Andi Saputra",
    "Dr. Maria Latu",
    "Rizal Abdullah, M.Sc.",
    "Dr. Ayu Pramesti",
    "Yohanes Wenda, M.Si.",
    "Dr. Nur Aisyah",
    "Fajar Nugroho, M.T.",
    "Dr. Melati Sari",
  ];
  const fields = [
    "Energi Terbarukan",
    "Sosial Humaniora",
    "Bioteknologi",
    "Kesehatan Masyarakat",
    "Teknologi Informasi",
    "Ilmu Lingkungan",
    "Kelautan & Perikanan",
    "Ketahanan Pangan",
  ];
  names.forEach((name, i) =>
    accounts.push({
      id: `r${i + 1}`,
      name,
      email: `periset${i + 1}@periset.id`,
      role: "periset",
      password: "periset123",
    }),
  );
  const profiles = accounts.map((account, i) => ({
    ...emptyProfile(
      account.id,
      LOCATIONS[Math.max(0, i - 2) % LOCATIONS.length].id,
    ),
    bidangRiset: fields[i % fields.length],
    jabatan: account.role === "admin" ? "Administrator" : "Peneliti",
    nip: `19850101201001${String(i + 1).padStart(4, "0")}`,
    phone: `08123456${String(i).padStart(4, "0")}`,
    bio: `Periset di bidang ${fields[i % fields.length].toLowerCase()} yang berfokus pada kolaborasi dan inovasi untuk masyarakat Indonesia.`,
  }));
  const db: Database = {
    version: 1,
    accounts,
    profiles,
    publications: [],
    copyrights: [],
    works: [],
  };
  const titles = {
    publications: "Studi pengembangan riset berkelanjutan",
    copyrights: "Sistem pemantauan riset terpadu",
    works: "Kolaborasi laboratorium dan masyarakat",
  };
  for (const kind of Object.keys(titles) as PortfolioKind[]) {
    db[kind] = accounts
      .filter((a) => a.role === "periset")
      .map((a, i) => ({
        id: `${kind}-${a.id}`,
        userId: a.id,
        title: `${titles[kind]}: ${fields[i % fields.length]}`,
        year: 2025 + (i % 2),
        description:
          "Contoh portofolio untuk demonstrasi portal IPI. Data ini bersifat fiktif dan dapat diedit atau dihapus oleh pemilik akun.",
        publisher:
          kind === "publications"
            ? "Jurnal Riset Nusantara (Demo)"
            : "Ikatan Periset Indonesia (Demo)",
        identifier: kind === "copyrights" ? `DEMO-HKI-${i + 1}` : "",
        url: "",
        createdAt: "2026-09-01T00:00:00.000Z",
        updatedAt: "2026-09-01T00:00:00.000Z",
      }));
  }
  return db;
}
export type AccountInput = Omit<Account, "id"> & { locationId: string };
export type EntryInput = Omit<
  PortfolioEntry,
  "id" | "userId" | "createdAt" | "updatedAt"
>;
export type Action =
  | { type: "account.save"; id?: string; input: AccountInput }
  | { type: "account.delete"; id: string }
  | {
      type: "profile.save";
      userId: string;
      input: Profile;
      name: string;
      email: string;
    }
  | { type: "password.save"; current: string; password: string }
  | { type: "entry.save"; kind: PortfolioKind; id?: string; input: EntryInput }
  | { type: "entry.delete"; kind: PortfolioKind; id: string };
function ensure(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function validateIdentity(
  db: Database,
  name: string,
  email: string,
  id?: string,
) {
  ensure(name.trim().length >= 2, "Nama minimal 2 karakter.");
  ensure(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Email tidak valid.");
  ensure(
    !db.accounts.some(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.id !== id,
    ),
    "Email sudah digunakan.",
  );
}
export function applyAction(
  db: Database,
  actorId: string | null,
  action: Action,
): Database {
  const actor = db.accounts.find((a) => a.id === actorId);
  ensure(actor, "Silakan masuk terlebih dahulu.");
  const next = structuredClone(db);
  if (action.type === "account.save" || action.type === "account.delete") {
    ensure(actor.role === "admin", "Hanya Admin yang dapat mengelola akun.");
    if (action.id)
      ensure(
        db.accounts.some((a) => a.id === action.id),
        "Akun tidak ditemukan.",
      );
    const target = db.accounts.find((a) => a.id === action.id);
    if (
      target?.role === "admin" &&
      (action.type === "account.delete" || action.input.role !== "admin")
    ) {
      ensure(
        db.accounts.filter((a) => a.role === "admin").length > 1,
        "Minimal satu Admin harus tetap tersedia.",
      );
    }
    if (action.type === "account.delete") {
      ensure(
        action.id !== actor.id,
        "Anda tidak dapat menghapus akun yang sedang digunakan.",
      );
      next.accounts = next.accounts.filter((a) => a.id !== action.id);
      next.profiles = next.profiles.filter((p) => p.userId !== action.id);
      for (const kind of ["publications", "copyrights", "works"] as const)
        next[kind] = next[kind].filter((e) => e.userId !== action.id);
    } else {
      const input = action.input;
      const email = input.email.trim().toLowerCase();
      validateIdentity(db, input.name, email, action.id);
      ensure(
        input.role === "admin" || input.role === "periset",
        "Role tidak valid.",
      );
      ensure(
        LOCATIONS.some((l) => l.id === input.locationId),
        "Pilih lokasi yang valid.",
      );
      const password = input.password || target?.password || "";
      ensure(password.length >= 8, "Password minimal 8 karakter.");
      const id = action.id || crypto.randomUUID();
      const account: Account = {
        id,
        name: input.name.trim(),
        email,
        role: input.role,
        password,
      };
      next.accounts = target
        ? next.accounts.map((a) => (a.id === id ? account : a))
        : [...next.accounts, account];
      next.profiles = target
        ? next.profiles.map((p) =>
            p.userId === id ? { ...p, locationId: input.locationId } : p,
          )
        : [...next.profiles, emptyProfile(id, input.locationId)];
    }
  } else if (action.type === "profile.save") {
    ensure(
      actor.id === action.userId || actor.role === "admin",
      "Anda hanya dapat mengedit profil sendiri.",
    );
    ensure(
      next.profiles.some((p) => p.userId === action.userId),
      "Profil tidak ditemukan.",
    );
    const email = action.email.trim().toLowerCase();
    validateIdentity(db, action.name, email, action.userId);
    ensure(
      LOCATIONS.some((l) => l.id === action.input.locationId),
      "Pilih lokasi yang valid.",
    );
    ensure(
      action.input.bio.length <= 1000,
      "Biografi maksimal 1.000 karakter.",
    );
    ensure(
      !action.input.avatar ||
        (/^data:image\/(png|jpeg|webp);base64,/.test(action.input.avatar) &&
          action.input.avatar.length <= 750000),
      "Foto harus berupa JPG, PNG, atau WebP maksimal 500 KB.",
    );
    next.profiles = next.profiles.map((p) =>
      p.userId === action.userId ? { ...action.input, userId: p.userId } : p,
    );
    next.accounts = next.accounts.map((a) =>
      a.id === action.userId ? { ...a, name: action.name.trim(), email } : a,
    );
  } else if (action.type === "password.save") {
    ensure(actor.password === action.current, "Password saat ini salah.");
    ensure(action.password.length >= 8, "Password minimal 8 karakter.");
    next.accounts = next.accounts.map((a) =>
      a.id === actor.id ? { ...a, password: action.password } : a,
    );
  } else {
    ensure(
      ["publications", "copyrights", "works"].includes(action.kind),
      "Kategori tidak valid.",
    );
    const entry = next[action.kind].find((e) => e.id === action.id);
    if (action.id) {
      ensure(entry, "Karya tidak ditemukan.");
      ensure(
        entry.userId === actor.id || actor.role === "admin",
        "Anda hanya dapat mengelola karya sendiri.",
      );
    }
    if (action.type === "entry.delete")
      next[action.kind] = next[action.kind].filter((e) => e.id !== action.id);
    else {
      ensure(
        action.input.title.trim().length >= 3,
        "Judul minimal 3 karakter.",
      );
      ensure(
        Number.isInteger(action.input.year) &&
          action.input.year >= 1900 &&
          action.input.year <= new Date().getFullYear() + 1,
        "Tahun tidak valid.",
      );
      if (action.input.url) {
        let valid = false;
        try {
          valid = ["http:", "https:"].includes(
            new URL(action.input.url).protocol,
          );
        } catch {
          /* invalid URL */
        }
        ensure(valid, "Tautan harus berupa URL http atau https yang valid.");
      }
      const now = new Date().toISOString();
      const saved: PortfolioEntry = {
        ...action.input,
        title: action.input.title.trim(),
        id: entry?.id || crypto.randomUUID(),
        userId: entry?.userId || actor.id,
        createdAt: entry?.createdAt || now,
        updatedAt: now,
      };
      next[action.kind] = entry
        ? next[action.kind].map((e) => (e.id === entry.id ? saved : e))
        : [...next[action.kind], saved];
    }
  }
  return next;
}

export function researcherHubs(db: Database) {
  const researchers = new Set(
    db.accounts.filter((a) => a.role === "periset").map((a) => a.id),
  );
  return LOCATIONS.map((location) => ({
    ...location,
    count: db.profiles.filter(
      (p) => p.locationId === location.id && researchers.has(p.userId),
    ).length,
  }));
}
