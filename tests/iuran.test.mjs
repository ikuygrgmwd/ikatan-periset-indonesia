import test from "node:test";
import assert from "node:assert/strict";
import { tanggalHariIni, statusIuran, bayarIuran, buatContohIuran, filterIuran, iuranTerawal, iuranUntukPengguna, ringkasanIuran, ringkasanPerPeriset, sinkronkanIuran, PESAN_URUTAN } from "../src/lib/iuran.ts";
const accounts = [
  { id: "a1", name: "Admin", role: "admin" },
  { id: "p1", name: "Dr. Andi Pratama", role: "periset" },
  { id: "p2", name: "Dr. Siti Rahmawati", role: "periset" },
  { id: "p3", name: "Budi Santoso", role: "periset" },
  { id: "p4", name: "Periset Lunas", role: "periset" },
];
const seed = (date = "2026-09-29") => buatContohIuran(date, accounts);

test("due date remains payable through the full WIB day and becomes late after midnight", () => {
  const item = { tanggalJatuhTempo: "2026-09-10", tanggalPembayaran: null };
  const before = tanggalHariIni(new Date("2026-09-10T16:59:59Z"));
  const after = tanggalHariIni(new Date("2026-09-10T17:00:00Z"));
  assert.equal(before, "2026-09-10");
  assert.equal(after, "2026-09-11");
  assert.equal(statusIuran(item, "2026-09-09"), "Belum Bayar");
  assert.equal(statusIuran(item, before), "Belum Bayar");
  assert.equal(statusIuran(item, after), "Terlambat");
  assert.equal(statusIuran({ ...item, tanggalPembayaran: after }, "2027-01-01"), "Lunas");
});

test("payment settles only the chosen contribution and preserves its original date on retry", () => {
  const data = seed("2026-09-01");
  for (const actor of [accounts[1], accounts[3]]) {
    const item = iuranTerawal(data, actor.id);
    const paid = bayarIuran(data, actor, item.id, "2026-09-01");
    assert.equal(paid.find((row) => row.id === item.id).statusPembayaran, "Lunas");
    assert.equal(paid.find((row) => row.id === item.id).tanggalPembayaran, "2026-09-01");
    assert.equal(item.tanggalPembayaran, null);
    assert.deepEqual(paid.filter((row) => row.id !== item.id), data.filter((row) => row.id !== item.id));
    assert.equal(bayarIuran(paid, actor, item.id, "2026-09-30"), paid);
  }
});

test("search, year, month and status filters combine and can return no results", () => {
  const data = seed();
  const filter = { nama: " SITI ", tahun: "2026", bulan: "9", status: "Terlambat" };
  const rows = filterIuran(data, filter);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].namaPeriset, "Dr. Siti Rahmawati");
  assert.equal(filterIuran(data, { ...filter, status: "Lunas" }).length, 0);
  assert.equal(filterIuran(data, { nama: "", tahun: "", bulan: "", status: "" }).length, data.length);
});

test("mock periods roll across years with valid dates, unique IDs and all payment states", () => {
  for (const date of ["2026-01-01", "2026-12-31"]) {
    const data = seed(date);
    assert.equal(new Set(data.map((item) => item.id)).size, data.length);
    assert.ok(data.some((item) => item.statusPembayaran === "Lunas"));
    assert.ok(data.some((item) => item.statusPembayaran === "Terlambat"));
    for (const item of data) {
      assert.equal(item.nominalIuran, 50000);
      assert.equal(Number(item.tanggalJatuhTempo.slice(0, 4)), item.tahun);
      assert.equal(Number(item.tanggalJatuhTempo.slice(5, 7)), item.bulan);
      assert.ok(!item.tanggalPembayaran || item.tanggalPembayaran <= date);
    }
  }
});

test("Admin can read all Periset; each Periset can read only their own rows", () => {
  const data = seed();
  assert.equal(iuranUntukPengguna(data, accounts[0], "2026-09-29").length, 24);
  assert.equal(iuranUntukPengguna(data, null, "2026-09-29").length, 0);
  for (const actor of accounts.slice(1)) {
    const own = iuranUntukPengguna(data, actor, "2026-09-29");
    assert.equal(own.length, 6);
    assert.ok(own.every((item) => item.perisetId === actor.id));
  }
});

