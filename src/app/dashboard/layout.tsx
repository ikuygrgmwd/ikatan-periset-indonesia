"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, storageError } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const forbidden =
    (pathname === "/dashboard/karyawan" ||
      pathname.startsWith("/dashboard/karyawan/")) &&
    user?.role !== "admin";

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <DashboardSidebar />
      <div className="min-w-0 flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {storageError && (
            <p
              role="alert"
              className="mb-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800"
            >
              {storageError}
            </p>
          )}
          {forbidden ? (
            <section className="rounded-2xl border bg-white p-8">
              <h1 className="text-xl font-bold text-slate-900">
                Akses khusus Admin
              </h1>
              <p className="my-3 text-slate-600">
                Halaman Karyawan &amp; Periset hanya tersedia untuk Admin.
              </p>
              <Link href="/dashboard" className="text-blue-700 underline">
                Kembali ke Dashboard
              </Link>
            </section>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
