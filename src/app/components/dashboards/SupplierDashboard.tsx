import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Star,
  Tag,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useAuth } from "../AuthContext";
import { StatCard } from "./StatCard";

export function SupplierDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const supplierId = profile?.supplierId as Id<"suppliers"> | undefined;

  const supplierStats = useQuery(
    api.dashboard.supplierStats,
    supplierId ? { supplierId } : "skip"
  );

  // Availability requests for this supplier
  const requests = useQuery(
    api.availabilityRequests.listBySupplier,
    supplierId ? { supplierId } : "skip"
  );

  // Promotions
  const promotions = useQuery(
    api.supplierPromotions.listBySupplier,
    supplierId ? { supplierId } : "skip"
  );

  // Documents
  const documents = useQuery(
    api.supplierDocuments.listBySupplierId,
    supplierId ? { supplierId } : "skip"
  );

  // Ratings
  const ratings = useQuery(
    api.supplierRatings.listBySupplier,
    supplierId ? { supplierId } : "skip"
  );

  const respondToRequest = useMutation(api.availabilityRequests.respond);

  const loading = !supplierId || supplierStats === undefined;

  if (!supplierId) {
    return (
      <div
        className="flex flex-col items-center justify-center py-32"
        dir="rtl"
      >
        <AlertTriangle className="mb-3 text-warning" size={32} />
        <p className="text-[16px] text-muted-foreground">
          הפרופיל שלך לא מקושר לספק. אנא פנה למנהל המערכת.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="mb-3 animate-spin text-primary" size={32} />
        <p className="text-[14px] text-muted-foreground">
          טוען נתוני דשבורד...
        </p>
      </div>
    );
  }

  const pendingRequests = (requests ?? []).filter(
    (r) => r.status === "pending"
  );
  const activePromotions = (promotions ?? []).filter((p) => p.isActive);
  const alertDocs = (documents ?? []).filter(
    (d) => d.status === "expired" || d.status === "warning"
  );
  const recentRatings = (ratings ?? []).slice(0, 5);

  async function handleRespond(
    requestId: Id<"availabilityRequests">,
    status: "approved" | "declined"
  ) {
    try {
      await respondToRequest({ id: requestId, status });
      appToast.success(status === "approved" ? "בקשה אושרה" : "בקשה נדחתה");
    } catch {
      appToast.error("שגיאה בעדכון הבקשה");
    }
  }

  return (
    <div className="w-full space-y-8 p-8" dir="rtl">
      {/* Welcome */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-[30px] text-foreground tracking-[-0.75px]"
          style={{ fontWeight: 600 }}
        >
          לוח בקרה - ספק
        </h1>
        <p className="mt-1 text-[16px] text-muted-foreground">
          שלום, {profile?.name || "ספק"}. הנה סקירה על הפעילות שלך.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <StatCard
          color={{ icon: "#3B82F6", iconBg: "#EFF6FF", spark: "#3B82F6" }}
          icon={Bell}
          index={0}
          onClick={() => navigate("/requests")}
          title="בקשות ממתינות"
          value={supplierStats.pendingRequests}
        />
        <StatCard
          color={{ icon: "#22C55E", iconBg: "#F0FDF4", spark: "#22C55E" }}
          icon={CheckCircle}
          index={1}
          title="הזמנות פעילות"
          value={supplierStats.activeBookings}
        />
        <StatCard
          color={{ icon: "#F59E0B", iconBg: "#FFFBEB", spark: "#F59E0B" }}
          icon={Star}
          index={2}
          onClick={() => navigate("/ratings")}
          title="דירוג ממוצע"
          value={supplierStats.avgRating * 10}
        />
        <StatCard
          color={{ icon: "#EF4444", iconBg: "#FEF2F2", spark: "#EF4444" }}
          icon={FileText}
          index={3}
          onClick={() => navigate("/documents")}
          title="מסמכים חסרים/פגי תוקף"
          value={supplierStats.missingDocs}
        />
      </div>

      {/* Pending Availability Requests */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border border-border bg-card shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 px-6 py-4">
          <Clock className="text-info" size={18} />
          <h2
            className="text-[18px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            בקשות זמינות ממתינות
          </h2>
          {pendingRequests.length > 0 && (
            <span
              className="rounded-full bg-info px-2 py-0.5 text-[11px] text-white"
              style={{ fontWeight: 600 }}
            >
              {pendingRequests.length}
            </span>
          )}
        </div>
        <div className="border-accent border-t px-6 py-4">
          {pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center py-6">
              <CheckCircle className="mb-2 text-success" size={24} />
              <p className="text-[14px] text-muted-foreground">
                אין בקשות ממתינות
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-accent bg-surface px-4 py-3"
                  key={req.id}
                >
                  <div>
                    <p
                      className="text-[14px] text-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      {req.date} - {req.participants ?? "?"} משתתפים
                    </p>
                    {req.notes && (
                      <p className="text-[12px] text-muted-foreground">
                        {req.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-1 rounded-lg bg-success px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-success"
                      onClick={() =>
                        handleRespond(
                          req.id as Id<"availabilityRequests">,
                          "approved"
                        )
                      }
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      <ThumbsUp size={12} />
                      אשר
                    </button>
                    <button
                      className="flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-destructive"
                      onClick={() =>
                        handleRespond(
                          req.id as Id<"availabilityRequests">,
                          "declined"
                        )
                      }
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      <ThumbsDown size={12} />
                      דחה
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Two columns: Promotions + Document Alerts */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Active Promotions */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:flex-1"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 px-6 py-4">
            <Tag className="text-warning" size={18} />
            <h2
              className="text-[18px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              מבצעים פעילים
            </h2>
          </div>
          <div className="border-accent border-t px-6 py-4">
            {activePromotions.length === 0 ? (
              <p className="py-4 text-center text-[14px] text-muted-foreground">
                אין מבצעים פעילים כרגע
              </p>
            ) : (
              <div className="space-y-3">
                {activePromotions.map((promo) => (
                  <div
                    className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3"
                    key={promo._id}
                  >
                    <p
                      className="text-[14px] text-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      {promo.title}
                    </p>
                    {promo.description && (
                      <p className="text-[12px] text-muted-foreground">
                        {promo.description}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-2 text-[12px] text-warning">
                      {promo.discountPercent && (
                        <span style={{ fontWeight: 600 }}>
                          {promo.discountPercent}% הנחה
                        </span>
                      )}
                      <span>
                        עד{" "}
                        {new Date(promo.expiresAt).toLocaleDateString("he-IL")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Document Alerts */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:flex-1"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 px-6 py-4">
            <AlertTriangle className="text-destructive" size={18} />
            <h2
              className="text-[18px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              התראות מסמכים
            </h2>
          </div>
          <div className="border-accent border-t px-6 py-4">
            {alertDocs.length === 0 ? (
              <div className="flex flex-col items-center py-4">
                <CheckCircle className="mb-2 text-success" size={24} />
                <p className="text-[14px] text-muted-foreground">
                  כל המסמכים תקינים
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {alertDocs.map((doc) => (
                  <div
                    className="flex items-center gap-3 rounded-lg px-3 py-2"
                    key={doc.id}
                    style={{
                      backgroundColor:
                        doc.status === "expired" ? "#fef2f2" : "#fffbeb",
                      border: `1px solid ${doc.status === "expired" ? "#fecaca" : "#fde68a"}`,
                    }}
                  >
                    {doc.status === "expired" ? (
                      <XCircle
                        className="shrink-0 text-destructive"
                        size={16}
                      />
                    ) : (
                      <AlertTriangle
                        className="shrink-0 text-warning"
                        size={16}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[13px]"
                        style={{
                          color:
                            doc.status === "expired" ? "#dc2626" : "#d97706",
                          fontWeight: 500,
                        }}
                      >
                        {doc.name}
                      </p>
                      {doc.expiry && (
                        <p className="text-[11px] text-muted-foreground">
                          {doc.status === "expired" ? "פג תוקף" : "יפוג בקרוב"}{" "}
                          - {doc.expiry}
                        </p>
                      )}
                    </div>
                    <button
                      className="shrink-0 rounded px-2 py-1 text-[11px] text-primary transition-colors hover:bg-[#fff7ed]"
                      onClick={() => navigate("/documents")}
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      עדכן
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Ratings */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border border-border bg-card shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center gap-2 px-6 py-4">
          <Star className="text-warning" size={18} />
          <h2
            className="text-[18px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            דירוגים אחרונים
          </h2>
        </div>
        <div className="border-accent border-t px-6 py-4">
          {recentRatings.length === 0 ? (
            <p className="py-4 text-center text-[14px] text-muted-foreground">
              אין דירוגים עדיין
            </p>
          ) : (
            <div className="space-y-3">
              {recentRatings.map((rating) => (
                <div
                  className="flex items-start gap-3 rounded-lg border border-accent bg-surface px-4 py-3"
                  key={rating._id}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fffbeb]">
                    <Star className="text-warning" size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            className={
                              i < rating.rating
                                ? "fill-warning text-warning"
                                : "text-border"
                            }
                            key={`star-${rating._id}-${i}`}
                            size={12}
                          />
                        ))}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(rating.createdAt).toLocaleDateString("he-IL")}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="mt-1 text-[13px] text-foreground">
                        {rating.comment}
                      </p>
                    )}
                    {rating.participantName && (
                      <p className="text-[11px] text-muted-foreground">
                        {rating.participantName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
