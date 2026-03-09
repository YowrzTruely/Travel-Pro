import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, Check, FileUp, Loader2, Receipt } from "lucide-react";
import { useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";

const FILE_EXT_RE = /\.[^.]+$/;

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "ממתין", color: "#d97706", bg: "#fffbeb" },
  received: { label: "התקבל", color: "#3b82f6", bg: "#eff6ff" },
  verified: { label: "אומת", color: "#22c55e", bg: "#f0fdf4" },
};

export function InvoiceTracker({ projectId }: { projectId: Id<"projects"> }) {
  const invoices = useQuery(api.invoiceTracking.listByProject, { projectId });
  const checkResult = useQuery(api.invoiceTracking.checkAllReceived, {
    projectId,
  });
  const suppliers = useQuery(api.suppliers.list);

  const uploadInvoice = useMutation(api.invoiceTracking.uploadInvoice);
  const verifyInvoice = useMutation(api.invoiceTracking.verify);
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeInvoiceRef = useRef<Id<"invoiceTracking"> | null>(null);

  const supplierMap = new Map((suppliers ?? []).map((s) => [s._id, s.name]));

  async function handleUpload(invoiceId: Id<"invoiceTracking">, file: File) {
    setUploadingId(invoiceId);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      await uploadInvoice({
        id: invoiceId,
        invoiceNumber: file.name.replace(FILE_EXT_RE, ""),
        amount: 0,
        fileId: storageId,
      });
      appToast.success("החשבונית הועלתה בהצלחה");
    } catch {
      appToast.error("שגיאה בהעלאת החשבונית");
    } finally {
      setUploadingId(null);
    }
  }

  async function handleVerify(invoiceId: Id<"invoiceTracking">) {
    setLoadingId(invoiceId);
    try {
      await verifyInvoice({ id: invoiceId });
      appToast.success("החשבונית אומתה");
    } catch {
      appToast.error("שגיאה באימות החשבונית");
    } finally {
      setLoadingId(null);
    }
  }

  function triggerFileSelect(invoiceId: Id<"invoiceTracking">) {
    activeInvoiceRef.current = invoiceId;
    fileInputRef.current?.click();
  }

  function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && activeInvoiceRef.current) {
      handleUpload(activeInvoiceRef.current, file);
    }
    e.target.value = "";
  }

  if (invoices === undefined || suppliers === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#b8a990]" size={24} />
      </div>
    );
  }

  const received = (invoices ?? []).filter(
    (i) => i.status !== "pending"
  ).length;
  const total = invoices.length;

  return (
    <div className="space-y-4">
      <input
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="hidden"
        onChange={onFileSelected}
        ref={fileInputRef}
        type="file"
      />

      <div className="flex items-center justify-between">
        <h2
          className="flex items-center gap-2 text-[#181510] text-[18px]"
          style={{ fontWeight: 700 }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff8c00]/10">
            <Receipt className="text-[#ff8c00]" size={15} />
          </div>
          מעקב חשבוניות
        </h2>
        <span
          className="text-[#8d785e] text-[14px]"
          style={{ fontWeight: 600 }}
        >
          {received}/{total} חשבוניות התקבלו
        </span>
      </div>

      {checkResult && !checkResult.allReceived && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-700">
          <AlertTriangle size={16} />
          <span>לא ניתן להעביר לארכיון עד לקבלת כל החשבוניות</span>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="rounded-xl border border-[#e7e1da] bg-white py-12 text-center">
          <p className="text-[#8d785e] text-[16px]">אין חשבוניות למעקב</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => {
            const status = statusConfig[invoice.status] ?? statusConfig.pending;
            const isLoading = loadingId === invoice._id;
            const isUploading = uploadingId === invoice._id;

            return (
              <div
                className="flex items-center justify-between rounded-xl border border-[#e7e1da] bg-white p-4"
                key={invoice._id}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[12px]"
                    style={{
                      fontWeight: 600,
                      color: status.color,
                      backgroundColor: status.bg,
                    }}
                  >
                    {status.label}
                  </span>
                  <span
                    className="text-[#181510] text-[14px]"
                    style={{ fontWeight: 600 }}
                  >
                    {supplierMap.get(invoice.supplierId) ?? "ספק"}
                  </span>
                  {invoice.invoiceNumber && (
                    <span className="text-[#8d785e] text-[13px]">
                      #{invoice.invoiceNumber}
                    </span>
                  )}
                  {invoice.amount != null && invoice.amount > 0 && (
                    <span className="text-[#181510] text-[13px]">
                      ₪{invoice.amount.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {invoice.status === "pending" && (
                    <button
                      className="flex items-center gap-1 rounded-lg bg-[#3b82f6] px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-[#2563eb] disabled:opacity-50"
                      disabled={isUploading}
                      onClick={() => triggerFileSelect(invoice._id)}
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      {isUploading ? (
                        <Loader2 className="animate-spin" size={12} />
                      ) : (
                        <FileUp size={12} />
                      )}
                      העלה חשבונית
                    </button>
                  )}
                  {invoice.status === "received" && (
                    <button
                      className="flex items-center gap-1 rounded-lg bg-[#22c55e] px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-[#16a34a] disabled:opacity-50"
                      disabled={isLoading}
                      onClick={() => handleVerify(invoice._id)}
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" size={12} />
                      ) : (
                        <Check size={12} />
                      )}
                      אמת
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
