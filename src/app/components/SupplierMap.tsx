import { useQuery } from "convex/react";
import L from "leaflet";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Navigation,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";

// ─── Region config with real lat/lng ───
interface RegionDef {
  color: string;
  id: string;
  label: string;
  lat: number;
  lng: number;
  name: string;
}

const regionDefs: RegionDef[] = [
  {
    id: "צפון",
    name: "צפון",
    label: "גליל וחיפה",
    lat: 32.82,
    lng: 35.18,
    color: "#22c55e",
  },
  {
    id: "מרכז",
    name: "מרכז",
    label: "תל אביב והשרון",
    lat: 32.07,
    lng: 34.78,
    color: "#ff8c00",
  },
  {
    id: "ירושלים",
    name: "ירושלים",
    label: "ירושלים והסביבה",
    lat: 31.77,
    lng: 35.21,
    color: "#8b5cf6",
  },
  {
    id: "דרום",
    name: "דרום",
    label: "נגב ואילת",
    lat: 30.65,
    lng: 34.78,
    color: "#ef4444",
  },
];

const ISRAEL_CENTER: L.LatLngExpression = [31.5, 34.85];
const ISRAEL_ZOOM = 8;

function pinHtml(color: string, count: number, isActive: boolean) {
  const size = isActive ? 48 : 40;
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${isActive ? color : "#fff"};border:3px solid ${color};display:flex;align-items:center;justify-content:center;box-shadow:${isActive ? `0 0 0 6px ${color}20, 0 4px 16px ${color}40` : "0 2px 8px rgba(0,0,0,0.18)"};transition:all .2s;cursor:pointer;"><span style="font-size:15px;font-weight:800;color:${isActive ? "#fff" : color};font-family:Assistant,sans-serif;">${count}</span></div>`;
}

function popupHtml(region: RegionDef, list: any[]) {
  const rows = list
    .map(
      (s) =>
        `<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;" data-supplier-id="${s._id}" onmouseover="this.style.background='#f8f7f5'" onmouseout="this.style.background='transparent'"><span style="font-size:14px;">${s.icon}</span><span style="font-size:12px;color:#181510;font-weight:600;">${s.name}</span></div>`
    )
    .join("");
  return `<div dir="rtl" style="font-family:Assistant,sans-serif;min-width:200px;"><div style="padding:10px 14px;background:${region.color}08;border-bottom:1px solid ${region.color}15;"><div style="font-size:13px;color:#181510;font-weight:700;">${region.label}</div><div style="font-size:11px;color:#8d785e;">${list.length} ספקים</div></div><div style="padding:6px 8px;max-height:180px;overflow-y:auto;">${rows}</div></div>`;
}

