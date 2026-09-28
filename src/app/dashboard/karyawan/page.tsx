"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useEmployees } from "@/hooks/use-employees";
import {
  getEmployeeAvatar,
  getInitials,
  type EmployeeRecord,
} from "@/lib/employee-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Field,
  Notice,
} from "@/components/research/profile-editor";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  UserCircle,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";

type EmployeeFormData = {
  full_name: string;
  email: string;
  position: string;
  department: string;
  role: "admin" | "periset";
  phone_number: string;
  profile_photo_url: string;
  status: "aktif" | "nonaktif";
  nip: string;
  bidang_riset: string;
};

const blankForm: EmployeeFormData = {
  full_name: "",
  email: "",
  position: "Peneliti",
  department: "",
  role: "periset",
  phone_number: "",
  profile_photo_url: "",
  status: "aktif",
  nip: "",
  bidang_riset: "",
};

export default function KaryawanPage() {
  const { user } = useAuth();
  const { employees, isLoading, add, edit, remove } = useEmployees();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<EmployeeRecord | null>(null);
  const [form, setForm] = useState<EmployeeFormData>(blankForm);
  const [deleting, setDeleting] = useState<EmployeeRecord | null>(null);
  const [detailView, setDetailView] = useState<EmployeeRecord | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (user?.role !== "admin") {
    return (
      <section className="rounded-2xl border bg-white p-8">
        <h1 className="text-xl font-bold text-slate-900">Akses khusus Admin</h1>
        <p className="my-3 text-slate-600">
          Halaman Karyawan &amp; Periset hanya tersedia untuk Admin.
        </p>
        <Link href="/dashboard" className="text-blue-700 underline">
          Kembali ke Dashboard
        </Link>
      </section>
    );
  }

  const filteredEmployees = employees.filter((emp) =>
    `${emp.full_name} ${emp.email} ${emp.nip} ${emp.bidang_riset} ${emp.department} ${emp.position}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openEdit(employee: EmployeeRecord | null) {
    setTarget(employee);
    setError("");
    setMessage("");
    setForm(
      employee
        ? {
            full_name: employee.full_name,
            email: employee.email,
            position: employee.position,
            department: employee.department,
            role: employee.role,
            phone_number: employee.phone_number,
            profile_photo_url: employee.profile_photo_url,
            status: employee.status,
            nip: employee.nip,
            bidang_riset: employee.bidang_riset,
          }
        : { ...blankForm }
    );
    setOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.full_name.trim().length < 2) {
      setError("Nama minimal 2 karakter.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Email tidak valid.");
      return;
    }

    if (target) {
      const result = await edit(target.id, form);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        setMessage("Data karyawan berhasil diperbarui.");
      }
    } else {
      const result = await add(form);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        setMessage("Karyawan baru berhasil ditambahkan.");
      }
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    const result = await remove(deleting.id);
    if (result.error) {
      setError(result.error);
    } else {
      setDeleting(null);
      setMessage("Data karyawan berhasil dihapus.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Karyawan &amp; Periset
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Kelola data karyawan dan periset IPI di seluruh Indonesia.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            aria-label="Cari karyawan"
            placeholder="Cari nama, email, NIP, bidang riset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => openEdit(null)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Tambah Karyawan
        </Button>
      </div>

      {!open && !deleting && <Notice error={error} message={message} />}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {["Karyawan", "Bidang / Divisi", "Role", "Status", "Aksi"].map(
                  (h) => (
                    <th className="px-4 py-3 font-medium" key={h}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                        {emp.profile_photo_url ? (
                          <img
                            src={getEmployeeAvatar(emp)}
                            alt={emp.full_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.textContent = getInitials(emp.full_name);
                                parent.classList.add(
                                  "text-blue-700",
                                  "font-bold",
                                  "text-sm"
                                );
                              }
                            }}
                          />
                        ) : (
                          <span className="text-blue-700 font-bold text-sm">
                            {getInitials(emp.full_name)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {emp.full_name}
                        </p>
                        <p className="text-slate-500 text-xs">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {emp.bidang_riset || "Belum diisi"}
                    <p className="text-xs text-slate-400">{emp.department}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        emp.role === "admin"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-cyan-100 text-cyan-800"
                      }`}
                    >
                      {emp.role === "admin" ? "Admin" : "Periset"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        emp.status === "aktif"
                          ? "text-emerald-700"
                          : "text-slate-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          emp.status === "aktif"
                            ? "bg-emerald-500"
                            : "bg-slate-300"
                        }`}
                      />
                      {emp.status === "aktif" ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetailView(emp)}
                      >
                        <UserCircle className="w-4 h-4" />
                        Detail
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Edit ${emp.full_name}`}
                        onClick={() => openEdit(emp)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label={`Hapus ${emp.full_name}`}
                        onClick={() => {
                          setError("");
                          setDeleting(emp);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Tidak ada karyawan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t bg-slate-50 text-xs text-slate-500">
            Menampilkan {filteredEmployees.length} dari {employees.length}{" "}
            karyawan
          </div>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogTitle>
            {target ? "Edit Karyawan" : "Tambah Karyawan Baru"}
          </DialogTitle>
          <DialogDescription>
            {target
              ? "Perbarui data karyawan di bawah ini."
              : "Isi data karyawan baru."}
          </DialogDescription>
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama lengkap">
                <Input
                  required
                  minLength={2}
                  value={form.full_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, full_name: e.target.value }))
                  }
                />
              </Field>
              <Field label="Email">
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </Field>
              <Field label="NIP">
                <Input
                  value={form.nip}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nip: e.target.value }))
                  }
                />
              </Field>
              <Field label="Nomor Telepon">
                <Input
                  value={form.phone_number}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone_number: e.target.value }))
                  }
                />
              </Field>
              <Field label="Jabatan">
                <Input
                  value={form.position}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, position: e.target.value }))
                  }
                />
              </Field>
              <Field label="Divisi / Departemen">
                <Input
                  value={form.department}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, department: e.target.value }))
                  }
                />
              </Field>
              <Field label="Bidang Riset">
                <Input
                  value={form.bidang_riset}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bidang_riset: e.target.value }))
                  }
                />
              </Field>
              <Field label="Role">
                <select
                  className="h-9 rounded-lg border px-3 text-sm"
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      role: e.target.value as "admin" | "periset",
                    }))
                  }
                >
                  <option value="periset">Periset</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
              <Field label="Status">
                <select
                  className="h-9 rounded-lg border px-3 text-sm"
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as "aktif" | "nonaktif",
                    }))
                  }
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </Field>
              <Field label="URL Foto Profil (opsional)">
                <Input
                  type="url"
                  placeholder="https://..."
                  value={form.profile_photo_url}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      profile_photo_url: e.target.value,
                    }))
                  }
                />
              </Field>
            </div>
            <Notice error={error} />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                {target ? "Simpan Perubahan" : "Tambah Karyawan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleting}
        onOpenChange={(value) => {
          if (!value) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Hapus karyawan?</DialogTitle>
          <DialogDescription>
            Data <strong>{deleting?.full_name}</strong> akan dihapus secara
            permanen.
          </DialogDescription>
          <Notice error={error} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Ya, Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <Dialog
        open={!!detailView}
        onOpenChange={(value) => {
          if (!value) setDetailView(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Detail Karyawan</DialogTitle>
          <DialogDescription>
            Informasi lengkap karyawan.
          </DialogDescription>
          {detailView && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {detailView.profile_photo_url ? (
                    <img
                      src={getEmployeeAvatar(detailView)}
                      alt={detailView.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-700 font-bold text-lg">
                      {getInitials(detailView.full_name)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    {detailView.full_name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {detailView.position} · {detailView.department}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      detailView.status === "aktif"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {detailView.status === "aktif" ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {detailView.email}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {detailView.phone_number || "—"}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div>
                    <p className="text-xs text-slate-400">NIP</p>
                    <p className="text-slate-700">{detailView.nip || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Bidang Riset</p>
                    <p className="text-slate-700">
                      {detailView.bidang_riset || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Role</p>
                    <p className="text-slate-700 capitalize">
                      {detailView.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Terdaftar</p>
                    <p className="text-slate-700">
                      {new Date(detailView.created_at).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
