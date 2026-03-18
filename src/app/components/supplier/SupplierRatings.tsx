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
        <p className="text-[15px] text-muted-foreground">לא נמצא ספק מקושר</p>
      </div>
    );
  }

  if (ratings === undefined || avgData === undefined) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      </div>
    );
  }

  // Sort by date descending
  const sorted = [...ratings].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <FeatureGate featureName="דירוגים" requiredStage="stage2">
      <div className="min-h-screen bg-background p-6" dir="rtl">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1
              className="text-[24px] text-foreground"
              style={{ fontWeight: 700 }}
            >
              דירוגים וביקורות
            </h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              דירוגים שהתקבלו ממפיקים ומשתתפים
            </p>
          </div>

          {/* Average rating card */}
          <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div
                  className="text-[48px] text-primary"
                  style={{ fontWeight: 700 }}
                >
                  {avgData.average.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      className={
                        s <= Math.round(avgData.average)
                          ? "fill-primary text-primary"
                          : "text-border"
                      }
                      key={s}
                      size={20}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[13px] text-muted-foreground">
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
                      <span className="w-4 text-[12px] text-muted-foreground">
                        {star}
                      </span>
                      <Star className="text-primary" size={12} />
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-accent">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-left text-[11px] text-muted-foreground">
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
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16">
              <Star className="mb-4 text-border" size={48} />
              <p
                className="text-[16px] text-foreground"
                style={{ fontWeight: 600 }}
              >
                אין דירוגים עדיין
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                דירוגים יופיעו כאן לאחר ביצוע אירועים
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((rating) => (
                <div
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                  key={rating.id}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                        <User className="text-muted-foreground" size={18} />
                      </div>
                      <div>
                        <span
                          className="text-[14px] text-foreground"
                          style={{ fontWeight: 600 }}
                        >
                          {rating.participantName || "אנונימי"}
                        </span>
                        {rating.isProducerRating && (
                          <span
                            className="mr-2 rounded-full bg-info/10 px-2 py-0.5 text-[10px] text-info"
                            style={{ fontWeight: 600 }}
                          >
                            מפיק
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[12px] text-muted-foreground">
                      {new Date(rating.createdAt).toLocaleDateString("he-IL")}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        className={
                          s <= Math.round(rating.rating)
                            ? "fill-primary text-primary"
                            : "text-border"
                        }
                        key={s}
                        size={16}
                      />
                    ))}
                  </div>
                  {rating.comment && (
                    <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">
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
