import { useQuery } from "convex/react";
import {
  Briefcase,
  Calendar,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  MessageSquare,
  MoreVertical,
  Target,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "./AuthContext";

// ─── Types ───
interface DashboardStats {
  projects: {
    total: number;
    leads: number;
    building: number;
    quotesSent: number;
    approved: number;
    pricing: number;
    inProgress: number;
  };
  revenue: { total: number; avgMargin: number };
  suppliers: {
    total: number;
    verified: number;
    pending: number;
    unverified: number;
  };
}

interface Project {
  client: string;
  company: string;
  date: string;
  id: string;
  name: string;
  participants: number;
  pricePerPerson: number;
  profitMargin: number;
  region: string;
  status: string;
  statusColor: string;
  totalPrice: number;
}

// ─── useCountUp hook ───
function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const started = useRef(false);
  const targetRef = useRef(target);
  targetRef.current = target;

  const animate = useCallback(() => {
    if (started.current) {
      return;
    }
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
      setValue(Math.round(eased * targetRef.current));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      animate();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  // Also update value if target changes after animation
  useEffect(() => {
    if (started.current) {
      setValue(target);
    }
  }, [target]);

  return { value, ref };
}

// ─── Sparkline data (trends) ───
const sparkData = {
  leads: [5, 7, 6, 9, 8, 11, 12].map((v) => ({ v })),
  quotes: [50, 48, 52, 47, 44, 46, 45].map((v) => ({ v })),
  projects: [20, 22, 24, 23, 26, 27, 28].map((v) => ({ v })),
  events: [6, 7, 5, 8, 9, 7, 8].map((v) => ({ v })),
};
const sparkKeys = ["leads", "quotes", "projects", "events"] as const;

// ─── Ticker Messages ───
const tickerMessages = [
  '  ספק "הסעות מסיילי הצפון" אישר הזמנה לפרויקט 4829-24',
  "  הצעת מחיר #4832 אושרה על ידי מדיה-וורקס — ₪180,000",
  "  3 מסמכי ביטוח עומדים לפוג תוקף השבוע",
  '  ספק חדש "קייטרינג שף דוד" נוסף למאגר — דירוג 4.8',
  "  עדכון מחירי תחבורה לרבעון Q2 — +8% ממוצע ארצי",
  '  פרויקט "כנס מכירות Q1" עבר לסטטוס ביצוע',
];

// ─── Activity Feed ───
const activityItems = [
  {
    id: "1",
    title: "תשלום התקבל",
    subtitle: "חברת סולארו - 45,000 ₪",
    time: "לפני שעה",
    iconColor: "#16A34A",
    iconBg: "#f0fdf4",
    icon: CheckCircle,
  },
  {
    id: "2",
    title: "הודעה חדשה מהספק",
    subtitle: 'מלון דן - "אישרנו את כמות החדרים"',
    time: "לפני שעתיים",
    iconColor: "#2563EB",
    iconBg: "#eff6ff",
    icon: MessageSquare,
  },
  {
    id: "3",
    title: 'עדכון לו"ז',
    subtitle: "פרויקט גיבוש דרום - שונה ליום ד'",
    time: "אתמול",
    iconColor: "#EA580C",
    iconBg: "#fff7ed",
    icon: Clock,
  },
];

// ─── Progress Ring Component ───
function ProgressRing({
  percent,
  size = 160,
  strokeWidth = 12,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (percent / 100) * circumference);
    }, 800);
    return () => clearTimeout(timer);
  }, [percent, circumference]);

  return (
    <svg className="-rotate-90 transform" height={size} width={size}>
      <title>Decorative icon</title>
      <circle
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        stroke="#ece8e3"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        stroke="url(#ringGradient)"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        style={{
          transition: "stroke-dashoffset 3s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      />
      <defs>
        <linearGradient id="ringGradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Stat card config builder ───
interface StatCardConfig {
  change: string;
  changePositive: boolean | null;
  icon: typeof UserPlus;
  iconBg: string;
  iconColor: string;
  label: string;
  link: string;
  sparkColor: string;
  value: number;
}

function buildStatsCards(stats: DashboardStats | null): StatCardConfig[] {
  if (!stats) {
    return [
      {
        label: "לידים חדשים",
        value: 0,
        change: "-",
        changePositive: null,
        iconBg: "rgba(255,140,0,0.1)",
        iconColor: "#FF8C00",
        sparkColor: "#FF8C00",
        icon: UserPlus,
        link: "/projects",
      },
      {
        label: "הצעות שנשלחו",
        value: 0,
        change: "-",
        changePositive: null,
        iconBg: "#EFF6FF",
        iconColor: "#3B82F6",
        sparkColor: "#3B82F6",
        icon: FileText,
        link: "/projects",
      },
      {
        label: "פרויקטים מאושרים",
        value: 0,
        change: "-",
        changePositive: null,
        iconBg: "#FAF5FF",
        iconColor: "#A855F7",
        sparkColor: "#A855F7",
        icon: CheckCircle,
        link: "/projects",
      },
      {
        label: 'סה"כ פרויקטים',
        value: 0,
        change: "-",
        changePositive: null,
        iconBg: "#FFF7ED",
        iconColor: "#EA580C",
        sparkColor: "#EA580C",
        icon: CalendarDays,
        link: "/projects",
      },
    ];
  }
  return [
    {
      label: "לידים חדשים",
      value: stats.projects.leads,
      change: stats.projects.leads > 0 ? `${stats.projects.leads} פעילים` : "0",
      changePositive: stats.projects.leads > 0 ? true : null,
      iconBg: "rgba(255,140,0,0.1)",
      iconColor: "#FF8C00",
      sparkColor: "#FF8C00",
      icon: UserPlus,
      link: "/projects",
    },
    {
      label: "הצעות שנשלחו",
      value: stats.projects.quotesSent + stats.projects.building,
      change:
        stats.projects.building > 0 ? `${stats.projects.building} בבנייה` : "-",
      changePositive: null,
      iconBg: "#EFF6FF",
      iconColor: "#3B82F6",
      sparkColor: "#3B82F6",
      icon: FileText,
      link: "/projects",
    },
    {
      label: "פרויקטים מאושרים",
      value: stats.projects.approved,
      change: stats.projects.approved > 0 ? "מאושרים" : "-",
      changePositive: stats.projects.approved > 0 ? true : null,
      iconBg: "#FAF5FF",
      iconColor: "#A855F7",
      sparkColor: "#A855F7",
      icon: CheckCircle,
      link: "/projects",
    },
    {
      label: 'סה"כ פרויקטים',
      value: stats.projects.total,
      change: `${stats.suppliers.total} ספקים`,
      changePositive: null,
      iconBg: "#FFF7ED",
      iconColor: "#EA580C",
      sparkColor: "#EA580C",
      icon: CalendarDays,
      link: "/projects",
    },
  ];
}

function buildPipelineStages(stats: DashboardStats | null) {
  if (!stats) {
    return [];
  }
  return [
    {
      label: "לידים",
      value: stats.projects.leads,
      color: "#3B82F6",
      bg: "#EFF6FF",
    },
    {
      label: "בניית הצעה",
      value: stats.projects.building,
      color: "#F59E0B",
      bg: "#FFFBEB",
    },
    {
      label: "נשלחו ללקוח",
      value: stats.projects.quotesSent,
      color: "#8B5CF6",
      bg: "#F5F3FF",
    },
    {
      label: "אושרו",
      value: stats.projects.approved,
      color: "#22C55E",
      bg: "#F0FDF4",
    },
    {
      label: "בביצוע",
      value: stats.projects.inProgress,
      color: "#FF8C00",
      bg: "#FFF7ED",
    },
  ];
}

// ─── Animated Stat Card ───
function StatCard({
  stat,
  index,
  sparkKey,
}: {
  stat: StatCardConfig;
  index: number;
  sparkKey: (typeof sparkKeys)[number];
}) {
  const navigate = useNavigate();
  const counter = useCountUp(stat.value, 1600 + index * 200);
  const Icon = stat.icon;

  const changeBg =
    stat.changePositive === true
      ? "#f0fdf4"
      : stat.changePositive === false
        ? "#fef2f2"
        : "#f5f3f0";
  const changeColor =
    stat.changePositive === true
      ? "#078810"
      : stat.changePositive === false
        ? "#e71008"
        : "#8d785e";

  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex cursor-pointer flex-col gap-1 overflow-hidden rounded-xl border border-border bg-card p-5 pb-2 text-right shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:border-tertiary hover:shadow-lg"
      initial={{ opacity: 0, y: 24 }}
      onClick={() => navigate(stat.link)}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className="rounded px-2 py-1 text-[12px]"
          style={{
            backgroundColor: changeBg,
            color: changeColor,
            fontWeight: 700,
          }}
        >
          {stat.change}
        </span>
        <div
          className="flex h-[36px] w-[34px] items-center justify-center rounded-lg"
          style={{ backgroundColor: `color-mix(in srgb, ${stat.iconColor} 15%, var(--card))` }}
        >
          <Icon size={18} style={{ color: stat.iconColor }} />
        </div>
      </div>
      <p className="mt-1 text-[14px] text-muted-foreground">{stat.label}</p>
      <p
        className="text-[30px] text-foreground leading-[36px]"
        ref={counter.ref as React.Ref<HTMLParagraphElement>}
        style={{ fontWeight: 700 }}
      >
        {counter.value}
      </p>
      <div
        className="-mx-2 mt-1 h-[36px] opacity-60 transition-opacity group-hover:opacity-100"
        style={{ minWidth: 0, minHeight: 36 }}
      >
        <ResponsiveContainer height={36} minWidth={50} width="100%">
          <LineChart data={sparkData[sparkKey]}>
            <Line
              animationBegin={600 + index * 150}
              animationDuration={2000}
              dataKey="v"
              dot={false}
              isAnimationActive={true}
              stroke={stat.sparkColor}
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.button>
  );
}

// ─── Pipeline Stage with animation ───
function PipelineStage({
  stage,
  index,
  maxVal,
}: {
  stage: { label: string; value: number; color: string; bg: string };
  index: number;
  maxVal: number;
}) {
  const counter = useCountUp(stage.value, 1400);
  const widthPercent =
    maxVal > 0 ? Math.max((stage.value / maxVal) * 100, 18) : 18;

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
    >
      <div className="w-[90px] shrink-0 text-left">
        <span
          className="text-[12px] text-muted-foreground"
          style={{ fontWeight: 500 }}
        >
          {stage.label}
        </span>
      </div>
      <div className="relative h-[32px] flex-1 overflow-hidden rounded-lg bg-accent">
        <motion.div
          animate={{ width: `${widthPercent}%` }}
          className="flex h-full items-center justify-end rounded-lg px-3"
          initial={{ width: 0 }}
          style={{
            backgroundColor: `${stage.color}20`,
            borderRight: `3px solid ${stage.color}`,
          }}
          transition={{
            duration: 1.2,
            delay: 0.5 + index * 0.12,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <span
            className="text-[13px]"
            ref={counter.ref as React.Ref<HTMLSpanElement>}
            style={{ color: stage.color, fontWeight: 700 }}
          >
            {counter.value}
          </span>
        </motion.div>
      </div>
      {index < 4 && (
        <ChevronLeft className="shrink-0 text-tertiary" size={14} />
      )}
      {index === 4 && <div className="w-[14px] shrink-0" />}
    </motion.div>
  );
}

// ─── Urgent project card builder ───
function buildUrgentTasks(projects: Project[]) {
  const urgent: {
    id: string;
    title: string;
    badge: string | null;
    badgeColor: string;
    badgeBg: string;
    detail: string;
    detailColor: string;
    detailIcon: typeof CalendarDays;
    borderColor: string;
    action: string;
    actionPrimary: boolean;
    cardIcon: typeof Briefcase;
  }[] = [];

  for (const p of projects) {
    if (p.status === "מחיר בהערכה") {
      urgent.push({
        id: p.id,
        title: `${p.name} — ${p.client}`,
        badge: "דחוף",
        badgeColor: "#dc2626",
        badgeBg: "#fef2f2",
        detail: "מחיר בהערכה",
        detailColor: "#8d785e",
        detailIcon: CalendarDays,
        borderColor: "#ef4444",
        action: "עדכון תקציב",
        actionPrimary: true,
        cardIcon: Briefcase,
      });
    } else if (p.status === "ליד חדש" && p.totalPrice === 0) {
      urgent.push({
        id: p.id,
        title: `${p.name} — ${p.client}`,
        badge: "ליד חדש",
        badgeColor: "#2563eb",
        badgeBg: "#eff6ff",
        detail: "טרם נבנתה הצעה",
        detailColor: "#8d785e",
        detailIcon: FileText,
        borderColor: "#3b82f6",
        action: "בנה הצעה",
        actionPrimary: true,
        cardIcon: UserPlus,
      });
    }
  }
  // Limit to 3
  return urgent.slice(0, 3);
}

// ━━━━━━━━━━━━━━━━━━━━━━ MAIN DASHBOARD ━━━━━━━━━━━━━━━━━━━━━━
export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const stats = useQuery(api.dashboard.stats) as DashboardStats | undefined;
  const projects = useQuery(api.projects.list) as Project[] | undefined;

  const loading = stats === undefined || projects === undefined;

  const statsCards = buildStatsCards(stats ?? null);
  const pipelineStages = buildPipelineStages(stats ?? null);
  const pipelineMax = Math.max(...pipelineStages.map((s) => s.value), 1);

  // Revenue — calculate from live projects
  const revenueTarget = 500_000;
  const revenueCurrent = stats?.revenue.total ?? 0;
  const avgMargin = stats?.revenue.avgMargin ?? 0;
  const revenueProfit = Math.round(revenueCurrent * (avgMargin / 100));
  const revenuePercent =
    revenueTarget > 0 ? Math.round((revenueCurrent / revenueTarget) * 100) : 0;
  const profitMargin = revenueCurrent > 0 ? avgMargin : 0;

  const revenueCounter = useCountUp(revenueCurrent, 3200);
  const profitCounter = useCountUp(revenueProfit, 3200);
  const percentCounter = useCountUp(revenuePercent, 3200);

  // Urgent tasks from real projects
  const urgentTasks = buildUrgentTasks(projects ?? []);

  // Pipeline conversion
  const leadsCount = stats?.projects.leads ?? 0;
  const inProgressCount = stats?.projects.inProgress ?? 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="mb-3 animate-spin text-primary" size={32} />
        <p className="text-[14px] text-muted-foreground">
          טוען נתוני דשבורד...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-8" dir="rtl">
      {/* ══════════ Welcome Section ══════════ */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1
            className="text-[30px] text-foreground tracking-[-0.75px]"
            style={{ fontWeight: 600 }}
          >
            לוח בקרה - מפיק אירועים
          </h1>
          <p className="mt-1 text-[16px] text-muted-foreground">
            בוקר טוב, {user?.email?.split("@")[0] || "משתמש"}. הנה מה שקורה היום
            בפרויקטים שלך.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            className="rounded-lg bg-primary px-4 py-[9px] text-[14px] text-white shadow-sm transition-all hover:bg-primary-hover"
            onClick={() => navigate("/projects")}
            style={{ fontWeight: 600 }}
            type="button"
          >
            הוספת ליד
          </button>
        </div>
      </motion.div>

      {/* ══════════ Ticker / Marquee ══════════ */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative flex h-[44px] items-center overflow-hidden rounded-xl border border-border bg-gradient-to-l from-[#fffaf3] via-white to-[#fffaf3]"
        dir="ltr"
        initial={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-14 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-14 bg-gradient-to-l from-white to-transparent" />
        <div className="z-20 flex h-full shrink-0 items-center gap-1.5 border-border border-l px-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span
            className="whitespace-nowrap text-[11px] text-primary tracking-wider"
            style={{ fontWeight: 800 }}
          >
            LIVE
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div
            className="flex items-center whitespace-nowrap"
            style={{
              animation: "tickerScroll 80s linear infinite",
              direction: "rtl",
            }}
          >
            {[...tickerMessages, ...tickerMessages].map((msg, i) => (
              <span className="inline-flex items-center" key={i}>
                <span
                  className="px-5 text-[13px] text-foreground"
                  style={{ fontWeight: 500 }}
                >
                  {msg}
                </span>
                <span className="h-1 w-1 shrink-0 rounded-full bg-border" />
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes tickerScroll {
            0% { transform: translateX(50%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </motion.div>

      {/* ══════════ Stats Grid with Sparklines ══════════ */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <StatCard
            index={index}
            key={stat.label}
            sparkKey={sparkKeys[index]}
            stat={stat}
          />
        ))}
      </div>

      {/* ══════════ Pipeline + Revenue Ring ══════════ */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Pipeline Funnel */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 rounded-xl border border-border bg-card p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:flex-[2]"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp className="text-primary" size={18} />
            <h2
              className="text-[18px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              {"משפך פרויקטים"}
            </h2>
            <span
              className="mr-2 rounded-full bg-accent px-2 py-0.5 text-[12px] text-muted-foreground"
              style={{ fontWeight: 600 }}
            >
              נתונים חיים
            </span>
          </div>
          <div className="space-y-3">
            {pipelineStages.map((stage, i) => (
              <PipelineStage
                index={i}
                key={stage.label}
                maxVal={pipelineMax}
                stage={stage}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 border-accent border-t pt-4">
            <span className="text-[12px] text-muted-foreground">
              שיעור המרה כולל:
            </span>
            <span
              className="text-[14px] text-success"
              style={{ fontWeight: 700 }}
            >
              {leadsCount > 0
                ? Math.round((inProgressCount / leadsCount) * 100)
                : 0}
              %
            </span>
            <span className="text-[11px] text-muted-foreground">
              (לידים → ביצוע)
            </span>
          </div>
        </motion.div>

        {/* Revenue Progress Ring */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:flex-1"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <div className="mb-4 flex items-center gap-2 self-start">
            <Target className="text-primary" size={18} />
            <h2
              className="text-[18px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              הכנסות
            </h2>
          </div>

          <div className="relative my-2 flex items-center justify-center">
            <ProgressRing
              percent={revenuePercent}
              size={160}
              strokeWidth={14}
            />
            <div className="absolute inset-0 flex rotate-0 flex-col items-center justify-center">
              <span
                className="text-[32px] text-foreground"
                ref={percentCounter.ref as React.Ref<HTMLSpanElement>}
                style={{ fontWeight: 800 }}
              >
                {percentCounter.value}%
              </span>
              <span className="text-[12px] text-muted-foreground">מהיעד</span>
            </div>
          </div>

          <div className="mt-4 w-full space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-foreground">הכנסות מפרויקטים</span>
              <span
                className="text-foreground"
                ref={revenueCounter.ref as React.Ref<HTMLSpanElement>}
                style={{ fontWeight: 700 }}
              >
                ₪{revenueCounter.value.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-foreground">רווח משוער</span>
              <span
                className="text-success"
                ref={profitCounter.ref as React.Ref<HTMLSpanElement>}
                style={{ fontWeight: 700 }}
              >
                ₪{profitCounter.value.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-foreground">שולי רווח ממוצעים</span>
              <span
                className="text-muted-foreground"
                style={{ fontWeight: 600 }}
              >
                {profitMargin}%
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-foreground">יעד חודשי</span>
              <span
                className="text-muted-foreground"
                style={{ fontWeight: 600 }}
              >
                ₪{revenueTarget.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══════════ Urgent Tasks ══════════ */}
      {urgentTasks.length > 0 && (
        <div className="space-y-4">
          <motion.div
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="h-[18px] w-1 rounded-sm bg-destructive" />
            <h2
              className="text-[20px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              פרויקטים שדורשים טיפול
            </h2>
          </motion.div>

          <div className="space-y-4">
            {urgentTasks.map((task, index) => {
              const CardIcon = task.cardIcon;
              const DetailIcon = task.detailIcon;
              return (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="overflow-hidden rounded-lg bg-card shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-md"
                  initial={{ opacity: 0, x: 30 }}
                  key={task.id}
                  style={{
                    border: `1px solid ${task.borderColor}`,
                    borderRight: `4px solid ${task.borderColor}`,
                  }}
                  transition={{ duration: 0.45, delay: 0.65 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent">
                        <CardIcon className="text-muted-foreground" size={18} />
                      </div>
                      <div className="space-y-1">
                        <p
                          className="text-[18px] text-foreground"
                          style={{ fontWeight: 600 }}
                        >
                          {task.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                          <span
                            className="flex items-center gap-1 text-[12px]"
                            style={{ color: task.detailColor }}
                          >
                            <DetailIcon size={12} />
                            {task.detail}
                          </span>
                          {task.badge && (
                            <span
                              className="rounded-full px-2.5 py-0.5 text-[12px]"
                              style={{
                                backgroundColor: task.badgeBg,
                                color: task.badgeColor,
                                fontWeight: 600,
                                letterSpacing: "0.6px",
                              }}
                            >
                              {task.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        className={`rounded px-4 py-2 text-[12px] transition-colors ${
                          task.actionPrimary
                            ? "bg-primary text-white hover:bg-primary-hover"
                            : "bg-accent text-foreground hover:bg-accent"
                        }`}
                        onClick={() => navigate(`/projects/${task.id}`)}
                        style={{ fontWeight: 600 }}
                        type="button"
                      >
                        {task.action}
                      </button>
                      <button
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent"
                        onClick={() => navigate(`/projects/${task.id}`)}
                        title="אפשרויות נוספות"
                        type="button"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════ Bottom: Timeline + Activity ══════════ */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Weekly Timeline */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 space-y-4 lg:flex-[2]"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="flex items-center gap-2 px-1">
            <h2
              className="text-[20px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              לוח זמנים שבועי
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-accent border-b px-4 py-4">
              <button
                className="text-[12px] text-primary"
                onClick={() => navigate("/calendar")}
                style={{ fontWeight: 600 }}
                type="button"
              >
                צפה בכל היומן
              </button>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 text-[14px] text-foreground"
                  style={{ fontWeight: 700 }}
                >
                  16-22 בפברואר, 2026
                </span>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent transition-colors hover:bg-accent"
                  type="button"
                >
                  <ChevronRight className="text-foreground" size={14} />
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent transition-colors hover:bg-accent"
                  type="button"
                >
                  <ChevronLeft className="text-foreground" size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-surface py-20">
              <Calendar
                className="mb-2 text-border"
                size={27}
                strokeWidth={1.5}
              />
              <p className="text-[14px] text-muted-foreground">
                אין אירועים נוספים להצגה בשבוע זה
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 space-y-4 lg:flex-1"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="flex items-center gap-2 px-1">
            <h2
              className="text-[20px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              פעילות אחרונה
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="space-y-6">
              {activityItems.map((item, idx) => {
                const ActivityIcon = item.icon;
                return (
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 16 }}
                    key={item.id}
                    transition={{ duration: 0.35, delay: 1.05 + idx * 0.1 }}
                  >
                    <div className="flex shrink-0 flex-col items-center">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: `color-mix(in srgb, ${item.iconColor} 15%, var(--card))` }}
                      >
                        <ActivityIcon
                          size={15}
                          style={{ color: item.iconColor }}
                        />
                      </div>
                      {idx < activityItems.length - 1 && (
                        <div className="mt-1.5 min-h-[24px] w-0.5 flex-1 bg-accent" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="text-[14px] text-foreground"
                        style={{ fontWeight: 600 }}
                      >
                        {item.title}
                      </p>
                      <p className="truncate text-[12px] text-muted-foreground">
                        {item.subtitle}
                      </p>
                      <p className="mt-0.5 text-[11px] text-tertiary">
                        {item.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
