import { format } from "date-fns";
import { Loader2, Pencil, Plus, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { CalendarEvent, CalendarEventType, Project } from "../data";
import {
  FormField,
  FormSelect,
  FormTextarea,
  messages,
  rules,
} from "../FormField";

const EVENT_TYPE_OPTIONS: { value: CalendarEventType; label: string }[] = [
  { value: "meeting", label: "פגישה" },
  { value: "deadline", label: "דדליין" },
  { value: "reminder", label: "תזכורת" },
  { value: "personal", label: "אישי" },
];

const TYPE_COLORS: Record<CalendarEventType, string> = {
  meeting: "#3b82f6",
  deadline: "#ef4444",
  reminder: "#f59e0b",
  personal: "#8b5cf6",
};

interface EventFormData {
  date: string;
  description: string;
  endTime: string;
  projectId: string;
  startTime: string;
  title: string;
  type: CalendarEventType;
}

interface EventFormModalProps {
  editingEvent: CalendarEvent | null;
  onClose: () => void;
  onSave: (data: Partial<CalendarEvent>) => Promise<void>;
  projects: Project[];
  saving: boolean;
  selectedDate: Date;
}

export function EventFormModal({
  onClose,
  onSave,
  editingEvent,
  saving,
  selectedDate,
  projects,
}: EventFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isValid },
    reset,
    watch,
  } = useForm<EventFormData>({
    mode: "onChange",
    defaultValues: {
      title: editingEvent?.title || "",
      description: editingEvent?.description || "",
      date: editingEvent?.date || format(selectedDate, "yyyy-MM-dd"),
      startTime: editingEvent?.startTime || "09:00",
      endTime: editingEvent?.endTime || "10:00",
      type: editingEvent?.type || "meeting",
      projectId: editingEvent?.projectId || "",
    },
  });

  useEffect(() => {
    reset({
      title: editingEvent?.title || "",
      description: editingEvent?.description || "",
      date: editingEvent?.date || format(selectedDate, "yyyy-MM-dd"),
      startTime: editingEvent?.startTime || "09:00",
      endTime: editingEvent?.endTime || "10:00",
      type: editingEvent?.type || "meeting",
      projectId: editingEvent?.projectId || "",
    });
  }, [editingEvent, selectedDate, reset]);

  const onSubmit = (formData: EventFormData) => {
    const color = TYPE_COLORS[formData.type];
    onSave({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      color,
      projectId: formData.projectId || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && e.currentTarget.click()}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl bg-white p-6 font-['Assistant',sans-serif] shadow-2xl"
        dir="rtl"
        role="dialog"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3
            className="text-[#181510] text-[20px]"
            style={{ fontWeight: 700 }}
          >
            {editingEvent ? "עריכת אירוע" : "אירוע חדש"}
          </h3>
          <button
            className="text-[#8d785e] transition-colors hover:text-[#181510]"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            error={errors.title}
            isDirty={dirtyFields.title}
            label="כותרת"
            placeholder="שם האירוע..."
            required
            {...register("title", rules.requiredMin("כותרת", 2))}
          />

          <FormTextarea
            error={errors.description}
            isDirty={dirtyFields.description}
            label="תיאור"
            placeholder="תיאור האירוע (אופציונלי)..."
            rows={3}
            {...register("description")}
          />

          <FormField
            error={errors.date}
            isDirty={dirtyFields.date}
            label="תאריך"
            required
            type="date"
            {...register("date", rules.required("תאריך"))}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              error={errors.startTime}
              isDirty={dirtyFields.startTime}
              label="שעת התחלה"
              required
              type="time"
              {...register("startTime", rules.required("שעת התחלה"))}
            />
            <FormField
              error={errors.endTime}
              isDirty={dirtyFields.endTime}
              label="שעת סיום"
              required
              type="time"
              {...register("endTime", {
                required: messages.required("שעת סיום"),
                validate: (val) => {
                  const start = watch("startTime");
                  return val > start || "שעת סיום חייבת להיות אחרי שעת ההתחלה";
                },
              })}
            />
          </div>

          <FormSelect
            error={errors.type}
            isDirty={dirtyFields.type}
            label="סוג אירוע"
            {...register("type")}
          >
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            error={errors.projectId}
            isDirty={dirtyFields.projectId}
            label="קישור לפרויקט (אופציונלי)"
            {...register("projectId")}
          >
            <option value="">ללא קישור</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - {p.company}
              </option>
            ))}
          </FormSelect>

          <div className="flex gap-3 pt-2">
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-2.5 text-[14px] text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
              disabled={saving || !isValid}
              style={{ fontWeight: 600 }}
              type="submit"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : editingEvent ? (
                <Pencil size={16} />
              ) : (
                <Plus size={16} />
              )}
              {saving ? "שומר..." : editingEvent ? "עדכן אירוע" : "צור אירוע"}
            </button>
            <button
              className="rounded-xl border border-[#e7e1da] px-5 text-[#181510] text-[14px] transition-colors hover:bg-[#f5f3f0]"
              onClick={onClose}
              style={{ fontWeight: 600 }}
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
