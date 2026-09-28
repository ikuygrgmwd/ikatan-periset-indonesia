// ============================================================
// Employee Database Service Layer
// Supabase-ready with localStorage mock fallback
// ============================================================

export type EmployeeRecord = {
  id: string;
  full_name: string;
  email: string;
  position: string;
  department: string;
  role: "admin" | "periset";
  phone_number: string;
  profile_photo_url: string;
  status: "aktif" | "nonaktif";
  nip: string;
  bidang_riset: string;
  created_at: string;
  updated_at: string;
};

// ── Dummy profile photo URLs ────────────────────────────────
// Using DiceBear Avatars API for unique, deterministic placeholder photos.
// Each employee gets a consistent avatar based on their seed.
function generateAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0369a1,4338ca,7c3aed,0891b2,059669,d97706&backgroundType=gradientLinear&fontFamily=Arial&fontSize=40`;
}

// ── Seed Data ───────────────────────────────────────────────
const SEED_EMPLOYEES: EmployeeRecord[] = [
  {
    id: "emp-1",
    full_name: "Prof. Dr. Bambang Susanto",
    email: "bambang.susanto@periset.or.id",
    position: "Ketua Umum",
    department: "Divisi Kebijakan",
    role: "admin",
    phone_number: "081234567890",
    profile_photo_url: generateAvatarUrl("Bambang Susanto"),
    status: "aktif",
    nip: "197801012005011001",
    bidang_riset: "Kebijakan Riset & Inovasi",
    created_at: "2024-01-15T08:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "emp-2",
    full_name: "Dr. Maya Putri",
    email: "maya.putri@periset.or.id",
    position: "Kepala Divisi Energi",
    department: "Divisi Energi & Lingkungan",
    role: "periset",
    phone_number: "081234567891",
    profile_photo_url: generateAvatarUrl("Maya Putri"),
    status: "aktif",
    nip: "198503152010012002",
    bidang_riset: "Energi Terbarukan",
    created_at: "2024-02-01T08:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "emp-3",
    full_name: "Dr. Hendra Wijaya",
    email: "hendra.wijaya@periset.or.id",
    position: "Peneliti Utama",
    department: "Divisi Riset Terapan",
    role: "periset",
    phone_number: "081234567892",
    profile_photo_url: generateAvatarUrl("Hendra Wijaya"),
    status: "aktif",
    nip: "197912202008011003",
    bidang_riset: "Bioteknologi",
    created_at: "2024-02-15T08:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "emp-4",
    full_name: "Siti Rahayu, M.Sc.",
    email: "siti.rahayu@periset.or.id",
    position: "Peneliti Madya",
    department: "Divisi Sosial Humaniora",
    role: "periset",
    phone_number: "081234567893",
    profile_photo_url: generateAvatarUrl("Siti Rahayu"),
    status: "aktif",
    nip: "199002102015012004",
    bidang_riset: "Sosial Humaniora",
    created_at: "2024-03-01T08:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "emp-5",
    full_name: "Budi Santoso, M.T.",
    email: "budi.santoso@periset.or.id",
    position: "Peneliti Madya",
    department: "Divisi IT",
    role: "periset",
    phone_number: "081234567894",
    profile_photo_url: generateAvatarUrl("Budi Santoso"),
    status: "aktif",
    nip: "198807122012011005",
    bidang_riset: "Teknologi Informasi",
    created_at: "2024-03-15T08:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "emp-6",
    full_name: "Dewi Lestari, S.Si.",
    email: "dewi.lestari@periset.or.id",
    position: "Peneliti Pertama",
    department: "Divisi Lingkungan",
    role: "periset",
    phone_number: "081234567895",
    profile_photo_url: generateAvatarUrl("Dewi Lestari"),
    status: "aktif",
    nip: "199506302020012006",
    bidang_riset: "Ilmu Lingkungan",
    created_at: "2024-04-01T08:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "emp-7",
    full_name: "Agus Prasetyo, M.Si.",
    email: "agus.prasetyo@periset.or.id",
    position: "Peneliti Muda",
    department: "Divisi Kelautan",
    role: "periset",
    phone_number: "081234567896",
    profile_photo_url: generateAvatarUrl("Agus Prasetyo"),
    status: "nonaktif",
    nip: "198204152014011007",
    bidang_riset: "Kelautan & Perikanan",
    created_at: "2024-04-15T08:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "emp-8",
    full_name: "Rina Kusumawati, Ph.D.",
    email: "rina.kusumawati@periset.or.id",
    position: "Kepala Divisi Kesehatan",
    department: "Divisi Kesehatan",
    role: "periset",
    phone_number: "081234567897",
    profile_photo_url: generateAvatarUrl("Rina Kusumawati"),
    status: "aktif",
    nip: "197706082007012008",
    bidang_riset: "Kesehatan Masyarakat",
    created_at: "2024-05-01T08:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "emp-9",
    full_name: "Dr. Andi Saputra",
    email: "andi.saputra@periset.or.id",
    position: "Peneliti Madya",
    department: "Divisi Riset Terapan",
    role: "periset",
    phone_number: "081234567898",
    profile_photo_url: generateAvatarUrl("Andi Saputra"),
    status: "aktif",
    nip: "198901032016011009",
    bidang_riset: "Ketahanan Pangan",
    created_at: "2024-05-15T08:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "emp-10",
    full_name: "Dr. Maria Latu",
    email: "maria.latu@periset.or.id",
    position: "Peneliti Muda",
    department: "Divisi Kelautan",
    role: "periset",
    phone_number: "081234567899",
    profile_photo_url: generateAvatarUrl("Maria Latu"),
    status: "aktif",
    nip: "199208172018012010",
    bidang_riset: "Kelautan & Perikanan",
    created_at: "2024-06-01T08:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
  },
];

// ── Local Storage Key ───────────────────────────────────────
const EMPLOYEE_DB_KEY = "ipi_employees_v1";

// ── Event Emitter for real-time-like UI updates ─────────────
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeEmployees(callback: Listener): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

// ── CRUD Operations (Mock) ──────────────────────────────────
// These mirror a Supabase client API shape so migration is trivial.

function loadEmployees(): EmployeeRecord[] {
  if (typeof window === "undefined") return [...SEED_EMPLOYEES];
  try {
    const raw = localStorage.getItem(EMPLOYEE_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // First load — seed
    localStorage.setItem(EMPLOYEE_DB_KEY, JSON.stringify(SEED_EMPLOYEES));
    return [...SEED_EMPLOYEES];
  } catch {
    return [...SEED_EMPLOYEES];
  }
}

function saveEmployees(employees: EmployeeRecord[]) {
  try {
    localStorage.setItem(EMPLOYEE_DB_KEY, JSON.stringify(employees));
  } catch {
    console.error("Failed to persist employee data to localStorage");
  }
  notifyListeners();
}

export async function fetchEmployees(): Promise<EmployeeRecord[]> {
  // TODO: Replace with Supabase query
  // const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: true });
  return loadEmployees();
}

export async function fetchEmployeeById(id: string): Promise<EmployeeRecord | null> {
  // TODO: Replace with Supabase query
  const employees = loadEmployees();
  return employees.find((e) => e.id === id) ?? null;
}

export async function createEmployee(
  input: Omit<EmployeeRecord, "id" | "created_at" | "updated_at">
): Promise<{ data: EmployeeRecord | null; error: string | null }> {
  // TODO: Replace with Supabase insert
  const employees = loadEmployees();

  // Validate unique email
  if (employees.some((e) => e.email.toLowerCase() === input.email.toLowerCase())) {
    return { data: null, error: "Email sudah digunakan." };
  }

  const now = new Date().toISOString();
  const record: EmployeeRecord = {
    ...input,
    id: `emp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    profile_photo_url: input.profile_photo_url || generateAvatarUrl(input.full_name),
    created_at: now,
    updated_at: now,
  };

  employees.push(record);
  saveEmployees(employees);
  return { data: record, error: null };
}

