"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { iuranUntukPengguna, tanggalHariIni } from "@/lib/iuran";

// Replace Auth's local repository with a server repository for production.
export function useIuran() {
  const { user, database, isLoading, mutate } = useAuth();
  const [hariIni, setHariIni] = useState("");

  useEffect(() => {
    const refresh = () => {
      const today = tanggalHariIni();
      setHariIni(today);
    };
    const initial = window.setTimeout(refresh, 0);
    // Recheck while open and immediately on returning from an inactive tab.
    const interval = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const bayar = (id: string) => {
    const today = tanggalHariIni();
    setHariIni(today);
    return mutate({ type: "iuran.pay", id });
  };

  return {
    data: iuranUntukPengguna(database.iuran ?? [], user, hariIni),
    accounts: user?.role === "admin" ? database.accounts : database.accounts.filter((a) => a.id === user?.id),
    isAdmin: user?.role === "admin",
    userId: user?.id,
    isLoading: isLoading || !hariIni,
    bayar,
  };
}
