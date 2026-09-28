"use client";

import React, { useState } from "react";
import { type ProgramKerja } from "@/lib/mock-data";
import { useProgramKerja } from "@/hooks/use-programs";
import {
  Plus, Pencil, Trash2, Search, X, Check, Calendar, Users2,
  CheckCircle2, Clock, AlertTriangle, CircleDot, Loader2
} from "lucide-react";

const emptyProgram: Omit<ProgramKerja, "id"> = {
  nama: "",
  divisi: "",
  tenggat: "",
  status: "belum-mulai",
  progress: 0,
  penanggungJawab: "",
};

const statusConfig: Record<
  ProgramKerja["status"],
  { label: string; class: string; icon: React.ReactNode }
> = {
  "belum-mulai": {
    label: "Belum Mulai",
    class: "bg-slate-100 text-slate-600",
    icon: <CircleDot className="w-3.5 h-3.5" />,
  },
  berjalan: {
    label: "Berjalan",
    class: "bg-blue-100 text-blue-700",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  selesai: {
    label: "Selesai",
    class: "bg-green-100 text-green-700",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  tertunda: {
    label: "Tertunda",
    class: "bg-yellow-100 text-yellow-700",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
};

function ProgressBar({ value, status }: { value: number; status: ProgramKerja["status"] }) {
  const barColors: Record<ProgramKerja["status"], string> = {
    "belum-mulai": "bg-slate-300",
    berjalan: "bg-blue-500",
    selesai: "bg-green-500",
    tertunda: "bg-yellow-400",
  };
  const barColor = barColors[status];
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-600 w-8 text-right">{value}%</span>
    </div>
  );
}

export default function ProgramKerjaPage() {
  const { programs, isLoading, add, edit, remove } = useProgramKerja();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProgramKerja | null>(null);
  const [form, setForm] = useState<Omit<ProgramKerja, "id">>(emptyProgram);
  const [deleteTarget, setDeleteTarget] = useState<ProgramKerja | null>(null);

  const filtered = programs.filter((p) => {
    const matchSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.divisi.toLowerCase().includes(search.toLowerCase()) ||
      p.penanggungJawab.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "semua" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyProgram);
    setModalOpen(true);
  };

  const openEdit = (p: ProgramKerja) => {
    setEditTarget(p);
    setForm({ nama: p.nama, divisi: p.divisi, tenggat: p.tenggat, status: p.status, progress: p.progress, penanggungJawab: p.penanggungJawab });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nama || !form.divisi) return;
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

  const summaryCount = (status: string) =>
    programs.filter((p) => p.status === status).length;

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Program Kerja</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola seluruh program kerja IPI</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Tambah Program
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, cfg]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(filterStatus === status ? "semua" : status)}
            className={`p-4 rounded-xl border text-left transition-all hover:shadow-sm ${
              filterStatus === status
                ? `${cfg.class} border-transparent shadow-sm`
                : "bg-white border-slate-200"
            }`}
          >
            <p className="text-xl font-extrabold text-slate-800">{summaryCount(status)}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
              {cfg.icon} {cfg.label}
            </p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari program kerja..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Program</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Divisi / PJ</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Tenggat</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600 w-52">Progress</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Status</th>
                <th className="px-5 py-3.5 text-center font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">Tidak ada program ditemukan.</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800 line-clamp-1">{p.nama}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-700 flex items-center gap-1.5 text-xs">
                        <Users2 className="w-3.5 h-3.5 text-indigo-500" /> {p.divisi}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">{p.penanggungJawab}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-slate-600 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        {new Date(p.tenggat).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <ProgressBar value={p.progress} status={p.status} />
                    </td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${statusConfig[p.status].class}`}>
                        {statusConfig[p.status].icon}
                        {statusConfig[p.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-lg">
                {editTarget ? "Edit Program Kerja" : "Tambah Program Kerja"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Program</label>
                <input type="text" value={form.nama} onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                  placeholder="Nama lengkap program"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Divisi / Tim</label>
                  <input type="text" value={form.divisi} onChange={(e) => setForm((f) => ({ ...f, divisi: e.target.value }))}
                    placeholder="Divisi terkait"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Penanggung Jawab</label>
                  <input type="text" value={form.penanggungJawab} onChange={(e) => setForm((f) => ({ ...f, penanggungJawab: e.target.value }))}
                    placeholder="Nama PJ"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tenggat Waktu</label>
                  <input type="date" value={form.tenggat} onChange={(e) => setForm((f) => ({ ...f, tenggat: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProgramKerja["status"] }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="belum-mulai">Belum Mulai</option>
                    <option value="berjalan">Berjalan</option>
                    <option value="selesai">Selesai</option>
                    <option value="tertunda">Tertunda</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Progress: <span className="text-blue-600 font-bold">{form.progress}%</span>
                </label>
                <input type="range" min={0} max={100} value={form.progress}
                  onChange={(e) => setForm((f) => ({ ...f, progress: Number(e.target.value) }))}
                  className="w-full h-2 accent-blue-600" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">
                Batal
              </button>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 active:scale-95">
                <Check className="w-4 h-4" />
                {editTarget ? "Simpan" : "Tambah"}
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
            <h3 className="font-bold text-slate-800 text-lg mb-2">Hapus Program?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Hapus program <strong>{deleteTarget.nama}</strong>? Tindakan ini tidak bisa dibatalkan.
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
        </>
      )}
    </div>
  );
}
