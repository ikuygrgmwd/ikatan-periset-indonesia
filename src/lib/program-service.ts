// ============================================================
// Program Kerja & Monev — Persistent localStorage service
// Drop-in replacement for in-memory MOCK_PROGRAMS / MOCK_MONEV
// ============================================================

import { MOCK_PROGRAMS, MOCK_MONEV, type ProgramKerja, type MonevItem } from "./mock-data";

// ── Storage keys ────────────────────────────────────────────
const PROGRAM_KEY = "ipi_programs_v1";
const MONEV_KEY = "ipi_monev_v1";

// ── Event emitter ───────────────────────────────────────────
type Listener = () => void;
const programListeners = new Set<Listener>();
const monevListeners = new Set<Listener>();

export function subscribeProgramKerja(cb: Listener) {
  programListeners.add(cb);
  return () => programListeners.delete(cb);
}
export function subscribeMonev(cb: Listener) {
  monevListeners.add(cb);
  return () => monevListeners.delete(cb);
}
function notifyProgram() { programListeners.forEach((f) => f()); }
function notifyMonev() { monevListeners.forEach((f) => f()); }

// ── Helpers ─────────────────────────────────────────────────
function loadPrograms(): ProgramKerja[] {
  if (typeof window === "undefined") return [...MOCK_PROGRAMS];
  try {
    const raw = localStorage.getItem(PROGRAM_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) return data;
    }
    localStorage.setItem(PROGRAM_KEY, JSON.stringify(MOCK_PROGRAMS));
    return [...MOCK_PROGRAMS];
  } catch { return [...MOCK_PROGRAMS]; }
}

function savePrograms(programs: ProgramKerja[]) {
  try { localStorage.setItem(PROGRAM_KEY, JSON.stringify(programs)); } catch {}
  notifyProgram();
}

function loadMonev(): MonevItem[] {
  if (typeof window === "undefined") return [...MOCK_MONEV];
  try {
    const raw = localStorage.getItem(MONEV_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) return data;
    }
    localStorage.setItem(MONEV_KEY, JSON.stringify(MOCK_MONEV));
    return [...MOCK_MONEV];
  } catch { return [...MOCK_MONEV]; }
}

function saveMonev(items: MonevItem[]) {
  try { localStorage.setItem(MONEV_KEY, JSON.stringify(items)); } catch {}
  notifyMonev();
}

// ── Program Kerja CRUD ──────────────────────────────────────
export async function fetchPrograms(): Promise<ProgramKerja[]> {
  return loadPrograms();
}

export async function createProgram(input: Omit<ProgramKerja, "id">): Promise<ProgramKerja> {
  const programs = loadPrograms();
  const record: ProgramKerja = { ...input, id: `prog-${Date.now()}` };
  programs.push(record);
  savePrograms(programs);
  return record;
}

export async function updateProgram(id: string, input: Partial<Omit<ProgramKerja, "id">>): Promise<ProgramKerja | null> {
  const programs = loadPrograms();
  const idx = programs.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  programs[idx] = { ...programs[idx], ...input };
  savePrograms(programs);
  return programs[idx];
}

export async function deleteProgram(id: string): Promise<void> {
  const programs = loadPrograms().filter((p) => p.id !== id);
  savePrograms(programs);
}

// ── Monev CRUD ──────────────────────────────────────────────
export async function fetchMonev(): Promise<MonevItem[]> {
  return loadMonev();
}

export async function createMonev(input: Omit<MonevItem, "id">): Promise<MonevItem> {
  const items = loadMonev();
  const record: MonevItem = { ...input, id: `monev-${Date.now()}` };
  items.push(record);
  saveMonev(items);
  return record;
}

export async function updateMonev(id: string, input: Partial<Omit<MonevItem, "id">>): Promise<MonevItem | null> {
  const items = loadMonev();
  const idx = items.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...input };
  saveMonev(items);
  return items[idx];
}

export async function deleteMonev(id: string): Promise<void> {
  const items = loadMonev().filter((m) => m.id !== id);
  saveMonev(items);
}
