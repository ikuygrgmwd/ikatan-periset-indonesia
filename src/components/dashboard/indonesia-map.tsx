"use client";

import React, { useState } from "react";
import { RESEARCH_HUBS, type ResearchHub } from "@/lib/mock-data";
import {
  MapPin,
  Users,
  Compass,
  Building2,
  Sparkles,
  Info,
  CheckCircle2,
  X,
  Layers,
} from "lucide-react";

interface IndonesiaMapProps {
  selectedHubId?: string | null;
  onSelectHub?: (hub: ResearchHub | null) => void;
}

export function IndonesiaMap({ selectedHubId, onSelectHub }: IndonesiaMapProps) {
  const [hoveredHub, setHoveredHub] = useState<ResearchHub | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>("all");
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const regions = [
    { id: "all", label: "Semua Wilayah" },
    { id: "Jawa-Banten", label: "Jawa & Banten" },
    { id: "Sumatera", label: "Sumatera" },
    { id: "Kalimantan", label: "Kalimantan" },
    { id: "Sulawesi", label: "Sulawesi" },
    { id: "Bali-Nusra", label: "Bali & Nusra" },
    { id: "Maluku-Papua", label: "Maluku & Papua" },
  ];

  const filteredHubs =
    activeRegion === "all"
      ? RESEARCH_HUBS
      : RESEARCH_HUBS.filter((h) => h.region === activeRegion);

  const totalResearchers = RESEARCH_HUBS.reduce((acc, h) => acc + h.perisetCount, 0);

  const activeHub = hoveredHub || (selectedHubId ? RESEARCH_HUBS.find((h) => h.id === selectedHubId) : null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 md:p-6 mb-8 relative">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: "12s" }} />
              Distribusi Riset Nasional
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">• Klik marker untuk memfilter periset</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Peta Sebaran Hub Periset Indonesia
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Pusat riset terintegrasi Badan Riset dan Inovasi Nasional (BRIN) & Ikatan Periset Indonesia
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-800/80 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-slate-700/60 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Hub</span>
            <span className="font-extrabold text-white text-sm">{RESEARCH_HUBS.length} Kawasan</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Periset</span>
            <span className="font-extrabold text-blue-400 text-sm">{totalResearchers} Orang</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hidden sm:block">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Cakupan</span>
            <span className="font-extrabold text-emerald-400 text-sm">34 Provinsi</span>
          </div>
        </div>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-3 scrollbar-none relative z-10">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <Layers className="w-3.5 h-3.5" /> Wilayah:
        </span>
        {regions.map((reg) => (
          <button
            key={reg.id}
            onClick={() => setActiveRegion(reg.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 active:scale-95 ${
              activeRegion === reg.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50"
            }`}
          >
            {reg.label}
          </button>
        ))}

        {selectedHubId && (
          <button
            onClick={() => onSelectHub && onSelectHub(null)}
            className="ml-auto px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center gap-1 shrink-0"
          >
            <X className="w-3.5 h-3.5" /> Reset Filter Hub
          </button>
        )}
      </div>

      {/* Map SVG Container */}
      <div className="relative w-full aspect-[2.35/1] min-h-[300px] max-h-[500px] bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-2">
        {/* Subtle Map Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <svg
          viewBox="0 0 1000 420"
          className="w-full h-full select-none"
          onMouseMove={handleMouseMove}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="islandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="islandHover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="hubPulse" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Coordinate Guides */}
          <g className="text-[10px] fill-slate-700 select-none">
            <line x1="40" y1="210" x2="960" y2="210" stroke="#334155" strokeDasharray="3 4" strokeWidth="0.75" />
            <text x="50" y="205">0° Khatulistiwa (Equator)</text>
            <text x="120" y="405">95° E</text>
            <text x="350" y="405">110° E</text>
            <text x="650" y="405">125° E</text>
            <text x="910" y="405">140° E</text>
          </g>

          {/* ============================================================
              ISLAND PATHS (Indonesian Archipelago)
              ============================================================ */}
          <g id="indonesia-archipelago" stroke="#334155" strokeWidth="1.2" className="transition-colors duration-300">
            {/* SUMATRA */}
            <path
              d="M 68 85 C 80 75, 110 92, 130 115 C 160 148, 185 185, 215 230 C 235 260, 260 290, 275 315 C 265 325, 245 320, 230 305 C 190 260, 160 210, 120 160 C 95 130, 60 95, 68 85 Z"
              fill="url(#islandGradient)"
              className="hover:fill-[#1e3a8a]/40 transition-colors duration-200 cursor-pointer"
            >
              <title>Pulau Sumatera</title>
            </path>
            {/* Bangka & Belitung */}
            <ellipse cx="258" cy="275" rx="14" ry="18" fill="url(#islandGradient)" />
            <ellipse cx="282" cy="285" rx="10" ry="10" fill="url(#islandGradient)" />
            {/* Nias & Mentawai */}
            <ellipse cx="100" cy="190" rx="6" ry="14" fill="#1e293b" />
            <ellipse cx="135" cy="245" rx="6" ry="18" fill="#1e293b" />

            {/* JAVA */}
            <path
              d="M 285 348 C 320 344, 380 348, 430 354 C 470 359, 495 362, 510 370 C 500 376, 450 378, 400 374 C 350 370, 310 368, 285 360 C 280 354, 282 350, 285 348 Z"
              fill="url(#islandGradient)"
              className="hover:fill-[#1e3a8a]/40 transition-colors duration-200 cursor-pointer"
            >
              <title>Pulau Jawa</title>
            </path>
            {/* Madura */}
            <path d="M 465 352 C 485 349, 498 351, 502 355 C 495 359, 475 358, 465 352 Z" fill="url(#islandGradient)" />

            {/* BALI & NUSA TENGGARA */}
            {/* Bali */}
            <path d="M 518 375 C 528 372, 534 374, 533 381 C 525 383, 519 380, 518 375 Z" fill="url(#islandGradient)" />
            {/* Lombok */}
            <ellipse cx="545" cy="378" rx="8" ry="7" fill="url(#islandGradient)" />
            {/* Sumbawa */}
            <path d="M 558 376 C 580 372, 595 376, 592 384 C 575 385, 560 382, 558 376 Z" fill="url(#islandGradient)" />
            {/* Flores */}
            <path d="M 610 375 C 640 370, 660 373, 658 381 C 635 383, 615 382, 610 375 Z" fill="url(#islandGradient)" />
            {/* Sumba */}
            <path d="M 595 395 C 615 391, 622 396, 618 403 C 602 405, 593 400, 595 395 Z" fill="url(#islandGradient)" />
            {/* Timor (Indonesian part) */}
            <path d="M 670 380 C 690 372, 705 378, 698 390 C 680 395, 668 390, 670 380 Z" fill="url(#islandGradient)" />

            {/* KALIMANTAN (Borneo - South/East/West/Central) */}
            <path
              d="M 335 220 C 350 170, 390 172, 440 165 C 475 160, 495 185, 500 215 C 505 245, 495 270, 480 290 C 455 310, 410 312, 375 295 C 345 280, 325 250, 335 220 Z"
              fill="url(#islandGradient)"
              className="hover:fill-[#1e3a8a]/40 transition-colors duration-200 cursor-pointer"
            >
              <title>Pulau Kalimantan</title>
            </path>

            {/* SULAWESI (Distinctive 4 arms) */}
            <path
              d="M 580 155 C 600 150, 630 152, 642 165 C 630 175, 605 180, 590 195 C 585 205, 595 215, 625 225 C 635 235, 620 242, 600 236 C 585 232, 578 245, 582 265 C 588 285, 575 300, 560 300 C 555 285, 565 260, 565 240 C 555 215, 560 185, 580 155 Z"
              fill="url(#islandGradient)"
              className="hover:fill-[#1e3a8a]/40 transition-colors duration-200 cursor-pointer"
            >
              <title>Pulau Sulawesi</title>
            </path>

            {/* MALUKU */}
            {/* Halmahera */}
            <path d="M 720 150 C 735 145, 742 155, 736 170 C 730 185, 745 195, 738 205 C 728 190, 725 170, 720 150 Z" fill="url(#islandGradient)" />
            {/* Buru */}
            <ellipse cx="710" cy="250" rx="16" ry="12" fill="url(#islandGradient)" />
            {/* Seram */}
            <path d="M 740 240 C 770 235, 785 242, 780 252 C 755 255, 740 248, 740 240 Z" fill="url(#islandGradient)" />
            {/* Ambon */}
            <ellipse cx="746" cy="262" rx="7" ry="5" fill="url(#islandGradient)" />

            {/* PAPUA */}
            <path
              d="M 805 210 C 825 195, 845 205, 855 220 C 875 222, 915 225, 960 220 L 960 310 C 930 312, 905 295, 885 275 C 865 265, 845 260, 835 245 C 815 240, 800 225, 805 210 Z"
              fill="url(#islandGradient)"
              className="hover:fill-[#1e3a8a]/40 transition-colors duration-200 cursor-pointer"
            >
              <title>Pulau Papua</title>
            </path>
            {/* Biak & Yapen */}
            <ellipse cx="855" cy="195" rx="10" ry="5" fill="url(#islandGradient)" />
            <ellipse cx="862" cy="206" rx="14" ry="4" fill="url(#islandGradient)" />
          </g>

          {/* ============================================================
              RESEARCH HUB NODES (Interactive Pins & Pulses)
              ============================================================ */}
          <g id="research-hubs">
            {filteredHubs.map((hub) => {
              const isSelected = selectedHubId === hub.id;
              const isHovered = hoveredHub?.id === hub.id;

              return (
                <g
                  key={hub.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => onSelectHub && onSelectHub(isSelected ? null : hub)}
                  onMouseEnter={() => setHoveredHub(hub)}
                  onMouseLeave={() => setHoveredHub(null)}
                >
                  {/* Outer Radar Ripple Animation */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isSelected || isHovered ? 18 : 10}
                    fill="none"
                    stroke={isSelected ? "#60a5fa" : "#38bdf8"}
                    strokeWidth={isSelected ? 2 : 1}
                    className="animate-ping opacity-75"
                    style={{
                      transformOrigin: `${hub.x}px ${hub.y}px`,
                      animationDuration: isSelected ? "1.5s" : "2.5s",
                    }}
                  />

                  {/* Glow circle background */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isSelected || isHovered ? 12 : 7}
                    fill={isSelected ? "#2563eb" : "#0284c7"}
                    fillOpacity={0.4}
                  />

                  {/* Core Pin Point */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isSelected || isHovered ? 6 : 4}
                    fill={isSelected ? "#60a5fa" : "#38bdf8"}
                    stroke="#ffffff"
                    strokeWidth={isSelected || isHovered ? 2 : 1.5}
                    filter="url(#glow)"
                  />

                  {/* Pin label (compact) */}
                  <text
                    x={hub.x}
                    y={hub.y - (isSelected || isHovered ? 14 : 9)}
                    textAnchor="middle"
                    className={`text-[9px] font-bold select-none pointer-events-none transition-all ${
                      isSelected
                        ? "fill-blue-400 font-extrabold text-[11px]"
                        : isHovered
                        ? "fill-white text-[10px]"
                        : "fill-slate-300 text-[8px]"
                    }`}
                  >
                    {hub.shortName}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Tooltip following active hub / hover */}
        {activeHub && (
          <div
            className="absolute z-30 pointer-events-none transition-all duration-150 ease-out"
            style={{
              left: `${Math.min(Math.max(mousePos.x, 150), 750)}px`,
              top: `${Math.max(mousePos.y - 120, 20)}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-md text-white border border-blue-500/40 rounded-xl p-3.5 shadow-2xl shadow-blue-950/80 min-w-[260px] max-w-[320px] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="font-bold text-sm text-blue-200">{activeHub.name}</span>
                </div>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {activeHub.region}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3.5 h-3.5 text-blue-400" /> Periset Aktif:
                  </span>
                  <span className="font-bold text-white text-sm bg-blue-600/30 px-2 py-0.5 rounded-md border border-blue-500/30">
                    {activeHub.perisetCount} Periset
                  </span>
                </div>

                <div className="flex items-start gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    {activeHub.city}, {activeHub.province}
                  </span>
                </div>

                <div className="pt-1.5 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-400 font-medium">Fokus Riset:</p>
                  <p className="text-xs text-blue-100 font-semibold leading-snug mt-0.5">
                    {activeHub.fokusRiset}
                  </p>
                </div>

                {activeHub.facilities && activeHub.facilities.length > 0 && (
                  <div className="pt-1">
                    <p className="text-[10px] text-slate-400">Fasilitas Utama:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activeHub.facilities.slice(0, 2).map((fac, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700/60"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>💡 Klik marker untuk memfilter tabel</span>
                {selectedHubId === activeHub.id && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Filter Aktif
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Hub Cards preview slider (clickable) */}
      <div className="mt-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            Daftar Hub Periset ({filteredHubs.length} Wilayah Terdaftar)
          </span>
          <span className="text-[11px] text-slate-400">Klik hub untuk menyeleksi</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {filteredHubs.map((hub) => {
            const isSelected = selectedHubId === hub.id;
            return (
              <button
                key={hub.id}
                onClick={() => onSelectHub && onSelectHub(isSelected ? null : hub)}
                onMouseEnter={() => setHoveredHub(hub)}
                onMouseLeave={() => setHoveredHub(null)}
                className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-900/30"
                    : "bg-slate-800/50 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs truncate group-hover:text-blue-300 transition-colors">
                    {hub.shortName}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {hub.perisetCount}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{hub.city}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
