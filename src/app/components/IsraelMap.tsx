import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Briefcase, Users, Star, ChevronLeft } from 'lucide-react';

// ─── Map Data ───
interface MapLocation {
  id: string;
  name: string;
  region: string;
  x: number; // % from left
  y: number; // % from top
  projects: { name: string; status: string; statusColor: string }[];
  suppliers: { name: string; rating: number; category: string }[];
  color: string;
  pulse: boolean;
}

const locations: MapLocation[] = [
  {
    id: 'galil',
    name: 'גליל עליון',
    region: 'צפון',
    x: 52,
    y: 10,
    projects: [
      { name: 'גיבוש צוות - גליל עליון', status: 'בביצוע', statusColor: '#22c55e' },
      { name: 'סדנת מנהיגות - כפר בלום', status: 'בתכנון', statusColor: '#3b82f6' },
    ],
    suppliers: [
      { name: 'אירוח כפר בלום', rating: 4.9, category: 'לינה' },
      { name: 'קיאקים בירדן', rating: 4.7, category: 'אטרקציות' },
    ],
    color: '#22c55e',
    pulse: true,
  },
  {
    id: 'haifa',
    name: 'חיפה והכרמל',
    region: 'צפון',
    x: 34,
    y: 22,
    projects: [
      { name: 'סיור תרבות - חיפה', status: 'הצעה נשלחה', statusColor: '#f59e0b' },
    ],
    suppliers: [
      { name: 'מלון דן כרמל', rating: 4.6, category: 'לינה' },
      { name: 'הסעות הצפון', rating: 4.4, category: 'תחבורה' },
      { name: 'סיורים בוואדי ניסנס', rating: 4.8, category: 'אטרקציות' },
    ],
    color: '#f59e0b',
    pulse: false,
  },
  {
    id: 'tlv',
    name: 'תל אביב והמרכז',
    region: 'מרכז',
    x: 28,
    y: 40,
    projects: [
      { name: 'טיול חברה - הייטק בע"מ', status: 'דחוף', statusColor: '#ef4444' },
      { name: 'כנס מכירות Q1', status: 'בביצוע', statusColor: '#22c55e' },
      { name: 'יום כיף - סטארטאפ', status: 'ליד חדש', statusColor: '#8b5cf6' },
    ],
    suppliers: [
      { name: 'קייטרינג שף דוד', rating: 4.8, category: 'קייטרינג' },
      { name: 'אירועי חוף הילטון', rating: 4.5, category: 'אולמות' },
    ],
    color: '#ff8c00',
    pulse: true,
  },
  {
    id: 'jerusalem',
    name: 'ירושלים',
    region: 'מרכז',
    x: 52,
    y: 45,
    projects: [
      { name: 'סיור היסטורי - עיר העתיקה', status: 'בתכנון', statusColor: '#3b82f6' },
    ],
    suppliers: [
      { name: 'מלון מצודת דוד', rating: 4.9, category: 'לינה' },
      { name: 'מדריכי ירושלים', rating: 4.7, category: 'הדרכה' },
    ],
    color: '#8b5cf6',
    pulse: false,
  },
  {
    id: 'deadsea',
    name: 'ים המלח',
    region: 'דרום',
    x: 58,
    y: 56,
    projects: [
      { name: 'נופש מנהלים - ים המלח', status: 'אושר', statusColor: '#22c55e' },
    ],
    suppliers: [
      { name: 'ספא עין בוקק', rating: 4.6, category: 'ספא' },
      { name: 'ג׳יפים במדבר', rating: 4.5, category: 'אטרקציות' },
    ],
    color: '#3b82f6',
    pulse: false,
  },
  {
    id: 'negev',
    name: 'מצפה רמון והנגב',
    region: 'דרום',
    x: 42,
    y: 72,
    projects: [
      { name: 'לילה במדבר - גיבוש', status: 'בתכנון', statusColor: '#3b82f6' },
    ],
    suppliers: [
      { name: 'חאן בראשית', rating: 4.9, category: 'לינה' },
      { name: 'סיורי כוכבים בנגב', rating: 4.8, category: 'אטרקציות' },
    ],
    color: '#a855f7',
    pulse: false,
  },
  {
    id: 'eilat',
    name: 'אילת',
    region: 'דרום',
    x: 38,
    y: 93,
    projects: [
      { name: 'נופש שנתי - אילת', status: 'דחוף', statusColor: '#ef4444' },
      { name: 'כנס חברה - דן אילת', status: 'הצעה נשלחה', statusColor: '#f59e0b' },
    ],
    suppliers: [
      { name: 'מלון דן אילת', rating: 4.7, category: 'לינה' },
      { name: 'צלילות אילת', rating: 4.6, category: 'אטרקציות' },
      { name: 'הסעות דרום', rating: 4.3, category: 'תחבורה' },
    ],
    color: '#ef4444',
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
      <Star size={10} className="text-[#f59e0b] fill-[#f59e0b]" />
      <span className="text-[11px] text-[#8d785e]" style={{ fontWeight: 600 }}>{rating}</span>
    </span>
  );
}

