"use client";

import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2, 
  HelpCircle 
} from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    subject: "Pertanyaan Umum",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        institution: "",
        subject: "Pertanyaan Umum",
        message: "",
      });
    }, 900);
  };

  return (
    <section id="kontak" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Hubungi Kami
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-800 leading-tight">
            Sekretariat & Layanan Informasi IPI
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Punya pertanyaan mengenai keanggotaan periset, kemitraan riset, atau usulan program? Tim sekretariat kami siap membantu Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-blue-600" />
                Sekretariat Utama
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Alamat Kantor</p>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      Gedung B.J. Habibie Lantai 8, Jl. M.H. Thamrin No. 8, Jakarta Pusat 10340
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Email Resmi</p>
                    <p className="text-slate-600 mt-0.5">sekretariat@periset.or.id</p>
                    <p className="text-slate-400 text-xs mt-0.5">Respons dalam 1x24 jam kerja</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Layanan Telepon & Hotline</p>
                    <p className="text-slate-600 mt-0.5">(021) 316-9000 / 0811-2345-IPI</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Jam Operasional</p>
                    <p className="text-slate-600 mt-0.5">Senin - Jumat: 08.30 - 16.30 WIB</p>
                    <p className="text-slate-400 text-xs mt-0.5">Sabtu, Minggu & Hari Libur Nasional Tutup</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ highlight */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md">
              <div className="flex items-center gap-2 mb-2 text-cyan-300 font-semibold text-sm">
                <HelpCircle className="w-4 h-4" />
                Ingin Mendaftar Sebagai Periset?
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Keanggotaan terbuka untuk seluruh peneliti BRIN, dosen periset perguruan tinggi, serta peneliti industri independen di seluruh Indonesia.
              </p>
              <a
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
              >
                Masuk / Buat Akun Anggota →
              </a>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-7 sm:p-9 shadow-sm">
            <h3 className="font-bold text-slate-900 text-xl mb-2">Kirim Pesan atau Pertanyaan</h3>
            <p className="text-slate-500 text-sm mb-7">
              Silakan isi formulir di bawah ini. Tim humas dan sekretariat IPI akan segera menindaklanjuti pesan Anda.
            </p>

            {status === "success" && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Pesan Berhasil Terkirim!</p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Terima kasih telah menghubungi kami. Tim sekretariat akan membalas pesan melalui email yang Anda daftarkan.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Prof. / Dr. / Nama Anda"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Alamat Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@institusi.ac.id"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Instansi / Universitas / Lab
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Contoh: BRIN / UI / ITB"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Topik / Kategori
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                    <option value="Pendaftaran Keanggotaan">Pendaftaran Keanggotaan</option>
                    <option value="Kolaborasi Riset">Kolaborasi & Hibah Riset</option>
                    <option value="Undangan Pembicara / Seminar">Undangan Pembicara / Narasumber</option>
                    <option value="Publikasi & Jurnal Ilmiah">Publikasi & Jurnal Ilmiah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Isi Pesan <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan secara ringkas kebutuhan atau pertanyaan Anda..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <span>Mengirim...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
