import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  LayoutGrid,
  Printer,
} from "lucide-react";
import { useState } from "react";
import { KanbanBoard } from "./KanbanBoard";

/* ═══════════════════════════════════════════════════════════════
   PRD Document — Client-Facing Product Specification
   Print-ready, Hebrew RTL, with visual screen mockups
   ═══════════════════════════════════════════════════════════════ */

// ── Section wrapper ──
function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-24 break-inside-avoid-page" id={id}>
      {children}
    </section>
  );
}

// ── Collapsible screen card ──
function ScreenCard({
  number,
  title,
  emoji,
  purpose,
  audience,
  color,
  children,
  mockup,
}: {
  number: number;
  title: string;
  emoji: string;
  purpose: string;
  audience: string;
  color: string;
  children: React.ReactNode;
  mockup: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-8 break-inside-avoid-page overflow-hidden rounded-2xl border border-[#e7e1da] bg-white shadow-sm print:mb-4 print:border print:shadow-none">
      {/* Header */}
      <button
        className="flex w-full items-center gap-4 p-6 text-right print:pointer-events-none"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[26px]"
          style={{ backgroundColor: `${color}15` }}
        >
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-[12px] text-white"
              style={{ backgroundColor: color, fontWeight: 700 }}
            >
              מסך {number}
            </span>
            <span className="text-[#8d785e] text-[12px]">{audience}</span>
          </div>
          <h3
            className="mt-1 text-[#181510] text-[22px]"
            style={{ fontWeight: 700 }}
          >
            {title}
          </h3>
          <p className="mt-0.5 text-[#8d785e] text-[14px]">{purpose}</p>
        </div>
        <div className="print:hidden">
          {open ? (
            <ChevronUp className="text-[#8d785e]" size={20} />
          ) : (
            <ChevronDown className="text-[#8d785e]" size={20} />
          )}
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="space-y-6 px-6 pb-6">
          {/* Mockup */}
          <div className="overflow-hidden rounded-xl border-2 border-[#e7e1da] bg-[#f8f7f5]">
            <div className="flex items-center gap-2 border-[#e7e1da] border-b bg-[#ece8e3] px-4 py-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
                <div className="h-3 w-3 rounded-full bg-[#eab308]" />
                <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
              </div>
              <div className="mx-8 flex-1 rounded-md bg-white px-3 py-1 text-center text-[#8d785e] text-[11px]">
                travelpro.app
              </div>
            </div>
            <div className="p-1" dir="rtl">
              {mockup}
            </div>
          </div>

          {/* Details */}
          {children}
        </div>
      )}
    </div>
  );
}

// ── Feature chip ──
function Chip({ label, color = "#ff8c00" }: { label: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px]"
      style={{ backgroundColor: `${color}12`, color, fontWeight: 600 }}
    >
      <Check size={12} />
      {label}
    </span>
  );
}

// ── Info row ──
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 border-[#f5f3f0] border-b py-2 last:border-0">
      <span
        className="w-28 shrink-0 text-[#8d785e] text-[13px]"
        style={{ fontWeight: 600 }}
      >
        {label}
      </span>
      <span className="text-[#181510] text-[13px]">{value}</span>
    </div>
  );
}

// ═══════════════ MOCKUP COMPONENTS ═══════════════

function MockSidebar() {
  return (
    <div className="flex w-[72px] shrink-0 flex-col items-center gap-2 border-[#e7e1da] border-l bg-white py-3">
      <div className="mb-2 h-8 w-8 rounded-lg bg-[#ff8c00]" />
      {["#ff8c00", "#e7e1da", "#e7e1da", "#e7e1da", "#e7e1da", "#e7e1da"].map(
        (c, i) => (
          <div
            className="h-8 w-8 rounded-lg"
            key={i}
            style={{
              backgroundColor: c === "#ff8c00" ? "#ff8c0020" : "#f5f3f0",
            }}
          />
        )
      )}
    </div>
  );
}

function MockTopbar() {
  return (
    <div className="flex h-8 items-center gap-2 border-[#e7e1da] border-b bg-white px-3">
      <div className="flex-1" />
      <div className="h-5 w-32 rounded-md bg-[#f5f3f0]" />
      <div className="flex-1" />
      <div className="h-5 w-5 rounded-full bg-[#f5f3f0]" />
      <div className="h-5 w-5 rounded-full bg-[#f5f3f0]" />
    </div>
  );
}

