import test from "node:test";
import assert from "node:assert/strict";
import { tanggalHariIni, statusIuran, bayarIuran, buatContohIuran, filterIuran } from "../src/lib/iuran.ts";

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
  const data = buatContohIuran("2026-09-29");
  for (const status of ["Belum Bayar", "Terlambat"]) {
    const item = data.find((row) => row.statusPembayaran === status);
    const paid = bayarIuran(item, "2026-09-29");
    assert.equal(paid.statusPembayaran, "Lunas");
    assert.equal(paid.tanggalPembayaran, "2026-09-29");
    assert.equal(item.tanggalPembayaran, null);
    assert.equal(bayarIuran(paid, "2026-09-30").tanggalPembayaran, "2026-09-29");
  }
});

test("search, year, month and status filters combine and can return no results", () => {
  const data = buatContohIuran("2026-09-29");
  const filter = { nama: " SITI ", tahun: "2026", bulan: "9", status: "Terlambat" };
  const rows = filterIuran(data, filter);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].namaPeriset, "Dr. Siti Rahmawati");
  assert.equal(filterIuran(data, { ...filter, status: "Lunas" }).length, 0);
  assert.equal(filterIuran(data, { nama: "", tahun: "", bulan: "", status: "" }).length, data.length);
});

test("mock periods roll across years with valid dates, unique IDs and all payment states", () => {
  for (const date of ["2026-01-01", "2026-12-31"]) {
    const data = buatContohIuran(date);
    assert.equal(new Set(data.map((item) => item.id)).size, data.length);
    assert.deepEqual(new Set(data.map((item) => item.statusPembayaran)), new Set(["Lunas", "Belum Bayar", "Terlambat"]));
    for (const item of data) {
      assert.equal(item.nominalIuran, 50000);
      assert.equal(Number(item.tanggalJatuhTempo.slice(0, 4)), item.tahun);
      assert.equal(Number(item.tanggalJatuhTempo.slice(5, 7)), item.bulan);
      assert.ok(!item.tanggalPembayaran || item.tanggalPembayaran <= date);
    }
  }
});