// ━━━━━━━━━━━━━━━━━ MAIN COMPONENT ━━━━━━━━━━━━━━━━━
export function SupplierMap() {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const suppliersData = useQuery(api.suppliers.list);
  const suppliers: any[] = suppliersData ?? [];

  const suppliersByRegion = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const s of suppliers) {
      if (!map[s.region]) {
        map[s.region] = [];
      }
      map[s.region].push(s);
    }
    return map;
  }, [suppliers]);

  // Build map when suppliers load
  useEffect(() => {
    if (!mapElRef.current || suppliers.length === 0) {
      return;
    }
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markersRef.current = {};
    }

    const map = L.map(mapElRef.current, {
      center: ISRAEL_CENTER,
      zoom: ISRAEL_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    regionDefs.forEach((region) => {
      const list = suppliersByRegion[region.id] || [];
      if (list.length === 0) {
        return;
      }
      const icon = L.divIcon({
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -24],
        html: pinHtml(region.color, list.length, false),
      });
      const marker = L.marker([region.lat, region.lng], { icon }).addTo(map);
      marker.bindPopup(popupHtml(region, list), {
        className: "supplier-map-popup",
        maxWidth: 320,
        minWidth: 220,
      });
      marker.on("popupopen", () => {
        const popupEl = marker.getPopup()?.getElement();
        if (popupEl) {
          popupEl.querySelectorAll("[data-supplier-id]").forEach((el) => {
            (el as HTMLElement).onclick = () => {
              const id = (el as HTMLElement).getAttribute("data-supplier-id");
              if (id) {
                navigate(`/suppliers/${id}`);
              }
            };
          });
        }
      });
      markersRef.current[region.id] = marker;
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, [suppliers, suppliersByRegion, navigate]);

  // Fly to active region
  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    regionDefs.forEach((region) => {
      const marker = markersRef.current[region.id];
      if (!marker) {
        return;
      }
      const list = suppliersByRegion[region.id] || [];
      const isActive = activeRegion === region.id;
      marker.setIcon(
        L.divIcon({
          className: "",
          iconSize: [isActive ? 48 : 40, isActive ? 48 : 40],
          iconAnchor: [isActive ? 24 : 20, isActive ? 24 : 20],
          popupAnchor: [0, isActive ? -28 : -24],
          html: pinHtml(region.color, list.length, isActive),
        })
      );
    });
    if (activeRegion) {
      const r = regionDefs.find((r) => r.id === activeRegion);
      if (r) {
        map.flyTo([r.lat, r.lng], 10, { duration: 0.8 });
      }
    } else {
      map.flyTo(ISRAEL_CENTER, ISRAEL_ZOOM, { duration: 0.6 });
    }
  }, [activeRegion, suppliersByRegion]);

  const resetView = useCallback(() => setActiveRegion(null), []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <style>{`
        @keyframes leafpin { 75%, 100% { transform: scale(1.6); opacity: 0; } }
        .supplier-map-popup .leaflet-popup-content-wrapper { border-radius: 14px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.13) !important; border: 1px solid #e7e1da !important; padding: 0 !important; overflow: hidden; }
        .supplier-map-popup .leaflet-popup-content { margin: 0 !important; }
        .supplier-map-popup .leaflet-popup-tip { border-top-color: #fff !important; box-shadow: none !important; }
        .leaflet-control-zoom { border: 1px solid #e7e1da !important; border-radius: 12px !important; overflow: hidden; }
        .leaflet-control-zoom a { color: #181510 !important; background: #fff !important; width: 36px !important; height: 36px !important; line-height: 36px !important; font-size: 18px !important; }
      `}</style>

      {/* Header */}
      <div className="border-accent border-b px-6 pt-5 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff3e0]">
              <MapPin className="text-primary" size={16} />
            </div>
            <div>
              <h2
                className="text-[18px] text-foreground"
                style={{ fontWeight: 600 }}
              >
                מפת ספקים ארצית
              </h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                התפלגות ספקים לפי אזור — לחץ על פין לצפייה בפרטים
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {regionDefs.map((r) => (
              <div
                className="flex cursor-pointer items-center gap-1.5"
                key={r.id}
                onClick={() =>
                  setActiveRegion(activeRegion === r.id ? null : r.id)
                }
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: r.color,
                    transform:
                      activeRegion === r.id ? "scale(1.4)" : "scale(1)",
                    transition: "transform 0.2s",
                  }}
                />
                <span className="text-[11px] text-muted-foreground">
                  {r.name}
                </span>
                <span
                  className="text-[12px] text-foreground"
                  style={{ fontWeight: 700 }}
                >
                  {(suppliersByRegion[r.id] || []).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row" style={{ height: 520 }}>
        {/* Map */}
        <div className="relative h-full flex-1">
          <div
            ref={mapElRef}
            style={{ width: "100%", height: "100%", zIndex: 1 }}
          />
          {activeRegion && (
            <button
              className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[12px] text-foreground shadow-md transition-all hover:border-primary hover:text-primary"
              onClick={resetView}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <Navigation size={13} /> חזרה לתצוגה ארצית
            </button>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex h-full flex-col overflow-hidden border-accent border-r bg-surface lg:w-[240px]">
          <div className="px-4 pt-4 pb-2">
            <p
              className="text-[13px] text-foreground"
              style={{ fontWeight: 700 }}
            >
              ספקים לפי אזור
            </p>
          </div>
          <div className="flex-1 space-y-1.5 overflow-y-auto px-4 pb-3">
            {regionDefs.map((pin) => {
              const list = suppliersByRegion[pin.id] || [];
              const isActive = activeRegion === pin.id;
              const pct =
                suppliers.length > 0
                  ? Math.round((list.length / suppliers.length) * 100)
                  : 0;
              return (
                <div
                  className="w-full cursor-pointer rounded-xl px-3 py-3 text-right transition-all"
                  key={pin.id}
                  onClick={() => setActiveRegion(isActive ? null : pin.id)}
                  onMouseEnter={() => setActiveRegion(pin.id)}
                  onMouseLeave={() => setActiveRegion(null)}
                  style={{
                    backgroundColor: isActive
                      ? `${pin.color}08`
                      : "transparent",
                    border: isActive
                      ? `1px solid ${pin.color}25`
                      : "1px solid transparent",
                  }}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor: pin.color,
                          transform: isActive ? "scale(1.25)" : "scale(1)",
                          transition: "transform 0.2s",
                        }}
                      />
                      <span
                        className="text-[13px] text-foreground"
                        style={{ fontWeight: isActive ? 700 : 500 }}
                      >
                        {pin.label}
                      </span>
                    </div>
                    <span
                      className="text-[12px]"
                      style={{ color: pin.color, fontWeight: 700 }}
                    >
                      {list.length}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-accent">
                    <motion.div
                      animate={{ width: `${pct}%` }}
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      style={{ backgroundColor: pin.color }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] text-tertiary">
                      {pct}% מהמאגר
                    </span>
                    {list.length > 0 && (
                      <span className="text-[10px] text-tertiary">
                        {
                          list.filter(
                            (s: any) => s.verificationStatus === "verified"
                          ).length
                        }{" "}
                        מאומתים
                      </span>
                    )}
                  </div>
                  {isActive && list.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 border-accent border-t pt-2">
                      {list.map((s: any) => (
                        <button
                          className="flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-1 text-[10px] transition-colors hover:border-primary hover:text-primary"
                          key={s._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/suppliers/${s._id}`);
                          }}
                          title={s.name}
                          type="button"
                        >
                          <span>{s.icon}</span>
                          <span
                            className="max-w-[70px] truncate"
                            style={{ fontWeight: 500 }}
                          >
                            {s.name.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="shrink-0 border-accent border-t bg-surface px-4 py-3">
            <div className="mb-1 flex items-center gap-2">
              <Users className="text-muted-foreground" size={13} />
              <span className="text-[12px] text-muted-foreground">
                {'סה"כ במאגר:'}
              </span>
              <span
                className="text-[14px] text-foreground"
                style={{ fontWeight: 700 }}
              >
                {suppliers.length} ספקים
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-tertiary">
              <span className="flex items-center gap-0.5">
                <CheckCircle className="text-success" size={9} />
                {
                  suppliers.filter(
                    (s: any) => s.verificationStatus === "verified"
                  ).length
                }{" "}
                מאומתים
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="text-yellow-500" size={9} />
                {
                  suppliers.filter(
                    (s: any) => s.verificationStatus === "pending"
                  ).length
                }{" "}
                ממתינים
              </span>
              <span className="flex items-center gap-0.5">
                <AlertTriangle className="text-muted-foreground" size={9} />
                {
                  suppliers.filter(
                    (s: any) => s.verificationStatus === "unverified"
                  ).length
                }{" "}
                לא מאומתים
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
