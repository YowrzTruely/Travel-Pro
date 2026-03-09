import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  Archive,
  ArchiveRestore,
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Mail,
  Package,
  Pencil,
  Phone,
  Plus,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { appToast } from "./AppToast";
import { CategoryIcon } from "./CategoryIcons";
import { useConfirmDelete } from "./ConfirmDeleteModal";
import { FormField, FormSelect, FormTextarea, rules } from "./FormField";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductEditor } from "./ProductEditor";
import { SupplierLocationMap } from "./SupplierLocationMap";
import { computeAutoNotes, noteLevelStyles } from "./supplierNotes";

// Re-export types that were previously imported from api.ts
export interface SupplierContact {
  _id?: any;
  email: string;
  id: string;
  name: string;
  phone: string;
  primary: boolean;
  role: string;
  supplierId: string;
}

export interface SupplierProduct {
  _id?: any;
  description: string;
  id: string;
  images?: { id: string; url: string; name: string; path?: string }[];
  name: string;
  notes?: string;
  price: number;
  supplierId: string;
  unit: string;
}

export interface SupplierDocument {
  _id?: any;
  expiry: string;
  fileName?: string;
  id: string;
  name: string;
  status: "valid" | "warning" | "expired";
  supplierId: string;
}

const VINEYARD_IMG =
  "https://images.unsplash.com/photo-1762330465953-75478d918896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW5leWFyZCUyMGdyYXBlJTIwaGlsbHNpZGUlMjBncmVlbnxlbnwxfHx8fDE3NzE0NjgyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080";

const tabItems = [
  { id: "info", label: "מידע כללי" },
  { id: "products", label: "מוצרים ושירותים" },
  { id: "docs", label: "מסמכים" },
  { id: "contacts", label: "אנשי קשר" },
];

const statusLabel: Record<string, string> = {
  verified: "מאומת",
  pending: "ממתין לאימות",
  unverified: "לא מאומת",
};

interface AddContactForm {
  contactEmail: string;
  contactName: string;
  contactPhone: string;
  contactRole: string;
}
interface AddProductForm {
  productDescription: string;
  productName: string;
  productPrice: string;
  productUnit: string;
}
interface EditSupplierForm {
  category: string;
  categoryColor: string;
  icon: string;
  name: string;
  notes: string;
  phone: string;
  rating: string;
  region: string;
  verificationStatus: string;
}

