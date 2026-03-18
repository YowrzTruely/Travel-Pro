import { useMutation, useQuery } from "convex/react";
import {
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Search,
  Send,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { appToast } from "./AppToast";
import { useAuth } from "./AuthContext";

interface QuoteItem {
  _id: Id<"quoteItems">;
  availabilityStatus?: string;
  cost: number;
  name: string;
  supplier: string;
  supplierId?: Id<"suppliers">;
  type: string;
}

interface AvailabilityCheckPanelProps {
  date: string;
  items: QuoteItem[];
  participants: number;
  projectId: Id<"projects">;
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; icon: typeof Clock; label: string }
> = {
  not_checked: {
    label: "לא נבדק",
    color: "#8d785e",
    bg: "#f5f3f0",
    icon: Search,
  },
  pending: {
    label: "ממתין לתשובה",
    color: "#f59e0b",
    bg: "#fef3c7",
    icon: Clock,
  },
  approved: {
    label: "זמין ✅",
    color: "#16a34a",
    bg: "#dcfce7",
    icon: CheckCircle,
  },
  declined: {
    label: "לא זמין",
    color: "#ef4444",
    bg: "#fef2f2",
    icon: XCircle,
  },
  alternative_proposed: {
    label: "הציע חלופה",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    icon: MapPin,
  },
};

export function AvailabilityCheckPanel({
  projectId,
  items,
  participants,
  date,
}: AvailabilityCheckPanelProps) {
  const { profile } = useAuth();
  const createRequest = useMutation(api.availabilityRequests.create);
  const existingRequests = useQuery(api.availabilityRequests.listByProject, {
    projectId,
  });
  const [sendingItemId, setSendingItemId] = useState<string | null>(null);

  const itemsWithSupplier = items.filter((item) => item.supplierId);
  const itemsWithoutSupplier = items.filter((item) => !item.supplierId);

  // Map quoteItemId → latest request
  type RequestDoc = NonNullable<typeof existingRequests>[number];
  const requestByItem = new Map<string, RequestDoc>();
  if (existingRequests) {
    for (const req of existingRequests) {
      const existing = requestByItem.get(req.quoteItemId as string);
      if (!existing || req.requestedAt > existing.requestedAt) {
        requestByItem.set(req.quoteItemId as string, req);
      }
    }
  }

  const handleSendRequest = async (item: QuoteItem) => {
    if (!(profile?.id && item.supplierId)) {
      return;
    }
    try {
      setSendingItemId(item._id);
      await createRequest({
        quoteItemId: item._id,
        projectId,
        supplierId: item.supplierId,
        requestedBy: profile.id as Id<"users">,
        date: date || new Date().toISOString().split("T")[0],
        participants,
      });
      appToast.success("בקשת זמינות נשלחה", `${item.supplier} יקבל התראה`);
    } catch (err) {
      console.error("[AvailabilityCheck] Failed:", err);
      appToast.error("שגיאה", "לא ניתן לשלוח בקשת זמינות");
    } finally {
      setSendingItemId(null);
    }
  };

  return (
    <div className="space-y-5">
      <h2
        className="flex items-center gap-2 text-[18px] text-foreground"
        style={{ fontWeight: 700 }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-5/10">
          <Search className="text-chart-5" size={15} />
        </div>
        בדיקת זמינות ({itemsWithSupplier.length})
      </h2>

      {itemsWithSupplier.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-12 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <Search className="text-muted-foreground" size={22} />
            </div>
          </div>
          <p className="mb-2 text-[16px] text-muted-foreground">
            אין רכיבים עם ספק מקושר
          </p>
          <p className="text-[13px] text-tertiary">
            הוסף רכיבים ובחר ספק מהרשימה כדי לבדוק זמינות
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {itemsWithSupplier.map((item) => {
            const request = requestByItem.get(item._id as string);
            const status =
              request?.status || item.availabilityStatus || "not_checked";
            const config = STATUS_CONFIG[status] || STATUS_CONFIG.not_checked;
            const StatusIcon = config.icon;
            const isSending = sendingItemId === item._id;
            const hasPendingRequest = status === "pending";

            return (
              <div
                className="overflow-hidden rounded-xl border border-border bg-card"
                key={item._id}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                      <span className="text-[16px]">
                        {item.type === "תחבורה"
                          ? "🚌"
                          : item.type === "ארוחה"
                            ? "🍽️"
                            : item.type === "פעילות"
                              ? "🎯"
                              : item.type === "לינה"
                                ? "🏨"
                                : item.type === "בידור"
                                  ? "🎵"
                                  : "📦"}
                      </span>
                    </div>
                    <div>
                      <div
                        className="text-[14px] text-foreground"
                        style={{ fontWeight: 600 }}
                      >
                        {item.name || item.type}
                      </div>
                      <div className="text-[12px] text-muted-foreground">
                        {item.supplier} &bull; ₪{item.cost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px]"
                      style={{
                        backgroundColor: config.bg,
                        color: config.color,
                        fontWeight: 600,
                      }}
                    >
                      <StatusIcon size={13} />
                      {config.label}
                    </span>

                    {status === "not_checked" && (
                      <button
                        className="flex items-center gap-1.5 rounded-lg bg-chart-5 px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-chart-5/80 disabled:opacity-50"
                        disabled={isSending}
                        onClick={() => handleSendRequest(item)}
                        style={{ fontWeight: 600 }}
                        type="button"
                      >
                        {isSending ? (
                          <Loader2 className="animate-spin" size={13} />
                        ) : (
                          <Send size={13} />
                        )}
                        {isSending ? "שולח..." : "שלח בקשה"}
                      </button>
                    )}

                    {hasPendingRequest && (
                      <span className="text-[11px] text-tertiary">
                        נשלח{" "}
                        {request?.requestedAt
                          ? new Date(request.requestedAt).toLocaleDateString(
                              "he-IL"
                            )
                          : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Response details */}
                {request?.responseNotes && (
                  <div className="border-border border-t bg-background px-4 py-3">
                    <p className="text-[13px] text-muted-foreground">
                      <span style={{ fontWeight: 600 }}>תגובת הספק: </span>
                      {request.responseNotes}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Items without supplier */}
      {itemsWithoutSupplier.length > 0 && (
        <div className="rounded-xl border border-border border-dashed bg-background p-4">
          <p
            className="mb-2 text-[13px] text-muted-foreground"
            style={{ fontWeight: 600 }}
          >
            {itemsWithoutSupplier.length} רכיבים ללא ספק מקושר:
          </p>
          <div className="flex flex-wrap gap-2">
            {itemsWithoutSupplier.map((item) => (
              <span
                className="rounded-full border border-border bg-card px-3 py-1 text-[12px] text-muted-foreground"
                key={item._id}
              >
                {item.name || item.type}
                {item.supplier ? ` (${item.supplier})` : ""}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-tertiary">
            ערוך את הרכיב ובחר ספק מהרשימה כדי לאפשר בדיקת זמינות
          </p>
        </div>
      )}
    </div>
  );
}
