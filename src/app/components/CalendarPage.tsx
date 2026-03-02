import { useMutation, useQuery } from "convex/react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { he } from "date-fns/locale";
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import { DailyView } from "./calendar/DailyView";
import { EventFormModal } from "./calendar/EventFormModal";
import { MonthlyView } from "./calendar/MonthlyView";
import { WeeklyView } from "./calendar/WeeklyView";
import type { CalendarEvent, CalendarEventType, Project } from "./data";

// ─── Shared types ────────────────────────────────

type ViewMode = "month" | "week" | "day";

export interface DisplayEvent {
  color: string;
  date: string;
  description: string;
  endTime: string;
  id: string;
  originalEvent?: CalendarEvent;
  originalProject?: Project;
  projectId?: string;
  source: "calendar" | "project";
  startTime: string;
  title: string;
  type: CalendarEventType | "project";
  typeLabel: string;
}

const EVENT_TYPE_CONFIG: Record<
  CalendarEventType | "project",
  { label: string; color: string }
> = {
  meeting: { label: "פגישה", color: "#3b82f6" },
  deadline: { label: "דדליין", color: "#ef4444" },
  reminder: { label: "תזכורת", color: "#f59e0b" },
  personal: { label: "אישי", color: "#8b5cf6" },
  project: { label: "פרויקט", color: "#ff8c00" },
};

const VIEW_TABS: { key: ViewMode; label: string }[] = [
  { key: "month", label: "חודש" },
  { key: "week", label: "שבוע" },
  { key: "day", label: "יום" },
];

// ─── Component ───────────────────────────────────

