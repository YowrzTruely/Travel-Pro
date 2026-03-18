import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, Check, Loader2, Send, X } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "ממתין", color: "#6b7280", bg: "#f3f4f6" },
  sent: { label: "נשלח", color: "#3b82f6", bg: "#eff6ff" },
  confirmed: { label: "אושר", color: "#22c55e", bg: "#f0fdf4" },
  completed: { label: "הושלם", color: "#22c55e", bg: "#f0fdf4" },
  cancelled: { label: "בוטל", color: "#ef4444", bg: "#fef2f2" },
};

export function ProjectOrders({ projectId }: { projectId: Id<"projects"> }) {
  const orders = useQuery(api.supplierOrders.listByProject, { projectId });
  const suppliers = useQuery(api.suppliers.list);

  const sendOrder = useMutation(api.supplierOrders.sendOrder);
  const confirmOrder = useMutation(api.supplierOrders.confirmOrder);
  const cancelOrder = useMutation(api.supplierOrders.cancelOrder);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [sendingAll, setSendingAll] = useState(false);

  const supplierMap = new Map((suppliers ?? []).map((s) => [s._id, s.name]));

  const pendingOrders = (orders ?? []).filter((o) => o.status === "pending");

  async function handleSend(id: Id<"supplierOrders">) {
    setLoadingId(id);
    try {
      await sendOrder({ id });
      appToast.success("ההזמנה נשלחה");
    } catch {
      appToast.error("שגיאה בשליחת ההזמנה");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleConfirm(id: Id<"supplierOrders">) {
    setLoadingId(id);
    try {
      await confirmOrder({ id });
      appToast.success("ההזמנה אושרה");
    } catch {
      appToast.error("שגיאה באישור ההזמנה");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCancel(id: Id<"supplierOrders">) {
    setLoadingId(id);
    try {
      await cancelOrder({ id });
      appToast.success("ההזמנה בוטלה");
    } catch {
      appToast.error("שגיאה בביטול ההזמנה");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleSendAll() {
    setSendingAll(true);
    try {
      for (const order of pendingOrders) {
        await sendOrder({ id: order._id });
      }
      appToast.success(`${pendingOrders.length} הזמנות נשלחו`);
    } catch {
      appToast.error("שגיאה בשליחת ההזמנות");
    } finally {
      setSendingAll(false);
    }
  }

  if (orders === undefined || suppliers === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-tertiary" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          className="flex items-center gap-2 text-[18px] text-foreground"
          style={{ fontWeight: 700 }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Send className="text-primary" size={15} />
          </div>
          הזמנות ספקים ({orders.length})
        </h2>
        {pendingOrders.length > 0 && (
          <button
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[13px] text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            disabled={sendingAll}
            onClick={handleSendAll}
            style={{ fontWeight: 600 }}
            type="button"
          >
            {sendingAll ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Send size={14} />
            )}
            שלח הכל ({pendingOrders.length})
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-12 text-center">
          <p className="text-[16px] text-muted-foreground">אין הזמנות עדיין</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusConfig[order.status] ?? statusConfig.pending;
            const isLoading = loadingId === order._id;

            return (
              <div
                className="rounded-xl border border-border bg-card p-4"
                key={order._id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[15px] text-foreground"
                        style={{ fontWeight: 600 }}
                      >
                        {supplierMap.get(order.supplierId) ?? "ספק לא ידוע"}
                      </span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[12px]"
                        style={{
                          fontWeight: 600,
                          color: status.color,
                          backgroundColor: status.bg,
                        }}
                      >
                        {status.label}
                      </span>
                      {order.usesCustomFormat && (
                        <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[12px] text-warning">
                          <AlertTriangle size={12} />
                          פורמט מותאם
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-[13px] text-muted-foreground">
                      <span>תאריך: {order.date}</span>
                      <span>משתתפים: {order.participants}</span>
                      <span style={{ fontWeight: 600, color: "#181510" }}>
                        ₪{order.agreedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <button
                        className="flex items-center gap-1 rounded-lg bg-info px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-info disabled:opacity-50"
                        disabled={isLoading}
                        onClick={() => handleSend(order._id)}
                        style={{ fontWeight: 600 }}
                        type="button"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" size={12} />
                        ) : (
                          <Send size={12} />
                        )}
                        שלח
                      </button>
                    )}
                    {order.status === "sent" && (
                      <button
                        className="flex items-center gap-1 rounded-lg bg-success px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-success disabled:opacity-50"
                        disabled={isLoading}
                        onClick={() => handleConfirm(order._id)}
                        style={{ fontWeight: 600 }}
                        type="button"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" size={12} />
                        ) : (
                          <Check size={12} />
                        )}
                        אשר
                      </button>
                    )}
                    {order.status !== "cancelled" &&
                      order.status !== "completed" && (
                        <button
                          className="flex items-center gap-1 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-1.5 text-[12px] text-destructive transition-colors hover:bg-[#fee2e2] disabled:opacity-50"
                          disabled={isLoading}
                          onClick={() => handleCancel(order._id)}
                          style={{ fontWeight: 600 }}
                          type="button"
                        >
                          {isLoading ? (
                            <Loader2 className="animate-spin" size={12} />
                          ) : (
                            <X size={12} />
                          )}
                          בטל
                        </button>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
