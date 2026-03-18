import { useMutation } from "convex/react";
import {
  Check,
  Clock,
  Hash,
  Loader2,
  PenTool,
  Play,
  Square,
} from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { SignaturePad } from "./SignaturePad";

interface StopData {
  _id: Id<"fieldOperationStops">;
  actualEndTime?: string;
  actualQuantity?: number;
  actualStartTime?: string;
  id: Id<"fieldOperationStops">;
  orderIndex: number;
  plannedEndTime: string;
  plannedQuantity: number;
  plannedStartTime: string;
  status: "upcoming" | "in_progress" | "completed" | "skipped";
  supplierName: string;
  supplierSignature?: string;
}

interface FieldStopProps {
  stop: StopData;
}

function timeDeltaMinutes(planned: string, actual: string): number {
  const [ph, pm] = planned.split(":").map(Number);
  const [ah, am] = actual.split(":").map(Number);
  return ah * 60 + am - (ph * 60 + pm);
}

function formatDelta(minutes: number): string {
  if (minutes === 0) {
    return "בזמן";
  }
  const abs = Math.abs(minutes);
  if (minutes > 0) {
    return `+${abs} דק' איחור`;
  }
  return `-${abs} דק' מוקדם`;
}

const statusConfig = {
  upcoming: {
    bg: "bg-accent",
    border: "border-border",
    badge: "bg-accent text-muted-foreground",
    label: "ממתין",
  },
  in_progress: {
    bg: "bg-primary/10",
    border: "border-primary",
    badge: "bg-primary text-white animate-pulse",
    label: "בביצוע",
  },
  completed: {
    bg: "bg-success/10",
    border: "border-success/40",
    badge: "bg-success/15 text-success",
    label: "הושלם",
  },
  skipped: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    badge: "bg-destructive/15 text-destructive",
    label: "דולג",
  },
};

