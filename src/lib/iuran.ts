export const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;

export const STATUS_PEMBAYARAN = ["Lunas", "Belum Bayar", "Terlambat"] as const;
export type StatusPembayaran = (typeof STATUS_PEMBAYARAN)[number];

// Date-only ISO strings map directly to PostgreSQL DATE columns. Amounts are
// integer rupiah; bulan is 1–12. Derive status on reads, never trust a stale status.
export type Iuran = {
  id: string;
  perisetId: string;
  namaPeriset: string;
  tahun: number;
  bulan: number;
  nominalIuran: number;
  tanggalJatuhTempo: string;
  tanggalPembayaran: string | null;
  statusPembayaran: StatusPembayaran;
};

export function tanggalHariIni(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function statusIuran(
  iuran: Pick<Iuran, "tanggalPembayaran" | "tanggalJatuhTempo">,
  hariIni: string,
): StatusPembayaran {
  if (iuran.tanggalPembayaran) return "Lunas";
  return iuran.tanggalJatuhTempo < hariIni ? "Terlambat" : "Belum Bayar";
}

export type AkunIuran = { id: string; name: string; role: "admin" | "periset" };
export const NOMINAL_IURAN = 50000;
export const PESAN_URUTAN = "Anda harus melunasi iuran bulan sebelumnya terlebih dahulu.";

export function iuranTerawal(data: Iuran[], perisetId: string): Iuran | undefined {
  return data.filter((item) => item.perisetId === perisetId && !item.tanggalPembayaran)
    .sort((a, b) => a.tahun - b.tahun || a.bulan - b.bulan)[0];
}

// Validate the complete ledger independently of UI filters. In production,
// enforce ownership and ordering within a database transaction and RLS policies.
export function bayarIuran(data: Iuran[], actor: AkunIuran | null, id: string, hariIni: string): Iuran[] {
  if (!actor || actor.role !== "periset") throw new Error("Hanya Periset yang dapat membayar iuran sendiri.");
  const item = data.find((row) => row.id === id);
  if (!item || item.perisetId !== actor.id) throw new Error("Iuran tidak ditemukan atau bukan milik Anda.");
  if (item.tanggalPembayaran) return data;
  if (iuranTerawal(data, actor.id)?.id !== id) throw new Error(PESAN_URUTAN);
  return data.map((row) => row.id === id
    ? { ...row, tanggalPembayaran: hariIni, statusPembayaran: "Lunas" } : row);
}

export function iuranUntukPengguna(data: Iuran[], actor: AkunIuran | null, hariIni: string): Iuran[] {
  if (!actor) return [];
  return data.filter((item) => actor.role === "admin" || item.perisetId === actor.id)
    .map((item) => ({ ...item, statusPembayaran: statusIuran(item, hariIni) }));
}

export function ringkasanIuran(data: Iuran[]) {
  const unpaid = data.filter((item) => !item.tanggalPembayaran);
  const late = unpaid.filter((item) => item.statusPembayaran === "Terlambat");
  return {
    jumlahBulan: new Set(unpaid.map((item) => `${item.tahun}-${item.bulan}`)).size,
    jumlahBelumBayar: unpaid.length,
    nominalTertunggak: unpaid.reduce((total, item) => total + item.nominalIuran, 0),
    jumlahTerlambat: late.length,
    nominalTerlambat: late.reduce((total, item) => total + item.nominalIuran, 0),
  };
}

export function ringkasanPerPeriset(data: Iuran[], accounts: AkunIuran[]) {
  return accounts.filter((account) => account.role === "periset").map((account) => ({
    perisetId: account.id,
    namaPeriset: account.name,
    ...ringkasanIuran(data.filter((item) => item.perisetId === account.id)),
  }));
}

export type FilterIuran = { nama: string; tahun: string; bulan: string; status: string };
export function filterIuran(data: Iuran[], filter: FilterIuran): Iuran[] {
  return data.filter((item) =>
    item.namaPeriset.toLocaleLowerCase("id-ID").includes(filter.nama.trim().toLocaleLowerCase("id-ID")) &&
    (!filter.tahun || String(item.tahun) === filter.tahun) &&
    (!filter.bulan || String(item.bulan) === filter.bulan) &&
    (!filter.status || item.statusPembayaran === filter.status),
  );
}

export function buatContohIuran(hariIni: string, accounts: AkunIuran[]): Iuran[] {
  const [year, month] = hariIni.split("-").map(Number);
  return accounts.filter((account) => account.role === "periset").flatMap((account, index) => [-5, -4, -3, -2, -1, 0].map((offset) => {
    const period = new Date(Date.UTC(year, month - 1 + offset, 1));
    const tahun = period.getUTCFullYear();
    const bulan = period.getUTCMonth() + 1;
    const prefix = `${tahun}-${String(bulan).padStart(2, "0")}`;
    const unpaidMonths = [3, 5, 1, 0][index % 4];
    const tanggalPembayaran = offset < 1 - unpaidMonths
      ? `${prefix}-01` : null;
    const item: Iuran = {
      id: `contoh-${account.id}-${prefix}`, perisetId: account.id, namaPeriset: account.name, tahun, bulan,
      nominalIuran: NOMINAL_IURAN, tanggalJatuhTempo: `${prefix}-10`,
      tanggalPembayaran, statusPembayaran: "Belum Bayar",
    };
    return { ...item, statusPembayaran: statusIuran(item, hariIni) };
  })).sort((a, b) => b.tanggalJatuhTempo.localeCompare(a.tanggalJatuhTempo) || a.namaPeriset.localeCompare(b.namaPeriset));
}

// Upgrade older local databases and seed new accounts without overwriting payments.
export function sinkronkanIuran(existing: Iuran[] | undefined, accounts: AkunIuran[], hariIni: string): Iuran[] {
  const names = new Map(accounts.filter((a) => a.role === "periset").map((a) => [a.id, a.name]));
  const rows = (existing ?? []).filter((item) => names.has(item.perisetId));
  const seeded = new Set(rows.map((item) => item.perisetId));
  return [...rows, ...buatContohIuran(hariIni, accounts).filter((item) => !seeded.has(item.perisetId))]
    .map((item) => ({ ...item, namaPeriset: names.get(item.perisetId)!, statusPembayaran: statusIuran(item, hariIni) }));
}
