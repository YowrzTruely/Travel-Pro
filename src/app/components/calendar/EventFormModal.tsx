import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Loader2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import type { CalendarEvent, CalendarEventType, Project } from '../data';
import { FormField, FormSelect, FormTextarea, rules, messages } from '../FormField';

const EVENT_TYPE_OPTIONS: { value: CalendarEventType; label: string }[] = [
  { value: 'meeting', label: 'פגישה' },
  { value: 'deadline', label: 'דדליין' },
  { value: 'reminder', label: 'תזכורת' },
  { value: 'personal', label: 'אישי' },
];

const TYPE_COLORS: Record<CalendarEventType, string> = {
  meeting: '#3b82f6',
  deadline: '#ef4444',
  reminder: '#f59e0b',
  personal: '#8b5cf6',
};

interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: CalendarEventType;
  projectId: string;
}

interface EventFormModalProps {
  onClose: () => void;
  onSave: (data: Partial<CalendarEvent>) => Promise<void>;
  editingEvent: CalendarEvent | null;
  saving: boolean;
  selectedDate: Date;
  projects: Project[];
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
    mode: 'onChange',
    defaultValues: {
      title: editingEvent?.title || '',
      description: editingEvent?.description || '',
      date: editingEvent?.date || format(selectedDate, 'yyyy-MM-dd'),
      startTime: editingEvent?.startTime || '09:00',
      endTime: editingEvent?.endTime || '10:00',
      type: editingEvent?.type || 'meeting',
      projectId: editingEvent?.projectId || '',
    },
  });

  useEffect(() => {
    reset({
      title: editingEvent?.title || '',
      description: editingEvent?.description || '',
      date: editingEvent?.date || format(selectedDate, 'yyyy-MM-dd'),
      startTime: editingEvent?.startTime || '09:00',
      endTime: editingEvent?.endTime || '10:00',
      type: editingEvent?.type || 'meeting',
      projectId: editingEvent?.projectId || '',
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
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 font-['Assistant',sans-serif]"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-[20px] text-[#181510]"
            style={{ fontWeight: 700 }}
          >
            {editingEvent ? 'עריכת אירוע' : 'אירוע חדש'}
          </h3>
          <button
            onClick={onClose}
            className="text-[#8d785e] hover:text-[#181510] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="כותרת"
            required
            error={errors.title}
            isDirty={dirtyFields.title}
            placeholder="שם האירוע..."
            {...register('title', rules.requiredMin('כותרת', 2))}
          />

          <FormTextarea
            label="תיאור"
            rows={3}
            error={errors.description}
            isDirty={dirtyFields.description}
            placeholder="תיאור האירוע (אופציונלי)..."
            {...register('description')}
          />

          <FormField
            label="תאריך"
            type="date"
            required
            error={errors.date}
            isDirty={dirtyFields.date}
            {...register('date', rules.required('תאריך'))}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="שעת התחלה"
              type="time"
              required
              error={errors.startTime}
              isDirty={dirtyFields.startTime}
              {...register('startTime', rules.required('שעת התחלה'))}
            />
            <FormField
              label="שעת סיום"
              type="time"
              required
              error={errors.endTime}
              isDirty={dirtyFields.endTime}
              {...register('endTime', {
                required: messages.required('שעת סיום'),
                validate: (val) => {
                  const start = watch('startTime');
                  return (
                    val > start || 'שעת סיום חייבת להיות אחרי שעת ההתחלה'
                  );
                },
              })}
            />
          </div>

          <FormSelect
            label="סוג אירוע"
            error={errors.type}
            isDirty={dirtyFields.type}
            {...register('type')}
          >
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            label="קישור לפרויקט (אופציונלי)"
            error={errors.projectId}
            isDirty={dirtyFields.projectId}
            {...register('projectId')}
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
              type="submit"
              disabled={saving || !isValid}
              className="flex-1 flex items-center justify-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors text-[14px]"
              style={{ fontWeight: 600 }}
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : editingEvent ? (
                <Pencil size={16} />
              ) : (
                <Plus size={16} />
              )}
              {saving ? 'שומר...' : editingEvent ? 'עדכן אירוע' : 'צור אירוע'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors text-[14px] text-[#181510]"
              style={{ fontWeight: 600 }}
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
