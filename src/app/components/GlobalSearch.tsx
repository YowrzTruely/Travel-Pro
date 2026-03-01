import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, X, Loader2 } from 'lucide-react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Supplier } from './data';

interface SearchResult {
  id: string;
  type: 'project' | 'supplier';
  title: string;
  subtitle: string;
  icon: string;
  path: string;
}

export function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suppliers = useQuery(api.suppliers.list);
  const projects = useQuery(api.projects.list);

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

  // Keyboard shortcut: Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const loading = suppliers === undefined || projects === undefined;

  const results = useMemo(() => {
    if (!query.trim() || !suppliers || !projects) return [];

    const lq = query.toLowerCase();
    const matched: SearchResult[] = [];

    projects.forEach((p: any) => {
      if (
        p.name?.toLowerCase().includes(lq) ||
        p.client?.toLowerCase().includes(lq) ||
        p.company?.toLowerCase().includes(lq) ||
        p._id?.toLowerCase().includes(lq)
      ) {
        matched.push({
          id: p._id,
          type: 'project',
          title: p.name,
          subtitle: `${p.company} • ${p.participants} משתתפים • ${p.status}`,
          icon: '📋',
          path: `/projects/${p._id}`,
        });
      }
    });

    suppliers.forEach((s: any) => {
      if (
        s.name?.toLowerCase().includes(lq) ||
        s.category?.toLowerCase().includes(lq) ||
        s.region?.toLowerCase().includes(lq)
      ) {
        matched.push({
          id: s._id,
          type: 'supplier',
          title: s.name,
          subtitle: `${s.category} • ${s.region} • ${'★'.repeat(Math.round(s.rating))}`,
          icon: s.icon,
          path: `/suppliers/${s._id}`,
        });
      }
    });

    return matched.slice(0, 8);
  }, [query, suppliers, projects]);

  const handleChange = (val: string) => {
    setQuery(val);
    if (!open) setOpen(true);
  };

  const selectResult = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    navigate(result.path);
  };

  return (
    <div ref={wrapperRef} className="w-full max-w-[448px] relative">
      <div className="relative">
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d785e] pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { if (query.trim()) setOpen(true); }}
          placeholder="חיפוש פרויקטים, ספקים או לקוחות... (⌘K)"
          className="w-full bg-[#f5f3f0] border-0 rounded-lg px-4 py-2 pr-10 text-[14px] text-[#181510] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
          autoComplete="off"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b8a990] hover:text-[#181510]">
            <X size={14} />
          </button>
        )}
      </div>

      {open && (query.trim() || loading) && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white border border-[#e7e1da] rounded-xl shadow-2xl overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={18} className="animate-spin text-[#ff8c00]" />
            </div>
          )}

          {!loading && results.length === 0 && query.trim() && (
            <div className="p-4 text-center">
              <p className="text-[13px] text-[#8d785e]">לא נמצאו תוצאות עבור "{query}"</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="px-3 pt-3 pb-1">
                <span className="text-[11px] text-[#b8a990]" style={{ fontWeight: 600 }}>{results.length} תוצאות</span>
              </div>
              {results.map(result => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => selectResult(result)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-[#f5f3f0] transition-colors border-b border-[#f5f3f0] last:border-b-0"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#f5f3f0] flex items-center justify-center text-[16px] shrink-0">
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-[#181510] truncate" style={{ fontWeight: 600 }}>{result.title}</div>
                    <div className="text-[11px] text-[#8d785e] truncate">{result.subtitle}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                    result.type === 'project' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                  }`} style={{ fontWeight: 600 }}>
                    {result.type === 'project' ? 'פרויקט' : 'ספק'}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
