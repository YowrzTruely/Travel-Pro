import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Loader2,
  ShieldCheck,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useAuth } from "../AuthContext";
import { useImageUpload } from "../hooks/useImageUpload";
import { FeatureGate } from "./FeatureGate";

const DOCUMENT_TYPES = [
  {
    key: "third_party_insurance",
    label: "ביטוח צד ג'",
    mandatory: true,
    postDeal: true,
  },
  {
    key: "employer_insurance",
    label: "ביטוח חבות מעבידים",
    mandatory: true,
    postDeal: true,
  },
  {
    key: "business_license",
    label: "רישיון עסק",
    mandatory: false,
    recommended: true,
  },
  {
    key: "kosher_cert",
    label: "תעודת כשרות",
    categoryRequired: "food",
  },
] as const;

type DocumentTypeKey = (typeof DOCUMENT_TYPES)[number]["key"];

function getStatusColor(
  status: string | undefined,
  expiry: string | undefined
): { color: string; label: string; icon: typeof CheckCircle } {
  if (!status || status === "expired") {
    return { color: "text-red-500", label: "פג תוקף", icon: XCircle };
  }

  if (expiry) {
    const expiryDate = new Date(expiry);
    const now = new Date();
    const diffDays =
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      return { color: "text-red-500", label: "פג תוקף", icon: XCircle };
    }
    if (diffDays <= 30) {
      return {
        color: "text-yellow-500",
        label: `${Math.ceil(diffDays)} ימים`,
        icon: AlertTriangle,
      };
    }
    return { color: "text-green-500", label: "בתוקף", icon: CheckCircle };
  }

  if (status === "valid") {
    return { color: "text-green-500", label: "בתוקף", icon: CheckCircle };
  }
  if (status === "warning") {
    return {
      color: "text-yellow-500",
      label: "עומד לפוג",
      icon: AlertTriangle,
    };
  }

  return { color: "text-gray-400", label: "חסר", icon: Clock };
}

