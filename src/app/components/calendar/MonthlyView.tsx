import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
  parseISO,
} from 'date-fns';
import { he } from 'date-fns/locale';
import { Plus, CalendarDays, FolderOpen } from 'lucide-react';
import type { DisplayEvent } from '../CalendarPage';

const DAY_NAMES = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

interface MonthlyViewProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: DisplayEvent[];
  onEventClick: (event: DisplayEvent) => void;
  onNewEvent: (date: Date) => void;
}

export function MonthlyView({
  currentDate,
  selectedDate,
  onSelectDate,
  events,
  onEventClick,
  onNewEvent,
}: MonthlyViewProps) {
  const gridDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, DisplayEvent[]>();
    events.forEach((ev) => {
      const key = ev.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    });
    return map;
  }, [events]);

  const selectedDateEvents = useMemo(() => {
    const key = format(selectedDate, 'yyyy-MM-dd');
    return (eventsByDate.get(key) || []).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  }, [selectedDate, eventsByDate]);

  return (
    <div className="space-y-4">
      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Day name headers */}
        <div className="grid grid-cols-7 border-b border-[#e7e1da]">
          {DAY_NAMES.map((name, i) => (
            <div
              key={i}
              className="py-3 text-center text-[13px] text-[#8d785e]"
              style={{ fontWeight: 600 }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {gridDays.map((day, i) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDate.get(dayKey) || [];
            const inMonth = isSameMonth(day, currentDate);
            const selected = isSameDay(day, selectedDate);
            const today = isToday(day);

            return (
              <button
                key={i}
                onClick={() => onSelectDate(day)}
                onDoubleClick={() => onNewEvent(day)}
                className={`
                  relative min-h-[80px] lg:min-h-[100px] p-2 border-b border-l border-[#f5f3f0] text-right transition-colors
                  ${!inMonth ? 'bg-[#fdfcfb]' : 'bg-white hover:bg-[#fdfcfb]'}
                  ${selected ? 'bg-[#ff8c00]/5 ring-1 ring-inset ring-[#ff8c00]' : ''}
                `}
              >
                <span
                  className={`
                    inline-flex items-center justify-center w-7 h-7 rounded-full text-[13px]
                    ${!inMonth ? 'text-[#8d785e]/40' : 'text-[#181510]'}
                    ${today ? 'bg-[#ff8c00] text-white' : ''}
                    ${selected && !today ? 'bg-[#ff8c00]/15 text-[#ff8c00]' : ''}
                  `}
                  style={{ fontWeight: today || selected ? 700 : 400 }}
                >
                  {format(day, 'd')}
                </span>

                {/* Event dots */}
                {dayEvents.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dayEvents.slice(0, 3).map((ev, idx) => (
                      <div
                        key={idx}
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: ev.color }}
                        title={ev.title}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-[#8d785e]">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Event previews on larger screens */}
                <div className="hidden lg:block mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map((ev, idx) => (
                    <div
                      key={idx}
                      className="text-[10px] truncate rounded px-1 py-0.5 text-white leading-tight cursor-pointer"
                      style={{ backgroundColor: ev.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(ev);
                      }}
                    >
                      {ev.startTime} {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-[#8d785e] px-1">
                      +{dayEvents.length - 2} נוספים
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date events panel */}
      <div className="bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[16px] text-[#181510]"
            style={{ fontWeight: 600 }}
          >
            {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: he })}
          </h3>
          <button
            onClick={() => onNewEvent(selectedDate)}
            className="flex items-center gap-1.5 text-[13px] text-[#ff8c00] hover:text-[#e67e00] transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Plus size={14} />
            הוסף אירוע
          </button>
        </div>

        {selectedDateEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarDays
              size={32}
              className="text-[#e7e1da] mb-2"
              strokeWidth={1.5}
            />
            <p className="text-[14px] text-[#8d785e]">אין אירועים ביום זה</p>
            <button
              onClick={() => onNewEvent(selectedDate)}
              className="mt-3 text-[13px] text-[#ff8c00] hover:underline"
              style={{ fontWeight: 600 }}
            >
              + צור אירוע חדש
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDateEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => onEventClick(ev)}
                className="flex items-start gap-3 p-3 rounded-lg border border-[#f5f3f0] hover:border-[#e7e1da] hover:bg-[#fdfcfb] cursor-pointer transition-all"
              >
                <div
                  className="w-1 min-h-[40px] rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: ev.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[14px] text-[#181510] truncate"
                      style={{ fontWeight: 600 }}
                    >
                      {ev.title}
                    </span>
                    {ev.source === 'project' && (
                      <span className="flex items-center gap-1 text-[10px] text-[#ff8c00] bg-[#ff8c00]/10 px-2 py-0.5 rounded-full shrink-0">
                        <FolderOpen size={10} />
                        פרויקט
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-[#8d785e] mt-0.5">
                    {ev.startTime} - {ev.endTime}
                  </div>
                  {ev.description && (
                    <p className="text-[12px] text-[#8d785e]/80 mt-1 truncate">
                      {ev.description}
                    </p>
                  )}
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: ev.color + '15',
                    color: ev.color,
                    fontWeight: 600,
                  }}
                >
                  {ev.typeLabel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
