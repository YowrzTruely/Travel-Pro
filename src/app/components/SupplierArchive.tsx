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
            className="text-[#8d785e] transition-colors hover:text-[#181510]"
            onClick={() => navigate("/suppliers")}
            type="button"
          >
            <ArrowRight size={20} />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#94a3b8]/10">
            <Archive className="text-[#94a3b8]" size={20} />
          </div>
          <div>
            <h1
              className="text-[#181510] text-[26px]"
              style={{ fontWeight: 700 }}
            >
              ארכיון ספקים
            </h1>
            <p className="text-[#8d785e] text-[13px]">
              {suppliers.length} ספקים בארכיון
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8d785e]"
          size={18}
        />
        <input
          className="w-full rounded-xl border border-[#e7e1da] bg-white py-3 pr-10 pl-4 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש בארכיון..."
          value={search}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e7e1da] bg-white py-20">
          <Loader2 className="mb-3 animate-spin text-[#ff8c00]" size={32} />
          <p className="text-[#8d785e] text-[14px]">טוען ארכיון...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e7e1da] bg-white py-20">
          <Archive className="mb-4 text-[#d0c8bb]" size={48} />
          <p
            className="mb-1 text-[#181510] text-[18px]"
            style={{ fontWeight: 600 }}
          >
            {suppliers.length === 0 ? "הארכיון ריק" : "לא נמצאו תוצאות"}
          </p>
          <p className="mb-4 text-[#8d785e] text-[13px]">
            {suppliers.length === 0
              ? "ספקים שיועברו לארכיון יופיעו כאן"
              : "נסה מילות חיפוש אחרות"}
          </p>
          <button
            className="text-[#ff8c00] text-[13px] transition-colors hover:text-[#e67e00]"
            onClick={() => navigate("/suppliers")}
            style={{ fontWeight: 600 }}
            type="button"
          >
            חזור לבנק ספקים
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e7e1da] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-[#e7e1da] border-b bg-[#f5f3f0]">
                  {["ספק", "אזור", "דירוג", "טלפון", "פעולות"].map((h) => (
                    <th
                      className="whitespace-nowrap p-3 text-right text-[#8d785e] text-[12px]"
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
                    className="border-[#ece8e3] border-b transition-colors hover:bg-[#f5f3f0]/50"
                    key={supplier._id}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#94a3b8]/10 text-[16px]">
                          {supplier.icon}
                        </div>
                        <div>
                          <div
                            className="text-[#181510] text-[14px]"
                            style={{ fontWeight: 600 }}
                          >
                            {supplier.name}
                          </div>
                          <div className="text-[#8d785e] text-[11px]">
                            {supplier.notes !== "-" ? supplier.notes : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#6b5d45] text-[13px]">
                      {supplier.region}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span
                          className="text-[#181510] text-[13px]"
                          style={{ fontWeight: 600 }}
                        >
                          {supplier.rating}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              className={
                                s <= supplier.rating
                                  ? "text-[#ff8c00]"
                                  : "text-[#ddd6cb]"
                              }
                              fill={s <= supplier.rating ? "#ff8c00" : "none"}
                              key={s}
                              size={12}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#6b5d45] text-[13px]">
                      {supplier.phone}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-lg p-1.5 text-[#8d785e] transition-all hover:bg-[#ff8c00]/10 hover:text-[#ff8c00]"
                          onClick={() => navigate(`/suppliers/${supplier._id}`)}
                          title="צפייה"
                          type="button"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-[12px] text-green-600 transition-all hover:bg-green-100 hover:text-green-700 disabled:opacity-50"
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
          <div className="border-[#e7e1da] border-t bg-[#f5f3f0] p-3">
            <span className="text-[#8d785e] text-[12px]">
              {filtered.length} ספקים בארכיון
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
