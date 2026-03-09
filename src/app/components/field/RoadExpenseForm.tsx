import { useMutation, useQuery } from "convex/react";
import { Camera, Loader2, Plus, Receipt } from "lucide-react";
import { useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";

interface RoadExpenseFormProps {
  fieldOperationId: Id<"fieldOperations">;
  onClose: () => void;
  projectId: Id<"projects">;
}

const CATEGORIES = [
  { value: "fuel", label: "דלק" },
  { value: "parking", label: "חניה" },
  { value: "toll", label: "אגרה" },
  { value: "food", label: "אוכל" },
  { value: "other", label: "אחר" },
] as const;

export function RoadExpenseForm({
  fieldOperationId,
  projectId,
  onClose,
}: RoadExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [uploading, setUploading] = useState(false);
  const [receiptFileId, setReceiptFileId] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const createExpense = useMutation(api.roadExpenses.create);
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const expenses = useQuery(api.roadExpenses.listByOperation, {
    fieldOperationId,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      setUploading(true);
      const url = await generateUploadUrl();
      const result = await fetch(url, {
        method: "POST",
        body: file,
        headers: { "Content-Type": file.type },
      });
      const { storageId } = await result.json();
      setReceiptFileId(storageId);
      appToast.success("הקבלה הועלתה");
    } catch (_err) {
      appToast.error("שגיאה", "לא ניתן להעלות את הקבלה");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!(description.trim() && amount)) {
      appToast.error("שגיאה", "יש למלא תיאור וסכום");
      return;
    }
    try {
      setSubmitting(true);
      await createExpense({
        fieldOperationId,
        projectId,
        description: description.trim(),
        amount: Number(amount),
        category,
        receiptFileId,
      });
      appToast.success("הוצאה נוספה");
      setDescription("");
      setAmount("");
      setCategory("other");
      setReceiptFileId(undefined);
    } catch (_err) {
      appToast.error("שגיאה", "לא ניתן להוסיף הוצאה");
    } finally {
      setSubmitting(false);
    }
  };

  const totalExpenses =
    expenses?.reduce((sum, exp) => sum + exp.amount, 0) ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-t-xl bg-white p-5 shadow-2xl sm:rounded-xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="text-[#ff8c00]" size={20} />
            <h3
              className="text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              הוצאות דרך
            </h3>
          </div>
          <button
            className="rounded-lg p-1.5 text-[#8d785e] transition-colors hover:bg-[#f5f3f0]"
            onClick={onClose}
            type="button"
          >
            <span className="text-[14px]">סגור</span>
          </button>
        </div>

        {/* Form */}
        <div className="mb-4 space-y-3">
          <div>
            <label
              className="mb-1 block text-[#181510] text-[13px]"
              htmlFor="expense-desc"
              style={{ fontWeight: 600 }}
            >
              תיאור
            </label>
            <input
              className="w-full rounded-lg border border-[#e7e1da] px-3 py-2 text-[14px] outline-none focus:border-[#ff8c00]"
              id="expense-desc"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="תיאור ההוצאה"
              type="text"
              value={description}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="mb-1 block text-[#181510] text-[13px]"
                htmlFor="expense-amount"
                style={{ fontWeight: 600 }}
              >
                סכום (₪)
              </label>
              <input
                className="w-full rounded-lg border border-[#e7e1da] px-3 py-2 text-[14px] outline-none focus:border-[#ff8c00]"
                id="expense-amount"
                inputMode="decimal"
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                type="number"
                value={amount}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-[#181510] text-[13px]"
                htmlFor="expense-category"
                style={{ fontWeight: 600 }}
              >
                קטגוריה
              </label>
              <select
                className="w-full rounded-lg border border-[#e7e1da] px-3 py-2 text-[14px] outline-none focus:border-[#ff8c00]"
                id="expense-category"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Receipt upload */}
          <div>
            <input
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
              ref={fileRef}
              type="file"
            />
            <button
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#e7e1da] border-dashed px-3 py-2 text-[#8d785e] text-[14px] transition-colors hover:border-[#ff8c00] hover:text-[#ff8c00] disabled:opacity-50"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              type="button"
            >
              {uploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Camera size={16} />
              )}
              {receiptFileId ? "קבלה הועלתה - החלף" : "צלם קבלה"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          className="mb-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ff8c00] px-4 py-2.5 text-[14px] text-white transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={submitting || !description.trim() || !amount}
          onClick={handleSubmit}
          style={{ fontWeight: 700 }}
          type="button"
        >
          {submitting ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Plus size={16} />
          )}
          הוסף הוצאה
        </button>

        {/* Existing expenses list */}
        {expenses && expenses.length > 0 && (
          <div className="border-[#e7e1da] border-t pt-3">
            <p
              className="mb-2 text-[#8d785e] text-[13px]"
              style={{ fontWeight: 600 }}
            >
              הוצאות שנוספו ({expenses.length})
            </p>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {expenses.map((exp) => (
                <div
                  className="flex items-center justify-between rounded-lg bg-[#faf9f7] px-3 py-2 text-[13px]"
                  key={exp.id}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#181510]">{exp.description}</span>
                    {exp.category && (
                      <span className="rounded-full bg-[#f5f3f0] px-2 py-0.5 text-[#8d785e] text-[11px]">
                        {CATEGORIES.find((c) => c.value === exp.category)
                          ?.label ?? exp.category}
                      </span>
                    )}
                  </div>
                  <span style={{ fontWeight: 600 }}>
                    ₪{exp.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between border-[#e7e1da] border-t pt-2 text-[14px]">
              <span style={{ fontWeight: 600 }}>סה"כ</span>
              <span className="text-[#ff8c00]" style={{ fontWeight: 700 }}>
                ₪{totalExpenses.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
