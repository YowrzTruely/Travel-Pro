import { useQuery } from "convex/react";
import { MapPin, MessageCircle, Package, Phone, Star, Tag } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import {
  categoryDisplayLabel,
  regionDisplayLabel,
} from "../constants/supplierConstants";

const PHONE_LEADING_ZERO_RE = /^0/;

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
        className="flex min-h-screen items-center justify-center bg-background"
        dir="rtl"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-background"
        dir="rtl"
      >
        <h1 className="text-[24px] text-foreground" style={{ fontWeight: 700 }}>
          ספק לא נמצא
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          הקישור אינו תקף או שהספק הוסר
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero header */}
      <div className="bg-gradient-to-b from-primary/10 to-background pt-12 pb-8">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card shadow-sm">
              <span className="text-[40px]">{supplier.icon || "🏢"}</span>
            </div>
            <div>
              <h1
                className="text-[28px] text-foreground"
                style={{ fontWeight: 700 }}
              >
                {supplier.name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-[14px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Tag size={14} />
                  {categoryDisplayLabel(supplier.category)}
                </span>
                {supplier.region && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {regionDisplayLabel(supplier.region)}
                  </span>
                )}
                {avgData && avgData.count > 0 && (
                  <span className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {stars.map((filled, i) => (
                        <Star
                          className={
                            filled ? "fill-primary text-primary" : "text-border"
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
                  className="mt-2 inline-block rounded-full bg-success/10 px-2.5 py-0.5 text-[12px] text-success"
                  style={{ fontWeight: 600 }}
                >
                  ספק מאומת ✓
                </span>
              )}
            </div>
          </div>

          {supplier.notes && (
            <p className="mt-6 text-[15px] text-muted-foreground leading-relaxed">
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
              className="mb-4 text-[18px] text-foreground"
              style={{ fontWeight: 700 }}
            >
              🔥 מבצעים פעילים
            </h2>
            <div className="space-y-3">
              {activePromotions.map((promo) => (
                <div
                  className="rounded-2xl border border-primary/30 bg-gradient-to-l from-orange-50 to-white p-5"
                  key={promo.id}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[16px] text-foreground"
                      style={{ fontWeight: 700 }}
                    >
                      {promo.title}
                    </span>
                    <span
                      className="rounded-full bg-primary px-3 py-1 text-[13px] text-white"
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
                    <p className="mt-2 text-[13px] text-muted-foreground">
                      {promo.description}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-muted-foreground">
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
              className="mb-4 flex items-center gap-2 text-[18px] text-foreground"
              style={{ fontWeight: 700 }}
            >
              <Package className="text-primary" size={20} />
              מוצרים ושירותים
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <div
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                  key={product.id}
                >
                  <div
                    className="text-[15px] text-foreground"
                    style={{ fontWeight: 700 }}
                  >
                    {product.name}
                  </div>
                  {(product.aiDescription || product.description) && (
                    <p className="mt-1 line-clamp-3 text-[13px] text-muted-foreground">
                      {product.aiDescription ?? product.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="text-[16px] text-primary"
                      style={{ fontWeight: 700 }}
                    >
                      ₪{(product.listPrice ?? product.price).toLocaleString()}
                    </span>
                    {product.unit && (
                      <span className="text-[12px] text-muted-foreground">
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
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2
              className="mb-4 text-[18px] text-foreground"
              style={{ fontWeight: 700 }}
            >
              דירוג כללי
            </h2>
            <div className="flex items-center gap-4">
              <span
                className="text-[40px] text-primary"
                style={{ fontWeight: 700 }}
              >
                {avgData.average.toFixed(1)}
              </span>
              <div>
                <div className="flex gap-0.5">
                  {stars.map((filled, i) => (
                    <Star
                      className={
                        filled ? "fill-primary text-primary" : "text-border"
                      }
                      key={i}
                      size={24}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  מבוסס על {avgData.count} דירוגים
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contact buttons */}
        {supplier.phone && (
          <div className="mt-8 flex justify-center gap-3">
            <a
              className="flex items-center gap-2 rounded-xl bg-success/100 px-6 py-3 text-[14px] text-white shadow-lg transition-colors hover:bg-success"
              href={`https://wa.me/972${supplier.phone.replace(PHONE_LEADING_ZERO_RE, "")}`}
              rel="noopener noreferrer"
              style={{ fontWeight: 600 }}
              target="_blank"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
            <a
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-[14px] text-foreground shadow-sm transition-colors hover:bg-accent"
              href={`tel:${supplier.phone}`}
              style={{ fontWeight: 600 }}
            >
              <Phone size={18} />
              התקשר
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-[12px] text-muted-foreground">
          מופעל ע״י Eventos
        </div>
      </div>
    </div>
  );
}
