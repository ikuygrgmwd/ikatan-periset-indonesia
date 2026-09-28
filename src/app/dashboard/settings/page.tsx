"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  ProfileEditor,
  Field,
  Notice,
} from "@/components/research/profile-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Lock } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, database, mutate } = useAuth();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  if (!user) return null;
  const profile = database.profiles.find((p) => p.userId === user.id)!;
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h1>
        <p className="mt-1 text-sm text-slate-600">
          Kelola profil dan keamanan akun{" "}
          {user.role === "admin" ? "Admin" : "Periset"} Anda.
        </p>
      </div>

      <Tabs defaultValue="profil">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="profil" className="gap-1.5">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-1.5">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Ganti Password</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Tab: Profil ───────────────────────────────────── */}
        <TabsContent value="profil">
          <section className="rounded-2xl border bg-white p-6 mt-4">
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              Profil Saya
            </h2>
            <ProfileEditor key={user.id} userId={user.id} />
            <div className="mt-4 pt-4 border-t">
              <Link
                className="inline-block font-medium text-blue-700 hover:underline text-sm"
                href="/dashboard/portofolio"
              >
                Kelola publikasi, hak cipta, dan karya lainnya →
              </Link>
            </div>
          </section>

          {/* Hak Akses & Role */}
          <section className="rounded-2xl border bg-white p-6 mt-4">
            <h2 className="mb-3 text-lg font-bold text-slate-900">
              Hak Akses &amp; Role
            </h2>
            <p className="text-sm text-slate-600">
              {user.role === "admin"
                ? "Admin dapat mengakses seluruh halaman, menambah akun, mengubah role, serta mengelola profil dan akun periset."
                : "Periset dapat mengelola profil dan portofolio sendiri serta mengakses dashboard, program kerja, dan monitoring. Manajemen akun dan Karyawan & Periset khusus Admin."}
            </p>
          </section>
        </TabsContent>

        {/* ── Tab: Ganti Password ────────────────────────────── */}
        <TabsContent value="password">
          <section className="rounded-2xl border bg-white p-6 mt-4">
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
                const result = mutate({
                  type: "password.save",
                  current,
                  password,
                });
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
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Perbarui Password
              </Button>
            </form>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
