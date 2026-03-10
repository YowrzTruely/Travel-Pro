import { useQuery } from "convex/react";
import { Star, User } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "../AuthContext";
import { FeatureGate } from "./FeatureGate";

export function SupplierRatings() {
  const { profile } = useAuth();

  const supplierId = profile?.supplierId as Id<"suppliers"> | undefined;

  const ratings = useQuery(
    api.supplierRatings.listBySupplier,
    supplierId ? { supplierId } : "skip"
  );
  const avgData = useQuery(
    api.supplierRatings.getAverageRating,
    supplierId ? { supplierId } : "skip"
  );

  if (!supplierId) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <p className="text-[#8d785e] text-[15px]">לא נמצא ספק מקושר</p>
      </div>
    );
  }

  if (ratings === undefined || avgData === undefined) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#ff8c00] border-t-transparent" />
      </div>
    );
  }

  // Sort by date descending
  const sorted = [...ratings].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <FeatureGate featureName="דירוגים" requiredStage="stage2">
      <div className="min-h-screen bg-[#f8f7f5] p-6" dir="rtl">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1
              className="text-[#181510] text-[24px]"
              style={{ fontWeight: 700 }}
            >
              דירוגים וביקורות
            </h1>
            <p className="mt-1 text-[#8d785e] text-[14px]">
              דירוגים שהתקבלו ממפיקים ומשתתפים
            </p>
          </div>

          {/* Average rating card */}
          <div className="mb-6 rounded-2xl border border-[#e7e1da] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div
                  className="text-[#ff8c00] text-[48px]"
                  style={{ fontWeight: 700 }}
                >
                  {avgData.average.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      className={
                        s <= Math.round(avgData.average)
                          ? "fill-[#ff8c00] text-[#ff8c00]"
                          : "text-[#e7e1da]"
                      }
                      key={s}
                      size={20}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[#8d785e] text-[13px]">
                  {avgData.count} דירוגים
                </p>
              </div>
              <div className="flex-1">
                {/* Distribution bars */}
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratings.filter(
                    (r) => Math.round(r.rating) === star
                  ).length;
                  const pct =
                    ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                  return (
                    <div className="flex items-center gap-2" key={star}>
                      <span className="w-4 text-[#8d785e] text-[12px]">
                        {star}
                      </span>
                      <Star className="text-[#ff8c00]" size={12} />
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f5f3f0]">
                        <div
                          className="h-full rounded-full bg-[#ff8c00] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-left text-[#8d785e] text-[11px]">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Individual ratings */}
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e7e1da] bg-white py-16">
              <Star className="mb-4 text-[#e7e1da]" size={48} />
              <p
                className="text-[#181510] text-[16px]"
                style={{ fontWeight: 600 }}
              >
                אין דירוגים עדיין
              </p>
              <p className="mt-1 text-[#8d785e] text-[13px]">
                דירוגים יופיעו כאן לאחר ביצוע אירועים
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((rating) => (
                <div
                  className="rounded-2xl border border-[#e7e1da] bg-white p-5 shadow-sm"
                  key={rating.id}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3f0]">
                        <User className="text-[#8d785e]" size={18} />
                      </div>
                      <div>
                        <span
                          className="text-[#181510] text-[14px]"
                          style={{ fontWeight: 600 }}
                        >
                          {rating.participantName || "אנונימי"}
                        </span>
                        {rating.isProducerRating && (
                          <span
                            className="mr-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-600"
                            style={{ fontWeight: 600 }}
                          >
                            מפיק
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[#8d785e] text-[12px]">
                      {new Date(rating.createdAt).toLocaleDateString("he-IL")}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        className={
                          s <= Math.round(rating.rating)
                            ? "fill-[#ff8c00] text-[#ff8c00]"
                            : "text-[#e7e1da]"
                        }
                        key={s}
                        size={16}
                      />
                    ))}
                  </div>
                  {rating.comment && (
                    <p className="mt-2 text-[#8d785e] text-[14px] leading-relaxed">
                      {rating.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FeatureGate>
  );
}
