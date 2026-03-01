import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertTriangle,
  Trash2,
  Users,
  Bell,
  User,
  FolderOpen,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { he } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import type { Project, CalendarEvent, CalendarEventType } from './data';
import { projectsApi, calendarApi } from './api';
import { appToast } from './AppToast';
import { MonthlyView } from './calendar/MonthlyView';
import { WeeklyView } from './calendar/WeeklyView';
import { DailyView } from './calendar/DailyView';
import { EventFormModal } from './calendar/EventFormModal';

// ─── Shared types ────────────────────────────────

type ViewMode = 'month' | 'week' | 'day';

export interface DisplayEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: CalendarEventType | 'project';
  typeLabel: string;
  color: string;
  source: 'calendar' | 'project';
  projectId?: string;
  originalEvent?: CalendarEvent;
  originalProject?: Project;
}

const EVENT_TYPE_CONFIG: Record<
  CalendarEventType | 'project',
  { label: string; color: string }
> = {
  meeting: { label: 'פגישה', color: '#3b82f6' },
  deadline: { label: 'דדליין', color: '#ef4444' },
  reminder: { label: 'תזכורת', color: '#f59e0b' },
  personal: { label: 'אישי', color: '#8b5cf6' },
  project: { label: 'פרויקט', color: '#ff8c00' },
};

const VIEW_TABS: { key: ViewMode; label: string }[] = [
  { key: 'month', label: 'חודש' },
  { key: 'week', label: 'שבוע' },
  { key: 'day', label: 'יום' },
];

// ─── Component ───────────────────────────────────

