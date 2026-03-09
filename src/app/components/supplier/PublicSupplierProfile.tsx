import { useQuery } from "convex/react";
import { MapPin, Package, Star, Tag } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function PublicSupplierProfile() {
  const { id } = useParams<{ id: string }>();

  // Try as Convex ID first; if it looks like a Convex ID use get, otherwise use getByLegacyId
  const isConvexId = id?.startsWith("k") || id?.startsWith("j");

  const supplierById = useQuery(
    api.suppliers.get,
    isConvexId && id ? { id: id as Id<"suppliers"> } : "skip"
  );
  const supplierByLegacy = useQuery(
    api.suppliers.getByLegacyId,
    !isConvexId && id ? { legacyId: id } : "skip"
  );

  const supplier = isConvexId ? supplierById : supplierByLegacy;

  const supplierId = supplier?.id as Id<"suppliers"> | undefined;

  const products = useQuery(
    api.supplierProducts.listBySupplierId,
    supplierId ? { supplierId } : "skip"
  );
  const activePromotions = useQuery(
    api.supplierPromotions.listActive,
    supplierId ? { supplierId } : "skip"
  );
  const avgData = useQuery(
    api.supplierRatings.getAverageRating,
    supplierId ? { supplierId } : "skip"
  );

  const isLoading =
    supplier === undefined ||
    (supplierId &&
      (products === undefined ||
        activePromotions === undefined ||
        avgData === undefined));

  const stars = useMemo(() => {
    if (!avgData) {
      return [];
    }
    return [1, 2, 3, 4, 5].map((s) => s <= Math.round(avgData.average));
  }, [avgData]);

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#f8f7f5]"
        dir="rtl"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#ff8c00] border-t-transparent" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-[#f8f7f5]"
        dir="rtl"
      >
        <h1 className="text-[#181510] text-[24px]" style={{ fontWeight: 700 }}>
          ספק לא נמצא
        </h1>
        <p className="mt-2 text-[#8d785e] text-[14px]">
          הקישור אינו תקף או שהספק הוסר
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5]" dir="rtl">
      {/* Hero header */}
      <div className="bg-gradient-to-b from-[#ff8c00]/10 to-[#f8f7f5] pt-12 pb-8">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
              <span className="text-[40px]">{supplier.icon || "🏢"}</span>
            </div>
            <div>
              <h1
                className="text-[#181510] text-[28px]"
                style={{ fontWeight: 700 }}
              >
                {supplier.name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-[#8d785e] text-[14px]">
                <span className="flex items-center gap-1">
                  <Tag size={14} />
                  {supplier.category}
                </span>
                {supplier.region && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {supplier.region}
                  </span>
                )}
                {avgData && avgData.count > 0 && (
                  <span className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {stars.map((filled, i) => (
                        <Star
                          className={
                            filled
                              ? "fill-[#ff8c00] text-[#ff8c00]"
                              : "text-[#e7e1da]"
                          }
                          key={i}
                          size={14}
                        />
                      ))}
                    </div>
                    <span>
                      {avgData.average.toFixed(1)} ({avgData.count})
                    </span>
                  </span>
                )}
              </div>
              {supplier.verificationStatus === "verified" && (
                <span
                  className="mt-2 inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-[12px] text-green-600"
                  style={{ fontWeight: 600 }}
                >
                  ספק מאומת ✓
                </span>
              )}
            </div>
          </div>

          {supplier.notes && (
            <p className="mt-6 text-[#8d785e] text-[15px] leading-relaxed">
              {supplier.notes}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-12">
        {/* Active promotions */}
        {activePromotions && activePromotions.length > 0 && (
          <div className="mb-8">
            <h2
              className="mb-4 text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              🔥 מבצעים פעילים
            </h2>
            <div className="space-y-3">
              {activePromotions.map((promo) => (
                <div
                  className="rounded-2xl border border-orange-200 bg-gradient-to-l from-orange-50 to-white p-5"
                  key={promo.id}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[#181510] text-[16px]"
                      style={{ fontWeight: 700 }}
                    >
                      {promo.title}
                    </span>
                    <span
                      className="rounded-full bg-[#ff8c00] px-3 py-1 text-[13px] text-white"
                      style={{ fontWeight: 600 }}
                    >
                      {promo.discountPercent
                        ? `${promo.discountPercent}% הנחה`
                        : promo.discountAmount
                          ? `₪${promo.discountAmount} הנחה`
                          : ""}
                    </span>
                  </div>
                  {promo.description && (
                    <p className="mt-2 text-[#8d785e] text-[13px]">
                      {promo.description}
                    </p>
                  )}
                  <p className="mt-2 text-[#8d785e] text-[11px]">
                    עד {new Date(promo.expiresAt).toLocaleDateString("he-IL")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {products && products.length > 0 && (
          <div className="mb-8">
            <h2
              className="mb-4 flex items-center gap-2 text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              <Package className="text-[#ff8c00]" size={20} />
              מוצרים ושירותים
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <div
                  className="rounded-2xl border border-[#e7e1da] bg-white p-5 shadow-sm"
                  key={product.id}
                >
                  <div
                    className="text-[#181510] text-[15px]"
                    style={{ fontWeight: 700 }}
                  >
                    {product.name}
                  </div>
                  {(product.aiDescription || product.description) && (
                    <p className="mt-1 line-clamp-3 text-[#8d785e] text-[13px]">
                      {product.aiDescription ?? product.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="text-[#ff8c00] text-[16px]"
                      style={{ fontWeight: 700 }}
                    >
                      ₪{(product.listPrice ?? product.price).toLocaleString()}
                    </span>
                    {product.unit && (
                      <span className="text-[#8d785e] text-[12px]">
                        ל{product.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating summary */}
        {avgData && avgData.count > 0 && (
          <div className="rounded-2xl border border-[#e7e1da] bg-white p-6 shadow-sm">
            <h2
              className="mb-4 text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              דירוג כללי
            </h2>
            <div className="flex items-center gap-4">
              <span
                className="text-[#ff8c00] text-[40px]"
                style={{ fontWeight: 700 }}
              >
                {avgData.average.toFixed(1)}
              </span>
              <div>
                <div className="flex gap-0.5">
                  {stars.map((filled, i) => (
                    <Star
                      className={
                        filled
                          ? "fill-[#ff8c00] text-[#ff8c00]"
                          : "text-[#e7e1da]"
                      }
                      key={i}
                      size={24}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[#8d785e] text-[13px]">
                  מבוסס על {avgData.count} דירוגים
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-[#8d785e] text-[12px]">
          מופעל ע״י TravelPro
        </div>
      </div>
    </div>
  );
}
