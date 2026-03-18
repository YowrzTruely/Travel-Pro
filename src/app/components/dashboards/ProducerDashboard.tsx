import { useQuery } from "convex/react";
import {
  AlertTriangle,
  Calendar,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  FileText,
  GripVertical,
  Loader2,
  MapPin,
  MessageSquare,
  ShieldAlert,
  Target,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "../AuthContext";
import { regionDisplayLabel } from "../constants/supplierConstants";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { HelpTooltip } from "../ui/HelpTooltip";
import { StatCard } from "./StatCard";

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

  useEffect(() => {
    if (started.current) {
      setValue(target);
    }
  }, [target]);

  return { value, ref };
}

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
        stroke="url(#ringGradientProd)"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        style={{
          transition: "stroke-dashoffset 3s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      />
      <defs>
        <linearGradient id="ringGradientProd" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Pipeline Stage ───
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

// ─── Draggable Widget Wrapper ───
const WIDGET_TYPE = "DASHBOARD_WIDGET";

interface DragItem {
  id: string;
  index: number;
}

function DraggableWidget({
  id,
  index,
  moveWidget,
  children,
}: {
  id: string;
  index: number;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: WIDGET_TYPE,
    item: (): DragItem => ({ id, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: WIDGET_TYPE,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveWidget(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  preview(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.4 : 1, transition: "opacity 0.2s" }}
    >
      <div className="group/drag relative">
        <div
          className="absolute top-3 right-3 z-10 cursor-grab opacity-0 transition-opacity group-hover/drag:opacity-60"
          ref={drag as unknown as React.Ref<HTMLDivElement>}
        >
          <GripVertical className="text-muted-foreground" size={16} />
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Collapsible Section Wrapper ───
function WidgetSection({
  title,
  helpText,
  icon: Icon,
  iconColor,
  defaultOpen = true,
  children,
}: {
  title: string;
  helpText: string;
  icon: React.ElementType;
  iconColor: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible onOpenChange={setIsOpen} open={isOpen}>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="flex w-full items-center justify-between px-6 py-4 text-right transition-colors hover:bg-surface">
          <div className="flex items-center gap-2.5">
            <Icon size={18} style={{ color: iconColor }} />
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2.5" type="button">
                <h2
                  className="text-[18px] text-foreground"
                  style={{ fontWeight: 600 }}
                >
                  {title}
                </h2>
              </button>
            </CollapsibleTrigger>
            <div
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <HelpTooltip text={helpText} />
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <button className="text-muted-foreground" type="button">
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="border-accent border-t px-6 py-5">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// ─── Widget Order ───
const DEFAULT_WIDGET_ORDER = [
  "morningHQ",
  "weeklyCalendar",
  "quoteHeat",
  "urgentAlerts",
  "openReservations",
  "statsCards",
  "pipelineRevenue",
];

function loadWidgetOrder(): string[] {
  try {
    const stored = localStorage.getItem("producer-dashboard-widget-order");
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      // Ensure all default widgets are present
      const missing = DEFAULT_WIDGET_ORDER.filter((w) => !parsed.includes(w));
      return [...parsed, ...missing];
    }
  } catch {
    // ignore
  }
  return DEFAULT_WIDGET_ORDER;
}

function saveWidgetOrder(order: string[]) {
  try {
    localStorage.setItem(
      "producer-dashboard-widget-order",
      JSON.stringify(order)
    );
  } catch {
    // ignore
  }
}

// ─── Sparkline data ───
const sparkData = {
  leads: [5, 7, 6, 9, 8, 11, 12],
  quotes: [50, 48, 52, 47, 44, 46, 45],
  projects: [20, 22, 24, 23, 26, 27, 28],
  events: [6, 7, 5, 8, 9, 7, 8],
};

// ─── Ticker Messages ───
const tickerMessages = [
  '  ספק "הסעות מסיילי הצפון" אישר הזמנה לפרויקט 4829-24',
  "  הצעת מחיר #4832 אושרה על ידי מדיה-וורקס — ₪180,000",
  "  3 מסמכי ביטוח עומדים לפוג תוקף השבוע",
  '  ספק חדש "קייטרינג שף דוד" נוסף למאגר — דירוג 4.8',
  "  עדכון מחירי תחבורה לרבעון Q2 — +8% ממוצע ארצי",
  '  פרויקט "כנס מכירות Q1" עבר לסטטוס ביצוע',
];

// ─── Activity Feed Helpers ───
const ACTION_DISPLAY: Record<
  string,
  { label: string; icon: typeof CheckCircle; iconColor: string; iconBg: string }
> = {
  created: {
    label: "נוצר",
    icon: CheckCircle,
    iconColor: "#16A34A",
    iconBg: "#f0fdf4",
  },
  updated: {
    label: "עודכן",
    icon: FileText,
    iconColor: "#3B82F6",
    iconBg: "#eff6ff",
  },
  deleted: {
    label: "נמחק",
    icon: AlertTriangle,
    iconColor: "#EF4444",
    iconBg: "#fef2f2",
  },
  imported: {
    label: "יובא",
    icon: UserPlus,
    iconColor: "#8B5CF6",
    iconBg: "#f5f3ff",
  },
  sent: {
    label: "נשלח",
    icon: MessageSquare,
    iconColor: "#2563EB",
    iconBg: "#eff6ff",
  },
  approved: {
    label: "אושר",
    icon: CheckCircle,
    iconColor: "#16A34A",
    iconBg: "#f0fdf4",
  },
  status_change: {
    label: "שינוי סטטוס",
    icon: Clock,
    iconColor: "#EA580C",
    iconBg: "#fff7ed",
  },
};

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) {
    return "עכשיו";
  }
  if (minutes < 60) {
    return `לפני ${minutes} דקות`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `לפני ${hours === 1 ? "שעה" : `${hours} שעות`}`;
  }
  const days = Math.floor(hours / 24);
  if (days === 1) {
    return "אתמול";
  }
  return `לפני ${days} ימים`;
}

const ENTITY_TYPE_LABEL: Record<string, string> = {
  project: "פרויקט",
  supplier: "ספק",
  lead: "ליד",
  quote: "הצעה",
  document: "מסמך",
  booking: "שריון",
  invoice: "חשבונית",
};

// ━━━━━━━━━━━━━━━━━━━━ PRODUCER DASHBOARD ━━━━━━━━━━━━━━━━━━━━
export function ProducerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Data queries
  const stats = useQuery(api.dashboard.stats) as DashboardStats | undefined;
  const morningHQ = useQuery(api.dashboard.morningHQ);
  const quoteHeat = useQuery(api.dashboard.quoteHeatMeter);
  const alerts = useQuery(api.dashboard.urgentAlerts);
  const reservations = useQuery(api.dashboard.openReservations);
  const weeklyCalendar = useQuery(api.dashboard.weeklyCalendar);
  const recentActivity = useQuery(api.dashboard.recentActivity);

  const loading = stats === undefined;

  // Widget order state with drag-and-drop reorder
  const [widgetOrder, setWidgetOrder] = useState<string[]>(loadWidgetOrder);

  const moveWidget = useCallback((dragIndex: number, hoverIndex: number) => {
    setWidgetOrder((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, removed);
      saveWidgetOrder(updated);
      return updated;
    });
  }, []);

  // Revenue calculations
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

  // Pipeline
  const pipelineStages = stats
    ? [
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
      ]
    : [];
  const pipelineMax = Math.max(...pipelineStages.map((s) => s.value), 1);

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

  // ─── Widget renderers ───
  const widgets: Record<string, React.ReactNode> = {
    morningHQ: (
      <WidgetSection
        helpText="אירועים המתוכננים להיום ומחר, כולל פרטי ספקים ומשתתפים."
        icon={Calendar}
        iconColor="#ff8c00"
        title="חמ״ל בוקר"
      >
        <MorningHQContent events={morningHQ} navigate={navigate} />
      </WidgetSection>
    ),
    quoteHeat: (
      <WidgetSection
        helpText="סטטוס הצעות מחיר: כמה נשלחו, כמה בדיון, כמה סגורות ואבודות."
        icon={TrendingUp}
        iconColor="#f59e0b"
        title="מד חום הצעות"
      >
        <QuoteHeatContent data={quoteHeat} />
      </WidgetSection>
    ),
    urgentAlerts: (
      <WidgetSection
        helpText="התראות על מסמכים שפגי תוקף, שריונות שעומדים לפוג וחשבוניות חסרות."
        icon={ShieldAlert}
        iconColor="#ef4444"
        title="התראות דחופות"
      >
        <UrgentAlertsContent alerts={alerts} navigate={navigate} />
      </WidgetSection>
    ),
    openReservations: (
      <WidgetSection
        helpText="שריונות פתוחים עם ספקים שצריך לאשר או לחדש."
        icon={Clock}
        iconColor="#8b5cf6"
        title="שריונות פתוחים"
      >
        <OpenReservationsContent
          navigate={navigate}
          reservations={reservations}
        />
      </WidgetSection>
    ),
    weeklyCalendar: (
      <WidgetSection
        helpText="תצוגת לוח שנה שבועית עם אירועים ופרויקטים מתוכננים."
        icon={CalendarDays}
        iconColor="#3b82f6"
        title="לוח שבועי"
      >
        <WeeklyCalendarContent data={weeklyCalendar} navigate={navigate} />
      </WidgetSection>
    ),
    statsCards: (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        <StatCard
          color={{
            icon: "#FF8C00",
            iconBg: "rgba(255,140,0,0.1)",
            spark: "#FF8C00",
          }}
          icon={UserPlus}
          index={0}
          onClick={() => navigate("/projects")}
          sparklineData={sparkData.leads}
          title="לידים חדשים"
          trend={{
            label:
              stats.projects.leads > 0 ? `${stats.projects.leads} פעילים` : "0",
            positive: stats.projects.leads > 0 ? true : null,
          }}
          value={stats.projects.leads}
        />
        <StatCard
          color={{ icon: "#3B82F6", iconBg: "#EFF6FF", spark: "#3B82F6" }}
          icon={FileText}
          index={1}
          onClick={() => navigate("/projects")}
          sparklineData={sparkData.quotes}
          title="הצעות שנשלחו"
          trend={{
            label:
              stats.projects.building > 0
                ? `${stats.projects.building} בבנייה`
                : "-",
            positive: null,
          }}
          value={stats.projects.quotesSent + stats.projects.building}
        />
        <StatCard
          color={{ icon: "#A855F7", iconBg: "#FAF5FF", spark: "#A855F7" }}
          icon={CheckCircle}
          index={2}
          onClick={() => navigate("/projects")}
          sparklineData={sparkData.projects}
          title="פרויקטים מאושרים"
          trend={{
            label: stats.projects.approved > 0 ? "מאושרים" : "-",
            positive: stats.projects.approved > 0 ? true : null,
          }}
          value={stats.projects.approved}
        />
        <StatCard
          color={{ icon: "#EA580C", iconBg: "#FFF7ED", spark: "#EA580C" }}
          icon={CalendarDays}
          index={3}
          onClick={() => navigate("/projects")}
          sparklineData={sparkData.events}
          title='סה"כ פרויקטים'
          trend={{
            label: `${stats.suppliers.total} ספקים`,
            positive: null,
          }}
          value={stats.projects.total}
        />
      </div>
    ),
    pipelineRevenue: (
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
              משפך פרויקטים
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
              (לידים &rarr; ביצוע)
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
                &#8362;{revenueCounter.value.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-foreground">רווח משוער</span>
              <span
                className="text-success"
                ref={profitCounter.ref as React.Ref<HTMLSpanElement>}
                style={{ fontWeight: 700 }}
              >
                &#8362;{profitCounter.value.toLocaleString()}
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
                &#8362;{revenueTarget.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full space-y-6 p-4 sm:space-y-8 sm:p-8" dir="rtl">
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
              בוקר טוב, {user?.email?.split("@")[0] || "משתמש"}. הנה מה שקורה
              היום בפרויקטים שלך.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-lg bg-primary px-4 py-[9px] text-[14px] text-white shadow-sm transition-all hover:bg-primary-hover"
              onClick={() => navigate("/crm?newLead=true")}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <UserPlus size={16} />
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
                <span className="inline-flex items-center" key={`ticker-${i}`}>
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

        {/* ══════════ Draggable Widget Grid ══════════ */}
        {widgetOrder.map((widgetId, index) => {
          const widget = widgets[widgetId];
          if (!widget) {
            return null;
          }
          return (
            <DraggableWidget
              id={widgetId}
              index={index}
              key={widgetId}
              moveWidget={moveWidget}
            >
              {widget}
            </DraggableWidget>
          );
        })}

        {/* ══════════ Bottom: Activity Feed ══════════ */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="min-w-0 space-y-4"
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
            {recentActivity === undefined ? (
              <div className="flex items-center justify-center py-6">
                <Loader2
                  className="animate-spin text-muted-foreground"
                  size={20}
                />
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Clock className="mb-2 text-border" size={24} />
                <p className="text-[14px] text-muted-foreground">
                  אין פעילות אחרונה
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentActivity.map((item, idx) => {
                  const display = ACTION_DISPLAY[item.action] ?? {
                    label: item.action,
                    icon: Clock,
                    iconColor: "#8d785e",
                    iconBg: "#f5f3f0",
                  };
                  const ActivityIcon = display.icon;
                  const entityLabel =
                    ENTITY_TYPE_LABEL[item.entityType] ?? item.entityType;
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
                          style={{ backgroundColor: `color-mix(in srgb, ${display.iconColor} 15%, var(--card))` }}
                        >
                          <ActivityIcon
                            size={15}
                            style={{ color: display.iconColor }}
                          />
                        </div>
                        {idx < recentActivity.length - 1 && (
                          <div className="mt-1.5 min-h-[24px] w-0.5 flex-1 bg-accent" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-[14px] text-foreground"
                          style={{ fontWeight: 600 }}
                        >
                          {display.label} {entityLabel}
                        </p>
                        {item.details && (
                          <p className="truncate text-[12px] text-muted-foreground">
                            {item.details}
                          </p>
                        )}
                        <p className="mt-0.5 text-[11px] text-tertiary">
                          {formatRelativeTime(item.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DndProvider>
  );
}

// ━━━━━━━━━━━━━━━━━━━━ SUB-COMPONENTS ━━━━━━━━━━━━━━━━━━━━

function MorningHQContent({
  events,
  navigate,
}: {
  events:
    | {
        today: string;
        tomorrow: string;
        events: {
          id: string;
          title: string;
          date: string;
          startTime: string | null;
          endTime: string | null;
          type: string | null;
          projectId: string | null;
          participants: number;
          region: string | null;
          projectName: string | null;
        }[];
      }
    | undefined;
  navigate: (path: string) => void;
}) {
  if (!events) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  if (events.events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Calendar className="mb-2 text-border" size={27} strokeWidth={1.5} />
        <p className="text-[14px] text-muted-foreground">
          אין אירועים מתוכננים להיום ומחר
        </p>
      </div>
    );
  }

  const todayEvents = events.events.filter((e) => e.date === events.today);
  const tomorrowEvents = events.events.filter(
    (e) => e.date === events.tomorrow
  );

  return (
    <div className="space-y-4">
      {todayEvents.length > 0 && (
        <div>
          <h3
            className="mb-2 text-[14px] text-primary"
            style={{ fontWeight: 600 }}
          >
            היום
          </h3>
          <div className="space-y-2">
            {todayEvents.map((ev) => (
              <EventRow event={ev} key={ev.id} navigate={navigate} />
            ))}
          </div>
        </div>
      )}
      {tomorrowEvents.length > 0 && (
        <div>
          <h3
            className="mb-2 text-[14px] text-info"
            style={{ fontWeight: 600 }}
          >
            מחר
          </h3>
          <div className="space-y-2">
            {tomorrowEvents.map((ev) => (
              <EventRow event={ev} key={ev.id} navigate={navigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EventRow({
  event,
  navigate,
}: {
  event: {
    id: string;
    title: string;
    startTime: string | null;
    endTime: string | null;
    participants: number;
    region: string | null;
    projectId: string | null;
  };
  navigate: (path: string) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-accent bg-surface px-4 py-3 transition-colors hover:bg-accent">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff7ed]">
          <Calendar className="text-primary" size={16} />
        </div>
        <div>
          <p
            className="text-[14px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            {event.title}
          </p>
          <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
            {event.startTime && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {event.startTime}
                {event.endTime ? `-${event.endTime}` : ""}
              </span>
            )}
            {event.participants > 0 && (
              <span className="flex items-center gap-1">
                <Users size={11} />
                {event.participants} משתתפים
              </span>
            )}
            {event.region && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {regionDisplayLabel(event.region) || event.region}
              </span>
            )}
          </div>
        </div>
      </div>
      {event.projectId && (
        <button
          className="rounded-lg bg-primary px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-primary-hover"
          onClick={() => navigate(`/field/${event.projectId}`)}
          style={{ fontWeight: 600 }}
          type="button"
        >
          פתח חמ״ל
        </button>
      )}
    </div>
  );
}

function QuoteHeatContent({
  data,
}: {
  data:
    | {
        sent: number;
        discussing: number;
        closed: number;
        lost: number;
        total: number;
        closeRate: number;
      }
    | undefined;
}) {
  if (!data) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  const bars = [
    { label: "נשלחו", value: data.sent, color: "#3B82F6" },
    { label: "בדיון", value: data.discussing, color: "#F59E0B" },
    { label: "סגורות", value: data.closed, color: "#22C55E" },
    { label: "אבודות", value: data.lost, color: "#EF4444" },
  ];

  const maxVal = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {bars.map((bar) => (
          <div className="flex items-center gap-3" key={bar.label}>
            <span
              className="w-16 shrink-0 text-left text-[13px] text-muted-foreground"
              style={{ fontWeight: 500 }}
            >
              {bar.label}
            </span>
            <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-accent">
              <motion.div
                animate={{
                  width: `${Math.max((bar.value / maxVal) * 100, 5)}%`,
                }}
                className="flex h-full items-center justify-end rounded-md px-2"
                initial={{ width: 0 }}
                style={{ backgroundColor: `${bar.color}25` }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <span
                  className="text-[12px]"
                  style={{ color: bar.color, fontWeight: 700 }}
                >
                  {bar.value}
                </span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-accent border-t pt-3">
        <span className="text-[12px] text-muted-foreground">שיעור סגירה:</span>
        <span className="text-[16px] text-success" style={{ fontWeight: 700 }}>
          {data.closeRate}%
        </span>
      </div>
    </div>
  );
}

function UrgentAlertsContent({
  alerts,
  navigate,
}: {
  alerts:
    | {
        id: string;
        type: string;
        message: string;
        severity: "red" | "yellow" | "orange";
        link: string;
      }[]
    | undefined;
  navigate: (path: string) => void;
}) {
  if (!alerts) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <CheckCircle className="mb-2 text-success" size={24} />
        <p className="text-[14px] text-muted-foreground">אין התראות דחופות</p>
      </div>
    );
  }

  const severityConfig = {
    red: {
      bg: "#fef2f2",
      border: "#fecaca",
      text: "#dc2626",
      icon: AlertTriangle,
    },
    orange: {
      bg: "#fff7ed",
      border: "#fed7aa",
      text: "#ea580c",
      icon: AlertTriangle,
    },
    yellow: {
      bg: "#fffbeb",
      border: "#fde68a",
      text: "#d97706",
      icon: AlertTriangle,
    },
  };

  return (
    <div className="space-y-2">
      {alerts.slice(0, 8).map((alert) => {
        const config = severityConfig[alert.severity];
        const AlertIcon = config.icon;
        return (
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-right transition-colors hover:opacity-80"
            key={alert.id}
            onClick={() => navigate(alert.link)}
            style={{
              backgroundColor: config.bg,
              border: `1px solid ${config.border}`,
            }}
            type="button"
          >
            <AlertIcon
              size={16}
              style={{ color: config.text, flexShrink: 0 }}
            />
            <span
              className="min-w-0 flex-1 text-[13px]"
              style={{ color: config.text }}
            >
              {alert.message}
            </span>
            <ChevronLeft
              size={14}
              style={{ color: config.text, flexShrink: 0 }}
            />
          </button>
        );
      })}
    </div>
  );
}

function WeeklyCalendarContent({
  data,
  navigate,
}: {
  data:
    | {
        weekStart: string;
        weekEnd: string;
        days: {
          date: string;
          dayName: string;
          events: {
            id: string;
            title: string;
            startTime: string | null;
            type: string | null;
            projectName: string | null;
          }[];
        }[];
      }
    | undefined;
  navigate: (path: string) => void;
}) {
  if (!data) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-7 gap-1">
      {data.days.map((day) => {
        const isToday = day.date === today;
        const hasEvents = day.events.length > 0;
        return (
          <button
            className={`flex flex-col items-center rounded-lg px-1 py-2 transition-colors ${
              isToday
                ? "border border-primary bg-primary/5"
                : "border border-transparent hover:bg-accent"
            }`}
            key={day.date}
            onClick={() => navigate("/calendar")}
            type="button"
          >
            <span
              className={`text-[11px] ${isToday ? "text-primary" : "text-muted-foreground"}`}
              style={{ fontWeight: 600 }}
            >
              {day.dayName}
            </span>
            <span
              className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${
                isToday ? "bg-primary text-white" : "text-foreground"
              }`}
              style={{ fontWeight: isToday ? 700 : 500 }}
            >
              {Number.parseInt(day.date.split("-")[2], 10)}
            </span>
            <div className="mt-1 flex gap-0.5">
              {hasEvents ? (
                day.events.slice(0, 3).map((ev) => (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    key={ev.id}
                    style={{
                      backgroundColor:
                        ev.type === "project" ? "#ff8c00" : "#3B82F6",
                    }}
                  />
                ))
              ) : (
                <span className="h-1.5 w-1.5" />
              )}
            </div>
          </button>
        );
      })}
      {/* Event summary below the calendar strip */}
      {data.days.some((d) => d.events.length > 0) && (
        <div className="col-span-7 mt-2 space-y-1 border-accent border-t pt-2">
          {data.days
            .filter((d) => d.events.length > 0)
            .flatMap((d) =>
              d.events.slice(0, 2).map((ev) => (
                <div
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-[12px]"
                  key={ev.id}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{d.dayName}</span>
                  {ev.startTime && (
                    <span className="text-tertiary">{ev.startTime}</span>
                  )}
                  <span
                    className="truncate text-foreground"
                    style={{ fontWeight: 500 }}
                  >
                    {ev.title}
                  </span>
                </div>
              ))
            )
            .slice(0, 5)}
        </div>
      )}
    </div>
  );
}

function OpenReservationsContent({
  reservations,
  navigate,
}: {
  reservations:
    | {
        id: string;
        supplierName: string;
        projectName: string;
        projectId: string;
        date: string;
        expiresAt: number | null;
        status: string;
        participants: number;
      }[]
    | undefined;
  navigate: (path: string) => void;
}) {
  if (!reservations) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <CheckCircle className="mb-2 text-success" size={24} />
        <p className="text-[14px] text-muted-foreground">אין שריונות פתוחים</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right text-[13px]">
        <thead>
          <tr className="border-accent border-b text-muted-foreground">
            <th className="px-3 py-2 font-medium">ספק</th>
            <th className="px-3 py-2 font-medium">פרויקט</th>
            <th className="px-3 py-2 font-medium">תאריך</th>
            <th className="px-3 py-2 font-medium">פג תוקף</th>
            <th className="px-3 py-2 font-medium">משתתפים</th>
            <th className="px-3 py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => {
            const expiryStr = r.expiresAt
              ? new Date(r.expiresAt).toLocaleDateString("he-IL")
              : "-";
            const isExpiringSoon =
              r.expiresAt !== null &&
              r.expiresAt - Date.now() < 3 * 24 * 60 * 60 * 1000;
            return (
              <tr
                className="border-accent border-b transition-colors hover:bg-surface"
                key={r.id}
              >
                <td className="px-3 py-2.5 font-medium text-foreground">
                  {r.supplierName}
                </td>
                <td className="px-3 py-2.5 text-foreground">{r.projectName}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{r.date}</td>
                <td
                  className="px-3 py-2.5"
                  style={{
                    color: isExpiringSoon ? "#ef4444" : "#8d785e",
                    fontWeight: isExpiringSoon ? 600 : 400,
                  }}
                >
                  {expiryStr}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {r.participants}
                </td>
                <td className="px-3 py-2.5">
                  <button
                    className="rounded px-2 py-1 text-[12px] text-primary transition-colors hover:bg-[#fff7ed]"
                    onClick={() => navigate(`/projects/${r.projectId}`)}
                    style={{ fontWeight: 600 }}
                    type="button"
                  >
                    צפה
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
