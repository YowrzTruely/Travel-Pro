import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "../AuthContext";
import {
  OPERATING_REGIONS,
  SUPPLIER_CATEGORIES,
} from "../constants/supplierConstants";
import { FormField, FormSelect } from "../FormField";

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
  const createProduct = useMutation(api.supplierProducts.create);
  const updateProduct = useMutation(api.supplierProducts.update);
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
  const [activeStep, setActiveStep] = useState(0);

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
      onboardingCompleted: true,
      onboardingStage: "stage1",
    });

    if (profile.supplierId) {
      const supplierId = profile.supplierId as Id<"suppliers">;
      await updateSupplier({
        id: supplierId,
        name: data.businessName,
        phone: data.phone,
        email: data.email,
        category: categoryValueToLabel(data.category),
        region: data.region,
      });
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
    }
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
                className="flex items-center gap-2"
                onClick={() => setActiveStep(i)}
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

        {/* Stage 1 — Business Details (PRD §3.1 — mandatory entry) */}
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

        {/* Stage 2 — Products & Services (coming soon) */}
        {activeStep === 1 && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
              style={{ backgroundColor: "#fff3e0" }}
            >
              <span aria-label="coming soon" role="img">
                📦
              </span>
            </div>
            <p className="font-bold text-xl" style={{ color: "#181510" }}>
              מוצרים ושירותים
            </p>
            <p className="text-center text-lg" style={{ color: "#8d785e" }}>
              בשלב הבא תוכל להוסיף מוצרים, תמונות, מחירים ותיאורים שיווקיים
              בשיתוף עם AI
            </p>
          </div>
        )}

        {/* Stage 3 — Documents (coming soon) */}
        {activeStep === 2 && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
              style={{ backgroundColor: "#fff3e0" }}
            >
              <span aria-label="coming soon" role="img">
                📄
              </span>
            </div>
            <p className="font-bold text-xl" style={{ color: "#181510" }}>
              מסמכים
            </p>
            <p className="text-center text-lg" style={{ color: "#8d785e" }}>
              העלאת מסמכי ביטוח, רישיון עסק, תעודת כשרות
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
