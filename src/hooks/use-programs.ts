"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchPrograms, createProgram, updateProgram, deleteProgram, subscribeProgramKerja,
  fetchMonev, createMonev, updateMonev, deleteMonev, subscribeMonev,
} from "@/lib/program-service";
import type { ProgramKerja, MonevItem } from "@/lib/mock-data";

export function useProgramKerja() {
  const [programs, setPrograms] = useState<ProgramKerja[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await fetchPrograms();
    setPrograms(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const unsub = subscribeProgramKerja(() => void load());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ipi_programs_v1") void load();
    };
    window.addEventListener("storage", onStorage);
    return () => { unsub(); window.removeEventListener("storage", onStorage); };
  }, [load]);

  const add = useCallback(async (input: Omit<ProgramKerja, "id">) => createProgram(input), []);
  const edit = useCallback(async (id: string, input: Partial<Omit<ProgramKerja, "id">>) => updateProgram(id, input), []);
  const remove = useCallback(async (id: string) => deleteProgram(id), []);

  return { programs, isLoading, refetch: load, add, edit, remove };
}

export function useMonev() {
  const [monevList, setMonevList] = useState<MonevItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await fetchMonev();
    setMonevList(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const unsub = subscribeMonev(() => void load());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ipi_monev_v1") void load();
    };
    window.addEventListener("storage", onStorage);
    return () => { unsub(); window.removeEventListener("storage", onStorage); };
  }, [load]);

  const add = useCallback(async (input: Omit<MonevItem, "id">) => createMonev(input), []);
  const edit = useCallback(async (id: string, input: Partial<Omit<MonevItem, "id">>) => updateMonev(id, input), []);
  const remove = useCallback(async (id: string) => deleteMonev(id), []);

  return { monevList, isLoading, refetch: load, add, edit, remove };
}
