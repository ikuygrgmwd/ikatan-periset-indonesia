"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchEmployees,
  subscribeEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type EmployeeRecord,
} from "@/lib/employee-service";

/**
 * React hook that provides employee data and CRUD helpers with
 * automatic re-fetching on changes (real-time-like behavior).
 *
 * When Supabase is connected, replace the subscription with:
 *   supabase.channel('employees').on('postgres_changes', ...).subscribe()
 */
export function useEmployees() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await fetchEmployees();
    setEmployees(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load();

    // Subscribe to local changes (mock real-time)
    const unsubscribe = subscribeEmployees(() => {
      void load();
    });

    // Also listen for cross-tab storage events
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ipi_employees_v1") void load();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, [load]);

  const add = useCallback(
    async (input: Omit<EmployeeRecord, "id" | "created_at" | "updated_at">) => {
      return createEmployee(input);
    },
    []
  );

  const edit = useCallback(
    async (id: string, input: Partial<Omit<EmployeeRecord, "id" | "created_at">>) => {
      return updateEmployee(id, input);
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    return deleteEmployee(id);
  }, []);

  return { employees, isLoading, refetch: load, add, edit, remove };
}
