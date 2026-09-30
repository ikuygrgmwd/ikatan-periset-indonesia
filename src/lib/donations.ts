import type { Account, Database } from "./research-store";

export const PAYMENT_METHODS = ["QRIS", "Transfer Bank", "Dompet Digital", "Virtual Account"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type Donation = {
  id: string;
  userId: string;
  donorName: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  status: "berhasil" | "menunggu" | "gagal";
};
export const rupiah = (amount: number) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0,
}).format(amount);

export function seedDonations(accounts: Account[]): Donation[] {
  return accounts.filter(a => a.role === "periset").slice(0, 4).map((a, i) => ({
    id: `donasi-contoh-${i}`, userId: a.id, donorName: a.name,
    amount: [50000, 100000, 250000, 75000][i], method: PAYMENT_METHODS[i],
    date: `2026-09-${24 + i}T03:00:00.000Z`,
    status: i === 2 ? "menunggu" : i === 3 ? "gagal" : "berhasil",
  }));
}

export function validateDonation(amount: number, method: string) {
  if (!Number.isSafeInteger(amount) || amount < 1000 || amount > 100000000)
    throw new Error("Masukkan nominal bulat antara Rp1.000 dan Rp100.000.000.");
  if (!PAYMENT_METHODS.includes(method as PaymentMethod))
    throw new Error("Pilih metode pembayaran yang tersedia.");
}

// Demo-only permissions; a real payment service must enforce these on the server.
export function makeDonation(db: Database, actorId: string | null, input: { id: string; amount: number; method: PaymentMethod }): Database {
  const actor = db.accounts.find(a => a.id === actorId);
  if (!actor) throw new Error("Silakan masuk terlebih dahulu.");
  validateDonation(input.amount, input.method);
  if (!input.id) throw new Error("Identitas donasi tidak valid.");
  const donations = db.donations ?? seedDonations(db.accounts);
  if (donations.some(d => d.id === input.id)) throw new Error("Donasi ini sudah diproses.");
  return { ...db, donations: [{
    ...input, userId: actor.id, donorName: actor.name,
    date: new Date().toISOString(), status: "berhasil",
  }, ...donations] };
}

export function adminDonationLogs(db: Database, actorId: string | null): Donation[] {
  if (db.accounts.find(a => a.id === actorId)?.role !== "admin") return [];
  return [...(db.donations ?? seedDonations(db.accounts))].sort((a, b) => b.date.localeCompare(a.date));
}
