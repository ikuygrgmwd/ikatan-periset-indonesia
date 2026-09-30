"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { FlaskConical, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Berita", href: "/#berita" },
  { label: "Tentang Kami", href: "/#tentang" },
];

export function PublicNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-base leading-tight">
              Ikatan Periset{" "}
              <span className="text-blue-600">Indonesia</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Dasbor
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
              <Link href="/daftar" className="px-4 py-2 rounded-lg border border-blue-200 text-sm font-semibold text-blue-700 hover:bg-blue-50">Daftar</Link>
              <Link
                href="/login"
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-900/20 transition-all active:scale-95"
              >
                Masuk
              </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200">
            {user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100">
                  Dasbor
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                  Keluar
                </button>
              </>
            ) : (
              <>
              <Link href="/daftar" onClick={() => setMenuOpen(false)} className="mb-2 block rounded-lg border border-blue-200 px-3 py-2.5 text-center text-sm font-semibold text-blue-700">Daftar</Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white text-center"
              >
                Masuk
              </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
