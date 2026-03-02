import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { he } from "date-fns/locale";
import { CalendarDays, FolderOpen, Plus } from "lucide-react";
import { useMemo } from "react";
import type { DisplayEvent } from "../CalendarPage";

const DAY_NAMES = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

interface MonthlyViewProps {
  currentDate: Date;
  events: DisplayEvent[];
  onEventClick: (event: DisplayEvent) => void;
  onNewEvent: (date: Date) => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
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

  const selectedDateEvents = useMemo(() => {
    const key = format(selectedDate, "yyyy-MM-dd");
    return (eventsByDate.get(key) || []).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  }, [selectedDate, eventsByDate]);

  return (
    <div className="space-y-4">
      {/* Calendar Grid */}
      <div className="overflow-hidden rounded-xl border border-[#e7e1da] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        {/* Day name headers */}
        <div className="grid grid-cols-7 border-[#e7e1da] border-b">
          {DAY_NAMES.map((name, i) => (
            <div
              className="py-3 text-center text-[#8d785e] text-[13px]"
              key={i}
              style={{ fontWeight: 600 }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {gridDays.map((day, i) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDate.get(dayKey) || [];
            const inMonth = isSameMonth(day, currentDate);
            const selected = isSameDay(day, selectedDate);
            const today = isToday(day);

            return (
              <button
                className={`relative min-h-[80px] border-[#f5f3f0] border-b border-l p-2 text-right transition-colors lg:min-h-[100px] ${inMonth ? "bg-white hover:bg-[#fdfcfb]" : "bg-[#fdfcfb]"}
                  ${selected ? "bg-[#ff8c00]/5 ring-1 ring-[#ff8c00] ring-inset" : ""}
                `}
                key={i}
                onClick={() => onSelectDate(day)}
                onDoubleClick={() => onNewEvent(day)}
                type="button"
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${inMonth ? "text-[#181510]" : "text-[#8d785e]/40"}
                    ${today ? "bg-[#ff8c00] text-white" : ""}
                    ${selected && !today ? "bg-[#ff8c00]/15 text-[#ff8c00]" : ""}
                  `}
                  style={{ fontWeight: today || selected ? 700 : 400 }}
                >
                  {format(day, "d")}
                </span>

                {/* Event dots */}
                {dayEvents.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {dayEvents.slice(0, 3).map((ev, idx) => (
                      <div
                        className="h-2 w-2 shrink-0 rounded-full"
                        key={idx}
                        style={{ backgroundColor: ev.color }}
                        title={ev.title}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[#8d785e] text-[10px]">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Event previews on larger screens */}
                <div className="mt-1 hidden space-y-0.5 lg:block">
                  {dayEvents.slice(0, 2).map((ev, idx) => (
                    <div
                      className="cursor-pointer truncate rounded px-1 py-0.5 text-[10px] text-white leading-tight"
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(ev);
                      }}
                      style={{ backgroundColor: ev.color }}
                    >
                      {ev.startTime} {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="px-1 text-[#8d785e] text-[10px]">
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
      <div className="rounded-xl border border-[#e7e1da] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="mb-4 flex items-center justify-between">
          <h3
            className="text-[#181510] text-[16px]"
            style={{ fontWeight: 600 }}
          >
            {format(selectedDate, "EEEE, d MMMM yyyy", { locale: he })}
          </h3>
          <button
            className="flex items-center gap-1.5 text-[#ff8c00] text-[13px] transition-colors hover:text-[#e67e00]"
            onClick={() => onNewEvent(selectedDate)}
            style={{ fontWeight: 600 }}
            type="button"
          >
            <Plus size={14} />
            הוסף אירוע
          </button>
        </div>

        {selectedDateEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarDays
              className="mb-2 text-[#e7e1da]"
              size={32}
              strokeWidth={1.5}
            />
            <p className="text-[#8d785e] text-[14px]">אין אירועים ביום זה</p>
            <button
              className="mt-3 text-[#ff8c00] text-[13px] hover:underline"
              onClick={() => onNewEvent(selectedDate)}
              style={{ fontWeight: 600 }}
              type="button"
            >
              + צור אירוע חדש
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDateEvents.map((ev) => (
              <div
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#f5f3f0] p-3 transition-all hover:border-[#e7e1da] hover:bg-[#fdfcfb]"
                key={ev.id}
                onClick={() => onEventClick(ev)}
              >
                <div
                  className="mt-0.5 min-h-[40px] w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: ev.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="truncate text-[#181510] text-[14px]"
                      style={{ fontWeight: 600 }}
                    >
                      {ev.title}
                    </span>
                    {ev.source === "project" && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#ff8c00]/10 px-2 py-0.5 text-[#ff8c00] text-[10px]">
                        <FolderOpen size={10} />
                        פרויקט
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[#8d785e] text-[12px]">
                    {ev.startTime} - {ev.endTime}
                  </div>
                  {ev.description && (
                    <p className="mt-1 truncate text-[#8d785e]/80 text-[12px]">
                      {ev.description}
                    </p>
                  )}
                </div>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px]"
                  style={{
                    backgroundColor: `${ev.color}15`,
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
