import { Briefcase, ChevronLeft, MapPin, Star, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

// ─── Map Data ───
interface MapLocation {
  color: string;
  id: string;
  name: string;
  projects: { name: string; status: string; statusColor: string }[];
  pulse: boolean;
  region: string;
  suppliers: { name: string; rating: number; category: string }[];
  x: number; // % from left
  y: number; // % from top
}

const locations: MapLocation[] = [
  {
    id: "galil",
    name: "גליל עליון",
    region: "צפון",
    x: 52,
    y: 10,
    projects: [
      {
        name: "גיבוש צוות - גליל עליון",
        status: "בביצוע",
        statusColor: "#22c55e",
      },
      {
        name: "סדנת מנהיגות - כפר בלום",
        status: "בתכנון",
        statusColor: "#3b82f6",
      },
    ],
    suppliers: [
      { name: "אירוח כפר בלום", rating: 4.9, category: "לינה" },
      { name: "קיאקים בירדן", rating: 4.7, category: "אטרקציות" },
    ],
    color: "#22c55e",
    pulse: true,
  },
  {
    id: "haifa",
    name: "חיפה והכרמל",
    region: "צפון",
    x: 34,
    y: 22,
    projects: [
      {
        name: "סיור תרבות - חיפה",
        status: "הצעה נשלחה",
        statusColor: "#f59e0b",
      },
    ],
    suppliers: [
      { name: "מלון דן כרמל", rating: 4.6, category: "לינה" },
      { name: "הסעות הצפון", rating: 4.4, category: "תחבורה" },
      { name: "סיורים בוואדי ניסנס", rating: 4.8, category: "אטרקציות" },
    ],
    color: "#f59e0b",
    pulse: false,
  },
  {
    id: "tlv",
    name: "תל אביב והמרכז",
    region: "מרכז",
    x: 28,
    y: 40,
    projects: [
      {
        name: 'טיול חברה - הייטק בע"מ',
        status: "דחוף",
        statusColor: "#ef4444",
      },
      { name: "כנס מכירות Q1", status: "בביצוע", statusColor: "#22c55e" },
      { name: "יום כיף - סטארטאפ", status: "ליד חדש", statusColor: "#8b5cf6" },
    ],
    suppliers: [
      { name: "קייטרינג שף דוד", rating: 4.8, category: "קייטרינג" },
      { name: "אירועי חוף הילטון", rating: 4.5, category: "אולמות" },
    ],
    color: "#ff8c00",
    pulse: true,
  },
  {
    id: "jerusalem",
    name: "ירושלים",
    region: "מרכז",
    x: 52,
    y: 45,
    projects: [
      {
        name: "סיור היסטורי - עיר העתיקה",
        status: "בתכנון",
        statusColor: "#3b82f6",
      },
    ],
    suppliers: [
      { name: "מלון מצודת דוד", rating: 4.9, category: "לינה" },
      { name: "מדריכי ירושלים", rating: 4.7, category: "הדרכה" },
    ],
    color: "#8b5cf6",
    pulse: false,
  },
  {
    id: "deadsea",
    name: "ים המלח",
    region: "דרום",
    x: 58,
    y: 56,
    projects: [
      { name: "נופש מנהלים - ים המלח", status: "אושר", statusColor: "#22c55e" },
    ],
    suppliers: [
      { name: "ספא עין בוקק", rating: 4.6, category: "ספא" },
      { name: "ג׳יפים במדבר", rating: 4.5, category: "אטרקציות" },
    ],
    color: "#3b82f6",
    pulse: false,
  },
  {
    id: "negev",
    name: "מצפה רמון והנגב",
    region: "דרום",
    x: 42,
    y: 72,
    projects: [
      { name: "לילה במדבר - גיבוש", status: "בתכנון", statusColor: "#3b82f6" },
    ],
    suppliers: [
      { name: "חאן בראשית", rating: 4.9, category: "לינה" },
      { name: "סיורי כוכבים בנגב", rating: 4.8, category: "אטרקציות" },
    ],
    color: "#a855f7",
    pulse: false,
  },
  {
    id: "eilat",
    name: "אילת",
    region: "דרום",
    x: 38,
    y: 93,
    projects: [
      { name: "נופש שנתי - אילת", status: "דחוף", statusColor: "#ef4444" },
      {
        name: "כנס חברה - דן אילת",
        status: "הצעה נשלחה",
        statusColor: "#f59e0b",
      },
    ],
    suppliers: [
      { name: "מלון דן אילת", rating: 4.7, category: "לינה" },
      { name: "צלילות אילת", rating: 4.6, category: "אטרקציות" },
      { name: "הסעות דרום", rating: 4.3, category: "תחבורה" },
    ],
    color: "#ef4444",
    pulse: true,
  },
];

// Simplified, clean Israel outline
const ISRAEL_OUTLINE = `
  M 54,3 C 50,5 46,10 44,16 L 40,24 C 38,28 35,34 32,40
  L 28,50 C 26,56 24,62 23,68 L 22,76 C 21,82 20,88 20,94
  L 20,102 C 20,108 21,114 22,120 L 24,128 C 25,134 27,140 28,146
  L 30,154 C 32,160 34,166 35,172 L 37,180 C 38,186 40,192 41,198
  L 43,206 C 44,212 45,218 46,224 L 47,232 C 48,236 48,240 48,244
  L 48,252 C 48,256 47,262 46,268 L 44,278 C 43,284 42,290 42,296
  L 42,306 C 42,312 43,316 44,320 L 46,324
  C 47,326 48,327 49,327 L 50,327 
  C 51,327 52,326 53,324 L 55,320
  C 56,316 57,312 57,306 L 57,296
  C 57,290 56,284 55,278 L 53,268
  C 52,262 52,256 52,252 L 52,244
  C 52,240 52,236 53,232 L 54,224
  C 55,218 56,212 57,206 L 59,198
  C 60,192 61,186 62,180 L 64,172
  C 66,166 68,160 69,154 L 71,146
  C 72,140 73,134 74,128 L 76,120
  C 77,114 78,108 78,102 L 78,94
  C 78,88 77,82 76,76 L 74,68
  C 72,62 70,56 68,50 L 64,40
  C 62,34 59,28 57,24 L 56,16
  C 55,10 54,5 54,3 Z
`;

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <Star className="fill-[#f59e0b] text-[#f59e0b]" size={10} />
      <span className="text-[#8d785e] text-[11px]" style={{ fontWeight: 600 }}>
        {rating}
      </span>
    </span>
  );
}

