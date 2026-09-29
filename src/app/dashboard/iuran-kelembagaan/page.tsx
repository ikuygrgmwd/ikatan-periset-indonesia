"use client";

import { useState, type ReactNode } from "react";
import { AlertTriangle, Bell, CheckCircle2, Clock, Search, Wallet, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useIuran } from "@/hooks/use-iuran";
import { BULAN, STATUS_PEMBAYARAN, filterIuran, type Iuran, type StatusPembayaran } from "@/lib/iuran";

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const tanggal = (value: string | null) => value ? dateFormat.format(new Date(`${value}T00:00:00Z`)) : "Belum dibayar";
const statusStyles: Record<StatusPembayaran, string> = {
  Lunas: "bg-green-100 text-green-800",
  "Belum Bayar": "bg-amber-100 text-amber-800",
  Terlambat: "bg-red-100 text-red-800",
};
const statusIcons = { Lunas: CheckCircle2, "Belum Bayar": Clock, Terlambat: AlertTriangle };
const fieldClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500";

function StatusBadge({ status }: { status: StatusPembayaran }) {
  const Icon = statusIcons[status];
  return <Badge className={`h-auto gap-1.5 px-2.5 py-1 ${statusStyles[status]}`}><Icon aria-hidden="true" />{status}</Badge>;
}