// Helper: parse comma-separated categories
function parseCategories(cat: string | undefined): string[] {
  if (!cat) {
    return [];
  }
  return cat
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

const CATEGORY_OPTIONS = [
  { value: "תחבורה", color: "#3b82f6" },
  { value: "מזון", color: "#22c55e" },
  { value: "אטרקציות", color: "#a855f7" },
  { value: "לינה", color: "#ec4899" },
  { value: "אולמות וגנים", color: "#f97316" },
  { value: "צילום", color: "#06b6d4" },
  { value: "מוזיקה", color: "#8b5cf6" },
  { value: "ציוד", color: "#64748b" },
  { value: "כללי", color: "#8d785e" },
];

const REGION_OPTIONS = [
  "צפון",
  "מרכז",
  "דרום",
  "ירושלים",
  "גולן",
  "שפלה",
  "שרון",
  "נגב",
  "אילת",
  "יהודה ושומרון",
];

export function SupplierDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("info");
  const [saving, setSaving] = useState(false);

  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [docExpiryEditing, setDocExpiryEditing] = useState<string | null>(null);
  const [docExpiryValue, setDocExpiryValue] = useState("");
  const [docSaving, setDocSaving] = useState<string | null>(null);

  // Product editor
  const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(
    null
  );

  const { requestDelete, modal: deleteModal } = useConfirmDelete();

  // Archive
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // Edit supplier
  const [showEditSupplier, setShowEditSupplier] = useState(false);
  const [savingSupplier, setSavingSupplier] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const contactForm = useForm<AddContactForm>({
    mode: "onChange",
    defaultValues: {
      contactName: "",
      contactRole: "",
      contactPhone: "",
      contactEmail: "",
    },
  });
  const productForm = useForm<AddProductForm>({
    mode: "onChange",
    defaultValues: {
      productName: "",
      productPrice: "",
      productDescription: "",
      productUnit: "אדם",
    },
  });
  const editSupplierForm = useForm<EditSupplierForm>({ mode: "onChange" });

  // ─── Convex Queries ───
  const supplierId = id as Id<"suppliers"> | undefined;
  const supplier = useQuery(
    api.suppliers.get,
    supplierId ? { id: supplierId as any } : "skip"
  );
  const contacts = useQuery(
    api.supplierContacts.listBySupplierId,
    supplierId ? { supplierId: supplierId as any } : "skip"
  );
  const products = useQuery(
    api.supplierProducts.listBySupplierId,
    supplierId ? { supplierId: supplierId as any } : "skip"
  );
  const documents = useQuery(
    api.supplierDocuments.listBySupplierId,
    supplierId ? { supplierId: supplierId as any } : "skip"
  );
  const insuranceCompliance = useQuery(
    api.supplierDocuments.checkInsuranceCompliance,
    supplierId ? { supplierId: supplierId as any } : "skip"
  );

  // ─── Convex Mutations ───
  const updateSupplier = useMutation(api.suppliers.update);
  const archiveSupplierMutation = useMutation(api.suppliers.archive);
  const addContact = useMutation(api.supplierContacts.create);
  const removeContact = useMutation(api.supplierContacts.remove);
  const addProduct = useMutation(api.supplierProducts.create);
  const removeProduct = useMutation(api.supplierProducts.remove);
  const createDocument = useMutation(api.supplierDocuments.create);
  const updateDocument = useMutation(api.supplierDocuments.update);

  // Loading state: any query still undefined
  const loading =
    supplier === undefined ||
    contacts === undefined ||
    products === undefined ||
    documents === undefined;

  // Normalize data for the UI (fallback to empty arrays when null/undefined)
  const contactsList: SupplierContact[] = (contacts ?? []) as any;
  const productsList: SupplierProduct[] = (products ?? []) as any;
  const documentsList: SupplierDocument[] = (documents ?? []) as any;

  const onAddContact = async (data: AddContactForm) => {
    if (!supplierId) {
      return;
    }
    try {
      setSaving(true);
      await addContact({
        supplierId: supplierId as any,
        name: data.contactName.trim(),
        role: data.contactRole.trim(),
        phone: data.contactPhone.trim(),
        email: data.contactEmail.trim(),
        primary: contactsList.length === 0,
      });
      setShowAddContact(false);
      contactForm.reset();
      appToast.success("איש קשר נוסף", `${data.contactName} נשמר בכרטיס הספק`);
    } catch (_err) {
      appToast.error("שגיאה בהוספת איש קשר");
    } finally {
      setSaving(false);
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      await removeContact({ id: contactId as any });
      appToast.success("איש קשר הוסר");
    } catch (_err) {
      appToast.error("שגיאה במחיקת איש קשר");
    }
  };

  const onAddProduct = async (data: AddProductForm) => {
    if (!supplierId) {
      return;
    }
    try {
      setSaving(true);
      await addProduct({
        supplierId: supplierId as any,
        name: data.productName.trim(),
        price: Number.parseFloat(data.productPrice) || 0,
        description: data.productDescription.trim(),
        unit: data.productUnit.trim(),
      });
      setShowAddProduct(false);
      productForm.reset({
        productName: "",
        productPrice: "",
        productDescription: "",
        productUnit: "אדם",
      });
      appToast.success("מוצר נוסף", `${data.productName} נשמר`);
    } catch (_err) {
      appToast.error("שגיאה בהוספת מוצר");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await removeProduct({ id: productId as any });
      appToast.success("מוצר הוסר");
    } catch (_err) {
      appToast.error("שגיאה במחיקת מוצר");
    }
  };

  const handleProductUpdate = (updated: SupplierProduct) => {
    // With Convex, the useQuery auto-updates. We only update the local editingProduct state.
    if (editingProduct?.id === updated.id) {
      setEditingProduct(updated);
    }
  };

  const archiveSupplier = async () => {
    if (!supplierId) {
      return;
    }
    try {
      setArchiving(true);
      await archiveSupplierMutation({ id: supplierId as any });
      appToast.success(
        "הספק הועבר לארכיון",
        `${supplier?.name} הועבר לארכיון בהצלחה`
      );
      navigate("/suppliers");
    } catch (_err) {
      appToast.error("שגיאה בהעברה לארכיון");
    } finally {
      setArchiving(false);
    }
  };

  const restoreSupplier = async () => {
    if (!supplierId) {
      return;
    }
    try {
      setArchiving(true);
      await updateSupplier({
        id: supplierId as any,
        category: "כללי",
        categoryColor: "#8d785e",
      });
      appToast.success(
        "הספק שוחזר בהצלחה",
        `${supplier?.name} חזר לבנק הספקים`
      );
    } catch (_err) {
      appToast.error("שגיאה בשחזור ספק");
    } finally {
      setArchiving(false);
    }
  };

  const isArchived = supplier?.category === "ארכיון";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="mb-3 animate-spin text-[#ff8c00]" size={32} />
        <p className="text-[#8d785e] text-[14px]">טוען פרטי ספק...</p>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AlertTriangle className="mb-3 text-[#ef4444]" size={32} />
        <p className="text-[#181510] text-[16px]" style={{ fontWeight: 600 }}>
          ספק לא נמצא
        </p>
        <button
          className="mt-3 text-[#ff8c00] text-[13px]"
          onClick={() => navigate("/suppliers")}
          style={{ fontWeight: 600 }}
          type="button"
        >
          חזור לבנק ספקים
        </button>
      </div>
    );
  }

  const verifBg =
    supplier.verificationStatus === "verified"
      ? "bg-green-50 text-green-600"
      : supplier.verificationStatus === "pending"
        ? "bg-yellow-50 text-yellow-600"
        : "bg-[#f5f3f0] text-[#8d785e]";
  const VerifIcon =
    supplier.verificationStatus === "verified"
      ? CheckCircle
      : supplier.verificationStatus === "pending"
        ? Clock
        : AlertTriangle;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2);

  return (
    <div className="mx-auto p-4 font-['Assistant',sans-serif] lg:p-6" dir="rtl">
      {/* Archived banner */}
      {isArchived && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-[#94a3b8]/30 bg-[#94a3b8]/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Archive className="text-[#64748b]" size={16} />
            <span
              className="text-[#475569] text-[14px]"
              style={{ fontWeight: 600 }}
            >
              ספק זה נמצא בארכיון
            </span>
          </div>
          <button
            className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-[13px] text-green-600 transition-all hover:bg-green-100 hover:text-green-700 disabled:opacity-50"
            disabled={archiving}
            onClick={restoreSupplier}
            style={{ fontWeight: 600 }}
            type="button"
          >
            {archiving ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <ArchiveRestore size={14} />
            )}
            {archiving ? "משחזר..." : "שחזור לבנק ספקים"}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            className="text-[#8d785e] transition-colors hover:text-[#181510]"
            onClick={() =>
              navigate(isArchived ? "/suppliers/archive" : "/suppliers")
            }
            type="button"
          >
            <ArrowRight size={20} />
          </button>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${supplier.categoryColor}15` }}
          >
            <CategoryIcon
              category={
                parseCategories(supplier.category)[0] || supplier.category
              }
              color={supplier.categoryColor}
              size={24}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-[#181510] text-[24px]"
                style={{ fontWeight: 700 }}
              >
                {supplier.name}
              </h1>
              <button
                className="flex items-center gap-1 rounded-lg bg-[#ff8c00]/10 px-2.5 py-1 text-[#ff8c00] text-[12px] transition-all hover:bg-[#ff8c00]/20 hover:text-[#e67e00]"
                onClick={() => {
                  editSupplierForm.reset({
                    name: supplier.name,
                    phone: supplier.phone || "",
                    category: supplier.category,
                    categoryColor: supplier.categoryColor,
                    region: supplier.region || "",
                    rating: String(supplier.rating),
                    verificationStatus: supplier.verificationStatus,
                    notes: supplier.notes || "",
                    icon: supplier.icon || "",
                  });
                  setSelectedCategories(parseCategories(supplier.category));
                  setShowEditSupplier(true);
                }}
                style={{ fontWeight: 600 }}
                type="button"
              >
                <Pencil size={12} /> עריכה
              </button>
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] ${verifBg}`}
                style={{ fontWeight: 600 }}
              >
                <VerifIcon size={12} />{" "}
                {statusLabel[supplier.verificationStatus]}
              </span>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {parseCategories(supplier.category).map((cat) => {
                const opt = CATEGORY_OPTIONS.find((o) => o.value === cat);
                const catColor = opt?.color || "#8d785e";
                return (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]"
                    key={cat}
                    style={{
                      backgroundColor: `${catColor}15`,
                      color: catColor,
                      fontWeight: 600,
                    }}
                  >
                    <CategoryIcon category={cat} color={catColor} size={12} />
                    {cat}
                  </span>
                );
              })}
              <span className="text-[#8d785e] text-[13px]">
                &bull; {supplier.region}
              </span>
              {supplier.phone && (
                <span className="text-[#8d785e] text-[13px]">
                  &bull; {supplier.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        {!isArchived && (
          <button
            className="flex items-center gap-1.5 rounded-xl border border-[#e7e1da] px-3 py-2 text-[#8d785e] text-[13px] transition-all hover:border-[#b8a990] hover:text-[#181510]"
            onClick={() => setShowArchiveConfirm(true)}
            style={{ fontWeight: 500 }}
            type="button"
          >
            <Archive size={15} />
            העבר לארכיון
          </button>
        )}
      </div>

      {/* Auto-note badges + manual note — below supplier details */}
      {(() => {
        const autoNotes = computeAutoNotes(
          supplier as any,
          documentsList,
          contactsList,
          productsList
        );
        const hasManual = supplier.notes && supplier.notes !== "-";
        if (autoNotes.length === 0 && !hasManual) {
          return null;
        }

        const NOTE_ICONS: Record<string, React.ElementType> = {
          "shield-alert": AlertTriangle,
          "file-warning": FileText,
          "alert-triangle": AlertTriangle,
          clock: Clock,
          "file-x": FileText,
          "user-x": Users,
          "phone-off": Phone,
          "package-x": Package,
        };

        return (
          <div className="mb-5 flex flex-col items-start gap-1.5">
            {autoNotes.map((note) => {
              const styles = noteLevelStyles(note.level);
              const NoteIcon = NOTE_ICONS[note.icon] || AlertTriangle;
              return (
                <span
                  className={`inline-flex items-center gap-1.5 ${styles.bg} border ${styles.border} rounded-full px-2.5 py-1`}
                  key={note.id}
                >
                  <NoteIcon className={styles.icon} size={12} />
                  <span
                    className={`text-[11px] ${styles.text} whitespace-nowrap`}
                    style={{ fontWeight: 500 }}
                  >
                    {note.text}
                  </span>
                </span>
              );
            })}
            {hasManual && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1">
                <AlertTriangle className="text-yellow-600" size={12} />
                <span
                  className="whitespace-nowrap text-[11px] text-yellow-800"
                  style={{ fontWeight: 500 }}
                >
                  הערה: {supplier.notes}
                </span>
              </span>
            )}
          </div>
        );
      })()}

      {/* Tabs */}
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-lg bg-[#ece8e3] p-1">
        {tabItems.map((tab) => (
          <button
            className={`whitespace-nowrap rounded-md px-4 py-2 text-[13px] transition-all ${
              activeTab === tab.id
                ? "bg-white text-[#181510] shadow-sm"
                : "text-[#8d785e] hover:text-[#181510]"
            }`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
            type="button"
          >
            {tab.label}
            {tab.id === "docs" &&
              insuranceCompliance &&
              (insuranceCompliance.compliant ? (
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-green-500" />
              ) : (
                <ShieldAlert className="mr-1 inline h-3.5 w-3.5 text-red-500" />
              ))}
            {tab.id === "contacts" && (
              <span className="mr-1 text-[#b8a990] text-[10px]">
                ({contactsList.length})
              </span>
            )}
            {tab.id === "products" && (
              <span className="mr-1 text-[#b8a990] text-[10px]">
                ({productsList.length})
              </span>
            )}
            {tab.id === "docs" && (
              <span className="mr-1 text-[#b8a990] text-[10px]">
                ({documentsList.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══ Info Tab ═══ */}
      {activeTab === "info" && (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            {/* Contacts preview */}
            <div className="rounded-xl border border-[#e7e1da] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3
                  className="text-[#181510] text-[16px]"
                  style={{ fontWeight: 700 }}
                >
                  אנשי קשר ({contactsList.length})
                </h3>
                <button
                  className="text-[#ff8c00] text-[12px]"
                  onClick={() => setActiveTab("contacts")}
                  style={{ fontWeight: 600 }}
                  type="button"
                >
                  צפה בכל →
                </button>
              </div>
              {contactsList.length === 0 ? (
                <p className="py-4 text-center text-[#b8a990] text-[13px]">
                  אין אנשי קשר
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {contactsList.slice(0, 2).map((contact) => (
                    <div
                      className="rounded-xl border border-[#e7e1da] p-4"
                      key={contact.id}
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] text-white ${contact.primary ? "bg-green-500" : "bg-[#ff8c00]"}`}
                          style={{ fontWeight: 600 }}
                        >
                          {getInitials(contact.name)}
                        </div>
                        <div>
                          <div
                            className="text-[#181510] text-[14px]"
                            style={{ fontWeight: 600 }}
                          >
                            {contact.name}
                          </div>
                          <div className="text-[#8d785e] text-[11px]">
                            {contact.role}
                          </div>
                        </div>
                        {contact.primary && (
                          <span
                            className="mr-auto rounded-full bg-green-50 px-2 py-0.5 text-[10px] text-green-600"
                            style={{ fontWeight: 600 }}
                          >
                            ראשי
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[#8d785e] text-[12px]">
                          <Phone size={12} /> {contact.phone}
                        </div>
                        <div className="flex items-center gap-2 text-[#8d785e] text-[12px]">
                          <Mail size={12} /> {contact.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Products preview */}
            <div className="rounded-xl border border-[#e7e1da] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3
                  className="text-[#181510] text-[16px]"
                  style={{ fontWeight: 700 }}
                >
                  מוצרים ושירותים ({productsList.length})
                </h3>
                <button
                  className="text-[#ff8c00] text-[12px]"
                  onClick={() => setActiveTab("products")}
                  style={{ fontWeight: 600 }}
                  type="button"
                >
                  צפה בכל →
                </button>
              </div>
              {productsList.length === 0 ? (
                <p className="py-4 text-center text-[#b8a990] text-[13px]">
                  אין מוצרים
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  {productsList.slice(0, 3).map((product) => {
                    const heroImg = product.images?.length
                      ? product.images[0].url
                      : null;
                    return (
                      // biome-ignore lint/a11y/useSemanticElements: Complex card component with images - using div with role="button" is appropriate
                      <div
                        className="group cursor-pointer overflow-hidden rounded-xl border border-[#e7e1da] transition-all hover:border-[#ff8c00]/40 hover:shadow-sm"
                        key={product.id}
                        onClick={() => setEditingProduct(product)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setEditingProduct(product);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        {/* Product image */}
                        {heroImg ? (
                          <div className="relative h-24 overflow-hidden bg-[#f5f3f0]">
                            <ImageWithFallback
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              src={heroImg}
                            />
                            {(product.images?.length || 0) > 1 && (
                              <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] text-white backdrop-blur-md">
                                <Camera size={9} />{" "}
                                {product.images?.length || 0}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex h-16 items-center justify-center bg-[#f5f3f0]">
                            <Package className="text-[#d0c8bb]" size={20} />
                          </div>
                        )}
                        <div className="p-3">
                          <div
                            className="flex items-center gap-1 text-[#181510] text-[13px] transition-colors group-hover:text-[#ff8c00]"
                            style={{ fontWeight: 600 }}
                          >
                            {product.name}
                            <Pencil
                              className="text-[#b8a990] transition-colors group-hover:text-[#ff8c00]"
                              size={10}
                            />
                          </div>
                          <div className="mt-1 line-clamp-2 text-[#8d785e] text-[11px]">
                            {product.description}
                          </div>
                          <div
                            className="mt-2 text-[#181510] text-[14px]"
                            style={{ fontWeight: 700 }}
                          >
                            ₪{product.price.toLocaleString()}
                            <span
                              className="text-[#8d785e] text-[11px]"
                              style={{ fontWeight: 400 }}
                            >
                              /{product.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-5">
            {/* Rating */}
            <div className="rounded-xl border border-[#e7e1da] bg-white p-5">
              <h3
                className="mb-3 text-[#181510] text-[14px]"
                style={{ fontWeight: 700 }}
              >
                דירוג
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className="text-[#181510] text-[28px]"
                  style={{ fontWeight: 800 }}
                >
                  {supplier.rating}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      className={`text-[18px] ${s <= supplier.rating ? "text-[#ff8c00]" : "text-[#ddd6cb]"}`}
                      key={s}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <SupplierLocationMap
              onUpdate={() => {
                // Convex auto-updates via useQuery, no manual state update needed
              }}
              supplier={supplier as any}
            />

            {/* Documents summary */}
            <div className="rounded-xl border border-[#e7e1da] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3
                  className="text-[#181510] text-[14px]"
                  style={{ fontWeight: 700 }}
                >
                  מסמכים ותקינות
                </h3>
                <button
                  className="text-[#ff8c00] text-[11px]"
                  onClick={() => setActiveTab("docs")}
                  style={{ fontWeight: 600 }}
                  type="button"
                >
                  ניהול →
                </button>
              </div>
              {(() => {
                const requiredNames = [
                  "רישיון עסק",
                  "תעודת כשרות",
                  "ביטוח צד ג'",
                ];
                const getStatus = (expiry: string) => {
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
                return (
                  <div className="space-y-2">
                    {requiredNames.map((name) => {
                      const doc = documentsList.find((d) => d.name === name);
                      const status = doc ? getStatus(doc.expiry) : null;
                      return (
                        <div
                          className={`flex items-center justify-between rounded-lg border p-2.5 ${
                            doc
                              ? status === "expired"
                                ? "border-red-200 bg-red-50"
                                : status === "warning"
                                  ? "border-yellow-200 bg-yellow-50"
                                  : "border-green-200 bg-green-50"
                              : "border-[#d4cdc3] border-dashed bg-[#f8f7f5]"
                          }`}
                          key={name}
                        >
                          <div className="flex items-center gap-2">
                            {doc ? (
                              status === "valid" ? (
                                <CheckCircle
                                  className="text-green-500"
                                  size={13}
                                />
                              ) : status === "warning" ? (
                                <AlertTriangle
                                  className="text-yellow-500"
                                  size={13}
                                />
                              ) : (
                                <AlertTriangle
                                  className="text-red-500"
                                  size={13}
                                />
                              )
                            ) : (
                              <Upload className="text-[#b8a990]" size={13} />
                            )}
                            <span
                              className="text-[#181510] text-[12px]"
                              style={{ fontWeight: 500 }}
                            >
                              {name}
                            </span>
                          </div>
                          {doc ? (
                            <span
                              className={`text-[10px] ${status === "expired" ? "text-red-500" : status === "warning" ? "text-yellow-600" : "text-green-600"}`}
                              style={{ fontWeight: 600 }}
                            >
                              {new Date(doc.expiry).toLocaleDateString(
                                "he-IL",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          ) : (
                            <span
                              className="text-[#b8a990] text-[10px]"
                              style={{ fontWeight: 600 }}
                            >
                              חסר
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Contacts Tab ═══ */}
      {activeTab === "contacts" && (
        <div className="rounded-xl border border-[#e7e1da] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3
              className="text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              אנשי קשר ({contactsList.length})
            </h3>
            <button
              className="flex items-center gap-1 text-[#ff8c00] text-[13px]"
              onClick={() => setShowAddContact(true)}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <Plus size={14} /> הוספת איש קשר
            </button>
          </div>
          {contactsList.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mb-2 flex justify-center">
                <Users className="text-[#d0c8bb]" size={32} />
              </div>
              <p className="text-[#8d785e] text-[14px]">אין אנשי קשר</p>
              <button
                className="mt-2 text-[#ff8c00] text-[13px]"
                onClick={() => setShowAddContact(true)}
                style={{ fontWeight: 600 }}
                type="button"
              >
                הוסף איש קשר ראשון
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {contactsList.map((contact) => (
                <div
                  className="flex items-center justify-between rounded-xl border border-[#e7e1da] p-4"
                  key={contact.id}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] text-white ${contact.primary ? "bg-green-500" : "bg-[#ff8c00]"}`}
                      style={{ fontWeight: 600 }}
                    >
                      {getInitials(contact.name)}
                    </div>
                    <div>
                      <div
                        className="text-[#181510] text-[14px]"
                        style={{ fontWeight: 600 }}
                      >
                        {contact.name}
                        {contact.primary && (
                          <span
                            className="mr-2 rounded-full bg-green-50 px-2 py-0.5 text-[10px] text-green-600"
                            style={{ fontWeight: 600 }}
                          >
                            ראשי
                          </span>
                        )}
                      </div>
                      <div className="text-[#8d785e] text-[12px]">
                        {contact.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-[#8d785e] text-[12px]">
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {contact.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail size={12} />
                        {contact.email}
                      </span>
                    </div>
                    <button
                      className="text-[#c4b89a] transition-colors hover:text-red-500"
                      onClick={() =>
                        requestDelete({
                          title: "מחיקת איש קשר",
                          itemName: contact.name,
                          onConfirm: () => deleteContact(contact.id),
                        })
                      }
                      type="button"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ Products Tab ═══ */}
      {activeTab === "products" && (
        <div className="rounded-xl border border-[#e7e1da] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3
              className="text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              מוצרים ושירותים ({productsList.length})
            </h3>
            <button
              className="flex items-center gap-1 text-[#ff8c00] text-[13px]"
              onClick={() => setShowAddProduct(true)}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <Plus size={14} /> הוספת מוצר
            </button>
          </div>
          {productsList.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mb-2 flex justify-center">
                <Package className="text-[#d0c8bb]" size={32} />
              </div>
              <p className="text-[#8d785e] text-[14px]">אין מוצרים</p>
              <button
                className="mt-2 text-[#ff8c00] text-[13px]"
                onClick={() => setShowAddProduct(true)}
                style={{ fontWeight: 600 }}
                type="button"
              >
                הוסף מוצר ראשון
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {productsList.map((product) => {
                const imageCount = product.images?.length || 0;
                const heroImg =
                  imageCount > 0 && product.images?.[0]
                    ? product.images[0].url
                    : VINEYARD_IMG;
                return (
                  // biome-ignore lint/a11y/useSemanticElements: Complex card component with images - using div with role="button" is appropriate
                  <div
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#e7e1da] transition-all hover:border-[#ff8c00]/40 hover:shadow-lg"
                    key={product.id}
                    onClick={() => setEditingProduct(product)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setEditingProduct(product);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Delete button */}
                    <button
                      className="absolute top-2 left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#c4b89a] opacity-0 shadow-sm transition-all hover:text-red-500 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        requestDelete({
                          title: "מחיקת מוצר",
                          itemName: product.name,
                          onConfirm: () => deleteProduct(product.id),
                        });
                      }}
                      type="button"
                    >
                      <Trash2 size={12} />
                    </button>

                    {/* Edit badge */}
                    <div
                      className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-[#ff8c00] px-2 py-0.5 text-[10px] text-white opacity-0 shadow-sm transition-all group-hover:opacity-100"
                      style={{ fontWeight: 600 }}
                    >
                      <Pencil size={10} /> עריכה
                    </div>

                    {/* Image */}
                    <div className="relative flex h-32 items-center justify-center overflow-hidden bg-[#f5f3f0]">
                      <ImageWithFallback
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        src={heroImg}
                      />
                      {/* Image count */}
                      {imageCount > 1 && (
                        <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white backdrop-blur-md">
                          <Camera size={10} /> {imageCount}
                        </span>
                      )}
                      {/* Price tag */}
                      <span
                        className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[#181510] text-[12px] shadow-sm backdrop-blur-sm"
                        style={{ fontWeight: 700 }}
                      >
                        ₪{product.price.toLocaleString()}/{product.unit}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div
                        className="text-[#181510] text-[14px] transition-colors group-hover:text-[#ff8c00]"
                        style={{ fontWeight: 600 }}
                      >
                        {product.name}
                      </div>
                      <div className="mt-1 line-clamp-2 text-[#8d785e] text-[12px]">
                        {product.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ Docs Tab ═══ */}
      {activeTab === "docs" &&
        (() => {
          const REQUIRED_DOCS = [
            { key: "רישיון עסק", shieldIcon: ShieldCheck },
            { key: "תעודת כשרות", shieldIcon: ShieldCheck },
            { key: "ביטוח צד ג'", shieldIcon: Shield },
          ] as const;

          const getDocStatus = (
            expiry: string
          ): "valid" | "warning" | "expired" => {
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

          const formatExpiryDate = (dateStr: string) => {
            if (!dateStr) {
              return "";
            }
            const d = new Date(dateStr);
            return d.toLocaleDateString("he-IL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          };

          const handleUploadDoc = async (
            docName: string,
            expiryDate: string,
            fileName: string
          ) => {
            if (!(supplierId && expiryDate)) {
              return;
            }
            try {
              setDocSaving(docName);
              const status = getDocStatus(expiryDate);
              const existing = documentsList.find((d) => d.name === docName);
              if (existing) {
                await updateDocument({
                  id: existing.id as any,
                  expiry: expiryDate,
                  status,
                  fileName,
                });
              } else {
                await createDocument({
                  supplierId: supplierId as any,
                  name: docName,
                  expiry: expiryDate,
                  status,
                  fileName,
                });
              }
              appToast.success(
                "מסמך הועלה בהצלחה",
                `${docName} נשמר עם תוקף ${formatExpiryDate(expiryDate)}`
              );
            } catch (err) {
              console.error("[SupplierDetail] doc upload error:", err);
              appToast.error("שגיאה בשמירת מסמך");
            } finally {
              setDocSaving(null);
            }
          };

          return (
            <div className="rounded-xl border border-[#e7e1da] bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3
                  className="text-[#181510] text-[20px]"
                  style={{ fontWeight: 700 }}
                >
                  מסמכים ותקינות
                </h3>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5f3f0] transition-colors hover:bg-[#ece8e3]"
                  onClick={() => setActiveTab("docs")}
                  title="העלאה"
                  type="button"
                >
                  <Upload className="text-[#8d785e]" size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {REQUIRED_DOCS.map(
                  ({ key: docName, shieldIcon: ShieldIcon }) => {
                    const doc = documentsList.find((d) => d.name === docName);
                    const hasDoc = !!doc;
                    const status = hasDoc ? getDocStatus(doc.expiry) : null;
                    const isExpired = status === "expired";
                    const isWarning = status === "warning";
                    const isEditing = docExpiryEditing === docName;
                    const isSaving = docSaving === docName;

                    return (
                      <div key={docName}>
                        <div
                          className={`relative rounded-2xl border-2 p-5 transition-all ${
                            hasDoc
                              ? isExpired
                                ? "border-red-200 bg-gradient-to-l from-red-50 to-red-50/30"
                                : isWarning
                                  ? "border-yellow-200 bg-gradient-to-l from-yellow-50 to-yellow-50/30"
                                  : "border-green-200 bg-gradient-to-l from-green-50 to-green-50/30"
                              : "cursor-pointer border-[#d4cdc3] border-dashed bg-[#faf9f7] hover:border-[#ff8c00]/40 hover:bg-[#fffaf3]"
                          }`}
                          onClick={() => {
                            if (!(hasDoc || isEditing)) {
                              setDocExpiryEditing(docName);
                              setDocExpiryValue("");
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                                  hasDoc
                                    ? isExpired
                                      ? "bg-red-100"
                                      : isWarning
                                        ? "bg-yellow-100"
                                        : "bg-green-100"
                                    : "bg-[#ece8e3]"
                                }`}
                              >
                                {hasDoc ? (
                                  isExpired ? (
                                    <AlertTriangle
                                      className="text-red-500"
                                      size={18}
                                    />
                                  ) : (
                                    <CheckCircle
                                      className={
                                        isWarning
                                          ? "text-yellow-500"
                                          : "text-green-600"
                                      }
                                      size={18}
                                    />
                                  )
                                ) : (
                                  <Upload
                                    className="text-[#8d785e]"
                                    size={18}
                                  />
                                )}
                              </div>
                              <div>
                                <div
                                  className="text-[#181510] text-[16px]"
                                  style={{ fontWeight: 700 }}
                                >
                                  {docName}
                                </div>
                                {hasDoc ? (
                                  <div
                                    className={`mt-0.5 text-[13px] ${isExpired ? "text-red-500" : isWarning ? "text-yellow-600" : "text-green-600"}`}
                                    style={{ fontWeight: 500 }}
                                  >
                                    {isExpired
                                      ? `פג תוקף ב-${formatExpiryDate(doc.expiry)}`
                                      : `בתוקף עד: ${formatExpiryDate(doc.expiry)}`}
                                  </div>
                                ) : (
                                  <div className="mt-0.5 text-[#b8a990] text-[13px]">
                                    לא הועלה — לחץ להעלאה
                                  </div>
                                )}
                              </div>
                            </div>
                            <div
                              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                                hasDoc
                                  ? isExpired
                                    ? "bg-red-100"
                                    : isWarning
                                      ? "bg-yellow-100"
                                      : "bg-green-100"
                                  : "bg-[#ece8e3]"
                              }`}
                            >
                              {hasDoc ? (
                                isExpired ? (
                                  <ShieldAlert
                                    className="text-red-500"
                                    size={22}
                                  />
                                ) : (
                                  <ShieldIcon
                                    className={
                                      isWarning
                                        ? "text-yellow-500"
                                        : "text-green-600"
                                    }
                                    size={22}
                                  />
                                )
                              ) : (
                                <Shield className="text-[#b8a990]" size={22} />
                              )}
                            </div>
                          </div>
                          {hasDoc && doc.fileName && (
                            <div className="mt-3 mr-14 flex items-center gap-2">
                              <FileText className="text-[#8d785e]" size={12} />
                              <span className="text-[#8d785e] text-[11px]">
                                {doc.fileName}
                              </span>
                            </div>
                          )}
                          {hasDoc && !isEditing && (
                            <div className="mt-3 mr-14 flex items-center gap-2">
                              <button
                                className="flex items-center gap-1 text-[#ff8c00] text-[11px] transition-colors hover:text-[#e67e00]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDocExpiryEditing(docName);
                                  setDocExpiryValue(doc.expiry);
                                }}
                                style={{ fontWeight: 600 }}
                                type="button"
                              >
                                <CalendarDays size={12} /> עדכן תוקף
                              </button>
                              <span className="text-[#e7e1da]">|</span>
                              <label
                                className="flex cursor-pointer items-center gap-1 text-[#ff8c00] text-[11px] transition-colors hover:text-[#e67e00]"
                                style={{ fontWeight: 600 }}
                              >
                                <Upload size={12} /> החלף קובץ
                                <input
                                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleUploadDoc(
                                        docName,
                                        doc.expiry,
                                        file.name
                                      );
                                    }
                                    e.target.value = "";
                                  }}
                                  type="file"
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        {isEditing && (
                          <div className="mt-3 space-y-3 rounded-xl border border-[#e7e1da] bg-[#f8f7f5] p-4">
                            <div
                              className="text-[#181510] text-[13px]"
                              style={{ fontWeight: 600 }}
                            >
                              {hasDoc
                                ? `עדכון תוקף — ${docName}`
                                : `העלאת ${docName}`}
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label
                                  className="mb-1 block text-[#8d785e] text-[12px]"
                                  htmlFor="doc-expiry"
                                  style={{ fontWeight: 600 }}
                                >
                                  תאריך תוקף
                                </label>
                                <input
                                  className="w-full rounded-lg border border-[#e7e1da] bg-white px-3 py-2.5 text-[#181510] text-[13px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/10"
                                  id="doc-expiry"
                                  onChange={(e) =>
                                    setDocExpiryValue(e.target.value)
                                  }
                                  type="date"
                                  value={docExpiryValue}
                                />
                              </div>
                              {!hasDoc && (
                                <div>
                                  <label
                                    className="mb-1 block text-[#8d785e] text-[12px]"
                                    htmlFor="doc-file-upload"
                                    style={{ fontWeight: 600 }}
                                  >
                                    קובץ מסמך
                                  </label>
                                  <label
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#e7e1da] bg-white px-3 py-2.5 transition-colors hover:border-[#ff8c00]/40"
                                    htmlFor="doc-file-upload"
                                  >
                                    <Upload
                                      className="text-[#8d785e]"
                                      size={14}
                                    />
                                    <span className="text-[#8d785e] text-[13px]">
                                      בחר קובץ...
                                    </span>
                                    <input
                                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                      className="hidden"
                                      id="doc-file-upload"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file && docExpiryValue) {
                                          handleUploadDoc(
                                            docName,
                                            docExpiryValue,
                                            file.name
                                          );
                                          setDocExpiryEditing(null);
                                          setDocExpiryValue("");
                                        } else if (file && !docExpiryValue) {
                                          appToast.warning(
                                            "נא לבחור תאריך תוקף לפני העלאה"
                                          );
                                        }
                                        e.target.value = "";
                                      }}
                                      type="file"
                                    />
                                  </label>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {hasDoc && (
                                <button
                                  className="flex items-center gap-1.5 rounded-lg bg-[#ff8c00] px-4 py-2 text-[12px] text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
                                  disabled={!docExpiryValue || isSaving}
                                  onClick={() => {
                                    if (docExpiryValue) {
                                      handleUploadDoc(
                                        docName,
                                        docExpiryValue,
                                        doc.fileName || ""
                                      );
                                      setDocExpiryEditing(null);
                                      setDocExpiryValue("");
                                    }
                                  }}
                                  style={{ fontWeight: 600 }}
                                  type="button"
                                >
                                  {isSaving ? (
                                    <Loader2
                                      className="animate-spin"
                                      size={13}
                                    />
                                  ) : (
                                    <Save size={13} />
                                  )}
                                  {isSaving ? "שומר..." : "שמור"}
                                </button>
                              )}
                              <button
                                className="rounded-lg px-3 py-2 text-[#8d785e] text-[12px] transition-colors hover:text-[#181510]"
                                onClick={() => {
                                  setDocExpiryEditing(null);
                                  setDocExpiryValue("");
                                }}
                                style={{ fontWeight: 600 }}
                                type="button"
                              >
                                ביטול
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {documentsList.filter(
                (d) =>
                  !["רישיון עסק", "תעודת כשרות", "ביטוח צד ג'"].includes(d.name)
              ).length > 0 && (
                <div className="mt-6 border-[#e7e1da] border-t pt-5">
                  <h4
                    className="mb-3 text-[#181510] text-[14px]"
                    style={{ fontWeight: 600 }}
                  >
                    מסמכים נוספים
                  </h4>
                  <div className="space-y-2">
                    {documentsList
                      .filter(
                        (d) =>
                          ![
                            "רישיון עסק",
                            "תעודת כשרות",
                            "ביטוח צד ג'",
                          ].includes(d.name)
                      )
                      .map((doc) => (
                        <div
                          className={`flex items-center justify-between rounded-xl border p-3 ${
                            doc.status === "expired"
                              ? "border-red-200 bg-red-50"
                              : doc.status === "warning"
                                ? "border-yellow-200 bg-yellow-50"
                                : "border-green-200 bg-green-50"
                          }`}
                          key={doc.id}
                        >
                          <div className="flex items-center gap-2">
                            <FileText
                              className={
                                doc.status === "expired"
                                  ? "text-red-500"
                                  : doc.status === "warning"
                                    ? "text-yellow-500"
                                    : "text-green-500"
                              }
                              size={15}
                            />
                            <span
                              className="text-[#181510] text-[13px]"
                              style={{ fontWeight: 500 }}
                            >
                              {doc.name}
                            </span>
                          </div>
                          <span
                            className={`text-[12px] ${doc.status === "expired" ? "text-red-500" : doc.status === "warning" ? "text-yellow-600" : "text-green-600"}`}
                            style={{ fontWeight: 600 }}
                          >
                            {formatExpiryDate(doc.expiry)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      {/* ═══ Add Contact Modal ═══ */}
      {showAddContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setShowAddContact(false);
            contactForm.reset();
          }}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3
                className="text-[#181510] text-[20px]"
                style={{ fontWeight: 700 }}
              >
                הוספת איש קשר
              </h3>
              <button
                className="text-[#8d785e] hover:text-[#181510]"
                onClick={() => {
                  setShowAddContact(false);
                  contactForm.reset();
                }}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="space-y-3"
              onSubmit={contactForm.handleSubmit(onAddContact)}
            >
              <FormField
                error={contactForm.formState.errors.contactName}
                isDirty={contactForm.formState.dirtyFields.contactName}
                label="שם מלא"
                placeholder="שם מלא"
                required
                {...contactForm.register(
                  "contactName",
                  rules.requiredMin("שם", 2)
                )}
              />
              <FormField
                error={contactForm.formState.errors.contactRole}
                isDirty={contactForm.formState.dirtyFields.contactRole}
                label="תפקיד"
                placeholder="תפקיד"
                required
                {...contactForm.register(
                  "contactRole",
                  rules.required("תפקיד")
                )}
              />
              <FormField
                error={contactForm.formState.errors.contactPhone}
                isDirty={contactForm.formState.dirtyFields.contactPhone}
                label="טלפון"
                placeholder="05X-XXXXXXX"
                {...contactForm.register(
                  "contactPhone",
                  rules.israeliPhone(true)
                )}
              />
              <FormField
                error={contactForm.formState.errors.contactEmail}
                isDirty={contactForm.formState.dirtyFields.contactEmail}
                label="אימייל"
                placeholder="email@example.com"
                {...contactForm.register("contactEmail", rules.email(true))}
              />
              <div className="flex gap-3 pt-2">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-2.5 text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
                  disabled={saving || !contactForm.formState.isValid}
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                  {saving ? "שומר..." : "הוסף"}
                </button>
                <button
                  className="rounded-xl border border-[#e7e1da] px-5 transition-colors hover:bg-[#f5f3f0]"
                  onClick={() => {
                    setShowAddContact(false);
                    contactForm.reset();
                  }}
                  type="button"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Add Product Modal ═══ */}
      {showAddProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setShowAddProduct(false);
            productForm.reset();
          }}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3
                className="text-[#181510] text-[20px]"
                style={{ fontWeight: 700 }}
              >
                הוספת מוצר / שירות
              </h3>
              <button
                className="text-[#8d785e] hover:text-[#181510]"
                onClick={() => {
                  setShowAddProduct(false);
                  productForm.reset();
                }}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="space-y-3"
              onSubmit={productForm.handleSubmit(onAddProduct)}
            >
              <FormField
                error={productForm.formState.errors.productName}
                isDirty={productForm.formState.dirtyFields.productName}
                label="שם מוצר"
                placeholder="למשל: סיור מודרך"
                required
                {...productForm.register(
                  "productName",
                  rules.requiredMin("שם מוצר", 2)
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  error={productForm.formState.errors.productPrice}
                  isDirty={productForm.formState.dirtyFields.productPrice}
                  label="מחיר"
                  placeholder="₪"
                  required
                  type="number"
                  {...productForm.register(
                    "productPrice",
                    rules.positivePrice("מחיר")
                  )}
                />
                <FormField
                  error={productForm.formState.errors.productUnit}
                  isDirty={productForm.formState.dirtyFields.productUnit}
                  label="יחידה"
                  placeholder="אדם / אירוע / יום"
                  {...productForm.register("productUnit")}
                />
              </div>
              <FormField
                error={productForm.formState.errors.productDescription}
                isDirty={productForm.formState.dirtyFields.productDescription}
                label="תיאור"
                placeholder="פרטים נוספים..."
                {...productForm.register("productDescription")}
              />
              <div className="flex gap-3 pt-2">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-2.5 text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
                  disabled={saving || !productForm.formState.isValid}
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                  {saving ? "שומר..." : "הוסף מוצר"}
                </button>
                <button
                  className="rounded-xl border border-[#e7e1da] px-5 transition-colors hover:bg-[#f5f3f0]"
                  onClick={() => {
                    setShowAddProduct(false);
                    productForm.reset();
                  }}
                  type="button"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Product Editor Drawer ═══ */}
      {editingProduct && id && (
        <ProductEditor
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleProductUpdate}
          product={editingProduct}
        />
      )}

      {/* ═══ Archive Confirm Modal ═══ */}
      {showArchiveConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setShowArchiveConfirm(false);
          }}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3
                className="text-[#181510] text-[20px]"
                style={{ fontWeight: 700 }}
              >
                העברה לארכיון
              </h3>
              <button
                className="text-[#8d785e] hover:text-[#181510]"
                onClick={() => {
                  setShowArchiveConfirm(false);
                }}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-[#8d785e] text-[14px]">
                האם אתה בטוח שברצונך להעביר את הספק{" "}
                <strong className="text-[#181510]">{supplier?.name}</strong>{" "}
                לארכיון? הספק לא יופיע יותר בבנק הספקים, אך ניתן יהיה לשחזר אותו
                מעמוד הארכיון.
              </p>
              <div className="flex items-center gap-3">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-2.5 text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
                  disabled={archiving}
                  onClick={archiveSupplier}
                  style={{ fontWeight: 600 }}
                  type="button"
                >
                  {archiving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Archive size={16} />
                  )}
                  {archiving ? "מעביר..." : "העבר לארכיון"}
                </button>
                <button
                  className="rounded-xl border border-[#e7e1da] px-5 transition-colors hover:bg-[#f5f3f0]"
                  onClick={() => {
                    setShowArchiveConfirm(false);
                  }}
                  type="button"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Edit Supplier Modal ═══ */}
      {showEditSupplier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowEditSupplier(false)}
          onKeyDown={(e) => e.key === "Escape" && e.currentTarget.click()}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            dir="rtl"
            role="dialog"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff8c00]/10">
                  <Pencil className="text-[#ff8c00]" size={18} />
                </div>
                <div>
                  <h3
                    className="text-[#181510] text-[20px]"
                    style={{ fontWeight: 700 }}
                  >
                    עריכת פרטי ספק
                  </h3>
                  <p className="text-[#8d785e] text-[12px]">
                    עדכון פרטים בסיסיים של הספק
                  </p>
                </div>
              </div>
              <button
                className="text-[#8d785e] transition-colors hover:text-[#181510]"
                onClick={() => setShowEditSupplier(false)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="space-y-4"
              onSubmit={editSupplierForm.handleSubmit(
                async (data: EditSupplierForm) => {
                  if (!supplierId || selectedCategories.length === 0) {
                    return;
                  }
                  try {
                    setSavingSupplier(true);
                    const categoryStr = selectedCategories.join(",");
                    const primaryCat = CATEGORY_OPTIONS.find(
                      (c) => c.value === selectedCategories[0]
                    );
                    await updateSupplier({
                      id: supplierId as any,
                      name: data.name.trim(),
                      phone: data.phone.trim(),
                      category: categoryStr,
                      categoryColor: primaryCat?.color || data.categoryColor,
                      region: data.region,
                      rating:
                        Number.parseFloat(data.rating) || supplier?.rating || 0,
                      verificationStatus: data.verificationStatus as
                        | "verified"
                        | "pending"
                        | "unverified",
                      notes: data.notes.trim() || "-",
                      icon: selectedCategories[0] || data.icon,
                    });
                    setShowEditSupplier(false);
                    appToast.success(
                      "פרטי ספק עודכנו",
                      `${data.name} נשמר בהצלחה`
                    );
                  } catch (err) {
                    console.error(
                      "[SupplierDetail] update supplier error:",
                      err
                    );
                    appToast.error("שגיאה בעדכון פרטי ספק");
                  } finally {
                    setSavingSupplier(false);
                  }
                }
              )}
            >
              <FormField
                error={editSupplierForm.formState.errors.name}
                isDirty={editSupplierForm.formState.dirtyFields.name}
                label="שם הספק"
                placeholder="שם הספק"
                required
                {...editSupplierForm.register(
                  "name",
                  rules.requiredMin("שם ספק", 2)
                )}
              />

              <FormField
                error={editSupplierForm.formState.errors.phone}
                isDirty={editSupplierForm.formState.dirtyFields.phone}
                label="טלפון"
                placeholder="מספר טלפון"
                {...editSupplierForm.register("phone")}
              />

              {/* קטגוריות — multi-select */}
              <fieldset>
                <legend
                  className="mb-2 block text-[#8d785e] text-[13px]"
                  style={{ fontWeight: 600 }}
                >
                  קטגוריות <span className="text-[#ff8c00]">*</span>
                  {selectedCategories.length > 0 && (
                    <span
                      className="mr-1 text-[#b5a48b] text-[11px]"
                      style={{ fontWeight: 400 }}
                    >
                      ({selectedCategories.length} נבחרו)
                    </span>
                  )}
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORY_OPTIONS.map((opt) => {
                    const isSelected = selectedCategories.includes(opt.value);
                    return (
                      <button
                        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[12px] transition-all ${
                          isSelected
                            ? "border-[#ff8c00] bg-[#ff8c00]/10 shadow-sm"
                            : "border-[#e7e1da] bg-white hover:border-[#d5cdc0] hover:bg-[#faf9f7]"
                        }`}
                        key={opt.value}
                        onClick={() => {
                          setSelectedCategories((prev) =>
                            prev.includes(opt.value)
                              ? prev.filter((c) => c !== opt.value)
                              : [...prev, opt.value]
                          );
                        }}
                        style={{ fontWeight: isSelected ? 600 : 400 }}
                        type="button"
                      >
                        <div
                          className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all ${
                            isSelected
                              ? "border-[#ff8c00] bg-[#ff8c00]"
                              : "border-[#d5cdc0] bg-white"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              fill="none"
                              height="10"
                              viewBox="0 0 10 10"
                              width="10"
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
                          category={opt.value}
                          color={isSelected ? opt.color : "#8d785e"}
                          size={16}
                        />
                        <span
                          className={
                            isSelected ? "text-[#181510]" : "text-[#6b5d45]"
                          }
                        >
                          {opt.value}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedCategories.length === 0 && (
                  <p className="mt-1 text-[11px] text-red-500">
                    יש לבחור לפחות קטגוריה אחת
                  </p>
                )}
              </fieldset>

              <FormSelect
                error={editSupplierForm.formState.errors.region}
                isDirty={editSupplierForm.formState.dirtyFields.region}
                label="אזור"
                {...editSupplierForm.register("region", {
                  required: "אזור הוא שדה חובה",
                })}
              >
                {REGION_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </FormSelect>

              <div className="grid grid-cols-2 gap-3">
                <fieldset>
                  <legend
                    className="mb-1 block text-[#8d785e] text-[13px]"
                    style={{ fontWeight: 600 }}
                  >
                    דירוג
                  </legend>
                  <div className="flex items-center gap-1 rounded-lg border border-[#e7e1da] bg-white px-3 py-2.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const currentRating = Number.parseFloat(
                        editSupplierForm.watch("rating") || "0"
                      );
                      return (
                        <button
                          className={`text-[22px] transition-colors ${star <= currentRating ? "text-[#ff8c00]" : "text-[#ddd6cb] hover:text-[#ff8c00]/50"}`}
                          key={star}
                          onClick={() =>
                            editSupplierForm.setValue("rating", String(star), {
                              shouldDirty: true,
                            })
                          }
                          type="button"
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <FormSelect
                  error={editSupplierForm.formState.errors.verificationStatus}
                  isDirty={
                    editSupplierForm.formState.dirtyFields.verificationStatus
                  }
                  label="סטטוס אימות"
                  {...editSupplierForm.register("verificationStatus")}
                >
                  <option value="verified">מאומת</option>
                  <option value="pending">ממתין לאימות</option>
                  <option value="unverified">לא מאומת</option>
                </FormSelect>
              </div>

              <FormTextarea
                error={editSupplierForm.formState.errors.notes}
                isDirty={editSupplierForm.formState.dirtyFields.notes}
                label="הערות"
                placeholder="הערות נוספות..."
                rows={3}
                {...editSupplierForm.register("notes")}
              />

              <div className="flex gap-3 pt-2">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-2.5 text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
                  disabled={
                    savingSupplier ||
                    !editSupplierForm.formState.isValid ||
                    selectedCategories.length === 0
                  }
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {savingSupplier ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  {savingSupplier ? "שומר..." : "שמור שינויים"}
                </button>
                <button
                  className="rounded-xl border border-[#e7e1da] px-5 text-[#8d785e] text-[14px] transition-colors hover:bg-[#f5f3f0]"
                  onClick={() => setShowEditSupplier(false)}
                  style={{ fontWeight: 500 }}
                  type="button"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteModal}
    </div>
  );
}
