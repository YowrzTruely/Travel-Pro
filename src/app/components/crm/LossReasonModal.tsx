import { Loader2, X } from "lucide-react";
import { useState } from "react";

const LOSS_REASONS = [
  { value: "expensive", label: "יקר מדי" },
  { value: "competitor", label: "בחרו מתחרה" },
  { value: "disappeared", label: "נעלמו" },
  { value: "other", label: "אחר" },
] as const;

type LossReasonValue = (typeof LOSS_REASONS)[number]["value"];

interface LossReasonModalProps {
  leadName: string;
  onClose: () => void;
  onConfirm: (reason: LossReasonValue, notes?: string) => Promise<void>;
}

export function LossReasonModal({
  leadName,
  onClose,
  onConfirm,
}: LossReasonModalProps) {
  const [reason, setReason] = useState<LossReasonValue>("expensive");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    try {
      setSaving(true);
      await onConfirm(reason, notes.trim() || undefined);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-[20px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            סיבת הפסד
          </h2>
          <button
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-4 text-[14px] text-muted-foreground">
          למה הליד <strong>{leadName}</strong> נסגר כהפסד?
        </p>

        <div className="mb-4 space-y-2">
          {LOSS_REASONS.map((opt) => (
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                reason === opt.value
                  ? "border-destructive bg-destructive/10"
                  : "border-border hover:bg-accent"
              }`}
              key={opt.value}
            >
              <input
                checked={reason === opt.value}
                className="accent-destructive"
                name="lossReason"
                onChange={() => setReason(opt.value)}
                type="radio"
                value={opt.value}
              />
              <span className="text-[14px] text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>

        {reason === "other" && (
          <textarea
            className="mb-4 w-full resize-none rounded-lg border border-border px-3 py-2.5 text-[14px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            onChange={(e) => setNotes(e.target.value)}
            placeholder="פרט את הסיבה..."
            rows={3}
            value={notes}
          />
        )}

        <div className="flex gap-3">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-destructive py-2.5 text-white transition-colors hover:bg-destructive disabled:cursor-not-allowed disabled:opacity-50"
            disabled={saving}
            onClick={handleConfirm}
            style={{ fontWeight: 600 }}
            type="button"
          >
            {saving && <Loader2 className="animate-spin" size={16} />}
            {saving ? "שומר..." : "אישור"}
          </button>
          <button
            className="rounded-lg border border-border px-6 py-2.5 text-foreground transition-colors hover:bg-accent"
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