export function CalendarPage() {
  const navigate = useNavigate();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Data state
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  // ─── Data loading ─────────────────────────────

  useEffect(() => {
    setLoading(true);
    Promise.all([
      calendarApi.list().catch(() => [] as CalendarEvent[]),
      projectsApi.list().catch(() => [] as Project[]),
    ])
      .then(([events, projs]) => {
        setCalendarEvents(events);
        setProjects(projs);
      })
      .finally(() => setLoading(false));
  }, []);

  // ─── Merged display events ────────────────────

  const displayEvents = useMemo<DisplayEvent[]>(() => {
    const fromCalendar: DisplayEvent[] = calendarEvents.map((ev) => ({
      id: ev.id,
      title: ev.title,
      description: ev.description,
      date: ev.date,
      startTime: ev.startTime,
      endTime: ev.endTime,
      type: ev.type,
      typeLabel: EVENT_TYPE_CONFIG[ev.type]?.label || ev.type,
      color: ev.color || EVENT_TYPE_CONFIG[ev.type]?.color || '#8d785e',
      source: 'calendar' as const,
      projectId: ev.projectId,
      originalEvent: ev,
    }));

    const fromProjects: DisplayEvent[] = projects
      .filter((p) => p.date)
      .map((p) => ({
        id: `project-${p.id}`,
        title: p.name,
        description: `${p.company} | ${p.participants} משתתפים | ${p.region}`,
        date: p.date,
        startTime: '09:00',
        endTime: '17:00',
        type: 'project' as const,
        typeLabel: 'פרויקט',
        color: p.statusColor || '#ff8c00',
        source: 'project' as const,
        projectId: p.id,
        originalProject: p,
      }));

    return [...fromCalendar, ...fromProjects];
  }, [calendarEvents, projects]);

  // ─── Navigation ───────────────────────────────

  const navigatePrev = () => {
    if (viewMode === 'month') setCurrentDate((d) => subMonths(d, 1));
    else if (viewMode === 'week') setCurrentDate((d) => subWeeks(d, 1));
    else setCurrentDate((d) => subDays(d, 1));
  };

  const navigateNext = () => {
    if (viewMode === 'month') setCurrentDate((d) => addMonths(d, 1));
    else if (viewMode === 'week') setCurrentDate((d) => addWeeks(d, 1));
    else setCurrentDate((d) => addDays(d, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const headerDateText = useMemo(() => {
    if (viewMode === 'month')
      return format(currentDate, 'MMMM yyyy', { locale: he });
    if (viewMode === 'week') {
      const ws = startOfWeek(currentDate, { weekStartsOn: 0 });
      const we = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(ws, 'd', { locale: he })} - ${format(we, 'd MMMM yyyy', { locale: he })}`;
    }
    return format(currentDate, 'EEEE, d MMMM yyyy', { locale: he });
  }, [currentDate, viewMode]);

  // ─── CRUD handlers ────────────────────────────

  const handleNewEvent = (date?: Date) => {
    setEditingEvent(null);
    if (date) setSelectedDate(date);
    setShowEventModal(true);
  };

  const handleEditEvent = (event: DisplayEvent) => {
    if (event.source === 'project') {
      navigate(`/projects/${event.projectId}`);
      return;
    }
    setEditingEvent(event.originalEvent!);
    setShowEventModal(true);
  };

  const handleSaveEvent = async (data: Partial<CalendarEvent>) => {
    try {
      setSaving(true);
      if (editingEvent) {
        const updated = await calendarApi.update(editingEvent.id, data);
        setCalendarEvents((prev) =>
          prev.map((e) => (e.id === editingEvent.id ? updated : e))
        );
        appToast.success('אירוע עודכן', `"${updated.title}" עודכן בהצלחה`);
      } else {
        const created = await calendarApi.create(data);
        setCalendarEvents((prev) => [created, ...prev]);
        appToast.success('אירוע חדש נוצר', `"${created.title}" נוסף ליומן`);
      }
      setShowEventModal(false);
      setEditingEvent(null);
    } catch (err) {
      console.error('[CalendarPage] Save failed:', err);
      appToast.error('שגיאה', 'לא ניתן לשמור את האירוע');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!deletingEvent) return;
    try {
      setSaving(true);
      await calendarApi.delete(deletingEvent.id);
      setCalendarEvents((prev) =>
        prev.filter((e) => e.id !== deletingEvent.id)
      );
      appToast.success(
        'אירוע נמחק',
        `"${deletingEvent.title}" הוסר מהיומן`
      );
      setDeletingEvent(null);
    } catch (err) {
      console.error('[CalendarPage] Delete failed:', err);
      appToast.error('שגיאה', 'לא ניתן למחוק את האירוע');
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────

  return (
    <div
      className="p-4 lg:p-6 font-['Assistant',sans-serif]"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff8c00]/10 rounded-xl flex items-center justify-center">
            <CalendarIcon size={20} className="text-[#ff8c00]" />
          </div>
          <h1
            className="text-[24px] text-[#181510]"
            style={{ fontWeight: 700 }}
          >
            יומן
          </h1>
        </div>
        <button
          onClick={() => handleNewEvent()}
          className="flex items-center gap-2 text-[14px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} />
          אירוע חדש
        </button>
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* View toggle */}
        <div className="flex bg-white border border-[#e7e1da] rounded-lg p-1 shadow-sm">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key)}
              className={`px-4 py-1.5 rounded-md text-[13px] transition-all ${
                viewMode === tab.key
                  ? 'bg-[#ff8c00] text-white shadow-sm'
                  : 'text-[#8d785e] hover:text-[#181510] hover:bg-[#f5f3f0]'
              }`}
              style={{ fontWeight: 600 }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={navigateNext}
            className="w-8 h-8 bg-white border border-[#e7e1da] rounded-lg flex items-center justify-center hover:bg-[#f5f3f0] transition-colors"
          >
            <ChevronRight size={14} className="text-[#181510]" />
          </button>
          <button
            onClick={navigatePrev}
            className="w-8 h-8 bg-white border border-[#e7e1da] rounded-lg flex items-center justify-center hover:bg-[#f5f3f0] transition-colors"
          >
            <ChevronLeft size={14} className="text-[#181510]" />
          </button>
          <span
            className="text-[15px] text-[#181510] min-w-[180px] text-center"
            style={{ fontWeight: 700 }}
          >
            {headerDateText}
          </span>
          <button
            onClick={goToToday}
            className="text-[13px] text-[#ff8c00] hover:text-[#e67e00] border border-[#ff8c00]/30 hover:border-[#ff8c00] px-3 py-1.5 rounded-lg transition-colors"
            style={{ fontWeight: 600 }}
          >
            היום
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2
            size={32}
            className="animate-spin text-[#ff8c00]"
          />
        </div>
      )}

      {/* Views */}
      {!loading && (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === 'month' && (
              <MonthlyView
                currentDate={currentDate}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                events={displayEvents}
                onEventClick={handleEditEvent}
                onNewEvent={handleNewEvent}
              />
            )}
            {viewMode === 'week' && (
              <WeeklyView
                currentDate={currentDate}
                events={displayEvents}
                onEventClick={handleEditEvent}
                onNewEvent={handleNewEvent}
              />
            )}
            {viewMode === 'day' && (
              <DailyView
                currentDate={currentDate}
                events={displayEvents}
                onEventClick={handleEditEvent}
                onNewEvent={handleNewEvent}
                onDeleteEvent={setDeletingEvent}
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Event form modal */}
      {showEventModal && (
        <EventFormModal
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
          editingEvent={editingEvent}
          saving={saving}
          selectedDate={selectedDate}
          projects={projects}
        />
      )}

      {/* Delete confirmation modal */}
      {deletingEvent && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setDeletingEvent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 font-['Assistant',sans-serif]"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <div>
                <h3
                  className="text-[18px] text-[#181510]"
                  style={{ fontWeight: 700 }}
                >
                  מחיקת אירוע
                </h3>
                <p className="text-[13px] text-[#8d785e]">
                  פעולה זו אינה ניתנת לביטול
                </p>
              </div>
            </div>
            <p className="text-[14px] text-[#181510] mb-5">
              האם אתה בטוח שברצונך למחוק את האירוע{' '}
              <span style={{ fontWeight: 700 }}>
                &quot;{deletingEvent.title}&quot;
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteEvent}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors text-[14px]"
                style={{ fontWeight: 600 }}
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {saving ? 'מוחק...' : 'כן, מחק'}
              </button>
              <button
                onClick={() => setDeletingEvent(null)}
                className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors text-[14px] text-[#181510]"
                style={{ fontWeight: 600 }}
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