// ─── Tooltip Component ───
function MapTooltip({ location, position }: { location: MapLocation; position: { x: number; y: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        marginTop: -14,
      }}
    >
      <div
        className="bg-white rounded-xl border border-[#e7e1da] shadow-[0_8px_32px_rgba(0,0,0,0.14)] p-4 min-w-[260px] max-w-[300px]"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-[#f0ece6]">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: location.color + '18' }}
          >
            <MapPin size={14} style={{ color: location.color }} />
          </div>
          <div>
            <p className="text-[14px] text-[#181510]" style={{ fontWeight: 700 }}>
              {location.name}
            </p>
            <p className="text-[11px] text-[#8d785e]">{location.region}</p>
          </div>
        </div>

        {/* Projects */}
        {location.projects.length > 0 && (
          <div className="mb-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Briefcase size={11} className="text-[#8d785e]" />
              <span className="text-[11px] text-[#8d785e]" style={{ fontWeight: 600 }}>
                {location.projects.length} פרויקטים
              </span>
            </div>
            <div className="space-y-1">
              {location.projects.map((p, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-[#181510] truncate" style={{ fontWeight: 500 }}>
                    {p.name}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0 whitespace-nowrap"
                    style={{
                      backgroundColor: p.statusColor + '15',
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
            <div className="flex items-center gap-1.5 mb-1.5">
              <Users size={11} className="text-[#8d785e]" />
              <span className="text-[11px] text-[#8d785e]" style={{ fontWeight: 600 }}>
                {location.suppliers.length} ספקים
              </span>
            </div>
            <div className="space-y-1">
              {location.suppliers.map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-[12px] text-[#181510] truncate" style={{ fontWeight: 500 }}>
                    {s.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-[#b09d84]">{s.category}</span>
                    <StarRating rating={s.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Arrow */}
      <div className="flex justify-center -mt-[1px]">
        <div
          className="w-3 h-3 rotate-45 bg-white border-b border-r border-[#e7e1da]"
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
  const totalProjects = locations.reduce((acc, l) => acc + l.projects.length, 0);
  const totalSuppliers = locations.reduce((acc, l) => acc + l.suppliers.length, 0);
  const activeRegions = new Set(locations.map((l) => l.region)).size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.1 }}
      className="bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#f0ece6]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#fff3e0] flex items-center justify-center">
              <MapPin size={16} className="text-[#ff8c00]" />
            </div>
            <div>
              <h2 className="text-[18px] text-[#181510]" style={{ fontWeight: 600 }}>
                מפת פעילות ארצית
              </h2>
              <p className="text-[12px] text-[#8d785e] mt-0.5">פרויקטים וספקים פעילים לפי אזור</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff8c00]" />
              <span className="text-[11px] text-[#8d785e]">פרויקטים</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
              <span className="text-[11px] text-[#8d785e]">ספקים</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map Area */}
        <div
          ref={containerRef}
          className="relative flex-1 min-h-[480px] bg-gradient-to-b from-[#fdfcfa] to-[#f8f5f0] p-6"
          onMouseLeave={() => setActiveLocation(null)}
        >
          {/* SVG Map */}
          <svg
            viewBox="0 0 100 340"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            style={{ padding: '24px 30%' }}
          >
            <defs>
              {/* Map fill gradient */}
              <linearGradient id="mapFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f0ece6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#e7e1da" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f0ece6" stopOpacity="0.6" />
              </linearGradient>
              {/* Glow filter */}
              <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              {/* Topographic pattern */}
              <pattern id="topoPattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="0.3" fill="#d4cdc3" opacity="0.4" />
              </pattern>
            </defs>

            {/* Israel outline */}
            <path
              d={ISRAEL_OUTLINE}
              fill="url(#mapFill)"
              stroke="#d4cdc3"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            <path
              d={ISRAEL_OUTLINE}
              fill="url(#topoPattern)"
              stroke="none"
            />

            {/* Subtle inner border */}
            <path
              d={ISRAEL_OUTLINE}
              fill="none"
              stroke="#e7e1da"
              strokeWidth="0.3"
              strokeDasharray="2,2"
              transform="scale(0.97) translate(1.5, 5)"
            />
          </svg>

          {/* Location Pins */}
          {locations.map((loc, index) => {
            const isActive = activeLocation === loc.id;
            const totalItems = loc.projects.length + loc.suppliers.length;

            return (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 1.3 + index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
                className="absolute cursor-pointer group"
                style={{
                  left: `${loc.x}%`,
                  top: `${loc.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isActive ? 40 : 10,
                }}
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
              >
                {/* Pulse ring for active locations */}
                {loc.pulse && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      backgroundColor: loc.color,
                      opacity: 0.2,
                      transform: 'scale(2)',
                    }}
                  />
                )}

                {/* Pin circle */}
                <div
                  className="relative flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    width: isActive ? 40 : 32,
                    height: isActive ? 40 : 32,
                    backgroundColor: isActive ? loc.color : loc.color + '20',
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
                      color: isActive ? '#fff' : loc.color,
                    }}
                  >
                    {totalItems}
                  </span>
                </div>

                {/* Label */}
                <div
                  className="absolute top-full mt-1.5 whitespace-nowrap transition-opacity duration-200"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  <span
                    className="text-[11px] text-[#181510] bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded"
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
        <div className="lg:w-[260px] border-r border-[#f0ece6] bg-[#fdfcfa] p-5">
          {/* Stats summary */}
          <div className="space-y-3 mb-5">
            <div className="bg-white rounded-lg border border-[#e7e1da] p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#fff3e0] flex items-center justify-center">
                <Briefcase size={15} className="text-[#ff8c00]" />
              </div>
              <div>
                <p className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>{totalProjects}</p>
                <p className="text-[11px] text-[#8d785e]">פרויקטים פעילים</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-[#e7e1da] p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f5f3ff] flex items-center justify-center">
                <Users size={15} className="text-[#8b5cf6]" />
              </div>
              <div>
                <p className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>{totalSuppliers}</p>
                <p className="text-[11px] text-[#8d785e]">ספקים במאגר</p>
              </div>
            </div>
          </div>

          {/* Region list */}
          <p className="text-[12px] text-[#8d785e] mb-2.5" style={{ fontWeight: 600 }}>אזורים פעילים</p>
          <div className="space-y-1.5">
            {locations.map((loc) => {
              const isActive = activeLocation === loc.id;
              return (
                <button
                  key={loc.id}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-right"
                  style={{
                    backgroundColor: isActive ? loc.color + '10' : 'transparent',
                    border: isActive ? `1px solid ${loc.color}30` : '1px solid transparent',
                  }}
                  onMouseEnter={() => setActiveLocation(loc.id)}
                  onMouseLeave={() => setActiveLocation(null)}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                    style={{
                      backgroundColor: loc.color,
                      transform: isActive ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[12px] text-[#181510] truncate"
                      style={{ fontWeight: isActive ? 700 : 500 }}
                    >
                      {loc.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] text-[#b09d84]">
                      {loc.projects.length}P · {loc.suppliers.length}S
                    </span>
                    <ChevronLeft size={12} className="text-[#d4cdc3]" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hottest region */}
          <div className="mt-5 pt-4 border-t border-[#f0ece6]">
            <p className="text-[11px] text-[#8d785e] mb-1">אזור הכי פעיל</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff8c00]" />
              <span className="text-[13px] text-[#181510]" style={{ fontWeight: 700 }}>
                תל אביב והמרכז
              </span>
              <span className="text-[11px] text-[#ff8c00]" style={{ fontWeight: 600 }}>
                5 פריטים
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}