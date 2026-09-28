"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { researcherHubs } from "@/lib/research-store";
import {
  INDONESIA_ISLANDS,
  mapPoint,
  polygonPath,
} from "@/lib/indonesia-geometry";
import { MapPin } from "lucide-react";
export function IndonesiaMap() {
  const { database } = useAuth();
  const [active, setActive] = useState<string | null>(null);
  const hubs = researcherHubs(database);
  const selected = hubs.find((h) => h.id === active);
  const total = hubs.reduce((sum, hub) => sum + hub.count, 0);
  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      aria-labelledby="map-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b p-5">
        <div>
          <h2 id="map-heading" className="font-bold text-slate-900">
            Jejaring Periset Nusantara
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Arahkan kursor, fokuskan, atau sentuh titik untuk melihat lokasi.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
          {total} periset · {hubs.filter((h) => h.count > 0).length} hub
        </span>
      </div>
      <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 p-3 sm:p-5">
        <div
          className="mb-1 flex min-h-12 items-center gap-3 text-sm"
          aria-live="polite"
        >
          <MapPin className="h-5 w-5 text-blue-600" />
          <div>
            {selected ? (
              <>
                <p className="font-bold text-slate-900">
                  {selected.name}, {selected.region}
                </p>
                <p className="text-slate-600">
                  {selected.count} periset terdaftar
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-800">
                  Satu jejaring, seluruh Indonesia
                </p>
                <p className="text-slate-500">
                  Jumlah mengikuti akun ber-role Periset.
                </p>
              </>
            )}
          </div>
        </div>
        <svg
          viewBox="0 0 1000 410"
          className="w-full"
          role="group"
          aria-label="Peta interaktif persebaran periset Indonesia"
        >
          <defs>
            <pattern
              id="map-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 0H0V40"
                fill="none"
                stroke="#dbeafe"
                strokeWidth="0.7"
              />
            </pattern>
          </defs>
          <rect width="1000" height="410" fill="url(#map-grid)" rx="12" />
          <g
            fill="#c4d7e9"
            stroke="#92adc7"
            strokeWidth="1.2"
            strokeLinejoin="round"
          >
            {INDONESIA_ISLANDS.map((island) => (
              <path key={island.name} d={polygonPath(island.coordinates)}>
                <title>{island.name}</title>
              </path>
            ))}
          </g>
          <g fill="#64748b" fontSize="13" letterSpacing="2" aria-hidden="true">
            <text x="90" y="210">
              SUMATRA
            </text>
            <text x="290" y="360">
              JAWA
            </text>
            <text x="340" y="115">
              KALIMANTAN
            </text>
            <text x="565" y="235">
              SULAWESI
            </text>
            <text x="690" y="290">
              MALUKU
            </text>
            <text x="865" y="295">
              PAPUA
            </text>
          </g>
          {hubs.map((hub) => {
            const [x, y] = mapPoint(hub.lon, hub.lat);
            return (
              <g
                key={hub.id}
                role="button"
                tabIndex={0}
                aria-label={`${hub.name}, ${hub.region}: ${hub.count} periset`}
                className="group cursor-pointer outline-none"
                onMouseEnter={() => setActive(hub.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(hub.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(hub.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(hub.id);
                  }
                  if (e.key === "Escape") setActive(null);
                }}
              >
                <title>
                  {hub.name}: {hub.count} periset
                </title>
                <circle
                  cx={x}
                  cy={y}
                  r="13"
                  fill={hub.id === active ? "#38bdf8" : "#3b82f6"}
                  fillOpacity="0.18"
                  className="group-focus:stroke-blue-800 group-focus:stroke-2"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={hub.count > 1 ? 6 : 4.5}
                  fill={hub.count ? "#2563eb" : "#94a3b8"}
                  stroke="white"
                  strokeWidth="2"
                />
              </g>
            );
          })}
          {selected &&
            (() => {
              const [x, y] = mapPoint(selected.lon, selected.lat);
              const tx = Math.min(800, Math.max(5, x - 80));
              return (
                <g role="tooltip" pointerEvents="none">
                  <rect
                    x={tx}
                    y={y - 62}
                    width="185"
                    height="44"
                    rx="8"
                    fill="#0f172a"
                  />
                  <text
                    x={tx + 12}
                    y={y - 44}
                    fill="white"
                    fontSize="13"
                    fontWeight="600"
                  >
                    {selected.name}
                  </text>
                  <text x={tx + 12} y={y - 28} fill="#bae6fd" fontSize="12">
                    {selected.count} periset terdaftar
                  </text>
                </g>
              );
            })()}
        </svg>
        <p className="mt-2 text-xs text-slate-500">
          Peta ilustratif · Titik menunjukkan lokasi hub riset.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 border-t p-4">
        {hubs.map((hub) => (
          <button
            key={hub.id}
            onClick={() => setActive(active === hub.id ? null : hub.id)}
            onFocus={() => setActive(hub.id)}
            aria-pressed={active === hub.id}
            className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${active === hub.id ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            {hub.name} <strong>{hub.count}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
