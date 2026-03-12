import { useMutation, useQuery } from "convex/react";
import {
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useAuth } from "../AuthContext";
import {
  OPERATING_REGIONS,
  SUPPLIER_CATEGORIES,
} from "../constants/supplierConstants";
import { FormField, FormSelect } from "../FormField";
import { useImageUpload } from "../hooks/useImageUpload";

interface Stage1Form {
  businessName: string;
  category: string;
  email: string;
  firstProduct: string;
  phone: string;
  region: string;
}

const STEPS = [
  { label: "פרטי עסק", index: 0 },
  { label: "מוצרים ושירותים", index: 1 },
  { label: "מסמכים", index: 2 },
];

const UNIT_OPTIONS = ["אדם", "אירוע", "יום", "קבוצה", "חבילה", "יחידה"];

const DOCUMENT_TYPES = [
  {
    type: "third_party_insurance",
    label: "ביטוח צד ג'",
    required: true,
  },
  {
    type: "employer_insurance",
    label: "ביטוח מעסיקים",
    required: true,
  },
  {
    type: "business_license",
    label: "רישיון עסק",
    required: false,
  },
  {
    type: "kashrut_certificate",
    label: "תעודת כשרות",
    required: false,
  },
];

/** Map category label back to value for form */
function categoryLabelToValue(label: string): string {
  const found = SUPPLIER_CATEGORIES.find((c) => c.label === label);
  return found?.value ?? "";
}

/** Map category value to label for supplier */
function categoryValueToLabel(value: string): string {
  const found = SUPPLIER_CATEGORIES.find((c) => c.value === value);
  return found?.label ?? value;
}

