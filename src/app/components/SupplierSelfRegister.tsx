import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import {
  OPERATING_REGIONS,
  SUPPLIER_CATEGORIES,
} from "./constants/supplierConstants";
import { FormField, FormSelect } from "./FormField";

interface SupplierRegisterForm {
  businessName: string;
  category: string;
  confirmPassword: string;
  email: string;
  firstProduct: string;
  fullName: string;
  password: string;
  phone: string;
  region: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SupplierSelfRegister() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<SupplierRegisterForm>({
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      category: "",
      region: "",
      firstProduct: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: SupplierRegisterForm) => {
    setError(null);
    const result = await signup(
      data.email,
      data.password,
      data.fullName,
      "supplier",
      {
        businessName: data.businessName,
        category: data.category,
        firstProduct: data.firstProduct,
        phone: data.phone || undefined,
        region: data.region,
      }
    );
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div
        className="flex min-h-screen items-center justify-center font-['Assistant',sans-serif]"
        dir="rtl"
        style={{ backgroundColor: "#f8f7f5" }}
      >
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-4 text-5xl">✅</div>
            <h1
              className="mb-2 font-bold text-2xl"
              style={{ color: "#181510" }}
            >
              החשבון נוצר בהצלחה!
            </h1>
            <p className="mb-6" style={{ color: "#8d785e" }}>
              ממתין לאישור מנהל.
            </p>
            <button
              className="w-full rounded-lg px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90"
              onClick={() => navigate("/")}
              style={{ backgroundColor: "#ff8c00" }}
              type="button"
            >
              חזרה לדף הכניסה
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center font-['Assistant',sans-serif]"
      dir="rtl"
      style={{ backgroundColor: "#f8f7f5" }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="mb-1 font-bold text-2xl" style={{ color: "#181510" }}>
            הרשמה כספק
          </h1>
          <p style={{ color: "#8d785e" }}>הצטרף לרשת הספקים של TravelPro</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-red-600 text-sm">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            error={errors.fullName}
            isDirty={dirtyFields.fullName}
            label="שם מלא"
            required
            {...register("fullName", {
              required: "שדה חובה",
              minLength: { value: 2, message: "מינימום 2 תווים" },
            })}
          />

          <FormField
            error={errors.businessName}
            isDirty={dirtyFields.businessName}
            label="שם עסק"
            required
            {...register("businessName", {
              required: "שדה חובה",
              minLength: { value: 2, message: "מינימום 2 תווים" },
            })}
          />

          <FormField
            error={errors.email}
            isDirty={dirtyFields.email}
            label="אימייל"
            required
            type="email"
            {...register("email", {
              required: "שדה חובה",
              pattern: {
                value: EMAIL_PATTERN,
                message: "כתובת אימייל לא תקינה",
              },
            })}
          />

          <FormField
            error={errors.phone}
            isDirty={dirtyFields.phone}
            label="טלפון"
            type="tel"
            {...register("phone")}
          />

          <FormField
            error={errors.password}
            isDirty={dirtyFields.password}
            label="סיסמה"
            required
            type="password"
            {...register("password", {
              required: "שדה חובה",
              minLength: { value: 8, message: "מינימום 8 תווים" },
            })}
          />

          <FormField
            error={errors.confirmPassword}
            isDirty={dirtyFields.confirmPassword}
            label="אימות סיסמה"
            required
            type="password"
            {...register("confirmPassword", {
              required: "שדה חובה",
              validate: (value: string) =>
                value === password || "הסיסמאות אינן תואמות",
            })}
          />

          <FormSelect
            error={errors.category}
            isDirty={dirtyFields.category}
            label="קטגוריה ראשית"
            {...register("category", { required: "שדה חובה" })}
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
            isDirty={dirtyFields.region}
            label="אזור פעילות"
            {...register("region", { required: "שדה חובה" })}
          >
            <option value="">בחר אזור</option>
            {OPERATING_REGIONS.map((reg) => (
              <option key={reg.value} value={reg.value}>
                {reg.label}
              </option>
            ))}
          </FormSelect>

          <FormField
            error={errors.firstProduct}
            isDirty={dirtyFields.firstProduct}
            label="מוצר / שירות ראשון"
            required
            {...register("firstProduct", {
              required: "שדה חובה",
              minLength: { value: 2, message: "מינימום 2 תווים" },
            })}
          />

          <button
            className="mt-2 w-full rounded-lg px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            disabled={isSubmitting}
            style={{ backgroundColor: "#ff8c00" }}
            type="submit"
          >
            {isSubmitting ? "יוצר חשבון..." : "צור חשבון ספק"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "#8d785e" }}>
          כבר יש לך חשבון?{" "}
          <button
            className="font-semibold underline"
            onClick={() => navigate("/")}
            style={{ color: "#ff8c00" }}
            type="button"
          >
            התחבר
          </button>
        </p>
      </div>
    </div>
  );
}
