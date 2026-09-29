"use client";

import { useEffect, useState } from "react";
import { bayarIuran, buatContohIuran, statusIuran, tanggalHariIni, type Iuran } from "@/lib/iuran";

// The UI depends on this hook only. Replace initialization/payment here with a
// Supabase repository later; production payments must be verified by the server.
export function useIuran() {
  const [data, setData] = useState<Iuran[] | null>(null);
  const [hariIni, setHariIni] = useState("");

  useEffect(() => {
    const refresh = () => {
      const today = tanggalHariIni();
      setHariIni(today);
      setData((current) => current ?? buatContohIuran(today));
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
    setData((current) => current?.map((item) => item.id === id ? bayarIuran(item, today) : item) ?? null);
  };

  return {
    data: (data ?? []).map((item) => ({ ...item, statusPembayaran: statusIuran(item, hariIni) })),
    isLoading: data === null,
    bayar,
  };
}
