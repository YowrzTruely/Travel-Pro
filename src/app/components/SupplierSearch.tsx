import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { suppliersApi } from './api';
import type { Supplier } from './data';

interface SupplierSearchProps {
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
  label?: string;
}

export function SupplierSearch({ value, onChange, placeholder = 'חפש ספק...', label = 'ספק' }: SupplierSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Supplier[]>([]);
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load suppliers on first focus
  const loadSuppliers = async () => {
    if (loaded) return;
    try {
      const list = await suppliersApi.list();
      setAllSuppliers(list);
      setLoaded(true);
    } catch (err) {
      console.error('[SupplierSearch] Failed to load suppliers:', err);
    }
  };

  // Filter results when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults(allSuppliers.slice(0, 8));
    } else {
      const q = query.toLowerCase();
      setResults(
        allSuppliers
          .filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.region.toLowerCase().includes(q))
          .slice(0, 8)
      );
    }
  }, [query, allSuppliers]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectSupplier = (supplier: Supplier) => {
    setQuery(supplier.name);
    onChange(supplier.name);
    setOpen(false);
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    onChange(val);
    if (!open) setOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-[13px] text-[#181510] mb-1" style={{ fontWeight: 600 }}>{label}</label>
      <div className="relative">
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8a990] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => { loadSuppliers(); setOpen(true); }}
          placeholder={placeholder}
          className="w-full pr-9 pl-8 py-2.5 bg-[#f5f3f0] border border-[#e7e1da] rounded-xl text-[14px] text-[#181510] focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] outline-none transition-all"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); onChange(''); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b8a990] hover:text-[#181510]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-[#e7e1da] rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {results.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => selectSupplier(s)}
              className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-[#f5f3f0] transition-colors border-b border-[#f5f3f0] last:border-b-0"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: s.categoryColor + '15' }}>
                <span className="text-[16px]">{s.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-[#181510] truncate" style={{ fontWeight: 600 }}>{s.name}</div>
                <div className="text-[11px] text-[#8d785e]">{s.category} &bull; {s.region} &bull; {'★'.repeat(Math.round(s.rating))}</div>
              </div>
              {s.verificationStatus === 'verified' && (
                <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full shrink-0" style={{ fontWeight: 600 }}>מאומת</span>
              )}
            </button>
          ))}
        </div>
      )}

      {open && loaded && results.length === 0 && query.trim() && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-[#e7e1da] rounded-xl shadow-xl p-4 text-center">
          <p className="text-[13px] text-[#8d785e]">לא נמצאו ספקים. ניתן להקליד שם ידנית.</p>
        </div>
      )}
    </div>
  );
}
