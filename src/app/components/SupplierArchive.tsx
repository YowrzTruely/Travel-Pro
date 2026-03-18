import { useMutation, useQuery } from "convex/react";
import {
  Archive,
  ArchiveRestore,
  ArrowRight,
  Eye,
  Loader2,
  Search,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";

export function SupplierArchive() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const allSuppliers = useQuery(api.suppliers.list);
  const updateSupplier = useMutation(api.suppliers.update);

  const loading = allSuppliers === undefined;

  const suppliers = useMemo(() => {
    if (!allSuppliers) {
      return [];
    }
    return allSuppliers.filter((s: any) => s.category === "ארכיון");
  }, [allSuppliers]);

  const restoreSupplier = async (supplier: any) => {
    try {
      setRestoringId(supplier._id);
      // Restore to default category 'כללי'
      await updateSupplier({
        id: supplier._id,
        category: "כללי",
        categoryColor: "#8d785e",
      });
      appToast.success("הספק שוחזר בהצלחה", `${supplier.name} חזר לבנק הספקים`);
    } catch (err) {
      console.error("[SupplierArchive] Failed to restore:", err);
      appToast.error("שגיאה בשחזור ספק");
    } finally {
      setRestoringId(null);
    }
  };

  const filtered = suppliers.filter(
    (s: any) => !search || s.name.includes(search) || s.region.includes(search)
  );

  return (
    <div className="mx-auto p-4 font-['Assistant',sans-serif] lg:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => navigate("/suppliers")}
            type="button"
          >
            <ArrowRight size={20} />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted-foreground/10">
            <Archive className="text-muted-foreground" size={20} />
          </div>
          <div>
            <h1
              className="text-[26px] text-foreground"
              style={{ fontWeight: 700 }}
            >
              ארכיון ספקים
            </h1>
            <p className="text-[13px] text-muted-foreground">
              {suppliers.length} ספקים בארכיון
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <input
          className="w-full rounded-xl border border-border bg-card py-3 pr-10 pl-4 text-[14px] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש בארכיון..."
          value={search}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20">
          <Loader2 className="mb-3 animate-spin text-primary" size={32} />
          <p className="text-[14px] text-muted-foreground">טוען ארכיון...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20">
          <Archive className="mb-4 text-[#d0c8bb]" size={48} />
          <p
            className="mb-1 text-[18px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            {suppliers.length === 0 ? "הארכיון ריק" : "לא נמצאו תוצאות"}
          </p>
          <p className="mb-4 text-[13px] text-muted-foreground">
            {suppliers.length === 0
              ? "ספקים שיועברו לארכיון יופיעו כאן"
              : "נסה מילות חיפוש אחרות"}
          </p>
          <button
            className="text-[13px] text-primary transition-colors hover:text-primary-hover"
            onClick={() => navigate("/suppliers")}
            style={{ fontWeight: 600 }}
            type="button"
          >
            חזור לבנק ספקים
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border border-b bg-accent">
                  {["ספק", "אזור", "דירוג", "טלפון", "פעולות"].map((h) => (
                    <th
                      className="whitespace-nowrap p-3 text-right text-[12px] text-muted-foreground"
                      key={h}
                      style={{ fontWeight: 600 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((supplier: any) => (
                  <tr
                    className="border-accent border-b transition-colors hover:bg-accent/50"
                    key={supplier._id}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted-foreground/10 text-[16px]">
                          {supplier.icon}
                        </div>
                        <div>
                          <div
                            className="text-[14px] text-foreground"
                            style={{ fontWeight: 600 }}
                          >
                            {supplier.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {supplier.notes !== "-" ? supplier.notes : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[13px] text-muted-foreground">
                      {supplier.region}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span
                          className="text-[13px] text-foreground"
                          style={{ fontWeight: 600 }}
                        >
                          {supplier.rating}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              className={
                                s <= supplier.rating
                                  ? "text-primary"
                                  : "text-tertiary"
                              }
                              fill={s <= supplier.rating ? "#ff8c00" : "none"}
                              key={s}
                              size={12}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[13px] text-muted-foreground">
                      {supplier.phone}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                          onClick={() => navigate(`/suppliers/${supplier._id}`)}
                          title="צפייה"
                          type="button"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-[12px] text-success transition-all hover:bg-success/15 hover:text-success disabled:opacity-50"
                          disabled={restoringId === supplier._id}
                          onClick={() => restoreSupplier(supplier)}
                          style={{ fontWeight: 600 }}
                          type="button"
                        >
                          {restoringId === supplier._id ? (
                            <Loader2 className="animate-spin" size={13} />
                          ) : (
                            <ArchiveRestore size={13} />
                          )}
                          {restoringId === supplier._id ? "משחזר..." : "שחזור"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-border border-t bg-accent p-3">
            <span className="text-[12px] text-muted-foreground">
              {filtered.length} ספקים בארכיון
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
