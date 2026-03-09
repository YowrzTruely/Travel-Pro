import { useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "../AuthContext";
import { FormField, FormSelect } from "../FormField";

interface Stage1Form {
  businessName: string;
  category: string;
  phone: string;
  region: string;
}

const CATEGORY_OPTIONS = [
  { value: "", label: "בחר קטגוריה" },
  { value: "תחבורה", label: "תחבורה" },
  { value: "מזון", label: "מזון" },
  { value: "אטרקציות", label: "אטרקציות" },
  { value: "לינה", label: "לינה" },
  { value: "בידור", label: "בידור" },
];

const REGION_OPTIONS = [
  { value: "", label: "בחר אזור" },
  { value: "צפון", label: "צפון" },
  { value: "מרכז", label: "מרכז" },
  { value: "דרום", label: "דרום" },
  { value: "ירושלים", label: "ירושלים" },
  { value: "אילת", label: "אילת" },
  { value: "גולן", label: "גולן" },
];

const STEPS = [
  { label: "פרטי עסק", index: 0 },
  { label: "מוצרים ושירותים", index: 1 },
  { label: "מסמכים", index: 2 },
];

export function SupplierOnboarding() {
  const { profile } = useAuth();
  const updateProfile = useMutation(api.users.updateProfile);
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Stage1Form>();

  const onSubmitStage1 = async (_data: Stage1Form) => {
    if (!profile?.id) {
      return;
    }
    await updateProfile({
      id: profile.id as Id<"users">,
      onboardingCompleted: true,
      onboardingStage: "stage1",
    });
    // Profile update triggers re-render in AuthContext, which will
    // switch to the role-based router automatically.
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

        {/* Stage 1 — Business Details */}
        {activeStep === 0 && (
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmitStage1)}
          >
            <FormField error={errors.businessName} label="שם עסק">
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
                type="text"
                {...register("phone", {
                  required: "שדה חובה",
                })}
              />
            </FormField>

            <FormSelect
              error={errors.category}
              label="קטגוריה"
              {...register("category", {
                required: "שדה חובה",
              })}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </FormSelect>

            <FormSelect
              error={errors.region}
              label="אזור"
              {...register("region", {
                required: "שדה חובה",
              })}
            >
              {REGION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </FormSelect>

            <button
              className="mt-2 w-full cursor-pointer rounded-xl px-8 py-4 font-bold text-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#ff8c00" }}
              type="submit"
            >
              שמירה והמשך
            </button>
          </form>
        )}

        {/* Stage 2 — Coming Soon */}
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
            <p className="text-lg" style={{ color: "#8d785e" }}>
              בקרוב
            </p>
          </div>
        )}

        {/* Stage 3 — Coming Soon */}
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
            <p className="text-lg" style={{ color: "#8d785e" }}>
              בקרוב
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
