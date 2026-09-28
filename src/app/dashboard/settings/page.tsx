"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  User, Lock, Shield, Bell, Save, Check, Eye, EyeOff, AlertCircle
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    jabatan: "Ketua Umum",
    phone: "081234567890",
    bio: "Peneliti senior di bidang kebijakan riset dan inovasi nasional.",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    emailBerita: true,
    emailProgram: true,
    emailMonev: false,
    systemAlert: true,
  });

  const handleProfileSave = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handlePasswordSave = () => {
    setPasswordError("");
    if (!passwordForm.currentPassword) {
      setPasswordError("Password saat ini harus diisi.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password baru minimal 8 karakter.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }
    setPasswordSaved(true);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  const roleLabels: Record<string, string> = {
    admin: "Administrator",
    operator: "Operator",
    viewer: "Viewer",
  };

  const roleDescriptions: Record<string, string> = {
    admin: "Akses penuh ke seluruh fitur termasuk manajemen akun dan pengaturan sistem.",
    operator: "Dapat menginput dan mengedit data, tetapi tidak dapat mengelola akun pengguna.",
    viewer: "Hanya dapat melihat data tanpa dapat melakukan perubahan apapun.",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Pengaturan Akun</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola profil, keamanan, dan preferensi akun Anda</p>
      </div>

      {/* Profile */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-slate-800">Profil Saya</h2>
        </div>
        <div className="p-6">
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-md">
              {profileForm.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-lg">{profileForm.name}</p>
              <p className="text-slate-500 text-sm">{profileForm.email}</p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                {roleLabels[user?.role || "viewer"]}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Nama Lengkap", key: "name" },
              { label: "Email", key: "email" },
              { label: "Jabatan", key: "jabatan" },
              { label: "Nomor Telepon", key: "phone" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                <input
                  type="text"
                  value={(profileForm as Record<string, string>)[key]}
                  onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bio / Deskripsi</label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleProfileSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                profileSaved
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {profileSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {profileSaved ? "Tersimpan!" : "Simpan Profil"}
            </button>
          </div>
        </div>
      </section>

      {/* Password */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-slate-800">Ganti Password</h2>
        </div>
        <div className="p-6 space-y-4">
          {passwordError && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {passwordError}
            </div>
          )}
          {passwordSaved && (
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
              <Check className="w-4 h-4 flex-shrink-0" />
              Password berhasil diperbarui!
            </div>
          )}

          {[
            { label: "Password Saat Ini", key: "currentPassword", showKey: "current" },
            { label: "Password Baru", key: "newPassword", showKey: "new" },
            { label: "Konfirmasi Password Baru", key: "confirmPassword", showKey: "confirm" },
          ].map(({ label, key, showKey }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type={(showPass as Record<string, boolean>)[showKey] ? "text" : "password"}
                  value={(passwordForm as Record<string, string>)[key]}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-11 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => ({ ...s, [showKey]: !(s as Record<string, boolean>)[showKey] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {(showPass as Record<string, boolean>)[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={handlePasswordSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all"
            >
              <Lock className="w-4 h-4" /> Perbarui Password
            </button>
          </div>
        </div>
      </section>

      {/* Role Info */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-slate-800">Hak Akses & Role</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {(["admin", "operator", "viewer"] as const).map((role) => (
              <div
                key={role}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                  user?.role === role
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 border-2 ${
                    user?.role === role ? "bg-blue-600 border-blue-600" : "border-slate-300"
                  }`}
                />
                <div>
                  <p className={`text-sm font-bold ${user?.role === role ? "text-blue-700" : "text-slate-700"}`}>
                    {roleLabels[role]}
                    {user?.role === role && (
                      <span className="ml-2 text-xs font-normal text-blue-500">(Role Anda saat ini)</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{roleDescriptions[role]}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Perubahan role hanya dapat dilakukan oleh administrator sistem.
          </p>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-slate-800">Preferensi Notifikasi</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: "emailBerita", label: "Email Berita Baru", desc: "Terima email saat ada berita baru dipublikasikan" },
            { key: "emailProgram", label: "Email Update Program", desc: "Terima email saat ada perubahan status program kerja" },
            { key: "emailMonev", label: "Email Laporan Monev", desc: "Terima email untuk pengingat laporan monev periodik" },
            { key: "systemAlert", label: "Notifikasi Sistem", desc: "Terima notifikasi in-app untuk aktivitas sistem penting" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setNotifications((n) => ({ ...n, [key]: !(n as Record<string, boolean>)[key] }))}
                className={`relative w-11 h-6 rounded-full transition-all ${
                  (notifications as Record<string, boolean>)[key] ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                    (notifications as Record<string, boolean>)[key] ? "left-5.5 translate-x-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
