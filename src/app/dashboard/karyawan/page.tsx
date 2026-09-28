"use client";
import { AccountManager } from "@/components/research/account-manager";
export default function KaryawanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Karyawan & Periset
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Kelola akun dan profil periset IPI di seluruh Indonesia.
        </p>
      </div>
      <AccountManager />
    </div>
  );
}
