import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useAuth } from "../AuthContext";

type Tab = "pending" | "active" | "history";

const TAB_LABELS: Record<Tab, string> = {
  pending: "בקשות ממתינות",
  active: "שריונות פעילים",
  history: "היסטוריה",
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("he-IL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "#fff7ed", text: "#9a3412", label: "ממתין" },
    approved: { bg: "#f0fdf4", text: "#15803d", label: "אושר" },
    declined: { bg: "#fef2f2", text: "#b91c1c", label: "נדחה" },
    alternative_proposed: {
      bg: "#eff6ff",
      text: "#1d4ed8",
      label: "הוצעה חלופה",
    },
    reserved: { bg: "#fff7ed", text: "#9a3412", label: "שריון" },
    confirmed: { bg: "#f0fdf4", text: "#15803d", label: "מאושר" },
    cancelled: { bg: "#fef2f2", text: "#b91c1c", label: "בוטל" },
    expired: { bg: "#f5f3f0", text: "#8d785e", label: "פג תוקף" },
  };
  const c = config[status] ?? { bg: "#f5f3f0", text: "#8d785e", label: status };
  return (
    <span
      className="inline-block rounded-lg px-2.5 py-1 font-semibold text-xs"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <AlertCircle className="text-[#8d785e]" size={40} />
      <p className="text-[#8d785e] text-base">{message}</p>
    </div>
  );
}

function RequestCard({
  request,
}: {
  request: {
    id: Id<"availabilityRequests">;
    projectId: Id<"projects">;
    date: string;
    participants?: number;
    notes?: string;
    status: string;
    requestedAt: number;
    responseNotes?: string;
  };
}) {
  const project = useQuery(api.projects.get, { id: request.projectId });
  const respond = useMutation(api.availabilityRequests.respond);
  const [loading, setLoading] = useState(false);

  const handleRespond = async (status: "approved" | "declined") => {
    setLoading(true);
    try {
      await respond({ id: request.id, status });
      appToast.success(status === "approved" ? "הבקשה אושרה" : "הבקשה נדחתה");
    } catch {
      appToast.error("שגיאה בעדכון הבקשה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#e7e1da] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} />
          <span className="text-[#8d785e] text-xs">
            {formatTimestamp(request.requestedAt)}
          </span>
        </div>
        <ChevronRight className="text-[#8d785e]" size={18} />
      </div>

      <h3 className="mb-2 font-bold text-[#181510] text-lg">
        {project?.name ?? "טוען..."}
      </h3>

      <div className="flex flex-wrap gap-4 text-[#8d785e] text-sm">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} />
          {formatDate(request.date)}
        </span>
        {request.participants != null && (
          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {request.participants} משתתפים
          </span>
        )}
      </div>

      {request.notes && (
        <p className="mt-2 text-[#8d785e] text-sm">{request.notes}</p>
      )}

      {request.status === "pending" && (
        <div className="mt-4 flex gap-3">
          <button
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 font-semibold text-sm text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
            onClick={() => handleRespond("approved")}
            type="button"
          >
            <Check size={16} />
            אישור
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 font-semibold text-sm text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            disabled={loading}
            onClick={() => handleRespond("declined")}
            type="button"
          >
            <X size={16} />
            דחייה
          </button>
        </div>
      )}
    </div>
  );
}

function BookingCard({
  booking,
}: {
  booking: {
    id: Id<"bookings">;
    projectId: Id<"projects">;
    date: string;
    participants: number;
    status: string;
    expiresAt?: number;
    createdAt: number;
  };
}) {
  const project = useQuery(api.projects.get, { id: booking.projectId });
  const confirmBooking = useMutation(api.bookings.confirm);
  const cancelBooking = useMutation(api.bookings.cancel);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await confirmBooking({ id: booking.id });
      appToast.success("השריון אושר");
    } catch {
      appToast.error("שגיאה באישור השריון");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelBooking({ id: booking.id });
      appToast.success("השריון בוטל");
    } catch {
      appToast.error("שגיאה בביטול השריון");
    } finally {
      setLoading(false);
    }
  };

  const isActive =
    booking.status === "reserved" || booking.status === "confirmed";

  return (
    <div className="rounded-xl border border-[#e7e1da] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <StatusBadge status={booking.status} />
          <span className="text-[#8d785e] text-xs">
            {formatTimestamp(booking.createdAt)}
          </span>
        </div>
        <ChevronRight className="text-[#8d785e]" size={18} />
      </div>

      <h3 className="mb-2 font-bold text-[#181510] text-lg">
        {project?.name ?? "טוען..."}
      </h3>

      <div className="flex flex-wrap gap-4 text-[#8d785e] text-sm">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} />
          {formatDate(booking.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={14} />
          {booking.participants} משתתפים
        </span>
        {booking.expiresAt != null && booking.status === "reserved" && (
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            תפוגה: {formatTimestamp(booking.expiresAt)}
          </span>
        )}
      </div>

      {isActive && (
        <div className="mt-4 flex gap-3">
          {booking.status === "reserved" && (
            <button
              className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 font-semibold text-sm text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              disabled={loading}
              onClick={handleConfirm}
              type="button"
            >
              <Check size={16} />
              אישור סופי
            </button>
          )}
          <button
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 font-semibold text-sm text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            disabled={loading}
            onClick={handleCancel}
            type="button"
          >
            <X size={16} />
            ביטול
          </button>
        </div>
      )}
    </div>
  );
}

