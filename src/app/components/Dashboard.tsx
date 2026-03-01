import { dashboardApi, projectsApi } from './api';
import type { DashboardStats } from './api';
import type { Project } from './data';
import { useAuth } from './AuthContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import {
  CalendarDays, FileText, UserPlus,
  MoreVertical, ChevronLeft, ChevronRight,
  CheckCircle, MessageSquare, Clock, AlertCircle,
  Calendar, ShieldAlert, MapPin, Briefcase,
  TrendingUp, Zap, Target, BookOpen, Loader2
} from 'lucide-react';

// ─── useCountUp hook ───
function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const started = useRef(false);
  const targetRef = useRef(target);
  targetRef.current = target;

  const animate = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * targetRef.current));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) { animate(); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) animate(); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  // Also update value if target changes after animation
  useEffect(() => {
    if (started.current) setValue(target);
  }, [target]);

  return { value, ref };
}

// ─── Sparkline data (trends) ───
const sparkData = {
  leads:    [5, 7, 6, 9, 8, 11, 12].map((v) => ({ v })),
  quotes:   [50, 48, 52, 47, 44, 46, 45].map((v) => ({ v })),
  projects: [20, 22, 24, 23, 26, 27, 28].map((v) => ({ v })),
  events:   [6, 7, 5, 8, 9, 7, 8].map((v) => ({ v })),
};
const sparkKeys = ['leads', 'quotes', 'projects', 'events'] as const;

// ─── Ticker Messages ───
const tickerMessages = [
  '  ספק "הסעות מסיילי הצפון" אישר הזמנה לפרויקט 4829-24',
  '  הצעת מחיר #4832 אושרה על ידי מדיה-וורקס — ₪180,000',
  '  3 מסמכי ביטוח עומדים לפוג תוקף השבוע',
  '  ספק חדש "קייטרינג שף דוד" נוסף למאגר — דירוג 4.8',
  '  עדכון מחירי תחבורה לרבעון Q2 — +8% ממוצע ארצי',
  '  פרויקט "כנס מכירות Q1" עבר לסטטוס ביצוע',
];

// ─── Activity Feed ───
const activityItems = [
  {
    id: '1',
    title: 'תשלום התקבל',
    subtitle: 'חברת סולארו - 45,000 ₪',
    time: 'לפני שעה',
    iconColor: '#16A34A',
    iconBg: '#f0fdf4',
    icon: CheckCircle,
  },
  {
    id: '2',
    title: 'הודעה חדשה מהספק',
    subtitle: 'מלון דן - "אישרנו את כמות החדרים"',
    time: 'לפני שעתיים',
    iconColor: '#2563EB',
    iconBg: '#eff6ff',
    icon: MessageSquare,
  },
  {
    id: '3',
    title: 'עדכון לו"ז',
    subtitle: "פרויקט גיבוש דרום - שונה ליום ד'",
    time: 'אתמול',
    iconColor: '#EA580C',
    iconBg: '#fff7ed',
    icon: Clock,
  },
];

