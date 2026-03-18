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
import { useEffect, useMemo, useRef, useState } from "react";
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
  // 1 = forward (next), -1 = backward (prev), used for carousel direction
  const [slideDirection, setSlideDirection] = useState(0);

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
    setSlideDirection(-1);
    if (viewMode === "month") {
      setCurrentDate((d) => subMonths(d, 1));
    } else if (viewMode === "week") {
      setCurrentDate((d) => subWeeks(d, 1));
    } else {
      setCurrentDate((d) => subDays(d, 1));
    }
  };

  const navigateNext = () => {
    setSlideDirection(1);
    if (viewMode === "month") {
      setCurrentDate((d) => addMonths(d, 1));
    } else if (viewMode === "week") {
      setCurrentDate((d) => addWeeks(d, 1));
    } else {
      setCurrentDate((d) => addDays(d, 1));
    }
  };

  const goToToday = () => {
    setSlideDirection(0);
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <CalendarIcon className="text-primary" size={20} />
          </div>
          <h1
            className="text-[24px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            יומן
          </h1>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[14px] text-white shadow-sm transition-colors hover:bg-primary-hover"
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
        {/* View toggle with glass animation */}
        <CalendarViewToggle
          activeView={viewMode}
          onViewChange={setViewMode}
          tabs={VIEW_TABS}
        />

        {/* Date navigation */}
        <div className="flex items-center gap-3">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent"
            onClick={navigateNext}
            type="button"
          >
            <ChevronRight className="text-foreground" size={14} />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent"
            onClick={navigatePrev}
            type="button"
          >
            <ChevronLeft className="text-foreground" size={14} />
          </button>
          <span
            className="min-w-[180px] text-center text-[15px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            {headerDateText}
          </span>
          <button
            className="rounded-lg border border-primary/30 px-3 py-1.5 text-[13px] text-primary transition-colors hover:border-primary hover:text-primary-hover"
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
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      )}

      {/* Views — carousel slide on date nav, fade on view switch */}
      {!loading && (
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x:
                  slideDirection === 0
                    ? 0
                    : slideDirection > 0
                      ? "30%"
                      : "-30%",
              }}
              initial={{
                opacity: 0,
                x:
                  slideDirection === 0
                    ? 0
                    : slideDirection > 0
                      ? "-30%"
                      : "30%",
              }}
              key={`${viewMode}-${currentDate.toISOString()}`}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 32,
                mass: 0.8,
              }}
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
        </div>
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
            className="w-full max-w-sm rounded-2xl bg-card p-6 font-['Assistant',sans-serif] shadow-2xl"
            dir="rtl"
            role="dialog"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle className="text-destructive" size={24} />
              </div>
              <div>
                <h3
                  className="text-[18px] text-foreground"
                  style={{ fontWeight: 700 }}
                >
                  מחיקת אירוע
                </h3>
                <p className="text-[13px] text-muted-foreground">
                  פעולה זו אינה ניתנת לביטול
                </p>
              </div>
            </div>
            <p className="mb-5 text-[14px] text-foreground">
              האם אתה בטוח שברצונך למחוק את האירוע{" "}
              <span style={{ fontWeight: 700 }}>
                &quot;{deletingEvent.title}&quot;
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-destructive/100 py-2.5 text-[14px] text-white transition-colors hover:bg-destructive disabled:opacity-50"
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
                className="rounded-xl border border-border px-5 text-[14px] text-foreground transition-colors hover:bg-accent"
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

/* ─── Glass View Toggle ────────────────────────── */

function CalendarViewToggle({
  tabs,
  activeView,
  onViewChange,
}: {
  tabs: { key: ViewMode; label: string }[];
  activeView: ViewMode;
  onViewChange: (v: ViewMode) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ width: 0, right: 0 });

  useEffect(() => {
    const el = tabRefs.current.get(activeView);
    const container = containerRef.current;
    if (!(el && container)) {
      return;
    }
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setIndicator({
      width: eRect.width,
      right: cRect.right - eRect.right,
    });
  }, [activeView]);

  return (
    <div
      className="relative flex rounded-xl border border-border bg-card p-1 shadow-sm"
      ref={containerRef}
    >
      <motion.div
        animate={{ right: indicator.right, width: indicator.width }}
        className="absolute top-1 bottom-1 rounded-lg"
        initial={false}
        style={{
          background: "#ff8c00",
          boxShadow: "0 2px 8px rgba(255,140,0,0.3)",
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 30,
          mass: 0.7,
        }}
      />
      {tabs.map((tab) => (
        <button
          className="relative z-10 cursor-pointer rounded-md px-4 py-1.5 text-[13px] transition-colors duration-200"
          key={tab.key}
          onClick={() => onViewChange(tab.key)}
          ref={(el) => {
            if (el) {
              tabRefs.current.set(tab.key, el);
            }
          }}
          style={{
            fontWeight: 600,
            color: activeView === tab.key ? "#fff" : "#8d785e",
          }}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
