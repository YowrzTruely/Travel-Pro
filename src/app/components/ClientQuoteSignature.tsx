import { useMutation } from "convex/react";
import { Check, Eraser, Loader2, PenTool, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";

interface ClientQuoteSignatureProps {
  isOpen: boolean;
  onClose: () => void;
  onSigned: () => void;
  projectId: string;
}

export function ClientQuoteSignature({
  isOpen,
  projectId,
  onClose,
  onSigned,
}: ClientQuoteSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [signerRole, setSignerRole] = useState("");
  const [signerCompany, setSignerCompany] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const saveSignature = useMutation(api.publicQuote.saveSignature);

  const getCanvasCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }
    ctx.strokeStyle = "#181510";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    return ctx;
  }, []);

  const getPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const ctx = getCanvasCtx();
    if (!ctx) {
      return;
    }
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) {
      return;
    }
    const ctx = getCanvasCtx();
    if (!ctx) {
      return;
    }
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSubmit = async () => {
    if (!(signerName.trim() && agreed && hasDrawn)) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    try {
      setSubmitting(true);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) {
        appToast.error("שגיאה", "לא ניתן ליצור תמונת חתימה");
        return;
      }

      const url = await generateUploadUrl();
      const result = await fetch(url, {
        method: "POST",
        body: blob,
        headers: { "Content-Type": "image/png" },
      });
      const { storageId } = await result.json();

      await saveSignature({
        projectId,
        signatureStorageId: storageId,
        signerName: signerName.trim(),
        signerRole: signerRole.trim() || undefined,
        signerCompany: signerCompany.trim() || undefined,
      });

      appToast.success("החתימה נשמרה", "ההצעה אושרה בהצלחה");
      onSigned();
    } catch (err) {
      console.error("[ClientQuoteSignature] Submit failed:", err);
      appToast.error("שגיאה", "לא ניתן לשמור את החתימה");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const canSubmit = signerName.trim() && agreed && hasDrawn && !submitting;

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
        className="w-full max-w-lg rounded-xl bg-card p-6 shadow-2xl"
        dir="rtl"
        role="dialog"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <PenTool className="text-primary" size={18} />
            </div>
            <h3
              className="text-[18px] text-foreground"
              style={{ fontWeight: 700 }}
            >
              חתימה דיגיטלית
            </h3>
          </div>
          <button
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form fields */}
        <div className="mb-4 space-y-3">
          <div>
            <label
              className="mb-1 block text-[13px] text-foreground"
              htmlFor="sig-name"
              style={{ fontWeight: 600 }}
            >
              שם מלא *
            </label>
            <input
              className="w-full rounded-lg border border-border px-3 py-2 text-[14px] outline-none transition-colors focus:border-primary"
              id="sig-name"
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="שם מלא"
              type="text"
              value={signerName}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="mb-1 block text-[13px] text-foreground"
                htmlFor="sig-role"
                style={{ fontWeight: 600 }}
              >
                תפקיד
              </label>
              <input
                className="w-full rounded-lg border border-border px-3 py-2 text-[14px] outline-none transition-colors focus:border-primary"
                id="sig-role"
                onChange={(e) => setSignerRole(e.target.value)}
                placeholder="תפקיד"
                type="text"
                value={signerRole}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-[13px] text-foreground"
                htmlFor="sig-company"
                style={{ fontWeight: 600 }}
              >
                חברה
              </label>
              <input
                className="w-full rounded-lg border border-border px-3 py-2 text-[14px] outline-none transition-colors focus:border-primary"
                id="sig-company"
                onChange={(e) => setSignerCompany(e.target.value)}
                placeholder="שם חברה"
                type="text"
                value={signerCompany}
              />
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span
              className="text-[13px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              חתימה *
            </span>
            <button
              className="flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-primary"
              onClick={clearCanvas}
              type="button"
            >
              <Eraser size={12} />
              נקה
            </button>
          </div>
          <canvas
            className="w-full cursor-crosshair rounded-lg border-2 border-border border-dashed bg-surface"
            height={160}
            onMouseDown={startDrawing}
            onMouseLeave={stopDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            onTouchStart={startDrawing}
            ref={canvasRef}
            width={460}
          />
          {!hasDrawn && (
            <p className="mt-1 text-center text-[11px] text-muted-foreground">
              חתמ/י כאן באמצעות העכבר או מסך מגע
            </p>
          )}
        </div>

        {/* Checkbox */}
        <label className="mb-5 flex cursor-pointer items-start gap-2">
          <input
            checked={agreed}
            className="mt-0.5 h-4 w-4 accent-primary"
            onChange={(e) => setAgreed(e.target.checked)}
            type="checkbox"
          />
          <span className="text-[13px] text-foreground">
            אני מאשר/ת את ההצעה על כל תנאיה
          </span>
        </label>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[14px] text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
            onClick={handleSubmit}
            style={{ fontWeight: 700 }}
            type="button"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Check size={16} />
            )}
            אישור וחתימה
          </button>
          <button
            className="rounded-xl border border-border px-4 py-2.5 text-[14px] text-muted-foreground transition-colors hover:bg-accent"
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
