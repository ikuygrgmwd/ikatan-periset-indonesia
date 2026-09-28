"use client";

import { useState } from "react";
import { type MonevItem } from "@/lib/mock-data";
import { useMonev } from "@/hooks/use-programs";
import {
  Plus, Pencil, Trash2, X, Check, TrendingUp, TrendingDown, Minus, Loader2,
} from "lucide-react";

const emptyMonev: Omit<MonevItem, "id"> = {
  programId: "",
  namaProgram: "",
  indikator: "",
  target: "",
  realisasi: "",
  capaian: 0,
  periode: "Q3 2026",
  keterangan: "",
};

function CapaianBadge({ value }: { value: number }) {
  if (value >= 100)
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
        <TrendingUp className="w-3.5 h-3.5" /> {value}%
      </span>
    );
  if (value >= 75)
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
        <Minus className="w-3.5 h-3.5" /> {value}%
      </span>
    );
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
      <TrendingDown className="w-3.5 h-3.5" /> {value}%
    </span>
  );
}

export default function MonevPage() {
  const { monevList, isLoading, add, edit, remove } = useMonev();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MonevItem | null>(null);
  const [form, setForm] = useState<Omit<MonevItem, "id">>(emptyMonev);
  const [deleteTarget, setDeleteTarget] = useState<MonevItem | null>(null);

  const avgCapaian =
    monevList.length > 0
      ? Math.round(monevList.reduce((s, m) => s + m.capaian, 0) / monevList.length)
      : 0;
  const tercapai = monevList.filter((m) => m.capaian >= 100).length;
  const belumTercapai = monevList.filter((m) => m.capaian < 75).length;

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyMonev);
    setModalOpen(true);
  };

  const openEdit = (m: MonevItem) => {
    setEditTarget(m);
    setForm({ programId: m.programId, namaProgram: m.namaProgram, indikator: m.indikator, target: m.target, realisasi: m.realisasi, capaian: m.capaian, periode: m.periode, keterangan: m.keterangan });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.namaProgram) return;
    if (editTarget) {
      await edit(editTarget.id, form);
    } else {
      await add(form);
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await remove(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Monitoring & Evaluasi</h1>
          <p className="text-slate-500 text-sm mt-1">Input dan pantau indikator capaian kinerja program</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Tambah Laporan
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Rata-rata Capaian", value: `${avgCapaian}%`, sub: "dari seluruh program", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Target Tercapai", value: tercapai, sub: "program ≥ 100%", color: "text-green-600", bg: "bg-green-50" },
          { label: "Perlu Perhatian", value: belumTercapai, sub: "program < 75%", color: "text-red-600", bg: "bg-red-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-transparent`}>
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-sm font-semibold text-slate-700 mt-1">{s.label}</p>
            <p className="text-xs text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {monevList.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 leading-snug">{m.namaProgram}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.indikator}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <CapaianBadge value={m.capaian} />
                <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteTarget(m)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  m.capaian >= 100 ? "bg-green-500" : m.capaian >= 75 ? "bg-blue-500" : m.capaian >= 50 ? "bg-yellow-400" : "bg-red-400"
                }`}
                style={{ width: `${Math.min(m.capaian, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-slate-400 mb-0.5">Target</p>
                <p className="font-semibold text-slate-700">{m.target}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-slate-400 mb-0.5">Realisasi</p>
                <p className="font-semibold text-slate-700">{m.realisasi}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span className="bg-slate-100 px-2 py-0.5 rounded-full font-medium">{m.periode}</span>
              <span className="truncate max-w-[60%] text-right">{m.keterangan}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-slate-800 text-lg">
                {editTarget ? "Edit Laporan Monev" : "Tambah Laporan Monev"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Nama Program", key: "namaProgram", placeholder: "Nama program kerja" },
                { label: "Indikator Kinerja", key: "indikator", placeholder: "Contoh: Jumlah Peserta" },
                { label: "Target", key: "target", placeholder: "Contoh: 100 Peserta" },
                { label: "Realisasi", key: "realisasi", placeholder: "Contoh: 75 Peserta" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <input type="text" value={(form as Record<string, string | number>)[key] as string || ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Capaian (%): <span className="text-blue-600 font-bold">{form.capaian}%</span>
                  </label>
                  <input type="range" min={0} max={150} value={form.capaian}
                    onChange={(e) => setForm((f) => ({ ...f, capaian: Number(e.target.value) }))}
                    className="w-full h-2 accent-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Periode</label>
                  <input type="text" value={form.periode} onChange={(e) => setForm((f) => ({ ...f, periode: e.target.value }))}
                    placeholder="Q3 2026"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Keterangan</label>
                <textarea rows={3} value={form.keterangan} onChange={(e) => setForm((f) => ({ ...f, keterangan: e.target.value }))}
                  placeholder="Catatan atau keterangan tambahan"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">
                Batal
              </button>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2">
                <Check className="w-4 h-4" /> {editTarget ? "Simpan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Hapus Laporan?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Hapus laporan monev <strong>{deleteTarget.namaProgram}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">
                Batal
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
