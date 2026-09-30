import test from "node:test";
import assert from "node:assert/strict";
import { createSeedDatabase, registerMember } from "../src/lib/research-store.ts";
import { makeDonation, adminDonationLogs, seedDonations } from "../src/lib/donations.ts";

const registration = { name: "Periset Baru", email: "baru@contoh.id", password: "uji-baru-123", phone: "081234567890", institution: "Mandiri", bidangRiset: "Energi", locationId: "bandung" };
test("pendaftaran selalu membuat periset dengan profil dan menolak email duplikat", () => {
  const db = createSeedDatabase();
  const next = registerMember(db, { ...registration, role: "admin" });
  const member = next.accounts.at(-1);
  assert.equal(member.role, "periset");
  assert.equal(next.profiles.at(-1).userId, member.id);
  assert.equal(next.profiles.at(-1).institution, "Mandiri");
  assert.equal(db.accounts.length + 1, next.accounts.length);
  assert.throws(() => registerMember(next, { ...registration, email: " BARU@CONTOH.ID " }), /sudah digunakan/);
  assert.throws(() => registerMember(db, { ...registration, password: "abc" }), /minimal 8/);
  assert.throws(() => registerMember(db, { ...registration, phone: "bukan nomor" }), /telepon/);
  assert.throws(() => registerMember(db, { ...registration, locationId: "palsu" }), /lokasi/);
});

test("admin dan periset dapat berdonasi; identitas mengikuti sesi, pembayaran tidak berganda", () => {
  const db = createSeedDatabase();
  const next = makeDonation(db, "r1", { id: "uji-1", amount: 100000, method: "QRIS", userId: "u1", donorName: "Palsu" });
  assert.equal(next.donations[0].userId, "r1");
  assert.equal(next.donations[0].donorName, db.accounts.find(a => a.id === "r1").name);
  assert.equal(next.donations[0].status, "berhasil");
  const admin = makeDonation(next, "u1", { id: "uji-2", amount: 75000, method: "Transfer Bank" });
  assert.equal(admin.donations.length, seedDonations(db.accounts).length + 2);
  assert.throws(() => makeDonation(admin, "r1", { id: "uji-1", amount: 100000, method: "QRIS" }), /sudah diproses/);
  assert.equal(db.donations, undefined);
});

test("riwayat hanya tersedia untuk admin termasuk setelah perubahan peran", () => {
  const db = createSeedDatabase();
  assert.equal(adminDonationLogs(db, "u1").length, 4);
  assert.deepEqual(adminDonationLogs(db, "r1"), []);
  assert.deepEqual(adminDonationLogs(db, null), []);
  db.accounts.find(a => a.id === "u1").role = "periset";
  assert.deepEqual(adminDonationLogs(db, "u1"), []);
});

test("donasi menolak sesi, nominal, dan metode yang tidak valid", () => {
  const db = createSeedDatabase();
  const input = { id: "uji", amount: 50000, method: "QRIS" };
  assert.throws(() => makeDonation(db, null, input), /masuk/);
  for (const amount of [NaN, Infinity, 0, -1, 999, 1000.5, 100000001]) {
    assert.throws(() => makeDonation(db, "r1", { ...input, amount }), /nominal/);
  }
  assert.throws(() => makeDonation(db, "r1", { ...input, method: "palsu" }), /metode/);
});
