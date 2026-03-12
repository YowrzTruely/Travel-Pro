import { useMutation } from "convex/react";
import L from "leaflet";
import { Loader2, MapPin, Navigation, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import { useConfirmDelete } from "./ConfirmDeleteModal";
import type { Supplier } from "./data";

// Fix Leaflet default marker icon (missing in bundlers)
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface GeoResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  onUpdate: (updated: Supplier) => void;
  supplier: Supplier;
}

export function SupplierLocationMap({ supplier, onUpdate }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const updateSupplier = useMutation(api.suppliers.update);

  const [address, setAddress] = useState(supplier.address || "");
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasLocation, setHasLocation] = useState(!!supplier.location);
  const [currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(supplier.location || null);

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { requestDelete: requestLocationDelete, modal: locationDeleteModal } =
    useConfirmDelete();

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const defaultCenter: [number, number] = currentCoords
      ? [currentCoords.lat, currentCoords.lng]
      : [31.7683, 35.2137]; // Jerusalem default

    const defaultZoom = currentCoords ? 15 : 7;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control on the left (for RTL)
    L.control.zoom({ position: "topleft" }).addTo(map);

    // Add attribution bottom-left
    L.control
      .attribution({ position: "bottomleft", prefix: false })
      .addAttribution('&copy; <a href="https://openstreetmap.org">OSM</a>')
      .addTo(map);

    mapRef.current = map;

    // Place marker if we have coords
    if (currentCoords) {
      const marker = L.marker([currentCoords.lat, currentCoords.lng], {
        icon: defaultIcon,
      }).addTo(map);
      marker
        .bindPopup(
          `<div style="text-align:right;font-family:Assistant,sans-serif;font-size:13px">${supplier.address || supplier.name}</div>`
        )
        .openPopup();
      markerRef.current = marker;
    }

    // Invalidate size after mount (guard against unmount)
    const resizeTimer = setTimeout(() => {
      if (mapRef.current && mapContainerRef.current) {
        try {
          mapRef.current.invalidateSize();
        } catch (_) {
          // map may have been removed
        }
      }
    }, 200);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [currentCoords, supplier.address, supplier.name]);

  // Update map when coords change
  const updateMapMarker = useCallback(
    (lat: number, lng: number, label: string) => {
      const map = mapRef.current;
      if (!map) {
        return;
      }

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
      marker
        .bindPopup(
          `<div style="text-align:right;font-family:Assistant,sans-serif;font-size:13px">${label}</div>`
        )
        .openPopup();
      markerRef.current = marker;

      map.flyTo([lat, lng], 15, { duration: 1.2 });
    },
    []
  );

  // Geocode search using Nominatim
  const geocodeSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      setSearching(true);
      const encoded = encodeURIComponent(query.trim());
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=5&accept-language=he&countrycodes=il`,
        { headers: { "User-Agent": "Eventos/1.0" } }
      );
      const data: GeoResult[] = await res.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (err) {
      console.error("[Geocoding] search failed:", err);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounced search on input
  const handleInputChange = (val: string) => {
    setAddress(val);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => geocodeSearch(val), 400);
  };

  // Select a suggestion
  const selectSuggestion = async (result: GeoResult) => {
    const lat = Number.parseFloat(result.lat);
    const lng = Number.parseFloat(result.lon);
    const displayAddress = result.display_name;

    setAddress(displayAddress);
    setShowSuggestions(false);
    setSuggestions([]);
    setCurrentCoords({ lat, lng });
    setHasLocation(true);
    updateMapMarker(lat, lng, displayAddress);

    // Save to server
    try {
      setSaving(true);
      await updateSupplier({
        id: (supplier as any)._id,
        address: displayAddress,
        location: { lat, lng },
      });
      onUpdate({
        ...supplier,
        address: displayAddress,
        location: { lat, lng },
      });
      appToast.success("מיקום עודכן", displayAddress.split(",")[0]);
    } catch (err) {
      console.error("[SupplierLocation] save failed:", err);
      appToast.error("שגיאה בשמירת מיקום");
    } finally {
      setSaving(false);
    }
  };

  // Clear location
  const clearLocation = async () => {
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    setAddress("");
    setCurrentCoords(null);
    setHasLocation(false);
    setSuggestions([]);

    mapRef.current?.flyTo([31.7683, 35.2137], 7, { duration: 1 });

    try {
      setSaving(true);
      await updateSupplier({
        id: (supplier as any)._id,
        address: "",
      });
      onUpdate({ ...supplier, address: "", location: undefined as any });
      appToast.info("מיקום הוסר");
    } catch (_err) {
      appToast.error("שגיאה בהסרת מיקום");
    } finally {
      setSaving(false);
    }
  };

  // Click outside suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Search on Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      geocodeSearch(address);
    }
  };

  return (
    <div className="rounded-xl border border-[#e7e1da] bg-white p-5">
      <h3
        className="mb-3 text-[#181510] text-[14px]"
        style={{ fontWeight: 700 }}
      >
        <span className="flex items-center gap-2">
          <MapPin className="text-[#ff8c00]" size={15} />
          מיקום
        </span>
      </h3>

      {/* Address search input */}
      <div className="relative mb-3" ref={suggestionsRef}>
        <div className="relative">
          <input
            className="w-full rounded-lg border border-[#e7e1da] bg-[#f8f7f5] py-2.5 pr-9 pl-9 text-[#181510] text-[13px] transition-colors placeholder:text-[#b5a48b] focus:border-[#ff8c00] focus:outline-none focus:ring-1 focus:ring-[#ff8c00]/30"
            dir="rtl"
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="חפש כתובת..."
            type="text"
            value={address}
          />
          <Search
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8d785e]"
            size={14}
          />
          {searching ? (
            <Loader2
              className="absolute top-1/2 left-3 -translate-y-1/2 animate-spin text-[#ff8c00]"
              size={14}
            />
          ) : address && hasLocation ? (
            <button
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[#8d785e] transition-colors hover:text-red-500"
              onClick={() =>
                requestLocationDelete({
                  title: "מחיקת מיקום",
                  itemName: address.split(",")[0],
                  onConfirm: () => clearLocation(),
                })
              }
              type="button"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        {/* Autocomplete suggestions dropdown — opens upward to avoid map overlap */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute bottom-full z-[100] mb-1 max-h-[220px] w-full overflow-hidden overflow-y-auto rounded-lg border border-[#e7e1da] bg-white shadow-xl">
            {suggestions.map((s, i) => (
              <button
                className="flex w-full items-start gap-2 border-[#f0ece6] border-b px-3 py-2.5 text-right text-[#3d3322] text-[12px] transition-colors last:border-b-0 hover:bg-[#fff8f0]"
                key={`${s.lat}-${s.lon}-${i}`}
                onClick={() => selectSuggestion(s)}
                type="button"
              >
                <Navigation
                  className="mt-0.5 flex-shrink-0 text-[#ff8c00]"
                  size={12}
                />
                <span className="leading-relaxed">{s.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative overflow-hidden rounded-lg border border-[#e7e1da]">
        <div
          className="h-44 w-full"
          ref={mapContainerRef}
          style={{ background: "#f0ece6" }}
        />
        {!hasLocation && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[#f5f3f0]/80">
            <MapPin className="mb-1 text-[#b5a48b]" size={24} />
            <span className="text-[#8d785e] text-[11px]">
              הזן כתובת כדי לראות על המפה
            </span>
          </div>
        )}
        {saving && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-lg border border-[#e7e1da] bg-white/90 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
            <Loader2 className="animate-spin text-[#ff8c00]" size={12} />
            <span
              className="text-[#8d785e] text-[10px]"
              style={{ fontWeight: 600 }}
            >
              שומר...
            </span>
          </div>
        )}
      </div>

      {/* Current address display */}
      {hasLocation && address && (
        <div className="mt-3 flex items-start gap-2 text-[#8d785e] text-[12px]">
          <MapPin className="mt-0.5 flex-shrink-0 text-[#ff8c00]" size={13} />
          <span className="leading-relaxed">
            {address.split(",").slice(0, 3).join(", ")}
          </span>
        </div>
      )}
      {!hasLocation && supplier.region && (
        <div className="mt-3 flex items-center gap-2 text-[#8d785e] text-[13px]">
          <MapPin size={13} /> {supplier.region}
        </div>
      )}

      {locationDeleteModal}
    </div>
  );
}
