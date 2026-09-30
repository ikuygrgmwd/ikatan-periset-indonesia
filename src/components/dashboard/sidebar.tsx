"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  ChevronLeft,
  FlaskConical,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dasbor",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  { label: "Portofolio Saya", href: "/dashboard/portofolio", icon: ClipboardList },
  {
    label: "Karyawan & Periset",
    href: "/dashboard/karyawan",
    icon: Users,
  },
  {
    label: "Program Kerja",
    href: "/dashboard/program-kerja",
    icon: ClipboardList,
  },
  {
    label: "Pemantauan & Evaluasi",
    href: "/dashboard/monev",
    icon: BarChart3,
  },
  {
    label: "Pengaturan Akun",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Donasi untuk Lembaga",
    href: "/dashboard/donasi",
    icon: Wallet,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-16 md:w-52 lg:w-64 shrink-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col sticky top-0 shadow-xl">
      {/* Logo */}
      <div className="p-3 md:p-6 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <span className="text-white font-bold text-sm leading-tight block">
              Ikatan Periset
            </span>
            <span className="text-slate-400 text-xs">Indonesia</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 md:p-4 space-y-1 overflow-y-auto">
        <p className="hidden md:block text-slate-400 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
          Menu Utama
        </p>
        {navItems.filter(item => item.href !== "/dashboard/karyawan" || user?.role === "admin").map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                  : "text-slate-400 hover:bg-slate-700 hover:text-white"
              )}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 md:p-4 border-t border-slate-700">
        <Link
          href="/"
          aria-label="Kembali ke Publik"
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-slate-700"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden md:inline">Kembali ke Publik</span>
        </Link>
      </div>
    </aside>
  );
}