export function SupplierOnboarding() {
  const { profile } = useAuth();
  const updateProfile = useMutation(api.users.updateProfile);
  const updateSupplier = useMutation(api.suppliers.update);
  const createSupplier = useMutation(api.suppliers.create);
  const createProduct = useMutation(api.supplierProducts.create);
  const updateProduct = useMutation(api.supplierProducts.update);
  const removeProduct = useMutation(api.supplierProducts.remove);
  const listProducts = useQuery(
    api.supplierProducts.listBySupplierId,
    profile?.supplierId
      ? { supplierId: profile.supplierId as Id<"suppliers"> }
      : "skip"
  );
  const supplier = useQuery(
    api.suppliers.get,
    profile?.supplierId ? { id: profile.supplierId as Id<"suppliers"> } : "skip"
  );
  const listDocs = useQuery(
    api.supplierDocuments.listBySupplierId,
    profile?.supplierId
      ? { supplierId: profile.supplierId as Id<"suppliers"> }
      : "skip"
  );
  const createDoc = useMutation(api.supplierDocuments.create);
  const { upload } = useImageUpload();

  const [activeStep, setActiveStep] = useState(0);
  const [stage1Completed, setStage1Completed] = useState(false);

  // Detect if Step 1 was already completed (supplier exists)
  useEffect(() => {
    if (supplier && profile?.onboardingStage) {
      setStage1Completed(true);
      // Auto-advance to the right step based on saved stage
      if (profile.onboardingStage === "stage1") {
        setActiveStep(1);
      } else if (profile.onboardingStage === "stage2") {
        setActiveStep(2);
      }
    }
  }, [supplier, profile?.onboardingStage]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Stage1Form>();

  useEffect(() => {
    if (!(profile && supplier)) {
      return;
    }
    const firstProduct = Array.isArray(listProducts)
      ? (listProducts[0]?.name ?? "")
      : "";
    reset({
      businessName: profile.company ?? supplier.name ?? "",
      phone: profile.phone ?? supplier.phone ?? "",
      email: profile.email ?? supplier.email ?? "",
      category: categoryLabelToValue(supplier.category ?? ""),
      region: supplier.region ?? "",
      firstProduct,
    });
  }, [profile, supplier, listProducts, reset]);

  const onSubmitStage1 = async (data: Stage1Form) => {
    if (!profile?.id) {
      return;
    }

    await updateProfile({
      id: profile.id as Id<"users">,
      company: data.businessName,
      phone: data.phone,
      onboardingStage: "stage1",
    });

    let supplierId: Id<"suppliers">;

    if (profile.supplierId) {
      supplierId = profile.supplierId as Id<"suppliers">;
      await updateSupplier({
        id: supplierId,
        name: data.businessName,
        phone: data.phone,
        email: data.email,
        category: categoryValueToLabel(data.category),
        region: data.region,
      });
    } else {
      const newSupplier = await createSupplier({
        name: data.businessName,
        phone: data.phone,
        email: data.email,
        category: categoryValueToLabel(data.category),
        region: data.region,
        verificationStatus: "pending",
      });
      supplierId = newSupplier.id;
      await updateProfile({
        id: profile.id as Id<"users">,
        supplierId,
      });
    }

    const products = Array.isArray(listProducts) ? listProducts : [];
    if (data.firstProduct.trim()) {
      if (products.length > 0) {
        await updateProduct({
          id: products[0].id,
          name: data.firstProduct.trim(),
        });
      } else {
        await createProduct({
          supplierId,
          name: data.firstProduct.trim(),
        });
      }
    }

    setStage1Completed(true);
    setActiveStep(1);
    appToast.success("פרטי העסק נשמרו בהצלחה");
  };

  const canNavigateTo = (stepIndex: number) => {
    if (stepIndex === 0) {
      return true;
    }
    return stage1Completed;
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center font-['Assistant',sans-serif]"
      dir="rtl"
      style={{ backgroundColor: "#f8f7f5" }}
    >
      <div className="flex w-full max-w-lg flex-col gap-8 rounded-2xl bg-white p-10 shadow-lg">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((step, i) => (
            <div className="flex items-center gap-2" key={step.label}>
              <button
                className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canNavigateTo(i)}
                onClick={() => canNavigateTo(i) && setActiveStep(i)}
                type="button"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm text-white"
                  style={{
                    backgroundColor: activeStep === i ? "#ff8c00" : "#d4c9b8",
                  }}
                >
                  {i + 1}
                </div>
                <span
                  className="font-semibold text-sm"
                  style={{
                    color: activeStep === i ? "#181510" : "#8d785e",
                  }}
                >
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className="mx-2 h-px w-8"
                  style={{ backgroundColor: "#d4c9b8" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Stage 1 — Business Details */}
        {activeStep === 0 && (
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmitStage1)}
          >
            <FormField error={errors.businessName} label="שם מלא / שם עסק">
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right focus:outline-none"
                style={{ borderColor: "#d4c9b8" }}
                type="text"
                {...register("businessName", {
                  required: "שדה חובה",
                })}
              />
            </FormField>

            <FormField error={errors.phone} label="טלפון">
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right focus:outline-none"
                style={{ borderColor: "#d4c9b8" }}
                type="tel"
                {...register("phone", {
                  required: "שדה חובה",
                })}
              />
            </FormField>

            <FormField error={errors.email} label="אימייל">
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right focus:outline-none"
                style={{ borderColor: "#d4c9b8" }}
                type="email"
                {...register("email", {
                  required: "שדה חובה",
                })}
              />
            </FormField>

            <FormSelect
              error={errors.category}
              label="קטגוריה ראשית (רשימה סגורה)"
              {...register("category", {
                required: "שדה חובה",
              })}
            >
              <option value="">בחר קטגוריה</option>
              {SUPPLIER_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </FormSelect>

            <FormSelect
              error={errors.region}
              label="אזור פעילות"
              {...register("region", {
                required: "שדה חובה",
              })}
            >
              <option value="">בחר אזור</option>
              {OPERATING_REGIONS.map((reg) => (
                <option key={reg.value} value={reg.value}>
                  {reg.label}
                </option>
              ))}
            </FormSelect>

            <FormField error={errors.firstProduct} label="מוצר / שירות ראשון">
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-right focus:outline-none"
                placeholder='לדוגמה: "סיור ביקב", "הסעת VIP"...'
                style={{ borderColor: "#d4c9b8" }}
                type="text"
                {...register("firstProduct", {
                  required: "שדה חובה",
                })}
              />
            </FormField>

            <button
              className="mt-2 w-full cursor-pointer rounded-xl px-8 py-4 font-bold text-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#ff8c00" }}
              type="submit"
            >
              שמירה והמשך
            </button>
          </form>
        )}

        {/* Stage 2 — Products & Services */}
        {activeStep === 1 && (
          <Step2Products
            createProduct={createProduct}
            listProducts={listProducts}
            profile={profile}
            removeProduct={removeProduct}
            setActiveStep={setActiveStep}
            updateProduct={updateProduct}
            updateProfile={updateProfile}
          />
        )}

        {/* Stage 3 — Documents */}
        {activeStep === 2 && (
          <Step3Documents
            createDoc={createDoc}
            listDocs={listDocs}
            profile={profile}
            updateProfile={updateProfile}
            upload={upload}
          />
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Products & Services ───

interface Step2Props {
  createProduct: any;
  listProducts: any;
  profile: any;
  removeProduct: any;
  setActiveStep: (step: number) => void;
  updateProduct: any;
  updateProfile: any;
}

function Step2Products({
  createProduct,
  listProducts,
  profile,
  removeProduct,
  setActiveStep,
  updateProduct,
  updateProfile,
}: Step2Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("אדם");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const products = Array.isArray(listProducts) ? listProducts : [];

  const resetForm = () => {
    setName("");
    setPrice("");
    setUnit("אדם");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (product: any) => {
    setName(product.name);
    setPrice(product.price ? String(product.price) : "");
    setUnit(product.unit || "אדם");
    setDescription(product.description || "");
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSaveProduct = async () => {
    if (!(name.trim() && profile?.supplierId)) {
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateProduct({
          id: editingId as Id<"supplierProducts">,
          name: name.trim(),
          price: price ? Number(price) : 0,
          unit,
          description: description.trim() || undefined,
        });
      } else {
        await createProduct({
          supplierId: profile.supplierId as Id<"suppliers">,
          name: name.trim(),
          price: price ? Number(price) : 0,
          unit,
          description: description.trim() || undefined,
        });
      }
      resetForm();
      appToast.success(editingId ? "המוצר עודכן" : "המוצר נוסף");
    } catch {
      appToast.error("שגיאה בשמירת מוצר");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await removeProduct({ id: id as Id<"supplierProducts"> });
      appToast.success("המוצר נמחק");
    } catch {
      appToast.error("שגיאה במחיקת מוצר");
    }
  };

  const handleContinue = async () => {
    if (!profile?.id) {
      return;
    }
    await updateProfile({
      id: profile.id as Id<"users">,
      onboardingStage: "stage2" as const,
    });
    setActiveStep(2);
    appToast.success("מוצרים נשמרו בהצלחה");
  };

  const handleSkip = () => {
    setActiveStep(2);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="font-bold text-xl" style={{ color: "#181510" }}>
          מוצרים ושירותים
        </p>
        <p className="mt-1 text-sm" style={{ color: "#8d785e" }}>
          הוסיפו מוצרים ושירותים שאתם מציעים
        </p>
      </div>

      {/* Existing products list */}
      {products.length > 0 && (
        <div className="flex flex-col gap-2">
          {products.map((product: any) => (
            <div
              className="flex items-center justify-between rounded-lg border border-[#e7e1da] bg-[#faf9f7] px-4 py-3"
              key={product.id}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-[#181510] text-sm">
                  {product.name}
                </span>
                <span className="text-[#8d785e] text-xs">
                  {product.price > 0 && `₪${product.price}`}
                  {product.price > 0 && product.unit && " / "}
                  {product.unit}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-md p-1.5 text-[#8d785e] transition-colors hover:bg-[#f0ece7]"
                  onClick={() => startEdit(product)}
                  type="button"
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="rounded-md p-1.5 text-red-400 transition-colors hover:bg-red-50"
                  onClick={() => handleDeleteProduct(product.id)}
                  type="button"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit product form */}
      {showForm ? (
        <div className="flex flex-col gap-3 rounded-lg border border-[#ff8c00]/30 bg-[#fff8f0] p-4">
          <input
            className="w-full rounded-lg border border-[#d4c9b8] px-4 py-2.5 text-right text-sm focus:outline-none"
            onChange={(e) => setName(e.target.value)}
            placeholder="שם המוצר / שירות *"
            type="text"
            value={name}
          />
          <textarea
            className="w-full rounded-lg border border-[#d4c9b8] px-4 py-2.5 text-right text-sm focus:outline-none"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="תיאור (אופציונלי)"
            rows={2}
            value={description}
          />
          <div className="flex gap-3">
            <input
              className="w-1/2 rounded-lg border border-[#d4c9b8] px-4 py-2.5 text-right text-sm focus:outline-none"
              onChange={(e) => setPrice(e.target.value)}
              placeholder="מחיר (₪)"
              type="number"
              value={price}
            />
            <div className="flex w-1/2 flex-wrap gap-1">
              {UNIT_OPTIONS.map((u) => (
                <button
                  className="rounded-md border px-2 py-1 text-xs transition-colors"
                  key={u}
                  onClick={() => setUnit(u)}
                  style={{
                    borderColor: unit === u ? "#ff8c00" : "#d4c9b8",
                    backgroundColor: unit === u ? "#fff3e0" : "white",
                    color: unit === u ? "#ff8c00" : "#8d785e",
                  }}
                  type="button"
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 rounded-lg px-4 py-2 font-semibold text-sm text-white disabled:opacity-50"
              disabled={!name.trim() || saving}
              onClick={handleSaveProduct}
              style={{ backgroundColor: "#ff8c00" }}
              type="button"
            >
              {saving ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : editingId ? (
                "עדכון"
              ) : (
                "הוסף"
              )}
            </button>
            <button
              className="rounded-lg border border-[#d4c9b8] px-4 py-2 text-[#8d785e] text-sm"
              onClick={resetForm}
              type="button"
            >
              ביטול
            </button>
          </div>
        </div>
      ) : (
        <button
          className="flex items-center justify-center gap-2 rounded-lg border border-[#d4c9b8] border-dashed px-4 py-3 text-[#8d785e] text-sm transition-colors hover:border-[#ff8c00] hover:text-[#ff8c00]"
          onClick={() => setShowForm(true)}
          type="button"
        >
          <Plus size={16} />
          הוסף מוצר
        </button>
      )}

      {/* Action buttons */}
      <div className="mt-2 flex gap-3">
        <button
          className="flex-1 cursor-pointer rounded-xl px-8 py-4 font-bold text-lg text-white transition-opacity hover:opacity-90"
          onClick={handleContinue}
          style={{ backgroundColor: "#ff8c00" }}
          type="button"
        >
          שמירה והמשך
        </button>
        <button
          className="rounded-xl border border-[#d4c9b8] px-6 py-4 font-semibold text-[#8d785e] text-sm transition-colors hover:bg-[#f5f3f0]"
          onClick={handleSkip}
          type="button"
        >
          דלג
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Documents ───

interface Step3Props {
  createDoc: any;
  listDocs: any;
  profile: any;
  updateProfile: any;
  upload: (file: File) => Promise<string>;
}

function Step3Documents({
  createDoc,
  listDocs,
  profile,
  updateProfile,
  upload,
}: Step3Props) {
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const existingDocs = Array.isArray(listDocs) ? listDocs : [];

  const getDocForType = (docType: string) =>
    existingDocs.find((d: any) => d.documentType === docType && d.storageId);

  const handleFileUpload = async (docType: string, file: File) => {
    if (!profile?.supplierId) {
      return;
    }
    setUploadingType(docType);
    try {
      const storageId = await upload(file);
      const docDef = DOCUMENT_TYPES.find((d) => d.type === docType);
      await createDoc({
        supplierId: profile.supplierId as Id<"suppliers">,
        name: docDef?.label ?? docType,
        documentType: docType,
        fileName: file.name,
        storageId,
        status: "valid" as const,
        expiry: expiryDates[docType] || undefined,
      });
      appToast.success(`${docDef?.label ?? "מסמך"} הועלה בהצלחה`);
    } catch {
      appToast.error("שגיאה בהעלאת המסמך");
    } finally {
      setUploadingType(null);
    }
  };

  const handleFinish = async () => {
    if (!profile?.id) {
      return;
    }
    await updateProfile({
      id: profile.id as Id<"users">,
      onboardingStage: "stage3" as const,
      onboardingCompleted: true,
    });
    appToast.success("ההרשמה הושלמה בהצלחה!");
  };

  const handleSkipFinish = async () => {
    if (!profile?.id) {
      return;
    }
    await updateProfile({
      id: profile.id as Id<"users">,
      onboardingCompleted: true,
    });
    appToast.success("ההרשמה הושלמה בהצלחה!");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="font-bold text-xl" style={{ color: "#181510" }}>
          מסמכים
        </p>
        <p className="mt-1 text-sm" style={{ color: "#8d785e" }}>
          העלאת מסמכים עסקיים
        </p>
      </div>

      {/* Info banner */}
      <div className="rounded-lg bg-[#fff3e0] px-4 py-3 text-[#b8860b] text-xs">
        מסמכי ביטוח הם חובה לאחר סגירת עסקה ראשונה. ניתן להשלים גם מאוחר יותר.
      </div>

      {/* Document rows */}
      <div className="flex flex-col gap-3">
        {DOCUMENT_TYPES.map((docDef) => {
          const uploaded = getDocForType(docDef.type);
          const isUploading = uploadingType === docDef.type;

          return (
            <div
              className="flex items-center justify-between rounded-lg border border-[#e7e1da] bg-[#faf9f7] px-4 py-3"
              key={docDef.type}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#181510] text-sm">
                    {docDef.label}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px]"
                    style={{
                      backgroundColor: docDef.required ? "#fff3e0" : "#f0f0f0",
                      color: docDef.required ? "#b8860b" : "#8d785e",
                    }}
                  >
                    {docDef.required ? "חובה לאחר עסקה" : "אופציונלי"}
                  </span>
                </div>
                {uploaded && (
                  <span className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle2 size={12} />
                    {uploaded.fileName}
                  </span>
                )}
                {!uploaded && (
                  <input
                    className="mt-1 w-36 rounded border border-[#d4c9b8] px-2 py-1 text-xs"
                    onChange={(e) =>
                      setExpiryDates((prev) => ({
                        ...prev,
                        [docDef.type]: e.target.value,
                      }))
                    }
                    placeholder="תאריך תפוגה"
                    type="date"
                    value={expiryDates[docDef.type] || ""}
                  />
                )}
              </div>
              <div>
                {uploaded ? (
                  <span className="text-green-500">
                    <CheckCircle2 size={20} />
                  </span>
                ) : (
                  <>
                    <input
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(docDef.type, file);
                        }
                      }}
                      ref={(el) => {
                        fileInputRefs.current[docDef.type] = el;
                      }}
                      type="file"
                    />
                    <button
                      className="flex items-center gap-1 rounded-lg border border-[#d4c9b8] px-3 py-2 text-[#8d785e] text-xs transition-colors hover:border-[#ff8c00] hover:text-[#ff8c00] disabled:opacity-50"
                      disabled={isUploading}
                      onClick={() =>
                        fileInputRefs.current[docDef.type]?.click()
                      }
                      type="button"
                    >
                      {isUploading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      העלאה
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="mt-2 flex gap-3">
        <button
          className="flex-1 cursor-pointer rounded-xl px-8 py-4 font-bold text-lg text-white transition-opacity hover:opacity-90"
          onClick={handleFinish}
          style={{ backgroundColor: "#ff8c00" }}
          type="button"
        >
          סיום הרשמה
        </button>
        <button
          className="rounded-xl border border-[#d4c9b8] px-6 py-4 font-semibold text-[#8d785e] text-sm transition-colors hover:bg-[#f5f3f0]"
          onClick={handleSkipFinish}
          type="button"
        >
          דלג וסיים
        </button>
      </div>
    </div>
  );
}
