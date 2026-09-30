"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { FlaskConical, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan kata sandi harus diisi.");
      return;
    }
    setIsLoading(true);
    setError("");

    const result = await login(email, password);
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center p-4">
      {/* BG decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg mb-3">
              <FlaskConical className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-white">
              Ikatan Periset Indonesia
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              Masuk ke Portal Internal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error alert */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/20 border border-red-400/30 text-red-200 text-sm rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-blue-100 mb-1.5"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@periset.id"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-300/60 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-blue-100 mb-1.5"
              >
                Kata sandi
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-300/60 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-blue-200">Belum memiliki akun? <Link href="/daftar" className="font-semibold text-white hover:underline">Daftar sekarang</Link></p>

          {/* Demo credentials */}
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@periset.id");
                setPassword("admin123");
                setError("");
              }}
              className="flex-1 rounded-xl bg-blue-500/20 border border-blue-400/40 px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-500/30 transition-all shadow-sm"
            >
              Isi Demo Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("periset1@periset.id");
                setPassword("periset123");
                setError("");
              }}
              className="flex-1 rounded-xl bg-white/10 border border-white/20 px-3 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
            >
              Isi Demo Periset
            </button>
          </div>
          <div className="mt-5 p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
            <p className="text-blue-200 text-xs font-semibold mb-2">
              🔑 Kredensial Demo Akun
            </p>
            <div className="text-xs text-blue-300 space-y-1">
              <p>
                Admin: <span className="text-white font-mono font-bold">admin@periset.id</span> (atau cukup ketik <span className="text-white font-mono">admin</span>)
              </p>
              <p>
                Kata sandi: <span className="text-white font-mono font-bold">admin123</span>
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem("ipi_database_v1");
                    localStorage.removeItem("ipi_session_v1");
                    localStorage.removeItem("ipi_user");
                    window.location.reload();
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="text-[11px] text-amber-300 hover:text-amber-200 underline font-medium"
              >
                🔄 Pulihkan Data Akun / Kata Sandi ke Semula
              </button>
            </div>
          </div>

          <p className="text-center text-blue-300 text-sm mt-6">
            <Link href="/" className="hover:text-white transition-colors">
              ← Kembali ke Beranda
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
