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

export function bayarIuran(iuran: Iuran, hariIni: string): Iuran {
  // Repeated clicks must not replace the original payment date.
  if (iuran.tanggalPembayaran) return iuran;
  return { ...iuran, tanggalPembayaran: hariIni, statusPembayaran: "Lunas" };
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

export function buatContohIuran(hariIni: string): Iuran[] {
  const [year, month] = hariIni.split("-").map(Number);
  const names = ["Dr. Andi Pratama", "Dr. Siti Rahmawati", "Budi Santoso"];
  return names.flatMap((namaPeriset, index) => [-12, -1, 0, 1].map((offset) => {
    const period = new Date(Date.UTC(year, month - 1 + offset, 1));
    const tahun = period.getUTCFullYear();
    const bulan = period.getUTCMonth() + 1;
    const prefix = `${tahun}-${String(bulan).padStart(2, "0")}`;
    const tanggalPembayaran = offset === -12 || (offset <= 0 && index === 0)
      ? `${prefix}-01` : null;
    const item: Iuran = {
      id: `contoh-${index + 1}-${prefix}`, namaPeriset, tahun, bulan,
      nominalIuran: 50000, tanggalJatuhTempo: `${prefix}-10`,
      tanggalPembayaran, statusPembayaran: "Belum Bayar",
    };
    return { ...item, statusPembayaran: statusIuran(item, hariIni) };
  })).sort((a, b) => b.tanggalJatuhTempo.localeCompare(a.tanggalJatuhTempo) || a.namaPeriset.localeCompare(b.namaPeriset));
}
