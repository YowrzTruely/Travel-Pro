import { Check, X } from "lucide-react";

interface AlternativeProposalCardProps {
  onAccept: () => void;
  onReject: () => void;
  originalName: string;
  originalPrice: number;
  proposedDate?: string;
  proposedProductName?: string;
  responseNotes?: string;
}

export function AlternativeProposalCard({
  onAccept,
  onReject,
  originalName,
  originalPrice,
  proposedDate,
  proposedProductName,
  responseNotes,
}: AlternativeProposalCardProps) {
  return (
    <div
      className="rounded-xl border border-amber-300 bg-amber-50 p-4 font-['Assistant']"
      dir="rtl"
    >
      {/* Header badge */}
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-md bg-amber-500 px-2.5 py-1 font-bold text-white text-xs">
          ספק הציע חלופה
        </span>
      </div>

      {/* Comparison */}
      <div className="mb-3 flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 text-[#8d785e]">
          <span className="font-semibold text-[#181510]">מקורי:</span>
          <span>{originalName}</span>
          <span className="mr-auto font-semibold text-[#181510]">
            {originalPrice.toLocaleString("he-IL")} ₪
          </span>
        </div>

        {proposedProductName && (
          <div className="flex items-center gap-2 text-[#8d785e]">
            <span className="font-semibold text-amber-700">חלופה:</span>
            <span>{proposedProductName}</span>
          </div>
        )}

        {proposedDate && (
          <div className="flex items-center gap-2 text-[#8d785e]">
            <span className="font-semibold text-amber-700">תאריך מוצע:</span>
            <span>{proposedDate}</span>
          </div>
        )}

        {responseNotes && (
          <div className="mt-1 rounded-lg bg-white/60 p-2.5 text-[#8d785e] text-sm">
            {responseNotes}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 font-semibold text-white text-xs transition-colors hover:bg-green-700"
          onClick={onAccept}
          type="button"
        >
          <Check size={14} />
          קבל חלופה
        </button>
        <button
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white text-xs transition-colors hover:bg-red-700"
          onClick={onReject}
          type="button"
        >
          <X size={14} />
          דחה
        </button>
      </div>
    </div>
  );
}