export function MyDocuments() {
  const { profile } = useAuth();
  const supplierId = profile?.supplierId as Id<"suppliers"> | undefined;

  const documents = useQuery(
    api.supplierDocuments.listBySupplierId,
    supplierId ? { supplierId } : "skip"
  );
  const supplier = useQuery(
    api.suppliers.get,
    supplierId ? { id: supplierId } : "skip"
  );
  const compliance = useQuery(
    api.supplierDocuments.checkInsuranceCompliance,
    supplierId ? { supplierId } : "skip"
  );

  const createDoc = useMutation(api.supplierDocuments.create);
  const updateDoc = useMutation(api.supplierDocuments.update);
  const removeDoc = useMutation(api.supplierDocuments.remove);
  const markMissing = useMutation(
    api.supplierDocuments.markAcknowledgedMissing
  );

  const { upload } = useImageUpload();

  const [uploading, setUploading] = useState<string | null>(null);
  const [editingExpiry, setEditingExpiry] = useState<string | null>(null);
  const [expiryValue, setExpiryValue] = useState("");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!supplierId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <p className="text-[#8d785e]">לא נמצא ספק מקושר לחשבון שלך</p>
      </div>
    );
  }

  if (documents === undefined || supplier === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <Loader2 className="h-6 w-6 animate-spin text-[#ff8c00]" />
      </div>
    );
  }

  // Determine if supplier category includes food (for kosher cert)
  const categories = supplier?.category
    ? supplier.category.split(",").map((c: string) => c.trim().toLowerCase())
    : [];
  const isFoodCategory =
    categories.includes("מזון") || categories.includes("food");

  // Filter document types based on category
  const visibleDocTypes = DOCUMENT_TYPES.filter((dt) => {
    if ("categoryRequired" in dt && dt.categoryRequired === "food") {
      return isFoodCategory;
    }
    return true;
  });

  // Map existing docs by documentType
  const docsByType: Record<string, (typeof documents)[number]> = {};
  for (const doc of documents ?? []) {
    if (doc.documentType) {
      docsByType[doc.documentType] = doc;
    }
  }

  const handleUpload = async (docTypeKey: DocumentTypeKey, _label: string) => {
    const input = fileInputRefs.current[docTypeKey];
    if (!input) {
      return;
    }
    input.click();
  };

  const handleFileSelected = async (
    docTypeKey: DocumentTypeKey,
    label: string,
    file: File
  ) => {
    setUploading(docTypeKey);
    try {
      const storageId = await upload(file);
      const existingDoc = docsByType[docTypeKey];

      if (existingDoc) {
        await updateDoc({
          id: existingDoc.id,
          storageId,
          fileName: file.name,
          status: "valid",
          acknowledged: false,
        });
      } else {
        await createDoc({
          supplierId,
          name: label,
          documentType: docTypeKey,
          storageId,
          fileName: file.name,
          status: "valid",
        });
      }
      appToast.success("המסמך הועלה בהצלחה");
    } catch (err) {
      console.error("Upload failed:", err);
      appToast.error("שגיאה בהעלאת המסמך");
    } finally {
      setUploading(null);
    }
  };

  const handleMarkMissing = async (
    docTypeKey: DocumentTypeKey,
    label: string
  ) => {
    try {
      await markMissing({
        supplierId,
        documentType: docTypeKey,
        name: label,
      });
      appToast.success("סומן כלא רלוונטי");
    } catch (err) {
      console.error("Mark missing failed:", err);
      appToast.error("שגיאה בעדכון");
    }
  };

  const handleDeleteDoc = async (docId: Id<"supplierDocuments">) => {
    try {
      await removeDoc({ id: docId });
      appToast.success("המסמך נמחק");
    } catch (err) {
      console.error("Delete failed:", err);
      appToast.error("שגיאה במחיקת המסמך");
    }
  };

  const handleSaveExpiry = async (docId: Id<"supplierDocuments">) => {
    try {
      const now = new Date();
      const expiryDate = new Date(expiryValue);
      const diffDays =
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      let status: "valid" | "warning" | "expired" = "valid";
      if (diffDays < 0) {
        status = "expired";
      } else if (diffDays <= 30) {
        status = "warning";
      }

      await updateDoc({ id: docId, expiry: expiryValue, status });
      setEditingExpiry(null);
      appToast.success("תאריך התוקף עודכן");
    } catch (err) {
      console.error("Save expiry failed:", err);
      appToast.error("שגיאה בעדכון תאריך");
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-[#181510] text-[22px]"
            style={{ fontWeight: 700 }}
          >
            המסמכים שלי
          </h1>
          <p className="mt-1 text-[#8d785e] text-[13px]">
            ניהול מסמכים, ביטוחים ותקינות
          </p>
        </div>
        {compliance && (
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${
              compliance.compliant
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {compliance.compliant ? (
              <ShieldCheck size={16} />
            ) : (
              <AlertTriangle size={16} />
            )}
            <span className="text-[12px]" style={{ fontWeight: 600 }}>
              {compliance.compliant ? "עומד בתקינות" : "לא עומד בתקינות"}
            </span>
          </div>
        )}
      </div>

      {/* Document checklist */}
      <FeatureGate featureName="ניהול מסמכים ותקינות" requiredStage="stage3">
        <div className="space-y-3">
          {visibleDocTypes.map((docType) => {
            const existingDoc = docsByType[docType.key];
            const hasFile = existingDoc?.storageId;
            const isAcknowledged = existingDoc?.acknowledged && !hasFile;
            const statusInfo = hasFile
              ? getStatusColor(existingDoc?.status, existingDoc?.expiry)
              : isAcknowledged
                ? {
                    color: "text-gray-400",
                    label: 'סומן "אין לי"',
                    icon: Clock,
                  }
                : { color: "text-gray-400", label: "חסר", icon: Clock };

            const StatusIcon = statusInfo.icon;
            const isUploading = uploading === docType.key;

            return (
              <div
                className="rounded-xl border border-[#e7e1da] bg-white p-4 transition-shadow hover:shadow-sm"
                key={docType.key}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Status + Name */}
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[#181510] text-[14px]"
                          style={{ fontWeight: 600 }}
                        >
                          {docType.label}
                        </span>
                        {"mandatory" in docType && docType.mandatory && (
                          <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-600">
                            חובה
                          </span>
                        )}
                        {"recommended" in docType && docType.recommended && (
                          <span className="rounded bg-yellow-50 px-1.5 py-0.5 text-[10px] text-yellow-700">
                            מומלץ
                          </span>
                        )}
                      </div>
                      <span className={`text-[11px] ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    {hasFile && existingDoc && (
                      <>
                        {/* Expiry date */}
                        {editingExpiry === docType.key ? (
                          <div className="flex items-center gap-1">
                            <input
                              className="rounded border border-[#e7e1da] px-2 py-1 text-[12px]"
                              onChange={(e) => setExpiryValue(e.target.value)}
                              type="date"
                              value={expiryValue}
                            />
                            <button
                              className="rounded bg-[#ff8c00] px-2 py-1 text-[11px] text-white"
                              onClick={() => handleSaveExpiry(existingDoc.id)}
                              type="button"
                            >
                              שמור
                            </button>
                            <button
                              className="rounded px-2 py-1 text-[#8d785e] text-[11px]"
                              onClick={() => setEditingExpiry(null)}
                              type="button"
                            >
                              ביטול
                            </button>
                          </div>
                        ) : (
                          <button
                            className="text-[#8d785e] text-[11px] hover:text-[#181510]"
                            onClick={() => {
                              setEditingExpiry(docType.key);
                              setExpiryValue(existingDoc.expiry ?? "");
                            }}
                            type="button"
                          >
                            {existingDoc.expiry
                              ? `תוקף: ${existingDoc.expiry}`
                              : "הגדר תוקף"}
                          </button>
                        )}

                        {/* File name */}
                        <span className="flex items-center gap-1 text-[#8d785e] text-[11px]">
                          <FileText size={12} />
                          {existingDoc.fileName ?? "קובץ"}
                        </span>

                        {/* Download */}
                        <button
                          className="rounded-lg p-1.5 text-[#8d785e] transition-colors hover:bg-[#f5f3f0]"
                          title="הורדה"
                          type="button"
                        >
                          <Download size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50"
                          onClick={() => handleDeleteDoc(existingDoc.id)}
                          title="מחק"
                          type="button"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}

                    {!hasFile && (
                      <>
                        {/* Upload button */}
                        <input
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileSelected(
                                docType.key as DocumentTypeKey,
                                docType.label,
                                file
                              );
                            }
                            e.target.value = "";
                          }}
                          ref={(el) => {
                            fileInputRefs.current[docType.key] = el;
                          }}
                          type="file"
                        />
                        <button
                          className="flex items-center gap-1.5 rounded-lg bg-[#ff8c00] px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-[#e07d00] disabled:opacity-50"
                          disabled={isUploading}
                          onClick={() =>
                            handleUpload(
                              docType.key as DocumentTypeKey,
                              docType.label
                            )
                          }
                          type="button"
                        >
                          {isUploading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
                          העלאה
                        </button>

                        {/* "אין לי" button */}
                        {!isAcknowledged && (
                          <button
                            className="rounded-lg border border-[#e7e1da] px-3 py-1.5 text-[#8d785e] text-[12px] transition-colors hover:bg-[#f5f3f0]"
                            onClick={() =>
                              handleMarkMissing(
                                docType.key as DocumentTypeKey,
                                docType.label
                              )
                            }
                            type="button"
                          >
                            אין לי
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Other documents (not matching predefined types) */}
        {documents && documents.filter((d) => !d.documentType).length > 0 && (
          <div className="mt-8">
            <h2
              className="mb-3 text-[#181510] text-[16px]"
              style={{ fontWeight: 600 }}
            >
              מסמכים נוספים
            </h2>
            <div className="space-y-2">
              {documents
                .filter((d) => !d.documentType)
                .map((doc) => {
                  const statusInfo = getStatusColor(doc.status, doc.expiry);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div
                      className="flex items-center justify-between rounded-lg border border-[#e7e1da] bg-white px-4 py-3"
                      key={doc.id}
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                        <span className="text-[#181510] text-[13px]">
                          {doc.name}
                        </span>
                        {doc.expiry && (
                          <span className="text-[#8d785e] text-[11px]">
                            תוקף: {doc.expiry}
                          </span>
                        )}
                      </div>
                      <button
                        className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50"
                        onClick={() => handleDeleteDoc(doc.id)}
                        type="button"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </FeatureGate>
    </div>
  );
}
