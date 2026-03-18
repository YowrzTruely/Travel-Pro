import { useQuery } from "convex/react";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import { regionDisplayLabel } from "./constants/supplierConstants";

interface SearchResult {
  icon: string;
  id: string;
  path: string;
  subtitle: string;
  title: string;
  type: "project" | "supplier";
}

export function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suppliers = useQuery(api.suppliers.list);
  const projects = useQuery(api.projects.list);

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

  // Keyboard shortcut: Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const loading = suppliers === undefined || projects === undefined;

  const results = useMemo(() => {
    if (!(query.trim() && suppliers && projects)) {
      return [];
    }

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
          type: "project",
          title: p.name,
          subtitle: `${p.company} • ${p.participants} משתתפים • ${p.status}`,
          icon: "📋",
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
          type: "supplier",
          title: s.name,
          subtitle: `${s.category} • ${regionDisplayLabel(s.region) || s.region} • ${"★".repeat(Math.round(s.rating))}`,
          icon: s.icon,
          path: `/suppliers/${s._id}`,
        });
      }
    });

    return matched.slice(0, 8);
  }, [query, suppliers, projects]);

  const handleChange = (val: string) => {
    setQuery(val);
    if (!open) {
      setOpen(true);
    }
  };

  const selectResult = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    navigate(result.path);
  };

  return (
    <div className="relative w-full max-w-[448px]" ref={wrapperRef}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2 text-muted-foreground"
          size={14}
        />
        <input
          autoComplete="off"
          className="w-full rounded-lg border-0 bg-accent px-4 py-2 pr-10 text-[14px] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (query.trim()) {
              setOpen(true);
            }
          }}
          placeholder="חיפוש פרויקטים, ספקים או לקוחות... (⌘K)"
          ref={inputRef}
          type="text"
          value={query}
        />
        {query && (
          <button
            className="absolute top-1/2 left-3 -translate-y-1/2 text-tertiary hover:text-foreground"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            type="button"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (query.trim() || loading) && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin text-primary" size={18} />
            </div>
          )}

          {!loading && results.length === 0 && query.trim() && (
            <div className="p-4 text-center">
              <p className="text-[13px] text-muted-foreground">
                לא נמצאו תוצאות עבור "{query}"
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="px-3 pt-3 pb-1">
                <span
                  className="text-[11px] text-tertiary"
                  style={{ fontWeight: 600 }}
                >
                  {results.length} תוצאות
                </span>
              </div>
              {results.map((result) => (
                <button
                  className="flex w-full items-center gap-3 border-accent border-b px-4 py-3 text-right transition-colors last:border-b-0 hover:bg-accent"
                  key={`${result.type}-${result.id}`}
                  onClick={() => selectResult(result)}
                  type="button"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-[16px]">
                    {result.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className="truncate text-[13px] text-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      {result.title}
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {result.subtitle}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                      result.type === "project"
                        ? "bg-info/10 text-info"
                        : "bg-chart-5/10 text-chart-5"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {result.type === "project" ? "פרויקט" : "ספק"}
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
