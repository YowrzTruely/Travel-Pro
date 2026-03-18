import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  Archive,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Edit2,
  Eye,
  Filter,
  Loader2,
  Plus,
  Search,
  Star,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import { CategoryIcon } from "./CategoryIcons";
import {
  OPERATING_REGIONS,
  SUPPLIER_CATEGORIES,
} from "./constants/supplierConstants";
import type { Supplier } from "./data";
import { FormField, FormSelect, rules } from "./FormField";
import { SupplierMap } from "./SupplierMap";
import type { SupplierSummary } from "./supplierNotes";
import { computeAutoNotesFromSummary, noteLevelStyles } from "./supplierNotes";

interface NewSupplierForm {
  category: string;
  name: string;
  phone: string;
  region: string;
}

const categories = ["כל הקטגוריות", ...SUPPLIER_CATEGORIES.map((c) => c.label)];
const regions = ["כל הארץ", ...OPERATING_REGIONS.map((r) => r.label)];

const CATEGORY_COLOR_MAP: Record<string, { color: string }> = {
  // Hebrew short labels (legacy data)
  תחבורה: { color: "#3b82f6" },
  מזון: { color: "#22c55e" },
  אטרקציות: { color: "#a855f7" },
  לינה: { color: "#ec4899" },
  "אולמות וגנים": { color: "#f97316" },
  צילום: { color: "#06b6d4" },
  מוזיקה: { color: "#8b5cf6" },
  ציוד: { color: "#64748b" },
  כללי: { color: "#8d785e" },
  בידור: { color: "#e11d48" },
  // Hebrew full labels (from SUPPLIER_CATEGORIES)
  "אטרקציות ופעילויות": { color: "#a855f7" },
  "מסעדות ואוכל": { color: "#22c55e" },
  "הסעות ותחבורה": { color: "#3b82f6" },
  "צילום ומגנטים": { color: "#06b6d4" },
  "בידור ומוזיקה": { color: "#e11d48" },
  "סדנאות יצירה ולמידה": { color: "#8b5cf6" },
  אחר: { color: "#8d785e" },
  // English enum keys (from Convex schema)
  transport: { color: "#3b82f6" },
  food: { color: "#22c55e" },
  attractions: { color: "#a855f7" },
  accommodation: { color: "#ec4899" },
  photography: { color: "#06b6d4" },
  entertainment: { color: "#e11d48" },
  workshops: { color: "#8b5cf6" },
  other: { color: "#8d785e" },
};

/** Map an English or Hebrew category value to its Hebrew display label */
function categoryToHebrew(val: string): string {
  const match = SUPPLIER_CATEGORIES.find(
    (c) => c.value === val || c.label === val
  );
  return match?.label ?? val;
}

/** Map an English or Hebrew region value to its Hebrew display label */
function regionToHebrew(val: string): string {
  const match = OPERATING_REGIONS.find(
    (r) => r.value === val || r.label === val
  );
  return match?.label ?? val;
}
const statuses = ["הכל", "מאומת", "ממתין", "לא מאומת"];

