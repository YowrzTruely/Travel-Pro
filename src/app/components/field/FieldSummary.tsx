import { useQuery } from "convex/react";
import { Check, Clock, Hash, Receipt, X } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

interface FieldSummaryProps {
  completedAt?: number;
  fieldOperationId: Id<"fieldOperations">;
  startedAt?: number;
}

function timeDeltaMinutes(planned: string, actual: string): number {
  const [ph, pm] = planned.split(":").map(Number);
  const [ah, am] = actual.split(":").map(Number);
  return ah * 60 + am - (ph * 60 + pm);
}

function deltaColor(minutes: number): string {
  const abs = Math.abs(minutes);
  if (abs <= 0) {
    return "text-green-600";
  }
  if (abs <= 15) {
    return "text-yellow-600";
  }
  return "text-red-600";
}

function formatDuration(ms: number): string {
  const totalMinutes = Math.round(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes} דקות`;
  }
  return `${hours} שעות ${minutes > 0 ? `ו-${minutes} דקות` : ""}`;
}

export function FieldSummary({
  fieldOperationId,
  startedAt,
  completedAt,
}: FieldSummaryProps) {
  const stops = useQuery(api.fieldOperationStops.listByOperation, {
    fieldOperationId,
  });
  const expenses = useQuery(api.roadExpenses.listByOperation, {
    fieldOperationId,
  });

  if (!stops) {
    return null;
  }

  const totalExpenses =
    expenses?.reduce((sum, exp) => sum + exp.amount, 0) ?? 0;
  const stopsWithSignatures = stops.filter((s) => s.supplierSignature);
  const duration =
    startedAt && completedAt ? completedAt - startedAt : undefined;

  return (
    <div className="rounded-xl border-2 border-green-300 bg-green-50 p-4">
      <h3
        className="mb-4 text-[#181510] text-[18px]"
        style={{ fontWeight: 700 }}
      >
        סיכום יום שטח
      </h3>

      {/* Duration */}
      {duration !== undefined && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-white p-3 text-[14px]">
          <Clock className="text-[#ff8c00]" size={16} />
          <span className="text-[#8d785e]">משך כולל:</span>
          <span className="text-[#181510]" style={{ fontWeight: 600 }}>
            {formatDuration(duration)}
          </span>
        </div>
      )}

      {/* Stops table */}
      <div className="mb-4 space-y-2">
        <p className="text-[#181510] text-[14px]" style={{ fontWeight: 600 }}>
          עצירות
        </p>
        {stops.map((stop) => {
          const startDelta = stop.actualStartTime
            ? timeDeltaMinutes(stop.plannedStartTime, stop.actualStartTime)
            : null;
          const endDelta = stop.actualEndTime
            ? timeDeltaMinutes(stop.plannedEndTime, stop.actualEndTime)
            : null;

          return (
            <div className="rounded-lg bg-white p-3" key={stop.id}>
              <div className="mb-1 flex items-center justify-between">
                <span
                  className="text-[#181510] text-[14px]"
                  style={{ fontWeight: 600 }}
                >
                  {stop.orderIndex + 1}. {stop.supplierName}
                </span>
                {stop.supplierSignature ? (
                  <span className="flex items-center gap-1 text-[12px] text-green-600">
                    <Check size={12} />
                    חתימה
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[12px] text-red-500">
                    <X size={12} />
                    ללא חתימה
                  </span>
                )}
              </div>

              {/* Times */}
              <div className="mb-1 flex items-center gap-3 text-[13px]">
                <Clock className="text-[#8d785e]" size={12} />
                <span className="text-[#8d785e]">
                  מתוכנן: {stop.plannedStartTime}-{stop.plannedEndTime}
                </span>
                {stop.actualStartTime && (
                  <span>
                    <span className="text-[#8d785e]">בפועל: </span>
                    <span
                      className={
                        startDelta !== null ? deltaColor(startDelta) : ""
                      }
                      style={{ fontWeight: 600 }}
                    >
                      {stop.actualStartTime}
                    </span>
                    -
                    <span
                      className={endDelta !== null ? deltaColor(endDelta) : ""}
                      style={{ fontWeight: 600 }}
                    >
                      {stop.actualEndTime ?? "--:--"}
                    </span>
                    {startDelta !== null && startDelta !== 0 && (
                      <span className={`mr-1 ${deltaColor(startDelta)}`}>
                        ({startDelta > 0 ? "+" : ""}
                        {startDelta}')
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 text-[13px]">
                <Hash className="text-[#8d785e]" size={12} />
                <span className="text-[#8d785e]">
                  מתוכנן: {stop.plannedQuantity}
                </span>
                {stop.actualQuantity !== undefined && (
                  <span>
                    <span className="text-[#8d785e]">בפועל: </span>
                    <span
                      className={
                        stop.actualQuantity !== stop.plannedQuantity
                          ? stop.actualQuantity > stop.plannedQuantity
                            ? "text-green-600"
                            : "text-red-600"
                          : "text-green-600"
                      }
                      style={{ fontWeight: 600 }}
                    >
                      {stop.actualQuantity}
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Signatures summary */}
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-white p-3 text-[14px]">
        <Check className="text-green-600" size={16} />
        <span className="text-[#8d785e]">חתימות:</span>
        <span className="text-[#181510]" style={{ fontWeight: 600 }}>
          {stopsWithSignatures.length}/{stops.length}
        </span>
      </div>

      {/* Total expenses */}
      <div className="flex items-center gap-2 rounded-lg bg-white p-3 text-[14px]">
        <Receipt className="text-[#ff8c00]" size={16} />
        <span className="text-[#8d785e]">סה"כ הוצאות:</span>
        <span className="text-[#ff8c00]" style={{ fontWeight: 700 }}>
          ₪{totalExpenses.toLocaleString()}
        </span>
        {expenses && (
          <span className="text-[#8d785e] text-[12px]">
            ({expenses.length} פריטים)
          </span>
        )}
      </div>
    </div>
  );
}
