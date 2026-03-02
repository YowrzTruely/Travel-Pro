import { format } from "date-fns";
import { he } from "date-fns/locale";
import {
  CalendarDays,
  Clock,
  FolderOpen,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import type { DisplayEvent } from "../CalendarPage";
import type { CalendarEvent } from "../data";

interface DailyViewProps {
  currentDate: Date;
  events: DisplayEvent[];
  onDeleteEvent: (event: CalendarEvent) => void;
  onEventClick: (event: DisplayEvent) => void;
  onNewEvent: (date: Date) => void;
}

export function DailyView({
  currentDate,
  events,
  onEventClick,
  onNewEvent,
  onDeleteEvent,
}: DailyViewProps) {
  const dayEvents = useMemo(() => {
    const dayKey = format(currentDate, "yyyy-MM-dd");
    return events
      .filter((ev) => ev.date === dayKey)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, currentDate]);

  return (
    <div className="space-y-4">
      {/* Day header */}
      <div className="rounded-xl border border-[#e7e1da] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          <div>
            <h3
              className="text-[#181510] text-[20px]"
              style={{ fontWeight: 700 }}
            >
              {format(currentDate, "EEEE", { locale: he })}
            </h3>
            <p className="mt-0.5 text-[#8d785e] text-[14px]">
              {format(currentDate, "d MMMM yyyy", { locale: he })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-lg bg-[#f5f3f0] px-3 py-1.5 text-[#8d785e] text-[13px]"
              style={{ fontWeight: 600 }}
            >
              {dayEvents.length} אירועים
            </span>
            <button
              className="flex items-center gap-1.5 rounded-lg bg-[#ff8c00] px-3 py-1.5 text-[13px] text-white transition-colors hover:bg-[#e67e00]"
              onClick={() => onNewEvent(currentDate)}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <Plus size={14} />
              אירוע חדש
            </button>
          </div>
        </div>
      </div>

      {/* Events */}
      {dayEvents.length === 0 ? (
        <div className="rounded-xl border border-[#e7e1da] bg-white p-10 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center justify-center text-center">
            <CalendarDays
              className="mb-3 text-[#e7e1da]"
              size={40}
              strokeWidth={1.5}
            />
            <h4
              className="mb-1 text-[#181510] text-[16px]"
              style={{ fontWeight: 600 }}
            >
              אין אירועים ביום זה
            </h4>
            <p className="mb-4 text-[#8d785e] text-[13px]">
              לחץ על "אירוע חדש" כדי להוסיף אירוע
            </p>
            <button
              className="flex items-center gap-2 text-[#ff8c00] text-[13px] transition-colors hover:text-[#e67e00]"
              onClick={() => onNewEvent(currentDate)}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <Plus size={14} />
              צור אירוע חדש
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((ev, idx) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[#e7e1da] bg-white p-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:border-[#d6cfc6]"
              initial={{ opacity: 0, y: 10 }}
              key={ev.id}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <div className="flex items-start gap-3">
                {/* Color bar */}
                <div
                  className="mt-0.5 min-h-[56px] w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: ev.color }}
                />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4
                        className="truncate text-[#181510] text-[16px]"
                        style={{ fontWeight: 600 }}
                      >
                        {ev.title}
                      </h4>
                      <div className="mt-1 flex items-center gap-2">
                        <Clock className="shrink-0 text-[#8d785e]" size={12} />
                        <span className="text-[#8d785e] text-[13px]">
                          {ev.startTime} - {ev.endTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {/* Type badge */}
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px]"
                        style={{
                          backgroundColor: `${ev.color}15`,
                          color: ev.color,
                          fontWeight: 600,
                        }}
                      >
                        {ev.typeLabel}
                      </span>

                      {/* Project badge */}
                      {ev.source === "project" && (
                        <span className="flex items-center gap-1 rounded-full bg-[#ff8c00]/10 px-2.5 py-1 text-[#ff8c00] text-[11px]">
                          <FolderOpen size={10} />
                          פרויקט
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {ev.description && (
                    <p className="mt-2 text-[#8d785e]/80 text-[13px] leading-relaxed">
                      {ev.description}
                    </p>
                  )}

                  {/* Actions for calendar events */}
                  {ev.source === "calendar" && (
                    <div className="mt-3 flex items-center gap-3 border-[#f5f3f0] border-t pt-3">
                      <button
                        className="flex items-center gap-1.5 text-[#8d785e] text-[12px] transition-colors hover:text-[#181510]"
                        onClick={() => onEventClick(ev)}
                        style={{ fontWeight: 500 }}
                        type="button"
                      >
                        <Pencil size={12} />
                        עריכה
                      </button>
                      <button
                        className="flex items-center gap-1.5 text-[#8d785e] text-[12px] transition-colors hover:text-red-500"
                        onClick={() =>
                          ev.originalEvent && onDeleteEvent(ev.originalEvent)
                        }
                        style={{ fontWeight: 500 }}
                        type="button"
                      >
                        <Trash2 size={12} />
                        מחיקה
                      </button>
                    </div>
                  )}

                  {/* Project link for project events */}
                  {ev.source === "project" && (
                    <div className="mt-3 flex items-center gap-3 border-[#f5f3f0] border-t pt-3">
                      <button
                        className="flex items-center gap-1.5 text-[#ff8c00] text-[12px] transition-colors hover:text-[#e67e00]"
                        onClick={() => onEventClick(ev)}
                        style={{ fontWeight: 500 }}
                        type="button"
                      >
                        <FolderOpen size={12} />
                        צפה בפרויקט
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