test("payment rejects Admin, anonymous, missing IDs and another Periset's records", () => {
  const data = seed();
  const target = iuranTerawal(data, "p1");
  for (const actor of [null, accounts[0], accounts[2], { ...accounts[1], role: "admin" }]) {
    assert.throws(() => bayarIuran(data, actor, target.id, "2026-09-29"));
  }
  assert.throws(() => bayarIuran(data, accounts[1], "missing", "2026-09-29"));
  assert.equal(data.find((row) => row.id === target.id).tanggalPembayaran, null);
});

test("payment order uses the full ledger across filters and December/January boundaries", () => {
  let data = seed("2026-01-05");
  const actor = accounts[1];
  const january = filterIuran(data, { nama: "Andi", tahun: "2026", bulan: "1", status: "" })[0];
  assert.throws(() => bayarIuran(data, actor, january.id, "2026-01-05"), { message: PESAN_URUTAN });
  assert.equal(iuranTerawal(data, actor.id).bulan, 11);
  data = bayarIuran(data, actor, iuranTerawal(data, actor.id).id, "2026-01-05");
  assert.equal(iuranTerawal(data, actor.id).bulan, 12);
  assert.throws(() => bayarIuran(data, actor, january.id, "2026-01-05"), { message: PESAN_URUTAN });
  data = bayarIuran(data, actor, iuranTerawal(data, actor.id).id, "2026-01-05");
  assert.equal(iuranTerawal(data, actor.id).id, january.id);
  data = bayarIuran(data, actor, january.id, "2026-01-05");
  assert.equal(iuranTerawal(data, actor.id), undefined);
});

test("arrears include late months, recalculate after payment and retain fully paid Periset", () => {
  const data = seed();
  const actor = accounts[1];
  const before = ringkasanPerPeriset(data, accounts);
  assert.equal(before.length, 4);
  assert.equal(before[0].jumlahBulan, 3);
  assert.equal(before[0].nominalTertunggak, 150000);
  assert.equal(before[0].nominalTerlambat, 150000);
  assert.equal(before[1].jumlahTerlambat, 5);
  assert.equal(before[3].nominalTertunggak, 0);
  const paid = bayarIuran(data, actor, iuranTerawal(data, actor.id).id, "2026-09-29");
  const after = ringkasanPerPeriset(paid, accounts);
  assert.equal(after[0].jumlahBulan, 2);
  assert.equal(after[0].nominalTertunggak, 100000);
  assert.equal(ringkasanIuran(data).nominalTertunggak - ringkasanIuran(paid).nominalTertunggak, 50000);
  assert.deepEqual(before.slice(1), after.slice(1));
});

test("local database upgrades and account changes preserve payments without duplicates", () => {
  const data = sinkronkanIuran(undefined, accounts, "2026-09-29");
  const paid = bayarIuran(data, accounts[1], iuranTerawal(data, "p1").id, "2026-09-29");
  const restored = sinkronkanIuran(JSON.parse(JSON.stringify(paid)), accounts, "2026-09-30");
  assert.deepEqual(restored, paid);
  const updatedAccounts = accounts.map((a) => a.id === "p1" ? { ...a, name: "Nama Baru" } : a).filter((a) => a.id !== "p2");
  updatedAccounts.push({ id: "p5", name: "Periset Baru", role: "periset" });
  const synced = sinkronkanIuran(restored, updatedAccounts, "2026-09-30");
  assert.equal(synced.filter((row) => row.perisetId === "p2").length, 0);
  assert.equal(synced.filter((row) => row.perisetId === "p5").length, 6);
  assert.ok(synced.filter((row) => row.perisetId === "p1").every((row) => row.namaPeriset === "Nama Baru"));
  assert.equal(new Set(synced.map((row) => row.id)).size, synced.length);
});