export function RequestsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const supplierId = profile?.supplierId as Id<"suppliers"> | undefined;

  const requests = useQuery(
    api.availabilityRequests.listBySupplier,
    supplierId ? { supplierId } : "skip"
  );

  const bookings = useQuery(
    api.bookings.listBySupplier,
    supplierId ? { supplierId } : "skip"
  );

  if (!supplierId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-['Assistant']">
        <div className="rounded-xl border border-[#e7e1da] bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-3 text-[#ff8c00]" size={48} />
          <h2 className="mb-2 font-bold text-[#181510] text-xl">
            נא לקשר את החשבון לספק
          </h2>
          <p className="text-[#8d785e] text-sm">
            יש לקשר את חשבון המשתמש לפרופיל ספק כדי לצפות בבקשות.
          </p>
        </div>
      </div>
    );
  }

  const pendingRequests = requests?.filter((r) => r.status === "pending") ?? [];
  const activeBookings =
    bookings?.filter(
      (b) => b.status === "reserved" || b.status === "confirmed"
    ) ?? [];
  const historyRequests = requests?.filter((r) => r.status !== "pending") ?? [];
  const historyBookings =
    bookings?.filter(
      (b) => b.status === "cancelled" || b.status === "expired"
    ) ?? [];

  const tabCounts: Record<Tab, number> = {
    pending: pendingRequests.length,
    active: activeBookings.length,
    history: historyRequests.length + historyBookings.length,
  };

  return (
    <div className="min-h-screen bg-[#f5f3f0] p-6 font-['Assistant']" dir="rtl">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-bold text-2xl text-[#181510]">בקשות ושריונות</h1>
          <p className="mt-1 text-[#8d785e] text-sm">
            ניהול בקשות זמינות ושריונות מפרויקטים
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 rounded-xl border border-[#e7e1da] bg-white p-1.5">
          {(["pending", "active", "history"] as const).map((tab) => (
            <button
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-sm transition-colors ${
                activeTab === tab
                  ? "bg-[#ff8c00] text-white"
                  : "text-[#8d785e] hover:bg-[#f5f3f0]"
              }`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {TAB_LABELS[tab]}
              {tabCounts[tab] > 0 && (
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-bold text-xs ${
                    activeTab === tab
                      ? "bg-white/20 text-white"
                      : "bg-[#f5f3f0] text-[#8d785e]"
                  }`}
                >
                  {tabCounts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {(requests === undefined || bookings === undefined) && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e7e1da] border-t-[#ff8c00]" />
          </div>
        )}

        {/* Pending tab */}
        {activeTab === "pending" && requests !== undefined && (
          <div className="flex flex-col gap-4">
            {pendingRequests.length === 0 ? (
              <EmptyState message="אין בקשות ממתינות" />
            ) : (
              pendingRequests.map((req) => (
                <RequestCard key={req.id} request={req} />
              ))
            )}
          </div>
        )}

        {/* Active bookings tab */}
        {activeTab === "active" && bookings !== undefined && (
          <div className="flex flex-col gap-4">
            {activeBookings.length === 0 ? (
              <EmptyState message="אין שריונות פעילים" />
            ) : (
              activeBookings.map((b) => <BookingCard booking={b} key={b.id} />)
            )}
          </div>
        )}

        {/* History tab */}
        {activeTab === "history" &&
          requests !== undefined &&
          bookings !== undefined && (
            <div className="flex flex-col gap-4">
              {historyRequests.length === 0 && historyBookings.length === 0 ? (
                <EmptyState message="אין היסטוריה להצגה" />
              ) : (
                <>
                  {historyRequests.map((req) => (
                    <RequestCard key={req.id} request={req} />
                  ))}
                  {historyBookings.map((b) => (
                    <BookingCard booking={b} key={b.id} />
                  ))}
                </>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
