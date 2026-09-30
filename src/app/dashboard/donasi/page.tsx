"use client";

import { useRef, useState } from "react";
import { Heart, ArrowRight, CheckCircle2, QrCode, Landmark, Wallet, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { adminDonationLogs, PAYMENT_METHODS, rupiah, validateDonation, type PaymentMethod } from "@/lib/donations";

const icons = [QrCode, Landmark, Wallet, CreditCard];
const statusLabels = { berhasil: "Berhasil", menunggu: "Menunggu", gagal: "Gagal" };
const statusColors = { berhasil: "bg-emerald-50 text-emerald-700", menunggu: "bg-amber-50 text-amber-700", gagal: "bg-red-50 text-red-700" };

export default function DonationPage() {
  const { user, database, mutate } = useAuth();
  const [amount, setAmount] = useState("50000");
  const [method, setMethod] = useState<PaymentMethod>("QRIS");
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [error, setError] = useState("");
  const paymentId = useRef("");
  const processing = useRef(false);
  const logs = adminDonationLogs(database, user?.id ?? null);

  function confirm(event: React.FormEvent) {
    event.preventDefault();
    try {
      validateDonation(Number(amount), method);
      paymentId.current = crypto.randomUUID();
      setError(""); setStep("confirm");
    } catch (e) { setError(e instanceof Error ? e.message : "Periksa kembali data donasi."); }
  }
  function pay() {
    if (processing.current) return;
    processing.current = true;
    const result = mutate({ type: "donation.pay", id: paymentId.current, amount: Number(amount), method });
    if (result.error) { setError(result.error); processing.current = false; }
    else { setError(""); setStep("success"); }
  }

  return <div className="mx-auto max-w-6xl space-y-6">
    <div><h1 className="text-2xl font-extrabold text-slate-800">Donasi untuk Lembaga</h1><p className="mt-1 text-sm text-slate-500">Kontribusi sukarela Anda membantu kemajuan riset Indonesia.</p></div>
    <div className="grid items-start gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <section className="rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6 text-white sm:p-8">
        <div className="inline-flex rounded-2xl bg-white/10 p-3"><Heart className="h-7 w-7 text-blue-200" /></div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-blue-200">Bersama membangun ilmu</p>
        <h2 className="mt-3 text-2xl font-bold leading-snug">Dukungan kecil,<br />manfaat yang luas.</h2>
        <p className="mt-4 text-sm leading-relaxed text-blue-100">Bantu pengembangan jejaring, kegiatan ilmiah, dan kolaborasi antarperiset melalui donasi untuk Ikatan Periset Indonesia.</p>
        <div className="mt-7 border-t border-white/15 pt-5 text-sm text-blue-100">Pilih nominal sesuai kemampuan Anda. Setiap dukungan berarti.</div>
      </section>
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-label="Formulir donasi">
        <p className="mb-5 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">Simulasi pembayaran — tidak ada uang yang ditagihkan atau ditransfer.</p>
        {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {step === "form" ? <form onSubmit={confirm} className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Mulai donasi Anda</h2>
          <fieldset><legend className="mb-3 text-sm font-semibold text-slate-700">1. Pilih nominal donasi</legend>
            <div className="grid grid-cols-2 gap-3">{[50000, 100000, 250000, 500000].map(value => <button key={value} type="button" aria-pressed={amount === String(value)} onClick={() => setAmount(String(value))} className={`rounded-xl border px-3 py-3 text-sm font-bold transition-colors ${amount === String(value) ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600" : "border-slate-200 text-slate-700 hover:border-blue-300"}`}>{rupiah(value)}</button>)}</div>
            <label className="mt-4 block text-sm text-slate-600" htmlFor="donation-amount">Nominal lainnya</label>
            <div className="mt-2 flex items-center overflow-hidden rounded-xl border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500"><span className="pl-4 text-sm font-semibold text-slate-500">Rp</span><input id="donation-amount" type="number" inputMode="numeric" min={1000} max={100000000} step={1} required value={amount} onChange={e => setAmount(e.target.value)} placeholder="Pilih nominal" aria-describedby="amount-help" className="min-w-0 w-full bg-transparent px-3 py-3 text-slate-900 outline-none" /></div>
            <p id="amount-help" className="mt-2 text-xs text-slate-500">Minimal Rp1.000, maksimal Rp100.000.000.</p>
          </fieldset>
          <fieldset><legend className="mb-3 text-sm font-semibold text-slate-700">2. Metode pembayaran</legend><div className="grid gap-3 sm:grid-cols-2">{PAYMENT_METHODS.map((item, i) => { const Icon = icons[i]; return <label key={item} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${method === item ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600"}`}><input type="radio" name="payment-method" value={item} checked={method === item} onChange={() => setMethod(item)} className="accent-blue-600" /><Icon size={18} className="shrink-0" />{item}</label>; })}</div></fieldset>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white hover:bg-blue-700">Lanjutkan Donasi <ArrowRight size={18} /></button>
        </form> : step === "confirm" ? <div className="space-y-5" role="status">
          <h2 className="text-xl font-bold text-slate-900">Konfirmasi Donasi</h2>
          <p className="text-sm text-slate-500">Periksa donasi Anda sebelum menyelesaikan simulasi.</p>
          <dl className="space-y-4 rounded-xl bg-slate-50 p-4"><div><dt className="text-sm text-slate-500">Nominal donasi</dt><dd className="mt-1 text-3xl font-bold text-blue-700">{rupiah(Number(amount))}</dd></div><div><dt className="text-sm text-slate-500">Metode pembayaran</dt><dd className="mt-1 font-semibold text-slate-800">{method}</dd></div></dl>
          <button onClick={pay} className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white hover:bg-blue-700">Bayar Sekarang (Simulasi)</button>
          <button onClick={() => { setStep("form"); setError(""); }} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Kembali ke Formulir</button>
        </div> : <div role="status" className="py-8 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" /><h2 className="mt-5 text-xl font-bold text-slate-900">Terima kasih atas dukungan Anda!</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">Simulasi donasi sebesar <strong>{rupiah(Number(amount))}</strong> melalui {method} berhasil disimpan di peramban ini.</p>
          <button onClick={() => { processing.current = false; setAmount("50000"); setStep("form"); }} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Buat Donasi Lagi</button>
        </div>}
      </section>
    </div>
    {user?.role === "admin" && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="donation-logs-heading">
      <div className="border-b border-slate-100 p-5"><h2 id="donation-logs-heading" className="font-bold text-slate-900">Riwayat Donasi</h2><p className="mt-1 text-sm text-slate-500">Khusus admin · Data contoh dan donasi simulasi dari periset maupun admin.</p></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Nama donatur", "Nominal", "Metode pembayaran", "Tanggal", "Status"].map(label => <th key={label} scope="col" className="px-5 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{logs.map(d => <tr key={d.id}><td className="px-5 py-4 font-medium text-slate-800">{d.donorName}</td><td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">{rupiah(d.amount)}</td><td className="px-5 py-4 text-slate-600">{d.method}</td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{new Date(d.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[d.status]}`}>{statusLabels[d.status]}</span></td></tr>)}</tbody></table></div>
      {logs.length === 0 && <p className="p-6 text-center text-sm text-slate-500">Belum ada donasi.</p>}
    </section>}
  </div>;
}
