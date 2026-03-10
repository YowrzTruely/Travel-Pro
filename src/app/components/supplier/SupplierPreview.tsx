import { useQuery } from "convex/react";
import {
  AlertCircle,
  Eye,
  MapPin,
  Package,
  Star,
  Tag,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "../AuthContext";
import { FeatureGate } from "./FeatureGate";

type ViewMode = "producer" | "client";

export function SupplierPreview() {
  const { profile } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("producer");

  const supplierId = profile?.supplierId as Id<"suppliers"> | undefined;

  const supplier = useQuery(
    api.suppliers.get,
    supplierId ? { id: supplierId } : "skip"
  );
  const products = useQuery(
    api.supplierProducts.listBySupplierId,
    supplierId ? { supplierId } : "skip"
  );
  const promotions = useQuery(
    api.supplierPromotions.listBySupplier,
    supplierId ? { supplierId } : "skip"
  );
  const ratings = useQuery(
    api.supplierRatings.listBySupplier,
    supplierId ? { supplierId } : "skip"
  );

  if (!supplierId) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <p className="text-[#8d785e] text-[15px]">לא נמצא ספק מקושר</p>
      </div>
    );
  }

  if (
    supplier === undefined ||
    products === undefined ||
    promotions === undefined ||
    ratings === undefined
  ) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#ff8c00] border-t-transparent" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <p className="text-[#8d785e] text-[15px]">ספק לא נמצא</p>
      </div>
    );
  }

  const now = Date.now();
  const activePromotions = promotions.filter(
    (p) => p.isActive && p.startsAt <= now && p.expiresAt > now
  );

  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

  // Determine missing fields
  const missingFields: { label: string; link: string }[] = [];
  if (!supplier.phone) {
    missingFields.push({ label: "טלפון", link: "/profile" });
  }
  if (!supplier.email) {
    missingFields.push({ label: "אימייל", link: "/profile" });
  }
  if (!supplier.address) {
    missingFields.push({ label: "כתובת", link: "/profile" });
  }
  if (!supplier.region) {
    missingFields.push({ label: "אזור", link: "/profile" });
  }
  if (!products || products.length === 0) {
    missingFields.push({ label: "מוצרים", link: "/products" });
  }

  return (
    <FeatureGate featureName="תצוגה מקדימה" requiredStage="stage2">
      <div className="min-h-screen bg-[#f8f7f5] p-6" dir="rtl">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1
                className="text-[#181510] text-[24px]"
                style={{ fontWeight: 700 }}
              >
                כך אני נראה
              </h1>
              <p className="mt-1 text-[#8d785e] text-[14px]">
                תצוגה מקדימה של הפרופיל שלך כפי שנראה למפיקים ולקוחות
              </p>
            </div>

            {/* View toggle */}
            <div className="flex gap-2 rounded-xl border border-[#e7e1da] bg-white p-1">
              <button
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                  viewMode === "producer"
                    ? "bg-[#ff8c00] text-white"
                    : "text-[#8d785e] hover:bg-[#f5f3f0]"
                }`}
                onClick={() => setViewMode("producer")}
                style={{ fontWeight: 600 }}
                type="button"
              >
                <Users size={14} />
                תצוגת מפיק
              </button>
              <button
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                  viewMode === "client"
                    ? "bg-[#ff8c00] text-white"
                    : "text-[#8d785e] hover:bg-[#f5f3f0]"
                }`}
                onClick={() => setViewMode("client")}
                style={{ fontWeight: 600 }}
                type="button"
              >
                <Eye size={14} />
                תצוגת לקוח
              </button>
            </div>
          </div>

          {/* Supplier card */}
          <div className="mb-6 rounded-2xl border border-[#e7e1da] bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff8c00]/10">
                <span className="text-[32px]">{supplier.icon || "🏢"}</span>
              </div>
              <div className="flex-1">
                <h2
                  className="text-[#181510] text-[20px]"
                  style={{ fontWeight: 700 }}
                >
                  {supplier.name}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[#8d785e] text-[13px]">
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    {supplier.category}
                  </span>
                  {supplier.region && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {supplier.region}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="text-[#ff8c00]" size={12} />
                    {avgRating.toFixed(1)} ({ratings.length} דירוגים)
                  </span>
                </div>
                {supplier.verificationStatus === "verified" && (
                  <span
                    className="mt-2 inline-block rounded-full bg-green-50 px-2 py-0.5 text-[11px] text-green-600"
                    style={{ fontWeight: 600 }}
                  >
                    מאומת ✓
                  </span>
                )}
              </div>
            </div>

            {supplier.notes && (
              <p className="mt-4 text-[#8d785e] text-[14px] leading-relaxed">
                {supplier.notes}
              </p>
            )}
          </div>

          {/* Products */}
          <div className="mb-6 rounded-2xl border border-[#e7e1da] bg-white p-6 shadow-sm">
            <h3
              className="mb-4 flex items-center gap-2 text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              <Package className="text-[#ff8c00]" size={18} />
              מוצרים ({products.length})
            </h3>
            {products.length === 0 ? (
              <p className="text-[#8d785e] text-[14px]">
                עדיין לא נוספו מוצרים
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {products.map((product) => (
                  <div
                    className="rounded-xl border border-[#e7e1da] p-4"
                    key={product.id}
                  >
                    <div
                      className="text-[#181510] text-[14px]"
                      style={{ fontWeight: 600 }}
                    >
                      {product.name}
                    </div>
                    {product.description && (
                      <p className="mt-1 line-clamp-2 text-[#8d785e] text-[12px]">
                        {viewMode === "client"
                          ? (product.aiDescription ?? product.description)
                          : product.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className="text-[#ff8c00] text-[14px]"
                        style={{ fontWeight: 700 }}
                      >
                        {viewMode === "producer"
                          ? `₪${(product.producerPrice ?? product.price).toLocaleString()}`
                          : `₪${(product.listPrice ?? product.price).toLocaleString()}`}
                      </span>
                      {viewMode === "producer" &&
                        product.producerPrice &&
                        product.listPrice && (
                          <span className="text-[#8d785e] text-[11px]">
                            מחיר מחירון: ₪{product.listPrice.toLocaleString()}
                          </span>
                        )}
                    </div>
                    {product.unit && (
                      <span className="text-[#8d785e] text-[11px]">
                        ל{product.unit}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active promotions */}
          {activePromotions.length > 0 && (
            <div className="mb-6 rounded-2xl border border-[#e7e1da] bg-white p-6 shadow-sm">
              <h3
                className="mb-4 text-[#181510] text-[16px]"
                style={{ fontWeight: 700 }}
              >
                🔥 מבצעים פעילים ({activePromotions.length})
              </h3>
              <div className="space-y-3">
                {activePromotions.map((promo) => (
                  <div
                    className="rounded-xl border border-orange-200 bg-orange-50 p-4"
                    key={promo.id}
                  >
                    <div
                      className="text-[#181510] text-[14px]"
                      style={{ fontWeight: 600 }}
                    >
                      {promo.title}
                    </div>
                    {promo.description && (
                      <p className="mt-1 text-[#8d785e] text-[12px]">
                        {promo.description}
                      </p>
                    )}
                    <div
                      className="mt-2 text-[#ff8c00] text-[13px]"
                      style={{ fontWeight: 600 }}
                    >
                      {promo.discountPercent
                        ? `${promo.discountPercent}% הנחה`
                        : promo.discountAmount
                          ? `₪${promo.discountAmount} הנחה`
                          : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings summary */}
          {ratings.length > 0 && (
            <div className="mb-6 rounded-2xl border border-[#e7e1da] bg-white p-6 shadow-sm">
              <h3
                className="mb-4 text-[#181510] text-[16px]"
                style={{ fontWeight: 700 }}
              >
                דירוגים ({ratings.length})
              </h3>
              <div className="flex items-center gap-3">
                <span
                  className="text-[#ff8c00] text-[32px]"
                  style={{ fontWeight: 700 }}
                >
                  {avgRating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      className={
                        s <= Math.round(avgRating)
                          ? "fill-[#ff8c00] text-[#ff8c00]"
                          : "text-[#e7e1da]"
                      }
                      key={s}
                      size={20}
                    />
                  ))}
                </div>
                <span className="text-[#8d785e] text-[13px]">
                  ({ratings.length} דירוגים)
                </span>
              </div>
            </div>
          )}

          {/* Missing fields */}
          {missingFields.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h3
                className="mb-3 flex items-center gap-2 text-[15px] text-amber-800"
                style={{ fontWeight: 700 }}
              >
                <AlertCircle size={18} />
                שדות חסרים ({missingFields.length})
              </h3>
              <p className="mb-3 text-[13px] text-amber-700">
                השלם את השדות הבאים כדי לשפר את הפרופיל שלך:
              </p>
              <div className="flex flex-wrap gap-2">
                {missingFields.map((field) => (
                  <Link
                    className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-[12px] text-amber-700 transition-colors hover:bg-amber-100"
                    key={field.label}
                    style={{ fontWeight: 600 }}
                    to={field.link}
                  >
                    {field.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </FeatureGate>
  );
}