export function FieldStop({ stop }: FieldStopProps) {
  const [showSignature, setShowSignature] = useState(false);
  const [quantityValue, setQuantityValue] = useState(
    stop.actualQuantity?.toString() ?? ""
  );
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);

  const startStopMut = useMutation(api.fieldOperationStops.startStop);
  const endStopMut = useMutation(api.fieldOperationStops.endStop);
  const updateQuantityMut = useMutation(api.fieldOperationStops.updateQuantity);

  const config = statusConfig[stop.status];

  const handleStart = async () => {
    try {
      setStarting(true);
      await startStopMut({ id: stop._id });
      appToast.success("העצירה התחילה");
    } catch (_err) {
      appToast.error("שגיאה", "לא ניתן להתחיל את העצירה");
    } finally {
      setStarting(false);
    }
  };

  const handleEnd = async () => {
    try {
      setEnding(true);
      await endStopMut({ id: stop._id });
      appToast.success("העצירה הסתיימה");
    } catch (_err) {
      appToast.error("שגיאה", "לא ניתן לסיים את העצירה");
    } finally {
      setEnding(false);
    }
  };

  const handleQuantityBlur = async () => {
    const num = Number(quantityValue);
    if (Number.isNaN(num) || num < 0) {
      return;
    }
    if (num === stop.actualQuantity) {
      return;
    }
    try {
      await updateQuantityMut({ id: stop._id, actualQuantity: num });
    } catch (_err) {
      appToast.error("שגיאה", "לא ניתן לעדכן כמות");
    }
  };

  const startDelta = stop.actualStartTime
    ? timeDeltaMinutes(stop.plannedStartTime, stop.actualStartTime)
    : null;
  const endDelta = stop.actualEndTime
    ? timeDeltaMinutes(stop.plannedEndTime, stop.actualEndTime)
    : null;

  return (
    <div
      className={`rounded-xl border-2 ${config.border} ${config.bg} p-4 transition-all ${stop.status === "skipped" ? "opacity-60" : ""}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-[12px] text-white">
            {stop.orderIndex + 1}
          </span>
          <span
            className="text-[16px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            {stop.supplierName}
          </span>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[12px] ${config.badge}`}
          style={{ fontWeight: 600 }}
        >
          {config.label}
        </span>
      </div>

      {/* Times */}
      <div className="mb-3 space-y-1">
        <div className="flex items-center gap-2 text-[14px]">
          <Clock className="text-muted-foreground" size={14} />
          <span className="text-muted-foreground">מתוכנן:</span>
          <span className="text-foreground" style={{ fontWeight: 600 }}>
            {stop.plannedStartTime} - {stop.plannedEndTime}
          </span>
        </div>
        {(stop.actualStartTime || stop.actualEndTime) && (
          <div className="flex items-center gap-2 text-[14px]">
            <Clock className="text-primary" size={14} />
            <span className="text-muted-foreground">בפועל:</span>
            <span className="text-foreground" style={{ fontWeight: 600 }}>
              {stop.actualStartTime ?? "--:--"} -{" "}
              {stop.actualEndTime ?? "--:--"}
            </span>
            {startDelta !== null && (
              <span
                className={`text-[12px] ${startDelta > 0 ? "text-destructive" : startDelta < 0 ? "text-success" : "text-muted-foreground"}`}
              >
                ({formatDelta(startDelta)})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quantity */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex items-center gap-1 text-[14px]">
          <Hash className="text-muted-foreground" size={14} />
          <span className="text-muted-foreground">מתוכנן:</span>
          <span style={{ fontWeight: 600 }}>{stop.plannedQuantity}</span>
        </div>
        {stop.status !== "upcoming" && (
          <div className="flex items-center gap-1">
            <span className="text-[14px] text-muted-foreground">בפועל:</span>
            <input
              className="w-20 rounded-lg border border-border px-2 py-1 text-center text-[14px] outline-none focus:border-primary"
              inputMode="numeric"
              onBlur={handleQuantityBlur}
              onChange={(e) => setQuantityValue(e.target.value)}
              placeholder="0"
              type="number"
              value={quantityValue}
            />
            {stop.actualQuantity !== undefined &&
              stop.actualQuantity !== stop.plannedQuantity && (
                <span
                  className={`text-[12px] ${stop.actualQuantity > stop.plannedQuantity ? "text-success" : "text-destructive"}`}
                >
                  ({stop.actualQuantity > stop.plannedQuantity ? "+" : ""}
                  {stop.actualQuantity - stop.plannedQuantity})
                </span>
              )}
          </div>
        )}
      </div>

      {/* Signature indicator */}
      {stop.supplierSignature && (
        <div className="mb-3 flex items-center gap-1 text-[13px] text-success">
          <Check size={14} />
          <span>חתימה נשמרה</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {stop.status === "upcoming" && (
          <button
            className="flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[14px] text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            disabled={starting}
            onClick={handleStart}
            style={{ fontWeight: 600 }}
            type="button"
          >
            {starting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Play size={16} />
            )}
            התחל
          </button>
        )}

        {stop.status === "in_progress" && (
          <button
            className="flex min-h-11 items-center gap-2 rounded-lg bg-success px-4 py-2 text-[14px] text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            disabled={ending}
            onClick={handleEnd}
            style={{ fontWeight: 600 }}
            type="button"
          >
            {ending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Square size={16} />
            )}
            סיים
          </button>
        )}

        {(stop.status === "in_progress" || stop.status === "completed") &&
          !stop.supplierSignature &&
          !showSignature && (
            <button
              className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 py-2 text-[14px] text-foreground transition-colors hover:bg-accent"
              onClick={() => setShowSignature(true)}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <PenTool size={16} />
              חתימה
            </button>
          )}
      </div>

      {/* Inline signature pad */}
      {showSignature && (
        <SignaturePad
          onCancel={() => setShowSignature(false)}
          onSaved={() => setShowSignature(false)}
          stopId={stop._id}
        />
      )}

      {/* End time delta */}
      {endDelta !== null && (
        <div className="mt-2 text-[12px]">
          <span className="text-muted-foreground">סיום: </span>
          <span
            className={
              endDelta > 0
                ? "text-destructive"
                : endDelta < 0
                  ? "text-success"
                  : "text-muted-foreground"
            }
          >
            {formatDelta(endDelta)}
          </span>
        </div>
      )}
    </div>
  );
}
