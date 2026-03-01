import { useMemo } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  Clock,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { CalendarEvent } from '../data';
import type { DisplayEvent } from '../CalendarPage';

interface DailyViewProps {
  currentDate: Date;
  events: DisplayEvent[];
  onEventClick: (event: DisplayEvent) => void;
  onNewEvent: (date: Date) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

export function DailyView({
  currentDate,
  events,
  onEventClick,
  onNewEvent,
  onDeleteEvent,
}: DailyViewProps) {
  const dayEvents = useMemo(() => {
    const dayKey = format(currentDate, 'yyyy-MM-dd');
    return events
      .filter((ev) => ev.date === dayKey)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, currentDate]);

  return (
    <div className="space-y-4">
      {/* Day header */}
      <div className="bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3
              className="text-[20px] text-[#181510]"
              style={{ fontWeight: 700 }}
            >
              {format(currentDate, 'EEEE', { locale: he })}
            </h3>
            <p className="text-[14px] text-[#8d785e] mt-0.5">
              {format(currentDate, 'd MMMM yyyy', { locale: he })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[13px] text-[#8d785e] bg-[#f5f3f0] px-3 py-1.5 rounded-lg"
              style={{ fontWeight: 600 }}
            >
              {dayEvents.length} אירועים
            </span>
            <button
              onClick={() => onNewEvent(currentDate)}
              className="flex items-center gap-1.5 text-[13px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-3 py-1.5 rounded-lg transition-colors"
              style={{ fontWeight: 600 }}
            >
              <Plus size={14} />
              אירוע חדש
            </button>
          </div>
        </div>
      </div>

      {/* Events */}
      {dayEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-10">
          <div className="flex flex-col items-center justify-center text-center">
            <CalendarDays
              size={40}
              className="text-[#e7e1da] mb-3"
              strokeWidth={1.5}
            />
            <h4
              className="text-[16px] text-[#181510] mb-1"
              style={{ fontWeight: 600 }}
            >
              אין אירועים ביום זה
            </h4>
            <p className="text-[13px] text-[#8d785e] mb-4">
              לחץ על "אירוע חדש" כדי להוסיף אירוע
            </p>
            <button
              onClick={() => onNewEvent(currentDate)}
              className="flex items-center gap-2 text-[13px] text-[#ff8c00] hover:text-[#e67e00] transition-colors"
              style={{ fontWeight: 600 }}
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
              key={ev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-4 hover:border-[#d6cfc6] transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Color bar */}
                <div
                  className="w-1 min-h-[56px] rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: ev.color }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4
                        className="text-[16px] text-[#181510] truncate"
                        style={{ fontWeight: 600 }}
                      >
                        {ev.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-[#8d785e] shrink-0" />
                        <span className="text-[13px] text-[#8d785e]">
                          {ev.startTime} - {ev.endTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Type badge */}
                      <span
                        className="text-[11px] px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: ev.color + '15',
                          color: ev.color,
                          fontWeight: 600,
                        }}
                      >
                        {ev.typeLabel}
                      </span>

                      {/* Project badge */}
                      {ev.source === 'project' && (
                        <span className="flex items-center gap-1 text-[11px] text-[#ff8c00] bg-[#ff8c00]/10 px-2.5 py-1 rounded-full">
                          <FolderOpen size={10} />
                          פרויקט
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {ev.description && (
                    <p className="text-[13px] text-[#8d785e]/80 mt-2 leading-relaxed">
                      {ev.description}
                    </p>
                  )}

                  {/* Actions for calendar events */}
                  {ev.source === 'calendar' && (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#f5f3f0]">
                      <button
                        onClick={() => onEventClick(ev)}
                        className="flex items-center gap-1.5 text-[12px] text-[#8d785e] hover:text-[#181510] transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        <Pencil size={12} />
                        עריכה
                      </button>
                      <button
                        onClick={() => onDeleteEvent(ev.originalEvent!)}
                        className="flex items-center gap-1.5 text-[12px] text-[#8d785e] hover:text-red-500 transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        <Trash2 size={12} />
                        מחיקה
                      </button>
                    </div>
                  )}

                  {/* Project link for project events */}
                  {ev.source === 'project' && (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#f5f3f0]">
                      <button
                        onClick={() => onEventClick(ev)}
                        className="flex items-center gap-1.5 text-[12px] text-[#ff8c00] hover:text-[#e67e00] transition-colors"
                        style={{ fontWeight: 500 }}
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
