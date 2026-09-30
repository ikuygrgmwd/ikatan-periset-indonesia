"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FlaskConical, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { LOCATIONS, type RegistrationInput } from "@/lib/research-store";

const fieldClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function RegistrationPage() {
  const { register, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const submitted = useRef(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitted.current) return;
    const data = new FormData(event.currentTarget);
    const input = Object.fromEntries(data.entries()) as RegistrationInput & { confirmation: string };
    if (input.password !== input.confirmation) {
      setError("Konfirmasi kata sandi tidak sama.");
      return;
    }
    submitted.current = true;
    const result = register(input);
    if (result.error) { submitted.current = false; setError(result.error); }
    else { setError(""); setSuccess(true); }
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-4 py-12 sm:py-16">
      <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="pt-4 text-white lg:sticky lg:top-28">
          <span className="inline-flex rounded-2xl bg-blue-400/15 p-3 text-cyan-300"><FlaskConical size={28} /></span>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-blue-300">Keanggotaan IPI</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Mulai perjalanan riset<br />bersama kami.</h1>
          <p className="mt-5 leading-relaxed text-blue-100">Daftar sebagai anggota baru dan terhubung dengan komunitas periset di seluruh Indonesia.</p>
          <ul className="mt-8 space-y-4 text-sm text-blue-100">
            {["Bangun portofolio riset Anda", "Perluas jejaring dan kolaborasi", "Dukung kemajuan riset Indonesia"].map(text => <li key={text} className="flex items-center gap-3"><CheckCircle2 size={18} className="shrink-0 text-cyan-300" />{text}</li>)}
          </ul>
        </div>
        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8" aria-labelledby="registration-heading">
          {success ? <div role="status" className="py-10 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
            <h2 id="registration-heading" className="mt-5 text-2xl font-bold text-slate-900">Pendaftaran berhasil!</h2>
            <p className="mt-3 text-slate-600">Akun periset Anda tersimpan di peramban ini. Silakan masuk dengan email dan kata sandi yang baru dibuat.</p>
            <Link href="/login" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Masuk ke Akun <ArrowRight size={18} /></Link>
          </div> : <>
            <h2 id="registration-heading" className="text-2xl font-bold text-slate-900">Daftar Anggota Baru</h2>
            <p className="mt-2 text-sm text-slate-500">Lengkapi data berikut. Semua kolom wajib diisi.</p>
            <p className="mt-4 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-blue-800">Mode simulasi: data hanya tersimpan di peramban ini. Gunakan data contoh dan kata sandi khusus uji coba.</p>
            <form onSubmit={submit} className="mt-6 space-y-5">
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">Nama lengkap<input className={fieldClass} name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Nama lengkap Anda" /></label>
                <label className="text-sm font-medium text-slate-700">Email<input className={fieldClass} name="email" type="email" autoComplete="email" required maxLength={150} placeholder="nama@contoh.id" /></label>
                <label className="text-sm font-medium text-slate-700">Nomor telepon<input className={fieldClass} name="phone" type="tel" autoComplete="tel" required minLength={8} maxLength={20} placeholder="081234567890" /></label>
                <label className="text-sm font-medium text-slate-700">Lembaga / instansi<input className={fieldClass} name="institution" autoComplete="organization" required minLength={2} maxLength={150} placeholder="Nama lembaga atau Mandiri" /></label>
                <label className="text-sm font-medium text-slate-700">Bidang riset<input className={fieldClass} name="bidangRiset" required minLength={2} maxLength={100} placeholder="Contoh: Bioteknologi" /></label>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">Lokasi jejaring terdekat<select className={fieldClass} name="locationId" required defaultValue=""><option value="" disabled>Pilih lokasi</option>{LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}, {l.region}</option>)}</select></label>
                <label className="text-sm font-medium text-slate-700">Kata sandi<input className={fieldClass} name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="Minimal 8 karakter" /></label>
                <label className="text-sm font-medium text-slate-700">Konfirmasi kata sandi<input className={fieldClass} name="confirmation" type="password" autoComplete="new-password" required minLength={8} placeholder="Ulangi kata sandi" /></label>
              </div>
              <button disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">Daftar Sekarang <ArrowRight size={18} /></button>
              <p className="text-center text-sm text-slate-500">Sudah memiliki akun? <Link href="/login" className="font-semibold text-blue-700 hover:underline">Masuk</Link></p>
            </form>
          </>}
        </section>
      </div>
    </div>
  );
}
