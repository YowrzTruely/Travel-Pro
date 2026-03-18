import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  FileText,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useAuth } from "../AuthContext";
import { useImageUpload } from "../hooks/useImageUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
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

const FILE_EXT_REGEX = /\.[^/.]+$/;

type DocumentTypeKey = (typeof DOCUMENT_TYPES)[number]["key"];

function getStatusColor(
  status: string | undefined,
  expiry: string | undefined
): { color: string; label: string; icon: typeof CheckCircle } {
  if (!status || status === "expired") {
    return { color: "text-destructive", label: "פג תוקף", icon: XCircle };
  }

  if (expiry) {
    const expiryDate = new Date(expiry);
    const now = new Date();
    const diffDays =
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      return { color: "text-destructive", label: "פג תוקף", icon: XCircle };
    }
    if (diffDays <= 30) {
      return {
        color: "text-yellow-500",
        label: `${Math.ceil(diffDays)} ימים`,
        icon: AlertTriangle,
      };
    }
    return { color: "text-success", label: "בתוקף", icon: CheckCircle };
  }

  if (status === "valid") {
    return { color: "text-success", label: "בתוקף", icon: CheckCircle };
  }
  if (status === "warning") {
    return {
      color: "text-yellow-500",
      label: "עומד לפוג",
      icon: AlertTriangle,
    };
  }

  return { color: "text-muted-foreground", label: "חסר", icon: Clock };
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

  const [editingExpiry, setEditingExpiry] = useState<string | null>(null);
  const [expiryValue, setExpiryValue] = useState("");

  // Unified upload dialog state — works for both mandatory and custom docs
  // uploadTarget: null = custom doc, string = mandatory doc type key
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<{
    key: string;
    label: string;
  } | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [dialogDocName, setDialogDocName] = useState("");
  const [uploadingDialog, setUploadingDialog] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dialogFileInputRef = useRef<HTMLInputElement | null>(null);
  const dialogDragCounter = useRef(0);

  // Custom doc rename state
  const [editingCustomName, setEditingCustomName] = useState<string | null>(
    null
  );
  const [editNameValue, setEditNameValue] = useState("");

  // Open the upload dialog for a mandatory doc type
  const openUploadDialog = (docTypeKey: string, label: string) => {
    setUploadTarget({ key: docTypeKey, label });
    setDialogDocName(label);
    setPendingFile(null);
    setUploadDialogOpen(true);
  };

  // Open the upload dialog for a custom doc (no predefined type)
  const openCustomUploadDialog = () => {
    setUploadTarget(null);
    setDialogDocName("");
    setPendingFile(null);
    setUploadDialogOpen(true);
  };

  const closeUploadDialog = () => {
    setUploadDialogOpen(false);
    setUploadTarget(null);
    setPendingFile(null);
    setDialogDocName("");
  };

  // Page-level drag overlay handlers
  const pageDragCounter = useRef(0);
  const handlePageDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    pageDragCounter.current += 1;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  }, []);

  const handlePageDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    pageDragCounter.current -= 1;
    if (pageDragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handlePageDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handlePageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    pageDragCounter.current = 0;

    const file = e.dataTransfer.files[0];
    if (file) {
      const baseName = file.name.replace(FILE_EXT_REGEX, "");
      setUploadTarget(null);
      setDialogDocName(baseName);
      setPendingFile(file);
      setUploadDialogOpen(true);
    }
  }, []);

  // Dialog-level drag & drop handlers
  const handleDialogDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dialogDragCounter.current += 1;
  }, []);

  const handleDialogDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dialogDragCounter.current -= 1;
  }, []);

  const handleDialogDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDialogDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dialogDragCounter.current = 0;
    const file = e.dataTransfer.files[0];
    if (file) {
      setPendingFile(file);
    }
  }, []);

  const handleDialogFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setPendingFile(file);
      }
      e.target.value = "";
    },
    []
  );

  const handleConfirmUpload = async () => {
    if (!(pendingFile && supplierId && dialogDocName.trim())) {
      return;
    }

    setUploadingDialog(true);
    try {
      const storageId = await upload(pendingFile);

      if (uploadTarget) {
        // Mandatory doc — create or update by documentType
        const existingDoc = (documents ?? []).find(
          (d) => d.documentType === uploadTarget.key
        );
        if (existingDoc) {
          await updateDoc({
            id: existingDoc.id,
            storageId,
            fileName: pendingFile.name,
            status: "valid",
            acknowledged: false,
          });
        } else {
          await createDoc({
            supplierId,
            name: uploadTarget.label,
            documentType: uploadTarget.key,
            storageId,
            fileName: pendingFile.name,
            status: "valid",
          });
        }
      } else {
        // Custom doc — no documentType
        await createDoc({
          supplierId,
          name: dialogDocName.trim(),
          storageId,
          fileName: pendingFile.name,
          status: "valid",
        });
      }

      appToast.success("המסמך הועלה בהצלחה");
      closeUploadDialog();
    } catch (err) {
      console.error("Upload failed:", err);
      appToast.error("שגיאה בהעלאת המסמך");
    } finally {
      setUploadingDialog(false);
    }
  };

  const handleRenameDoc = async (docId: Id<"supplierDocuments">) => {
    if (!editNameValue.trim()) {
      return;
    }
    try {
      await updateDoc({ id: docId, name: editNameValue.trim() });
      setEditingCustomName(null);
      appToast.success("שם המסמך עודכן");
    } catch (err) {
      console.error("Rename failed:", err);
      appToast.error("שגיאה בעדכון שם");
    }
  };

  if (!supplierId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <p className="text-muted-foreground">לא נמצא ספק מקושר לחשבון שלך</p>
      </div>
    );
  }

  if (documents === undefined || supplier === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" dir="rtl">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
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

  // Custom documents (no predefined documentType), sorted by creation time
  const customDocs = (documents ?? [])
    .filter((d) => !d.documentType)
    .sort((a, b) => (a._creationTime ?? 0) - (b._creationTime ?? 0));

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

  const fileExtIcon = (fileName: string | undefined) => {
    if (!fileName) {
      return null;
    }
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      return "PDF";
    }
    if (ext === "doc" || ext === "docx") {
      return "DOC";
    }
    if (ext === "jpg" || ext === "jpeg" || ext === "png") {
      return "IMG";
    }
    return ext?.toUpperCase() ?? null;
  };

  return (
    <div
      className="mx-auto max-w-3xl p-6"
      dir="rtl"
      onDragEnter={handlePageDragEnter}
      onDragLeave={handlePageDragLeave}
      onDragOver={handlePageDragOver}
      onDrop={handlePageDrop}
    >
      {/* Full-page drag overlay */}
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-primary border-dashed bg-card/95 px-12 py-10">
            <UploadCloud className="h-12 w-12 text-primary" />
            <span
              className="text-[16px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              שחרר כאן להעלאת מסמך
            </span>
            <span className="text-[12px] text-muted-foreground">
              PDF, DOCX, תמונות ועוד
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-[22px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            המסמכים שלי
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            ניהול מסמכים, ביטוחים ותקינות
          </p>
        </div>
        {compliance && (
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${
              compliance.compliant
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
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
                    color: "text-muted-foreground",
                    label: 'סומן "אין לי"',
                    icon: Clock,
                  }
                : { color: "text-muted-foreground", label: "חסר", icon: Clock };

            const StatusIcon = statusInfo.icon;

            return (
              <div
                className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
                key={docType.key}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Status + Name */}
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[14px] text-foreground"
                          style={{ fontWeight: 600 }}
                        >
                          {docType.label}
                        </span>
                        {"mandatory" in docType && docType.mandatory && (
                          <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">
                            חובה
                          </span>
                        )}
                        {"recommended" in docType && docType.recommended && (
                          <span className="rounded bg-warning/10 px-1.5 py-0.5 text-[10px] text-yellow-700">
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
                              className="rounded border border-border px-2 py-1 text-[12px]"
                              onChange={(e) => setExpiryValue(e.target.value)}
                              type="date"
                              value={expiryValue}
                            />
                            <button
                              className="rounded bg-primary px-2 py-1 text-[11px] text-white"
                              onClick={() => handleSaveExpiry(existingDoc.id)}
                              type="button"
                            >
                              שמור
                            </button>
                            <button
                              className="rounded px-2 py-1 text-[11px] text-muted-foreground"
                              onClick={() => setEditingExpiry(null)}
                              type="button"
                            >
                              ביטול
                            </button>
                          </div>
                        ) : (
                          <button
                            className="text-[11px] text-muted-foreground hover:text-foreground"
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
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <FileText size={12} />
                          {existingDoc.fileName ?? "קובץ"}
                        </span>

                        {/* Download */}
                        <button
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent"
                          title="הורדה"
                          type="button"
                        >
                          <Download size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-destructive/10"
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
                        <button
                          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-primary-hover"
                          onClick={() =>
                            openUploadDialog(docType.key, docType.label)
                          }
                          type="button"
                        >
                          <Upload size={14} />
                          העלאה
                        </button>

                        {!isAcknowledged && (
                          <button
                            className="rounded-lg border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-accent"
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

        {/* ── Custom documents section ── */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2
              className="text-[16px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              מסמכים נוספים
            </h2>
            <button
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-primary-hover"
              onClick={openCustomUploadDialog}
              type="button"
            >
              <Plus size={14} />
              הוסף מסמך
            </button>
          </div>

          {/* Custom docs list */}
          {customDocs.length > 0 && (
            <div className="space-y-2">
              {customDocs.map((doc, index) => {
                const statusInfo = getStatusColor(doc.status, doc.expiry);
                const StatusIcon = statusInfo.icon;
                const extLabel = fileExtIcon(doc.fileName);
                const isEditingName = editingCustomName === doc.id;

                return (
                  <div
                    className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-shadow hover:shadow-sm"
                    key={doc.id}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                      <span className="text-[12px] text-muted-foreground/60">
                        {index + 1}
                      </span>
                      <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                      <div className="flex flex-col">
                        {isEditingName ? (
                          <div className="flex items-center gap-1">
                            <input
                              autoFocus
                              className="rounded border border-border bg-background px-2 py-0.5 text-[13px] text-foreground"
                              onChange={(e) => setEditNameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleRenameDoc(doc.id);
                                }
                                if (e.key === "Escape") {
                                  setEditingCustomName(null);
                                }
                              }}
                              value={editNameValue}
                            />
                            <button
                              className="rounded bg-primary px-2 py-0.5 text-[11px] text-white"
                              onClick={() => handleRenameDoc(doc.id)}
                              type="button"
                            >
                              שמור
                            </button>
                            <button
                              className="rounded px-2 py-0.5 text-[11px] text-muted-foreground"
                              onClick={() => setEditingCustomName(null)}
                              type="button"
                            >
                              ביטול
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[13px] text-foreground"
                              style={{ fontWeight: 500 }}
                            >
                              {doc.name}
                            </span>
                            <button
                              className="opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => {
                                setEditingCustomName(doc.id);
                                setEditNameValue(doc.name);
                              }}
                              title="שנה שם"
                              type="button"
                            >
                              <Pencil
                                className="text-muted-foreground hover:text-foreground"
                                size={12}
                              />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {extLabel && (
                            <span
                              className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground"
                              style={{ fontWeight: 600 }}
                            >
                              {extLabel}
                            </span>
                          )}
                          {doc.fileName && (
                            <span className="text-[10px] text-muted-foreground">
                              {doc.fileName}
                            </span>
                          )}
                          {doc.expiry && (
                            <span className="text-[10px] text-muted-foreground">
                              · תוקף: {doc.expiry}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Expiry editing for custom docs */}
                      {editingExpiry === doc.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            className="rounded border border-border px-2 py-1 text-[12px]"
                            onChange={(e) => setExpiryValue(e.target.value)}
                            type="date"
                            value={expiryValue}
                          />
                          <button
                            className="rounded bg-primary px-2 py-1 text-[11px] text-white"
                            onClick={() => handleSaveExpiry(doc.id)}
                            type="button"
                          >
                            שמור
                          </button>
                          <button
                            className="rounded px-2 py-1 text-[11px] text-muted-foreground"
                            onClick={() => setEditingExpiry(null)}
                            type="button"
                          >
                            ביטול
                          </button>
                        </div>
                      ) : (
                        <button
                          className="rounded-lg p-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          onClick={() => {
                            setEditingExpiry(doc.id);
                            setExpiryValue(doc.expiry ?? "");
                          }}
                          title="הגדר תוקף"
                          type="button"
                        >
                          <Clock size={14} />
                        </button>
                      )}
                      <button
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent"
                        title="הורדה"
                        type="button"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-destructive/10"
                        onClick={() => handleDeleteDoc(doc.id)}
                        title="מחק"
                        type="button"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Drop zone hint (when no custom docs yet) */}
          {customDocs.length === 0 && (
            <button
              className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-border border-dashed py-8 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
              onClick={openCustomUploadDialog}
              type="button"
            >
              <UploadCloud className="h-8 w-8" />
              <span className="text-[13px]">גרור קבצים לכאן או לחץ להעלאה</span>
              <span className="text-[11px] text-muted-foreground/70">
                PDF, DOCX, תמונות ועוד
              </span>
            </button>
          )}
        </div>
      </FeatureGate>

      {/* Unified upload dialog — handles both mandatory and custom docs */}
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            closeUploadDialog();
          }
        }}
        open={uploadDialogOpen}
      >
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {uploadTarget ? `העלאת ${uploadTarget.label}` : "העלאת מסמך חדש"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {/* Document name field */}
            <div>
              <label
                className="mb-1.5 block text-[13px] text-muted-foreground"
                htmlFor="upload-doc-name"
              >
                שם המסמך
              </label>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary disabled:opacity-60"
                disabled={!!uploadTarget}
                id="upload-doc-name"
                onChange={(e) => setDialogDocName(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    pendingFile &&
                    dialogDocName.trim()
                  ) {
                    handleConfirmUpload();
                  }
                }}
                placeholder="למשל: אישור ביטוח, רישיון רכב..."
                value={dialogDocName}
              />
            </div>

            {/* Drag & drop zone */}
            <button
              className={`flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 transition-colors ${
                pendingFile
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-primary/5"
              }`}
              onClick={() => dialogFileInputRef.current?.click()}
              onDragEnter={handleDialogDragEnter}
              onDragLeave={handleDialogDragLeave}
              onDragOver={handleDialogDragOver}
              onDrop={handleDialogDrop}
              type="button"
            >
              <input
                className="hidden"
                onChange={handleDialogFileChange}
                ref={dialogFileInputRef}
                type="file"
              />
              {pendingFile ? (
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div className="flex flex-col text-start">
                    <span className="text-[13px] text-foreground">
                      {pendingFile.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {(pendingFile.size / 1024).toFixed(0)} KB — לחץ להחלפה
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                  <span className="text-[13px] text-muted-foreground">
                    גרור קובץ לכאן או לחץ לבחירה
                  </span>
                  <span className="text-[11px] text-muted-foreground/70">
                    PDF, DOCX, תמונות ועוד
                  </span>
                </>
              )}
            </button>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                disabled={
                  uploadingDialog || !pendingFile || !dialogDocName.trim()
                }
                onClick={handleConfirmUpload}
                type="button"
              >
                {uploadingDialog ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                העלה
              </button>
              <button
                className="rounded-lg border border-border px-4 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-accent"
                onClick={closeUploadDialog}
                type="button"
              >
                ביטול
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
