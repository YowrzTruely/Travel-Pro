import { useMutation } from "convex/react";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import { appToast } from "../AppToast";
import { OPERATING_REGIONS } from "../constants/supplierConstants";
import { FormField, FormSelect, FormTextarea, rules } from "../FormField";

interface NewLeadForm {
  budget: string;
  dateRequested: string;
  email: string;
  eventType: string;
  name: string;
  notes: string;
  participants: string;
  phone: string;
  preferences: string;
  region: string;
  source: string;
}

const SOURCE_OPTIONS = [
  { value: "facebook", label: "פייסבוק" },
  { value: "instagram", label: "אינסטגרם" },
  { value: "tiktok", label: "טיקטוק" },
  { value: "youtube", label: "יוטיוב" },
  { value: "linkedin", label: "לינקדאין" },
  { value: "whatsapp", label: "וואטסאפ" },
  { value: "phone", label: "טלפון" },
  { value: "manual", label: "ידני" },
  { value: "website", label: "אתר" },
] as const;

interface NewLeadModalProps {
  onClose: () => void;
}

export function NewLeadModal({ onClose }: NewLeadModalProps) {
  const createLead = useMutation(api.leads.create);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isValid },
  } = useForm<NewLeadForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      source: "phone",
      participants: "",
      dateRequested: "",
      budget: "",
      eventType: "",
      region: "",
      preferences: "",
      notes: "",
    },
  });

  const onSubmit = async (data: NewLeadForm) => {
    try {
      setSaving(true);
      await createLead({
        name: data.name.trim(),
        phone: data.phone.trim() || undefined,
        email: data.email.trim() || undefined,
        source: data.source as (typeof SOURCE_OPTIONS)[number]["value"],
        participants: data.participants
          ? Number.parseInt(data.participants, 10)
          : undefined,
        dateRequested: data.dateRequested || undefined,
        budget: data.budget ? Number.parseFloat(data.budget) : undefined,
        eventType: data.eventType.trim() || undefined,
        region: data.region.trim() || undefined,
        preferences: data.preferences.trim() || undefined,
        notes: data.notes.trim() || undefined,
      });
      appToast.success("ליד חדש נוצר בהצלחה!", "הליד נוסף לעמודת 'חדש'");
      onClose();
    } catch (err) {
      console.error("[NewLeadModal] Failed to create lead:", err);
      appToast.error("שגיאה ביצירת ליד", String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-[22px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            ליד חדש
          </h2>
          <button
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            error={errors.name}
            isDirty={dirtyFields.name}
            label="שם הליד"
            placeholder="שם הלקוח או החברה"
            required
            {...register("name", rules.requiredMin("שם הליד", 2))}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              error={errors.phone}
              isDirty={dirtyFields.phone}
              label="טלפון"
              placeholder="05X-XXXXXXX"
              {...register("phone")}
            />
            <FormField
              error={errors.email}
              isDirty={dirtyFields.email}
              label="אימייל"
              placeholder="email@example.com"
              type="email"
              {...register("email")}
            />
          </div>

          <FormSelect
            error={errors.source}
            isDirty={dirtyFields.source}
            label="מקור"
            {...register("source")}
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FormSelect>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              error={errors.participants}
              isDirty={dirtyFields.participants}
              label="מספר משתתפים"
              placeholder="120"
              type="number"
              {...register(
                "participants",
                rules.optionalPositiveInt("מספר משתתפים")
              )}
            />
            <FormField
              error={errors.budget}
              isDirty={dirtyFields.budget}
              label="תקציב (₪)"
              placeholder="50000"
              type="number"
              {...register("budget")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              error={errors.eventType}
              isDirty={dirtyFields.eventType}
              label="סוג אירוע"
              placeholder="יום כיף, גיבוש..."
              {...register("eventType")}
            />
            <FormField
              error={errors.dateRequested}
              isDirty={dirtyFields.dateRequested}
              label="תאריך מבוקש"
              style={{ direction: "rtl" }}
              type="date"
              {...register("dateRequested")}
            />
          </div>

          <FormSelect
            error={errors.region}
            isDirty={dirtyFields.region}
            label="אזור"
            {...register("region")}
          >
            <option value="">בחר אזור...</option>
            {OPERATING_REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </FormSelect>

          <FormTextarea
            error={errors.preferences}
            isDirty={dirtyFields.preferences}
            label="העדפות"
            placeholder="העדפות מיוחדות של הלקוח..."
            rows={2}
            {...register("preferences")}
          />

          <FormTextarea
            error={errors.notes}
            isDirty={dirtyFields.notes}
            label="הערות"
            placeholder="הערות נוספות..."
            rows={2}
            {...register("notes")}
          />

          <div className="flex gap-3 pt-2">
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              disabled={saving || !isValid}
              style={{ fontWeight: 600 }}
              type="submit"
            >
              {saving && <Loader2 className="animate-spin" size={16} />}
              {saving ? "יוצר..." : "צור ליד"}
            </button>
            <button
              className="rounded-lg border border-border px-6 py-2.5 text-foreground transition-colors hover:bg-accent"
              onClick={onClose}
              type="button"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