export function SupplierBank() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("כל הקטגוריות");
  const [selectedRegion, setSelectedRegion] = useState("כל הארץ");
  const [selectedStatus, setSelectedStatus] = useState("הכל");
  const [showAddSupplier, setShowAddSupplier] = useState(false);

  // ─── Live data from Convex ───
  const suppliers = useQuery(api.suppliers.list) as Supplier[] | undefined;
  const summaries = useQuery(api.suppliers.summaries) as
    | Record<string, SupplierSummary>
    | undefined;
  const createSupplier = useMutation(api.suppliers.create);

  const loading = suppliers === undefined;
  const error: string | null = null;

  // ─── New supplier form state ───
  const [saving, setSaving] = useState(false);
  const [newSupplierCategories, setNewSupplierCategories] = useState<string[]>([
    "תחבורה",
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isValid },
    reset: resetSupplierForm,
    watch,
  } = useForm<NewSupplierForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      category: "תחבורה",
      region: "גליל עליון",
      phone: "",
    },
  });

  // Duplicate detection
  const [debouncedName, setDebouncedName] = useState("");
  const watchedName = watch("name");
  const watchedPhone = watch("phone");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(watchedName);
    }, 400);
    return () => clearTimeout(timer);
  }, [watchedName]);

  const duplicates = useQuery(
    api.suppliers.findDuplicates,
    debouncedName.length >= 2
      ? { name: debouncedName, phone: watchedPhone || undefined }
      : "skip"
  );

  const onSubmitSupplier = async (data: NewSupplierForm) => {
    if (newSupplierCategories.length === 0) {
      return;
    }
    try {
      setSaving(true);
      const categoryStr = newSupplierCategories.join(",");
      const primaryCat = CATEGORY_COLOR_MAP[newSupplierCategories[0]];
      await createSupplier({
        name: data.name.trim(),
        category: categoryStr,
        categoryColor: primaryCat?.color || "#8d785e",
        icon: newSupplierCategories[0] || "כללי",
        region: data.region,
        phone: data.phone.trim(),
      });
      appToast.success(
        "הספק נוסף בהצלחה למאגר",
        "ניתן כעת לשייך אותו לפרויקטים"
      );
      setShowAddSupplier(false);
      resetSupplierForm();
      setNewSupplierCategories(["תחבורה"]);
    } catch (err) {
      console.error("[SupplierBank] Failed to create supplier:", err);
      appToast.error("שגיאה ביצירת ספק", String(err));
    } finally {
      setSaving(false);
    }
  };

  const supplierList = suppliers ?? [];

  const filtered = supplierList.filter((s) => {
    // Filter out archived suppliers
    if (s.category === "ארכיון") {
      return false;
    }
    const cats = s.category.split(",").map((c) => c.trim());
    const hebrewCats = cats.map(categoryToHebrew);
    const hebrewRegion = regionToHebrew(s.region);
    const matchesSearch =
      !search ||
      s.name.includes(search) ||
      s.category.includes(search) ||
      hebrewCats.some((c) => c.includes(search)) ||
      s.region.includes(search) ||
      hebrewRegion.includes(search);
    const matchesCategory =
      selectedCategory === "כל הקטגוריות" ||
      cats.includes(selectedCategory) ||
      hebrewCats.includes(selectedCategory);
    const matchesRegion =
      selectedRegion === "כל הארץ" ||
      s.region === selectedRegion ||
      hebrewRegion === selectedRegion;
    const matchesStatus =
      selectedStatus === "הכל" ||
      (selectedStatus === "מאומת" && s.verificationStatus === "verified") ||
      (selectedStatus === "ממתין" && s.verificationStatus === "pending") ||
      (selectedStatus === "לא מאומת" && s.verificationStatus === "unverified");
    return matchesSearch && matchesCategory && matchesRegion && matchesStatus;
  });

  const clearFilters = () => {
    setSelectedCategory("כל הקטגוריות");
    setSelectedRegion("כל הארץ");
    setSelectedStatus("הכל");
    setSearch("");
    setCurrentPage(1);
  };

  const archivedCount = supplierList.filter(
    (s) => s.category === "ארכיון"
  ).length;

  return (
    <div className="mx-auto p-4 font-['Assistant',sans-serif] lg:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <CategoryIcon category="אולמות וגנים" color="#ff8c00" size={22} />
          </div>
          <h1
            className="text-[26px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            בנק ספקים
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {archivedCount > 0 && (
            <button
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[14px] text-muted-foreground transition-all hover:border-tertiary hover:text-foreground"
              onClick={() => navigate("/suppliers/archive")}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <Archive size={16} />
              ארכיון ({archivedCount})
            </button>
          )}
          <button
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[14px] text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover"
            onClick={() => setShowAddSupplier(true)}
            style={{ fontWeight: 600 }}
            type="button"
          >
            <Plus size={16} />
            הוספת ספק חדש
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <input
          className="w-full rounded-xl border border-border bg-card py-3 pr-10 pl-4 text-[14px] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש ספקים, קטגוריות או אזורים..."
          value={search}
        />
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="min-w-[160px] flex-1">
          <label
            className="mb-1 block text-[11px] text-muted-foreground"
            htmlFor="supplier-filter-category"
            style={{ fontWeight: 600 }}
          >
            קטגוריה
          </label>
          <select
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            id="supplier-filter-category"
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[160px] flex-1">
          <label
            className="mb-1 block text-[11px] text-muted-foreground"
            htmlFor="supplier-filter-region"
            style={{ fontWeight: 600 }}
          >
            אזור פעילות
          </label>
          <select
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            id="supplier-filter-region"
            onChange={(e) => setSelectedRegion(e.target.value)}
            value={selectedRegion}
          >
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[160px] flex-1">
          <label
            className="mb-1 block text-[11px] text-muted-foreground"
            htmlFor="supplier-filter-status"
            style={{ fontWeight: 600 }}
          >
            סטטוס אימות
          </label>
          <select
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            id="supplier-filter-status"
            onChange={(e) => setSelectedStatus(e.target.value)}
            value={selectedStatus}
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:text-primary"
            onClick={clearFilters}
            type="button"
          >
            <Filter size={13} />
            ניקוי מסננים
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="mb-5 flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 shadow-sm">
          <Loader2 className="mb-3 animate-spin text-primary" size={32} />
          <p className="text-[14px] text-muted-foreground">טוען ספקים...</p>
        </div>
      ) : error ? (
        <div className="mb-5 flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 shadow-sm">
          <AlertTriangle className="mb-3 text-destructive" size={32} />
          <p className="text-[14px] text-destructive">{error}</p>
        </div>
      ) : (
        <div className="mb-5 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border border-b bg-accent">
                  {[
                    "ספק",
                    "קטגוריה",
                    "אזור",
                    "דירוג",
                    "סטטוס אימות",
                    "הערות",
                    "פעולות",
                  ].map((h) => (
                    <th
                      className="whitespace-nowrap p-3 text-right text-[12px] text-muted-foreground"
                      key={h}
                      style={{ fontWeight: 600 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered
                  .slice(
                    (currentPage - 1) * ITEMS_PER_PAGE,
                    currentPage * ITEMS_PER_PAGE
                  )
                  .map((supplier) => (
                    <tr
                      className="border-accent border-b transition-colors hover:bg-accent/50"
                      key={supplier.id}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: `${supplier.categoryColor}15`,
                            }}
                          >
                            <CategoryIcon
                              category={
                                supplier.category.split(",")[0]?.trim() ||
                                supplier.category
                              }
                              color={supplier.categoryColor}
                              size={18}
                            />
                          </div>
                          <div>
                            <div
                              className="text-[14px] text-foreground"
                              style={{ fontWeight: 600 }}
                            >
                              {supplier.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {supplier.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {supplier.category
                            .split(",")
                            .map((c) => c.trim())
                            .filter(Boolean)
                            .map((cat) => {
                              const cm = CATEGORY_COLOR_MAP[cat];
                              const color =
                                cm?.color ||
                                supplier.categoryColor ||
                                "#8d785e";
                              return (
                                <span
                                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]"
                                  key={cat}
                                  style={{
                                    backgroundColor: `${color}15`,
                                    color,
                                    fontWeight: 600,
                                  }}
                                >
                                  <CategoryIcon
                                    category={cat}
                                    color={color}
                                    size={12}
                                  />
                                  {categoryToHebrew(cat)}
                                </span>
                              );
                            })}
                        </div>
                      </td>
                      <td className="p-3 text-[13px] text-muted-foreground">
                        {regionToHebrew(supplier.region)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <span
                            className="text-[13px] text-foreground"
                            style={{ fontWeight: 600 }}
                          >
                            {supplier.rating}
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                className={
                                  s <= supplier.rating
                                    ? "text-primary"
                                    : "text-tertiary"
                                }
                                fill={s <= supplier.rating ? "#ff8c00" : "none"}
                                key={s}
                                size={12}
                              />
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {supplier.verificationStatus === "verified" && (
                          <span
                            className="flex items-center gap-1 text-[12px] text-success"
                            style={{ fontWeight: 600 }}
                          >
                            <CheckCircle size={14} /> מאומת
                          </span>
                        )}
                        {supplier.verificationStatus === "pending" && (
                          <span
                            className="flex items-center gap-1 text-[12px] text-warning"
                            style={{ fontWeight: 600 }}
                          >
                            <Clock size={14} /> ממתין
                          </span>
                        )}
                        {supplier.verificationStatus === "unverified" && (
                          <span
                            className="flex items-center gap-1 text-[12px] text-muted-foreground"
                            style={{ fontWeight: 600 }}
                          >
                            <AlertTriangle size={14} /> לא מאומת
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[12px]">
                        {(() => {
                          const notes = computeAutoNotesFromSummary(
                            supplier,
                            summaries?.[supplier.id]
                          );
                          if (notes.length === 0) {
                            return <span className="text-tertiary">-</span>;
                          }
                          const first = notes[0];
                          const styles = noteLevelStyles(first.level);
                          return (
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`}
                              />
                              <span
                                className={`${styles.text} leading-tight`}
                                style={{ fontWeight: 500 }}
                              >
                                {first.text}
                              </span>
                              {notes.length > 1 && (
                                <span
                                  className="shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[10px] text-tertiary"
                                  style={{ fontWeight: 600 }}
                                >
                                  +{notes.length - 1}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <button
                            className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                            onClick={() =>
                              navigate(`/suppliers/${supplier.id}`)
                            }
                            type="button"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                            onClick={() =>
                              navigate(`/suppliers/${supplier.id}`)
                            }
                            type="button"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                            onClick={() => {
                              const text = `${supplier.name}\nקטגוריות: ${supplier.category
                                .split(",")
                                .map((c) => categoryToHebrew(c.trim()))
                                .join(
                                  ", "
                                )}\nאזור: ${regionToHebrew(supplier.region)}\nטלפון: ${supplier.phone}\nדירוג: ${supplier.rating}`;
                              navigator.clipboard
                                .writeText(text)
                                .then(() => {
                                  appToast.info(
                                    "הספק הועתק",
                                    `פרטי "${supplier.name}" הועתקו ללוח`
                                  );
                                })
                                .catch(() =>
                                  appToast.info(
                                    "הספק הועתק",
                                    "פרטי הספק הועתקו ללוח"
                                  )
                                );
                            }}
                            type="button"
                          >
                            <Copy size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-border border-t bg-accent p-3">
            <span className="text-[12px] text-muted-foreground">
              מציג{" "}
              {Math.min(
                (currentPage - 1) * ITEMS_PER_PAGE + 1,
                filtered.length
              )}
              -{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} מתוך{" "}
              {filtered.length} ספקים
            </span>
            {(() => {
              const totalPages = Math.max(
                1,
                Math.ceil(filtered.length / ITEMS_PER_PAGE)
              );
              return (
                <div className="flex items-center gap-1">
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card disabled:opacity-30"
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
                            : "text-muted-foreground hover:bg-card"
                        }`}
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{ fontWeight: currentPage === page ? 600 : 400 }}
                        type="button"
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card disabled:opacity-30"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    type="button"
                  >
                    <ChevronLeft size={14} />
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ══════════ Supplier Map ══════════ */}
      <div className="mt-6">
        <SupplierMap />
      </div>

      {/* Add supplier modal */}
      {showAddSupplier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setShowAddSupplier(false);
            resetSupplierForm();
          }}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl"
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-[20px] text-foreground"
                style={{ fontWeight: 700 }}
              >
                הוספת ספק חדש
              </h2>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setShowAddSupplier(false);
                  resetSupplierForm();
                }}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="space-y-3"
              onSubmit={handleSubmit(onSubmitSupplier)}
            >
              <FormField
                error={errors.name}
                isDirty={dirtyFields.name}
                label="שם הספק"
                placeholder="שם הספק"
                required
                {...register("name", rules.requiredMin("שם הספק", 2))}
              />
              {duplicates && duplicates.length > 0 && (
                <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3">
                  <AlertTriangle
                    className="mt-0.5 shrink-0 text-warning"
                    size={16}
                  />
                  <div className="text-[12px] text-yellow-800">
                    <span style={{ fontWeight: 600 }}>ספק דומה כבר קיים:</span>{" "}
                    {duplicates.slice(0, 2).map((d: any) => (
                      <span key={d.id}>
                        {d.name}
                        {d.phone ? ` (${d.phone})` : ""}{" "}
                      </span>
                    ))}
                    <span className="mt-1 block text-yellow-700">להמשיך?</span>
                  </div>
                </div>
              )}
              {/* קטגוריות — multi-select */}
              <fieldset>
                <legend
                  className="mb-2 block text-[13px] text-muted-foreground"
                  style={{ fontWeight: 600 }}
                >
                  קטגוריות <span className="text-primary">*</span>
                  {newSupplierCategories.length > 0 && (
                    <span
                      className="mr-1 text-[11px] text-tertiary"
                      style={{ fontWeight: 400 }}
                    >
                      ({newSupplierCategories.length} נבחרו)
                    </span>
                  )}
                </legend>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.entries(CATEGORY_COLOR_MAP).map(
                    ([cat, { color }]) => {
                      const isSelected = newSupplierCategories.includes(cat);
                      return (
                        <button
                          className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[12px] transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-sm"
                              : "border-border bg-card hover:border-border hover:bg-surface"
                          }`}
                          key={cat}
                          onClick={() => {
                            setNewSupplierCategories((prev) =>
                              prev.includes(cat)
                                ? prev.filter((c) => c !== cat)
                                : [...prev, cat]
                            );
                          }}
                          style={{ fontWeight: isSelected ? 600 : 400 }}
                          type="button"
                        >
                          <div
                            className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded border transition-all ${
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-border bg-card"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                fill="none"
                                height="8"
                                viewBox="0 0 10 10"
                                width="8"
                              >
                                <title>Decorative icon</title>
                                <path
                                  d="M2 5L4.2 7.5L8 2.5"
                                  stroke="white"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                />
                              </svg>
                            )}
                          </div>
                          <CategoryIcon
                            category={cat}
                            color={isSelected ? color : "#8d785e"}
                            size={14}
                          />
                          <span
                            className={
                              isSelected
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {cat}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
                {newSupplierCategories.length === 0 && (
                  <p className="mt-1 text-[11px] text-destructive">
                    יש לבחור לפחות קטגוריה אחת
                  </p>
                )}
              </fieldset>
              <FormSelect
                error={errors.region}
                isDirty={dirtyFields.region}
                label="אזור"
                {...register("region")}
              >
                {regions
                  .filter((r) => r !== "כל הארץ")
                  .map((r) => (
                    <option key={r}>{r}</option>
                  ))}
              </FormSelect>
              <FormField
                error={errors.phone}
                isDirty={dirtyFields.phone}
                label="טלפון"
                placeholder="05X-XXXXXXX"
                {...register("phone", rules.israeliPhone(false))}
              />
              <div className="flex gap-3 pt-2">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={
                    saving || !isValid || newSupplierCategories.length === 0
                  }
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "הוסף ספק"
                  )}
                </button>
                <button
                  className="rounded-xl border border-border px-5 transition-colors hover:bg-accent"
                  onClick={() => {
                    setShowAddSupplier(false);
                    resetSupplierForm();
                  }}
                  type="button"
                >
                  ביטול
                </button>
              </div>
            </form>
            <div className="mt-4 flex gap-2 border-border border-t pt-4">
              <button
                className="text-[13px] text-primary hover:text-primary-hover"
                onClick={() => {
                  setShowAddSupplier(false);
                  resetSupplierForm();
                  navigate("/suppliers/import");
                }}
                style={{ fontWeight: 600 }}
                type="button"
              >
                ייבוא מאקסל →
              </button>
              <span className="text-tertiary">|</span>
              <button
                className="text-[13px] text-primary hover:text-primary-hover"
                onClick={() => {
                  setShowAddSupplier(false);
                  resetSupplierForm();
                  navigate("/suppliers/classify");
                }}
                style={{ fontWeight: 600 }}
                type="button"
              >
                אשף סיווג →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
