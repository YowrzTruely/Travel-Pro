import { useMutation } from "convex/react";
import { Loader2, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { appToast } from "./AppToast";

const REASONS = ["יקר", "לא מעניין", "תאריך", "אחר"] as const;

interface ClientQuoteChangeRequestProps {
  isOpen: boolean;
  items: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmitted: () => void;
  projectId: string;
}

interface ItemFeedback {
  checked: boolean;
  otherText: string;
  reason: string;
}

export function ClientQuoteChangeRequest({
  isOpen,
  projectId,
  items,
  onClose,
  onSubmitted,
}: ClientQuoteChangeRequestProps) {
  const [feedbacks, setFeedbacks] = useState<Record<string, ItemFeedback>>({});
  const [generalNotes, setGeneralNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requestChanges = useMutation(api.publicQuote.requestChanges);

  const updateFeedback = (id: string, partial: Partial<ItemFeedback>) => {
    setFeedbacks((prev) => ({
      ...prev,
      [id]: {
        checked: prev[id]?.checked ?? false,
        reason: prev[id]?.reason ?? "",
        otherText: prev[id]?.otherText ?? "",
        ...partial,
      },
    }));
  };

  const handleSubmit = async () => {
    const selected = Object.entries(feedbacks).filter(
      ([, fb]) => fb.checked && fb.reason
    );
    if (selected.length === 0 && !generalNotes.trim()) {
      appToast.warning("נא לבחור לפחות פריט אחד או להוסיף הערות");
      return;
    }

    try {
      setSubmitting(true);
      await requestChanges({
        projectId: projectId as Id<"projects">,
        items: selected.map(([id, fb]) => ({
          quoteItemId: id as Id<"quoteItems">,
          reason: fb.reason === "אחר" ? fb.otherText || "אחר" : fb.reason,
        })),
        generalNotes: generalNotes.trim() || undefined,
      });
      appToast.success("בקשת השינויים נשלחה", "המפיק יקבל את הבקשה שלך");
      onSubmitted();
    } catch (err) {
      console.error("[ClientQuoteChangeRequest] Submit failed:", err);
      appToast.error("שגיאה", "לא ניתן לשלוח את הבקשה");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

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
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
        dir="rtl"
        role="dialog"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ff8c00]/10">
              <MessageSquare className="text-[#ff8c00]" size={18} />
            </div>
            <h3
              className="text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              בקשת שינויים
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

        {/* Items */}
        <div className="mb-4 space-y-3">
          {items.map((item) => {
            const fb = feedbacks[item.id];
            return (
              <div
                className={`rounded-xl border p-3 transition-colors ${
                  fb?.checked
                    ? "border-[#ff8c00] bg-[#ff8c00]/5"
                    : "border-[#e7e1da]"
                }`}
                key={item.id}
              >
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    checked={fb?.checked ?? false}
                    className="h-4 w-4 accent-[#ff8c00]"
                    onChange={(e) =>
                      updateFeedback(item.id, { checked: e.target.checked })
                    }
                    type="checkbox"
                  />
                  <span
                    className="text-[#181510] text-[14px]"
                    style={{ fontWeight: 600 }}
                  >
                    {item.name}
                  </span>
                </label>

                {fb?.checked && (
                  <div className="mt-2 mr-6 space-y-1.5">
                    <div className="flex flex-wrap gap-2">
                      {REASONS.map((reason) => (
                        <label
                          className="flex cursor-pointer items-center gap-1.5"
                          key={reason}
                        >
                          <input
                            checked={fb.reason === reason}
                            className="h-3.5 w-3.5 accent-[#ff8c00]"
                            name={`reason-${item.id}`}
                            onChange={() => updateFeedback(item.id, { reason })}
                            type="radio"
                          />
                          <span className="text-[#8d785e] text-[12px]">
                            {reason}
                          </span>
                        </label>
                      ))}
                    </div>
                    {fb.reason === "אחר" && (
                      <input
                        className="w-full rounded-lg border border-[#e7e1da] px-2.5 py-1.5 text-[12px] outline-none transition-colors focus:border-[#ff8c00]"
                        onChange={(e) =>
                          updateFeedback(item.id, { otherText: e.target.value })
                        }
                        placeholder="פרט/י..."
                        type="text"
                        value={fb.otherText}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* General notes */}
        <div className="mb-5">
          <label
            className="mb-1 block text-[#181510] text-[13px]"
            htmlFor="cr-general-notes"
            style={{ fontWeight: 600 }}
          >
            הערות כלליות
          </label>
          <textarea
            className="w-full resize-none rounded-lg border border-[#e7e1da] px-3 py-2 text-[13px] outline-none transition-colors focus:border-[#ff8c00]"
            id="cr-general-notes"
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="הוסף/י הערות נוספות..."
            rows={3}
            value={generalNotes}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] px-4 py-2.5 text-[14px] text-white transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={submitting}
            onClick={handleSubmit}
            style={{ fontWeight: 700 }}
            type="button"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <MessageSquare size={16} />
            )}
            שלח בקשה
          </button>
          <button
            className="rounded-xl border border-[#e7e1da] px-4 py-2.5 text-[#8d785e] text-[14px] transition-colors hover:bg-[#f5f3f0]"
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
