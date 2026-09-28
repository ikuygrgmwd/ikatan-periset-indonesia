"use client";

import { useState } from "react";
import { MOCK_EMPLOYEES, RESEARCH_HUBS, type Employee, type ResearchHub } from "@/lib/mock-data";
import {
  Plus, Pencil, Trash2, Search, X, Check, Phone, Mail, Hash,
  Microscope, Briefcase, MapPin, Filter, RotateCcw
} from "lucide-react";
import { IndonesiaMap } from "@/components/dashboard/indonesia-map";

const emptyEmployee: Omit<Employee, "id"> = {
  name: "",
  nip: "",
  bidangRiset: "",
  jabatan: "",
  email: "",
  phone: "",
  status: "aktif",
  lokasiHub: "BRIN Gatot Subroto",
};

export default function KaryawanPage() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [search, setSearch] = useState("");
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [form, setForm] = useState<Omit<Employee, "id">>(emptyEmployee);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const selectedHub = selectedHubId ? RESEARCH_HUBS.find((h) => h.id === selectedHubId) : null;

  const filtered = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.nip.includes(search) ||
      e.bidangRiset.toLowerCase().includes(search.toLowerCase()) ||
      e.jabatan.toLowerCase().includes(search.toLowerCase()) ||
      (e.lokasiHub && e.lokasiHub.toLowerCase().includes(search.toLowerCase()));

    const matchesHub =
      !selectedHub || (e.lokasiHub && e.lokasiHub.toLowerCase().includes(selectedHub.shortName.toLowerCase()));

    return matchesSearch && matchesHub;
  });

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyEmployee);
    setModalOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setEditTarget(emp);
    setForm({
      name: emp.name,
      nip: emp.nip,
      bidangRiset: emp.bidangRiset,
      jabatan: emp.jabatan,
      email: emp.email,
      phone: emp.phone,
      status: emp.status,
      lokasiHub: emp.lokasiHub || "BRIN Gatot Subroto",
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.nip) return;
    if (editTarget) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === editTarget.id ? { ...editTarget, ...form } : e))
      );
    } else {
      setEmployees((prev) => [
        ...prev,
        { ...form, id: `e${Date.now()}` },
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Karyawan & Periset</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola data seluruh periset, bidang kepakaran, dan sebaran fasilitas riset IPI
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Periset
        </button>
      </div>

      {/* 1. INTERACTIVE INDONESIA MAP SECTION */}
      <IndonesiaMap
        selectedHubId={selectedHubId}
        onSelectHub={(hub) => setSelectedHubId(hub ? hub.id : null)}
      />

      {/* Active Filter Notification Bar */}
      {selectedHub && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-900">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Menampilkan periset di kawasan: <strong>{selectedHub.name}</strong> ({selectedHub.city})
            </span>
          </div>
          <button
            onClick={() => setSelectedHubId(null)}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Tampilkan Semua Periset
          </button>
        </div>
      )}

      {/* Search & summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama, NIP, bidang riset, lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>
        <div className="flex items-center gap-2 text-sm shrink-0">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg font-semibold text-xs">
            Ditemukan: {filtered.length} Periset
          </span>
          <span className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-lg font-semibold text-xs">
            Aktif: {filtered.filter((e) => e.status === "aktif").length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200">
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Nama / NIP</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Bidang Riset</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Lokasi Hub</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Kontak</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Status</th>
                <th className="px-5 py-3.5 text-center font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada data periset yang cocok dengan kriteria pencarian/filter.
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{emp.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Hash className="w-3 h-3 text-slate-400" /> {emp.nip}
                      </p>
                      <p className="text-xs text-indigo-600 font-medium mt-0.5 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-indigo-400" /> {emp.jabatan}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Microscope className="w-4 h-4 text-blue-600 shrink-0" />
                        {emp.bidangRiset}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {emp.lokasiHub || "BRIN Gatot Subroto"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="flex items-center gap-1.5 text-slate-600 text-xs">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {emp.email}
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-600 text-xs mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {emp.phone}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          emp.status === "aktif"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {emp.status === "aktif" ? "Aktif" : "Non-Aktif"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit Data"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Hapus Data"
                        >
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-bold text-slate-900 text-lg">
                {editTarget ? "Edit Data Periset" : "Tambah Periset Baru"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto">
              {[
                { label: "Nama Lengkap & Gelar", key: "name", placeholder: "Contoh: Dr. Nama Lengkap, M.Sc.", colSpan: true },
                { label: "NIP / ID Periset", key: "nip", placeholder: "19XXXXXXXXXXXXXXXXX" },
                { label: "Bidang Riset", key: "bidangRiset", placeholder: "Contoh: Bioteknologi Tropis" },
                { label: "Jabatan Organisasi / Peneliti", key: "jabatan", placeholder: "Contoh: Peneliti Utama" },
                { label: "Email Resmi", key: "email", placeholder: "nama@periset.or.id" },
                { label: "Nomor Telepon / WhatsApp", key: "phone", placeholder: "08XXXXXXXXXX" },
              ].map(({ label, key, placeholder, colSpan }) => (
                <div key={key} className={colSpan ? "col-span-2" : ""}>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={(form as Record<string, string>)[key] || ""}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                  />
                </div>
              ))}

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Lokasi Hub Riset</label>
                <select
                  value={form.lokasiHub || "BRIN Gatot Subroto"}
                  onChange={(e) => setForm((f) => ({ ...f, lokasiHub: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                >
                  {RESEARCH_HUBS.map((hub) => (
                    <option key={hub.id} value={hub.name}>
                      {hub.name} ({hub.city} - {hub.province})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Keaktifan</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "aktif" | "nonaktif" }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-Aktif</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                {editTarget ? "Simpan Perubahan" : "Tambah Periset"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Hapus Data Periset?</h3>
            <p className="text-slate-600 text-sm mb-6">
              Anda akan menghapus data <strong>{deleteTarget.name}</strong>. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