// ─── Progress Ring Component ───
function ProgressRing({ percent, size = 160, strokeWidth = 12 }: { percent: number; size?: number; strokeWidth?: number }) {
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
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#ece8e3"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 3s cubic-bezier(0.25,0.46,0.45,0.94)' }}
      />
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Stat card config builder ───
interface StatCardConfig {
  label: string;
  value: number;
  change: string;
  changePositive: boolean | null;
  iconBg: string;
  iconColor: string;
  sparkColor: string;
  icon: typeof UserPlus;
  link: string;
}

function buildStatsCards(stats: DashboardStats | null): StatCardConfig[] {
  if (!stats) {
    return [
      { label: 'לידים חדשים', value: 0, change: '-', changePositive: null, iconBg: 'rgba(255,140,0,0.1)', iconColor: '#FF8C00', sparkColor: '#FF8C00', icon: UserPlus, link: '/projects' },
      { label: 'הצעות שנשלחו', value: 0, change: '-', changePositive: null, iconBg: '#EFF6FF', iconColor: '#3B82F6', sparkColor: '#3B82F6', icon: FileText, link: '/projects' },
      { label: 'פרויקטים מאושרים', value: 0, change: '-', changePositive: null, iconBg: '#FAF5FF', iconColor: '#A855F7', sparkColor: '#A855F7', icon: CheckCircle, link: '/projects' },
      { label: 'סה"כ פרויקטים', value: 0, change: '-', changePositive: null, iconBg: '#FFF7ED', iconColor: '#EA580C', sparkColor: '#EA580C', icon: CalendarDays, link: '/projects' },
    ];
  }
  return [
    {
      label: 'לידים חדשים',
      value: stats.projects.leads,
      change: stats.projects.leads > 0 ? `${stats.projects.leads} פעילים` : '0',
      changePositive: stats.projects.leads > 0 ? true : null,
      iconBg: 'rgba(255,140,0,0.1)',
      iconColor: '#FF8C00',
      sparkColor: '#FF8C00',
      icon: UserPlus,
      link: '/projects',
    },
    {
      label: 'הצעות שנשלחו',
      value: stats.projects.quotesSent + stats.projects.building,
      change: stats.projects.building > 0 ? `${stats.projects.building} בבנייה` : '-',
      changePositive: null,
      iconBg: '#EFF6FF',
      iconColor: '#3B82F6',
      sparkColor: '#3B82F6',
      icon: FileText,
      link: '/projects',
    },
    {
      label: 'פרויקטים מאושרים',
      value: stats.projects.approved,
      change: stats.projects.approved > 0 ? 'מאושרים' : '-',
      changePositive: stats.projects.approved > 0 ? true : null,
      iconBg: '#FAF5FF',
      iconColor: '#A855F7',
      sparkColor: '#A855F7',
      icon: CheckCircle,
      link: '/projects',
    },
    {
      label: 'סה"כ פרויקטים',
      value: stats.projects.total,
      change: `${stats.suppliers.total} ספקים`,
      changePositive: null,
      iconBg: '#FFF7ED',
      iconColor: '#EA580C',
      sparkColor: '#EA580C',
      icon: CalendarDays,
      link: '/projects',
    },
  ];
}

function buildPipelineStages(stats: DashboardStats | null) {
  if (!stats) return [];
  return [
    { label: 'לידים', value: stats.projects.leads, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'בניית הצעה', value: stats.projects.building, color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'נשלחו ללקוח', value: stats.projects.quotesSent, color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'אושרו', value: stats.projects.approved, color: '#22C55E', bg: '#F0FDF4' },
    { label: 'בביצוע', value: stats.projects.inProgress, color: '#FF8C00', bg: '#FFF7ED' },
  ];
}

// ─── Animated Stat Card ───
function StatCard({ stat, index, sparkKey }: { stat: StatCardConfig; index: number; sparkKey: typeof sparkKeys[number] }) {
  const navigate = useNavigate();
  const counter = useCountUp(stat.value, 1600 + index * 200);
  const Icon = stat.icon;

  const changeBg =
    stat.changePositive === true ? '#f0fdf4'
    : stat.changePositive === false ? '#fef2f2'
    : '#f5f3f0';
  const changeColor =
    stat.changePositive === true ? '#078810'
    : stat.changePositive === false ? '#e71008'
    : '#8d785e';

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => navigate(stat.link)}
      className="bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-5 pb-2 flex flex-col gap-1 text-right hover:shadow-lg hover:border-[#d4cdc3] hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden group"
    >
      <div className="flex items-start justify-between">
        <span
          className="px-2 py-1 rounded text-[12px]"
          style={{ backgroundColor: changeBg, color: changeColor, fontWeight: 700 }}
        >
          {stat.change}
        </span>
        <div
          className="w-[34px] h-[36px] rounded-lg flex items-center justify-center"
          style={{ backgroundColor: stat.iconBg }}
        >
          <Icon size={18} style={{ color: stat.iconColor }} />
        </div>
      </div>
      <p className="text-[14px] text-[#8d785e] mt-1">{stat.label}</p>
      <p
        ref={counter.ref as React.Ref<HTMLParagraphElement>}
        className="text-[30px] text-[#181510] leading-[36px]"
        style={{ fontWeight: 700 }}
      >
        {counter.value}
      </p>
      <div className="h-[36px] -mx-2 mt-1 opacity-60 group-hover:opacity-100 transition-opacity" style={{ minWidth: 0, minHeight: 36 }}>
        <ResponsiveContainer width="100%" height={36} minWidth={50}>
          <LineChart data={sparkData[sparkKey]}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={stat.sparkColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={2000}
              animationBegin={600 + index * 150}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.button>
  );
}