export async function updateEmployee(
  id: string,
  input: Partial<Omit<EmployeeRecord, "id" | "created_at">>
): Promise<{ data: EmployeeRecord | null; error: string | null }> {
  // TODO: Replace with Supabase update
  const employees = loadEmployees();
  const index = employees.findIndex((e) => e.id === id);

  if (index === -1) {
    return { data: null, error: "Karyawan tidak ditemukan." };
  }

  if (input.email) {
    const duplicate = employees.find(
      (e) => e.email.toLowerCase() === input.email!.toLowerCase() && e.id !== id
    );
    if (duplicate) return { data: null, error: "Email sudah digunakan." };
  }

  const updated: EmployeeRecord = {
    ...employees[index],
    ...input,
    updated_at: new Date().toISOString(),
  };

  employees[index] = updated;
  saveEmployees(employees);
  return { data: updated, error: null };
}

export async function deleteEmployee(
  id: string
): Promise<{ error: string | null }> {
  // TODO: Replace with Supabase delete
  const employees = loadEmployees();
  const index = employees.findIndex((e) => e.id === id);

  if (index === -1) {
    return { error: "Karyawan tidak ditemukan." };
  }

  employees.splice(index, 1);
  saveEmployees(employees);
  return { error: null };
}

// ── Default Avatar Fallback ─────────────────────────────────
export function getEmployeeAvatar(employee: Pick<EmployeeRecord, "full_name" | "profile_photo_url">): string {
  return employee.profile_photo_url || generateAvatarUrl(employee.full_name);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((w) => !w.match(/^(Dr\.|Prof\.|M\.Sc\.|M\.T\.|M\.Si\.|Ph\.D\.|S\.Si\.)$/i))
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Supabase Schema Reference ───────────────────────────────
// When connecting to Supabase, create this table:
//
// CREATE TABLE employees (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   full_name TEXT NOT NULL,
//   email TEXT NOT NULL UNIQUE,
//   position TEXT NOT NULL DEFAULT 'Peneliti',
//   department TEXT NOT NULL DEFAULT '',
//   role TEXT NOT NULL DEFAULT 'periset' CHECK (role IN ('admin', 'periset')),
//   phone_number TEXT DEFAULT '',
//   profile_photo_url TEXT DEFAULT '',
//   status TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
//   nip TEXT DEFAULT '',
//   bidang_riset TEXT DEFAULT '',
//   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//   updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
// );
//
// -- Enable Realtime
// ALTER PUBLICATION supabase_realtime ADD TABLE employees;
//
// -- Auto-update updated_at
// CREATE OR REPLACE FUNCTION update_updated_at()
// RETURNS TRIGGER AS $$
// BEGIN
//   NEW.updated_at = now();
//   RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;
//
// CREATE TRIGGER employees_updated_at
//   BEFORE UPDATE ON employees
//   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
