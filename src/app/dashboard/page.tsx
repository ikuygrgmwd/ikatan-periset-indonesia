"use client";
import { useAuth } from "@/contexts/auth-context";
import { IndonesiaMap } from "@/components/dashboard/indonesia-map";
import { useEmployees } from "@/hooks/use-employees";
import { useProgramKerja, useMonev } from "@/hooks/use-programs";
import React from "react";
import { type ProgramKerja } from "@/lib/mock-data";
import { Users, ClipboardList, BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { programs } = useProgramKerja();
  const { monevList } = useMonev();
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === "aktif").length;
  const totalPrograms = programs.length;
  const completedPrograms = programs.filter((p) => p.status === "selesai").length;
  const runningPrograms = programs.filter((p) => p.status === "berjalan").length;
  const avgCapaian =
    monevList.length > 0
      ? Math.round(monevList.reduce((s, m) => s + m.capaian, 0) / monevList.length)
      : 0;

  const stats = [
    {
      label: "Total Periset",
      value: totalEmployees,
      sub: `${activeEmployees} aktif`,
      icon: Users,
      color: "bg-blue-500",
      light: "bg-blue-50",
      textColor: "text-blue-600",
      href: user?.role === "admin" ? "/dashboard/karyawan" : "/dashboard/settings",
    },
    {
      label: "Program Kerja",
      value: totalPrograms,
      sub: `${completedPrograms} selesai`,
      icon: ClipboardList,
      color: "bg-indigo-500",
      light: "bg-indigo-50",
      textColor: "text-indigo-600",
      href: "/dashboard/program-kerja",
    },
    {
      label: "Prog. Berjalan",
      value: runningPrograms,
      sub: "saat ini",
      icon: TrendingUp,
      color: "bg-green-500",
      light: "bg-green-50",
      textColor: "text-green-600",
      href: "/dashboard/program-kerja",
    },
    {
      label: "Rata-rata Capaian",
      value: `${avgCapaian}%`,
      sub: "dari target monev",
      icon: BarChart3,
      color: "bg-purple-500",
      light: "bg-purple-50",
      textColor: "text-purple-600",
      href: "/dashboard/monev",
    },
  ];

  const statusIcon: Record<ProgramKerja["status"], React.ReactNode> = {
    "selesai": <CheckCircle2 className="w-4 h-4 text-green-500" />,
    "berjalan": <Clock className="w-4 h-4 text-blue-500" />,
    "belum-mulai": <Clock className="w-4 h-4 text-slate-400" />,
    "tertunda": <AlertTriangle className="w-4 h-4 text-yellow-500" />,
  };

  const statusLabel: Record<ProgramKerja["status"], string> = {
    "selesai": "Selesai",
    "berjalan": "Berjalan",
    "belum-mulai": "Belum Mulai",
    "tertunda": "Tertunda",
  };

  const statusClass: Record<ProgramKerja["status"], string> = {
    "selesai": "bg-green-100 text-green-700",
    "berjalan": "bg-blue-100 text-blue-700",
    "belum-mulai": "bg-slate-100 text-slate-600",
    "tertunda": "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm mt-1">
          Selamat datang! Berikut ringkasan data terkini Ikatan Periset Indonesia.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 ${s.light} rounded-xl flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.textColor}`} />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <p className="text-2xl font-extrabold text-slate-800">{s.value}</p>
            <p className="text-sm font-medium text-slate-600 mt-0.5">{s.label}</p>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </Link>
        ))}
      </div>

      <IndonesiaMap />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Kerja Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Program Kerja Terbaru</h2>
            <Link href="/dashboard/program-kerja" className="text-xs text-blue-600 hover:underline font-medium">
              Lihat semua
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {programs.slice(0, 5).map((p) => (
              <div key={p.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{p.nama}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.divisi}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusClass[p.status]}`}>
                    {statusIcon[p.status]}
                    {statusLabel[p.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monev Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Capaian Kinerja (Monev)</h2>
            <Link href="/dashboard/monev" className="text-xs text-blue-600 hover:underline font-medium">
              Detail monev
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {monevList.slice(0, 5).map((m) => (
              <div key={m.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-slate-600 truncate max-w-[70%]">
                    {m.namaProgram}
                  </p>
                  <span
                    className={`text-xs font-bold ${
                      m.capaian >= 100
                        ? "text-green-600"
                        : m.capaian >= 75
                        ? "text-blue-600"
                        : m.capaian >= 50
                        ? "text-yellow-600"
                        : "text-red-500"
                    }`}
                  >
                    {m.capaian}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      m.capaian >= 100
                        ? "bg-green-500"
                        : m.capaian >= 75
                        ? "bg-blue-500"
                        : m.capaian >= 50
                        ? "bg-yellow-500"
                        : "bg-red-400"
                    }`}
                    style={{ width: `${Math.min(m.capaian, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


