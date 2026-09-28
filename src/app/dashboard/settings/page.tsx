"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { AccountManager } from "@/components/research/account-manager";
import {
  ProfileEditor,
  Field,
  Notice,
} from "@/components/research/profile-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function SettingsPage() {
  const { user, database, mutate } = useAuth();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [notificationError, setNotificationError] = useState("");
  if (!user) return null;
  const profile = database.profiles.find((p) => p.userId === user.id)!;
  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h1>
        <p className="mt-1 text-sm text-slate-600">
          Profil, keamanan, dan hak akses{" "}
          {user.role === "admin" ? "Admin" : "Periset"}.
        </p>
      </div>
      {user.role === "admin" && (
        <section className="rounded-2xl border bg-white p-6">
          <AccountManager />
        </section>
      )}
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="mb-5 text-lg font-bold text-slate-900">Profil Saya</h2>
        <ProfileEditor key={user.id} userId={user.id} />
      </section>
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="mb-5 text-lg font-bold text-slate-900">
          Ganti Password
        </h2>
        <form
          className="max-w-lg space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage("");
            if (password !== confirm) {
              setError("Konfirmasi password tidak cocok.");
              return;
            }
            const result = mutate({ type: "password.save", current, password });
            setError(result.error || "");
            if (!result.error) {
              setMessage("Password berhasil diperbarui.");
              setCurrent("");
              setPassword("");
              setConfirm("");
            }
          }}
        >
          <Field label="Password saat ini">
            <Input
              required
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </Field>
          <Field label="Password baru">
            <Input
              required
              minLength={8}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field label="Konfirmasi password baru">
            <Input
              required
              minLength={8}
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </Field>
          <Notice error={error} message={message} />
          <Button type="submit">Perbarui Password</Button>
        </form>
      </section>
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          Hak Akses & Role
        </h2>
        <p className="text-sm text-slate-600">
          {user.role === "admin"
            ? "Admin dapat mengakses seluruh halaman, menambah akun, mengubah role, serta mengelola profil dan akun periset."
            : "Periset dapat mengelola profil dan portofolio sendiri serta mengakses dashboard, program kerja, dan monitoring. Manajemen akun dan Karyawan & Periset khusus Admin."}
        </p>
      </section>
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="mb-2 text-lg font-bold text-slate-900">
          Preferensi Notifikasi
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Preferensi tersimpan pada demo ini; pengiriman email belum terhubung.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              { key: "emailBerita", label: "Email berita baru" },
              { key: "emailProgram", label: "Email update program" },
              { key: "emailMonev", label: "Email laporan monev" },
              { key: "systemAlert", label: "Notifikasi sistem" },
            ] as const
          ).map((item) => (
            <label
              className="flex items-center gap-3 text-sm text-slate-700"
              key={item.key}
            >
              <input
                type="checkbox"
                checked={profile.notifications[item.key]}
                onChange={(e) => {
                  const result = mutate({
                    type: "profile.save",
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    input: {
                      ...profile,
                      notifications: {
                        ...profile.notifications,
                        [item.key]: e.target.checked,
                      },
                    },
                  });
                  setNotificationError(result.error || "");
                }}
              />
              {item.label}
            </label>
          ))}
        </div>
        <Notice error={notificationError} />
      </section>
    </div>
  );
}