export function CalendarPage() {
  const navigate = useNavigate();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Convex queries — auto-updating, no manual refetch needed
  const calendarEvents = useQuery(api.calendarEvents.list);
  const projects = useQuery(api.projects.list);

  // Convex mutations
  const createEvent = useMutation(api.calendarEvents.create);
  const updateEvent = useMutation(api.calendarEvents.update);
  const removeEvent = useMutation(api.calendarEvents.remove);

  // Loading state: undefined means still loading
  const loading = calendarEvents === undefined || projects === undefined;

  // Modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  // ─── Merged display events ────────────────────

  const displayEvents = useMemo<DisplayEvent[]>(() => {
    const fromCalendar = (calendarEvents ?? []).map((ev): DisplayEvent => {
      const eventType = (ev.type || "meeting") as CalendarEventType;
      return {
        id: ev.id as string,
        title: ev.title,
        description: ev.description || "",
        date: ev.date,
        startTime: ev.startTime || "09:00",
        endTime: ev.endTime || "10:00",
        type: eventType,
        typeLabel: EVENT_TYPE_CONFIG[eventType]?.label || eventType,
        color: ev.color || EVENT_TYPE_CONFIG[eventType]?.color || "#8d785e",
        source: "calendar" as const,
        projectId: ev.projectId,
        originalEvent: ev as CalendarEvent,
      };
    });

    const fromProjects = (projects ?? [])
      .filter((p) => p.date)
      .map(
        (p): DisplayEvent => ({
          id: `project-${p.id as string}`,
          title: p.name,
          description: `${p.company || p.client || ""} | ${p.participants} משתתפים | ${p.region || ""}`,
          date: p.date || "",
          startTime: "09:00",
          endTime: "17:00",
          type: "project" as const,
          typeLabel: "פרויקט",
          color: p.statusColor || "#ff8c00",
          source: "project" as const,
          projectId: p.id as string,
          originalProject: p as Project,
        })
      );

    return [...fromCalendar, ...fromProjects];
  }, [calendarEvents, projects]);

  // ─── Navigation ───────────────────────────────

  const navigatePrev = () => {
    if (viewMode === "month") {
      setCurrentDate((d) => subMonths(d, 1));
    } else if (viewMode === "week") {
      setCurrentDate((d) => subWeeks(d, 1));
    } else {
      setCurrentDate((d) => subDays(d, 1));
    }
  };

  const navigateNext = () => {
    if (viewMode === "month") {
      setCurrentDate((d) => addMonths(d, 1));
    } else if (viewMode === "week") {
      setCurrentDate((d) => addWeeks(d, 1));
    } else {
      setCurrentDate((d) => addDays(d, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const headerDateText = useMemo(() => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy", { locale: he });
    }
    if (viewMode === "week") {
      const ws = startOfWeek(currentDate, { weekStartsOn: 0 });
      const we = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(ws, "d", { locale: he })} - ${format(we, "d MMMM yyyy", { locale: he })}`;
    }
    return format(currentDate, "EEEE, d MMMM yyyy", { locale: he });
  }, [currentDate, viewMode]);

  // ─── CRUD handlers ────────────────────────────

  const handleNewEvent = (date?: Date) => {
    setEditingEvent(null);
    if (date) {
      setSelectedDate(date);
    }
    setShowEventModal(true);
  };

  const handleEditEvent = (event: DisplayEvent) => {
    if (event.source === "project") {
      navigate(`/projects/${event.projectId}`);
      return;
    }
    if (event.originalEvent) {
      setEditingEvent(event.originalEvent);
      setShowEventModal(true);
    }
  };

  const handleSaveEvent = async (data: Partial<CalendarEvent>) => {
    try {
      setSaving(true);
      if (editingEvent) {
        await updateEvent({
          id: editingEvent.id as any,
          ...data,
        });
        appToast.success(
          "אירוע עודכן",
          `"${data.title || editingEvent.title}" עודכן בהצלחה`
        );
      } else {
        await createEvent({
          title: data.title || "אירוע חדש",
          description: data.description || "",
          date: data.date || new Date().toISOString().split("T")[0],
          startTime: data.startTime || "09:00",
          endTime: data.endTime || "10:00",
          type: data.type || "meeting",
          color: data.color || "#3b82f6",
          projectId: data.projectId,
        });
        appToast.success("אירוע חדש נוצר", `"${data.title}" נוסף ליומן`);
      }
      setShowEventModal(false);
      setEditingEvent(null);
    } catch (err) {
      console.error("[CalendarPage] Save failed:", err);
      appToast.error("שגיאה", "לא ניתן לשמור את האירוע");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!deletingEvent) {
      return;
    }
    try {
      setSaving(true);
      await removeEvent({ id: deletingEvent.id as any });
      appToast.success("אירוע נמחק", `"${deletingEvent.title}" הוסר מהיומן`);
      setDeletingEvent(null);
    } catch (err) {
      console.error("[CalendarPage] Delete failed:", err);
      appToast.error("שגיאה", "לא ניתן למחוק את האירוע");
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────

  return (
    <div className="p-4 font-['Assistant',sans-serif] lg:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff8c00]/10">
            <CalendarIcon className="text-[#ff8c00]" size={20} />
          </div>
          <h1
            className="text-[#181510] text-[24px]"
            style={{ fontWeight: 700 }}
          >
            יומן
          </h1>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-[#ff8c00] px-4 py-2.5 text-[14px] text-white shadow-sm transition-colors hover:bg-[#e67e00]"
          onClick={() => handleNewEvent()}
          style={{ fontWeight: 600 }}
          type="button"
        >
          <Plus size={16} />
          אירוע חדש
        </button>
      </div>

      {/* Controls row */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        {/* View toggle */}
        <div className="flex rounded-lg border border-[#e7e1da] bg-white p-1 shadow-sm">
          {VIEW_TABS.map((tab) => (
            <button
              className={`rounded-md px-4 py-1.5 text-[13px] transition-all ${
                viewMode === tab.key
                  ? "bg-[#ff8c00] text-white shadow-sm"
                  : "text-[#8d785e] hover:bg-[#f5f3f0] hover:text-[#181510]"
              }`}
              key={tab.key}
              onClick={() => setViewMode(tab.key)}
              style={{ fontWeight: 600 }}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date navigation */}
        <div className="flex items-center gap-3">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e7e1da] bg-white transition-colors hover:bg-[#f5f3f0]"
            onClick={navigateNext}
            type="button"
          >
            <ChevronRight className="text-[#181510]" size={14} />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e7e1da] bg-white transition-colors hover:bg-[#f5f3f0]"
            onClick={navigatePrev}
            type="button"
          >
            <ChevronLeft className="text-[#181510]" size={14} />
          </button>
          <span
            className="min-w-[180px] text-center text-[#181510] text-[15px]"
            style={{ fontWeight: 700 }}
          >
            {headerDateText}
          </span>
          <button
            className="rounded-lg border border-[#ff8c00]/30 px-3 py-1.5 text-[#ff8c00] text-[13px] transition-colors hover:border-[#ff8c00] hover:text-[#e67e00]"
            onClick={goToToday}
            style={{ fontWeight: 600 }}
            type="button"
          >
            היום
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#ff8c00]" size={32} />
        </div>
      )}

      {/* Views */}
      {!loading && (
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: 10 }}
            key={viewMode}
            transition={{ duration: 0.2 }}
          >
            {viewMode === "month" && (
              <MonthlyView
                currentDate={currentDate}
                events={displayEvents}
                onEventClick={handleEditEvent}
                onNewEvent={handleNewEvent}
                onSelectDate={setSelectedDate}
                selectedDate={selectedDate}
              />
            )}
            {viewMode === "week" && (
              <WeeklyView
                currentDate={currentDate}
                events={displayEvents}
                onEventClick={handleEditEvent}
                onNewEvent={handleNewEvent}
              />
            )}
            {viewMode === "day" && (
              <DailyView
                currentDate={currentDate}
                events={displayEvents}
                onDeleteEvent={setDeletingEvent}
                onEventClick={handleEditEvent}
                onNewEvent={handleNewEvent}
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Event form modal */}
      {showEventModal && (
        <EventFormModal
          editingEvent={editingEvent}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
          projects={(projects ?? []) as Project[]}
          saving={saving}
          selectedDate={selectedDate}
        />
      )}

      {/* Delete confirmation modal */}
      {deletingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDeletingEvent(null)}
          onKeyDown={(e) => e.key === "Escape" && e.currentTarget.click()}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 font-['Assistant',sans-serif] shadow-2xl"
            dir="rtl"
            role="dialog"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div>
                <h3
                  className="text-[#181510] text-[18px]"
                  style={{ fontWeight: 700 }}
                >
                  מחיקת אירוע
                </h3>
                <p className="text-[#8d785e] text-[13px]">
                  פעולה זו אינה ניתנת לביטול
                </p>
              </div>
            </div>
            <p className="mb-5 text-[#181510] text-[14px]">
              האם אתה בטוח שברצונך למחוק את האירוע{" "}
              <span style={{ fontWeight: 700 }}>
                &quot;{deletingEvent.title}&quot;
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-[14px] text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                disabled={saving}
                onClick={handleDeleteEvent}
                style={{ fontWeight: 600 }}
                type="button"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                {saving ? "מוחק..." : "כן, מחק"}
              </button>
              <button
                className="rounded-xl border border-[#e7e1da] px-5 text-[#181510] text-[14px] transition-colors hover:bg-[#f5f3f0]"
                onClick={() => setDeletingEvent(null)}
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
