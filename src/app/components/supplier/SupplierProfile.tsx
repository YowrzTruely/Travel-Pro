import { useMutation, useQuery } from "convex/react";
import {
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
  Save,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useAuth } from "../AuthContext";
import {
  MAX_CATEGORIES_WITHOUT_APPROVAL,
  OPERATING_REGIONS,
  SUPPLIER_CATEGORIES,
} from "../constants/supplierConstants";

/** Normalise a DB value (which may be a Hebrew label or an English code) to its English code */
function normaliseCategoryValue(raw: string): string {
  const match = SUPPLIER_CATEGORIES.find(
    (c) => c.value === raw || c.label === raw
  );
  return match?.value ?? raw;
}
function normaliseRegionValue(raw: string): string {
  const match = OPERATING_REGIONS.find(
    (r) => r.value === raw || r.label === raw
  );
  return match?.value ?? raw;
}

interface ProfileFormValues {
  address: string;
  defaultMarginPercent: string;
  email: string;
  facebookUrl: string;
  name: string;
  operatingHours: string;
  phone: string;
  seasonalAvailability: string;
  websiteUrl: string;
}

export function SupplierProfile() {
  const { profile } = useAuth();
  const supplierId = profile?.supplierId as Id<"suppliers"> | undefined;

  const supplier = useQuery(
    api.suppliers.get,
    supplierId ? { id: supplierId } : "skip"
  );

  const updateSupplier = useMutation(api.suppliers.update);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>();

  // Sync form when supplier data loads
  useEffect(() => {
    if (!supplier) {
      return;
    }

    // Parse category (may be comma-separated) — normalise legacy Hebrew labels to English codes
    const cats = supplier.category
      ? supplier.category
          .split(",")
          .map((c: string) => normaliseCategoryValue(c.trim()))
      : [];
    setSelectedCategories(cats);

    // Parse region (may be comma-separated) — normalise legacy Hebrew labels to English codes
    const regs = supplier.region
      ? supplier.region
          .split(",")
          .map((r: string) => normaliseRegionValue(r.trim()))
      : [];
    setSelectedRegions(regs);

    reset({
      name: supplier.name || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      websiteUrl: supplier.websiteUrl || "",
      facebookUrl: supplier.facebookUrl || "",
      operatingHours: supplier.operatingHours || "",
      defaultMarginPercent: supplier.defaultMarginPercent?.toString() || "",
      seasonalAvailability: supplier.seasonalAvailability || "",
    });
  }, [supplier, reset]);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(value)) {
        return prev.filter((c) => c !== value);
      }
      if (prev.length >= MAX_CATEGORIES_WITHOUT_APPROVAL) {
        setShowApprovalModal(true);
        return prev;
      }
      return [...prev, value];
    });
  };

  const handleApprovalRequest = () => {
    setShowApprovalModal(false);
    appToast.success("בקשת אישור", "בקשת האישור נשלחה");
  };

  const toggleRegion = (value: string) => {
    setSelectedRegions((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
    );
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!supplierId) {
      return;
    }
    setSaving(true);
    try {
      const margin = data.defaultMarginPercent
        ? Number.parseFloat(data.defaultMarginPercent)
        : undefined;

      await updateSupplier({
        id: supplierId,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
        category: selectedCategories.join(","),
        region: selectedRegions.join(","),
        websiteUrl: data.websiteUrl.trim() || undefined,
        facebookUrl: data.facebookUrl.trim() || undefined,
        operatingHours: data.operatingHours.trim() || undefined,
        defaultMarginPercent:
          margin !== undefined && !Number.isNaN(margin) ? margin : undefined,
        seasonalAvailability: data.seasonalAvailability.trim() || undefined,
      });

      setSaveSuccess(true);
      appToast.success("הפרופיל עודכן", "השינויים נשמרו בהצלחה");
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      appToast.error("שגיאה", "לא ניתן לעדכן את הפרופיל");
    } finally {
      setSaving(false);
    }
  };

  if (!supplierId) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <p className="text-[#8d785e] text-[14px]">
          לא נמצא חיבור לספק. פנה למנהל המערכת.
        </p>
      </div>
    );
  }

  if (supplier === undefined) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <Loader2 className="animate-spin text-[#ff8c00]" size={32} />
      </div>
    );
  }

  if (supplier === null) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <p className="text-[#8d785e] text-[14px]">ספק לא נמצא</p>
      </div>
    );
  }

  const hasFormChanges =
    isDirty ||
    selectedCategories.join(",") !== (supplier.category || "") ||
    selectedRegions.join(",") !== (supplier.region || "");

  return (
    <div className="min-h-screen bg-[#f8f7f5] p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff8c00] text-white">
          <User size={20} />
        </span>
        <div>
          <h1
            className="text-[#181510] text-[22px]"
            style={{ fontWeight: 700 }}
          >
            פרופיל העסק
          </h1>
          <p className="text-[#8d785e] text-[13px]">ערוך את פרטי העסק שלך</p>
        </div>
      </div>

      <form
        className="mx-auto max-w-2xl space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Basic Info */}
        <section className="rounded-xl border border-[#e7e1da] bg-white p-5">
          <div
            className="mb-4 flex items-center gap-2 text-[#8d785e] text-[13px]"
            style={{ fontWeight: 600 }}
          >
            <Building2 className="text-[#ff8c00]" size={14} />
            פרטים בסיסיים
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="mb-1 block text-[#8d785e] text-[13px]"
                htmlFor="profile-name"
                style={{ fontWeight: 600 }}
              >
                שם העסק <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                id="profile-name"
                {...register("name", { required: "שם העסק הוא שדה חובה" })}
              />
              {errors.name && (
                <p className="mt-1 text-[12px] text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="mb-1 block text-[#8d785e] text-[13px]"
                  htmlFor="profile-phone"
                  style={{ fontWeight: 600 }}
                >
                  טלפון
                </label>
                <input
                  className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                  id="profile-phone"
                  {...register("phone")}
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-[#8d785e] text-[13px]"
                  htmlFor="profile-email"
                  style={{ fontWeight: 600 }}
                >
                  אימייל
                </label>
                <input
                  className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                  id="profile-email"
                  type="email"
                  {...register("email")}
                />
              </div>
            </div>

            <div>
              <label
                className="mb-1 block text-[#8d785e] text-[13px]"
                htmlFor="profile-address"
                style={{ fontWeight: 600 }}
              >
                כתובת
              </label>
              <input
                className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                id="profile-address"
                {...register("address")}
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="rounded-xl border border-[#e7e1da] bg-white p-5">
          <div
            className="mb-3 text-[#8d785e] text-[13px]"
            style={{ fontWeight: 600 }}
          >
            קטגוריות (עד {MAX_CATEGORIES_WITHOUT_APPROVAL})
          </div>
          <div className="flex flex-wrap gap-2">
            {SUPPLIER_CATEGORIES.map((cat) => {
              const selected = selectedCategories.includes(cat.value);
              return (
                <button
                  className={`rounded-lg border px-3 py-2 text-[13px] transition-all ${
                    selected
                      ? "border-[#ff8c00] bg-[#ff8c00]/10 text-[#ff8c00]"
                      : "border-[#e7e1da] bg-[#fafaf8] text-[#8d785e] hover:border-[#ff8c00]/40"
                  }`}
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  style={{ fontWeight: selected ? 600 : 400 }}
                  type="button"
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Regions */}
        <section className="rounded-xl border border-[#e7e1da] bg-white p-5">
          <div
            className="mb-3 text-[#8d785e] text-[13px]"
            style={{ fontWeight: 600 }}
          >
            אזורי פעילות
          </div>
          <div className="flex flex-wrap gap-2">
            {OPERATING_REGIONS.map((reg) => {
              const selected = selectedRegions.includes(reg.value);
              return (
                <button
                  className={`rounded-lg border px-3 py-2 text-[13px] transition-all ${
                    selected
                      ? "border-[#ff8c00] bg-[#ff8c00]/10 text-[#ff8c00]"
                      : "border-[#e7e1da] bg-[#fafaf8] text-[#8d785e] hover:border-[#ff8c00]/40"
                  }`}
                  key={reg.value}
                  onClick={() => toggleRegion(reg.value)}
                  style={{ fontWeight: selected ? 600 : 400 }}
                  type="button"
                >
                  {reg.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Online & Business */}
        <section className="rounded-xl border border-[#e7e1da] bg-white p-5">
          <div
            className="mb-4 flex items-center gap-2 text-[#8d785e] text-[13px]"
            style={{ fontWeight: 600 }}
          >
            <Globe className="text-[#ff8c00]" size={14} />
            נוכחות מקוונת ועסקית
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="mb-1 block text-[#8d785e] text-[13px]"
                  htmlFor="profile-website"
                  style={{ fontWeight: 600 }}
                >
                  אתר אינטרנט
                </label>
                <input
                  className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                  dir="ltr"
                  id="profile-website"
                  placeholder="https://..."
                  {...register("websiteUrl")}
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-[#8d785e] text-[13px]"
                  htmlFor="profile-facebook"
                  style={{ fontWeight: 600 }}
                >
                  פייסבוק
                </label>
                <input
                  className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                  dir="ltr"
                  id="profile-facebook"
                  placeholder="https://facebook.com/..."
                  {...register("facebookUrl")}
                />
              </div>
            </div>

            <div>
              <label
                className="mb-1 block text-[#8d785e] text-[13px]"
                htmlFor="profile-hours"
                style={{ fontWeight: 600 }}
              >
                שעות פעילות
              </label>
              <input
                className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                id="profile-hours"
                placeholder="א׳-ה׳ 08:00-17:00"
                {...register("operatingHours")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="mb-1 block text-[#8d785e] text-[13px]"
                  htmlFor="profile-margin"
                  style={{ fontWeight: 600 }}
                >
                  אחוז מרווח ברירת מחדל
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] py-2.5 pr-3 pl-8 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                    id="profile-margin"
                    placeholder="0"
                    type="number"
                    {...register("defaultMarginPercent")}
                  />
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[#b8a990] text-[13px]">
                    %
                  </span>
                </div>
              </div>
              <div>
                <label
                  className="mb-1 block text-[#8d785e] text-[13px]"
                  htmlFor="profile-seasonal"
                  style={{ fontWeight: 600 }}
                >
                  זמינות עונתית
                </label>
                <input
                  className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                  id="profile-seasonal"
                  placeholder="כל השנה / מרץ-נובמבר"
                  {...register("seasonalAvailability")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Save button */}
        <div className="sticky bottom-6">
          <button
            className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] transition-all ${
              saveSuccess
                ? "bg-green-500 text-white"
                : hasFormChanges
                  ? "bg-[#ff8c00] text-white shadow-[#ff8c00]/25 shadow-lg hover:bg-[#e67e00]"
                  : "cursor-not-allowed bg-[#e7e1da] text-[#b8a990]"
            }`}
            disabled={saving || !hasFormChanges}
            style={{ fontWeight: 600 }}
            type="submit"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={16} /> שומר...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 size={16} /> נשמר בהצלחה!
              </>
            ) : (
              <>
                <Save size={16} /> שמור שינויים
              </>
            )}
          </button>
        </div>
      </form>

      {/* Category approval modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="relative mx-4 w-full max-w-md rounded-xl border border-[#e7e1da] bg-white p-6 shadow-xl"
            dir="rtl"
          >
            <button
              className="absolute top-3 left-3 rounded-lg p-1 text-[#8d785e] transition-colors hover:bg-[#f8f7f5]"
              onClick={() => setShowApprovalModal(false)}
              type="button"
            >
              <X size={18} />
            </button>

            <h2
              className="mb-2 text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              נדרש אישור מנהל
            </h2>
            <p className="mb-5 text-[#8d785e] text-[14px] leading-relaxed">
              הגעת למקסימום של {MAX_CATEGORIES_WITHOUT_APPROVAL} קטגוריות.
              להוספת קטגוריות נוספות נדרש אישור מנהל המערכת.
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 rounded-xl bg-[#ff8c00] py-2.5 text-[14px] text-white transition-colors hover:bg-[#e67e00]"
                onClick={handleApprovalRequest}
                style={{ fontWeight: 600 }}
                type="button"
              >
                שלח בקשת אישור
              </button>
              <button
                className="flex-1 rounded-xl border border-[#e7e1da] bg-white py-2.5 text-[#8d785e] text-[14px] transition-colors hover:bg-[#f8f7f5]"
                onClick={() => setShowApprovalModal(false)}
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
