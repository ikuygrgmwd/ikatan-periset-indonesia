"use client";

import React, { useState } from "react";
import {
  Globe,
  Atom,
  Dna,
  Radio,
  Sparkles,
  Zap,
  Building,
  Microscope,
  CheckCircle2,
  Share2,
} from "lucide-react";

export function HeroGlobe() {
  const [activePartner, setActivePartner] = useState<string | null>(null);

  const partners = [
    { id: "tokyo", name: "Tokyo", inst: "RIKEN & JAXA", x: 260, y: 110, country: "Jepang" },
    { id: "geneva", name: "Geneva", inst: "CERN Particle Lab", x: 70, y: 130, country: "Swiss" },
    { id: "boston", name: "Boston", inst: "Broad Institute / MIT", x: 80, y: 220, country: "USA" },
    { id: "singapore", name: "Singapore", inst: "A*STAR Science Hub", x: 175, y: 200, country: "Singapura" },
    { id: "canberra", name: "Canberra", inst: "CSIRO Australia", x: 250, y: 280, country: "Australia" },
  ];

  // Indonesia coordinates on our SVG center
  const idCenter = { x: 180, y: 220 };

  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center select-none py-6 lg:py-0">
      {/* Ambient background glow behind globe */}
      <div className="absolute w-72 h-72 sm:w-88 sm:h-88 bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-indigo-600/30 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "6s" }} />

      {/* Main 3D Sphere & Orbit Ring Container */}
      <div className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] flex items-center justify-center">
        {/* Orbital Ring 1 (Tilted 65 deg, spinning counter-clockwise) */}
        <div
          className="absolute inset-0 rounded-full border border-blue-400/20 border-dashed animate-spin pointer-events-none"
          style={{
            animationDuration: "25s",
            transform: "rotateX(68deg) rotateY(15deg)",
          }}
        >
          {/* Orbital satellite satellite 1 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-blue-500/30 backdrop-blur-md border border-blue-300 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Atom className="w-3.5 h-3.5 text-cyan-200" />
          </div>
        </div>

        {/* Orbital Ring 2 (Tilted -60 deg, spinning clockwise) */}
        <div
          className="absolute inset-4 rounded-full border border-cyan-400/25 animate-spin pointer-events-none"
          style={{
            animationDuration: "35s",
            animationDirection: "reverse",
            transform: "rotateX(-55deg) rotateY(25deg)",
          }}
        >
          {/* Satellite 2 */}
          <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-indigo-500/30 backdrop-blur-md border border-indigo-300 flex items-center justify-center shadow-lg shadow-indigo-500/50">
            <Dna className="w-3 h-3 text-indigo-200" />
          </div>
        </div>

        {/* Orbital Ring 3 (Outer subtle halo) */}
        <div
          className="absolute -inset-4 rounded-full border border-blue-500/10 pointer-events-none animate-pulse"
          style={{ animationDuration: "4s" }}
        />

        {/* Core Wireframe Hologram Globe SVG */}
        <svg
          viewBox="0 0 360 360"
          className="w-full h-full relative z-10 drop-shadow-[0_0_35px_rgba(59,130,246,0.35)]"
        >
          <defs>
            {/* Globe radial gradient */}
            <radialGradient id="globeGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0f172a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
            </radialGradient>

            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>

            <filter id="glowBadge" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Globe Base Sphere */}
          <circle cx="180" cy="180" r="130" fill="url(#globeGrad)" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Latitude / Parallels */}
          <ellipse cx="180" cy="180" rx="130" ry="35" fill="none" stroke="#60a5fa" strokeWidth="0.75" strokeDasharray="3 4" strokeOpacity="0.4" />
          <ellipse cx="180" cy="140" rx="122" ry="28" fill="none" stroke="#60a5fa" strokeWidth="0.6" strokeDasharray="2 4" strokeOpacity="0.3" />
          <ellipse cx="180" cy="220" rx="122" ry="28" fill="none" stroke="#60a5fa" strokeWidth="0.6" strokeDasharray="2 4" strokeOpacity="0.3" />
          <ellipse cx="180" cy="100" rx="98" ry="20" fill="none" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="2 4" strokeOpacity="0.25" />
          <ellipse cx="180" cy="260" rx="98" ry="20" fill="none" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="2 4" strokeOpacity="0.25" />

          {/* Longitude / Meridians */}
          <ellipse cx="180" cy="180" rx="35" ry="130" fill="none" stroke="#60a5fa" strokeWidth="0.75" strokeDasharray="3 4" strokeOpacity="0.4" />
          <ellipse cx="180" cy="180" rx="80" ry="130" fill="none" stroke="#60a5fa" strokeWidth="0.6" strokeDasharray="2 4" strokeOpacity="0.3" />
          <line x1="180" y1="50" x2="180" y2="310" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 4" />
          <line x1="50" y1="180" x2="310" y2="180" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />

          {/* Stylized Continents on Sphere */}
          {/* Asia / SE Asia & Indonesia Silhouette */}
          <g fill="#2563eb" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="0.75">
            {/* Mainland Asia */}
            <path d="M 120 120 Q 150 90, 200 100 Q 230 110, 240 135 Q 220 155, 190 150 Q 140 160, 120 120 Z" />
            {/* Indonesian Archipelago Focus */}
            <ellipse cx="170" cy="215" rx="20" ry="6" fill="#38bdf8" fillOpacity="0.6" />
            <ellipse cx="195" cy="222" rx="14" ry="4" fill="#38bdf8" fillOpacity="0.6" />
            <ellipse cx="180" cy="228" rx="25" ry="5" fill="#60a5fa" fillOpacity="0.7" />
          </g>

          {/* Connection Arcs (Bezier curves from Indonesia to Partner nodes) */}
          {partners.map((partner) => {
            const isHighlight = activePartner === partner.id;
            return (
              <g key={partner.id}>
                {/* Arc path */}
                <path
                  d={`M ${idCenter.x} ${idCenter.y} Q ${(idCenter.x + partner.x) / 2} ${
                    Math.min(idCenter.y, partner.y) - 40
                  }, ${partner.x} ${partner.y}`}
                  fill="none"
                  stroke={isHighlight ? "#38bdf8" : "#60a5fa"}
                  strokeWidth={isHighlight ? 2.5 : 1.25}
                  strokeOpacity={isHighlight ? 0.95 : 0.5}
                  strokeDasharray={isHighlight ? "none" : "3 3"}
                  className="transition-all duration-300"
                />

                {/* Partner Node Pin */}
                <g
                  className="cursor-pointer group"
                  onMouseEnter={() => setActivePartner(partner.id)}
                  onMouseLeave={() => setActivePartner(null)}
                >
                  <circle
                    cx={partner.x}
                    cy={partner.y}
                    r={isHighlight ? 7 : 4.5}
                    fill={isHighlight ? "#38bdf8" : "#0284c7"}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    filter="url(#glowBadge)"
                    className="transition-all duration-200"
                  />
                  <text
                    x={partner.x}
                    y={partner.y - 9}
                    textAnchor="middle"
                    className="text-[9px] font-bold fill-slate-300 pointer-events-none select-none transition-all group-hover:fill-cyan-300"
                  >
                    {partner.name}
                  </text>
                </g>
              </g>
            );
          })}

          {/* INDONESIA CENTER HUB (Glowing Pulse Beacon) */}
          <g>
            {/* Outer radar wave */}
            <circle
              cx={idCenter.x}
              cy={idCenter.y}
              r="22"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              className="animate-ping opacity-60"
              style={{ transformOrigin: `${idCenter.x}px ${idCenter.y}px`, animationDuration: "2s" }}
            />
            {/* Middle halo */}
            <circle cx={idCenter.x} cy={idCenter.y} r="10" fill="#0284c7" fillOpacity="0.4" />
            {/* Center Core dot */}
            <circle cx={idCenter.x} cy={idCenter.y} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" filter="url(#glowBadge)" />
            {/* Pin text */}
            <text
              x={idCenter.x}
              y={idCenter.y + 18}
              textAnchor="middle"
              className="text-[10px] font-extrabold fill-cyan-300 drop-shadow"
            >
              🇮🇩 IPI INDONESIA
            </text>
          </g>
        </svg>

        {/* FLOATING STATUS CARDS AROUND GLOBE (Glassmorphism) */}

        {/* Card 1: Top-Right (Provinsi Terhubung) */}
        <div className="absolute -top-3 -right-2 sm:-right-6 bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-2.5 sm:p-3 shadow-xl shadow-slate-950/60 flex items-center gap-2.5 z-20 hover:scale-105 transition-transform duration-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-md">
            <Radio className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[11px] font-bold text-white leading-none">34 Provinsi</p>
            </div>
            <p className="text-[9px] text-cyan-200/80 mt-0.5">Jaringan Riset Realtime</p>
          </div>
        </div>

        {/* Card 2: Bottom-Left (Fasilitas Lab Riset) */}
        <div className="absolute -bottom-2 -left-2 sm:-left-6 bg-slate-900/85 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-2.5 sm:p-3 shadow-xl shadow-slate-950/60 flex items-center gap-2.5 z-20 hover:scale-105 transition-transform duration-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
            <Microscope className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white leading-none">120+ Lab Riset</p>
            <p className="text-[9px] text-indigo-200/80 mt-0.5">Terakreditasi KAN & BRIN</p>
          </div>
        </div>

        {/* Card 3: Bottom-Right (Global Research Network) */}
        <div className="absolute bottom-6 -right-3 sm:-right-4 bg-slate-900/85 backdrop-blur-md border border-blue-500/30 rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-slate-950/60 hidden sm:flex items-center gap-2 z-20">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-white">Global Partner</p>
            <p className="text-[8px] text-slate-300">ASEAN, CERN & RIKEN</p>
          </div>
        </div>
      </div>

      {/* Active Partner Info Tooltip when hovered */}
      {activePartner && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-blue-950/95 backdrop-blur-md border border-cyan-400/50 rounded-xl px-4 py-2 text-center text-xs shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap">
          <span className="text-cyan-300 font-bold">
            {partners.find((p) => p.id === activePartner)?.inst}
          </span>{" "}
          <span className="text-slate-300">
            ({partners.find((p) => p.id === activePartner)?.country})
          </span>
        </div>
      )}
    </div>
  );
}