function MockDashboard() {
  return (
    <div className="flex h-[320px] text-[9px]">
      <MockSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MockTopbar />
        <div className="flex-1 space-y-2 overflow-hidden bg-[#f8f7f5] p-3">
          {/* Welcome */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 w-36 rounded-sm bg-[#181510] opacity-80" />
              <div className="mt-1 h-2.5 w-48 rounded-sm bg-[#ddd6cb]" />
            </div>
            <div className="h-6 w-16 rounded-md bg-[#ff8c00]" />
          </div>
          {/* Ticker */}
          <div className="flex h-6 items-center rounded-lg border border-[#e7e1da] bg-white px-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#ff8c00]" />
            <div className="mx-2 h-2 flex-1 rounded-sm bg-[#f5f3f0]" />
          </div>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { c: "#ff8c00", v: "12", l: "לידים חדשים" },
              { c: "#3b82f6", v: "45", l: "הצעות שנשלחו" },
              { c: "#a855f7", v: "28", l: "משוריינים" },
              { c: "#ea580c", v: "8", l: "אירועים" },
            ].map((s, i) => (
              <div
                className="rounded-lg border border-[#e7e1da] bg-white p-2"
                key={i}
              >
                <div className="mb-1 flex items-center justify-between">
                  <div
                    className="h-5 w-5 rounded-md"
                    style={{ backgroundColor: `${s.c}15` }}
                  >
                    <div
                      className="m-[5px] h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: s.c }}
                    />
                  </div>
                  <span
                    className="rounded px-1 text-[8px]"
                    style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
                  >
                    +15%
                  </span>
                </div>
                <div className="text-[#8d785e] text-[8px]">{s.l}</div>
                <div
                  className="text-[#181510] text-[16px]"
                  style={{ fontWeight: 800 }}
                >
                  {s.v}
                </div>
                <div className="mt-1 h-4">
                  <svg className="h-full w-full" viewBox="0 0 80 16">
                    <title>Decorative icon</title>
                    <polyline
                      fill="none"
                      points="0,12 15,8 30,10 45,4 60,6 75,2 80,1"
                      stroke={s.c}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          {/* Pipeline + Revenue */}
          <div className="flex gap-2">
            <div className="flex-[2] rounded-lg border border-[#e7e1da] bg-white p-2">
              <div
                className="mb-1 text-[#181510] text-[9px]"
                style={{ fontWeight: 700 }}
              >
                משפך פרויקטים
              </div>
              {["לידים", "בניית הצעה", "נשלחו", "אושרו", "בביצוע"].map(
                (l, i) => (
                  <div className="mb-0.5 flex items-center gap-1" key={i}>
                    <span className="w-12 text-left text-[#8d785e] text-[7px]">
                      {l}
                    </span>
                    <div className="h-3 flex-1 overflow-hidden rounded-sm bg-[#f5f3f0]">
                      <div
                        className="h-full rounded-sm"
                        style={{
                          width: `${90 - i * 15}%`,
                          backgroundColor: `${
                            [
                              "#3b82f6",
                              "#f59e0b",
                              "#8b5cf6",
                              "#22c55e",
                              "#ff8c00",
                            ][i]
                          }30`,
                          borderRight: `2px solid ${["#3b82f6", "#f59e0b", "#8b5cf6", "#22c55e", "#ff8c00"][i]}`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-[#e7e1da] bg-white p-2">
              <div
                className="mb-1 self-start text-[#181510] text-[9px]"
                style={{ fontWeight: 700 }}
              >
                הכנסות
              </div>
              <div className="relative h-16 w-16">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 48 48">
                  <title>Decorative icon</title>
                  <circle
                    cx="24"
                    cy="24"
                    fill="none"
                    r="19"
                    stroke="#ece8e3"
                    strokeWidth="5"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    fill="none"
                    r="19"
                    stroke="#ff8c00"
                    strokeDasharray="119.4"
                    strokeDashoffset="33.4"
                    strokeLinecap="round"
                    strokeWidth="5"
                  />
                </svg>
                <div
                  className="absolute inset-0 flex items-center justify-center text-[#181510] text-[12px]"
                  style={{ fontWeight: 800 }}
                >
                  72%
                </div>
              </div>
              <div className="mt-1 text-[#8d785e] text-[7px]">
                ₪362K מתוך ₪500K
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockProjectsList() {
  return (
    <div className="flex h-[280px] text-[9px]">
      <MockSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MockTopbar />
        <div className="flex-1 space-y-2 overflow-hidden bg-[#f8f7f5] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff8c00]/10 text-[12px]">
                📁
              </div>
              <span
                className="text-[#181510] text-[14px]"
                style={{ fontWeight: 700 }}
              >
                פרויקטים
              </span>
            </div>
            <div
              className="flex h-6 w-20 items-center justify-center rounded-lg bg-[#ff8c00] text-[8px] text-white"
              style={{ fontWeight: 600 }}
            >
              + פרויקט חדש
            </div>
          </div>
          {/* Filters */}
          <div className="flex gap-1">
            <div className="h-6 flex-1 rounded-md border border-[#e7e1da] bg-white" />
            <div className="flex gap-0.5 rounded-md border border-[#e7e1da] bg-white p-0.5">
              {["הכל", "ליד", "הצעה", "אושר"].map((f, i) => (
                <div
                  className={`rounded px-2 py-0.5 text-[7px] ${i === 0 ? "bg-[#181510] text-white" : "text-[#8d785e]"}`}
                  key={i}
                  style={{ fontWeight: 600 }}
                >
                  {f}
                </div>
              ))}
            </div>
          </div>
          {/* Grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                name: "נופש שנתי גליל עליון",
                co: "סייבר-גלובל",
                status: "בניית הצעה",
                sc: "#f97316",
                p: 120,
                pr: "₪102K",
                m: 25,
              },
              {
                name: "כנס מכירות Q1",
                co: "טכנו-פלוס",
                status: "ליד חדש",
                sc: "#3b82f6",
                p: 80,
                pr: "",
                m: 0,
              },
              {
                name: "יום כיף צוות פיתוח",
                co: "קליקסופט",
                status: "הצעה נשלחה",
                sc: "#8b5cf6",
                p: 45,
                pr: "₪38K",
                m: 22,
              },
            ].map((proj, i) => (
              <div
                className="rounded-lg border border-[#e7e1da] bg-white p-2"
                key={i}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[7px]"
                    style={{
                      backgroundColor: `${proj.sc}15`,
                      color: proj.sc,
                      fontWeight: 600,
                    }}
                  >
                    {proj.status}
                  </span>
                  <span className="text-[#8d785e] text-[7px]">#483{i}</span>
                </div>
                <div
                  className="text-[#181510] text-[10px]"
                  style={{ fontWeight: 600 }}
                >
                  {proj.name}
                </div>
                <div className="mb-1 text-[#8d785e] text-[8px]">{proj.co}</div>
                <div className="flex gap-2 text-[#8d785e] text-[7px]">
                  <span>👥 {proj.p}</span>
                  {proj.pr && <span>💰 {proj.pr}</span>}
                </div>
                {proj.m > 0 && (
                  <div className="mt-1.5 flex items-center gap-1">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#ece8e3]">
                      <div
                        className="h-full rounded-full bg-green-400"
                        style={{ width: `${proj.m}%` }}
                      />
                    </div>
                    <span
                      className="text-[7px] text-green-600"
                      style={{ fontWeight: 600 }}
                    >
                      {proj.m}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockQuoteEditor() {
  return (
    <div className="flex h-[320px] text-[9px]">
      <MockSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MockTopbar />
        <div className="flex-1 space-y-2 overflow-hidden bg-[#f8f7f5] p-3">
          {/* Title */}
          <div className="flex items-center gap-2">
            <div
              className="text-[#181510] text-[14px]"
              style={{ fontWeight: 700 }}
            >
              פרויקט: נופש שנתי גליל עליון
            </div>
          </div>
          {/* Info cards */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { l: "סטטוס", v: "בניית הצעה", c: "#ff8c00" },
              { l: "חברה", v: "סייבר-גלובל" },
              { l: "משתתפים", v: "120 איש" },
              { l: "אזור", v: "גליל עליון" },
            ].map((c, i) => (
              <div
                className="rounded-lg border border-[#e7e1da] bg-white p-1.5 text-center"
                key={i}
              >
                <div className="text-[#8d785e] text-[7px]">{c.l}</div>
                <div
                  className="text-[9px]"
                  style={{ fontWeight: 600, color: c.c || "#181510" }}
                >
                  {c.v}
                </div>
              </div>
            ))}
          </div>
          {/* Summary bar */}
          <div className="flex items-center justify-between rounded-lg bg-gradient-to-l from-[#181510] to-[#2a2518] p-2">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-[#c4b89a] text-[7px]">מחיר לאדם</div>
                <div
                  className="text-[14px] text-white"
                  style={{ fontWeight: 700 }}
                >
                  ₪375
                </div>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-[#c4b89a] text-[7px]">מחיר כולל</div>
                <div
                  className="text-[14px] text-white"
                  style={{ fontWeight: 700 }}
                >
                  ₪45,000
                </div>
              </div>
            </div>
            <div className="rounded-md bg-[#ff8c00]/20 px-2 py-1 text-center">
              <div className="text-[#ffb74d] text-[7px]">רווח יעד</div>
              <div
                className="text-[#ff8c00] text-[12px]"
                style={{ fontWeight: 700 }}
              >
                22%
              </div>
            </div>
          </div>
          {/* Tabs + Component cards */}
          <div className="flex gap-0.5 rounded-md bg-[#ece8e3] p-0.5">
            {["רכיבים וספקים", "תמחור ורווח", 'לו"ז'].map((t, i) => (
              <div
                className={`flex-1 rounded py-1 text-center text-[8px] ${i === 0 ? "bg-white text-[#181510] shadow-sm" : "text-[#8d785e]"}`}
                key={i}
                style={{ fontWeight: 600 }}
              >
                {t}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {/* Transport */}
            <div className="flex-1 rounded-lg border border-[#e7e1da] bg-white p-2">
              <div className="mb-1 flex items-center gap-1">
                <span className="text-[10px]">🚌</span>
                <span
                  className="text-[#181510] text-[9px]"
                  style={{ fontWeight: 600 }}
                >
                  תחבורה
                </span>
                <span className="mr-auto rounded-full bg-green-50 px-1 text-[7px] text-green-600">
                  ✓ מאושר
                </span>
              </div>
              <div className="text-[#8d785e] text-[8px]">
                אוטובוסים הגליל — ₪7,500
              </div>
            </div>
            {/* Activity with alternatives */}
            <div className="flex-1 rounded-lg border border-[#e7e1da] bg-white p-2">
              <div className="mb-1 flex items-center gap-1">
                <span className="text-[10px]">🎯</span>
                <span
                  className="text-[#181510] text-[9px]"
                  style={{ fontWeight: 600 }}
                >
                  פעילות בוקר
                </span>
              </div>
              <div className="flex gap-1">
                {["רייזרס", "קייקים", "יער"].map((a, i) => (
                  <div
                    className={`flex-1 rounded-md border-2 p-1 text-center text-[7px] ${i === 0 ? "border-[#ff8c00] bg-[#ff8c00]/5" : "border-[#e7e1da]"}`}
                    key={i}
                  >
                    <div className="mb-0.5 h-5 rounded-sm bg-[#f5f3f0]" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockSupplierBank() {
  return (
    <div className="flex h-[300px] text-[9px]">
      <MockSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MockTopbar />
        <div className="flex-1 space-y-2 overflow-hidden bg-[#f8f7f5] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[14px]">🏛️</span>
              <span
                className="text-[#181510] text-[14px]"
                style={{ fontWeight: 700 }}
              >
                בנק ספקים
              </span>
            </div>
            <div
              className="flex h-6 w-20 items-center justify-center rounded-lg bg-[#ff8c00] text-[8px] text-white"
              style={{ fontWeight: 600 }}
            >
              + ספק חדש
            </div>
          </div>
          <div className="h-6 rounded-lg border border-[#e7e1da] bg-white" />
          {/* Filters */}
          <div className="flex gap-2">
            {["קטגוריה", "אזור", "סטטוס"].map((f, i) => (
              <div className="flex-1" key={i}>
                <div className="mb-0.5 text-[#8d785e] text-[7px]">{f}</div>
                <div className="h-5 rounded-md border border-[#e7e1da] bg-white" />
              </div>
            ))}
          </div>
          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-[#e7e1da] bg-white">
            <div
              className="grid grid-cols-6 gap-1 border-[#e7e1da] border-b bg-[#f5f3f0] px-2 py-1 text-[#8d785e] text-[7px]"
              style={{ fontWeight: 600 }}
            >
              <span className="col-span-2">ספק</span>
              <span>קטגוריה</span>
              <span>אזור</span>
              <span>דירוג</span>
              <span>סטטוס</span>
            </div>
            {[
              {
                n: "🚌 הסעות מסיילי הצפון",
                c: "תחבורה",
                r: "צפון",
                s: 4.5,
                v: "✅",
              },
              {
                n: "🍽️ קייטרינג סעמי המזרח",
                c: "מזון",
                r: "ירושלים",
                s: 4.0,
                v: "⏳",
              },
              {
                n: "🏃 ספורט אתגרי בנגב",
                c: "אטרקציות",
                r: "דרום",
                s: 5.0,
                v: "⚠️",
              },
              {
                n: "🍷 יקב רמת נפתלי",
                c: "אטרקציות",
                r: "צפון",
                s: 4.8,
                v: "✅",
              },
            ].map((s, i) => (
              <div
                className="grid grid-cols-6 items-center gap-1 border-[#f5f3f0] border-b px-2 py-1.5 text-[8px]"
                key={i}
              >
                <span
                  className="col-span-2 text-[#181510]"
                  style={{ fontWeight: 500 }}
                >
                  {s.n}
                </span>
                <span className="text-[#8d785e]">{s.c}</span>
                <span className="text-[#8d785e]">{s.r}</span>
                <span className="text-[#ff8c00]">
                  {"⭐".repeat(Math.floor(s.s))}
                </span>
                <span>{s.v}</span>
              </div>
            ))}
          </div>
          {/* Map hint */}
          <div className="flex h-12 items-center justify-center rounded-lg border border-[#e7e1da] bg-white text-[#8d785e] text-[9px]">
            🗺️ מפה אינטראקטיבית — ספקים לפי אזור
          </div>
        </div>
      </div>
    </div>
  );
}

function MockSupplierDetail() {
  return (
    <div className="flex h-[300px] text-[9px]">
      <MockSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MockTopbar />
        <div className="flex-1 space-y-2 overflow-hidden bg-[#f8f7f5] p-3">
          <div className="flex items-center gap-2">
            <span className="text-[18px]">🍷</span>
            <div>
              <div className="flex items-center gap-1">
                <span
                  className="text-[#181510] text-[14px]"
                  style={{ fontWeight: 700 }}
                >
                  יקב רמת נפתלי
                </span>
                <span className="rounded-full bg-green-50 px-1 py-0.5 text-[7px] text-green-600">
                  ✅ מאומת
                </span>
              </div>
              <div className="text-[#8d785e] text-[8px]">
                🍷 יקבים · גליל עליון
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-0.5 rounded-md bg-[#ece8e3] p-0.5">
            {["מידע כללי", "מוצרים", "מסמכים", "אנשי קשר", "היסטוריה"].map(
              (t, i) => (
                <div
                  className={`flex-1 rounded py-1 text-center text-[7px] ${i === 0 ? "bg-white text-[#181510] shadow-sm" : "text-[#8d785e]"}`}
                  key={i}
                  style={{ fontWeight: 600 }}
                >
                  {t}
                </div>
              )
            )}
          </div>
          <div className="flex gap-2">
            {/* Main */}
            <div className="flex-[2] space-y-2">
              {/* Contacts */}
              <div className="rounded-lg border border-[#e7e1da] bg-white p-2">
                <div
                  className="mb-1 text-[#181510] text-[9px]"
                  style={{ fontWeight: 700 }}
                >
                  אנשי קשר
                </div>
                <div className="flex gap-2">
                  {[
                    { n: "יצחק ברוך", r: "בעלים", c: "#22c55e" },
                    { n: "מיכל לוי", r: "שיווק", c: "#ff8c00" },
                  ].map((c, i) => (
                    <div
                      className="flex flex-1 items-center gap-1.5 rounded-lg border border-[#e7e1da] p-1.5"
                      key={i}
                    >
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[7px] text-white"
                        style={{ backgroundColor: c.c, fontWeight: 600 }}
                      >
                        {c.n[0]}
                        {c.n.split(" ")[1]?.[0]}
                      </div>
                      <div>
                        <div
                          className="text-[#181510] text-[8px]"
                          style={{ fontWeight: 600 }}
                        >
                          {c.n}
                        </div>
                        <div className="text-[#8d785e] text-[7px]">{c.r}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Products */}
              <div className="rounded-lg border border-[#e7e1da] bg-white p-2">
                <div
                  className="mb-1 text-[#181510] text-[9px]"
                  style={{ fontWeight: 700 }}
                >
                  מוצרים ושירותים
                </div>
                <div className="flex gap-1.5">
                  {["סיור ביקב ₪120", "פלטת גבינות ₪85", "אירוע בוטיק ₪5K"].map(
                    (p, i) => (
                      <div
                        className="flex-1 overflow-hidden rounded-md border border-[#e7e1da]"
                        key={i}
                      >
                        <div className="h-8 bg-[#f5f3f0]" />
                        <div
                          className="p-1 text-[#181510] text-[7px]"
                          style={{ fontWeight: 500 }}
                        >
                          {p}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            {/* Side */}
            <div className="flex-1 space-y-2">
              <div className="rounded-lg border border-[#e7e1da] bg-white p-2">
                <div
                  className="mb-1 text-[#181510] text-[9px]"
                  style={{ fontWeight: 700 }}
                >
                  מסמכים
                </div>
                {[
                  { n: "רישיון עסק", c: "#22c55e" },
                  { n: "כשרות", c: "#eab308" },
                  { n: "ביטוח", c: "#ef4444" },
                ].map((d, i) => (
                  <div
                    className="flex items-center justify-between py-0.5"
                    key={i}
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: d.c }}
                      />
                      <span className="text-[7px]">{d.n}</span>
                    </div>
                    <span className="text-[7px]" style={{ color: d.c }}>
                      {d.c === "#22c55e"
                        ? "תקין"
                        : d.c === "#eab308"
                          ? "קרוב"
                          : "פג!"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockClientQuote() {
  return (
    <div className="h-[340px] overflow-hidden text-[9px]">
      {/* Top nav */}
      <div className="flex h-7 items-center justify-between border-[#e7e1da] border-b bg-white px-3">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#ff8c00] text-[7px] text-white">
            ✈
          </div>
          <span
            className="text-[#181510] text-[9px]"
            style={{ fontWeight: 700 }}
          >
            TravelPro
          </span>
        </div>
        <span className="text-[#8d785e] text-[7px]">
          הצעת מחיר | נופש שנתי גליל עליון
        </span>
        <div className="flex gap-1">
          <div className="h-4 w-10 rounded-md border border-[#e7e1da] text-center text-[#8d785e] text-[7px] leading-[16px]">
            גרסאות
          </div>
          <div className="h-4 w-8 rounded-md bg-[#ff8c00] text-center text-[7px] text-white leading-[16px]">
            🖨
          </div>
        </div>
      </div>
      {/* Hero */}
      <div className="relative h-28 bg-gradient-to-t from-[#181510] via-[#181510]/40 to-[#22c55e]/20">
        <div className="absolute right-3 bottom-2">
          <div className="text-[#ffb74d] text-[7px]">החוויה הגלילית שלכם</div>
          <div className="text-[16px] text-white" style={{ fontWeight: 700 }}>
            החוויה הגלילית שלכם מתחילה כאן
          </div>
          <div className="max-w-[200px] text-[7px] text-white/70">
            יום נופש מושלם בגליל העליון: סיור ביקב, טעימות יין, ארוחת שף
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="space-y-2 bg-white px-4 py-2">
        {/* Timeline */}
        <div className="text-[#181510] text-[10px]" style={{ fontWeight: 700 }}>
          ⏰ לו"ז מקוצר
        </div>
        <div className="flex gap-1.5">
          {[
            { t: "09:00-12:00", n: "🍷 סיור כרמים" },
            { t: "13:00-14:00", n: "🍽️ ארוחת צהריים" },
            { t: "15:00-18:00", n: "🚌 הסעות VIP" },
          ].map((e, i) => (
            <div
              className="flex-1 rounded-lg border-2 border-[#ff8c00]/20 p-1.5 text-center"
              key={i}
            >
              <div
                className="text-[#181510] text-[8px]"
                style={{ fontWeight: 600 }}
              >
                {e.n}
              </div>
              <div
                className="text-[#ff8c00] text-[7px]"
                style={{ fontWeight: 600 }}
              >
                {e.t}
              </div>
            </div>
          ))}
        </div>
        {/* Activities */}
        <div className="text-[#181510] text-[10px]" style={{ fontWeight: 700 }}>
          📋 פירוט הפעילויות
        </div>
        <div className="flex h-14 gap-2 overflow-hidden">
          <div className="w-20 shrink-0 rounded-lg bg-[#f5f3f0]" />
          <div>
            <div className="text-[#ff8c00] text-[7px]">
              החוויה הגלילית האולטימטיבית
            </div>
            <div
              className="text-[#181510] text-[9px]"
              style={{ fontWeight: 600 }}
            >
              סיור כרמים, טעימות יין וגבינות בוטיק
            </div>
            <div className="text-[#8d785e] text-[7px]">
              • סיור מודרך בכרם עין רפאל • נופים עוצרי נשימה • טעימות 5 סוגי יין
            </div>
          </div>
        </div>
        {/* Price */}
        <div className="flex items-center justify-between rounded-lg bg-gradient-to-l from-[#181510] to-[#2a2518] p-2">
          <div>
            <div className="text-[9px] text-white" style={{ fontWeight: 700 }}>
              סיכום הצעת מחיר
            </div>
            <div className="text-[#c4b89a] text-[7px]">50 משתתפים</div>
          </div>
          <div className="text-center">
            <div
              className="text-[#ff8c00] text-[14px]"
              style={{ fontWeight: 700 }}
            >
              ₪42,500
            </div>
            <div className="text-[#c4b89a] text-[7px]">₪850 לאדם</div>
          </div>
          <div
            className="rounded-md bg-[#ff8c00] px-2 py-1 text-[8px] text-white"
            style={{ fontWeight: 600 }}
          >
            ✓ אישור הזמנה
          </div>
        </div>
      </div>
    </div>
  );
}

function MockImportWizard() {
  return (
    <div className="h-[260px] space-y-2 overflow-hidden bg-[#f8f7f5] p-3 text-[9px]">
      <div className="flex items-center gap-2">
        <span className="text-[12px]">📥</span>
        <span
          className="text-[#181510] text-[14px]"
          style={{ fontWeight: 700 }}
        >
          ייבוא ספקים מאקסל
        </span>
      </div>
      {/* Steps */}
      <div className="mx-auto flex max-w-[300px] items-center justify-center gap-0">
        {["העלאת קובץ", "מיפוי שדות", "תצוגה מקדימה", "סיום"].map((s, i) => (
          <div className="flex flex-1 items-center" key={i}>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[8px] ${i < 1 ? "bg-green-500 text-white" : i === 1 ? "bg-[#ff8c00] text-white" : "bg-[#ddd6cb] text-[#8d785e]"}`}
                style={{ fontWeight: 700 }}
              >
                {i < 1 ? "✓" : i + 1}
              </div>
              <span className="mt-0.5 text-[#8d785e] text-[6px]">{s}</span>
            </div>
            {i < 3 && (
              <div
                className={`mx-1 h-0.5 flex-1 ${i < 1 ? "bg-green-400" : "bg-[#ddd6cb]"}`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {/* Field mapping */}
        <div className="w-[140px] shrink-0 rounded-lg border border-[#e7e1da] bg-white p-2">
          <div
            className="mb-1 text-[#181510] text-[9px]"
            style={{ fontWeight: 700 }}
          >
            מיפוי שדות
          </div>
          {["שם הספק *", "קטגוריה", "טלפון", "אימייל"].map((f, i) => (
            <div className="mb-1" key={i}>
              <div className="text-[#8d785e] text-[6px]">{f}</div>
              <div className="h-4 rounded-sm border border-[#e7e1da] bg-[#f5f3f0]" />
            </div>
          ))}
          <div
            className="mt-1.5 flex h-5 items-center justify-center rounded-md bg-[#ff8c00] text-[7px] text-white"
            style={{ fontWeight: 600 }}
          >
            בדוק כפילויות
          </div>
        </div>
        {/* Preview */}
        <div className="flex-1 rounded-lg border border-[#e7e1da] bg-white p-2">
          <div
            className="mb-1 text-[#181510] text-[9px]"
            style={{ fontWeight: 700 }}
          >
            📋 תצוגה מקדימה — 142 שורות
          </div>
          <div className="space-y-0.5">
            <div
              className="grid grid-cols-4 gap-1 border-[#e7e1da] border-b pb-0.5 text-[#8d785e] text-[6px]"
              style={{ fontWeight: 600 }}
            >
              <span>שם ספק</span>
              <span>קטגוריה</span>
              <span>סטטוס</span>
              <span>פעולה</span>
            </div>
            {[
              { n: "גן אירועים קיסריה", c: "אולמות", s: true },
              { n: "קייטרינג סעמים", c: "קייטרינג", s: false },
              { n: "די.ג'יי רועי כהן", c: "מוזיקה", s: true },
              { n: 'סטודיו "רגעים"', c: "צילום", s: false },
            ].map((r, i) => (
              <div
                className="grid grid-cols-4 items-center gap-1 border-[#f5f3f0] border-b py-0.5 text-[7px]"
                key={i}
              >
                <span className="text-[#181510]">{r.n}</span>
                <span className="text-[#8d785e]">{r.c}</span>
                <span
                  style={{
                    color: r.s ? "#16a34a" : "#ca8a04",
                    fontWeight: 600,
                  }}
                >
                  {r.s ? "✅ תקין" : "⚠️ כפילות"}
                </span>
                {r.s ? (
                  <span />
                ) : (
                  <div className="flex gap-0.5">
                    <div className="rounded border border-[#ff8c00] px-1 text-[#ff8c00] text-[6px]">
                      מזג
                    </div>
                    <div className="rounded border border-[#e7e1da] px-1 text-[#8d785e] text-[6px]">
                      התעלם
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockClassificationWizard() {
  return (
    <div className="h-[260px] space-y-2 overflow-hidden bg-[#f8f7f5] p-3 text-[9px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px]">🔬</span>
          <span
            className="text-[#181510] text-[14px]"
            style={{ fontWeight: 700 }}
          >
            אשף סיווג ספקים
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[#8d785e] text-[8px]">45/100</span>
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#ddd6cb]">
            <div
              className="h-full rounded-full bg-[#ff8c00]"
              style={{ width: "45%" }}
            />
          </div>
          <span
            className="text-[#ff8c00] text-[8px]"
            style={{ fontWeight: 600 }}
          >
            45%
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-[3] space-y-2">
          <div className="overflow-hidden rounded-xl border border-[#e7e1da] bg-white">
            <div className="bg-gradient-to-l from-[#fff7ed] to-white p-2">
              <div className="mb-1 flex items-center justify-between">
                <span
                  className="rounded-full bg-green-50 px-1 text-[7px] text-green-600"
                  style={{ fontWeight: 600 }}
                >
                  ספק נוכחי
                </span>
                <span className="text-[#8d785e] text-[7px]">12/05/2024</span>
              </div>
              <div
                className="text-[#181510] text-[14px]"
                style={{ fontWeight: 700 }}
              >
                אלפא שיווק בע"מ
              </div>
              <div className="mt-1 flex gap-4 text-[#8d785e] text-[7px]">
                <span>מזהה: 987321</span>
                <span>📞 050-1234567</span>
                <span>📍 רח' הנביאים 22, ת"א</span>
              </div>
            </div>
            <div className="mx-2 my-1.5 rounded-lg border border-[#ff8c00]/30 bg-[#ff8c00]/5 p-1.5 text-[#6b5d45] text-[8px]">
              💡 זיהוי: <strong>שיווק, תל אביב</strong> — ייתכן ספק שירותי מדיה
            </div>
            <div className="flex gap-2 px-2 pb-2">
              <div className="flex-1">
                <div className="mb-0.5 text-[#8d785e] text-[7px]">
                  קטגוריה ראשית
                </div>
                <div className="flex h-5 items-center rounded-md border border-[#e7e1da] bg-[#f5f3f0] px-1 text-[8px]">
                  שיווק ופרסום
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-0.5 text-[#8d785e] text-[7px]">
                  תת-קטגוריה
                </div>
                <div className="flex h-5 items-center rounded-md border border-[#e7e1da] bg-[#f5f3f0] px-1 text-[8px]">
                  רכש מדיה
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-[#e7e1da] bg-white p-1.5">
            <div className="flex gap-2 text-[#8d785e] text-[8px]">
              <span>📦 ארכיון</span>
              <span>⏭ דלג</span>
            </div>
            <div
              className="rounded-md bg-[#ff8c00] px-3 py-1 text-[8px] text-white"
              style={{ fontWeight: 600 }}
            >
              אשר והמשך →
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="flex-1 space-y-2">
          <div className="rounded-xl border border-[#e7e1da] bg-white p-2">
            <div
              className="mb-1 text-[#181510] text-[8px]"
              style={{ fontWeight: 700 }}
            >
              📋 תור ספקים
            </div>
            {["אלפא שיווק", "בטא לוגיסטיקה", "גמא מחשוב", "דלתא בנייה"].map(
              (s, i) => (
                <div
                  className={`mb-0.5 rounded-md px-1.5 py-1 text-[7px] ${i === 0 ? "bg-[#ff8c00] text-white" : "text-[#181510]"}`}
                  key={i}
                  style={{ fontWeight: i === 0 ? 600 : 400 }}
                >
                  {s}
                </div>
              )
            )}
          </div>
          <div className="rounded-xl border border-[#e7e1da] bg-white p-2 text-[7px]">
            <div
              className="mb-1 text-[#181510] text-[8px]"
              style={{ fontWeight: 700 }}
            >
              סטטיסטיקה
            </div>
            <div className="flex justify-between">
              <span className="text-[#8d785e]">קצב</span>
              <span className="text-[#181510]" style={{ fontWeight: 600 }}>
                12/שעה
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8d785e]">זמן</span>
              <span className="text-[#181510]" style={{ fontWeight: 600 }}>
                01:24
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockScannedProducts() {
  return (
    <div className="h-[260px] space-y-2 overflow-hidden bg-[#f8f7f5] p-3 text-[9px]">
      <div className="text-center">
        <span
          className="rounded-full bg-green-50 px-2 py-0.5 text-[7px] text-green-600"
          style={{ fontWeight: 600 }}
        >
          ✨ סריקה הושלמה
        </span>
        <div
          className="mt-1 text-[#181510] text-[14px]"
          style={{ fontWeight: 700 }}
        >
          מוצרים מוצעים מסריקת אתר
        </div>
        <div className="text-[#8d785e] text-[8px]">
          האלגוריתם זיהה מוצרים חדשים — אשרו להוספה לקטלוג
        </div>
      </div>
      {/* Product cards */}
      {[
        { n: "מקדחה חשמלית 18V", p: "₪849", s: true, a: false },
        { n: "ארון כלים מודולרי", p: "₪1,250", s: true, a: true },
      ].map((prod, i) => (
        <div
          className={`rounded-xl border bg-white ${prod.a ? "border-green-200" : "border-[#e7e1da]"} flex overflow-hidden`}
          key={i}
        >
          <div className="relative w-20 shrink-0 bg-[#f5f3f0]">
            {prod.a && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/10">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                  ✓
                </div>
              </div>
            )}
            {!prod.a && (
              <div
                className="absolute top-1 right-1 rounded bg-[#ff8c00] px-1 text-[6px] text-white"
                style={{ fontWeight: 600 }}
              >
                ✓ אימות
              </div>
            )}
          </div>
          <div className="flex-1 p-2">
            <div className="flex items-center justify-between">
              <div
                className="text-[#181510] text-[10px]"
                style={{ fontWeight: 700 }}
              >
                {prod.n}
              </div>
              <div
                className="text-[#ff8c00] text-[12px]"
                style={{ fontWeight: 700 }}
              >
                {prod.p}
              </div>
            </div>
            <div className="mt-0.5 text-[#8d785e] text-[7px]">
              תיאור מוצר שזוהה מהאתר...
            </div>
            <div className="mt-1 flex gap-1">
              {prod.a ? (
                <span
                  className="text-[7px] text-green-600"
                  style={{ fontWeight: 600 }}
                >
                  ✓ אושר והוסף לקטלוג
                </span>
              ) : (
                <>
                  <div
                    className="rounded bg-[#ff8c00] px-2 py-0.5 text-[7px] text-white"
                    style={{ fontWeight: 600 }}
                  >
                    ✓ אישור
                  </div>
                  <div
                    className="rounded border border-[#ff8c00] px-2 py-0.5 text-[#ff8c00] text-[7px]"
                    style={{ fontWeight: 600 }}
                  >
                    ✏️ עריכה
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════ MAIN DOCUMENT ═══════════════

export function PRDDocument() {
  const handlePrint = () => window.print();
  const [activeTab, setActiveTab] = useState<"prd" | "kanban">("prd");

  // If Kanban tab is active, render it
  if (activeTab === "kanban") {
    return (
      <div
        className="min-h-screen bg-[#f8f7f5] font-['Assistant',sans-serif]"
        dir="rtl"
      >
        {/* Tab bar */}
        <div className="sticky top-0 z-50 border-[#e7e1da] border-b bg-white">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6">
            <div className="flex items-center gap-0">
              <button
                className="flex items-center gap-2 border-transparent border-b-2 px-5 py-3.5 text-[#8d785e] text-[13px] transition-colors hover:text-[#181510]"
                onClick={() => setActiveTab("prd")}
                style={{ fontWeight: 600 }}
                type="button"
              >
                <FileText size={15} />
                מסמך אפיון
              </button>
              <button
                className="flex items-center gap-2 border-[#ff8c00] border-b-2 px-5 py-3.5 text-[#ff8c00] text-[13px] transition-colors"
                onClick={() => setActiveTab("kanban")}
                style={{ fontWeight: 600 }}
                type="button"
              >
                <LayoutGrid size={15} />
                ניהול משימות
              </button>
            </div>
            <a
              className="flex items-center gap-2 text-[#8d785e] text-[12px] transition-colors hover:text-[#181510]"
              href="/"
              style={{ fontWeight: 600 }}
            >
              <ArrowLeft size={14} />
              חזרה לאפליקציה
            </a>
          </div>
        </div>
        <KanbanBoard />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f8f7f5] font-['Assistant',sans-serif] print:bg-white"
      dir="rtl"
    >
      {/* ── Print button (floating) ── */}
      <div className="fixed bottom-6 left-6 z-50 flex gap-2 print:hidden">
        <button
          className="flex items-center gap-2 rounded-xl bg-[#181510] px-5 py-3 text-white shadow-xl transition-all hover:bg-[#2a2518]"
          onClick={handlePrint}
          style={{ fontWeight: 600 }}
          type="button"
        >
          <Printer size={18} />
          הדפס / שמור PDF
        </button>
        <a
          className="flex items-center gap-2 rounded-xl border border-[#e7e1da] bg-white px-4 py-3 text-[#181510] shadow-lg transition-all hover:bg-[#f5f3f0]"
          href="/"
          style={{ fontWeight: 600 }}
        >
          <ArrowLeft size={16} />
          חזרה לאפליקציה
        </a>
      </div>

      {/* ── Tab bar (sticky) ── */}
      <div className="sticky top-0 z-50 border-[#2a2518] border-b bg-[#181510] print:hidden">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-0">
            <button
              className="flex items-center gap-2 border-[#ff8c00] border-b-2 px-5 py-3.5 text-[13px] text-white transition-colors"
              onClick={() => setActiveTab("prd")}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <FileText size={15} />
              מסמך אפיון
            </button>
            <button
              className="flex items-center gap-2 border-transparent border-b-2 px-5 py-3.5 text-[#c4b89a] text-[13px] transition-colors hover:text-white"
              onClick={() => setActiveTab("kanban")}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <LayoutGrid size={15} />
              ניהול משימות
            </button>
          </div>
          <a
            className="flex items-center gap-2 text-[#c4b89a] text-[12px] transition-colors hover:text-white"
            href="/"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft size={14} />
            חזרה לאפליקציה
          </a>
        </div>
      </div>

      {/* ── Cover ── */}
      <div className="bg-gradient-to-b from-[#181510] via-[#2a2518] to-[#181510] px-8 py-20 text-white print:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff8c00] text-[22px]">
              ✈
            </div>
            <span className="text-[28px]" style={{ fontWeight: 800 }}>
              TravelPro
            </span>
          </div>
          <h1
            className="mb-4 max-w-2xl text-[42px] leading-tight"
            style={{ fontWeight: 800 }}
          >
            מסמך אפיון מוצר
          </h1>
          <p className="max-w-xl text-[#c4b89a] text-[18px] leading-relaxed">
            מערכת ניהול פרויקטים למפיקי טיולים מאורגנים ואירועי חברה — סקירת כל
            המסכים, היכולות, ותכנון הפיתוח
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-[#c4b89a] text-[14px]">
            <span>📅 פברואר 2026</span>
            <span>📋 גרסה MVP 1.0</span>
            <span>👤 ערן לוי — יום כיף הפקות</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 md:px-8">
        {/* ── What is TravelPro ── */}
        <Section id="intro">
          <h2
            className="mb-4 flex items-center gap-3 text-[#181510] text-[28px]"
            style={{ fontWeight: 800 }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff8c00]/10 text-[20px]">
              🎯
            </span>
            מה זה TravelPro?
          </h2>
          <p className="mb-6 text-[#6b5d45] text-[16px] leading-relaxed">
            TravelPro הוא כלי ניהול חכם שנבנה במיוחד עבור מפיקי טיולים מאורגנים
            ואירועי חברה. המערכת מרכזת במקום אחד את כל מה שמפיק צריך — ניהול
            ספקים, בניית הצעות מחיר עם תמחור דינמי, שליחת הצעה אינטראקטיבית
            ללקוח, וניהול כל הפרויקטים מלוח בקרה אחד.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                emoji: "😩",
                problem: "ספקים בכל מיני אקסלים",
                solution: "בנק ספקים מרכזי עם חיפוש, סינון ומפה",
              },
              {
                emoji: "⏳",
                problem: "בניית הצעת מחיר לוקחת שעות",
                solution: "עורך הצעות חכם עם תמחור אוטומטי",
              },
              {
                emoji: "📄",
                problem: "הלקוח מקבל PDF משעמם",
                solution: "עמוד הצעה אינטראקטיבי עם תמונות ואישור",
              },
              {
                emoji: "🤯",
                problem: "לא יודע מה קורה היום",
                solution: "לוח בקרה עם כל המספרים והמשימות",
              },
            ].map((item, i) => (
              <div
                className="flex gap-4 rounded-xl border border-[#e7e1da] bg-white p-5"
                key={i}
              >
                <span className="text-[28px]">{item.emoji}</span>
                <div>
                  <div className="text-[#181510] text-[14px] line-through opacity-60">
                    {item.problem}
                  </div>
                  <div
                    className="mt-1 text-[#ff8c00] text-[14px]"
                    style={{ fontWeight: 600 }}
                  >
                    → {item.solution}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Users ── */}
        <Section id="users">
          <h2
            className="mb-4 flex items-center gap-3 text-[#181510] text-[28px]"
            style={{ fontWeight: 800 }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3b82f6]/10 text-[20px]">
              👥
            </span>
            מי משתמש במערכת?
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#e7e1da] bg-white p-6">
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff8c00] text-[16px] text-white"
                  style={{ fontWeight: 700 }}
                >
                  ע.ל
                </div>
                <div>
                  <div
                    className="text-[#181510] text-[16px]"
                    style={{ fontWeight: 700 }}
                  >
                    המפיק
                  </div>
                  <div className="text-[#8d785e] text-[13px]">
                    ערן לוי — מנהל כל הפרויקטים
                  </div>
                </div>
              </div>
              <div className="text-[#6b5d45] text-[13px]">
                רואה את כל המערכת: דשבורד, פרויקטים, ספקים, הצעות מחיר, ייבוא
                וסיווג
              </div>
            </div>
            <div className="rounded-xl border border-[#e7e1da] bg-white p-6">
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6] text-[16px] text-white"
                  style={{ fontWeight: 700 }}
                >
                  🏢
                </div>
                <div>
                  <div
                    className="text-[#181510] text-[16px]"
                    style={{ fontWeight: 700 }}
                  >
                    הלקוח
                  </div>
                  <div className="text-[#8d785e] text-[13px]">
                    נציג חברה שמקבל הצעת מחיר
                  </div>
                </div>
              </div>
              <div className="text-[#6b5d45] text-[13px]">
                רואה רק את עמוד ההצעה שנשלח אליו — תמונות, פעילויות, מחיר, כפתור
                אישור
              </div>
            </div>
          </div>
        </Section>

        {/* ── Table of Contents ── */}
        <Section id="toc">
          <h2
            className="mb-4 flex items-center gap-3 text-[#181510] text-[28px]"
            style={{ fontWeight: 800 }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8b5cf6]/10 text-[20px]">
              🗺️
            </span>
            9 מסכי המערכת
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { n: 1, t: "לוח בקרה", e: "📊", c: "#ff8c00" },
              { n: 2, t: "רשימת פרויקטים", e: "📁", c: "#3b82f6" },
              { n: 3, t: "עורך הצעה", e: "📝", c: "#8b5cf6" },
              { n: 4, t: "בנק ספקים", e: "🏛️", c: "#22c55e" },
              { n: 5, t: "כרטיס ספק", e: "📇", c: "#ec4899" },
              { n: 6, t: "עמוד ללקוח", e: "🌐", c: "#14b8a6" },
              { n: 7, t: "אשף ייבוא", e: "📥", c: "#f59e0b" },
              { n: 8, t: "אשף סיווג", e: "🔬", c: "#ef4444" },
              { n: 9, t: "מוצרים סרוקים", e: "🔍", c: "#06b6d4" },
            ].map((s) => (
              <a
                className="flex items-center gap-3 rounded-xl border border-[#e7e1da] bg-white p-4 transition-all hover:border-[#d4cdc3] hover:shadow-md"
                href={`#screen-${s.n}`}
                key={s.n}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[16px]"
                  style={{ backgroundColor: `${s.c}15` }}
                >
                  {s.e}
                </span>
                <div>
                  <span className="text-[#8d785e] text-[11px]">מסך {s.n}</span>
                  <div
                    className="text-[#181510] text-[14px]"
                    style={{ fontWeight: 600 }}
                  >
                    {s.t}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Section>

        {/* ═══════════════ SCREENS ═══════════════ */}

        <div id="screen-1">
          <ScreenCard
            audience="מפיק"
            color="#ff8c00"
            emoji="📊"
            mockup={<MockDashboard />}
            number={1}
            purpose="תמונת מצב מיידית — מה קורה היום, מה דחוף, וכמה כסף נכנס"
            title="לוח בקרה (דשבורד)"
          >
            <h4
              className="mb-3 text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              מה רואים במסך:
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { t: "ברכה אישית", d: 'שם המפיק + כפתור "הוספת ליד"' },
                {
                  t: "סרט עדכונים חי",
                  d: 'הודעות זורמות: "ספק אישר", "הצעה אושרה"',
                },
                {
                  t: "4 כרטיסי מספרים",
                  d: "לידים, הצעות, פרויקטים, אירועים — כל אחד עם גרף מגמה",
                },
                {
                  t: "משפך פרויקטים",
                  d: "שלבים: לידים → בניית הצעה → נשלחו → אושרו → בביצוע",
                },
                {
                  t: "טבעת הכנסות",
                  d: "₪362K מתוך ₪500K (72%) + רווח ושולי רווח",
                },
                {
                  t: "פרויקטים דחופים",
                  d: "מחיר בהערכה, ספק לא מאומת, ביטוח פג תוקף",
                },
                { t: "לוח שבועי", d: "אירועים קרובים (ריק כרגע)" },
                { t: "פעילות אחרונה", d: 'תשלומים, הודעות, עדכוני לו"ז' },
              ].map((item, i) => (
                <div className="flex items-start gap-2" key={i}>
                  <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff8c00]" />
                  <div>
                    <span
                      className="text-[#181510] text-[13px]"
                      style={{ fontWeight: 600 }}
                    >
                      {item.t}
                    </span>
                    <span className="text-[#8d785e] text-[13px]">
                      {" "}
                      — {item.d}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip label="לחיצה על מספר → פרויקטים מסוננים" />
              <Chip label="לחיצה על דחוף → כניסה לפרויקט" />
              <Chip label="אנימציות countUp" />
            </div>
          </ScreenCard>
        </div>

        <div id="screen-2">
          <ScreenCard
            audience="מפיק"
            color="#3b82f6"
            emoji="📁"
            mockup={<MockProjectsList />}
            number={2}
            purpose="כל הפרויקטים במקום אחד — חיפוש, סינון, ויצירת פרויקט חדש"
            title="רשימת פרויקטים"
          >
            <h4
              className="mb-3 text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              יכולות עיקריות:
            </h4>
            <InfoRow label="חיפוש" value="לפי שם פרויקט או שם חברה" />
            <InfoRow
              label="סינון"
              value="6 סטטוסים: הכל, ליד חדש, בניית הצעה, הצעה נשלחה, אושר, מחיר בהערכה"
            />
            <InfoRow
              label="כרטיס פרויקט"
              value="שם, חברה, סטטוס (צבעוני), משתתפים, אזור, מחיר, פס רווחיות"
            />
            <InfoRow
              label="פרויקט חדש"
              value="Modal עם שדות: שם, לקוח, משתתפים, אזור"
            />
            <InfoRow
              label="מצב ריק"
              value="'לא נמצאו פרויקטים — נסה לשנות את הסינון'"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip label="חיפוש מיידי" />
              <Chip label="סינון מ-URL" />
              <Chip label="לחיצה → עורך הצעה" />
            </div>
          </ScreenCard>
        </div>

        <div id="screen-3">
          <ScreenCard
            audience="מפיק"
            color="#8b5cf6"
            emoji="📝"
            mockup={<MockQuoteEditor />}
            number={3}
            purpose="הלב של המערכת — בניית הצעה, בחירת ספקים, תמחור דינמי, ושליחה ללקוח"
            title="עורך הצעה ותמחור"
          >
            <h4
              className="mb-3 text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              3 טאבים:
            </h4>
            <div className="space-y-4">
              <div className="rounded-xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-4">
                <div
                  className="mb-1 text-[#8b5cf6] text-[14px]"
                  style={{ fontWeight: 700 }}
                >
                  📦 טאב 1: רכיבים וספקים
                </div>
                <div className="text-[#6b5d45] text-[13px]">
                  כל "רכיב" הוא חלק מהטיול: תחבורה, פעילות, ארוחה וכו'. לכל רכיב
                  אפשר לבחור מבין כמה חלופות ספקים עם תמונות ומחירים.
                </div>
              </div>
              <div className="rounded-xl border border-[#ff8c00]/20 bg-[#ff8c00]/5 p-4">
                <div
                  className="mb-1 text-[#ff8c00] text-[14px]"
                  style={{ fontWeight: 700 }}
                >
                  💰 טאב 2: תמחור ורווח יעד
                </div>
                <div className="text-[#6b5d45] text-[13px]">
                  טבלה עם עלות, מחיר מכירה, ורווח. לכל רכיב "משקל רווח" (⭐1-5)
                  — ככל שיותר כוכבים, יותר רווח. המחיר מתעדכן מיידית.
                </div>
              </div>
              <div className="rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/5 p-4">
                <div
                  className="mb-1 text-[#22c55e] text-[14px]"
                  style={{ fontWeight: 700 }}
                >
                  🕐 טאב 3: לו"ז הפעילות
                </div>
                <div className="text-[#6b5d45] text-[13px]">
                  ציר זמן ויזואלי: 08:00 יציאה → 10:30 פעילות → 13:00 ארוחה. כל
                  אירוע עם אייקון ותיאור.
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip label="תמחור דינמי" />
              <Chip label="בחירת חלופות" />
              <Chip label="צור גרסה ושלח ללקוח" />
              <Chip label="שמירת טיוטה" />
            </div>
          </ScreenCard>
        </div>

        <div id="screen-4">
          <ScreenCard
            audience="מפיק"
            color="#22c55e"
            emoji="🏛️"
            mockup={<MockSupplierBank />}
            number={4}
            purpose="המאגר המרכזי של כל הספקים — תחבורה, קייטרינג, אטרקציות, לינה, בידור"
            title="בנק ספקים"
          >
            <h4
              className="mb-3 text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              יכולות עיקריות:
            </h4>
            <InfoRow label="חיפוש" value="חופשי: שם, קטגוריה, אזור" />
            <InfoRow
              label="3 מסננים"
              value="קטגוריה (6), אזור (5), סטטוס אימות (4)"
            />
            <InfoRow
              label="טבלת ספקים"
              value="שם+טלפון, קטגוריה, אזור, דירוג ⭐, סטטוס, הערות, פעולות"
            />
            <InfoRow
              label="מפה אינטראקטיבית"
              value="מפת ישראל עם עיגולים צבעוניים לכל אזור — לחיצה על אזור → רשימת ספקים"
            />
            <InfoRow
              label="הוספת ספק"
              value="Modal: שם, קטגוריה, אזור, טלפון + לינקים לייבוא/סיווג"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip label="צפייה/עריכה" />
              <Chip label="העתקת פרטים" />
              <Chip label="ייבוא מאקסל" />
              <Chip label="אשף סיווג" />
              <Chip color="#22c55e" label="מפה עם Leaflet" />
            </div>
          </ScreenCard>
        </div>

        <div id="screen-5">
          <ScreenCard
            audience="מפיק"
            color="#ec4899"
            emoji="📇"
            mockup={<MockSupplierDetail />}
            number={5}
            purpose="כל המידע על ספק בודד — פרטים, מוצרים, מסמכים, אנשי קשר והיסטוריה"
            title="כרטיס ספק"
          >
            <h4
              className="mb-3 text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              5 טאבים:
            </h4>
            <div className="space-y-2">
              {[
                {
                  t: "מידע כללי",
                  d: "אנשי קשר + מוצרים + מיקום + מסמכים + תקשורת",
                },
                {
                  t: "מוצרים ושירותים",
                  d: "כרטיסים עם תמונה, שם, תיאור, מחיר",
                },
                {
                  t: "מסמכים",
                  d: "🟢 תקין / 🟡 קרוב לפקיעה / 🔴 פג תוקף — עם תאריכי תוקף",
                },
                { t: "אנשי קשר", d: "שם, תפקיד, טלפון, אימייל + הוספת חדש" },
                { t: "היסטוריה", d: "שיחות טלפון, מיילים, העלאות — בציר זמן" },
              ].map((tab, i) => (
                <div
                  className="flex items-start gap-2 rounded-lg bg-[#f8f7f5] p-3"
                  key={i}
                >
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#ec4899]/10 text-[#ec4899] text-[12px]"
                    style={{ fontWeight: 700 }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <span
                      className="text-[#181510] text-[13px]"
                      style={{ fontWeight: 600 }}
                    >
                      {tab.t}
                    </span>
                    <span className="text-[#8d785e] text-[13px]">
                      {" "}
                      — {tab.d}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScreenCard>
        </div>

        <div id="screen-6">
          <ScreenCard
            audience="לקוח"
            color="#14b8a6"
            emoji="🌐"
            mockup={<MockClientQuote />}
            number={6}
            purpose="מה שהלקוח רואה — עמוד מעוצב ומרשים עם תמונות, פירוט ואישור בלחיצה"
            title="עמוד הצעה ללקוח"
          >
            <div className="mb-4 rounded-xl border border-[#14b8a6]/30 bg-[#14b8a6]/10 p-4">
              <div
                className="text-[#14b8a6] text-[14px]"
                style={{ fontWeight: 700 }}
              >
                ⚠️ מסך ייחודי
              </div>
              <div className="text-[#6b5d45] text-[13px]">
                ללא תפריט צד, מותאם לנייד, מיועד ללקוח בלבד
              </div>
            </div>
            <h4
              className="mb-3 text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              מה הלקוח רואה:
            </h4>
            <InfoRow
              label="תמונת כותרת"
              value="Hero גדול — 'החוויה הגלילית שלכם מתחילה כאן'"
            />
            <InfoRow
              label={'לו"ז מקוצר'}
              value="3 כרטיסים: סיור כרמים, ארוחת צהריים, הסעות VIP"
            />
            <InfoRow
              label="פירוט פעילויות"
              value="כרטיסים עם תמונה + 'קרא עוד' + שם ספק"
            />
            <InfoRow
              label="טיפים"
              value="'קחו כובעים', 'הגיעו עם נעליים נוחות'"
            />
            <InfoRow
              label="סיכום מחיר"
              value="₪850 לאדם × 50 = ₪42,500 + כפתור 'אישור הזמנה'"
            />
            <InfoRow
              label="אחרי אישור"
              value="הכפתור הופך לירוק: 'ההזמנה אושרה! המפיק יקבל התראה'"
            />
            <InfoRow
              label="גרסאות"
              value="הלקוח רואה V1.0 (נוכחית), V0.9, V0.8 — עם מחירים ותאריכים"
            />
          </ScreenCard>
        </div>

        <div id="screen-7">
          <ScreenCard
            audience="מפיק"
            color="#f59e0b"
            emoji="📥"
            mockup={<MockImportWizard />}
            number={7}
            purpose="ייבוא רשימת ספקים מאקסל בקלות — מיפוי שדות, זיהוי כפילויות, ייבוא"
            title="אשף ייבוא ספקים מאקסל"
          >
            <h4
              className="mb-3 text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              תהליך ב-4 שלבים:
            </h4>
            <div className="mb-4 flex items-center justify-center gap-2">
              {[
                "① העלאת קובץ",
                "② מיפוי שדות",
                "③ תצוגה מקדימה",
                "④ סיום ייבוא",
              ].map((s, i) => (
                <div className="flex items-center gap-2" key={i}>
                  <div
                    className={`rounded-full px-3 py-1 text-[13px] ${i === 1 ? "bg-[#f59e0b] text-white" : i < 1 ? "bg-green-500 text-white" : "bg-[#ece8e3] text-[#8d785e]"}`}
                    style={{ fontWeight: 600 }}
                  >
                    {s}
                  </div>
                  {i < 3 && <div className="h-0.5 w-6 bg-[#ddd6cb]" />}
                </div>
              ))}
            </div>
            <InfoRow
              label="מיפוי שדות"
              value="התאמת עמודות אקסל לשדות: שם ספק, קטגוריה, טלפון, אימייל"
            />
            <InfoRow
              label="זיהוי כפילויות"
              value="המערכת מזהה ספקים שכבר קיימים — לכל כפילות: 'מזג' או 'התעלם'"
            />
            <InfoRow
              label="ייבוא"
              value="'ייבא הכל (142 ספקים)' או 'דלג על כפילויות'"
            />
          </ScreenCard>
        </div>

        <div id="screen-8">
          <ScreenCard
            audience="מפיק"
            color="#ef4444"
            emoji="🔬"
            mockup={<MockClassificationWizard />}
            number={8}
            purpose="סיווג מרוכז של ספקים מיובאים — אחד-אחד, עם המלצה חכמה"
            title="אשף סיווג ספקים"
          >
            <h4
              className="mb-3 text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              איך זה עובד:
            </h4>
            <InfoRow
              label="כרטיס ספק"
              value="שם, מזהה, טלפון, כתובת, קטגוריה מקורית (מהאקסל)"
            />
            <InfoRow
              label="המלצה חכמה"
              value="'זיהוי: שיווק, תל אביב — ייתכן ספק שירותי מדיה'"
            />
            <InfoRow
              label="בחירת קטגוריה"
              value="ראשית (5 אפשרויות) + תת-קטגוריה + תגיות (B2B/שנתי/דחוף)"
            />
            <InfoRow label="תור ספקים" value="רואים מי הבא בתור (4 בכל רגע)" />
            <InfoRow
              label="סטטיסטיקה"
              value="קצב: 12 ספקים/שעה, זמן עבודה: 01:24"
            />
            <InfoRow
              label="פעולות"
              value="'אשר והמשך' / 'דלג' / 'העבר לארכיון'"
            />
          </ScreenCard>
        </div>

        <div id="screen-9">
          <ScreenCard
            audience="מפיק"
            color="#06b6d4"
            emoji="🔍"
            mockup={<MockScannedProducts />}
            number={9}
            purpose="בדיקה ואישור של מוצרים שזוהו אוטומטית מאתר ספק — לפני הכנסה לקטלוג"
            title="מוצרים סרוקים"
          >
            <h4
              className="mb-3 text-[#181510] text-[16px]"
              style={{ fontWeight: 700 }}
            >
              מה רואים:
            </h4>
            <InfoRow
              label="מוצר שלם"
              value="שם, תיאור, מחיר, קטגוריה, לינק למקור — badge 'אימות בוצע'"
            />
            <InfoRow
              label="מוצר חלקי"
              value="חלק מהפרטים חסרים — badge 'נדרש אימות'"
            />
            <InfoRow
              label="אישור"
              value="לחיצה → overlay ירוק 'אושר והוסף לקטלוג'"
            />
            <InfoRow label="הסרה" value="המוצר נעלם מהרשימה" />
            <InfoRow
              label="סיכום"
              value="X מוצרים נמצאו · Y אושרו · Z דורשים השלמה"
            />
          </ScreenCard>
        </div>

        {/* ── User Journeys ── */}
        <Section id="journeys">
          <h2
            className="mb-6 flex items-center gap-3 text-[#181510] text-[28px]"
            style={{ fontWeight: 800 }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22c55e]/10 text-[20px]">
              🔄
            </span>
            מסעות משתמש עיקריים
          </h2>

          {/* Journey 1 */}
          <div className="mb-6 rounded-2xl border border-[#e7e1da] bg-white p-6">
            <h3
              className="mb-4 text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              🎯 מסע 1: בניית הצעת מחיר מאפס עד אישור הלקוח
            </h3>
            <div className="space-y-0">
              {[
                { step: "המפיק נכנס למערכת", screen: "לוח בקרה", emoji: "📊" },
                {
                  step: 'רואה 12 לידים חדשים — לוחץ "פרויקט חדש"',
                  screen: "לוח בקרה",
                  emoji: "➕",
                },
                {
                  step: "ממלא שם, חברה, משתתפים, אזור",
                  screen: "Modal",
                  emoji: "📝",
                },
                {
                  step: "בוחר רכיבים: תחבורה, פעילות, ארוחה",
                  screen: "עורך הצעה",
                  emoji: "📦",
                },
                {
                  step: "לכל רכיב — בוחר ספק מהמאגר",
                  screen: "עורך הצעה",
                  emoji: "🏛️",
                },
                {
                  step: "עובר לתמחור — מכוונן ⭐⭐⭐ על תחבורה, ⭐⭐⭐⭐⭐ על פעילות",
                  screen: "טאב תמחור",
                  emoji: "💰",
                },
                {
                  step: "רואה רווח 22% — מרוצה!",
                  screen: "טאב תמחור",
                  emoji: "✅",
                },
                {
                  step: '"צור גרסת הצעה" → V1.0 נוצרה',
                  screen: "Modal",
                  emoji: "📄",
                },
                { step: "שולח קישור ללקוח", screen: "עורך הצעה", emoji: "📤" },
                {
                  step: "הלקוח פותח — רואה עמוד יפהפה",
                  screen: "תצוגת לקוח",
                  emoji: "🌐",
                },
                {
                  step: 'הלקוח לוחץ "אישור הזמנה" — סוף!',
                  screen: "תצוגת לקוח",
                  emoji: "🎉",
                },
              ].map((s, i) => (
                <div className="flex items-start gap-3" key={i}>
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff8c00]/10 text-[14px]">
                      {s.emoji}
                    </div>
                    {i < 10 && <div className="h-4 w-0.5 bg-[#e7e1da]" />}
                  </div>
                  <div className="pb-1">
                    <span
                      className="text-[#181510] text-[13px]"
                      style={{ fontWeight: 500 }}
                    >
                      {s.step}
                    </span>
                    <span className="mr-2 text-[#8d785e] text-[11px]">
                      ({s.screen})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Journey 2 */}
          <div className="mb-6 rounded-2xl border border-[#e7e1da] bg-white p-6">
            <h3
              className="mb-4 text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              📥 מסע 2: הוספת 200 ספקים מאקסל
            </h3>
            <div className="space-y-0">
              {[
                {
                  step: 'נכנס לבנק ספקים → "הוספת ספק" → "ייבוא מאקסל"',
                  emoji: "🏛️",
                },
                { step: "מעלה קובץ אקסל עם 200 ספקים", emoji: "📤" },
                { step: "מתאים עמודות: שם = A, קטגוריה = B...", emoji: "🔀" },
                { step: '"בדוק כפילויות" → 15 כפילויות נמצאו', emoji: "⚠️" },
                { step: 'לכל כפילות: "מזג" / "התעלם"', emoji: "🔍" },
                {
                  step: '"ייבא הכל" → 142 ספקים נכנסו, 60 בלי קטגוריה',
                  emoji: "📥",
                },
                { step: "עובר לאשף סיווג → מסווג 12 ספקים בשעה", emoji: "🔬" },
                { step: "אחרי שעה: כל הספקים מסווגים ומוכנים!", emoji: "🎉" },
              ].map((s, i) => (
                <div className="flex items-start gap-3" key={i}>
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22c55e]/10 text-[14px]">
                      {s.emoji}
                    </div>
                    {i < 7 && <div className="h-4 w-0.5 bg-[#e7e1da]" />}
                  </div>
                  <div className="pb-1">
                    <span
                      className="text-[#181510] text-[13px]"
                      style={{ fontWeight: 500 }}
                    >
                      {s.step}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Roadmap ── */}
        <Section id="roadmap">
          <h2
            className="mb-6 flex items-center gap-3 text-[#181510] text-[28px]"
            style={{ fontWeight: 800 }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f59e0b]/10 text-[20px]">
              🗓️
            </span>
            מה מוכן ומה בדרך
          </h2>

          {/* Ready now */}
          <div className="mb-6 rounded-2xl border border-[#22c55e]/20 bg-[#22c55e]/5 p-6">
            <h3
              className="mb-4 flex items-center gap-2 text-[#22c55e] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              <Check size={20} /> מוכן עכשיו (MVP)
            </h3>
            <div className="grid gap-2 md:grid-cols-2">
              {[
                "לוח בקרה עם כל הנתונים",
                "רשימת פרויקטים + חיפוש/סינון",
                "עורך הצעה עם 3 טאבים + תמחור דינמי",
                "בנק ספקים + מפה אינטראקטיבית",
                "כרטיס ספק עם 5 טאבים",
                "עמוד הצעה ללקוח (מותאם לנייד)",
                "אשף ייבוא + זיהוי כפילויות",
                "אשף סיווג עם המלצה חכמה",
                "מוצרים סרוקים — אישור/הסרה",
                "מערכת התראות (5 סוגים)",
                "ניווט + Breadcrumbs צבעוניים",
                "עיצוב RTL מלא בעברית",
              ].map((item, i) => (
                <div className="flex items-center gap-2" key={i}>
                  <Check className="shrink-0 text-[#22c55e]" size={14} />
                  <span className="text-[#181510] text-[13px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coming next */}
          <div className="mb-6 rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-6">
            <h3
              className="mb-4 text-[#3b82f6] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              🔜 שלב הבא (V1.1)
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                {
                  e: "🔐",
                  t: "התחברות משתמשים",
                  d: "אימייל/סיסמה, הפרדת מפיק-לקוח",
                },
                {
                  e: "💾",
                  t: "שמירת נתונים",
                  d: "חיבור לבסיס נתונים — כל השינויים נשמרים",
                },
                {
                  e: "📁",
                  t: "ניהול מסמכים",
                  d: "העלאת קבצים, תזכורות פג תוקף",
                },
                {
                  e: "👥",
                  t: "ניהול לקוחות",
                  d: "מסך ייעודי + היסטוריית הזמנות",
                },
                { e: "📅", t: "יומן", d: "לוח זמנים שבועי/חודשי" },
                { e: "🖨️", t: "הדפסה/PDF", d: "ייצוא הצעת מחיר ל-PDF" },
              ].map((item, i) => (
                <div
                  className="flex items-start gap-3 rounded-xl border border-[#e7e1da] bg-white p-3"
                  key={i}
                >
                  <span className="text-[20px]">{item.e}</span>
                  <div>
                    <div
                      className="text-[#181510] text-[13px]"
                      style={{ fontWeight: 600 }}
                    >
                      {item.t}
                    </div>
                    <div className="text-[#8d785e] text-[12px]">{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Future */}
          <div className="rounded-2xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 p-6">
            <h3
              className="mb-4 text-[#8b5cf6] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              🚀 עתיד רחוק (V2.0)
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                "💬 צ'אט עם ספקים",
                "💳 תשלומים וחשבוניות",
                "🤖 סריקת אתרים אוטומטית",
                "📊 דוחות מתקדמים",
              ].map((f, i) => (
                <div
                  className="rounded-xl border border-[#8b5cf6]/20 bg-white px-4 py-2 text-[#8b5cf6] text-[13px]"
                  key={i}
                  style={{ fontWeight: 500 }}
                >
                  {f}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Footer ── */}
        <div className="mt-10 border-[#e7e1da] border-t py-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff8c00] text-[14px] text-white">
              ✈
            </div>
            <span
              className="text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              TravelPro
            </span>
          </div>
          <p className="text-[#8d785e] text-[14px]">
            מסמך אפיון מוצר | גרסה MVP 1.0 | פברואר 2026
          </p>
          <p className="mt-1 text-[#c4b89a] text-[13px]">
            יום כיף — ערן לוי הפקת אירועים
          </p>
        </div>
      </div>
    </div>
  );
}
