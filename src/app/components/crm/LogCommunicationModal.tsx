import { useMutation } from "convex/react";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";

const COMM_TYPES = [
  { value: "call", label: "שיחה" },
  { value: "whatsapp", label: "וואטסאפ" },
  { value: "email", label: "אימייל" },
  { value: "sms", label: "SMS" },
  { value: "note", label: "הערה" },
] as const;

type CommType = (typeof COMM_TYPES)[number]["value"];

interface LogCommunicationModalProps {
  leadId: string;
  onClose: () => void;
}

export function LogCommunicationModal({
  leadId,
  onClose,
}: LogCommunicationModalProps) {
  const createComm = useMutation(api.leadCommunications.create);
  const [commType, setCommType] = useState<CommType>("call");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      return;
    }
    try {
      setSaving(true);
      await createComm({
        leadId: leadId as Id<"leads">,
        type: commType,
        content: content.trim(),
        duration: duration ? Number.parseInt(duration, 10) : undefined,
      });
      appToast.success("תקשורת נוספה", "הרשומה נשמרה בהצלחה");
      onClose();
    } catch (err) {
      console.error("[LogCommunicationModal] Failed:", err);
      appToast.error("שגיאה בשמירה", String(err));
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
            הוסף תקשורת
          </h2>
          <button
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 space-y-4">
          {/* Type selector */}
          <div>
            <span
              className="mb-1 block text-[13px] text-muted-foreground"
              style={{ fontWeight: 600 }}
            >
              סוג
            </span>
            <div className="flex flex-wrap gap-2">
              {COMM_TYPES.map((t) => (
                <button
                  className={`rounded-lg border px-3 py-1.5 text-[13px] transition-colors ${
                    commType === t.value
                      ? "border-primary bg-[rgba(255,140,0,0.1)] text-primary"
                      : "border-border text-foreground hover:bg-accent"
                  }`}
                  key={t.value}
                  onClick={() => setCommType(t.value)}
                  style={{ fontWeight: commType === t.value ? 600 : 400 }}
                  type="button"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label
              className="mb-1 block text-[13px] text-muted-foreground"
              htmlFor="comm-content"
              style={{ fontWeight: 600 }}
            >
              תוכן
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-border px-3 py-2.5 text-[14px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              id="comm-content"
              onChange={(e) => setContent(e.target.value)}
              placeholder="תאר את התקשורת..."
              rows={4}
              value={content}
            />
          </div>

          {/* Duration (only for calls) */}
          {commType === "call" && (
            <div>
              <label
                className="mb-1 block text-[13px] text-muted-foreground"
                htmlFor="comm-duration"
                style={{ fontWeight: 600 }}
              >
                משך (דקות)
              </label>
              <input
                className="w-full rounded-lg border border-border px-3 py-2.5 text-[14px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                id="comm-duration"
                onChange={(e) => setDuration(e.target.value)}
                placeholder="5"
                type="number"
                value={duration}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            disabled={saving || !content.trim()}
            onClick={handleSubmit}
            style={{ fontWeight: 600 }}
            type="button"
          >
            {saving && <Loader2 className="animate-spin" size={16} />}
            {saving ? "שומר..." : "שמור"}
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
