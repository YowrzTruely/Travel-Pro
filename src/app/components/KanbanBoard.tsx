import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Bug,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudOff,
  Download,
  Eye,
  FileText,
  Filter,
  GripVertical,
  ImagePlus,
  Layers,
  LayoutGrid,
  Lightbulb,
  Loader2,
  MoveRight,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Wrench,
  X,
  ZoomIn,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import { useConfirmDelete } from "./ConfirmDeleteModal";

// ═══════════════ TYPES ═══════════════

type TaskType = "TASK" | "FEATURE" | "BUG";
type Priority = "HIGH" | "MEDIUM" | "LOW";
type Status = "ideas" | "todo" | "in-progress" | "on-hold" | "done";
type Version = "V1" | "V2";

interface Task {
  attachments?: { name: string; type: string; dataUrl: string }[];
  createdAt: string;
  description: string;
  estimate: string;
  feature: string;
  id: string;
  priority: Priority;
  status: Status;
  tags: string[];
  title: string;
  type: TaskType;
  version: Version;
}

interface Column {
  dotColor: string;
  id: Status;
  label: string;
}

// ═══════════════ CONSTANTS ═══════════════

const COLUMNS: Column[] = [
  { id: "todo", label: "לביצוע", dotColor: "#8d785e" },
  { id: "in-progress", label: "בעבודה", dotColor: "#ff8c00" },
  { id: "on-hold", label: "בהמתנה", dotColor: "#eab308" },
  { id: "done", label: "הושלם", dotColor: "#22c55e" },
];

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string }
> = {
  HIGH: { label: "גבוהה", color: "#dc2626", bg: "#fef2f2" },
  MEDIUM: { label: "בינונית", color: "#d97706", bg: "#fffbeb" },
  LOW: { label: "נמוכה", color: "#16a34a", bg: "#f0fdf4" },
};

const TYPE_CONFIG: Record<
  TaskType,
  { label: string; color: string; bg: string; icon: typeof Wrench }
> = {
  TASK: { label: "משימה", color: "#8d785e", bg: "#f5f0ea", icon: Wrench },
  FEATURE: { label: "פיצ׳ר", color: "#ff8c00", bg: "#fff7ed", icon: Sparkles },
  BUG: { label: "באג", color: "#dc2626", bg: "#fef2f2", icon: Bug },
};

const FEATURE_OPTIONS = [
  "דשבורד",
  "עורך הצעות מחיר",
  "בנק ספקים",
  "כרטיס ספק",
  "תצוגת לקוח",
  "אשף סיווג ספקים",
  "אשף ייבוא",
  "מוצרים סרוקים",
  "רשימת פרויקטים",
  "תשתית כללית",
  "אודיט ותיקוני באגים",
  "Layout וניווט",
  "מערכת תמונות ואחסון",
];

const STORAGE_KEY = "travelpro-kanban-v11";
const KANBAN_SEED_VERSION = "v11"; // Bump to seed new INITIAL_TASKS to server

const VERSION_TABS: {
  id: Version;
  label: string;
  subtitle: string;
  color: string;
}[] = [
  { id: "V1", label: "V1", subtitle: "MVP — 9 מסכים", color: "#ff8c00" },
  { id: "V2", label: "V2", subtitle: "הרחבה עתידית", color: "#a78bfa" },
];

// ═══════════════ INITIAL TASKS ═══════════════

