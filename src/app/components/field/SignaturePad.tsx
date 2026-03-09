import { useMutation } from "convex/react";
import { Eraser, Loader2, Save } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";

interface SignaturePadProps {
  onCancel: () => void;
  onSaved: () => void;
  stopId: Id<"fieldOperationStops">;
}

export function SignaturePad({ stopId, onSaved, onCancel }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const saveSignatureMutation = useMutation(
    api.fieldOperationStops.saveSignature
  );

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
    e.preventDefault();
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
    e.preventDefault();
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

  const handleSave = async () => {
    if (!hasDrawn) {
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

      await saveSignatureMutation({
        id: stopId,
        supplierSignature: storageId,
      });

      appToast.success("החתימה נשמרה");
      onSaved();
    } catch (_err) {
      appToast.error("שגיאה", "לא ניתן לשמור את החתימה");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-[#e7e1da] bg-[#faf9f7] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span
          className="text-[#181510] text-[13px]"
          style={{ fontWeight: 600 }}
        >
          חתימת ספק
        </span>
        <button
          className="flex items-center gap-1 text-[#8d785e] text-[12px] transition-colors hover:text-[#ff8c00]"
          onClick={clearCanvas}
          type="button"
        >
          <Eraser size={12} />
          נקה
        </button>
      </div>
      <canvas
        className="w-full cursor-crosshair touch-none rounded-lg border-2 border-[#e7e1da] border-dashed bg-white"
        height={120}
        onMouseDown={startDrawing}
        onMouseLeave={stopDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        onTouchStart={startDrawing}
        ref={canvasRef}
        width={300}
      />
      <div className="mt-2 flex gap-2">
        <button
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#ff8c00] px-3 py-2 text-[14px] text-white transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasDrawn || submitting}
          onClick={handleSave}
          style={{ fontWeight: 600 }}
          type="button"
        >
          {submitting ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}
          שמור חתימה
        </button>
        <button
          className="min-h-11 rounded-lg border border-[#e7e1da] px-3 py-2 text-[#8d785e] text-[14px] transition-colors hover:bg-[#f5f3f0]"
          onClick={onCancel}
          type="button"
        >
          ביטול
        </button>
      </div>
    </div>
  );
}
