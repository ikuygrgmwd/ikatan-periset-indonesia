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
      setError("Email dan password harus diisi.");
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
                Password
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
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
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

          {/* Demo credentials */}
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@periset.id");
                setPassword("admin123");
                setError("");
              }}
              className="flex-1 rounded-lg border border-blue-300/40 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
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
              className="flex-1 rounded-lg border border-blue-300/40 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
            >
              Isi Demo Periset
            </button>
          </div>
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-blue-200 text-xs font-semibold mb-1">
              🔑 Demo Login
            </p>
            <p className="text-blue-300 text-xs">
              Email:{" "}
              <span className="text-white font-mono">admin@periset.id</span>
            </p>
            <p className="text-blue-300 text-xs">
              Password Admin:{" "}
              <span className="text-white font-mono">admin123</span>
            </p>
            <p className="mt-3 text-xs text-blue-200">
              Periset:{" "}
              <span className="font-mono text-white">periset1@periset.id</span>
            </p>
            <p className="text-xs text-blue-200">
              Password: <span className="font-mono text-white">periset123</span>
            </p>
            <p className="mt-3 text-xs text-blue-200">
              Demo lokal · Perubahan tersimpan pada browser ini.
            </p>
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
