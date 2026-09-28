"use client";

import { useState } from "react";
import { MOCK_EMPLOYEES, type Employee } from "@/lib/mock-data";
import {
  Plus, Pencil, Trash2, Search, X, Check, Phone, Mail, Hash,
  Microscope, Briefcase, Shield
} from "lucide-react";

const emptyEmployee: Omit<Employee, "id"> = {
  name: "",
  nip: "",
  bidangRiset: "",
  jabatan: "",
  email: "",
  phone: "",
  status: "aktif",
};

export default function KaryawanPage() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [form, setForm] = useState<Omit<Employee, "id">>(emptyEmployee);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.nip.includes(search) ||
      e.bidangRiset.toLowerCase().includes(search.toLowerCase()) ||
      e.jabatan.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Karyawan & Periset</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola data seluruh periset dan karyawan IPI
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Tambah Periset
        </button>
      </div>

      {/* Search & summary */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, NIP, jabatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
        <div className="flex gap-3 text-sm">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium">
            Total: {filtered.length}
          </span>
          <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-medium">
            Aktif: {filtered.filter((e) => e.status === "aktif").length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Nama / NIP</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Bidang Riset</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Jabatan</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Kontak</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-600">Status</th>
                <th className="px-5 py-3.5 text-center font-semibold text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada data periset ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{emp.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Hash className="w-3 h-3" /> {emp.nip}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Microscope className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        {emp.bidangRiset}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <Briefcase className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        {emp.jabatan}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Mail className="w-3.5 h-3.5" /> {emp.email}
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
                        <Phone className="w-3.5 h-3.5" /> {emp.phone}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          emp.status === "aktif"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {emp.status === "aktif" ? "Aktif" : "Non-Aktif"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(emp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Hapus"
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-lg">
                {editTarget ? "Edit Data Periset" : "Tambah Periset Baru"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: "Nama Lengkap", key: "name", placeholder: "Dr. Nama Lengkap", colSpan: true },
                { label: "NIP / ID Periset", key: "nip", placeholder: "19XXXXXXXXXXXXXXXXX" },
                { label: "Bidang Riset", key: "bidangRiset", placeholder: "Contoh: Bioteknologi" },
                { label: "Jabatan", key: "jabatan", placeholder: "Contoh: Peneliti Utama" },
                { label: "Email", key: "email", placeholder: "nama@periset.or.id" },
                { label: "Nomor Telepon", key: "phone", placeholder: "08XXXXXXXXXX" },
              ].map(({ label, key, placeholder, colSpan }) => (
                <div key={key} className={colSpan ? "col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={(form as Record<string, string>)[key] || ""}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "aktif" | "nonaktif" }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-Aktif</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 active:scale-95"
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Hapus Periset?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Anda akan menghapus data <strong>{deleteTarget.name}</strong>. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 active:scale-95"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
