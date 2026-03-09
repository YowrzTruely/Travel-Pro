import { useMutation, useQuery } from "convex/react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useAuth } from "../AuthContext";

const HEBREW_MONTHS = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

const HEBREW_DAYS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

function formatYearMonth(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function AvailabilityCalendar() {
  const { profile } = useAuth();
  const supplierId = profile?.supplierId as Id<"suppliers"> | undefined;

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const yearMonth = formatYearMonth(currentYear, currentMonth);

  const availability = useQuery(
    api.supplierAvailability.listByMonth,
    supplierId ? { supplierId, yearMonth } : "skip"
  );

  const setAvailability = useMutation(api.supplierAvailability.setAvailability);

  // Build availability map: date -> { available, notes }
  const availabilityMap = useMemo(() => {
    const map = new Map<string, { available: boolean; notes?: string }>();
    if (availability) {
      for (const item of availability) {
        map.set(item.date, {
          available: item.available,
          notes: item.notes,
        });
      }
    }
    return map;
  }, [availability]);

  // Calendar grid data
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay(); // 0=Sun
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];

    // Leading empty cells
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }

    return days;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToggleDay = async (day: number) => {
    if (!supplierId) {
      return;
    }

    const date = formatDate(currentYear, currentMonth, day);
    const current = availabilityMap.get(date);
    const newAvailable = current ? !current.available : true;

    try {
      await setAvailability({
        supplierId,
        date,
        available: newAvailable,
      });
    } catch {
      appToast.error("שגיאה", "לא ניתן לעדכן זמינות");
    }
  };

  if (!supplierId) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <p className="text-[#8d785e] text-[14px]">
          לא נמצא חיבור לספק. פנה למנהל המערכת.
        </p>
      </div>
    );
  }

  if (availability === undefined) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <Loader2 className="animate-spin text-[#ff8c00]" size={32} />
      </div>
    );
  }

  const todayStr = formatDate(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return (
    <div className="min-h-screen bg-[#f8f7f5] p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="mb-1 text-[#181510] text-[22px]"
          style={{ fontWeight: 700 }}
        >
          זמינות
        </h1>
        <p className="text-[#8d785e] text-[13px]">
          לחץ על תאריך כדי לסמן זמינות או חוסר זמינות
        </p>
      </div>

      {/* Calendar card */}
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#e7e1da] bg-white p-6">
        {/* Month navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8d785e] transition-colors hover:bg-[#f5f3f0]"
            onClick={handleNextMonth}
            type="button"
          >
            <ChevronRight size={18} />
          </button>
          <h2
            className="text-[#181510] text-[18px]"
            style={{ fontWeight: 700 }}
          >
            {HEBREW_MONTHS[currentMonth]} {currentYear}
          </h2>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8d785e] transition-colors hover:bg-[#f5f3f0]"
            onClick={handlePrevMonth}
            type="button"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {HEBREW_DAYS.map((day) => (
            <div
              className="py-2 text-center text-[#8d785e] text-[13px]"
              key={day}
              style={{ fontWeight: 600 }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div className="h-14" key={`empty-${String(idx)}`} />;
            }

            const dateStr = formatDate(currentYear, currentMonth, day);
            const status = availabilityMap.get(dateStr);
            const isToday = dateStr === todayStr;

            let bgClass = "bg-gray-50 text-[#8d785e]"; // no data
            let hoverClass = "hover:bg-gray-100";
            if (status) {
              if (status.available) {
                bgClass = "bg-green-100 text-green-800";
                hoverClass = "hover:bg-green-200";
              } else {
                bgClass = "bg-red-100 text-red-800";
                hoverClass = "hover:bg-red-200";
              }
            }

            return (
              <button
                className={`flex h-14 flex-col items-center justify-center rounded-lg transition-colors ${bgClass} ${hoverClass} ${
                  isToday ? "ring-2 ring-[#ff8c00]" : ""
                }`}
                key={dateStr}
                onClick={() => handleToggleDay(day)}
                type="button"
              >
                <span
                  className="text-[14px]"
                  style={{ fontWeight: isToday ? 700 : 500 }}
                >
                  {day}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 border-[#e7e1da] border-t pt-4">
          <div className="flex items-center gap-2 text-[13px]">
            <div className="h-4 w-4 rounded bg-green-100" />
            <span className="text-[#8d785e]">זמין</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <div className="h-4 w-4 rounded bg-red-100" />
            <span className="text-[#8d785e]">לא זמין</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <div className="h-4 w-4 rounded border border-gray-200 bg-gray-50" />
            <span className="text-[#8d785e]">לא הוגדר</span>
          </div>
        </div>
      </div>
    </div>
  );
}
