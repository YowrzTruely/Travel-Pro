import { useQuery } from "convex/react";
import { Search, Star, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";

interface SupplierSearchProps {
  label?: string;
  onChange: (name: string) => void;
  placeholder?: string;
  value: string;
}

export function SupplierSearch({
  value,
  onChange,
  placeholder = "חפש ספק...",
  label = "ספק",
}: SupplierSearchProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const allSuppliers = useQuery(api.suppliers.list);
  const activePromotions = useQuery(api.supplierPromotions.listActive, {});
  const recommendations = useQuery(api.suppliers.recommend, { limit: 3 });

  const promotionSupplierIds = useMemo(() => {
    if (!activePromotions) {
      return new Set<string>();
    }
    return new Set(
      activePromotions.map((p: { supplierId: string }) => p.supplierId)
    );
  }, [activePromotions]);

  const loaded = allSuppliers !== undefined;

  // Filter results when query changes
  const results = useMemo(() => {
    if (!allSuppliers) {
      return [];
    }
    if (!query.trim()) {
      return allSuppliers.slice(0, 8);
    }
    const q = query.toLowerCase();
    return allSuppliers
      .filter(
        (s: any) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, allSuppliers]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectSupplier = (supplier: any) => {
    setQuery(supplier.name);
    onChange(supplier.name);
    setOpen(false);
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    onChange(val);
    if (!open) {
      setOpen(true);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label
        className="mb-1 block text-[#181510] text-[13px]"
        htmlFor="supplier-search-input"
        style={{ fontWeight: 600 }}
      >
        {label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#b8a990]"
          size={14}
        />
        <input
          autoComplete="off"
          className="w-full rounded-xl border border-[#e7e1da] bg-[#f5f3f0] py-2.5 pr-9 pl-8 text-[#181510] text-[14px] outline-none transition-all focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00]"
          id="supplier-search-input"
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setOpen(true);
          }}
          placeholder={placeholder}
          type="text"
          value={query}
        />
        {query && (
          <button
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#b8a990] hover:text-[#181510]"
            onClick={() => {
              setQuery("");
              onChange("");
            }}
            type="button"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#e7e1da] bg-white shadow-xl">
          {results.map((s: any) => (
            <button
              className="flex w-full items-center gap-3 border-[#f5f3f0] border-b px-4 py-3 text-right transition-colors last:border-b-0 hover:bg-[#f5f3f0]"
              key={s._id}
              onClick={() => selectSupplier(s)}
              type="button"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${s.categoryColor}15` }}
              >
                <span className="text-[16px]">{s.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="truncate text-[#181510] text-[13px]"
                  style={{ fontWeight: 600 }}
                >
                  {s.name}
                </div>
                <div className="text-[#8d785e] text-[11px]">
                  {s.category} &bull; {s.region} &bull;{" "}
                  {"★".repeat(Math.round(s.rating))}
                </div>
              </div>
              {promotionSupplierIds.has(s._id) && (
                <span
                  className="shrink-0 rounded-full bg-orange-50 px-1.5 py-0.5 text-[10px] text-orange-600"
                  style={{ fontWeight: 600 }}
                >
                  מבצע פעיל
                </span>
              )}
              {s.verificationStatus === "verified" && (
                <span
                  className="shrink-0 rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] text-green-600"
                  style={{ fontWeight: 600 }}
                >
                  מאומת
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {open && loaded && results.length === 0 && query.trim() && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-xl border border-[#e7e1da] bg-white p-4 text-center shadow-xl">
          <p className="text-[#8d785e] text-[13px]">
            לא נמצאו ספקים. ניתן להקליד שם ידנית.
          </p>
        </div>
      )}

      {/* Recommendation chips when search is empty */}
      {!query.trim() && recommendations && recommendations.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span
            className="text-[#8d785e] text-[11px]"
            style={{ fontWeight: 600 }}
          >
            מומלצים:
          </span>
          {recommendations.map((rec: any) => (
            <button
              className="flex items-center gap-1.5 rounded-full border border-[#e7e1da] bg-white px-3 py-1 text-[12px] transition-all hover:border-[#ff8c00] hover:bg-[#ff8c00]/5"
              key={rec.id}
              onClick={() => selectSupplier(rec)}
              type="button"
            >
              <span style={{ fontWeight: 600 }}>{rec.name}</span>
              <span className="flex items-center gap-0.5 text-[#ff8c00]">
                <Star fill="#ff8c00" size={10} />
                {rec.rating}
              </span>
              <span
                className="rounded-full bg-[#ff8c00]/10 px-1.5 py-0.5 text-[#ff8c00] text-[10px]"
                style={{ fontWeight: 600 }}
              >
                {rec.reason}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
