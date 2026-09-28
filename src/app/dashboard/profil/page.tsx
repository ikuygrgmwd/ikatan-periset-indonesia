"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { ProfileEditor } from "@/components/research/profile-editor";
export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
        <p className="mt-1 text-sm text-slate-600">
          Perbarui identitas, foto, dan biografi riset Anda.
        </p>
      </div>
      <section className="rounded-2xl border bg-white p-6">
        <ProfileEditor key={user.id} userId={user.id} />
      </section>
      <Link
        className="inline-block font-medium text-blue-700 hover:underline"
        href="/dashboard/portofolio"
      >
        Kelola publikasi, hak cipta, dan karya lainnya →
      </Link>
    </div>
  );
}
