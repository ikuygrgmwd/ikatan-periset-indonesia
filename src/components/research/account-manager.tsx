"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  LOCATIONS,
  type Account,
  type AccountInput,
} from "@/lib/research-store";
import {
  Field,
  LocationSelect,
  Notice,
  ProfileEditor,
} from "@/components/research/profile-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

const blank: AccountInput = {
  name: "",
  email: "",
  password: "",
  role: "periset",
  locationId: "jakarta",
};
export function AccountManager({
  researchersOnly = false,
}: {
  researchersOnly?: boolean;
}) {
  const { database, user, mutate } = useAuth();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Account | null>(null);
  const [form, setForm] = useState<AccountInput>(blank);
  const [deleting, setDeleting] = useState<Account | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  if (user?.role !== "admin") return null;
  const rows = database.accounts.filter((a) => {
    const profile = database.profiles.find((p) => p.userId === a.id);
    return (
      (!researchersOnly || a.role === "periset") &&
      `${a.name} ${a.email} ${profile?.nip} ${profile?.bidangRiset}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });
  function edit(account: Account | null) {
    setTarget(account);
    setError("");
    setMessage("");
    setForm(
      account
        ? {
            name: account.name,
            email: account.email,
            role: account.role,
            password: "",
            locationId: database.profiles.find((p) => p.userId === account.id)!
              .locationId,
          }
        : { ...blank },
    );
    setOpen(true);
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {researchersOnly ? "Direktori Periset" : "Master Akun"}
          </h2>
          <p className="text-sm text-slate-500">
            {rows.length} akun · Akun baru dapat langsung digunakan untuk login.
          </p>
        </div>
        <Button
          onClick={() => edit(null)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus />
          Tambah Periset
        </Button>
      </div>
      <Input
        aria-label="Cari akun"
        placeholder="Cari nama, email, NIP, bidang riset..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      {!open && !deleting && <Notice error={error} message={message} />}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {[
                "Nama / Email",
                "Bidang / Lokasi",
                "Role",
                "Status",
                "Aksi",
              ].map((h) => (
                <th className="px-4 py-3" key={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((a) => {
              const profile = database.profiles.find((p) => p.userId === a.id)!;
              return (
                <tr key={a.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-800">{a.name}</p>
                    <p className="text-slate-500">{a.email}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {profile.bidangRiset || "Belum diisi"}
                    <p className="text-xs">
                      {LOCATIONS.find((l) => l.id === profile.locationId)?.name}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${a.role === "admin" ? "bg-indigo-100 text-indigo-800" : "bg-cyan-100 text-cyan-800"}`}
                    >
                      {a.role === "admin" ? "Admin" : "Periset"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {profile.status === "aktif" ? "Aktif" : "Nonaktif"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setProfileId(a.id)}
                      >
                        Profil
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Edit akun ${a.name}`}
                        onClick={() => edit(a)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        disabled={a.id === user.id}
                        aria-label={`Hapus akun ${a.name}`}
                        onClick={() => {
                          setError("");
                          setDeleting(a);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Tidak ada akun ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogTitle>
            {target ? "Edit Akun & Role" : "Tambah Akun Periset"}
          </DialogTitle>
          <DialogDescription>
            Kelola identitas login, lokasi, dan hak akses akun.
          </DialogDescription>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const result = mutate({
                type: "account.save",
                id: target?.id,
                input: form,
              });
              setError(result.error || "");
              if (!result.error) {
                setOpen(false);
                setMessage("Akun berhasil disimpan.");
              }
            }}
          >
            <Field label="Nama lengkap">
              <Input
                required
                minLength={2}
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </Field>
            <Field label="Email login">
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </Field>
            <Field
              label={
                target
                  ? "Password baru (kosongkan jika tetap)"
                  : "Password awal (minimal 8 karakter)"
              }
            >
              <Input
                type="password"
                autoComplete="new-password"
                required={!target}
                minLength={8}
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />
            </Field>
            <Field label="Role">
              <select
                className="h-9 rounded-lg border px-3"
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    role: e.target.value as AccountInput["role"],
                  }))
                }
              >
                <option value="periset">Periset</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <Field label="Lokasi riset">
              <LocationSelect
                value={form.locationId}
                onChange={(locationId) =>
                  setForm((f) => ({ ...f, locationId }))
                }
              />
            </Field>
            <Notice error={error} />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Simpan Akun</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!deleting}
        onOpenChange={(value) => {
          if (!value) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Hapus akun?</DialogTitle>
          <DialogDescription>
            Akun {deleting?.name}, profil, dan seluruh portofolionya akan
            dihapus.
          </DialogDescription>
          <Notice error={error} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleting) return;
                const result = mutate({
                  type: "account.delete",
                  id: deleting.id,
                });
                setError(result.error || "");
                if (!result.error) {
                  setDeleting(null);
                  setMessage("Akun berhasil dihapus.");
                }
              }}
            >
              Ya, Hapus Akun
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!profileId}
        onOpenChange={(value) => {
          if (!value) setProfileId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogTitle>Edit Profil Periset</DialogTitle>
          <DialogDescription>
            Perbarui data kepegawaian, foto, dan biografi.
          </DialogDescription>
          {profileId && database.accounts.some((a) => a.id === profileId) && (
            <ProfileEditor key={profileId} userId={profileId} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
