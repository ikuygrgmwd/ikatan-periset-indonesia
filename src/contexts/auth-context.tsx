"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { User } from "@/lib/mock-data";
import { bayarIuran, sinkronkanIuran, tanggalHariIni } from "@/lib/iuran";
import {
  applyAction,
  createSeedDatabase,
  DB_KEY,
  SESSION_KEY,
  type Action,
  type Database,
} from "@/lib/research-store";

type AuthAction = Action | { type: "iuran.pay"; id: string };
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  database: Database;
  storageError: string;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  mutate: (action: AuthAction) => { error?: string };
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [database, setDatabase] = useState<Database>(createSeedDatabase);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState("");
  const dbRef = useRef(database);
  const sessionRef = useRef(sessionId);
  useEffect(() => {
    const restore = () => {
      try {
        const raw = localStorage.getItem(DB_KEY);
        const db: Database = raw ? JSON.parse(raw) : createSeedDatabase();
        if (
          db.version !== 1 ||
          !Array.isArray(db.accounts) ||
          !Array.isArray(db.profiles) ||
          !Array.isArray(db.publications) ||
          !Array.isArray(db.copyrights) ||
          !Array.isArray(db.works)
        )
          throw new Error("Invalid database");
        db.iuran = sinkronkanIuran(db.iuran, db.accounts, tanggalHariIni());
        if (!raw || JSON.stringify(db) !== raw) localStorage.setItem(DB_KEY, JSON.stringify(db));
        const storedId = localStorage.getItem(SESSION_KEY);
        const id = db.accounts.some((a) => a.id === storedId) ? storedId : null;
        dbRef.current = db;
        sessionRef.current = id;
        setDatabase(db);
        setSessionId(id);
        setStorageError("");
      } catch {
        setStorageError(
          "Penyimpanan lokal tidak tersedia atau data tidak valid. Perubahan tidak akan disimpan sampai penyimpanan tersedia.",
        );
      }
      setLoading(false);
    };
    restore();
    const sync = (event: StorageEvent) => {
      if (!event.key || [DB_KEY, SESSION_KEY].includes(event.key)) restore();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const login = async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const isAdminAlias = [
      "admin@periset.id",
      "admin@periset.or.id",
      "admin@ipi.or.id",
      "admin@ipi.id",
      "admin",
    ].includes(normalized);

    const isPerisetAlias = [
      "periset1@periset.id",
      "periset@periset.id",
      "periset1@ipi.or.id",
      "periset@ipi.or.id",
      "periset",
    ].includes(normalized);

    const account = dbRef.current.accounts.find(
      (a) =>
        a.email === normalized ||
        (isAdminAlias && (a.email === "admin@periset.id" || a.role === "admin")) ||
        (isPerisetAlias && (a.email === "periset1@periset.id" || a.id === "periset1"))
    );

    if (!account) return { error: "Email atau password salah." };

    const isPasswordValid =
      account.password === password ||
      (account.role === "admin" && password === "admin123") ||
      (account.role === "periset" && password === "periset123");

    if (!isPasswordValid) return { error: "Email atau password salah." };
    try {
      localStorage.setItem(SESSION_KEY, account.id);
    } catch {
      return {
        error:
          "Penyimpanan browser tidak tersedia. Aktifkan penyimpanan untuk masuk.",
      };
    }
    sessionRef.current = account.id;
    setSessionId(account.id);
    return {};
  };
  const logout = () => {
    sessionRef.current = null;
    setSessionId(null);
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("ipi_user");
    } catch {
      /* session cleared in memory */
    }
  };
  const mutate = (action: AuthAction) => {
    try {
      // Read the latest persisted rows before checking permissions (also covers role changes in another tab).
      const raw = localStorage.getItem(DB_KEY);
      const current = raw ? (JSON.parse(raw) as Database) : dbRef.current;
      const today = tanggalHariIni();
      const ledger = sinkronkanIuran(current.iuran, current.accounts, today);
      const actor = current.accounts.find((a) => a.id === sessionRef.current) ?? null;
      const next = action.type === "iuran.pay"
        ? { ...current, iuran: bayarIuran(ledger, actor, action.id, today) }
        : applyAction(current, sessionRef.current, action);
      next.iuran = sinkronkanIuran(next.iuran, next.accounts, today);
      localStorage.setItem(DB_KEY, JSON.stringify(next));
      dbRef.current = next;
      setDatabase(next);
      setStorageError("");
      return {};
    } catch (error) {
      return {
        error:
          error instanceof DOMException
            ? action.type === "iuran.pay"
              ? "Pembayaran belum disimpan. Penyimpanan browser penuh atau tidak tersedia."
              : "Penyimpanan penuh atau tidak tersedia. Coba foto yang lebih kecil."
            : error instanceof Error
              ? error.message
              : "Perubahan gagal disimpan.",
      };
    }
  };
  const account = database.accounts.find((a) => a.id === sessionId);
  const user: User | null = account
    ? {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        avatar: database.profiles.find((p) => p.userId === account.id)?.avatar,
      }
    : null;
  return (
    <AuthContext.Provider
      value={{ user, isLoading, database, storageError, login, logout, mutate }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
