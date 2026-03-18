import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit2,
  Eye,
  FileText,
  Loader2,
  Plus,
  Save,
  Search,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import { FormField, FormSelect, rules } from "./FormField";

// ─── Types ───────────────────────────────────────

interface DocumentRow {
  entityId: string;
  entityName: string;
  entityType: "supplier" | "project";
  expiry: string;
  fileName?: string;
  id: string;
  name: string;
  status: "valid" | "warning" | "expired";
  type: string;
}

interface AddProjectDocForm {
  expiry: string;
  fileName: string;
  name: string;
  projectId: string;
  type: "contract" | "proposal" | "agreement" | "invoice" | "other";
}

type TabType = "suppliers" | "projects";
type StatusFilter = "all" | "valid" | "warning" | "expired";

// ─── Helpers ─────────────────────────────────────

const getDocStatus = (expiry: string): "valid" | "warning" | "expired" => {
  if (!expiry) {
    return "expired";
  }
  const exp = new Date(expiry);
  const now = new Date();
  if (exp < now) {
    return "expired";
  }
  const diff = exp.getTime() - now.getTime();
  if (diff / (1000 * 60 * 60 * 24) < 60) {
    return "warning";
  }
  return "valid";
};

const formatDate = (dateStr: string) => {
  if (!dateStr) {
    return "—";
  }
  const d = new Date(dateStr);
  return d.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const statusConfig = {
  valid: {
    label: "בתוקף",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    icon: CheckCircle,
    iconColor: "text-success",
  },
  warning: {
    label: "פג בקרוב",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    icon: Clock,
    iconColor: "text-yellow-500",
  },
  expired: {
    label: "פג תוקף",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    icon: AlertTriangle,
    iconColor: "text-destructive",
  },
};

const supplierDocTypes = [
  "הכל",
  "רישיון עסק",
  "תעודת כשרות",
  "ביטוח צד ג'",
  "אחר",
];
const projectDocTypeLabels: Record<string, string> = {
  contract: "חוזה",
  proposal: "הצעת מחיר",
  agreement: "הסכם",
  invoice: "חשבונית",
  other: "אחר",
};
const projectDocTypes = ["הכל", ...Object.values(projectDocTypeLabels)];

const ITEMS_PER_PAGE = 10;

// ─── Component ───────────────────────────────────

export function DocumentsPage() {
  const navigate = useNavigate();

  // ─── Convex queries ───
  const suppliers = useQuery(api.suppliers.list);
  const projects = useQuery(api.projects.list);
  const allSupplierDocsRaw = useQuery(api.supplierDocuments.listAll);
  const allProjectDocsRaw = useQuery(api.projectDocuments.listAll);

  // ─── Mutations ───
  const createProjectDoc = useMutation(api.projectDocuments.create);
  const updateSupplierDoc = useMutation(api.supplierDocuments.update);
  const updateProjectDoc = useMutation(api.projectDocuments.update);
  const removeSupplierDoc = useMutation(api.supplierDocuments.remove);
  const removeProjectDoc = useMutation(api.projectDocuments.remove);

  // ─── UI state ───
  const [activeTab, setActiveTab] = useState<TabType>("suppliers");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState("הכל");
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Modal state ───
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentRow | null>(null);
  const [editExpiryValue, setEditExpiryValue] = useState("");
  const [deletingDoc, setDeletingDoc] = useState<DocumentRow | null>(null);
  const [saving, setSaving] = useState(false);

  // ─── Form ───
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isValid },
    reset: resetForm,
  } = useForm<AddProjectDocForm>({
    mode: "onChange",
    defaultValues: {
      projectId: "",
      name: "",
      type: "contract",
      expiry: "",
      fileName: "",
    },
  });

  // ─── Build document rows from live queries ───
  const loading =
    suppliers === undefined ||
    projects === undefined ||
    allSupplierDocsRaw === undefined ||
    allProjectDocsRaw === undefined;

  const supplierMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (suppliers) {
      for (const s of suppliers) {
        map[s._id] = s.name;
      }
    }
    return map;
  }, [suppliers]);

  const projectMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (projects) {
      for (const p of projects) {
        map[p._id] = p.name;
      }
    }
    return map;
  }, [projects]);

  const supplierDocs = useMemo<DocumentRow[]>(() => {
    if (!allSupplierDocsRaw) {
      return [];
    }
    return allSupplierDocsRaw.map((d: any) => ({
      id: d.id,
      name: d.name,
      type: d.name,
      entityType: "supplier" as const,
      entityId: d.supplierId,
      entityName: supplierMap[d.supplierId] || "ספק",
      expiry: d.expiry || "",
      status: getDocStatus(d.expiry || ""),
      fileName: d.fileName,
    }));
  }, [allSupplierDocsRaw, supplierMap]);

  const projectDocs = useMemo<DocumentRow[]>(() => {
    if (!allProjectDocsRaw) {
      return [];
    }
    return allProjectDocsRaw.map((d: any) => ({
      id: d.id,
      name: d.name,
      type: projectDocTypeLabels[d.type] || d.type || "אחר",
      entityType: "project" as const,
      entityId: d.projectId,
      entityName: projectMap[d.projectId] || "פרויקט",
      expiry: d.expiry || "",
      status: getDocStatus(d.expiry || ""),
      fileName: d.fileName,
    }));
  }, [allProjectDocsRaw, projectMap]);

  // ─── Filtered data ───
  const activeDocs = activeTab === "suppliers" ? supplierDocs : projectDocs;
  const allDocs = useMemo(
    () => [...supplierDocs, ...projectDocs],
    [supplierDocs, projectDocs]
  );

  const filtered = useMemo(() => {
    return activeDocs.filter((doc) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !(
            doc.name.toLowerCase().includes(q) ||
            doc.entityName.toLowerCase().includes(q)
          )
        ) {
          return false;
        }
      }
      if (statusFilter !== "all" && doc.status !== statusFilter) {
        return false;
      }
      if (typeFilter !== "הכל") {
        if (activeTab === "suppliers") {
          if (typeFilter === "אחר") {
            const requiredNames = ["רישיון עסק", "תעודת כשרות", "ביטוח צד ג'"];
            if (requiredNames.includes(doc.name)) {
              return false;
            }
          } else if (doc.name !== typeFilter) {
            return false;
          }
        } else if (doc.type !== typeFilter) {
          return false;
        }
      }
      return true;
    });
  }, [activeDocs, search, statusFilter, typeFilter, activeTab]);

  // ─── Pagination ───
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ─── Stats ───
  const stats = useMemo(() => {
    const total = allDocs.length;
    const valid = allDocs.filter((d) => d.status === "valid").length;
    const warning = allDocs.filter((d) => d.status === "warning").length;
    const expired = allDocs.filter((d) => d.status === "expired").length;
    return { total, valid, warning, expired };
  }, [allDocs]);

  // ─── Handlers ───
  const onAddProjectDoc = async (data: AddProjectDocForm) => {
    try {
      setSaving(true);
      const status = data.expiry ? getDocStatus(data.expiry) : "active";
      // Find the project's Convex _id from legacyId
      const project = (projects || []).find(
        (p: any) => p.id === data.projectId || p._id === data.projectId
      );
      if (!project) {
        appToast.error("פרויקט לא נמצא");
        return;
      }
      await createProjectDoc({
        projectId: project._id,
        name: data.name.trim(),
        type: data.type,
        expiry: data.expiry || undefined,
        status,
        fileName: data.fileName.trim() || undefined,
      });
      appToast.success("מסמך נוסף בהצלחה");
      setShowAddDoc(false);
      resetForm();
    } catch (err) {
      console.error("[DocumentsPage] Failed to add document:", err);
      appToast.error("שגיאה בהוספת מסמך");
    } finally {
      setSaving(false);
    }
  };

  const onUpdateExpiry = async () => {
    if (!(editingDoc && editExpiryValue)) {
      return;
    }
    try {
      setSaving(true);
      const newStatus = getDocStatus(editExpiryValue);
      if (editingDoc.entityType === "supplier") {
        await updateSupplierDoc({
          id: editingDoc.id as any,
          expiry: editExpiryValue,
          status: newStatus,
        });
      } else {
        await updateProjectDoc({
          id: editingDoc.id as any,
          expiry: editExpiryValue,
          status: newStatus as any,
        });
      }
      appToast.success("תוקף המסמך עודכן בהצלחה");
      setEditingDoc(null);
      setEditExpiryValue("");
    } catch (err) {
      console.error("[DocumentsPage] Failed to update expiry:", err);
      appToast.error("שגיאה בעדכון תוקף");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteDoc = async () => {
    if (!deletingDoc) {
      return;
    }
    try {
      setSaving(true);
      if (deletingDoc.entityType === "supplier") {
        await removeSupplierDoc({ id: deletingDoc.id as any });
      } else {
        await removeProjectDoc({ id: deletingDoc.id as any });
      }
      appToast.success("המסמך נמחק בהצלחה");
      setDeletingDoc(null);
    } catch (err) {
      console.error("[DocumentsPage] Failed to delete document:", err);
      appToast.error("שגיאה במחיקת מסמך");
    } finally {
      setSaving(false);
    }
  };

  // ─── Loading state ───
  if (loading) {
    return (
      <div
        className="mx-auto flex min-h-[60vh] max-w-[1200px] items-center justify-center p-4 font-['Assistant',sans-serif] lg:p-6"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <span
            className="text-[15px] text-muted-foreground"
            style={{ fontWeight: 500 }}
          >
            טוען מסמכים...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-[1200px] p-4 font-['Assistant',sans-serif] lg:p-6"
      dir="rtl"
    >
      {/* ═══ Header ═══ */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="text-primary" size={22} />
          </div>
          <div>
            <h1
              className="text-[24px] text-foreground"
              style={{ fontWeight: 700 }}
            >
              ניהול מסמכים
            </h1>
            <p className="text-[13px] text-muted-foreground">
              מסמכים, חוזים והסכמים עם ספקים ולקוחות
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[14px] text-white transition-colors hover:bg-primary-hover"
          onClick={() => setShowAddDoc(true)}
          style={{ fontWeight: 600 }}
          type="button"
        >
          <Plus size={16} />
          הוסף מסמך
        </button>
      </div>

      {/* ═══ Summary Cards ═══ */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "סה״כ מסמכים",
            value: stats.total,
            color: "#8d785e",
            bg: "#f5f3f0",
          },
          {
            label: "בתוקף",
            value: stats.valid,
            color: "#22c55e",
            bg: "#f0fdf4",
          },
          {
            label: "פג בקרוב",
            value: stats.warning,
            color: "#eab308",
            bg: "#fefce8",
          },
          {
            label: "פג תוקף",
            value: stats.expired,
            color: "#ef4444",
            bg: "#fef2f2",
          },
        ].map((card) => (
          <div
            className="rounded-xl border border-border p-4"
            key={card.label}
            style={{ backgroundColor: card.bg }}
          >
            <div
              className="mb-1 text-[12px] text-muted-foreground"
              style={{ fontWeight: 600 }}
            >
              {card.label}
            </div>
            <div
              className="text-[28px]"
              style={{ fontWeight: 700, color: card.color }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Tabs ═══ */}
      <div className="mb-4 flex w-fit items-center gap-1 rounded-xl bg-accent p-1">
        {[
          { key: "suppliers" as TabType, label: "מסמכי ספקים", icon: Shield },
          {
            key: "projects" as TabType,
            label: "מסמכי פרויקטים",
            icon: FileText,
          },
        ].map((tab) => (
          <button
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] transition-all ${
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setTypeFilter("הכל");
            }}
            style={{ fontWeight: activeTab === tab.key ? 700 : 500 }}
            type="button"
          >
            <tab.icon size={15} />
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                activeTab === tab.key
                  ? "bg-primary/10 text-primary"
                  : "bg-border text-muted-foreground"
              }`}
              style={{ fontWeight: 700 }}
            >
              {tab.key === "suppliers"
                ? supplierDocs.length
                : projectDocs.length}
            </span>
          </button>
        ))}
      </div>

      {/* ═══ Filter Bar ═══ */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            className="w-full rounded-xl border border-border bg-card py-2.5 pr-9 pl-4 text-[13px] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם מסמך או שם ספק/פרויקט..."
            value={search}
          />
        </div>

        {/* Status filter */}
        <select
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          value={statusFilter}
        >
          <option value="all">כל הסטטוסים</option>
          <option value="valid">בתוקף</option>
          <option value="warning">פג בקרוב</option>
          <option value="expired">פג תוקף</option>
        </select>

        {/* Type filter */}
        <select
          className="rounded-xl border border-border bg-card px-3 py-2.5 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          onChange={(e) => setTypeFilter(e.target.value)}
          value={typeFilter}
        >
          {(activeTab === "suppliers" ? supplierDocTypes : projectDocTypes).map(
            (t) => (
              <option key={t} value={t}>
                {t}
              </option>
            )
          )}
        </select>
      </div>

      {/* ═══ Documents Table ═══ */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
              <FileText className="text-tertiary" size={24} />
            </div>
            <div
              className="mb-1 text-[15px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              {search || statusFilter !== "all" || typeFilter !== "הכל"
                ? "לא נמצאו מסמכים תואמים"
                : "אין מסמכים עדיין"}
            </div>
            <div className="text-[13px] text-muted-foreground">
              {search || statusFilter !== "all" || typeFilter !== "הכל"
                ? "נסה לשנות את הסינון"
                : activeTab === "projects"
                  ? "הוסף מסמך פרויקט חדש"
                  : "מסמכי ספקים יופיעו כאן"}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-border border-b bg-surface">
                    <th
                      className="px-4 py-3 text-right text-[12px] text-muted-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      סטטוס
                    </th>
                    <th
                      className="px-4 py-3 text-right text-[12px] text-muted-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      שם מסמך
                    </th>
                    <th
                      className="px-4 py-3 text-right text-[12px] text-muted-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      {activeTab === "suppliers" ? "ספק" : "פרויקט"}
                    </th>
                    <th
                      className="px-4 py-3 text-right text-[12px] text-muted-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      סוג
                    </th>
                    <th
                      className="px-4 py-3 text-right text-[12px] text-muted-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      תוקף
                    </th>
                    <th
                      className="px-4 py-3 text-right text-[12px] text-muted-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      קובץ
                    </th>
                    <th
                      className="px-4 py-3 text-right text-[12px] text-muted-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((doc) => {
                    const sc = statusConfig[doc.status];
                    const StatusIcon = sc.icon;
                    return (
                      <tr
                        className="border-accent border-b transition-colors hover:bg-surface"
                        key={`${doc.entityType}-${doc.id}`}
                      >
                        {/* Status */}
                        <td className="px-4 py-3">
                          <div
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${sc.bg} ${sc.border} border`}
                            style={{ fontWeight: 600 }}
                          >
                            <StatusIcon className={sc.iconColor} size={12} />
                            <span className={sc.color}>{sc.label}</span>
                          </div>
                        </td>

                        {/* Document name */}
                        <td className="px-4 py-3">
                          <div
                            className="text-foreground"
                            style={{ fontWeight: 600 }}
                          >
                            {doc.name}
                          </div>
                        </td>

                        {/* Entity name (clickable) */}
                        <td className="px-4 py-3">
                          <button
                            className="text-primary transition-colors hover:text-primary-hover hover:underline"
                            onClick={() =>
                              navigate(
                                doc.entityType === "supplier"
                                  ? `/suppliers/${doc.entityId}`
                                  : `/projects/${doc.entityId}`
                              )
                            }
                            style={{ fontWeight: 500 }}
                            type="button"
                          >
                            {doc.entityName}
                          </button>
                        </td>

                        {/* Type badge */}
                        <td className="px-4 py-3">
                          <span
                            className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-muted-foreground"
                            style={{ fontWeight: 600 }}
                          >
                            {doc.type}
                          </span>
                        </td>

                        {/* Expiry */}
                        <td className="px-4 py-3">
                          <span
                            className={`text-[12px] ${sc.color}`}
                            style={{ fontWeight: 500 }}
                          >
                            {formatDate(doc.expiry)}
                          </span>
                        </td>

                        {/* File name */}
                        <td className="px-4 py-3">
                          {doc.fileName ? (
                            <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                              <FileText size={12} />
                              <span className="max-w-[120px] truncate">
                                {doc.fileName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[12px] text-tertiary">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                              onClick={() =>
                                navigate(
                                  doc.entityType === "supplier"
                                    ? `/suppliers/${doc.entityId}`
                                    : `/projects/${doc.entityId}`
                                )
                              }
                              title="צפייה"
                              type="button"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                              onClick={() => {
                                setEditingDoc(doc);
                                setEditExpiryValue(doc.expiry);
                              }}
                              title="עדכון תוקף"
                              type="button"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setDeletingDoc(doc)}
                              title="מחיקה"
                              type="button"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ═══ Pagination ═══ */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-accent border-t px-4 py-3">
                <div className="text-[12px] text-muted-foreground">
                  מציג {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} מתוך{" "}
                  {filtered.length}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent disabled:opacity-30"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    type="button"
                  >
                    <ChevronRight size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        className={`flex h-7 w-7 items-center justify-center rounded-md text-[12px] transition-colors ${
                          currentPage === page
                            ? "bg-primary text-white"
                            : "text-muted-foreground hover:bg-accent"
                        }`}
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        type="button"
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent disabled:opacity-30"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    type="button"
                  >
                    <ChevronLeft size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══ Add Document Modal ═══ */}
      {showAddDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setShowAddDoc(false);
            resetForm();
          }}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl"
            dir="rtl"
            role="dialog"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="text-primary" size={18} />
                </div>
                <h3
                  className="text-[18px] text-foreground"
                  style={{ fontWeight: 700 }}
                >
                  הוספת מסמך פרויקט
                </h3>
              </div>
              <button
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => {
                  setShowAddDoc(false);
                  resetForm();
                }}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="space-y-3"
              onSubmit={handleSubmit(onAddProjectDoc)}
            >
              <FormSelect
                error={errors.projectId}
                isDirty={dirtyFields.projectId}
                label="פרויקט"
                required
                {...register("projectId", rules.required("פרויקט"))}
              >
                <option value="">בחר פרויקט...</option>
                {(projects || []).map((p: any) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </FormSelect>

              <FormField
                error={errors.name}
                isDirty={dirtyFields.name}
                label="שם המסמך"
                placeholder="לדוגמה: חוזה התקשרות"
                required
                {...register("name", rules.requiredMin("שם המסמך", 2))}
              />

              <FormSelect
                error={errors.type}
                isDirty={dirtyFields.type}
                label="סוג מסמך"
                required
                {...register("type", rules.required("סוג מסמך"))}
              >
                <option value="contract">חוזה</option>
                <option value="proposal">הצעת מחיר</option>
                <option value="agreement">הסכם</option>
                <option value="invoice">חשבונית</option>
                <option value="other">אחר</option>
              </FormSelect>

              <FormField
                error={errors.expiry}
                isDirty={dirtyFields.expiry}
                label="תאריך תוקף"
                type="date"
                {...register("expiry")}
              />

              <FormField
                error={errors.fileName}
                isDirty={dirtyFields.fileName}
                label="שם קובץ"
                placeholder="לדוגמה: contract_2024.pdf"
                {...register("fileName")}
              />

              <div className="flex gap-3 pt-3">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-[14px] text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                  disabled={saving || !isValid}
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                  {saving ? "שומר..." : "הוסף מסמך"}
                </button>
                <button
                  className="rounded-xl px-4 py-2.5 text-[14px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => {
                    setShowAddDoc(false);
                    resetForm();
                  }}
                  style={{ fontWeight: 600 }}
                  type="button"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Edit Expiry Modal ═══ */}
      {editingDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setEditingDoc(null);
            setEditExpiryValue("");
          }}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl"
            dir="rtl"
            role="dialog"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="text-primary" size={18} />
                </div>
                <h3
                  className="text-[18px] text-foreground"
                  style={{ fontWeight: 700 }}
                >
                  עדכון תוקף
                </h3>
              </div>
              <button
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => {
                  setEditingDoc(null);
                  setEditExpiryValue("");
                }}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <div
                className="mb-1 text-[13px] text-muted-foreground"
                style={{ fontWeight: 600 }}
              >
                מסמך
              </div>
              <div
                className="text-[15px] text-foreground"
                style={{ fontWeight: 600 }}
              >
                {editingDoc.name}
              </div>
              <div className="mt-0.5 text-[12px] text-muted-foreground">
                {editingDoc.entityName}
              </div>
            </div>

            <div className="mb-4">
              <label
                className="mb-1 block text-[13px] text-muted-foreground"
                htmlFor="doc-expiry-date"
                style={{ fontWeight: 600 }}
              >
                תאריך תוקף חדש
              </label>
              <input
                className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                id="doc-expiry-date"
                onChange={(e) => setEditExpiryValue(e.target.value)}
                type="date"
                value={editExpiryValue}
              />
            </div>

            <div className="flex gap-3">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-[14px] text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                disabled={!editExpiryValue || saving}
                onClick={onUpdateExpiry}
                style={{ fontWeight: 600 }}
                type="button"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                {saving ? "שומר..." : "שמור"}
              </button>
              <button
                className="rounded-xl px-4 py-2.5 text-[14px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => {
                  setEditingDoc(null);
                  setEditExpiryValue("");
                }}
                style={{ fontWeight: 600 }}
                type="button"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Delete Confirmation Modal ═══ */}
      {deletingDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDeletingDoc(null)}
          onKeyDown={(e) => e.key === "Escape" && e.currentTarget.click()}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl"
            dir="rtl"
            role="dialog"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="text-destructive" size={20} />
              </div>
              <div>
                <h3
                  className="text-[18px] text-foreground"
                  style={{ fontWeight: 700 }}
                >
                  מחיקת מסמך
                </h3>
                <p className="text-[13px] text-muted-foreground">
                  פעולה זו אינה ניתנת לביטול
                </p>
              </div>
            </div>

            <div className="mb-4 rounded-xl bg-surface p-3">
              <div
                className="text-[14px] text-foreground"
                style={{ fontWeight: 600 }}
              >
                {deletingDoc.name}
              </div>
              <div className="mt-0.5 text-[12px] text-muted-foreground">
                {deletingDoc.entityName}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-destructive/100 py-2.5 text-[14px] text-white transition-colors hover:bg-destructive disabled:opacity-50"
                disabled={saving}
                onClick={onDeleteDoc}
                style={{ fontWeight: 600 }}
                type="button"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                {saving ? "מוחק..." : "מחק"}
              </button>
              <button
                className="rounded-xl px-4 py-2.5 text-[14px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setDeletingDoc(null)}
                style={{ fontWeight: 600 }}
                type="button"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
