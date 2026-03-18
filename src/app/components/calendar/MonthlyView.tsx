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
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        {/* Day name headers */}
        <div className="grid grid-cols-7 border-border border-b">
          {DAY_NAMES.map((name, i) => (
            <div
              className="py-3 text-center text-[13px] text-muted-foreground"
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
                className={`relative min-h-[80px] border-accent border-b border-l p-2 text-right transition-colors lg:min-h-[100px] ${inMonth ? "bg-card hover:bg-surface" : "bg-surface"}
                  ${selected ? "bg-primary/5 ring-1 ring-[#ff8c00] ring-inset" : ""}
                `}
                key={i}
                onClick={() => onSelectDate(day)}
                onDoubleClick={() => onNewEvent(day)}
                type="button"
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${inMonth ? "text-foreground" : "text-muted-foreground/40"}
                    ${today ? "bg-primary text-white" : ""}
                    ${selected && !today ? "bg-primary/15 text-primary" : ""}
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
                      <span className="text-[10px] text-muted-foreground">
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
                    <div className="px-1 text-[10px] text-muted-foreground">
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
      <div className="rounded-xl border border-border bg-card p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="mb-4 flex items-center justify-between">
          <h3
            className="text-[16px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            {format(selectedDate, "EEEE, d MMMM yyyy", { locale: he })}
          </h3>
          <button
            className="flex items-center gap-1.5 text-[13px] text-primary transition-colors hover:text-primary-hover"
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
              className="mb-2 text-border"
              size={32}
              strokeWidth={1.5}
            />
            <p className="text-[14px] text-muted-foreground">
              אין אירועים ביום זה
            </p>
            <button
              className="mt-3 text-[13px] text-primary hover:underline"
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
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-accent p-3 transition-all hover:border-border hover:bg-surface"
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
                      className="truncate text-[14px] text-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      {ev.title}
                    </span>
                    {ev.source === "project" && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                        <FolderOpen size={10} />
                        פרויקט
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground">
                    {ev.startTime} - {ev.endTime}
                  </div>
                  {ev.description && (
                    <p className="mt-1 truncate text-[12px] text-muted-foreground/80">
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