// ─── Tooltip Component ───
function MapTooltip({
  location,
  position,
}: {
  location: MapLocation;
  position: { x: number; y: number };
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="pointer-events-none absolute z-50"
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%)",
        marginTop: -14,
      }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="min-w-[260px] max-w-[300px] rounded-xl border border-[#e7e1da] bg-white p-4 shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
        dir="rtl"
      >
        {/* Header */}
        <div className="mb-3 flex items-center gap-2 border-[#f0ece6] border-b pb-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${location.color}18` }}
          >
            <MapPin size={14} style={{ color: location.color }} />
          </div>
          <div>
            <p
              className="text-[#181510] text-[14px]"
              style={{ fontWeight: 700 }}
            >
              {location.name}
            </p>
            <p className="text-[#8d785e] text-[11px]">{location.region}</p>
          </div>
        </div>

        {/* Projects */}
        {location.projects.length > 0 && (
          <div className="mb-2.5">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Briefcase className="text-[#8d785e]" size={11} />
              <span
                className="text-[#8d785e] text-[11px]"
                style={{ fontWeight: 600 }}
              >
                {location.projects.length} פרויקטים
              </span>
            </div>
            <div className="space-y-1">
              {location.projects.map((p, i) => (
                <div
                  className="flex items-center justify-between gap-2"
                  key={i}
                >
                  <span
                    className="truncate text-[#181510] text-[12px]"
                    style={{ fontWeight: 500 }}
                  >
                    {p.name}
                  </span>
                  <span
                    className="shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10px]"
                    style={{
                      backgroundColor: `${p.statusColor}15`,
                      color: p.statusColor,
                      fontWeight: 600,
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suppliers */}
        {location.suppliers.length > 0 && (
          <div>
            <div className="mb-1.5 flex items-center gap-1.5">
              <Users className="text-[#8d785e]" size={11} />
              <span
                className="text-[#8d785e] text-[11px]"
                style={{ fontWeight: 600 }}
              >
                {location.suppliers.length} ספקים
              </span>
            </div>
            <div className="space-y-1">
              {location.suppliers.map((s, i) => (
                <div
                  className="flex items-center justify-between gap-2"
                  key={i}
                >
                  <span
                    className="truncate text-[#181510] text-[12px]"
                    style={{ fontWeight: 500 }}
                  >
                    {s.name}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-[#b09d84] text-[10px]">
                      {s.category}
                    </span>
                    <StarRating rating={s.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Arrow */}
      <div className="-mt-[1px] flex justify-center">
        <div
          className="h-3 w-3 rotate-45 border-[#e7e1da] border-r border-b bg-white"
          style={{ marginTop: -6 }}
        />
      </div>
    </motion.div>
  );
}

// ━━━━━━━━━━━━━━━━━ MAIN MAP COMPONENT ━━━━━━━━━━━━━━━━━
export function IsraelMap() {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePinHover = (locId: string, e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setActiveLocation(locId);
  };

  const activeData = locations.find((l) => l.id === activeLocation);

  // Summary stats
  const totalProjects = locations.reduce(
    (acc, l) => acc + l.projects.length,
    0
  );
  const totalSuppliers = locations.reduce(
    (acc, l) => acc + l.suppliers.length,
    0
  );

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-[#e7e1da] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 1.1 }}
    >
      {/* Header */}
      <div className="border-[#f0ece6] border-b px-6 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff3e0]">
              <MapPin className="text-[#ff8c00]" size={16} />
            </div>
            <div>
              <h2
                className="text-[#181510] text-[18px]"
                style={{ fontWeight: 600 }}
              >
                מפת פעילות ארצית
              </h2>
              <p className="mt-0.5 text-[#8d785e] text-[12px]">
                פרויקטים וספקים פעילים לפי אזור
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ff8c00]" />
              <span className="text-[#8d785e] text-[11px]">פרויקטים</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
              <span className="text-[#8d785e] text-[11px]">ספקים</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map Area */}
        <div
          className="relative min-h-[480px] flex-1 bg-gradient-to-b from-[#fdfcfa] to-[#f8f5f0] p-6"
          onMouseLeave={() => setActiveLocation(null)}
          ref={containerRef}
        >
          {/* SVG Map */}
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            style={{ padding: "24px 30%" }}
            viewBox="0 0 100 340"
          >
            <title>Decorative icon</title>
            <defs>
              {/* Map fill gradient */}
              <linearGradient id="mapFill" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#f0ece6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#e7e1da" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f0ece6" stopOpacity="0.6" />
              </linearGradient>
              {/* Glow filter */}
              <filter height="140%" id="mapGlow" width="140%" x="-20%" y="-20%">
                <feGaussianBlur result="blur" stdDeviation="1.5" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              {/* Topographic pattern */}
              <pattern
                height="12"
                id="topoPattern"
                patternUnits="userSpaceOnUse"
                width="12"
                x="0"
                y="0"
              >
                <circle cx="6" cy="6" fill="#d4cdc3" opacity="0.4" r="0.3" />
              </pattern>
            </defs>

            {/* Israel outline */}
            <path
              d={ISRAEL_OUTLINE}
              fill="url(#mapFill)"
              stroke="#d4cdc3"
              strokeLinejoin="round"
              strokeWidth="0.8"
            />
            <path d={ISRAEL_OUTLINE} fill="url(#topoPattern)" stroke="none" />

            {/* Subtle inner border */}
            <path
              d={ISRAEL_OUTLINE}
              fill="none"
              stroke="#e7e1da"
              strokeDasharray="2,2"
              strokeWidth="0.3"
              transform="scale(0.97) translate(1.5, 5)"
            />
          </svg>

          {/* Location Pins */}
          {locations.map((loc, index) => {
            const isActive = activeLocation === loc.id;
            const totalItems = loc.projects.length + loc.suppliers.length;

            return (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="group absolute cursor-pointer"
                initial={{ opacity: 0, scale: 0 }}
                key={loc.id}
                onMouseEnter={(e) => handlePinHover(loc.id, e)}
                onMouseMove={(e) => {
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltipPos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }
                }}
                style={{
                  left: `${loc.x}%`,
                  top: `${loc.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isActive ? 40 : 10,
                }}
                transition={{
                  duration: 0.5,
                  delay: 1.3 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {/* Pulse ring for active locations */}
                {loc.pulse && (
                  <span
                    className="absolute inset-0 animate-ping rounded-full"
                    style={{
                      backgroundColor: loc.color,
                      opacity: 0.2,
                      transform: "scale(2)",
                    }}
                  />
                )}

                {/* Pin circle */}
                <div
                  className="relative flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    width: isActive ? 40 : 32,
                    height: isActive ? 40 : 32,
                    backgroundColor: isActive ? loc.color : `${loc.color}20`,
                    border: `2px solid ${loc.color}`,
                    boxShadow: isActive
                      ? `0 0 0 4px ${loc.color}15, 0 4px 12px ${loc.color}30`
                      : `0 2px 6px ${loc.color}20`,
                  }}
                >
                  <span
                    className="text-[12px] transition-colors duration-200"
                    style={{
                      fontWeight: 800,
                      color: isActive ? "#fff" : loc.color,
                    }}
                  >
                    {totalItems}
                  </span>
                </div>

                {/* Label */}
                <div
                  className="absolute top-full mt-1.5 whitespace-nowrap transition-opacity duration-200"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  <span
                    className="rounded bg-white/80 px-1.5 py-0.5 text-[#181510] text-[11px] backdrop-blur-sm"
                    style={{ fontWeight: isActive ? 700 : 500 }}
                  >
                    {loc.name}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Tooltip */}
          <AnimatePresence>
            {activeData && (
              <MapTooltip
                key={activeData.id}
                location={activeData}
                position={tooltipPos}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar - Region Summary */}
        <div className="border-[#f0ece6] border-r bg-[#fdfcfa] p-5 lg:w-[260px]">
          {/* Stats summary */}
          <div className="mb-5 space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-[#e7e1da] bg-white p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff3e0]">
                <Briefcase className="text-[#ff8c00]" size={15} />
              </div>
              <div>
                <p
                  className="text-[#181510] text-[20px]"
                  style={{ fontWeight: 700 }}
                >
                  {totalProjects}
                </p>
                <p className="text-[#8d785e] text-[11px]">פרויקטים פעילים</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#e7e1da] bg-white p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5f3ff]">
                <Users className="text-[#8b5cf6]" size={15} />
              </div>
              <div>
                <p
                  className="text-[#181510] text-[20px]"
                  style={{ fontWeight: 700 }}
                >
                  {totalSuppliers}
                </p>
                <p className="text-[#8d785e] text-[11px]">ספקים במאגר</p>
              </div>
            </div>
          </div>

          {/* Region list */}
          <p
            className="mb-2.5 text-[#8d785e] text-[12px]"
            style={{ fontWeight: 600 }}
          >
            אזורים פעילים
          </p>
          <div className="space-y-1.5">
            {locations.map((loc) => {
              const isActive = activeLocation === loc.id;
              return (
                <button
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-right transition-all"
                  key={loc.id}
                  onMouseEnter={() => setActiveLocation(loc.id)}
                  onMouseLeave={() => setActiveLocation(null)}
                  style={{
                    backgroundColor: isActive
                      ? `${loc.color}10`
                      : "transparent",
                    border: isActive
                      ? `1px solid ${loc.color}30`
                      : "1px solid transparent",
                  }}
                  type="button"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-200"
                    style={{
                      backgroundColor: loc.color,
                      transform: isActive ? "scale(1.3)" : "scale(1)",
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-[#181510] text-[12px]"
                      style={{ fontWeight: isActive ? 700 : 500 }}
                    >
                      {loc.name}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-[#b09d84] text-[11px]">
                      {loc.projects.length}P · {loc.suppliers.length}S
                    </span>
                    <ChevronLeft className="text-[#d4cdc3]" size={12} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hottest region */}
          <div className="mt-5 border-[#f0ece6] border-t pt-4">
            <p className="mb-1 text-[#8d785e] text-[11px]">אזור הכי פעיל</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ff8c00]" />
              <span
                className="text-[#181510] text-[13px]"
                style={{ fontWeight: 700 }}
              >
                תל אביב והמרכז
              </span>
              <span
                className="text-[#ff8c00] text-[11px]"
                style={{ fontWeight: 600 }}
              >
                5 פריטים
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
