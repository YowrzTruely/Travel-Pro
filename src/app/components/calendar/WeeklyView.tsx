import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isToday,
  startOfWeek,
} from "date-fns";
import { he } from "date-fns/locale";
import { useMemo } from "react";
import type { DisplayEvent } from "../CalendarPage";

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_HEIGHT = 60;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i
);

interface WeeklyViewProps {
  currentDate: Date;
  events: DisplayEvent[];
  onEventClick: (event: DisplayEvent) => void;
  onNewEvent: (date: Date) => void;
}

function getEventStyle(event: DisplayEvent) {
  const [startH, startM] = event.startTime.split(":").map(Number);
  const [endH, endM] = event.endTime.split(":").map(Number);
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
      if (!map.has(key)) {
        map.set(key, []);
      }
      const events = map.get(key);
      if (events) {
        events.push(ev);
      }
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
    <div className="overflow-hidden rounded-xl border border-[#e7e1da] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      {/* Scrollable container for both header and grid */}
      <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
        {/* Day headers — sticky at top */}
        <div className="sticky top-0 z-20 grid grid-cols-[50px_repeat(7,1fr)] border-[#e7e1da] border-b bg-white">
          <div className="border-[#e7e1da] border-l" />
          {weekDays.map((day, i) => {
            const today = isToday(day);
            return (
              <div
                className={`border-[#e7e1da] border-l py-3 text-center ${today ? "bg-[#ff8c00]/5" : ""}`}
                key={i}
              >
                <div
                  className="text-[#8d785e] text-[12px]"
                  style={{ fontWeight: 500 }}
                >
                  {format(day, "EEEE", { locale: he })}
                </div>
                <div
                  className={`mt-0.5 text-[18px] ${today ? "text-[#ff8c00]" : "text-[#181510]"}`}
                  style={{ fontWeight: 700 }}
                >
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div
          className="relative grid grid-cols-[50px_repeat(7,1fr)]"
          style={{ height: `${totalHeight}px` }}
        >
          {/* Time labels */}
          <div className="relative border-[#e7e1da] border-l">
            {HOURS.map((hour) => (
              <div
                className="absolute w-full -translate-y-1/2 text-center text-[#8d785e] text-[11px]"
                key={hour}
                style={{
                  top: `${(hour - START_HOUR) * HOUR_HEIGHT}px`,
                  fontWeight: 500,
                }}
              >
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIdx) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDate.get(dayKey) || [];
            const today = isToday(day);

            return (
              <div
                className={`relative border-[#e7e1da] border-l ${today ? "bg-[#ff8c00]/[0.02]" : ""}`}
                key={dayIdx}
                onClick={() => onNewEvent(day)}
              >
                {/* Hour grid lines */}
                {HOURS.map((hour) => (
                  <div
                    className="absolute w-full border-[#f5f3f0] border-b"
                    key={hour}
                    style={{
                      top: `${(hour - START_HOUR) * HOUR_HEIGHT}px`,
                      height: `${HOUR_HEIGHT}px`,
                    }}
                  />
                ))}

                {/* Current time indicator */}
                {today && showNowLine && (
                  <div
                    className="pointer-events-none absolute z-10 w-full"
                    style={{ top: `${nowTop}px` }}
                  >
                    <div className="flex items-center">
                      <div className="-mr-1 h-2 w-2 rounded-full bg-[#ef4444]" />
                      <div className="h-[2px] flex-1 bg-[#ef4444]" />
                    </div>
                  </div>
                )}

                {/* Event blocks */}
                {dayEvents.map((ev, evIdx) => {
                  const style = getEventStyle(ev);
                  return (
                    <div
                      className="absolute right-1 left-1 z-[5] cursor-pointer overflow-hidden rounded-lg px-2 py-1 text-white shadow-sm transition-all hover:brightness-110"
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(ev);
                      }}
                      style={{
                        ...style,
                        backgroundColor: ev.color,
                        marginRight: evIdx > 0 ? `${evIdx * 4}px` : undefined,
                      }}
                    >
                      <div
                        className="truncate text-[11px]"
                        style={{ fontWeight: 600 }}
                      >
                        {ev.title}
                      </div>
                      <div className="truncate text-[10px] opacity-80">
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
