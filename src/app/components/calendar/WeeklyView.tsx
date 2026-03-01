import { useMemo } from 'react';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  format,
} from 'date-fns';
import { he } from 'date-fns/locale';
import type { DisplayEvent } from '../CalendarPage';

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_HEIGHT = 60;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

interface WeeklyViewProps {
  currentDate: Date;
  events: DisplayEvent[];
  onEventClick: (event: DisplayEvent) => void;
  onNewEvent: (date: Date) => void;
}

function getEventStyle(event: DisplayEvent) {
  const [startH, startM] = event.startTime.split(':').map(Number);
  const [endH, endM] = event.endTime.split(':').map(Number);
  const top = (startH - START_HOUR + startM / 60) * HOUR_HEIGHT;
  const duration = endH - startH + (endM - startM) / 60;
  const height = Math.max(duration * HOUR_HEIGHT, 24);
  return { top: `${Math.max(top, 0)}px`, height: `${height}px` };
}

export function WeeklyView({
  currentDate,
  events,
  onEventClick,
  onNewEvent,
}: WeeklyViewProps) {
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
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

  const totalHeight = HOURS.length * HOUR_HEIGHT;

  // Current time indicator position
  const now = new Date();
  const nowHour = now.getHours();
  const nowMin = now.getMinutes();
  const nowTop = (nowHour - START_HOUR + nowMin / 60) * HOUR_HEIGHT;
  const showNowLine = nowHour >= START_HOUR && nowHour < END_HOUR;

  return (
    <div className="bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-[50px_repeat(7,1fr)] border-b border-[#e7e1da]">
        <div className="border-l border-[#e7e1da]" />
        {weekDays.map((day, i) => {
          const today = isToday(day);
          return (
            <div
              key={i}
              className={`py-3 text-center border-l border-[#e7e1da] ${today ? 'bg-[#ff8c00]/5' : ''}`}
            >
              <div
                className="text-[12px] text-[#8d785e]"
                style={{ fontWeight: 500 }}
              >
                {format(day, 'EEEE', { locale: he })}
              </div>
              <div
                className={`text-[18px] mt-0.5 ${today ? 'text-[#ff8c00]' : 'text-[#181510]'}`}
                style={{ fontWeight: 700 }}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
        <div
          className="grid grid-cols-[50px_repeat(7,1fr)] relative"
          style={{ height: `${totalHeight}px` }}
        >
          {/* Time labels */}
          <div className="relative border-l border-[#e7e1da]">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute w-full text-[11px] text-[#8d785e] text-center -translate-y-1/2"
                style={{
                  top: `${(hour - START_HOUR) * HOUR_HEIGHT}px`,
                  fontWeight: 500,
                }}
              >
                {String(hour).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIdx) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDate.get(dayKey) || [];
            const today = isToday(day);

            return (
              <div
                key={dayIdx}
                className={`relative border-l border-[#e7e1da] ${today ? 'bg-[#ff8c00]/[0.02]' : ''}`}
                onClick={() => onNewEvent(day)}
              >
                {/* Hour grid lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute w-full border-b border-[#f5f3f0]"
                    style={{
                      top: `${(hour - START_HOUR) * HOUR_HEIGHT}px`,
                      height: `${HOUR_HEIGHT}px`,
                    }}
                  />
                ))}

                {/* Current time indicator */}
                {today && showNowLine && (
                  <div
                    className="absolute w-full z-10 pointer-events-none"
                    style={{ top: `${nowTop}px` }}
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-[#ef4444] -mr-1" />
                      <div className="flex-1 h-[2px] bg-[#ef4444]" />
                    </div>
                  </div>
                )}

                {/* Event blocks */}
                {dayEvents.map((ev, evIdx) => {
                  const style = getEventStyle(ev);
                  return (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(ev);
                      }}
                      className="absolute right-1 left-1 rounded-lg px-2 py-1 cursor-pointer text-white overflow-hidden z-[5] hover:brightness-110 transition-all shadow-sm"
                      style={{
                        ...style,
                        backgroundColor: ev.color,
                        marginRight: evIdx > 0 ? `${evIdx * 4}px` : undefined,
                      }}
                    >
                      <div
                        className="text-[11px] truncate"
                        style={{ fontWeight: 600 }}
                      >
                        {ev.title}
                      </div>
                      <div className="text-[10px] opacity-80 truncate">
                        {ev.startTime} - {ev.endTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
