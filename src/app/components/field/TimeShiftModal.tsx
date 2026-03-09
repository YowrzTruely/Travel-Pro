import { useMutation } from "convex/react";
import { Clock, Loader2, X } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";

interface StopPreview {
  orderIndex: number;
  plannedEndTime: string;
  plannedStartTime: string;
  supplierName: string;
}

interface TimeShiftModalProps {
  fieldOperationId: Id<"fieldOperations">;
  onClose: () => void;
  stops: StopPreview[];
}

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const newH = Math.floor((((totalMinutes % 1440) + 1440) % 1440) / 60);
  const newM = ((totalMinutes % 60) + 60) % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

export function TimeShiftModal({
  fieldOperationId,
  stops,
  onClose,
}: TimeShiftModalProps) {
  const [minutesShift, setMinutesShift] = useState(0);
  const [fromIndex, setFromIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const shiftTimesMut = useMutation(api.fieldOperationStops.shiftTimes);

  const affectedStops = stops.filter((s) => s.orderIndex >= fromIndex);
  const previewStops = affectedStops.map((s) => ({
    ...s,
    newStart: addMinutesToTime(s.plannedStartTime, minutesShift),
    newEnd: addMinutesToTime(s.plannedEndTime, minutesShift),
  }));

  const handleSubmit = async () => {
    if (minutesShift === 0) {
      return;
    }
    try {
      setSubmitting(true);
      await shiftTimesMut({
        fieldOperationId,
        minutesShift,
        fromOrderIndex: fromIndex,
      });
      appToast.success("לוח הזמנים עודכן");
      onClose();
    } catch (_err) {
      appToast.error("שגיאה", "לא ניתן לעדכן את לוח הזמנים");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"
        dir="rtl"
        role="dialog"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="text-[#ff8c00]" size={20} />
            <h3
              className="text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              הזזת לוח זמנים
            </h3>
          </div>
          <button
            className="rounded-lg p-1.5 text-[#8d785e] transition-colors hover:bg-[#f5f3f0]"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Inputs */}
        <div className="mb-4 space-y-3">
          <div>
            <label
              className="mb-1 block text-[#181510] text-[13px]"
              htmlFor="shift-minutes"
              style={{ fontWeight: 600 }}
            >
              דקות להזזה (חיובי = עיכוב, שלילי = הקדמה)
            </label>
            <input
              className="w-full rounded-lg border border-[#e7e1da] px-3 py-2 text-[14px] outline-none focus:border-[#ff8c00]"
              id="shift-minutes"
              inputMode="numeric"
              onChange={(e) => setMinutesShift(Number(e.target.value) || 0)}
              type="number"
              value={minutesShift}
            />
          </div>
          <div>
            <label
              className="mb-1 block text-[#181510] text-[13px]"
              htmlFor="from-stop"
              style={{ fontWeight: 600 }}
            >
              מעצירה מספר
            </label>
            <select
              className="w-full rounded-lg border border-[#e7e1da] px-3 py-2 text-[14px] outline-none focus:border-[#ff8c00]"
              id="from-stop"
              onChange={(e) => setFromIndex(Number(e.target.value))}
              value={fromIndex}
            >
              {stops.map((s) => (
                <option key={s.orderIndex} value={s.orderIndex}>
                  {s.orderIndex + 1} - {s.supplierName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview */}
        {minutesShift !== 0 && previewStops.length > 0 && (
          <div className="mb-4 rounded-lg border border-[#e7e1da] bg-[#faf9f7] p-3">
            <p
              className="mb-2 text-[#8d785e] text-[13px]"
              style={{ fontWeight: 600 }}
            >
              תצוגה מקדימה ({previewStops.length} עצירות)
            </p>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {previewStops.map((s) => (
                <div
                  className="flex items-center justify-between text-[13px]"
                  key={s.orderIndex}
                >
                  <span className="text-[#181510]">
                    {s.orderIndex + 1}. {s.supplierName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#8d785e] line-through">
                      {s.plannedStartTime}-{s.plannedEndTime}
                    </span>
                    <span
                      className="text-[#ff8c00]"
                      style={{ fontWeight: 600 }}
                    >
                      {s.newStart}-{s.newEnd}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] px-4 py-2.5 text-[14px] text-white transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={minutesShift === 0 || submitting}
            onClick={handleSubmit}
            style={{ fontWeight: 700 }}
            type="button"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Clock size={16} />
            )}
            עדכן זמנים
          </button>
          <button
            className="min-h-11 rounded-xl border border-[#e7e1da] px-4 py-2.5 text-[#8d785e] text-[14px] transition-colors hover:bg-[#f5f3f0]"
            onClick={onClose}
            type="button"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}