function IuranAlert({ danger = false, children }: { danger?: boolean; children: ReactNode }) {
  const Icon = danger ? AlertTriangle : Bell;
  return (
    <div role={danger ? "alert" : "status"} className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${danger ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 space-y-1">{children}</div>
    </div>
  );
}

export default function IuranKelembagaanPage() {
  const { data, isLoading, bayar } = useIuran();
  const [nama, setNama] = useState("");
  const [tahun, setTahun] = useState("");
  const [bulan, setBulan] = useState("");
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState<{ id: string; detail: string } | null>(null);
  const filtered = filterIuran(data, { nama, tahun, bulan, status });
  const unpaid = data.filter((item) => item.statusPembayaran !== "Lunas");
  const late = data.filter((item) => item.statusPembayaran === "Terlambat");
  const latePeriods = [...new Set(late.map((item) => `${BULAN[item.bulan - 1]} ${item.tahun}`))];
  const years = [...new Set(data.map((item) => item.tahun))].sort((a, b) => b - a);

  function handlePayment(item: Iuran) {
    bayar(item.id);
    setSuccess({ id: item.id, detail: `${item.namaPeriset} · ${BULAN[item.bulan - 1]} ${item.tahun}` });
  }

  function paymentAction(item: Iuran) {
    return item.statusPembayaran === "Lunas" ? (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700"><CheckCircle2 className="size-4" aria-hidden="true" />Sudah dibayar</span>
    ) : (
      <button type="button" onClick={() => handlePayment(item)} aria-label={`Bayar Sekarang: ${item.namaPeriset}, ${BULAN[item.bulan - 1]} ${item.tahun}`}
        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        Bayar Sekarang
      </button>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold text-slate-800">Iuran Kelembagaan</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola iuran bulanan periset untuk mendukung kegiatan bersama Ikatan Periset.</p>
        <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs leading-relaxed text-blue-800">Mode simulasi · Data contoh dan pembayaran hanya berlaku selama halaman ini dibuka. Tidak ada transaksi uang. Tanggal mengikuti Waktu Indonesia Barat (WIB).</p>
      </header>

      <div aria-live="polite" aria-atomic="true">
        {success && (
          <div key={success.id} className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div className="flex-1"><p className="font-semibold">Pembayaran iuran berhasil dilakukan.</p><p className="mt-1">{success.detail}</p></div>
            <button type="button" onClick={() => setSuccess(null)} aria-label="Tutup notifikasi" className="rounded p-1 hover:bg-green-100"><X className="size-4" /></button>
          </div>
        )}
      </div>

      {isLoading ? <p role="status" className="py-12 text-center text-slate-500">Memuat data iuran...</p> : <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="bg-white"><CardContent>
            <p className="flex items-center gap-2 text-sm text-slate-500"><Wallet className="size-4" aria-hidden="true" />Total Belum Dibayar</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-800">{rupiah.format(unpaid.reduce((total, item) => total + item.nominalIuran, 0))}</p>
            <p className="mt-1 text-xs text-slate-500">Termasuk iuran terlambat</p>
          </CardContent></Card>
          {STATUS_PEMBAYARAN.map((label) => <Card key={label} className="bg-white"><CardContent>
            <StatusBadge status={label} />
            <p className="mt-2 text-2xl font-extrabold text-slate-800">{data.filter((item) => item.statusPembayaran === label).length}<span className="ml-2 text-sm font-normal text-slate-500">iuran</span></p>
            <p className="mt-1 text-xs text-slate-500">Seluruh periode</p>
          </CardContent></Card>)}
        </div>

        {unpaid.length > 0 && <IuranAlert>
          <p className="font-semibold">Anda memiliki iuran yang belum dibayar.</p>
          <p>Terdapat {unpaid.length} iuran belum dibayar pada data contoh.</p>
          <p>Segera lakukan pembayaran untuk mendukung kegiatan bersama Ikatan Periset.</p>
        </IuranAlert>}
        {late.length > 0 && <IuranAlert danger>
          <p className="font-semibold">{late.length} iuran terlambat</p>
          {latePeriods.map((period) => <p key={period}>Iuran bulan {period} sudah melewati tanggal jatuh tempo.</p>)}
        </IuranAlert>}

        <section aria-labelledby="daftar-iuran" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-4 border-b border-slate-200 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="daftar-iuran" className="font-bold text-slate-800">Daftar Iuran</h2>
              <p role="status" className="text-xs text-slate-500">Menampilkan {filtered.length} dari {data.length} iuran</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div><label htmlFor="nama-periset" className="mb-1.5 block text-xs font-semibold text-slate-600">Nama Periset</label>
                <div className="relative"><Search className="absolute top-3 left-3 size-4 text-slate-400" aria-hidden="true" />
                  <input id="nama-periset" type="search" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Cari nama periset..." className={`${fieldClass} pl-9`} />
                </div>
              </div>
              <div><label htmlFor="tahun-iuran" className="mb-1.5 block text-xs font-semibold text-slate-600">Tahun</label>
                <select id="tahun-iuran" value={tahun} onChange={(e) => setTahun(e.target.value)} className={fieldClass}><option value="">Semua Tahun</option>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select>
              </div>
              <div><label htmlFor="bulan-iuran" className="mb-1.5 block text-xs font-semibold text-slate-600">Bulan</label>
                <select id="bulan-iuran" value={bulan} onChange={(e) => setBulan(e.target.value)} className={fieldClass}><option value="">Semua Bulan</option>{BULAN.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}</select>
              </div>
              <div><label htmlFor="status-iuran" className="mb-1.5 block text-xs font-semibold text-slate-600">Status Pembayaran</label>
                <select id="status-iuran" value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}><option value="">Semua Status</option>{STATUS_PEMBAYARAN.map((label) => <option key={label} value={label}>{label}</option>)}</select>
              </div>
            </div>
            {(nama || tahun || bulan || status) && <button type="button" onClick={() => { setNama(""); setTahun(""); setBulan(""); setStatus(""); }} className="text-sm font-medium text-blue-700 hover:underline">Hapus Filter</button>}
          </div>

          {filtered.length === 0 ? <div className="px-4 py-12 text-center"><p className="font-semibold text-slate-700">Tidak ada iuran yang sesuai.</p><p className="mt-1 text-sm text-slate-500">Ubah pencarian atau hapus filter untuk melihat data lainnya.</p></div> : <>
            <div className="hidden overflow-x-auto md:block" role="region" aria-label="Tabel iuran kelembagaan" tabIndex={0}>
              <table className="w-full text-left text-sm whitespace-nowrap">
                <caption className="sr-only">Data iuran bulanan periset dan pembayaran</caption>
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-600"><tr>
                  {["Nama Periset", "Tahun", "Bulan", "Nominal Iuran", "Tanggal Jatuh Tempo", "Tanggal Pembayaran", "Status Pembayaran", "Aksi"].map((label) => <th key={label} scope="col" className="px-5 py-3.5 font-semibold">{label}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-slate-100">{filtered.map((item) => <tr key={item.id} className={item.statusPembayaran === "Terlambat" ? "bg-red-50/60" : "hover:bg-slate-50"}>
                  <th scope="row" className="px-5 py-4 font-semibold text-slate-800">{item.namaPeriset}</th>
                  <td className="px-5 py-4">{item.tahun}</td><td className="px-5 py-4">{BULAN[item.bulan - 1]}</td>
                  <td className="px-5 py-4 font-semibold">{rupiah.format(item.nominalIuran)}</td>
                  <td className={`px-5 py-4 ${item.statusPembayaran === "Terlambat" ? "font-medium text-red-700" : "text-slate-600"}`}>{tanggal(item.tanggalJatuhTempo)}</td>
                  <td className="px-5 py-4 text-slate-600">{tanggal(item.tanggalPembayaran)}</td>
                  <td className="px-5 py-4"><StatusBadge status={item.statusPembayaran} /></td>
                  <td className="px-5 py-4">{paymentAction(item)}</td>
                </tr>)}</tbody>
              </table>
            </div>
            <div className="space-y-3 p-3 md:hidden">{filtered.map((item) => <article key={item.id} className={`space-y-3 rounded-xl border p-4 ${item.statusPembayaran === "Terlambat" ? "border-red-200 bg-red-50/60" : "border-slate-200"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-semibold text-slate-800">{item.namaPeriset}</h3><StatusBadge status={item.statusPembayaran} /></div>
              <dl className="space-y-2 text-sm">
                {[["Tahun", item.tahun], ["Bulan", BULAN[item.bulan - 1]], ["Nominal Iuran", rupiah.format(item.nominalIuran)], ["Tanggal Jatuh Tempo", tanggal(item.tanggalJatuhTempo)], ["Tanggal Pembayaran", tanggal(item.tanggalPembayaran)]].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-x-3 gap-y-1"><dt className="text-slate-500">{label}</dt><dd className="font-medium text-slate-800">{value}</dd></div>)}
              </dl>
              <div className="border-t border-slate-200 pt-3">{paymentAction(item)}</div>
            </article>)}</div>
          </>}
        </section>
      </>}
    </div>
  );
}
