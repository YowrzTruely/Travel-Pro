import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Search, Loader2, X, Navigation } from 'lucide-react';
import L from 'leaflet';
import type { Supplier } from './data';
import { suppliersApi } from './api';
import { appToast } from './AppToast';
import { useConfirmDelete } from './ConfirmDeleteModal';

// Fix Leaflet default marker icon (missing in bundlers)
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Orange accent marker
const accentIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'leaflet-marker-accent',
});

interface GeoResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  supplier: Supplier;
  onUpdate: (updated: Supplier) => void;
}

export function SupplierLocationMap({ supplier, onUpdate }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [address, setAddress] = useState(supplier.address || '');
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasLocation, setHasLocation] = useState(!!supplier.location);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(
    supplier.location || null
  );

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { requestDelete: requestLocationDelete, modal: locationDeleteModal } = useConfirmDelete();

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control on the left (for RTL)
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Add attribution bottom-left
    L.control.attribution({ position: 'bottomleft', prefix: false })
      .addAttribution('&copy; <a href="https://openstreetmap.org">OSM</a>')
      .addTo(map);

    mapRef.current = map;

    // Place marker if we have coords
    if (currentCoords) {
      const marker = L.marker([currentCoords.lat, currentCoords.lng], { icon: defaultIcon }).addTo(map);
      marker.bindPopup(`<div style="text-align:right;font-family:Assistant,sans-serif;font-size:13px">${supplier.address || supplier.name}</div>`).openPopup();
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
  }, []);

  // Update map when coords change
  const updateMapMarker = useCallback((lat: number, lng: number, label: string) => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
    marker.bindPopup(`<div style="text-align:right;font-family:Assistant,sans-serif;font-size:13px">${label}</div>`).openPopup();
    markerRef.current = marker;

    map.flyTo([lat, lng], 15, { duration: 1.2 });
  }, []);

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
        { headers: { 'User-Agent': 'TravelPro/1.0' } }
      );
      const data: GeoResult[] = await res.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (err) {
      console.error('[Geocoding] search failed:', err);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounced search on input
  const handleInputChange = (val: string) => {
    setAddress(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => geocodeSearch(val), 400);
  };

  // Select a suggestion
  const selectSuggestion = async (result: GeoResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
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
      const updated = await suppliersApi.update(supplier.id, {
        address: displayAddress,
        location: { lat, lng },
      });
      onUpdate(updated);
      appToast.success('מיקום עודכן', displayAddress.split(',')[0]);
    } catch (err) {
      console.error('[SupplierLocation] save failed:', err);
      appToast.error('שגיאה בשמירת מיקום');
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
    setAddress('');
    setCurrentCoords(null);
    setHasLocation(false);
    setSuggestions([]);

    mapRef.current?.flyTo([31.7683, 35.2137], 7, { duration: 1 });

    try {
      setSaving(true);
      const updated = await suppliersApi.update(supplier.id, {
        address: '',
        location: undefined as any,
      });
      onUpdate(updated);
      appToast.info('מיקום הוסר');
    } catch (err) {
      appToast.error('שגיאה בהסרת מיקום');
    } finally {
      setSaving(false);
    }
  };

  // Click outside suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Search on Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      geocodeSearch(address);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
      <h3 className="text-[14px] text-[#181510] mb-3" style={{ fontWeight: 700 }}>
        <span className="flex items-center gap-2">
          <MapPin size={15} className="text-[#ff8c00]" />
          מיקום
        </span>
      </h3>

      {/* Address search input */}
      <div className="relative mb-3" ref={suggestionsRef}>
        <div className="relative">
          <input
            type="text"
            value={address}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
            placeholder="חפש כתובת..."
            className="w-full text-[13px] text-[#181510] bg-[#f8f7f5] border border-[#e7e1da] rounded-lg pr-9 pl-9 py-2.5 placeholder:text-[#b5a48b] focus:outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00]/30 transition-colors"
            dir="rtl"
          />
          <Search
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d785e]"
          />
          {searching ? (
            <Loader2
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ff8c00] animate-spin"
            />
          ) : address && hasLocation ? (
            <button
              onClick={() => requestLocationDelete({ title: 'מחיקת מיקום', itemName: address.split(',')[0], onConfirm: () => clearLocation() })}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d785e] hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        {/* Autocomplete suggestions dropdown — opens upward to avoid map overlap */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-[100] bottom-full mb-1 w-full bg-white border border-[#e7e1da] rounded-lg shadow-xl overflow-hidden max-h-[220px] overflow-y-auto">
            {suggestions.map((s, i) => (
              <button
                key={`${s.lat}-${s.lon}-${i}`}
                onClick={() => selectSuggestion(s)}
                className="w-full text-right px-3 py-2.5 text-[12px] text-[#3d3322] hover:bg-[#fff8f0] border-b border-[#f0ece6] last:border-b-0 transition-colors flex items-start gap-2"
              >
                <Navigation size={12} className="text-[#ff8c00] mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{s.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative rounded-lg overflow-hidden border border-[#e7e1da]">
        <div
          ref={mapContainerRef}
          className="w-full h-44"
          style={{ background: '#f0ece6' }}
        />
        {!hasLocation && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f5f3f0]/80 pointer-events-none">
            <MapPin size={24} className="text-[#b5a48b] mb-1" />
            <span className="text-[11px] text-[#8d785e]">הזן כתובת כדי לראות על המפה</span>
          </div>
        )}
        {saving && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm border border-[#e7e1da]">
            <Loader2 size={12} className="text-[#ff8c00] animate-spin" />
            <span className="text-[10px] text-[#8d785e]" style={{ fontWeight: 600 }}>שומר...</span>
          </div>
        )}
      </div>

      {/* Current address display */}
      {hasLocation && address && (
        <div className="flex items-start gap-2 mt-3 text-[12px] text-[#8d785e]">
          <MapPin size={13} className="text-[#ff8c00] mt-0.5 flex-shrink-0" />
          <span className="leading-relaxed">{address.split(',').slice(0, 3).join(', ')}</span>
        </div>
      )}
      {!hasLocation && supplier.region && (
        <div className="flex items-center gap-2 mt-3 text-[13px] text-[#8d785e]">
          <MapPin size={13} /> {supplier.region}
        </div>
      )}

      {locationDeleteModal}
    </div>
  );
}