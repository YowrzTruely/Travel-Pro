import { useMutation, useQuery } from "convex/react";
import { CalendarDays, Percent, Plus, Tag, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useAuth } from "../AuthContext";
import { FeatureGate } from "./FeatureGate";

interface PromotionFormValues {
  description: string;
  discountType: "percent" | "amount";
  discountValue: number;
  expiresAt: string;
  productId: string;
  startsAt: string;
  title: string;
}

export function SupplierPromotions() {
  const { profile } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<Id<"supplierPromotions"> | null>(
    null
  );

  const supplierId = profile?.supplierId as Id<"suppliers"> | undefined;

  const promotions = useQuery(
    api.supplierPromotions.listBySupplier,
    supplierId ? { supplierId } : "skip"
  );
  const products = useQuery(
    api.supplierProducts.listBySupplierId,
    supplierId ? { supplierId } : "skip"
  );

  const createPromotion = useMutation(api.supplierPromotions.create);
  const updatePromotion = useMutation(api.supplierPromotions.update);
  const deactivatePromotion = useMutation(api.supplierPromotions.deactivate);

  if (!supplierId) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <p className="text-[#8d785e] text-[15px]">לא נמצא ספק מקושר</p>
      </div>
    );
  }

  if (promotions === undefined || products === undefined) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#ff8c00] border-t-transparent" />
      </div>
    );
  }

  const now = Date.now();

  function getStatus(promo: {
    isActive: boolean;
    startsAt: number;
    expiresAt: number;
  }) {
    if (!promo.isActive || promo.expiresAt <= now) {
      return "expired";
    }
    if (promo.startsAt > now) {
      return "upcoming";
    }
    return "active";
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "active":
        return {
          label: "פעיל",
          className: "bg-green-50 text-green-700 border-green-200",
        };
      case "upcoming":
        return {
          label: "עתידי",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      default:
        return {
          label: "פג תוקף",
          className: "bg-gray-100 text-gray-500 border-gray-200",
        };
    }
  }

  const openCreate = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (id: Id<"supplierPromotions">) => {
    setEditingId(id);
    setShowModal(true);
  };

  const handleDeactivate = async (id: Id<"supplierPromotions">) => {
    try {
      await deactivatePromotion({ id });
      appToast.success("המבצע בוטל בהצלחה");
    } catch {
      appToast.error("שגיאה בביטול המבצע");
    }
  };

  const editingPromo = editingId
    ? promotions.find((p) => p.id === editingId)
    : null;

  return (
    <FeatureGate featureName="מבצעים" requiredStage="stage2">
      <div className="min-h-screen bg-[#f8f7f5] p-6" dir="rtl">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1
                className="text-[#181510] text-[24px]"
                style={{ fontWeight: 700 }}
              >
                מבצעים והנחות
              </h1>
              <p className="mt-1 text-[#8d785e] text-[14px]">
                נהל מבצעים מוגבלים בזמן עבור המוצרים שלך
              </p>
            </div>
            <button
              className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-xl bg-[#ff8c00] px-4 py-2.5 text-[14px] text-white transition-colors hover:bg-[#e07b00]"
              onClick={openCreate}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <Plus size={16} />
              הוסף מבצע
            </button>
          </div>

          {/* Promotions list */}
          {promotions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e7e1da] bg-white py-16">
              <Tag className="mb-4 text-[#e7e1da]" size={48} />
              <p
                className="text-[#181510] text-[16px]"
                style={{ fontWeight: 600 }}
              >
                אין מבצעים עדיין
              </p>
              <p className="mt-1 text-[#8d785e] text-[13px]">
                צור מבצע ראשון כדי למשוך יותר לקוחות
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {promotions.map((promo) => {
                const status = getStatus(promo);
                const badge = getStatusBadge(status);
                const productName = products.find(
                  (p) => p.id === promo.productId
                )?.name;

                return (
                  <div
                    className="rounded-2xl border border-[#e7e1da] bg-white p-5 shadow-sm transition-colors hover:border-[#ff8c00]/30"
                    key={promo.id}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[#181510] text-[16px]"
                            style={{ fontWeight: 700 }}
                          >
                            {promo.title}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] ${badge.className}`}
                            style={{ fontWeight: 600 }}
                          >
                            {badge.label}
                          </span>
                        </div>
                        {promo.description && (
                          <p className="mt-1 text-[#8d785e] text-[13px]">
                            {promo.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[#8d785e] text-[12px]">
                          {productName && (
                            <span className="flex items-center gap-1">
                              <Tag size={12} />
                              {productName}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Percent size={12} />
                            {promo.discountPercent
                              ? `${promo.discountPercent}% הנחה`
                              : `₪${promo.discountAmount} הנחה`}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays size={12} />
                            {new Date(promo.startsAt).toLocaleDateString(
                              "he-IL"
                            )}{" "}
                            -{" "}
                            {new Date(promo.expiresAt).toLocaleDateString(
                              "he-IL"
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {status !== "expired" && (
                          <>
                            <button
                              className="min-h-[44px] min-w-[44px] rounded-lg border border-[#e7e1da] px-3 py-1.5 text-[#8d785e] text-[12px] transition-colors hover:bg-[#f5f3f0]"
                              onClick={() => openEdit(promo.id)}
                              style={{ fontWeight: 600 }}
                              type="button"
                            >
                              ערוך
                            </button>
                            <button
                              className="min-h-[44px] min-w-[44px] rounded-lg border border-red-200 px-3 py-1.5 text-[12px] text-red-500 transition-colors hover:bg-red-50"
                              onClick={() => handleDeactivate(promo.id)}
                              style={{ fontWeight: 600 }}
                              type="button"
                            >
                              בטל
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <PromotionModal
            editingPromo={editingPromo ?? null}
            onClose={() => {
              setShowModal(false);
              setEditingId(null);
            }}
            onCreate={createPromotion}
            onUpdate={updatePromotion}
            products={products}
            supplierId={supplierId}
          />
        )}
      </div>
    </FeatureGate>
  );
}

function PromotionModal({
  editingPromo,
  onClose,
  onCreate,
  onUpdate,
  products,
  supplierId,
}: {
  editingPromo: {
    id: Id<"supplierPromotions">;
    title: string;
    description?: string;
    productId?: Id<"supplierProducts">;
    discountPercent?: number;
    discountAmount?: number;
    startsAt: number;
    expiresAt: number;
  } | null;
  onClose: () => void;
  onCreate: (args: {
    supplierId: Id<"suppliers">;
    productId?: Id<"supplierProducts">;
    title: string;
    description?: string;
    discountPercent?: number;
    discountAmount?: number;
    startsAt: number;
    expiresAt: number;
  }) => Promise<unknown>;
  onUpdate: (args: {
    id: Id<"supplierPromotions">;
    title?: string;
    description?: string;
    discountPercent?: number;
    discountAmount?: number;
    startsAt?: number;
    expiresAt?: number;
  }) => Promise<unknown>;
  products: { id: string; name: string }[];
  supplierId: Id<"suppliers">;
}) {
  const toDateStr = (ts: number) => {
    const d = new Date(ts);
    return d.toISOString().slice(0, 10);
  };

  const { register, handleSubmit, watch, formState } =
    useForm<PromotionFormValues>({
      defaultValues: editingPromo
        ? {
            title: editingPromo.title,
            description: editingPromo.description ?? "",
            productId: editingPromo.productId ?? "",
            discountType: editingPromo.discountPercent ? "percent" : "amount",
            discountValue:
              editingPromo.discountPercent ?? editingPromo.discountAmount ?? 0,
            startsAt: toDateStr(editingPromo.startsAt),
            expiresAt: toDateStr(editingPromo.expiresAt),
          }
        : {
            title: "",
            description: "",
            productId: "",
            discountType: "percent",
            discountValue: 0,
            startsAt: toDateStr(Date.now()),
            expiresAt: "",
          },
    });

  const discountType = watch("discountType");

  const onSubmit = async (data: PromotionFormValues) => {
    try {
      const discountPercent =
        data.discountType === "percent" ? data.discountValue : undefined;
      const discountAmount =
        data.discountType === "amount" ? data.discountValue : undefined;
      const startsAt = new Date(data.startsAt).getTime();
      const expiresAt = new Date(data.expiresAt).getTime();

      if (editingPromo) {
        await onUpdate({
          id: editingPromo.id,
          title: data.title,
          description: data.description || undefined,
          discountPercent,
          discountAmount,
          startsAt,
          expiresAt,
        });
        appToast.success("המבצע עודכן בהצלחה");
      } else {
        await onCreate({
          supplierId,
          productId: data.productId
            ? (data.productId as Id<"supplierProducts">)
            : undefined,
          title: data.title,
          description: data.description || undefined,
          discountPercent,
          discountAmount,
          startsAt,
          expiresAt,
        });
        appToast.success("המבצע נוצר בהצלחה");
      }
      onClose();
    } catch {
      appToast.error("שגיאה בשמירת המבצע");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        dir="rtl"
      >
        <button
          className="absolute top-4 left-4 text-[#8d785e] hover:text-[#181510]"
          onClick={onClose}
          type="button"
        >
          <X size={20} />
        </button>
        <h2
          className="mb-5 text-[#181510] text-[18px]"
          style={{ fontWeight: 700 }}
        >
          {editingPromo ? "עריכת מבצע" : "מבצע חדש"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div>
            <label
              className="mb-1 block text-[#181510] text-[13px]"
              htmlFor="promo-title"
              style={{ fontWeight: 600 }}
            >
              כותרת *
            </label>
            <input
              className="w-full rounded-xl border border-[#e7e1da] bg-[#f5f3f0] px-4 py-2.5 text-[14px] outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00]"
              id="promo-title"
              {...register("title", { required: true })}
            />
            {formState.errors.title && (
              <span className="mt-1 text-[12px] text-red-500">שדה חובה</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              className="mb-1 block text-[#181510] text-[13px]"
              htmlFor="promo-desc"
              style={{ fontWeight: 600 }}
            >
              תיאור
            </label>
            <textarea
              className="w-full rounded-xl border border-[#e7e1da] bg-[#f5f3f0] px-4 py-2.5 text-[14px] outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00]"
              id="promo-desc"
              rows={2}
              {...register("description")}
            />
          </div>

          {/* Product */}
          {!editingPromo && (
            <div>
              <label
                className="mb-1 block text-[#181510] text-[13px]"
                htmlFor="promo-product"
                style={{ fontWeight: 600 }}
              >
                מוצר
              </label>
              <select
                className="w-full rounded-xl border border-[#e7e1da] bg-[#f5f3f0] px-4 py-2.5 text-[14px] outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00]"
                id="promo-product"
                {...register("productId")}
              >
                <option value="">כל המוצרים</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Discount type */}
          <div>
            <span
              className="mb-2 block text-[#181510] text-[13px]"
              style={{ fontWeight: 600 }}
            >
              סוג הנחה
            </span>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 text-[13px]">
                <input
                  type="radio"
                  value="percent"
                  {...register("discountType")}
                />
                אחוז הנחה
              </label>
              <label className="flex items-center gap-1.5 text-[13px]">
                <input
                  type="radio"
                  value="amount"
                  {...register("discountType")}
                />
                סכום קבוע
              </label>
            </div>
          </div>

          {/* Discount value */}
          <div>
            <label
              className="mb-1 block text-[#181510] text-[13px]"
              htmlFor="promo-discount"
              style={{ fontWeight: 600 }}
            >
              {discountType === "percent" ? "אחוז הנחה (%)" : "סכום הנחה (₪)"}
            </label>
            <input
              className="w-full rounded-xl border border-[#e7e1da] bg-[#f5f3f0] px-4 py-2.5 text-[14px] outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00]"
              id="promo-discount"
              min={0}
              type="number"
              {...register("discountValue", {
                required: true,
                valueAsNumber: true,
              })}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="mb-1 block text-[#181510] text-[13px]"
                htmlFor="promo-starts"
                style={{ fontWeight: 600 }}
              >
                תאריך התחלה *
              </label>
              <input
                className="w-full rounded-xl border border-[#e7e1da] bg-[#f5f3f0] px-4 py-2.5 text-[14px] outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00]"
                id="promo-starts"
                type="date"
                {...register("startsAt", { required: true })}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-[#181510] text-[13px]"
                htmlFor="promo-expires"
                style={{ fontWeight: 600 }}
              >
                תאריך סיום *
              </label>
              <input
                className="w-full rounded-xl border border-[#e7e1da] bg-[#f5f3f0] px-4 py-2.5 text-[14px] outline-none focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00]"
                id="promo-expires"
                type="date"
                {...register("expiresAt", { required: true })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              className="min-h-[44px] rounded-xl border border-[#e7e1da] px-5 py-2.5 text-[#8d785e] text-[14px] transition-colors hover:bg-[#f5f3f0]"
              onClick={onClose}
              style={{ fontWeight: 600 }}
              type="button"
            >
              ביטול
            </button>
            <button
              className="min-h-[44px] rounded-xl bg-[#ff8c00] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#e07b00]"
              style={{ fontWeight: 600 }}
              type="submit"
            >
              {editingPromo ? "עדכן" : "צור מבצע"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
