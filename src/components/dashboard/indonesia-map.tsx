"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapLibreMap, GeoJSONSource, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { researcherHubs } from "@/lib/research-store";
import { EMPTY_REGIONS, hubGeoJSON, INDONESIA_BOUNDS, type RegionalData } from "@/lib/map-data";

export function IndonesiaMap({ regions = EMPTY_REGIONS }: { regions?: RegionalData }) {
  const { database } = useAuth();
  const hubs = useMemo(() => researcherHubs(database), [database]);
  const points = useMemo(() => hubGeoJSON(hubs), [hubs]);
  const [active, setActive] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const selected = hubs.find(h => h.id === active);

  useEffect(() => {
    let disposed = false;
    let map: MapLibreMap | undefined;
    let observer: ResizeObserver | undefined;
    const controller = new AbortController();
    async function initialize() {
      try {
        const { Map, NavigationControl, AttributionControl, setWorkerUrl } = await import("maplibre-gl");
        const response = await fetch("https://tiles.openfreemap.org/styles/positron", { signal: controller.signal });
        if (!response.ok) throw new Error("Sumber peta belum tersedia.");
        const baseStyle: StyleSpecification = await response.json();
        for (const source of Object.values(baseStyle.sources)) {
          if (source.type === "vector") {
            source.attribution = '<a href="https://openfreemap.org/">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/">OpenMapTiles</a> · Data dari <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
          }
        }
        if (disposed || !container.current) return;
        setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
        map = new Map({
          container: container.current,
          style: {
            ...baseStyle,
            sources: {
              ...baseStyle.sources,
              researchers: { type: "geojson", data: { type: "FeatureCollection", features: [] } },
              "indonesia-regions": { type: "geojson", data: EMPTY_REGIONS },
            },
            layers: [
              // Location names are presented in Indonesian in the accessible list.
              ...baseStyle.layers.filter(layer => layer.type !== "symbol"),
              { id: "regional-values", type: "fill", source: "indonesia-regions", paint: { "fill-color": ["interpolate", ["linear"], ["get", "value"], 0, "#dbeafe", 100, "#1d4ed8"], "fill-opacity": 0.45 } },
              { id: "regional-borders", type: "line", source: "indonesia-regions", paint: { "line-color": "#60a5fa", "line-width": 1 } },
              { id: "researcher-halos", type: "circle", source: "researchers", paint: { "circle-radius": 15, "circle-color": "#3b82f6", "circle-opacity": 0.16 } },
              { id: "researcher-points", type: "circle", source: "researchers", paint: { "circle-radius": ["interpolate", ["linear"], ["get", "count"], 0, 4, 5, 9], "circle-color": ["case", [">", ["get", "count"], 0], "#2563eb", "#94a3b8"], "circle-stroke-color": "#ffffff", "circle-stroke-width": 2 } },
            ],
          },
          bounds: INDONESIA_BOUNDS,
          fitBoundsOptions: { padding: 24 },
          minZoom: 1, maxZoom: 15,
          renderWorldCopies: false,
          attributionControl: false,
          locale: {
            "Map.Title": "Peta persebaran periset Indonesia",
            "NavigationControl.ZoomIn": "Perbesar peta",
            "NavigationControl.ZoomOut": "Perkecil peta",
            "NavigationControl.ResetBearing": "Arahkan ke utara",
            "AttributionControl.ToggleAttribution": "Tampilkan sumber peta",
          },
        });
        mapRef.current = map;
        map.addControl(new NavigationControl({ showCompass: false }), "top-right");
        map.addControl(new AttributionControl({ compact: true }), "bottom-right");
        map.scrollZoom.disable();
        map.on("load", () => { if (!disposed) setReady(true); });
        map.on("error", () => { if (!disposed) setError("Sebagian peta gagal dimuat. Periksa koneksi internet atau muat ulang halaman."); });
        map.on("click", "researcher-halos", event => {
          const id = event.features?.[0]?.properties?.id;
          if (typeof id === "string") setActive(id);
        });
        map.on("mouseenter", "researcher-halos", () => { if (map) map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", "researcher-halos", () => { if (map) map.getCanvas().style.cursor = ""; });
        observer = new ResizeObserver(() => {
          map?.resize();
          map?.fitBounds(INDONESIA_BOUNDS, { padding: 24, duration: 0 });
        });
        observer.observe(container.current);
      } catch {
        if (!disposed) setError("Peta tidak dapat ditampilkan. Periksa koneksi internet dan dukungan WebGL peramban Anda. Daftar lokasi tetap tersedia di bawah.");
      }
    }
    void initialize();
    return () => { disposed = true; controller.abort(); observer?.disconnect(); map?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const source = mapRef.current?.getSource("researchers") as GeoJSONSource | undefined;
    void source?.setData(points).catch(() => setError("Data lokasi belum dapat dimuat."));
  }, [points, ready]);
  useEffect(() => {
    if (!ready) return;
    const source = mapRef.current?.getSource("indonesia-regions") as GeoJSONSource | undefined;
    void source?.setData(regions).catch(() => setError("Data wilayah belum dapat dimuat."));
  }, [regions, ready]);

  return <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="map-heading">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
      <div><h2 id="map-heading" className="font-bold text-slate-900">Jejaring Periset Nusantara</h2><p className="mt-1 text-sm text-slate-500">Jelajahi peta atau pilih lokasi untuk melihat persebaran periset.</p></div>
      <button onClick={() => { mapRef.current?.fitBounds(INDONESIA_BOUNDS, { padding: 24, duration: 0 }); setActive(null); }} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"><RotateCcw size={14} />Lihat Indonesia</button>
    </div>
    <div className="flex min-h-20 items-center gap-3 bg-slate-50 px-5 py-3" aria-live="polite"><MapPin className="shrink-0 text-blue-600" size={20} /><div><p className="text-sm font-semibold text-slate-800">{selected ? `${selected.name}, ${selected.region}` : "Satu jejaring, seluruh Indonesia"}</p><p className="mt-1 text-xs text-slate-500">{selected ? `${selected.count} periset terdaftar` : `${hubs.reduce((sum, h) => sum + h.count, 0)} periset di ${hubs.filter(h => h.count > 0).length} lokasi jejaring`}</p></div></div>
    <div className="relative">
      <div ref={container} className="h-[320px] w-full bg-blue-50 sm:h-[400px]" aria-label="Peta interaktif Indonesia" />
      {!ready && !error && <p role="status" className="pointer-events-none absolute left-4 top-4 rounded-lg bg-white px-3 py-2 text-sm text-slate-600 shadow">Memuat peta...</p>}
    </div>
    {error && <p role="alert" className="bg-amber-50 px-5 py-3 text-xs text-amber-800">{error}</p>}
    <div className="flex flex-wrap gap-2 border-t border-slate-100 p-4">{hubs.map(hub => <button key={hub.id} onClick={() => { setActive(hub.id); mapRef.current?.easeTo({ center: [hub.lon, hub.lat], zoom: 5, duration: 0 }); }} aria-pressed={active === hub.id} className={`rounded-lg border px-3 py-2 text-xs ${active === hub.id ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{hub.name} <strong>{hub.count}</strong></button>)}</div>
  </section>;
}
