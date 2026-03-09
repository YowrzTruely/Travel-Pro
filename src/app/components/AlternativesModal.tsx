import { useQuery } from "convex/react";
import { Check, MapPin, Star, Tag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

interface AlternativeItem {
  description?: string;
  imageUrl?: string;
  name: string;
  price: number;
  productId?: string;
  supplierId: string;
}

interface AlternativesModalProps {
  category: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (alternatives: AlternativeItem[]) => void;
  region?: string;
  supplierId?: string;
}

export function AlternativesModal({
  isOpen,
  category,
  supplierId,
  region,
  onClose,
  onSelect,
}: AlternativesModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const suppliers = useQuery(
    (api.suppliers as any).findAlternatives,
    isOpen
      ? {
          category,
          excludeId: supplierId ? (supplierId as Id<"suppliers">) : undefined,
          region,
        }
      : "skip"
  ) as
    | {
        _id: Id<"suppliers">;
        name: string;
        rating: number;
        region?: string;
        category: string;
        notes?: string;
      }[]
    | undefined;

  const promotions = useQuery(
    (api.supplierPromotions as any).listActive,
    isOpen ? {} : "skip"
  ) as { supplierId: Id<"suppliers"> }[] | undefined;

  const promotionSupplierIds = new Set(
    (promotions ?? []).map((p) => String(p.supplierId))
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 4) {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (!suppliers) {
      return;
    }
    const items: AlternativeItem[] = suppliers
      .filter((s) => selected.has(String(s._id)))
      .map((s) => ({
        supplierId: String(s._id),
        name: s.name,
        price: 0,
        description: s.notes ?? undefined,
      }));
    onSelect(items);
    setSelected(new Set());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className="w-full max-w-2xl rounded-xl border border-[#e7e1da] bg-[#f8f7f5] shadow-2xl"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between rounded-t-xl border-[#e7e1da] border-b bg-white px-5 py-4">
                <div>
                  <h2
                    className="text-[#181510] text-[17px]"
                    style={{ fontWeight: 700 }}
                  >
                    חלופות — {category}
                  </h2>
                  <p className="text-[#8d785e] text-[12px]">
                    בחר עד 4 ספקים חלופיים
                    {region ? ` באזור ${region}` : ""}
                  </p>
                </div>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8d785e] transition-colors hover:bg-[#f5f3f0] hover:text-[#181510]"
                  onClick={onClose}
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[60vh] overflow-y-auto p-4">
                {suppliers ? (
                  suppliers.length === 0 ? (
                    <div className="py-12 text-center text-[#8d785e] text-[14px]">
                      לא נמצאו ספקים חלופיים בקטגוריה זו
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {suppliers.map((s) => {
                        const sid = String(s._id);
                        const isSelected = selected.has(sid);
                        const hasPromo = promotionSupplierIds.has(sid);
                        return (
                          <button
                            className={`relative rounded-xl border-2 bg-white p-4 text-right transition-all ${
                              isSelected
                                ? "border-[#ff8c00] bg-[#ff8c00]/5 shadow-sm"
                                : "border-[#e7e1da] hover:border-[#ff8c00]/50"
                            } ${
                              !isSelected && selected.size >= 4
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }`}
                            key={sid}
                            onClick={() => toggleSelect(sid)}
                            type="button"
                          >
                            {/* Selection check */}
                            {isSelected && (
                              <div className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff8c00]">
                                <Check className="text-white" size={14} />
                              </div>
                            )}

                            {/* Supplier name + promo badge */}
                            <div className="mb-2 flex items-center gap-2">
                              <span
                                className="text-[#181510] text-[15px]"
                                style={{ fontWeight: 600 }}
                              >
                                {s.name}
                              </span>
                              {hasPromo && (
                                <span
                                  className="flex items-center gap-1 rounded-full bg-[#ff8c00]/10 px-2 py-0.5 text-[#ff8c00] text-[10px]"
                                  style={{ fontWeight: 600 }}
                                >
                                  <Tag size={10} />
                                  מבצע
                                </span>
                              )}
                            </div>

                            {/* Rating */}
                            <div className="mb-1.5 flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((w) => (
                                <Star
                                  className={
                                    w <= (s.rating || 0)
                                      ? "text-[#ff8c00]"
                                      : "text-[#ddd6cb]"
                                  }
                                  fill={
                                    w <= (s.rating || 0) ? "#ff8c00" : "none"
                                  }
                                  key={w}
                                  size={14}
                                />
                              ))}
                              <span className="mr-1 text-[#8d785e] text-[11px]">
                                ({s.rating || 0})
                              </span>
                            </div>

                            {/* Region + category */}
                            <div className="flex items-center gap-3 text-[#8d785e] text-[12px]">
                              {s.region && (
                                <span className="flex items-center gap-1">
                                  <MapPin size={11} />
                                  {s.region}
                                </span>
                              )}
                              <span>{s.category}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <div className="py-12 text-center text-[#8d785e] text-[14px]">
                    טוען ספקים...
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between rounded-b-xl border-[#e7e1da] border-t bg-white px-5 py-3">
                <span className="text-[#8d785e] text-[13px]">
                  {selected.size > 0
                    ? `${selected.size} ספקים נבחרו`
                    : "לא נבחרו ספקים"}
                </span>
                <div className="flex gap-2">
                  <button
                    className="rounded-xl border border-[#e7e1da] px-4 py-2 text-[#8d785e] text-[13px] transition-colors hover:bg-[#f5f3f0]"
                    onClick={onClose}
                    type="button"
                  >
                    ביטול
                  </button>
                  <button
                    className="rounded-xl bg-[#ff8c00] px-5 py-2 text-[13px] text-white transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={selected.size === 0}
                    onClick={handleConfirm}
                    style={{ fontWeight: 600 }}
                    type="button"
                  >
                    אישור ({selected.size})
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