const INITIAL_TASKS: Task[] = [
  // ════════════════════════════════════════
  // V1 — MVP
  // ════════════════════════════════════════

  // ──── V1 בנק הצעות ────
  {
    id: "v1i1",
    title: "לוח שנה חזותי לטיולים",
    description:
      "תצוגת Calendar עם כל הפרויקטים, תאריכי יציאה/חזרה, התנגשויות.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "ideas",
    feature: "דשבורד",
    estimate: "",
    tags: ["דשבורד"],
    createdAt: "2026-02-19",
    version: "V1",
  },
  {
    id: "v1i2",
    title: "דוחות רווחיות לפי פרויקט",
    description: "השוואת עלויות ספקים מול מחיר ללקוח, גרף רווח נקי לכל טיול.",
    type: "FEATURE",
    priority: "HIGH",
    status: "ideas",
    feature: "דשבורד",
    estimate: "",
    tags: ["דשבורד"],
    createdAt: "2026-02-19",
    version: "V1",
  },
  {
    id: "v1i3",
    title: "תבניות הצעות מחיר מוכנות",
    description:
      "ספריית תבניות לסוגי טיולים שונים (שטח, עירוני, חו״ל, כנסים), ואפשרות לשמור הצעה קיימת כתבנית לשימוש חוזר. ניהול ספריית תבניות.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "ideas",
    feature: "עורך הצעות מחיר",
    estimate: "4h",
    tags: ["עורך הצעות", "תבניות"],
    createdAt: "2026-02-19",
    version: "V1",
  },
  {
    id: "v1i4",
    title: "דשבורד ספק אישי",
    description: "תצוגה מרוכזת לספק: הזמנות פתוחות, היסטוריה, דירוג, מסמכים.",
    type: "FEATURE",
    priority: "LOW",
    status: "ideas",
    feature: "כרטיס ספק",
    estimate: "",
    tags: ["כרטיס ספק"],
    createdAt: "2026-02-19",
    version: "V1",
  },

  // ──── V1 לביצוע ────
  {
    id: "t1",
    title: "ולידציה בטפסים — עורך הצעות מחיר",
    description:
      "הוספת ולידציה לכל שדות ההצעה: שם פרויקט, תאריכים, שורות מחיר, פרטי לקוח.",
    type: "TASK",
    priority: "HIGH",
    status: "todo",
    feature: "עורך הצעות מחיר",
    estimate: "4h",
    tags: ["עורך הצעות"],
    createdAt: "2026-02-18",
    version: "V1",
  },
  {
    id: "t3",
    title: "ייצוא הצעת מחיר ל-PDF",
    description:
      "יצירת PDF מעוצב מטבלת ההצעה כולל לוגו, פרטי לקוח ותנאי תשלום.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "todo",
    feature: "עורך הצעות מחיר",
    estimate: "6h",
    tags: ["עורך הצעות"],
    createdAt: "2026-02-18",
    version: "V1",
  },
  {
    id: "t4",
    title: "פילטרים מתקדמים — רשימת פרויקטים",
    description: "סינון לפי סטטוס, תאריך, לקוח ויעד. חיפוש חופשי בכל השדות.",
    type: "TASK",
    priority: "MEDIUM",
    status: "todo",
    feature: "רשימת פרויקטים",
    estimate: "3h",
    tags: ["פרויקטים"],
    createdAt: "2026-02-18",
    version: "V1",
  },
  {
    id: "t6",
    title: "מפת ספקים — Leaflet clusters",
    description: "הוספת clustering לסמנים במפה כשיש ספקים רבים באותו אזור.",
    type: "TASK",
    priority: "LOW",
    status: "todo",
    feature: "בנק ספקים",
    estimate: "3h",
    tags: ["בנק ספקים"],
    createdAt: "2026-02-18",
    version: "V1",
  },
  {
    id: "t8",
    title: "גרף התפלגות עלויות בדשבורד",
    description: "Recharts pie/bar chart המציג חלוקת הוצאות לפי קטגוריית ספק.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "todo",
    feature: "דשבורד",
    estimate: "4h",
    tags: ["דשבורד"],
    createdAt: "2026-02-18",
    version: "V1",
  },
  {
    id: "t9",
    title: 'Drag & Drop בלו"ז הפעילות',
    description:
      'מנגנון גרירה לסידור מחדש של אירועים בלו"ז (Timeline) של עורך הצעות המחיר. שימוש ב-react-dnd עם אנימציות.',
    type: "FEATURE",
    priority: "HIGH",
    status: "todo",
    feature: "עורך הצעות מחיר",
    estimate: "5h",
    tags: ["עורך הצעות", "DnD", 'לו"ז'],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "t10",
    title: "חיפוש/סינון מתקדם בבנק ספקים",
    description:
      "חיפוש מתקדם עם פילטרים מרובים בו-זמנית: קטגוריה, אזור, דירוג, סטטוס אימות, טווח מחירים. כולל שמירת חיפושים אחרונים.",
    type: "FEATURE",
    priority: "HIGH",
    status: "todo",
    feature: "בנק ספקים",
    estimate: "4h",
    tags: ["בנק ספקים", "חיפוש"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "t11",
    title: "מערכת תגיות לפרויקטים",
    description:
      "הוספת תגיות/תוויות צבעוניות לפרויקטים: סוג טיול (שטח, עירוני, חו\"ל), VIP, דחוף, וכו'. סינון לפי תגיות ברשימת הפרויקטים.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "todo",
    feature: "רשימת פרויקטים",
    estimate: "3h",
    tags: ["פרויקטים", "תגיות"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "t12",
    title: "גרירת תמונות ישירות על כרטיס רכיב",
    description:
      "Drop zone ישירות על כרטיס רכיב בעורך הצעות — גרירת תמונה מהדסקטופ מעלה ישירות ל-Supabase Storage ומשייכת לרכיב ללא פתיחת ה-ItemEditor.",
    type: "FEATURE",
    priority: "LOW",
    status: "todo",
    feature: "עורך הצעות מחיר",
    estimate: "3h",
    tags: ["עורך הצעות", "תמונות", "DnD"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "t13",
    title: "תגיות וקטגוריות לתמונות",
    description:
      'אפשרות לתייג תמונות (למשל: "מהספק", "מהשטח", "לוגו") ולסנן לפיהן. הן ב-ItemEditor והן ב-ProductEditor.',
    type: "FEATURE",
    priority: "LOW",
    status: "todo",
    feature: "מערכת תמונות ואחסון",
    estimate: "3h",
    tags: ["תמונות", "תגיות"],
    createdAt: "2026-02-21",
    version: "V1",
  },

  // ──── V1 בעבודה ────
  {
    id: "p1",
    title: "תצוגת לקוח — התאמת מובייל",
    description:
      "עיצוב responsive מלא לעמוד הלקוח: תמחור, פרטי טיול, אישור הצעה.",
    type: "TASK",
    priority: "HIGH",
    status: "in-progress",
    feature: "תצוגת לקוח",
    estimate: "4h",
    tags: ["תצוגת לקוח"],
    createdAt: "2026-02-18",
    version: "V1",
  },
  {
    id: "p2",
    title: "אשף סיווג ספקים — שכתוב מלא מ-placeholder לכלי פונקציונלי",
    description:
      'שכתוב מלא מ-placeholder סטטי לכלי End-to-End: טעינת ספקים לא מסווגים מ-Supabase, כרטיס ספק מונפש עם slide animation, זיהוי "AI" אוטומטי של קטגוריה לפי מילות מפתח, גריד 10 קטגוריות עם תתי-קטגוריות דינמיות, תגיות, שמירה דרך PUT /suppliers/:id, קיצורי מקלדת, טיימר, סטטיסטיקות חיות, תור ספקים בסיידבר, ומסך סיום.',
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "אשף סיווג ספקים",
    estimate: "5h",
    tags: ["סיווג ספקים", "Motion", "Supabase"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "p3",
    title: "שיפור ביצועים — lazy loading",
    description:
      "הוספת React.lazy ו-Suspense למסכים כבדים: בנק ספקים, עורך הצעות, דשבורד.",
    type: "TASK",
    priority: "MEDIUM",
    status: "in-progress",
    feature: "תשתית כללית",
    estimate: "2h",
    tags: ["ביצועים"],
    createdAt: "2026-02-19",
    version: "V1",
  },

  // ──── V1 בהמתנה ────
  {
    id: "h1",
    title: "מערכת הרשאות — RBAC",
    description:
      "הגדרת תפקידים: admin, editor, viewer. הגנה על נתיבים ופעולות רגישות.",
    type: "FEATURE",
    priority: "HIGH",
    status: "on-hold",
    feature: "תשתית כללית",
    estimate: "1d",
    tags: ["תשתית"],
    createdAt: "2026-02-17",
    version: "V1",
  },

  // ──── V1 הושלם ────
  {
    id: "d1",
    title: "דשבורד ראשי — KPIs וגרפים",
    description:
      "מסך דשבורד עם סטטיסטיקות, גרפי Recharts, רשימת פרויקטים אחרונים.",
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "דשבורד",
    estimate: "8h",
    tags: ["דשבורד"],
    createdAt: "2026-02-10",
    version: "V1",
  },
  {
    id: "d2",
    title: "עורך הצעות מחיר — טבלת שורות",
    description: "ממשק עריכת הצעה: הוספת שורות, חישוב מחירים, הנחות, סיכום.",
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "עורך הצעות מחיר",
    estimate: "1d",
    tags: ["עורך הצעות"],
    createdAt: "2026-02-11",
    version: "V1",
  },
  {
    id: "d3",
    title: "בנק ספקים — רשימה, חיפוש וסינון",
    description:
      "מסך ספקים עם טבלה, חיפוש חופשי, פילטרים לפי קטגוריה ואזור, מפת Leaflet.",
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "בנק ספקים",
    estimate: "1d",
    tags: ["בנק ספקים"],
    createdAt: "2026-02-12",
    version: "V1",
  },
  {
    id: "d4",
    title: "כרטיס ספק — פרטים ומפה",
    description: "עמוד פרטי ספק: מידע, מיקום, היסטוריית שימוש, דירוג.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "done",
    feature: "כרטיס ספק",
    estimate: "6h",
    tags: ["כרטיס ספק"],
    createdAt: "2026-02-12",
    version: "V1",
  },
  {
    id: "d5",
    title: "תצוגת לקוח — עמוד שיתוף הצעה",
    description: "עמוד ציבורי שמציג ללקוח הצעת מחיר מעוצבת עם אפשרות אישור.",
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "תצוגת לקוח",
    estimate: "6h",
    tags: ["תצוגת לקוח"],
    createdAt: "2026-02-13",
    version: "V1",
  },
  {
    id: "d6",
    title: "אשף ייבוא — וויזארד End-to-End עם Undo/Rollback",
    description:
      "וויזארד פונקציונלי מקצה לקצה עם 4 שלבים: העלאת CSV (PapaParse), מיפוי עמודות חכם, בדיקת כפילויות, וייבוא בפועל ל-Supabase. כולל מערכת undo/rollback מלאה — route POST /suppliers/bulk-rollback, מתודת bulkRollback ב-API, ובמסך ההצלחה בר undo אדום עם countdown 30 שניות, אישור דו-שלבי ואנימציות Motion.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "done",
    feature: "אשף ייבוא",
    estimate: "1d",
    tags: ["ייבוא", "CSV", "Undo", "Motion"],
    createdAt: "2026-02-14",
    version: "V1",
  },
  {
    id: "d7",
    title: "רשימת פרויקטים — תצוגה ופעולות",
    description: "מסך כל הפרויקטים עם סטטוס, תאריכים, לקוח, ופעולות מהירות.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "done",
    feature: "רשימת פרויקטים",
    estimate: "6h",
    tags: ["פרויקטים"],
    createdAt: "2026-02-14",
    version: "V1",
  },
  {
    id: "d8",
    title: "Layout משותף — Sidebar וניווט",
    description: "Sidebar קבוע עם ניווט בין כל 9 המסכים, פלטה חמה, RTL מלא.",
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "תשתית כללית",
    estimate: "4h",
    tags: ["תשתית"],
    createdAt: "2026-02-09",
    version: "V1",
  },
  {
    id: "d9",
    title: "מוצרים סרוקים — תצוגת תוצאות",
    description: "מסך הצגת מוצרים שיובאו/נסרקו עם פילטרים ופעולות סיווג.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "done",
    feature: "מוצרים סרוקים",
    estimate: "5h",
    tags: ["סריקה"],
    createdAt: "2026-02-15",
    version: "V1",
  },

  // ──── V1 הושלם — חיבור Supabase ומערכת תמונות (21/02/2026) ────
  {
    id: "d10",
    title: "חיבור Supabase — persistence לכל המסכים",
    description:
      'חיבור מלא ל-Supabase KV Store: פרויקטים, ספקים, אנשי קשר, מוצרים, מסמכים, רכיבי הצעה ולו"ז. שרת Hono נכתב מחדש במלואו עם seed v3 מלא כולל directPrice. כל ה-CRUD עובד end-to-end.',
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "תשתית כללית",
    estimate: "2d",
    tags: ["Backend", "Supabase", "KV"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d11",
    title: "Modals פונקציונליים — בנק ספקים + כרטיס ספק",
    description:
      "כל כפתורי הוספה/עריכה/מחיקה עובדים עם modals/drawers אמיתיים: הוספת ספק, עריכת פרטי ספק, הוספת איש קשר, הוספת מוצר, העלאת מסמכים עם תאריך תוקף — כולם שומרים ל-Supabase.",
    type: "TASK",
    priority: "HIGH",
    status: "done",
    feature: "בנק ספקים",
    estimate: "6h",
    tags: ["בנק ספקים", "כרטיס ספק", "CRUD"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d12",
    title: "העלאת מסמכים ותמונות לכרטיס ספק",
    description:
      "מערכת מסמכים מלאה בכרטיס ספק: 3 מסמכים נדרשים (רישיון עסק, תעודת כשרות, ביטוח צד ג) עם סטטוס תוקף חזותי (ירוק/צהוב/אדום), העלאת קבצים, עדכון תוקף, ומסמכים נוספים. שמירה ב-Supabase.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "done",
    feature: "כרטיס ספק",
    estimate: "5h",
    tags: ["כרטיס ספק", "מסמכים"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d13",
    title: "ItemEditor — עריכת רכיב בהצעת מחיר",
    description:
      "Drawer slide-in עם Motion spring animations לעריכת רכיב בהצעה. כולל: גלריית תמונות עם hero image + thumbnails + drag & drop upload ל-Supabase Storage (bucket פרטי + signed URLs), טפסי עריכה עם stagger animations (שם, ספק, תיאור, סטטוס, תמחור עם profit bar אנימטיבי, כוכבי משקל רווח, הערות), וכפתור שמירה עם success pulse. משולב בעורך הצעות עם כפתור עיפרון בכל כרטיס.",
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "עורך הצעות מחיר",
    estimate: "8h",
    tags: ["עורך הצעות", "תמונות", "Motion", "Storage"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d14",
    title: "ProductEditor — עריכת מוצר בכרטיס ספק",
    description:
      "Drawer slide-in עם Motion animations לעריכת מוצר בתוך כרטיס ספק. כולל: גלריית תמונות מלאה (hero + thumbnails + ניווט חצים + drag & drop upload), עריכת שם/תיאור/מחיר/יחידה עם בורר חזותי, כרטיס מחיר gradient, הערות פנימיות, שמירה עם success state. ב-Products Tab לחיצה על כרטיס פותחת ישירות את העורך.",
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "כרטיס ספק",
    estimate: "6h",
    tags: ["כרטיס ספק", "תמונות", "Motion", "Storage"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d15",
    title: "Server routes — תמונות מוצרים",
    description:
      "הוספת endpoints בשרת Hono: PUT לעדכון מוצר, POST להעלאת תמונת מוצר ל-Supabase Storage (base64 → bucket פרטי → signed URL), DELETE למחיקת תמונת מוצר. כולל פונקציות API בצד הלקוח: supplierProductsApi.update, uploadImage, deleteImage.",
    type: "TASK",
    priority: "HIGH",
    status: "done",
    feature: "מערכת תמונות ואחסון",
    estimate: "3h",
    tags: ["Backend", "Storage", "API"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d16",
    title: "שדרוג UX כפתורי עריכה בעורך הצעות",
    description:
      'כפתור "עריכה" כתום תמיד גלוי (לא רק ב-hover) עם אייקון + טקסט בכל כרטיס רכיב. בנוסף — לחיצה על שם הרכיב פותחת את ה-ItemEditor ישירות עם אפקט hover כתום ואייקון עיפרון.',
    type: "TASK",
    priority: "MEDIUM",
    status: "done",
    feature: "עורך הצעות מחיר",
    estimate: "30m",
    tags: ["עורך הצעות", "UX"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d17",
    title: "מערכת אייקוני Lucide אחידה — החלפת אימוג'ים",
    description:
      "החלפת כל האימוג'ים באפליקציה במערכת אייקונים אחידה של Lucide: SectionIcon (עטיפה עם גדלים), TypeBadge (מיפוי קטגוריות לאייקונים), אייקונים בסרגל הסיכום, בטבלת התמחור ובלו\"ז. כל רכיב מטופל.",
    type: "TASK",
    priority: "MEDIUM",
    status: "done",
    feature: "תשתית כללית",
    estimate: "2h",
    tags: ["עיצוב", "אייקונים", "Lucide"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d18",
    title: "Seed v6 — נתוני ספקים מורחבים עם directPrice",
    description:
      "עדכון ה-seed לגרסה v6 (_meta:seeded_v6): נתוני ספקים עם אנשי קשר (שם, תפקיד, טלפון, אימייל), מוצרים (שם, מחיר, תיאור, יחידה), מסמכים עם תוקף, וכן ערכי directPrice ברכיבי הצעת מחיר לחישוב רווח מדויק. עדכוני schema ו-data משמעותיים לאורך 6 גרסאות seed.",
    type: "TASK",
    priority: "HIGH",
    status: "done",
    feature: "תשתית כללית",
    estimate: "2h",
    tags: ["Backend", "Seed", "Data"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d19",
    title: "QuoteEditor — שלושת הסקשנים בעמוד אחד + scroll anchors",
    description:
      'שכתוב QuoteEditor כך ששלושת הסקשנים (רכיבים וספקים, תמחור ורווח יעד, לו"ז הפעילות) מוצגים תמיד אחד מתחת לשני באותו עמוד. הטאבים למעלה משמשים כ-scroll anchors עם IntersectionObserver — לחיצה על טאב גוללת לסקשן הרלוונטי, והטאב הפעיל מתעדכן אוטומטית לפי המיקום בעמוד.',
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "עורך הצעות מחיר",
    estimate: "4h",
    tags: ["עורך הצעות", "UX", "IntersectionObserver"],
    createdAt: "2026-02-21",
    version: "V1",
  },

  // ──── V1 הושלם — אודיט כפתורים (21/02/2026) ────
  {
    id: "audit1",
    title: 'תיקון כפתור "פרויקט חדש" ברשימת הפרויקטים',
    description:
      'הכפתור עשה navigate("/") במקום לפתוח את המודאל. תוקן לעבוד דרך URL param ?newProject=true שה-Layout מזהה ופותח אוטומטית את מודאל יצירת הפרויקט. עובד מכל דף באפליקציה.',
    type: "BUG",
    priority: "HIGH",
    status: "done",
    feature: "רשימת פרויקטים",
    estimate: "30m",
    tags: ["אודיט", "פרויקטים", "ניווט"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "audit2",
    title: 'תיקון כפתור "הדפס" בתצוגת לקוח (ClientQuote)',
    description:
      "כפתור מת — לא היה onClick בכלל, רק עיצוב. הוספת window.print() שפותח את דיאלוג ההדפסה/שמירת PDF של הדפדפן.",
    type: "BUG",
    priority: "MEDIUM",
    status: "done",
    feature: "תצוגת לקוח",
    estimate: "15m",
    tags: ["אודיט", "תצוגת לקוח"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "audit3",
    title: 'תיקון כפתור "שיתוף" בתצוגת לקוח',
    description:
      "כפתור מת — ללא פונקציונליות. הוספת Web Share API (במובייל פותח תפריט שיתוף) ובדסקטופ מעתיק את הקישור ללוח עם הודעת טוסט.",
    type: "BUG",
    priority: "MEDIUM",
    status: "done",
    feature: "תצוגת לקוח",
    estimate: "20m",
    tags: ["אודיט", "תצוגת לקוח", "שיתוף"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "audit4",
    title: 'תיקון כפתור "העתק" בבנק ספקים — העתקה אמיתית',
    description:
      'הכפתור הציג טוסט "הספק הועתק" אבל לא העתיק שום דבר באמת. תוקן להעתיק את כל פרטי הספק (שם, קטגוריה, אזור, טלפון, דירוג) ללוח באמצעות navigator.clipboard.writeText().',
    type: "BUG",
    priority: "HIGH",
    status: "done",
    feature: "בנק ספקים",
    estimate: "20m",
    tags: ["אודיט", "בנק ספקים", "clipboard"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "audit5",
    title: "פגינציה אמיתית בבנק ספקים",
    description:
      "כפתורי הפגינציה 1,2,3 והחצים היו דקורטיביים — הארדקודד ללא לוגיקה. הוחלפו בפגינציה עובדת עם state של currentPage, חיתוך נתונים עם slice(), כפתורי עמודים דינמיים, חצים עם disabled, ואיפוס לעמוד 1 בשינוי פילטרים.",
    type: "BUG",
    priority: "HIGH",
    status: "done",
    feature: "בנק ספקים",
    estimate: "45m",
    tags: ["אודיט", "בנק ספקים", "פגינציה"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "audit6",
    title: "תיקון כפתור ⋮ (MoreVertical) בפרויקטים דחופים בדשבורד",
    description:
      "כפתור מת — לחיצה לא עשתה כלום. תוקן לנווט לדף הפרויקט הרלוונטי עם navigate לדף הפרויקט.",
    type: "BUG",
    priority: "MEDIUM",
    status: "done",
    feature: "דשבורד",
    estimate: "15m",
    tags: ["אודיט", "דשבורד", "ניווט"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "audit7",
    title: "תיקון כפתור עזרה (HelpCircle) בהדר העליון",
    description: "כפתור מת. תוקן לנווט לדף ה-PRD (מסמך מוצר / עזרה).",
    type: "BUG",
    priority: "LOW",
    status: "done",
    feature: "Layout וניווט",
    estimate: "10m",
    tags: ["אודיט", "Layout", "ניווט"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "audit8",
    title: "אודיט כפתור-כפתור מלא — ביקורת כל הקומפוננטות",
    description:
      "מעבר שיטתי על כל כפתור בכל קומפוננטה באפליקציה: בדיקה שכל לחיצה מובילה למקום הנכון, שהפונקציה מאחורי הכפתור עובדת, ושהנתונים נשמרים/נקראים מהבאקאנד כמו שצריך. נמצאו 7 בעיות ותוקנו, שאר הכפתורים (סיידבר, CRUD ספקים, מודאל פרויקטים, עורך הצעות, חיפוש גלובלי, התראות, Logout ועוד) נמצאו תקינים.",
    type: "TASK",
    priority: "HIGH",
    status: "done",
    feature: "אודיט ותיקוני באגים",
    estimate: "3h",
    tags: ["אודיט", "QA", "כפתורים"],
    createdAt: "2026-02-21",
    version: "V1",
  },

  // ──── V1 הושלם — מיקום ספק + תמונות מוצר בתצוגת preview (21/02/2026) ────
  {
    id: "d20",
    title: "מיקום ספק אינטראקטיבי — Leaflet + Nominatim",
    description:
      'קומפוננט SupplierLocationMap חדש שמחליף את ה-placeholder הסטטי של "מיקום" בכרטיס ספק. כולל: שדה חיפוש כתובת עם autocomplete דרך Nominatim (מוגבל לישראל, תוצאות בעברית), debounce 400ms, מפת Leaflet אינטראקטיבית עם marker ואנימציית flyTo, שמירה אוטומטית של address ו-location: {lat, lng} על אובייקט הספק ב-Supabase, כפתור מחיקת מיקום, ו-click outside לסגירת ההצעות.',
    type: "FEATURE",
    priority: "MEDIUM",
    status: "done",
    feature: "כרטיס ספק",
    estimate: "4h",
    tags: ["כרטיס ספק", "מפה", "Leaflet", "Nominatim"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d21",
    title: "תיקון dropdown autocomplete — חיפוש כתובת ספק",
    description:
      "ה-dropdown של תוצאות החיפוש היה נפתח כלפי מטה ונחתך מאחורי המפה. תוקן לפתיחה כלפי מעלה (bottom-full) עם z-[100], max-height וגלילה פנימית, כך שההצעות תמיד נראות מעל שדה החיפוש.",
    type: "BUG",
    priority: "HIGH",
    status: "done",
    feature: "כרטיס ספק",
    estimate: "15m",
    tags: ["כרטיס ספק", "UX", "CSS"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d22",
    title: "תמונות מוצר בתצוגת Preview — לשונית מידע כללי",
    description:
      'כרטיסי המוצרים בלשונית "מידע כללי" (preview) הציגו רק טקסט ללא תמונות. עודכנו להציג thumbnail של תמונת המוצר הראשונה (hero image) עם אפקט zoom ב-hover, badge ספירת תמונות כשיש יותר מאחת, ו-fallback אייקון Package כשאין תמונות.',
    type: "TASK",
    priority: "MEDIUM",
    status: "done",
    feature: "כרטיס ספק",
    estimate: "30m",
    tags: ["כרטיס ספק", "UX", "תמונות"],
    createdAt: "2026-02-21",
    version: "V1",
  },

  // ──── V1 הושלם — מערכת ארכיון ספקים + Breadcrumbs (21/02/2026) ────
  {
    id: "d23",
    title: "מערכת ארכיון ספקים מלאה — End to End",
    description:
      'מערכת ארכיון מקצה לקצה: כפתור "העבר לארכיון" בכרטיס ספק עם מודאל אישור דו-שלבי, מתודת archive ב-API (משנה category ל-"ארכיון"), סינון ספקים מאורכנים מבנק הספקים, כפתור "ארכיון (X)" בהדר בנק הספקים שמוביל לעמוד ארכיון ייעודי (/suppliers/archive). עמוד הארכיון (SupplierArchive.tsx) מציג טבלה של כל הספקים המאורכנים עם חיפוש, צפייה וכפתור שחזור ירוק. בכרטיס ספק מאורכן — באנר "ספק זה נמצא בארכיון" עם כפתור שחזור, כפתור ה-back מנווט לארכיון, וכפתור ההעברה לארכיון מוסתר. Route חדש, מתודת restore ב-API.',
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "בנק ספקים",
    estimate: "3h",
    tags: ["בנק ספקים", "כרטיס ספק", "ארכיון", "CRUD"],
    createdAt: "2026-02-21",
    version: "V1",
  },
  {
    id: "d24",
    title: "שדרוג Breadcrumbs — route ארכיון + labels דינמיים",
    description:
      'הוספת route "ארכיון" ל-routeMeta עם אייקון Archive, וכן שיפור ה-fallback למזהי ספקים/פרויקטים דינמיים — במקום להציג #hash לא קריא, מוצגות תוויות ידידותיות: "פרטי ספק" לנתיבים תחת /suppliers/, "פרטי פרויקט" תחת /projects/.',
    type: "TASK",
    priority: "MEDIUM",
    status: "done",
    feature: "Layout וניווט",
    estimate: "30m",
    tags: ["Breadcrumbs", "UX", "ניווט"],
    createdAt: "2026-02-21",
    version: "V1",
  },

  // ──── V1 הושלם — עריכת ספק + הערות אוטומטיות + תיקוני באגים (22/02/2026) ────
  {
    id: "d25",
    title: "טופס עריכת ספק מקיף — מודאל מלא",
    description:
      'כפתור "עריכה" כתום עם אייקון עיפרון ליד שם הספק בהדר, שפותח מודאל טופס מקיף (שם, טלפון, קטגוריה, אזור, דירוג, סטטוס אימות, הערות) עם שמירה ל-Supabase דרך suppliersApi.update(). הטופס משתמש ב-react-hook-form עם FormField, FormSelect ו-FormTextarea הקיימים.',
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "כרטיס ספק",
    estimate: "2h",
    tags: ["כרטיס ספק", "CRUD", "react-hook-form"],
    createdAt: "2026-02-22",
    version: "V1",
  },
  {
    id: "d26",
    title: "מערכת הערות אוטומטיות לספקים — Engine + UI",
    description:
      "מנגנון הערות אוטומטיות מלא: endpoint GET /suppliers/summaries בשרת Hono, יוטיליטי supplierNotes.ts עם 9 סוגי הערות לפי סדר עדיפות (ביטוח פג, מסמכים קרובים לפקיעה, אימות ממתין, מסמכים חסרים, אין אנשי קשר, חסר טלפון, אין מוצרים), צבעים לפי חומרה (אדום/כתום/צהוב/כחול/אפור), וחישוב גם מ-summary וגם מ-data מלא.",
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "כרטיס ספק",
    estimate: "4h",
    tags: ["כרטיס ספק", "בנק ספקים", "Backend", "UX"],
    createdAt: "2026-02-22",
    version: "V1",
  },
  {
    id: "d27",
    title: "הערות אוטומטיות — הצגה ב-SupplierBank + SupplierDetail",
    description:
      'Badge-ים צבעוניים קומפקטיים (pills עם אייקון וטקסט) מופיעים: בבנק ספקים ליד כל ספק, ובכרטיס ספק מתחת לפרטי הספק בתצוגה אנכית (אחד מתחת לשני). כל דבר "חסר" (מסמכים, אנשי קשר, טלפון, מוצרים) מופיע באדום (critical). הערה ידנית משולבת כ-badge צהוב באותה שורה.',
    type: "FEATURE",
    priority: "MEDIUM",
    status: "done",
    feature: "כרטיס ספק",
    estimate: "2h",
    tags: ["כרטיס ספק", "בנק ספקים", "UX"],
    createdAt: "2026-02-22",
    version: "V1",
  },
  {
    id: "d28",
    title: "הסרת SupplierComplianceCard — החלפה ב-badges",
    description:
      "מחיקת הקומפוננט SupplierComplianceCard.tsx (כרטיס תקינות צף עם donut chart, ציון, expand/collapse). הוחלף במערכת ה-badges הקומפקטית של ההערות האוטומטיות — קלה יותר, ברורה יותר, ואינפורמטיבית יותר.",
    type: "TASK",
    priority: "MEDIUM",
    status: "done",
    feature: "כרטיס ספק",
    estimate: "30m",
    tags: ["כרטיס ספק", "UX", "ניקוי קוד"],
    createdAt: "2026-02-22",
    version: "V1",
  },
  {
    id: "bug1",
    title: "תיקון Leaflet _leaflet_pos crash — invalidateSize",
    description:
      "שגיאת TypeError: Cannot read properties of undefined (reading '_leaflet_pos') ב-SupplierLocationMap. הבעיה: setTimeout עם map.invalidateSize() נורה אחרי שהמפה כבר הוסרה מה-DOM (unmount). תוקן עם guard שבודק שה-map וה-container עדיין קיימים, try/catch, וביטול ה-timeout ב-cleanup.",
    type: "BUG",
    priority: "HIGH",
    status: "done",
    feature: "כרטיס ספק",
    estimate: "15m",
    tags: ["כרטיס ספק", "Leaflet", "באג"],
    createdAt: "2026-02-22",
    version: "V1",
  },
  {
    id: "d29",
    title: "הסרת cursor-pointer מכרטיסי רכיבים בעורך הצעות",
    description:
      'שם הספק/רכיב בכרטיסים בעורך הצעות המחיר הפך לטקסט רגיל — הוסרו cursor-pointer, onClick ואייקון Pencil כדי למנוע כניסה לעריכת פרטי ספק מתוך הפרויקט. כפתור "עריכה" הכתום הנפרד נשאר לעריכת הרכיב עצמו.',
    type: "TASK",
    priority: "MEDIUM",
    status: "done",
    feature: "עורך הצעות מחיר",
    estimate: "15m",
    tags: ["עורך הצעות", "UX"],
    createdAt: "2026-02-22",
    version: "V1",
  },
  {
    id: "d30",
    title: 'מערכת אישור מחיקה גלובלית — הקלדת "מחיקה"',
    description:
      'קומפוננט ConfirmDeleteModal.tsx עם hook useConfirmDelete — בכל פעולת מחיקה במערכת עולה מודאל שדורש הקלדת המילה "מחיקה" לפני אישור. שולב ב-7 קבצים: ProjectsList (מחיקת פרויקט), QuoteEditor (מחיקת רכיב הצעה), SupplierDetail (מחיקת איש קשר ומוצר), ItemEditor ו-ProductEditor (מחיקת תמונות), KanbanBoard (מחיקת משימה וקבצים מצורפים), SupplierLocationMap (מחיקת מיקום). כולל אנימציית Motion, auto-focus, תמיכה ב-Enter/Escape ומצב loading.',
    type: "TASK",
    priority: "HIGH",
    status: "done",
    feature: "תשתית כללית",
    estimate: "2h",
    tags: ["UX", "אבטחה", "תשתית"],
    createdAt: "2026-02-22",
    version: "V1",
  },
  {
    id: "d31",
    title: "מולטי-קטגוריה לספקים — checkboxes במקום dropdown",
    description:
      "שדה הקטגוריה בכרטיס ספק הפך ל-multi-select עם checkboxes (grid 3 עמודות) — כל ספק יכול לספק כמה שירותים. השינוי חל על מודאל עריכת ספק (SupplierDetail), טופס הוספת ספק חדש (SupplierBank), תצוגת badges בטבלה ובהדר הספק, ומנגנון סינון לפי קטגוריה. הקטגוריות נשמרות כ-comma-separated string עם תאימות אחורית.",
    type: "FEATURE",
    priority: "HIGH",
    status: "done",
    feature: "בנק ספקים",
    estimate: "1.5h",
    tags: ["בנק ספקים", "UX", "כרטיס ספק"],
    createdAt: "2026-02-22",
    version: "V1",
  },

  // ════════════════════════════════════════
  // V2 — הרחבה
  // ════════════════════════════════════════

  // ──── V2 בנק הצעות ────
  {
    id: "v2i1",
    title: "שליחת הצעות מחיר דרך WhatsApp",
    description:
      "אינטגרציה עם WhatsApp Business API לשליחת קישור הצעה ישירות ללקוח.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "ideas",
    feature: "עורך הצעות מחיר",
    estimate: "",
    tags: ["אינטגרציות"],
    createdAt: "2026-02-19",
    version: "V2",
  },
  {
    id: "v2i2",
    title: "סריקת אתרי ספקים אוטומטית",
    description: "סריקת מחירים ועדכון אוטומטי של תעריפי ספקים מאתרי הזמנות.",
    type: "FEATURE",
    priority: "LOW",
    status: "ideas",
    feature: "מוצרים סרוקים",
    estimate: "",
    tags: ["אוטומציה"],
    createdAt: "2026-02-19",
    version: "V2",
  },
  {
    id: "v2i3",
    title: "צ׳אט פנימי בין מפיקים",
    description: "מערכת הודעות פנימית לתיאום בין מפיקים על אותו פרויקט.",
    type: "FEATURE",
    priority: "LOW",
    status: "ideas",
    feature: "תשתית כללית",
    estimate: "",
    tags: ["שיתוף פעולה"],
    createdAt: "2026-02-19",
    version: "V2",
  },
  {
    id: "v2i4",
    title: "אפליקציית מובייל PWA למפיקים",
    description: "גרסת PWA מותאמת למובייל לצפייה ועדכון פרויקטים תוך כדי טיול.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "ideas",
    feature: "תשתית כללית",
    estimate: "",
    tags: ["מובייל"],
    createdAt: "2026-02-19",
    version: "V2",
  },
  {
    id: "v2i5",
    title: "מנוע המלצות ספקים חכם",
    description: "המלצות אוטומטיות לספקים לפי יעד, תקציב, דירוג והיסטוריה.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "ideas",
    feature: "בנק ספקים",
    estimate: "",
    tags: ["AI"],
    createdAt: "2026-02-19",
    version: "V2",
  },

  // ──── V2 לביצוע ────
  {
    id: "v2t1",
    title: "מערכת תשלומים — מעקב גבייה",
    description: "מעקב תשלומי לקוחות: חשבוניות, תזכורות, סטטוס גבייה.",
    type: "FEATURE",
    priority: "HIGH",
    status: "todo",
    feature: "תשתית כללית",
    estimate: "2d",
    tags: ["תשלומים"],
    createdAt: "2026-02-19",
    version: "V2",
  },
  {
    id: "v2t2",
    title: "מערכת התראות מתקדמת",
    description:
      "התראות push, אימייל, ו-in-app על שינויי סטטוס, תאריכים קרובים. כולל התראה למפיק כשלקוח צופה/מאשר הצעה או כשספק מעדכן פרטים.",
    type: "FEATURE",
    priority: "HIGH",
    status: "todo",
    feature: "תשתית כללית",
    estimate: "1d",
    tags: ["התראות"],
    createdAt: "2026-02-19",
    version: "V2",
  },
  {
    id: "v2t3",
    title: "דוחות ו-Analytics מתקדמים",
    description: "דשבורד דוחות: רווחיות, ספקים מובילים, תחזיות, ייצוא Excel.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "todo",
    feature: "דשבורד",
    estimate: "2d",
    tags: ["דוחות"],
    createdAt: "2026-02-19",
    version: "V2",
  },
  {
    id: "v2t4",
    title: "העלאת מסמכים מתקדמת",
    description: "ניהול מסמכים מרכזי: חוזים, רישיונות, ביטוחים, תוקף וחידוש.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "todo",
    feature: "כרטיס ספק",
    estimate: "1d",
    tags: ["מסמכים"],
    createdAt: "2026-02-19",
    version: "V2",
  },
  {
    id: "v2t5",
    title: "Multi-tenant — ניהול מספר ארגונים",
    description: "תמיכה בריבוי ארגונים, הפרדת נתונים, הזמנות צוות.",
    type: "FEATURE",
    priority: "LOW",
    status: "todo",
    feature: "תשתית כללית",
    estimate: "3d",
    tags: ["ארכיטקטורה"],
    createdAt: "2026-02-19",
    version: "V2",
  },

  // ──── V2 בעבודה ────
  {
    id: "v2p1",
    title: "תכנון ארכיטקטורת V2",
    description:
      "מפת דרכים טכנית, schema updates, API design לפיצ׳רים מתקדמים.",
    type: "TASK",
    priority: "HIGH",
    status: "in-progress",
    feature: "תשתית כללית",
    estimate: "1d",
    tags: ["ארכיטקטורה"],
    createdAt: "2026-02-19",
    version: "V2",
  },

  // ──── V2 בהמתנה ────
  {
    id: "v2h1",
    title: "אינטגרציית Google Calendar",
    description: "סנכרון טיולים ללוח שנה, תזכורות אוטומטיות, שיתוף אירועים.",
    type: "FEATURE",
    priority: "MEDIUM",
    status: "on-hold",
    feature: "דשבורד",
    estimate: "6h",
    tags: ["אינטגרציות"],
    createdAt: "2026-02-19",
    version: "V2",
  },
  {
    id: "v2h2",
    title: "API ציבורי לספקים",
    description: "ספקים יוכלו לעדכן זמינות ומחירים דרך API, webhook callbacks.",
    type: "FEATURE",
    priority: "LOW",
    status: "on-hold",
    feature: "בנק ספקים",
    estimate: "2d",
    tags: ["API"],
    createdAt: "2026-02-19",
    version: "V2",
  },
];

// ═══════════════ HELPERS ═══════════════

function generateId() {
  return `t${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;
}

const HEB_MONTHS = [
  "ינו׳",
  "פבר׳",
  "מרץ",
  "אפר׳",
  "מאי",
  "יוני",
  "יולי",
  "אוג׳",
  "ספט׳",
  "אוק׳",
  "נוב׳",
  "דצמ׳",
];
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${HEB_MONTHS[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
}

// ═══════════════ ATTACHMENT LIGHTBOX ═══════════════

function AttachmentLightbox({
  attachments,
  initialIndex,
  onClose,
}: {
  attachments: { name: string; type: string; dataUrl: string }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const att = attachments[currentIndex];
  const isImage = att?.type.startsWith("image/");
  const total = attachments.length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((i) => (i + 1) % total);
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((i) => (i - 1 + total) % total);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, total]);

  if (!att) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative z-10 flex max-h-[90vh] max-w-[90vw] flex-col items-center">
        {/* Top bar */}
        <div
          className="mb-4 flex w-full items-center justify-between px-2"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            <span
              className="max-w-[300px] truncate text-[13px] text-white/80"
              style={{ fontWeight: 600 }}
            >
              {att.name}
            </span>
            {total > 1 && (
              <span
                className="rounded-full bg-card/10 px-2 py-0.5 text-[11px] text-white/50"
                style={{ fontWeight: 600 }}
              >
                {currentIndex + 1} / {total}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/10 transition-colors hover:bg-card/20"
              download={att.name}
              href={att.dataUrl}
              title="הורדה"
            >
              <Download className="text-white" size={15} />
            </a>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/10 transition-colors hover:bg-card/20"
              onClick={onClose}
              type="button"
            >
              <X className="text-white" size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center"
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            key={currentIndex}
            transition={{ duration: 0.2 }}
          >
            {isImage ? (
              <img
                alt={att.name}
                className="max-h-[75vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
                height="600"
                src={att.dataUrl}
                width="800"
              />
            ) : (
              <div
                className="flex flex-col items-center gap-4 rounded-2xl bg-card p-12 shadow-2xl"
                dir="rtl"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent">
                  <FileText className="text-muted-foreground" size={36} />
                </div>
                <span
                  className="text-[15px] text-foreground"
                  style={{ fontWeight: 600 }}
                >
                  {att.name}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  לא ניתן לצפות בתצוגה מקדימה לסוג קובץ זה
                </span>
                <a
                  className="mt-2 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13px] text-white transition-colors hover:bg-primary-hover"
                  download={att.name}
                  href={att.dataUrl}
                  style={{ fontWeight: 600 }}
                >
                  <Download size={14} />
                  הורד קובץ
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {total > 1 && (
          <>
            <button
              className="absolute top-1/2 left-0 flex h-10 w-10 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-card/15 backdrop-blur-sm transition-colors hover:bg-card/25"
              onClick={() => setCurrentIndex((i) => (i + 1) % total)}
              type="button"
            >
              <ChevronLeft className="text-white" size={20} />
            </button>
            <button
              className="absolute top-1/2 right-0 flex h-10 w-10 translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-card/15 backdrop-blur-sm transition-colors hover:bg-card/25"
              onClick={() => setCurrentIndex((i) => (i - 1 + total) % total)}
              type="button"
            >
              <ChevronRight className="text-white" size={20} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════ TASK CARD ═══════════════

const TaskCard = forwardRef<
  HTMLDivElement,
  {
    task: Task;
    onEdit: (task: Task) => void;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onDragEnd: () => void;
    onOpenLightbox: (attachments: Task["attachments"], index: number) => void;
  }
>(function TaskCard(
  { task, onEdit, isDragging, onDragStart, onDragEnd, onOpenLightbox },
  ref
) {
  const typeConf = TYPE_CONFIG[task.type];
  const prioConf = PRIORITY_CONFIG[task.priority];
  const TypeIcon = typeConf.icon;

  const imageAttachments = (task.attachments || []).filter((a) =>
    a.type.startsWith("image/")
  );
  const nonImageCount =
    (task.attachments || []).length - imageAttachments.length;

  return (
    <motion.div
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      className="group cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-tertiary hover:bg-surface hover:shadow-md"
      draggable
      exit={{ opacity: 0, scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      layout
      onClick={() => onEdit(task)}
      onDragEnd={onDragEnd}
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, task.id)}
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top: Type + Priority */}
      <div className="mb-2.5 flex items-center justify-between">
        <span
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]"
          style={{
            backgroundColor: typeConf.bg,
            color: typeConf.color,
            fontWeight: 700,
          }}
        >
          <TypeIcon size={10} />
          {typeConf.label}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px]"
          style={{
            backgroundColor: prioConf.bg,
            color: prioConf.color,
            fontWeight: 700,
          }}
        >
          {prioConf.label}
        </span>
      </div>

      {/* Title */}
      <h4
        className="mb-1.5 text-[13px] text-foreground leading-[1.5]"
        style={{ fontWeight: 600 }}
      >
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="mb-3 line-clamp-2 text-[11px] text-muted-foreground leading-[1.6]">
          {task.description}
        </p>
      )}

      {/* Image Thumbnails */}
      {imageAttachments.length > 0 && (
        <div className="mb-3 flex gap-1.5">
          {imageAttachments.slice(0, 3).map((att, idx) => {
            const allIdx = (task.attachments || []).indexOf(att);
            return (
              <button
                className="group/thumb relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-border transition-colors hover:border-primary"
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLightbox(task.attachments, allIdx);
                }}
                type="button"
              >
                <img
                  alt={att.name}
                  className="h-full w-full object-cover"
                  height="600"
                  src={att.dataUrl}
                  width="800"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover/thumb:bg-black/20">
                  <ZoomIn
                    className="text-white opacity-0 drop-shadow-md transition-opacity group-hover/thumb:opacity-100"
                    size={14}
                  />
                </div>
              </button>
            );
          })}
          {imageAttachments.length > 3 && (
            <button
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-accent"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLightbox(task.attachments, 3);
              }}
              type="button"
            >
              <span
                className="text-[11px] text-muted-foreground"
                style={{ fontWeight: 700 }}
              >
                +{imageAttachments.length - 3}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {task.tags.map((tag, i) => (
            <span
              className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
              key={i}
              style={{ fontWeight: 600 }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom: Date + Attachments + Grip */}
      <div className="flex items-center justify-between border-accent border-t pt-2.5">
        <div className="flex items-center gap-3">
          {nonImageCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Paperclip size={10} />
              {nonImageCount}
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-tertiary">
            <Calendar size={10} />
            {formatDate(task.createdAt)}
          </span>
        </div>
        <div className="opacity-0 transition-opacity group-hover:opacity-40">
          <GripVertical className="text-muted-foreground" size={12} />
        </div>
      </div>
    </motion.div>
  );
});
TaskCard.displayName = "TaskCard";

// ═══════════════ KANBAN COLUMN ═══════════════

function KanbanColumn({
  column,
  tasks,
  onEditTask,
  onAddTask,
  draggedTaskId,
  onDragStart,
  onDragEnd,
  onDrop,
  onOpenLightbox,
}: {
  column: Column;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onAddTask: (status: Status) => void;
  draggedTaskId: string | null;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: () => void;
  onDrop: (status: Status) => void;
  onOpenLightbox: (attachments: Task["attachments"], index: number) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showBottomFade, setShowBottomFade] = useState(false);

  // Detect if content overflows and whether user scrolled to bottom
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const hasOverflow = el.scrollHeight > el.clientHeight + 2;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
    setShowBottomFade(hasOverflow && !atBottom);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      onDrop(column.id);
      // Smooth scroll to top so the user sees the newly dropped task
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }, 80);
    },
    [column.id, onDrop]
  );

  return (
    <div
      className={`flex h-full min-h-0 w-[255px] min-w-[255px] flex-shrink-0 flex-col transition-all ${dragOver ? "scale-[1.01]" : ""}`}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="mb-4 flex flex-shrink-0 items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: column.dotColor }}
          />
          <span
            className="text-[13px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            {column.label}
          </span>
          <span
            className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-muted-foreground"
            style={{ fontWeight: 700 }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:border-tertiary hover:bg-accent"
          onClick={() => onAddTask(column.id)}
          type="button"
        >
          <Plus className="text-muted-foreground" size={14} />
        </button>
      </div>

      {/* Drop Zone — scrollable, with fade indicator */}
      <div className="relative min-h-0 flex-1">
        <div
          className={`kanban-scroll h-full space-y-3 overflow-y-auto rounded-xl p-1.5 transition-colors ${
            dragOver ? "bg-primary/5 ring-2 ring-[#ff8c00]/30 ring-dashed" : ""
          }`}
          ref={scrollRef}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d4cdc3 transparent",
          }}
        >
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskCard
                isDragging={draggedTaskId === task.id}
                key={task.id}
                onDragEnd={onDragEnd}
                onDragStart={onDragStart}
                onEdit={onEditTask}
                onOpenLightbox={onOpenLightbox}
                task={task}
              />
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 opacity-40">
              <LayoutGrid className="mb-2 text-muted-foreground" size={24} />
              <span className="text-[12px] text-muted-foreground">
                אין משימות
              </span>
            </div>
          )}
        </div>

        {/* Bottom fade-out gradient — visible when more content below */}
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 rounded-b-xl transition-opacity duration-300"
          style={{
            opacity: showBottomFade ? 1 : 0,
            background:
              "linear-gradient(to bottom, transparent 0%, #f8f7f5 90%)",
          }}
        />
      </div>
    </div>
  );
}

// ═══════════════ TASK MODAL ═══════════════

function TaskModal({
  task,
  isNew,
  activeVersion,
  onSave,
  onDelete,
  onClose,
}: {
  task: Task;
  isNew: boolean;
  activeVersion: Version;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Task>({ ...task });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const [titleError, setTitleError] = useState("");
  const { requestDelete: requestTaskDelete, modal: taskDeleteModal } =
    useConfirmDelete();

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const update = (field: keyof Task, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title") {
      setTitleError("");
    }
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      setTitleError("כותרת המשימה היא שדה חובה");
      titleRef.current?.focus();
      return;
    }
    if (form.title.trim().length < 2) {
      setTitleError("כותרת חייבת להכיל לפחות 2 תווים");
      titleRef.current?.focus();
      return;
    }
    onSave(form);
  };

  const isTitleValid = form.title.trim().length >= 2;

  const selectArrowStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238d785e' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "left 12px center",
  };

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative flex max-h-[90vh] w-full max-w-[860px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        dir="rtl"
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-accent border-b px-8 pt-7 pb-4">
          <div className="flex items-center gap-3">
            <div>
              <h2
                className="text-[22px] text-foreground"
                style={{ fontWeight: 700 }}
              >
                {isNew ? "משימה חדשה" : "עריכת משימה"}
              </h2>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                {isNew ? "צור משימה חדשה ללוח." : "ערוך את פרטי המשימה."}
              </p>
            </div>
            <span
              className="rounded-lg px-2.5 py-1 text-[11px]"
              style={{
                fontWeight: 700,
                backgroundColor: activeVersion === "V1" ? "#fff7ed" : "#f5f3ff",
                color: activeVersion === "V1" ? "#ff8c00" : "#a78bfa",
              }}
            >
              {activeVersion}
            </span>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-accent"
            onClick={onClose}
            type="button"
          >
            <X className="text-muted-foreground" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="flex gap-6">
            {/* Right — Title + Description */}
            <div className="flex-[2] space-y-5">
              <div>
                <label
                  className="mb-2 block text-[13px] text-foreground"
                  htmlFor="kanban-title"
                  style={{ fontWeight: 600 }}
                >
                  כותרת
                </label>
                <input
                  className={`w-full rounded-xl border bg-background px-4 py-3 text-[14px] text-foreground placeholder-tertiary transition-all focus:outline-none focus:ring-2 ${
                    titleError
                      ? "border-red-400 bg-destructive/10/30 focus:border-red-400 focus:ring-red-200"
                      : isTitleValid
                        ? "border-green-400 focus:border-green-400 focus:ring-green-200"
                        : "border-border focus:border-primary focus:ring-primary/10"
                  }`}
                  id="kanban-title"
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="שם המשימה..."
                  ref={titleRef}
                  type="text"
                  value={form.title}
                />
                {titleError && (
                  <p
                    className="mt-1 flex items-center gap-1 text-[12px] text-destructive"
                    style={{ fontWeight: 500 }}
                  >
                    <AlertCircle size={12} />
                    {titleError}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="mb-2 block text-[13px] text-foreground"
                  htmlFor="kanban-description"
                  style={{ fontWeight: 600 }}
                >
                  תיאור
                </label>
                <textarea
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-[13px] text-foreground placeholder-tertiary transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  id="kanban-description"
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="תאר את המשימה..."
                  rows={8}
                  value={form.description}
                />
              </div>
              {/* ── Attachments ── */}
              <div>
                <label
                  className="mb-2 block text-[13px] text-foreground"
                  htmlFor="kanban-attachments"
                  style={{ fontWeight: 600 }}
                >
                  קבצים מצורפים
                </label>

                {/* Existing attachments */}
                {form.attachments && form.attachments.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {form.attachments.map((att, idx) => {
                      const isImage = att.type.startsWith("image/");
                      return (
                        <div
                          className="flex items-center gap-3 rounded-lg border border-border bg-background p-2.5 transition-colors hover:border-tertiary"
                          key={idx}
                        >
                          <button
                            className="group/att flex min-w-0 flex-1 cursor-pointer items-center gap-3"
                            onClick={() => setLightboxIndex(idx)}
                            type="button"
                          >
                            {isImage ? (
                              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                                <img
                                  alt={att.name}
                                  className="h-full w-full object-cover"
                                  height="600"
                                  src={att.dataUrl}
                                  width="800"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover/att:bg-black/20">
                                  <Eye
                                    className="text-white opacity-0 drop-shadow-md transition-opacity group-hover/att:opacity-100"
                                    size={12}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent transition-colors group-hover/att:bg-border">
                                <FileText
                                  className="text-muted-foreground"
                                  size={16}
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1 text-right">
                              <span className="block truncate text-[12px] text-foreground">
                                {att.name}
                              </span>
                              <span className="block text-[10px] text-tertiary">
                                {isImage ? "לחץ לצפייה" : "לחץ לפרטים"}
                              </span>
                            </div>
                          </button>
                          <button
                            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-destructive/10"
                            onClick={() => {
                              requestTaskDelete({
                                title: "מחיקת קובץ מצורף",
                                itemName: att.name,
                                onConfirm: async () => {
                                  setForm((prev) => ({
                                    ...prev,
                                    attachments:
                                      prev.attachments?.filter(
                                        (_, i) => i !== idx
                                      ) || [],
                                  }));
                                },
                              });
                            }}
                            type="button"
                          >
                            <Trash2 className="text-destructive" size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upload area */}
                <label className="group flex cursor-pointer items-center gap-3 rounded-xl border-2 border-border border-dashed px-4 py-4 transition-colors hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent transition-colors group-hover:bg-primary/10">
                      <ImagePlus
                        className="text-muted-foreground transition-colors group-hover:text-primary"
                        size={16}
                      />
                    </div>
                    <div>
                      <span
                        className="block text-[12px] text-foreground"
                        style={{ fontWeight: 600 }}
                      >
                        הוסף תמונה או קובץ
                      </span>
                      <span className="block text-[10px] text-tertiary">
                        PNG, JPG, PDF, DOC — עד 5MB
                      </span>
                    </div>
                  </div>
                  <input
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    className="hidden"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) {
                        return;
                      }
                      Array.from(files).forEach((file) => {
                        if (file.size > 5 * 1024 * 1024) {
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          setForm((prev) => ({
                            ...prev,
                            attachments: [
                              ...(prev.attachments || []),
                              {
                                name: file.name,
                                type: file.type,
                                dataUrl: reader.result as string,
                              },
                            ],
                          }));
                        };
                        reader.readAsDataURL(file);
                      });
                      e.target.value = "";
                    }}
                    type="file"
                  />
                </label>
              </div>
            </div>

            {/* Left — Properties */}
            <div className="w-[240px] space-y-4 rounded-xl border border-border bg-background p-5">
              <div
                className="mb-1 text-[11px] text-muted-foreground tracking-wide"
                style={{ fontWeight: 700 }}
              >
                מאפיינים
              </div>

              <div>
                <label
                  className="mb-1.5 block text-[12px] text-foreground"
                  htmlFor="kanban-status"
                  style={{ fontWeight: 600 }}
                >
                  סטטוס
                </label>
                <select
                  className="w-full cursor-pointer appearance-none rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] text-foreground transition-colors focus:border-primary focus:outline-none"
                  id="kanban-status"
                  onChange={(e) => update("status", e.target.value)}
                  style={selectArrowStyle}
                  value={form.status}
                >
                  <option value="ideas">בנק הצעות</option>
                  <option value="todo">לביצוע</option>
                  <option value="in-progress">בעבודה</option>
                  <option value="on-hold">בהמתנה</option>
                  <option value="done">הושלם</option>
                </select>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-[12px] text-foreground"
                  htmlFor="kanban-priority"
                  style={{ fontWeight: 600 }}
                >
                  עדיפות
                </label>
                <select
                  className="w-full cursor-pointer appearance-none rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] text-foreground transition-colors focus:border-primary focus:outline-none"
                  id="kanban-priority"
                  onChange={(e) => update("priority", e.target.value)}
                  style={selectArrowStyle}
                  value={form.priority}
                >
                  <option value="HIGH">גבוהה</option>
                  <option value="MEDIUM">בינונית</option>
                  <option value="LOW">נמוכה</option>
                </select>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-[12px] text-foreground"
                  htmlFor="kanban-type"
                  style={{ fontWeight: 600 }}
                >
                  סוג
                </label>
                <select
                  className="w-full cursor-pointer appearance-none rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] text-foreground transition-colors focus:border-primary focus:outline-none"
                  id="kanban-type"
                  onChange={(e) => update("type", e.target.value)}
                  style={selectArrowStyle}
                  value={form.type}
                >
                  <option value="TASK">משימה</option>
                  <option value="FEATURE">פיצ׳ר</option>
                  <option value="BUG">באג</option>
                </select>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-[12px] text-foreground"
                  htmlFor="kanban-feature"
                  style={{ fontWeight: 600 }}
                >
                  פיצ׳ר
                </label>
                <select
                  className="w-full cursor-pointer appearance-none rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] text-foreground transition-colors focus:border-primary focus:outline-none"
                  id="kanban-feature"
                  onChange={(e) => update("feature", e.target.value)}
                  style={selectArrowStyle}
                  value={form.feature}
                >
                  {FEATURE_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-[12px] text-foreground"
                  htmlFor="kanban-version"
                  style={{ fontWeight: 600 }}
                >
                  גרסה
                </label>
                <select
                  className="w-full cursor-pointer appearance-none rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] text-foreground transition-colors focus:border-primary focus:outline-none"
                  id="kanban-version"
                  onChange={(e) => update("version", e.target.value)}
                  style={selectArrowStyle}
                  value={form.version}
                >
                  <option value="V1">V1 — MVP</option>
                  <option value="V2">V2 — הרחבה</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-accent border-t bg-surface px-8 py-5">
          <div>
            {!isNew && (
              <button
                className="rounded-lg px-4 py-2 text-[13px] text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
                onClick={() =>
                  requestTaskDelete({
                    title: "מחיקת משימה",
                    itemName: form.title,
                    onConfirm: async () => {
                      onDelete(form.id);
                      onClose();
                    },
                  })
                }
                style={{ fontWeight: 600 }}
                type="button"
              >
                מחיקה
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-border bg-card px-5 py-2.5 text-[13px] text-foreground transition-colors hover:bg-accent"
              onClick={onClose}
              style={{ fontWeight: 600 }}
              type="button"
            >
              ביטול
            </button>
            <button
              className="rounded-xl bg-primary px-6 py-2.5 text-[13px] text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!isTitleValid}
              onClick={handleSave}
              style={{ fontWeight: 600 }}
              type="button"
            >
              {isNew ? "צור משימה" : "שמור שינויים"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Lightbox inside modal */}
      <AnimatePresence>
        {lightboxIndex !== null &&
          form.attachments &&
          form.attachments.length > 0 && (
            <AttachmentLightbox
              attachments={form.attachments}
              initialIndex={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
            />
          )}
      </AnimatePresence>
      {taskDeleteModal}
    </motion.div>
  );
}

// ═══════════════ STATS BAR ═══════════════

function StatsBar({ tasks }: { tasks: Task[] }) {
  // Exclude ideas — they have their own view now
  const activeTasks = tasks.filter((t) => t.status !== "ideas");
  const total = activeTasks.length;
  const done = activeTasks.filter((t) => t.status === "done").length;
  const inProgress = activeTasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const todo = activeTasks.filter((t) => t.status === "todo").length;
  const highPriority = activeTasks.filter(
    (t) => t.priority === "HIGH" && t.status !== "done"
  ).length;

  return (
    <div className="flex flex-wrap items-center gap-5 text-[12px]">
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-muted-foreground">סה״כ משימות:</span>
        <span className="text-foreground" style={{ fontWeight: 700 }}>
          {total}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-success" />
        <span className="text-muted-foreground">הושלמו:</span>
        <span className="text-success" style={{ fontWeight: 700 }}>
          {done}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-muted-foreground">בעבודה:</span>
        <span className="text-primary" style={{ fontWeight: 700 }}>
          {inProgress}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
        <span className="text-muted-foreground">לביצוע:</span>
        <span className="text-foreground" style={{ fontWeight: 700 }}>
          {todo}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-destructive" />
        <span className="text-muted-foreground">עדיפות גבוהה:</span>
        <span className="text-destructive" style={{ fontWeight: 700 }}>
          {highPriority}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mr-auto flex items-center gap-2">
        <span className="text-muted-foreground">התקדמות:</span>
        <div className="h-2 w-28 overflow-hidden rounded-full bg-accent">
          <div
            className="h-full rounded-full bg-gradient-to-l from-primary to-[#22c55e] transition-all duration-500"
            style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
          />
        </div>
        <span className="text-foreground" style={{ fontWeight: 700 }}>
          {total > 0 ? Math.round((done / total) * 100) : 0}%
        </span>
      </div>
    </div>
  );
}

// ═══════════════ IDEAS BANK VIEW ═══════════════

type ViewMode = "kanban" | "ideas";

function IdeasBank({
  tasks,
  version,
  onEdit,
  onPromote,
  onAdd,
}: {
  tasks: Task[];
  version: Version;
  onEdit: (task: Task) => void;
  onPromote: (task: Task) => void;
  onAdd: () => void;
}) {
  const ideas = tasks.filter(
    (t) => t.status === "ideas" && t.version === version
  );
  const [filterFeature, setFilterFeature] = useState<string>("ALL");

  const features = Array.from(new Set(ideas.map((t) => t.feature))).sort();
  const filtered =
    filterFeature === "ALL"
      ? ideas
      : ideas.filter((t) => t.feature === filterFeature);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-6">
      {/* Sub-header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-chart-5/10">
            <Lightbulb className="text-chart-5" size={18} />
          </div>
          <div>
            <h2
              className="text-[16px] text-foreground"
              style={{ fontWeight: 700 }}
            >
              בנק הצעות — {version}
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {ideas.length} רעיונות לפיתוח עתידי
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12px] text-white shadow-md transition-colors"
          onClick={onAdd}
          style={{
            fontWeight: 600,
            backgroundColor: "#a78bfa",
            boxShadow: "0 4px 12px #a78bfa33",
          }}
          type="button"
        >
          <Plus size={14} />
          הצעה חדשה
        </button>
      </div>

      {/* Feature filter chips */}
      {features.length > 1 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span
            className="text-[11px] text-muted-foreground"
            style={{ fontWeight: 600 }}
          >
            סינון לפי פיצ'ר:
          </span>
          <button
            className={`rounded-lg px-3 py-1.5 text-[11px] transition-colors ${
              filterFeature === "ALL"
                ? "bg-chart-5 text-white"
                : "bg-accent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setFilterFeature("ALL")}
            style={{ fontWeight: 600 }}
            type="button"
          >
            הכל ({ideas.length})
          </button>
          {features.map((f) => {
            const count = ideas.filter((t) => t.feature === f).length;
            return (
              <button
                className={`rounded-lg px-3 py-1.5 text-[11px] transition-colors ${
                  filterFeature === f
                    ? "bg-chart-5 text-white"
                    : "bg-accent text-muted-foreground hover:text-foreground"
                }`}
                key={f}
                onClick={() => setFilterFeature(f)}
                style={{ fontWeight: 600 }}
                type="button"
              >
                {f} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Ideas grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-5/10">
            <Lightbulb className="text-chart-5" size={28} />
          </div>
          <p
            className="text-[14px] text-muted-foreground"
            style={{ fontWeight: 600 }}
          >
            אין הצעות עדיין
          </p>
          <p className="mt-1 text-[12px] text-tertiary">
            לחצו על ״הצעה חדשה״ כדי להוסיף רעיון
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((task) => {
              const TypeIcon = TYPE_CONFIG[task.type].icon;
              return (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="group cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all hover:border-chart-5/30 hover:shadow-lg"
                  exit={{ opacity: 0, scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  key={task.id}
                  layout
                  onClick={() => onEdit(task)}
                >
                  {/* Top row: type + priority */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px]"
                        style={{
                          fontWeight: 700,
                          backgroundColor: TYPE_CONFIG[task.type].bg,
                          color: TYPE_CONFIG[task.type].color,
                        }}
                      >
                        <TypeIcon size={10} />
                        {TYPE_CONFIG[task.type].label}
                      </div>
                      <div
                        className="rounded-md px-2 py-1 text-[10px]"
                        style={{
                          fontWeight: 700,
                          backgroundColor: PRIORITY_CONFIG[task.priority].bg,
                          color: PRIORITY_CONFIG[task.priority].color,
                        }}
                      >
                        {PRIORITY_CONFIG[task.priority].label}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="mb-2 text-[14px] text-foreground leading-snug"
                    style={{ fontWeight: 700 }}
                  >
                    {task.title}
                  </h3>

                  {/* Description */}
                  {task.description && (
                    <p className="mb-3 line-clamp-3 text-[12px] text-muted-foreground leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Feature + Tags */}
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground"
                      style={{ fontWeight: 600 }}
                    >
                      {task.feature}
                    </span>
                    {task.tags.slice(0, 2).map((tag) => (
                      <span
                        className="rounded-full bg-chart-5/10 px-2 py-0.5 text-[10px] text-chart-5"
                        key={tag}
                        style={{ fontWeight: 600 }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Promote button */}
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border border-dashed py-2.5 text-[12px] text-muted-foreground opacity-0 transition-all hover:border-chart-5 hover:bg-chart-5/5 hover:text-chart-5 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPromote(task);
                    }}
                    style={{ fontWeight: 600 }}
                    type="button"
                  >
                    <MoveRight size={14} />
                    העבר ללביצוע
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ═══════════════ MAIN KANBAN BOARD ═══════════════

export function KanbanBoard() {
  // ─── State ─────────────────────────────────────
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Fast initial load from localStorage cache while server loads
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    return INITIAL_TASKS;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [activeVersion, setActiveVersion] = useState<Version>("V1");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);
  const [lightboxData, setLightboxData] = useState<{
    attachments: Task["attachments"];
    index: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TaskType | "ALL">("ALL");
  const [filterPriority, setFilterPriority] = useState<Priority | "ALL">("ALL");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const mountedRef = useRef(true);

  // ─── Convex hooks ───
  const serverTasks = useQuery(api.kanbanTasks.list);
  const seedMutation = useMutation(api.kanbanTasks.seed);
  const createMutation = useMutation(api.kanbanTasks.create);
  const updateMutation = useMutation(api.kanbanTasks.update);
  const removeMutation = useMutation(api.kanbanTasks.remove);

  // ─── Seed on mount (idempotent) ─────────────────
  useEffect(() => {
    mountedRef.current = true;
    const tasksToSeed = INITIAL_TASKS.map(({ attachments, ...rest }) => rest);
    seedMutation({
      tasks: tasksToSeed as any[],
      version: KANBAN_SEED_VERSION,
    }).catch((err) => console.error("[Kanban] Seed failed:", err));
    return () => {
      mountedRef.current = false;
    };
  }, [seedMutation]);

  // ─── Sync server tasks to local state ───────────
  useEffect(() => {
    if (serverTasks === undefined) {
      return; // Still loading
    }
    if (serverTasks.length > 0) {
      setTasks(serverTasks as Task[]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serverTasks));
      setSyncError(false);
    }
    setIsLoading(false);
  }, [serverTasks]);

  // ─── Cache to localStorage on change ───────────
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  // ─── Server sync helpers ───────────────────────
  const syncToServer = useCallback(
    async (action: string, fn: () => Promise<void>) => {
      setIsSyncing(true);
      try {
        await fn();
        setSyncError(false);
      } catch (err) {
        console.error(`[Kanban] Sync failed (${action}):`, err);
        setSyncError(true);
      } finally {
        if (mountedRef.current) {
          setIsSyncing(false);
        }
      }
    },
    []
  );

  // ─── Filtering ─────────────────────────────────
  const versionTasks = tasks.filter((t) => t.version === activeVersion);

  const filteredTasks = versionTasks.filter((task) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !(
          task.title.toLowerCase().includes(q) ||
          task.description.toLowerCase().includes(q)
        )
      ) {
        return false;
      }
    }
    if (filterType !== "ALL" && task.type !== filterType) {
      return false;
    }
    if (filterPriority !== "ALL" && task.priority !== filterPriority) {
      return false;
    }
    return true;
  });

  const getColumnTasks = useCallback(
    (status: Status) =>
      filteredTasks
        .filter((t) => t.status === status)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [filteredTasks]
  );

  // ─── Handlers with server sync ─────────────────
  const handleAddTask = (status: Status) => {
    const newTask: Task = {
      id: generateId(),
      title: "",
      description: "",
      type: "TASK",
      priority: "MEDIUM",
      status,
      feature: FEATURE_OPTIONS[0],
      estimate: "",
      tags: [],
      createdAt: new Date().toISOString().split("T")[0],
      version: activeVersion,
    };
    setEditingTask(newTask);
    setIsNewTask(true);
  };

  const handleSaveTask = (task: Task) => {
    const creating = isNewTask; // Capture before state changes

    // Optimistic update
    if (creating) {
      setTasks((prev) => [...prev, task]);
    } else {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    }
    setEditingTask(null);
    setIsNewTask(false);

    // Sync to server (without attachments — they're too large)
    const { attachments, id: taskId, ...serverTask } = task;
    if (creating) {
      syncToServer("create", () =>
        createMutation(serverTask as any).then(() => {})
      );
    } else {
      syncToServer("update", () =>
        updateMutation({ id: taskId as any, ...serverTask } as any).then(
          () => {}
        )
      );
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    syncToServer("delete", () =>
      removeMutation({ id: id as any }).then(() => {})
    );
  };

  const handleDragStart = (_e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDrop = (targetStatus: Status) => {
    if (!draggedTaskId) {
      return;
    }
    const taskId = draggedTaskId; // Capture before state changes
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === targetStatus) {
      setDraggedTaskId(null);
      return;
    }

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );
    setDraggedTaskId(null);

    // Sync to server
    syncToServer("move", () =>
      updateMutation({ id: taskId as any, status: targetStatus }).then(() => {})
    );
  };

  const handlePromoteIdea = (task: Task) => {
    const promoted = { ...task, status: "todo" as Status };
    setTasks((prev) => prev.map((t) => (t.id === task.id ? promoted : t)));
    syncToServer("promote", () =>
      updateMutation({ id: task.id as any, status: "todo" }).then(() => {})
    );
  };

  const handleAddIdea = () => {
    const newTask: Task = {
      id: generateId(),
      title: "",
      description: "",
      type: "FEATURE",
      priority: "MEDIUM",
      status: "ideas",
      feature: FEATURE_OPTIONS[0],
      estimate: "",
      tags: [],
      createdAt: new Date().toISOString().split("T")[0],
      version: activeVersion,
    };
    setEditingTask(newTask);
    setIsNewTask(true);
  };

  const handleRefreshFromServer = async () => {
    // With Convex useQuery, data is always live — just re-sync from latest
    if (serverTasks && serverTasks.length > 0) {
      setTasks(serverTasks as Task[]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serverTasks));
      setSyncError(false);
      appToast.success("סונכרן", "הנתונים עודכנו מהשרת");
    }
  };

  // Count tasks per version for the tabs
  const v1Count = tasks.filter((t) => t.version === "V1").length;
  const v2Count = tasks.filter((t) => t.version === "V2").length;
  const versionCounts: Record<Version, number> = { V1: v1Count, V2: v2Count };
  const ideasCount = tasks.filter(
    (t) => t.status === "ideas" && t.version === activeVersion
  ).length;

  const TYPE_FILTER_LABELS: Record<string, string> = {
    ALL: "הכל",
    TASK: "משימה",
    FEATURE: "פיצ׳ר",
    BUG: "באג",
  };
  const PRIO_FILTER_LABELS: Record<string, string> = {
    ALL: "הכל",
    HIGH: "גבוהה",
    MEDIUM: "בינונית",
    LOW: "נמוכה",
  };

  const activeTabColor =
    VERSION_TABS.find((v) => v.id === activeVersion)?.color || "#ff8c00";

  return (
    <div
      className="flex h-screen flex-col overflow-hidden bg-background"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex-shrink-0 border-border border-b bg-card">
        <div className="mx-auto max-w-[1500px] px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <LayoutGrid className="text-primary" size={20} />
                </div>
                <div>
                  <h1
                    className="text-[20px] text-foreground"
                    style={{ fontWeight: 700 }}
                  >
                    לוח משימות
                  </h1>
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] text-muted-foreground">
                      ניהול משימות פיתוח Eventos
                    </p>
                    {/* Sync status indicator */}
                    {isSyncing ? (
                      <div
                        className="flex items-center gap-1 text-[10px] text-primary"
                        style={{ fontWeight: 600 }}
                      >
                        <Loader2 className="animate-spin" size={10} />
                        <span>שומר...</span>
                      </div>
                    ) : syncError ? (
                      <div
                        className="flex items-center gap-1 text-[10px] text-destructive"
                        style={{ fontWeight: 600 }}
                      >
                        <CloudOff size={10} />
                        <span>לא מסונכרן</span>
                      </div>
                    ) : isLoading ? null : (
                      <div
                        className="flex items-center gap-1 text-[10px] text-success"
                        style={{ fontWeight: 600 }}
                      >
                        <Cloud size={10} />
                        <span>מסונכרן</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ══════ VERSION TABS ══════ */}
              <div className="mr-4 flex items-center rounded-xl bg-accent p-1">
                {VERSION_TABS.map((tab) => {
                  const isActive = activeVersion === tab.id;
                  return (
                    <button
                      className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] transition-all ${
                        isActive ? "bg-card shadow-sm" : "hover:bg-card/50"
                      }`}
                      key={tab.id}
                      onClick={() => setActiveVersion(tab.id)}
                      style={{ fontWeight: isActive ? 700 : 500 }}
                      type="button"
                    >
                      <Layers
                        size={14}
                        style={{ color: isActive ? tab.color : "#8d785e" }}
                      />
                      <span style={{ color: isActive ? tab.color : "#8d785e" }}>
                        {tab.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {tab.subtitle}
                      </span>
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[10px]"
                        style={{
                          fontWeight: 700,
                          backgroundColor: isActive
                            ? `${tab.color}15`
                            : "#e7e1da",
                          color: isActive ? tab.color : "#8d785e",
                        }}
                      >
                        {versionCounts[tab.id]}
                      </span>
                      {isActive && (
                        <motion.div
                          className="absolute right-3 bottom-0 left-3 h-[2px] rounded-full"
                          layoutId="version-indicator"
                          style={{ backgroundColor: tab.color }}
                          transition={{ duration: 0.25 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ══════ VIEW MODE TOGGLE ══════ */}
              <div className="mr-2 flex items-center rounded-xl bg-accent p-1">
                <button
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] transition-all ${
                    viewMode === "kanban"
                      ? "bg-card shadow-sm"
                      : "hover:bg-card/50"
                  }`}
                  onClick={() => setViewMode("kanban")}
                  style={{ fontWeight: viewMode === "kanban" ? 700 : 500 }}
                  type="button"
                >
                  <LayoutGrid
                    size={13}
                    style={{
                      color: viewMode === "kanban" ? "#ff8c00" : "#8d785e",
                    }}
                  />
                  <span
                    style={{
                      color: viewMode === "kanban" ? "#ff8c00" : "#8d785e",
                    }}
                  >
                    לוח קנבן
                  </span>
                </button>
                <button
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] transition-all ${
                    viewMode === "ideas"
                      ? "bg-card shadow-sm"
                      : "hover:bg-card/50"
                  }`}
                  onClick={() => setViewMode("ideas")}
                  style={{ fontWeight: viewMode === "ideas" ? 700 : 500 }}
                  type="button"
                >
                  <Lightbulb
                    size={13}
                    style={{
                      color: viewMode === "ideas" ? "#a78bfa" : "#8d785e",
                    }}
                  />
                  <span
                    style={{
                      color: viewMode === "ideas" ? "#a78bfa" : "#8d785e",
                    }}
                  >
                    בנק הצעות
                  </span>
                  {ideasCount > 0 && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px]"
                      style={{
                        fontWeight: 700,
                        backgroundColor:
                          viewMode === "ideas" ? "#a78bfa15" : "#e7e1da",
                        color: viewMode === "ideas" ? "#a78bfa" : "#8d785e",
                      }}
                    >
                      {ideasCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Kanban-specific controls */}
              {viewMode === "kanban" && (
                <>
                  {/* Search */}
                  <div className="relative">
                    <Search
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-tertiary"
                      size={14}
                    />
                    <input
                      className="w-52 rounded-xl border border-border bg-background py-2 pr-9 pl-3 text-[12px] text-foreground placeholder-tertiary transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="חיפוש משימות..."
                      type="text"
                      value={searchQuery}
                    />
                  </div>

                  {/* Filter toggle */}
                  <button
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] transition-colors ${
                      showFilters ||
                      filterType !== "ALL" ||
                      filterPriority !== "ALL"
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ fontWeight: 600 }}
                    type="button"
                  >
                    <Filter size={13} />
                    סינון
                    {(filterType !== "ALL" || filterPriority !== "ALL") && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>

                  {/* Add task */}
                  <button
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12px] text-white shadow-md transition-colors"
                    onClick={() => handleAddTask("todo")}
                    style={{
                      fontWeight: 600,
                      backgroundColor: activeTabColor,
                      boxShadow: `0 4px 12px ${activeTabColor}33`,
                    }}
                    type="button"
                  >
                    <Plus size={14} />
                    משימה חדשה
                  </button>
                </>
              )}

              {/* Refresh from server */}
              <button
                className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                disabled={isLoading}
                onClick={handleRefreshFromServer}
                style={{ fontWeight: 600 }}
                title="רענון מהשרת"
                type="button"
              >
                <RefreshCw
                  className={isLoading ? "animate-spin" : ""}
                  size={13}
                />
                רענון
              </button>
            </div>
          </div>

          {/* Filter bar — kanban only */}
          <AnimatePresence>
            {showFilters && viewMode === "kanban" && (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                className="overflow-hidden"
                exit={{ height: 0, opacity: 0 }}
                initial={{ height: 0, opacity: 0 }}
              >
                <div className="flex items-center gap-4 border-accent border-t py-3">
                  <span
                    className="text-[12px] text-muted-foreground"
                    style={{ fontWeight: 600 }}
                  >
                    סוג:
                  </span>
                  <div className="flex gap-1">
                    {(["ALL", "TASK", "FEATURE", "BUG"] as const).map((t) => (
                      <button
                        className={`rounded-lg px-3 py-1.5 text-[11px] transition-colors ${
                          filterType === t
                            ? "bg-primary text-white"
                            : "bg-accent text-muted-foreground hover:text-foreground"
                        }`}
                        key={t}
                        onClick={() => setFilterType(t)}
                        style={{ fontWeight: 600 }}
                        type="button"
                      >
                        {TYPE_FILTER_LABELS[t]}
                      </button>
                    ))}
                  </div>

                  <div className="h-5 w-px bg-border" />

                  <span
                    className="text-[12px] text-muted-foreground"
                    style={{ fontWeight: 600 }}
                  >
                    עדיפות:
                  </span>
                  <div className="flex gap-1">
                    {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((p) => (
                      <button
                        className={`rounded-lg px-3 py-1.5 text-[11px] transition-colors ${
                          filterPriority === p
                            ? "bg-primary text-white"
                            : "bg-accent text-muted-foreground hover:text-foreground"
                        }`}
                        key={p}
                        onClick={() => setFilterPriority(p)}
                        style={{ fontWeight: 600 }}
                        type="button"
                      >
                        {PRIO_FILTER_LABELS[p]}
                      </button>
                    ))}
                  </div>

                  {(filterType !== "ALL" || filterPriority !== "ALL") && (
                    <button
                      className="mr-auto text-[11px] text-destructive transition-colors hover:text-destructive"
                      onClick={() => {
                        setFilterType("ALL");
                        setFilterPriority("ALL");
                      }}
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      נקה סינון
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats — scoped to active version, kanban only */}
          {viewMode === "kanban" && (
            <div className="mt-3">
              <StatsBar tasks={versionTasks} />
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* Loading overlay on initial load */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-primary" size={28} />
              <span
                className="text-[13px] text-muted-foreground"
                style={{ fontWeight: 600 }}
              >
                טוען משימות מהשרת...
              </span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {viewMode === "kanban" ? (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="mx-auto min-h-0 w-full max-w-[1500px] flex-1 overflow-x-auto px-6 py-6"
              exit={{ opacity: 0, x: -20 }}
              initial={{ opacity: 0, x: 20 }}
              key={`kanban-${activeVersion}`}
              transition={{ duration: 0.25 }}
            >
              <div className="flex h-full min-w-max justify-center gap-4">
                {COLUMNS.map((column) => (
                  <KanbanColumn
                    column={column}
                    draggedTaskId={draggedTaskId}
                    key={column.id}
                    onAddTask={handleAddTask}
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onEditTask={(task) => {
                      setEditingTask(task);
                      setIsNewTask(false);
                    }}
                    onOpenLightbox={(attachments, index) =>
                      setLightboxData({ attachments, index })
                    }
                    tasks={getColumnTasks(column.id)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="kanban-scroll min-h-0 flex-1 overflow-y-auto"
              exit={{ opacity: 0, x: 20 }}
              initial={{ opacity: 0, x: -20 }}
              key={`ideas-${activeVersion}`}
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#d4cdc3 transparent",
              }}
              transition={{ duration: 0.25 }}
            >
              <IdeasBank
                onAdd={handleAddIdea}
                onEdit={(task) => {
                  setEditingTask(task);
                  setIsNewTask(false);
                }}
                onPromote={handlePromoteIdea}
                tasks={tasks}
                version={activeVersion}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {editingTask && (
          <TaskModal
            activeVersion={activeVersion}
            isNew={isNewTask}
            onClose={() => {
              setEditingTask(null);
              setIsNewTask(false);
            }}
            onDelete={handleDeleteTask}
            onSave={handleSaveTask}
            task={editingTask}
          />
        )}
      </AnimatePresence>

      {/* Card-level Lightbox (from task card thumbnail clicks) */}
      <AnimatePresence>
        {lightboxData?.attachments && lightboxData.attachments.length > 0 && (
          <AttachmentLightbox
            attachments={lightboxData.attachments}
            initialIndex={lightboxData.index}
            onClose={() => setLightboxData(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