// ─── Pipeline Stage with animation ───
function PipelineStage({ stage, index, maxVal }: { stage: { label: string; value: number; color: string; bg: string }; index: number; maxVal: number }) {
  const counter = useCountUp(stage.value, 1400);
  const widthPercent = maxVal > 0 ? Math.max((stage.value / maxVal) * 100, 18) : 18;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
      className="flex items-center gap-3"
    >
      <div className="w-[90px] text-left shrink-0">
        <span className="text-[12px] text-[#8d785e]" style={{ fontWeight: 500 }}>{stage.label}</span>
      </div>
      <div className="flex-1 h-[32px] bg-[#f5f3f0] rounded-lg overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${widthPercent}%` }}
          transition={{ duration: 1.2, delay: 0.5 + index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full rounded-lg flex items-center justify-end px-3"
          style={{ backgroundColor: stage.color + '20', borderRight: `3px solid ${stage.color}` }}
        >
          <span
            ref={counter.ref as React.Ref<HTMLSpanElement>}
            className="text-[13px]"
            style={{ color: stage.color, fontWeight: 700 }}
          >
            {counter.value}
          </span>
        </motion.div>
      </div>
      {index < 4 && <ChevronLeft size={14} className="text-[#ddd6cb] shrink-0" />}
      {index === 4 && <div className="w-[14px] shrink-0" />}
    </motion.div>
  );
}

// ─── Urgent project card builder ───
function buildUrgentTasks(projects: Project[]) {
  const urgent: { id: string; title: string; badge: string | null; badgeColor: string; badgeBg: string; detail: string; detailColor: string; detailIcon: typeof CalendarDays; borderColor: string; action: string; actionPrimary: boolean; cardIcon: typeof Briefcase }[] = [];

  for (const p of projects) {
    if (p.status === 'מחיר בהערכה') {
      urgent.push({
        id: p.id, title: `${p.name} — ${p.client}`, badge: 'דחוף', badgeColor: '#dc2626', badgeBg: '#fef2f2',
        detail: 'מחיר בהערכה', detailColor: '#8d785e', detailIcon: CalendarDays, borderColor: '#ef4444',
        action: 'עדכון תקציב', actionPrimary: true, cardIcon: Briefcase,
      });
    } else if (p.status === 'ליד חדש' && p.totalPrice === 0) {
      urgent.push({
        id: p.id, title: `${p.name} — ${p.client}`, badge: 'ליד חדש', badgeColor: '#2563eb', badgeBg: '#eff6ff',
        detail: 'טרם נבנתה הצעה', detailColor: '#8d785e', detailIcon: FileText, borderColor: '#3b82f6',
        action: 'בנה הצעה', actionPrimary: true, cardIcon: UserPlus,
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, projectsData] = await Promise.all([
          dashboardApi.stats(),
          projectsApi.list(),
        ]);
        setStats(statsData);
        setProjects(projectsData);
      } catch (err) {
        console.error('[Dashboard] Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statsCards = buildStatsCards(stats);
  const pipelineStages = buildPipelineStages(stats);
  const pipelineMax = Math.max(...pipelineStages.map(s => s.value), 1);

  // Revenue — calculate from live projects
  const revenueTarget = 500000;
  const revenueCurrent = stats?.revenue.total ?? 0;
  const avgMargin = stats?.revenue.avgMargin ?? 0;
  const revenueProfit = Math.round(revenueCurrent * (avgMargin / 100));
  const revenuePercent = revenueTarget > 0 ? Math.round((revenueCurrent / revenueTarget) * 100) : 0;
  const profitMargin = revenueCurrent > 0 ? avgMargin : 0;

  const revenueCounter = useCountUp(revenueCurrent, 3200);
  const profitCounter = useCountUp(revenueProfit, 3200);
  const percentCounter = useCountUp(revenuePercent, 3200);

  // Urgent tasks from real projects
  const urgentTasks = buildUrgentTasks(projects);

  // Pipeline conversion
  const leadsCount = stats?.projects.leads ?? 0;
  const inProgressCount = stats?.projects.inProgress ?? 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-[#ff8c00] mb-3" />
        <p className="text-[14px] text-[#8d785e]">טוען נתוני דשבורד...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 w-full" dir="rtl">

      {/* ══════════ Welcome Section ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1
            className="text-[30px] text-[#181510] tracking-[-0.75px]"
            style={{ fontWeight: 600 }}
          >
            לוח בקרה - מפיק אירועים
          </h1>
          <p className="text-[16px] text-[#8d785e] mt-1">
            בוקר טוב, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'משתמש'}. הנה מה שקורה היום בפרויקטים שלך.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => navigate('/prd')}
            className="flex items-center gap-1.5 border border-[#e7e1da] hover:bg-[#f5f3f0] text-[#181510] px-4 py-[9px] rounded-lg transition-all text-[14px]"
            style={{ fontWeight: 600 }}
          >
            <BookOpen size={15} />
            ניהול מוצר
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="bg-[#ff8c00] hover:bg-[#e67e00] text-white px-4 py-[9px] rounded-lg shadow-sm transition-all text-[14px]"
            style={{ fontWeight: 600 }}
          >
            הוספת ליד
          </button>
        </div>
      </motion.div>

      {/* ══════════ Ticker / Marquee ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative overflow-hidden rounded-xl h-[44px] flex items-center border border-[#e7e1da] bg-gradient-to-l from-[#fffaf3] via-white to-[#fffaf3]"
        dir="ltr"
      >
        <div className="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex items-center gap-1.5 px-4 shrink-0 z-20 border-l border-[#e7e1da] h-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff8c00] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff8c00]" />
          </span>
          <span className="text-[11px] text-[#ff8c00] whitespace-nowrap tracking-wider" style={{ fontWeight: 800 }}>LIVE</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div
            className="flex items-center whitespace-nowrap"
            style={{ animation: 'tickerScroll 80s linear infinite', direction: 'rtl' }}
          >
            {[...tickerMessages, ...tickerMessages].map((msg, i) => (
              <span key={i} className="inline-flex items-center">
                <span className="text-[13px] text-[#3d3426] px-5" style={{ fontWeight: 500 }}>{msg}</span>
                <span className="w-1 h-1 rounded-full bg-[#ddd6cb] shrink-0" />
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} sparkKey={sparkKeys[index]} />
        ))}
      </div>

      {/* ══════════ Pipeline + Revenue Ring ══════════ */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Pipeline Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:flex-[2] bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6 min-w-0"
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-[#ff8c00]" />
            <h2 className="text-[18px] text-[#181510]" style={{ fontWeight: 600 }}>
              {'משפך פרויקטים'}
            </h2>
            <span className="text-[12px] text-[#8d785e] bg-[#f5f3f0] px-2 py-0.5 rounded-full mr-2" style={{ fontWeight: 600 }}>
              נתונים חיים
            </span>
          </div>
          <div className="space-y-3">
            {pipelineStages.map((stage, i) => (
              <PipelineStage key={stage.label} stage={stage} index={i} maxVal={pipelineMax} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#f5f3f0] flex items-center gap-2">
            <span className="text-[12px] text-[#8d785e]">שיעור המרה כולל:</span>
            <span className="text-[14px] text-[#22c55e]" style={{ fontWeight: 700 }}>
              {leadsCount > 0 ? Math.round((inProgressCount / leadsCount) * 100) : 0}%
            </span>
            <span className="text-[11px] text-[#8d785e]">(לידים → ביצוע)</span>
          </div>
        </motion.div>

        {/* Revenue Progress Ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="lg:flex-1 bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6 flex flex-col items-center justify-center min-w-0"
        >
          <div className="flex items-center gap-2 mb-4 self-start">
            <Target size={18} className="text-[#ff8c00]" />
            <h2 className="text-[18px] text-[#181510]" style={{ fontWeight: 600 }}>
              הכנסות
            </h2>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <ProgressRing percent={revenuePercent} size={160} strokeWidth={14} />
            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
              <span
                ref={percentCounter.ref as React.Ref<HTMLSpanElement>}
                className="text-[32px] text-[#181510]"
                style={{ fontWeight: 800 }}
              >
                {percentCounter.value}%
              </span>
              <span className="text-[12px] text-[#8d785e]">מהיעד</span>
            </div>
          </div>

          <div className="w-full mt-4 space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#8d785e]">הכנסות מפרויקטים</span>
              <span
                ref={revenueCounter.ref as React.Ref<HTMLSpanElement>}
                className="text-[#181510]"
                style={{ fontWeight: 700 }}
              >
                ₪{revenueCounter.value.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#8d785e]">רווח משוער</span>
              <span
                ref={profitCounter.ref as React.Ref<HTMLSpanElement>}
                className="text-[#22c55e]"
                style={{ fontWeight: 700 }}
              >
                ₪{profitCounter.value.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#8d785e]">שולי רווח ממוצעים</span>
              <span className="text-[#8d785e]" style={{ fontWeight: 600 }}>
                {profitMargin}%
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#8d785e]">יעד חודשי</span>
              <span className="text-[#8d785e]" style={{ fontWeight: 600 }}>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex items-center gap-2"
          >
            <div className="w-1 h-[18px] bg-[#ef4444] rounded-sm" />
            <h2 className="text-[20px] text-[#181510]" style={{ fontWeight: 600 }}>
              פרויקטים שדורשים טיפול
            </h2>
          </motion.div>

          <div className="space-y-4">
            {urgentTasks.map((task, index) => {
              const CardIcon = task.cardIcon;
              const DetailIcon = task.detailIcon;
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.65 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-md transition-shadow"
                  style={{
                    border: `1px solid ${task.borderColor}`,
                    borderRight: `4px solid ${task.borderColor}`,
                  }}
                >
                  <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-lg bg-[#f5f3f0] flex items-center justify-center shrink-0">
                        <CardIcon size={18} className="text-[#8d785e]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[18px] text-[#181510]" style={{ fontWeight: 600 }}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span
                            className="flex items-center gap-1 text-[12px]"
                            style={{ color: task.detailColor }}
                          >
                            <DetailIcon size={12} />
                            {task.detail}
                          </span>
                          {task.badge && (
                            <span
                              className="text-[12px] px-2.5 py-0.5 rounded-full"
                              style={{
                                backgroundColor: task.badgeBg,
                                color: task.badgeColor,
                                fontWeight: 600,
                                letterSpacing: '0.6px',
                              }}
                            >
                              {task.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => navigate(`/projects/${task.id}`)}
                        className={`text-[12px] px-4 py-2 rounded transition-colors ${
                          task.actionPrimary
                            ? 'bg-[#ff8c00] text-white hover:bg-[#e67e00]'
                            : 'bg-[#f5f3f0] text-[#181510] hover:bg-[#ece8e3]'
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        {task.action}
                      </button>
                      <button
                        onClick={() => navigate(`/projects/${task.id}`)}
                        className="p-2 rounded-lg hover:bg-[#f5f3f0] transition-colors text-[#8d785e]"
                        title="אפשרויות נוספות"
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
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Weekly Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="lg:flex-[2] space-y-4 min-w-0"
        >
          <div className="flex items-center gap-2 px-1">
            <h2 className="text-[20px] text-[#181510]" style={{ fontWeight: 600 }}>
              לוח זמנים שבועי
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#f5f3f0]">
              <button onClick={() => navigate('/calendar')} className="text-[12px] text-[#ff8c00]" style={{ fontWeight: 600 }}>
                צפה בכל היומן
              </button>
              <div className="flex items-center gap-2">
                <span
                  className="text-[14px] text-[#181510] px-2"
                  style={{ fontWeight: 700 }}
                >
                  16-22 בפברואר, 2026
                </span>
                <button className="w-8 h-8 bg-[#f5f3f0] rounded-lg flex items-center justify-center hover:bg-[#ece8e3] transition-colors">
                  <ChevronRight size={14} className="text-[#181510]" />
                </button>
                <button className="w-8 h-8 bg-[#f5f3f0] rounded-lg flex items-center justify-center hover:bg-[#ece8e3] transition-colors">
                  <ChevronLeft size={14} className="text-[#181510]" />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-20 bg-[#fdfcfb]">
              <Calendar size={27} className="text-[#e7e1da] mb-2" strokeWidth={1.5} />
              <p className="text-[14px] text-[#8d785e]">
                אין אירועים נוספים להצגה בשבוע זה
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="lg:flex-1 space-y-4 min-w-0"
        >
          <div className="flex items-center gap-2 px-1">
            <h2 className="text-[20px] text-[#181510]" style={{ fontWeight: 600 }}>
              פעילות אחרונה
            </h2>
          </div>

          <div className="bg-white rounded-xl border border-[#e7e1da] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6">
            <div className="space-y-6">
              {activityItems.map((item, idx) => {
                const ActivityIcon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 1.05 + idx * 0.1 }}
                    className="flex gap-3 items-start"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: item.iconBg }}
                      >
                        <ActivityIcon size={15} style={{ color: item.iconColor }} />
                      </div>
                      {idx < activityItems.length - 1 && (
                        <div className="w-0.5 flex-1 min-h-[24px] bg-[#f5f3f0] mt-1.5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>
                        {item.title}
                      </p>
                      <p className="text-[12px] text-[#8d785e] truncate">{item.subtitle}</p>
                      <p className="text-[11px] text-[#c4b89a] mt-0.5">{item.time}</p>
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