import { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Search, Filter, GripVertical,
  AlertCircle, Calendar, Paperclip, ImagePlus, FileText, Trash2,
  Bug, Sparkles, Wrench, LayoutGrid, Layers,
  ChevronRight, ChevronLeft, Download, ZoomIn, Eye,
  Cloud, CloudOff, RefreshCw, Loader2,
  Lightbulb, ArrowLeftCircle, MoveRight
} from 'lucide-react';
import { kanbanApi } from './api';
import { useConfirmDelete } from './ConfirmDeleteModal';

// ═══════════════ TYPES ═══════════════

type TaskType = 'TASK' | 'FEATURE' | 'BUG';
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type Status = 'ideas' | 'todo' | 'in-progress' | 'on-hold' | 'done';
type Version = 'V1' | 'V2';

interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: Priority;
  status: Status;
  feature: string;
  estimate: string;
  tags: string[];
  createdAt: string;
  version: Version;
  attachments?: { name: string; type: string; dataUrl: string }[];
}

interface Column {
  id: Status;
  label: string;
  dotColor: string;
}

// ═══════════════ CONSTANTS ═══════════════

const COLUMNS: Column[] = [
  { id: 'todo', label: 'לביצוע', dotColor: '#8d785e' },
  { id: 'in-progress', label: 'בעבודה', dotColor: '#ff8c00' },
  { id: 'on-hold', label: 'בהמתנה', dotColor: '#eab308' },
  { id: 'done', label: 'הושלם', dotColor: '#22c55e' },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  HIGH: { label: 'גבוהה', color: '#dc2626', bg: '#fef2f2' },
  MEDIUM: { label: 'בינונית', color: '#d97706', bg: '#fffbeb' },
  LOW: { label: 'נמוכה', color: '#16a34a', bg: '#f0fdf4' },
};

const TYPE_CONFIG: Record<TaskType, { label: string; color: string; bg: string; icon: typeof Wrench }> = {
  TASK: { label: 'משימה', color: '#8d785e', bg: '#f5f0ea', icon: Wrench },
  FEATURE: { label: 'פיצ׳ר', color: '#ff8c00', bg: '#fff7ed', icon: Sparkles },
  BUG: { label: 'באג', color: '#dc2626', bg: '#fef2f2', icon: Bug },
};

const FEATURE_OPTIONS = [
  'דשבורד',
  'עורך הצעות מחיר',
  'בנק ספקים',
  'כרטיס ספק',
  'תצוגת לקוח',
  'אשף סיווג ספקים',
  'אשף ייבוא',
  'מוצרים סרוקים',
  'רשימת פרויקטים',
  'תשתית כללית',
  'אודיט ותיקוני באגים',
  'Layout וניווט',
  'מערכת תמונות ואחסון',
];

const STORAGE_KEY = 'travelpro-kanban-v11';
const KANBAN_SEED_VERSION = 'v11'; // Bump to seed new INITIAL_TASKS to server

const VERSION_TABS: { id: Version; label: string; subtitle: string; color: string }[] = [
  { id: 'V1', label: 'V1', subtitle: 'MVP — 9 מסכים', color: '#ff8c00' },
  { id: 'V2', label: 'V2', subtitle: 'הרחבה עתידית', color: '#a78bfa' },
];

// ═══════════════ INITIAL TASKS ═══════════════

const INITIAL_TASKS: Task[] = [
  // ════════════════════════════════════════
  // V1 — MVP
  // ════════════════════════════════════════

  // ──── V1 בנק הצעות ────
  {
    id: 'v1i1', title: 'לוח שנה חזותי לטיולים', description: 'תצוגת Calendar עם כל הפרויקטים, תאריכי יציאה/חזרה, התנגשויות.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'ideas', feature: 'דשבורד', estimate: '', tags: ['דשבורד'], createdAt: '2026-02-19', version: 'V1',
  },
  {
    id: 'v1i2', title: 'דוחות רווחיות לפי פרויקט', description: 'השוואת עלויות ספקים מול מחיר ללקוח, גרף רווח נקי לכל טיול.',
    type: 'FEATURE', priority: 'HIGH', status: 'ideas', feature: 'דשבורד', estimate: '', tags: ['דשבורד'], createdAt: '2026-02-19', version: 'V1',
  },
  {
    id: 'v1i3', title: 'תבניות הצעות מחיר מוכנות', description: 'ספריית תבניות לסוגי טיולים שונים (שטח, עירוני, חו״ל, כנסים), ואפשרות לשמור הצעה קיימת כתבנית לשימוש חוזר. ניהול ספריית תבניות.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'ideas', feature: 'עורך הצעות מחיר', estimate: '4h', tags: ['עורך הצעות', 'תבניות'], createdAt: '2026-02-19', version: 'V1',
  },
  {
    id: 'v1i4', title: 'דשבורד ספק אישי', description: 'תצוגה מרוכזת לספק: הזמנות פתוחות, היסטוריה, דירוג, מסמכים.',
    type: 'FEATURE', priority: 'LOW', status: 'ideas', feature: 'כרטיס ספק', estimate: '', tags: ['כרטיס ספק'], createdAt: '2026-02-19', version: 'V1',
  },

  // ──── V1 לביצוע ────
  {
    id: 't1', title: 'ולידציה בטפסים — עורך הצעות מחיר', description: 'הוספת ולידציה לכל שדות ההצעה: שם פרויקט, תאריכים, שורות מחיר, פרטי לקוח.',
    type: 'TASK', priority: 'HIGH', status: 'todo', feature: 'עורך הצעות מחיר', estimate: '4h', tags: ['עורך הצעות'], createdAt: '2026-02-18', version: 'V1',
  },
  {
    id: 't3', title: 'ייצוא הצעת מחיר ל-PDF', description: 'יצירת PDF מעוצב מטבלת ההצעה כולל לוגו, פרטי לקוח ותנאי תשלום.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'todo', feature: 'עורך הצעות מחיר', estimate: '6h', tags: ['עורך הצעות'], createdAt: '2026-02-18', version: 'V1',
  },
  {
    id: 't4', title: 'פילטרים מתקדמים — רשימת פרויקטים', description: 'סינון לפי סטטוס, תאריך, לקוח ויעד. חיפוש חופשי בכל השדות.',
    type: 'TASK', priority: 'MEDIUM', status: 'todo', feature: 'רשימת פרויקטים', estimate: '3h', tags: ['פרויקטים'], createdAt: '2026-02-18', version: 'V1',
  },
  {
    id: 't6', title: 'מפת ספקים — Leaflet clusters', description: 'הוספת clustering לסמנים במפה כשיש ספקים רבים באותו אזור.',
    type: 'TASK', priority: 'LOW', status: 'todo', feature: 'בנק ספקים', estimate: '3h', tags: ['בנק ספקים'], createdAt: '2026-02-18', version: 'V1',
  },
  {
    id: 't8', title: 'גרף התפלגות עלויות בדשבורד', description: 'Recharts pie/bar chart המציג חלוקת הוצאות לפי קטגוריית ספק.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'todo', feature: 'דשבורד', estimate: '4h', tags: ['דשבורד'], createdAt: '2026-02-18', version: 'V1',
  },
  {
    id: 't9', title: 'Drag & Drop בלו"ז הפעילות', description: 'מנגנון גרירה לסידור מחדש של אירועים בלו"ז (Timeline) של עורך הצעות המחיר. שימוש ב-react-dnd עם אנימציות.',
    type: 'FEATURE', priority: 'HIGH', status: 'todo', feature: 'עורך הצעות מחיר', estimate: '5h', tags: ['עורך הצעות', 'DnD', 'לו"ז'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 't10', title: 'חיפוש/סינון מתקדם בבנק ספקים', description: 'חיפוש מתקדם עם פילטרים מרובים בו-זמנית: קטגוריה, אזור, דירוג, סטטוס אימות, טווח מחירים. כולל שמירת חיפושים אחרונים.',
    type: 'FEATURE', priority: 'HIGH', status: 'todo', feature: 'בנק ספקים', estimate: '4h', tags: ['בנק ספקים', 'חיפוש'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 't11', title: 'מערכת תגיות לפרויקטים', description: 'הוספת תגיות/תוויות צבעוניות לפרויקטים: סוג טיול (שטח, עירוני, חו"ל), VIP, דחוף, וכו\'. סינון לפי תגיות ברשימת הפרויקטים.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'todo', feature: 'רשימת פרויקטים', estimate: '3h', tags: ['פרויקטים', 'תגיות'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 't12', title: 'גרירת תמונות ישירות על כרטיס רכיב', description: 'Drop zone ישירות על כרטיס רכיב בעורך הצעות — גרירת תמונה מהדסקטופ מעלה ישירות ל-Supabase Storage ומשייכת לרכיב ללא פתיחת ה-ItemEditor.',
    type: 'FEATURE', priority: 'LOW', status: 'todo', feature: 'עורך הצעות מחיר', estimate: '3h', tags: ['עורך הצעות', 'תמונות', 'DnD'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 't13', title: 'תגיות וקטגוריות לתמונות', description: 'אפשרות לתייג תמונות (למשל: "מהספק", "מהשטח", "לוגו") ולסנן לפיהן. הן ב-ItemEditor והן ב-ProductEditor.',
    type: 'FEATURE', priority: 'LOW', status: 'todo', feature: 'מערכת תמונות ואחסון', estimate: '3h', tags: ['תמונות', 'תגיות'], createdAt: '2026-02-21', version: 'V1',
  },

  // ──── V1 בעבודה ────
  {
    id: 'p1', title: 'תצוגת לקוח — התאמת מובייל', description: 'עיצוב responsive מלא לעמוד הלקוח: תמחור, פרטי טיול, אישור הצעה.',
    type: 'TASK', priority: 'HIGH', status: 'in-progress', feature: 'תצוגת לקוח', estimate: '4h', tags: ['תצוגת לקוח'], createdAt: '2026-02-18', version: 'V1',
  },
  {
    id: 'p2', title: 'אשף סיווג ספקים — שכתוב מלא מ-placeholder לכלי פונקציונלי',
    description: 'שכתוב מלא מ-placeholder סטטי לכלי End-to-End: טעינת ספקים לא מסווגים מ-Supabase, כרטיס ספק מונפש עם slide animation, זיהוי "AI" אוטומטי של קטגוריה לפי מילות מפתח, גריד 10 קטגוריות עם תתי-קטגוריות דינמיות, תגיות, שמירה דרך PUT /suppliers/:id, קיצורי מקלדת, טיימר, סטטיסטיקות חיות, תור ספקים בסיידבר, ומסך סיום.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'אשף סיווג ספקים', estimate: '5h', tags: ['סיווג ספקים', 'Motion', 'Supabase'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'p3', title: 'שיפור ביצועים — lazy loading', description: 'הוספת React.lazy ו-Suspense למסכים כבדים: בנק ספקים, עורך הצעות, דשבורד.',
    type: 'TASK', priority: 'MEDIUM', status: 'in-progress', feature: 'תשתית כללית', estimate: '2h', tags: ['ביצועים'], createdAt: '2026-02-19', version: 'V1',
  },

  // ──── V1 בהמתנה ────
  {
    id: 'h1', title: 'מערכת הרשאות — RBAC', description: 'הגדרת תפקידים: admin, editor, viewer. הגנה על נתיבים ופעולות רגישות.',
    type: 'FEATURE', priority: 'HIGH', status: 'on-hold', feature: 'תשתית כללית', estimate: '1d', tags: ['תשתית'], createdAt: '2026-02-17', version: 'V1',
  },

  // ──── V1 הושלם ────
  {
    id: 'd1', title: 'דשבורד ראשי — KPIs וגרפים', description: 'מסך דשבורד עם סטטיסטיקות, גרפי Recharts, רשימת פרויקטים אחרונים.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'דשבורד', estimate: '8h', tags: ['דשבורד'], createdAt: '2026-02-10', version: 'V1',
  },
  {
    id: 'd2', title: 'עורך הצעות מחיר — טבלת שורות', description: 'ממשק עריכת הצעה: הוספת שורות, חישוב מחירים, הנחות, סיכום.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'עורך הצעות מחיר', estimate: '1d', tags: ['עורך הצעות'], createdAt: '2026-02-11', version: 'V1',
  },
  {
    id: 'd3', title: 'בנק ספקים — רשימה, חיפוש וסינון', description: 'מסך ספקים עם טבלה, חיפוש חופשי, פילטרים לפי קטגוריה ואזור, מפת Leaflet.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'בנק ספקים', estimate: '1d', tags: ['בנק ספקים'], createdAt: '2026-02-12', version: 'V1',
  },
  {
    id: 'd4', title: 'כרטיס ספק — פרטים ומפה', description: 'עמוד פרטי ספק: מידע, מיקום, היסטוריית שימוש, דירוג.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'done', feature: 'כרטיס ספק', estimate: '6h', tags: ['כרטיס ספק'], createdAt: '2026-02-12', version: 'V1',
  },
  {
    id: 'd5', title: 'תצוגת לקוח — עמוד שיתוף הצעה', description: 'עמוד ציבורי שמציג ללקוח הצעת מחיר מעוצבת עם אפשרות אישור.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'תצוגת לקוח', estimate: '6h', tags: ['תצוגת לקוח'], createdAt: '2026-02-13', version: 'V1',
  },
  {
    id: 'd6', title: 'אשף ייבוא — וויזארד End-to-End עם Undo/Rollback',
    description: 'וויזארד פונקציונלי מקצה לקצה עם 4 שלבים: העלאת CSV (PapaParse), מיפוי עמודות חכם, בדיקת כפילויות, וייבוא בפועל ל-Supabase. כולל מערכת undo/rollback מלאה — route POST /suppliers/bulk-rollback, מתודת bulkRollback ב-API, ובמסך ההצלחה בר undo אדום עם countdown 30 שניות, אישור דו-שלבי ואנימציות Motion.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'done', feature: 'אשף ייבוא', estimate: '1d', tags: ['ייבוא', 'CSV', 'Undo', 'Motion'], createdAt: '2026-02-14', version: 'V1',
  },
  {
    id: 'd7', title: 'רשימת פרויקטים — תצוגה ופעולות', description: 'מסך כל הפרויקטים עם סטטוס, תאריכים, לקוח, ופעולות מהירות.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'done', feature: 'רשימת פרויקטים', estimate: '6h', tags: ['פרויקטים'], createdAt: '2026-02-14', version: 'V1',
  },
  {
    id: 'd8', title: 'Layout משותף — Sidebar וניווט', description: 'Sidebar קבוע עם ניווט בין כל 9 המסכים, פלטה חמה, RTL מלא.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'תשתית כללית', estimate: '4h', tags: ['תשתית'], createdAt: '2026-02-09', version: 'V1',
  },
  {
    id: 'd9', title: 'מוצרים סרוקים — תצוגת תוצאות', description: 'מסך הצגת מוצרים שיובאו/נסרקו עם פילטרים ופעולות סיווג.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'done', feature: 'מוצרים סרוקים', estimate: '5h', tags: ['סריקה'], createdAt: '2026-02-15', version: 'V1',
  },

  // ──── V1 הושלם — חיבור Supabase ומערכת תמונות (21/02/2026) ────
  {
    id: 'd10', title: 'חיבור Supabase — persistence לכל המסכים',
    description: 'חיבור מלא ל-Supabase KV Store: פרויקטים, ספקים, אנשי קשר, מוצרים, מסמכים, רכיבי הצעה ולו"ז. שרת Hono נכתב מחדש במלואו עם seed v3 מלא כולל directPrice. כל ה-CRUD עובד end-to-end.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'תשתית כללית', estimate: '2d', tags: ['Backend', 'Supabase', 'KV'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd11', title: 'Modals פונקציונליים — בנק ספקים + כרטיס ספק',
    description: 'כל כפתורי הוספה/עריכה/מחיקה עובדים עם modals/drawers אמיתיים: הוספת ספק, עריכת פרטי ספק, הוספת איש קשר, הוספת מוצר, העלאת מסמכים עם תאריך תוקף — כולם שומרים ל-Supabase.',
    type: 'TASK', priority: 'HIGH', status: 'done', feature: 'בנק ספקים', estimate: '6h', tags: ['בנק ספקים', 'כרטיס ספק', 'CRUD'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd12', title: 'העלאת מסמכים ותמונות לכרטיס ספק',
    description: 'מערכת מסמכים מלאה בכרטיס ספק: 3 מסמכים נדרשים (רישיון עסק, תעודת כשרות, ביטוח צד ג) עם סטטוס תוקף חזותי (ירוק/צהוב/אדום), העלאת קבצים, עדכון תוקף, ומסמכים נוספים. שמירה ב-Supabase.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'done', feature: 'כרטיס ספק', estimate: '5h', tags: ['כרטיס ספק', 'מסמכים'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd13', title: 'ItemEditor — עריכת רכיב בהצעת מחיר',
    description: 'Drawer slide-in עם Motion spring animations לעריכת רכיב בהצעה. כולל: גלריית תמונות עם hero image + thumbnails + drag & drop upload ל-Supabase Storage (bucket פרטי + signed URLs), טפסי עריכה עם stagger animations (שם, ספק, תיאור, סטטוס, תמחור עם profit bar אנימטיבי, כוכבי משקל רווח, הערות), וכפתור שמירה עם success pulse. משולב בעורך הצעות עם כפתור עיפרון בכל כרטיס.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'עורך הצעות מחיר', estimate: '8h', tags: ['עורך הצעות', 'תמונות', 'Motion', 'Storage'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd14', title: 'ProductEditor — עריכת מוצר בכרטיס ספק',
    description: 'Drawer slide-in עם Motion animations לעריכת מוצר בתוך כרטיס ספק. כולל: גלריית תמונות מלאה (hero + thumbnails + ניווט חצים + drag & drop upload), עריכת שם/תיאור/מחיר/יחידה עם בורר חזותי, כרטיס מחיר gradient, הערות פנימיות, שמירה עם success state. ב-Products Tab לחיצה על כרטיס פותחת ישירות את העורך.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'כרטיס ספק', estimate: '6h', tags: ['כרטיס ספק', 'תמונות', 'Motion', 'Storage'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd15', title: 'Server routes — תמונות מוצרים',
    description: 'הוספת endpoints בשרת Hono: PUT לעדכון מוצר, POST להעלאת תמונת מוצר ל-Supabase Storage (base64 → bucket פרטי → signed URL), DELETE למחיקת תמונת מוצר. כולל פונקציות API בצד הלקוח: supplierProductsApi.update, uploadImage, deleteImage.',
    type: 'TASK', priority: 'HIGH', status: 'done', feature: 'מערכת תמונות ואחסון', estimate: '3h', tags: ['Backend', 'Storage', 'API'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd16', title: 'שדרוג UX כפתורי עריכה בעורך הצעות',
    description: 'כפתור "עריכה" כתום תמיד גלוי (לא רק ב-hover) עם אייקון + טקסט בכל כרטיס רכיב. בנוסף — לחיצה על שם הרכיב פותחת את ה-ItemEditor ישירות עם אפקט hover כתום ואייקון עיפרון.',
    type: 'TASK', priority: 'MEDIUM', status: 'done', feature: 'עורך הצעות מחיר', estimate: '30m', tags: ['עורך הצעות', 'UX'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd17', title: 'מערכת אייקוני Lucide אחידה — החלפת אימוג\'ים',
    description: 'החלפת כל האימוג\'ים באפליקציה במערכת אייקונים אחידה של Lucide: SectionIcon (עטיפה עם גדלים), TypeBadge (מיפוי קטגוריות לאייקונים), אייקונים בסרגל הסיכום, בטבלת התמחור ובלו"ז. כל רכיב מטופל.',
    type: 'TASK', priority: 'MEDIUM', status: 'done', feature: 'תשתית כללית', estimate: '2h', tags: ['עיצוב', 'אייקונים', 'Lucide'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd18', title: 'Seed v6 — נתוני ספקים מורחבים עם directPrice',
    description: 'עדכון ה-seed לגרסה v6 (_meta:seeded_v6): נתוני ספקים עם אנשי קשר (שם, תפקיד, טלפון, אימייל), מוצרים (שם, מחיר, תיאור, יחידה), מסמכים עם תוקף, וכן ערכי directPrice ברכיבי הצעת מחיר לחישוב רווח מדויק. עדכוני schema ו-data משמעותיים לאורך 6 גרסאות seed.',
    type: 'TASK', priority: 'HIGH', status: 'done', feature: 'תשתית כללית', estimate: '2h', tags: ['Backend', 'Seed', 'Data'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd19', title: 'QuoteEditor — שלושת הסקשנים בעמוד אחד + scroll anchors',
    description: 'שכתוב QuoteEditor כך ששלושת הסקשנים (רכיבים וספקים, תמחור ורווח יעד, לו"ז הפעילות) מוצגים תמיד אחד מתחת לשני באותו עמוד. הטאבים למעלה משמשים כ-scroll anchors עם IntersectionObserver — לחיצה על טאב גוללת לסקשן הרלוונטי, והטאב הפעיל מתעדכן אוטומטית לפי המיקום בעמוד.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'עורך הצעות מחיר', estimate: '4h', tags: ['עורך הצעות', 'UX', 'IntersectionObserver'], createdAt: '2026-02-21', version: 'V1',
  },

  // ──── V1 הושלם — אודיט כפתורים (21/02/2026) ────
  {
    id: 'audit1', title: 'תיקון כפתור "פרויקט חדש" ברשימת הפרויקטים',
    description: 'הכפתור עשה navigate("/") במקום לפתוח את המודאל. תוקן לעבוד דרך URL param ?newProject=true שה-Layout מזהה ופותח אוטומטית את מודאל יצירת הפרויקט. עובד מכל דף באפליקציה.',
    type: 'BUG', priority: 'HIGH', status: 'done', feature: 'רשימת פרויקטים', estimate: '30m', tags: ['אודיט', 'פרויקטים', 'ניווט'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'audit2', title: 'תיקון כפתור "הדפס" בתצוגת לקוח (ClientQuote)',
    description: 'כפתור מת — לא היה onClick בכלל, רק עיצוב. הוספת window.print() שפותח את דיאלוג ההדפסה/שמירת PDF של הדפדפן.',
    type: 'BUG', priority: 'MEDIUM', status: 'done', feature: 'תצוגת לקוח', estimate: '15m', tags: ['אודיט', 'תצוגת לקוח'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'audit3', title: 'תיקון כפתור "שיתוף" בתצוגת לקוח',
    description: 'כפתור מת — ללא פונקציונליות. הוספת Web Share API (במובייל פותח תפריט שיתוף) ובדסקטופ מעתיק את הקישור ללוח עם הודעת טוסט.',
    type: 'BUG', priority: 'MEDIUM', status: 'done', feature: 'תצוגת לקוח', estimate: '20m', tags: ['אודיט', 'תצוגת לקוח', 'שיתוף'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'audit4', title: 'תיקון כפתור "העתק" בבנק ספקים — העתקה אמיתית',
    description: 'הכפתור הציג טוסט "הספק הועתק" אבל לא העתיק שום דבר באמת. תוקן להעתיק את כל פרטי הספק (שם, קטגוריה, אזור, טלפון, דירוג) ללוח באמצעות navigator.clipboard.writeText().',
    type: 'BUG', priority: 'HIGH', status: 'done', feature: 'בנק ספקים', estimate: '20m', tags: ['אודיט', 'בנק ספקים', 'clipboard'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'audit5', title: 'פגינציה אמיתית בבנק ספקים',
    description: 'כפתורי הפגינציה 1,2,3 והחצים היו דקורטיביים — הארדקודד ללא לוגיקה. הוחלפו בפגינציה עובדת עם state של currentPage, חיתוך נתונים עם slice(), כפתורי עמודים דינמיים, חצים עם disabled, ואיפוס לעמוד 1 בשינוי פילטרים.',
    type: 'BUG', priority: 'HIGH', status: 'done', feature: 'בנק ספקים', estimate: '45m', tags: ['אודיט', 'בנק ספקים', 'פגינציה'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'audit6', title: 'תיקון כפתור ⋮ (MoreVertical) בפרויקטים דחופים בדשבורד',
    description: 'כפתור מת — לחיצה לא עשתה כלום. תוקן לנווט לדף הפרויקט הרלוונטי עם navigate לדף הפרויקט.',
    type: 'BUG', priority: 'MEDIUM', status: 'done', feature: 'דשבורד', estimate: '15m', tags: ['אודיט', 'דשבורד', 'ניווט'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'audit7', title: 'תיקון כפתור עזרה (HelpCircle) בהדר העליון',
    description: 'כפתור מת. תוקן לנווט לדף ה-PRD (מסמך מוצר / עזרה).',
    type: 'BUG', priority: 'LOW', status: 'done', feature: 'Layout וניווט', estimate: '10m', tags: ['אודיט', 'Layout', 'ניווט'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'audit8', title: 'אודיט כפתור-כפתור מלא — ביקורת כל הקומפוננטות',
    description: 'מעבר שיטתי על כל כפתור בכל קומפוננטה באפליקציה: בדיקה שכל לחיצה מובילה למקום הנכון, שהפונקציה מאחורי הכפתור עובדת, ושהנתונים נשמרים/נקראים מהבאקאנד כמו שצריך. נמצאו 7 בעיות ותוקנו, שאר הכפתורים (סיידבר, CRUD ספקים, מודאל פרויקטים, עורך הצעות, חיפוש גלובלי, התראות, Logout ועוד) נמצאו תקינים.',
    type: 'TASK', priority: 'HIGH', status: 'done', feature: 'אודיט ותיקוני באגים', estimate: '3h', tags: ['אודיט', 'QA', 'כפתורים'], createdAt: '2026-02-21', version: 'V1',
  },

  // ──── V1 הושלם — מיקום ספק + תמונות מוצר בתצוגת preview (21/02/2026) ────
  {
    id: 'd20', title: 'מיקום ספק אינטראקטיבי — Leaflet + Nominatim',
    description: 'קומפוננט SupplierLocationMap חדש שמחליף את ה-placeholder הסטטי של "מיקום" בכרטיס ספק. כולל: שדה חיפוש כתובת עם autocomplete דרך Nominatim (מוגבל לישראל, תוצאות בעברית), debounce 400ms, מפת Leaflet אינטראקטיבית עם marker ואנימציית flyTo, שמירה אוטומטית של address ו-location: {lat, lng} על אובייקט הספק ב-Supabase, כפתור מחיקת מיקום, ו-click outside לסגירת ההצעות.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'done', feature: 'כרטיס ספק', estimate: '4h', tags: ['כרטיס ספק', 'מפה', 'Leaflet', 'Nominatim'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd21', title: 'תיקון dropdown autocomplete — חיפוש כתובת ספק',
    description: 'ה-dropdown של תוצאות החיפוש היה נפתח כלפי מטה ונחתך מאחורי המפה. תוקן לפתיחה כלפי מעלה (bottom-full) עם z-[100], max-height וגלילה פנימית, כך שההצעות תמיד נראות מעל שדה החיפוש.',
    type: 'BUG', priority: 'HIGH', status: 'done', feature: 'כרטיס ספק', estimate: '15m', tags: ['כרטיס ספק', 'UX', 'CSS'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd22', title: 'תמונות מוצר בתצוגת Preview — לשונית מידע כללי',
    description: 'כרטיסי המוצרים בלשונית "מידע כללי" (preview) הציגו רק טקסט ללא תמונות. עודכנו להציג thumbnail של תמונת המוצר הראשונה (hero image) עם אפקט zoom ב-hover, badge ספירת תמונות כשיש יותר מאחת, ו-fallback אייקון Package כשאין תמונות.',
    type: 'TASK', priority: 'MEDIUM', status: 'done', feature: 'כרטיס ספק', estimate: '30m', tags: ['כרטיס ספק', 'UX', 'תמונות'], createdAt: '2026-02-21', version: 'V1',
  },

  // ──── V1 הושלם — מערכת ארכיון ספקים + Breadcrumbs (21/02/2026) ────
  {
    id: 'd23', title: 'מערכת ארכיון ספקים מלאה — End to End',
    description: 'מערכת ארכיון מקצה לקצה: כפתור "העבר לארכיון" בכרטיס ספק עם מודאל אישור דו-שלבי, מתודת archive ב-API (משנה category ל-"ארכיון"), סינון ספקים מאורכנים מבנק הספקים, כפתור "ארכיון (X)" בהדר בנק הספקים שמוביל לעמוד ארכיון ייעודי (/suppliers/archive). עמוד הארכיון (SupplierArchive.tsx) מציג טבלה של כל הספקים המאורכנים עם חיפוש, צפייה וכפתור שחזור ירוק. בכרטיס ספק מאורכן — באנר "ספק זה נמצא בארכיון" עם כפתור שחזור, כפתור ה-back מנווט לארכיון, וכפתור ההעברה לארכיון מוסתר. Route חדש, מתודת restore ב-API.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'בנק ספקים', estimate: '3h', tags: ['בנק ספקים', 'כרטיס ספק', 'ארכיון', 'CRUD'], createdAt: '2026-02-21', version: 'V1',
  },
  {
    id: 'd24', title: 'שדרוג Breadcrumbs — route ארכיון + labels דינמיים',
    description: 'הוספת route "ארכיון" ל-routeMeta עם אייקון Archive, וכן שיפור ה-fallback למזהי ספקים/פרויקטים דינמיים — במקום להציג #hash לא קריא, מוצגות תוויות ידידותיות: "פרטי ספק" לנתיבים תחת /suppliers/, "פרטי פרויקט" תחת /projects/.',
    type: 'TASK', priority: 'MEDIUM', status: 'done', feature: 'Layout וניווט', estimate: '30m', tags: ['Breadcrumbs', 'UX', 'ניווט'], createdAt: '2026-02-21', version: 'V1',
  },

  // ──── V1 הושלם — עריכת ספק + הערות אוטומטיות + תיקוני באגים (22/02/2026) ────
  {
    id: 'd25', title: 'טופס עריכת ספק מקיף — מודאל מלא',
    description: 'כפתור "עריכה" כתום עם אייקון עיפרון ליד שם הספק בהדר, שפותח מודאל טופס מקיף (שם, טלפון, קטגוריה, אזור, דירוג, סטטוס אימות, הערות) עם שמירה ל-Supabase דרך suppliersApi.update(). הטופס משתמש ב-react-hook-form עם FormField, FormSelect ו-FormTextarea הקיימים.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'כרטיס ספק', estimate: '2h', tags: ['כרטיס ספק', 'CRUD', 'react-hook-form'], createdAt: '2026-02-22', version: 'V1',
  },
  {
    id: 'd26', title: 'מערכת הערות אוטומטיות לספקים — Engine + UI',
    description: 'מנגנון הערות אוטומטיות מלא: endpoint GET /suppliers/summaries בשרת Hono, יוטיליטי supplierNotes.ts עם 9 סוגי הערות לפי סדר עדיפות (ביטוח פג, מסמכים קרובים לפקיעה, אימות ממתין, מסמכים חסרים, אין אנשי קשר, חסר טלפון, אין מוצרים), צבעים לפי חומרה (אדום/כתום/צהוב/כחול/אפור), וחישוב גם מ-summary וגם מ-data מלא.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'כרטיס ספק', estimate: '4h', tags: ['כרטיס ספק', 'בנק ספקים', 'Backend', 'UX'], createdAt: '2026-02-22', version: 'V1',
  },
  {
    id: 'd27', title: 'הערות אוטומטיות — הצגה ב-SupplierBank + SupplierDetail',
    description: 'Badge-ים צבעוניים קומפקטיים (pills עם אייקון וטקסט) מופיעים: בבנק ספקים ליד כל ספק, ובכרטיס ספק מתחת לפרטי הספק בתצוגה אנכית (אחד מתחת לשני). כל דבר "חסר" (מסמכים, אנשי קשר, טלפון, מוצרים) מופיע באדום (critical). הערה ידנית משולבת כ-badge צהוב באותה שורה.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'done', feature: 'כרטיס ספק', estimate: '2h', tags: ['כרטיס ספק', 'בנק ספקים', 'UX'], createdAt: '2026-02-22', version: 'V1',
  },
  {
    id: 'd28', title: 'הסרת SupplierComplianceCard — החלפה ב-badges',
    description: 'מחיקת הקומפוננט SupplierComplianceCard.tsx (כרטיס תקינות צף עם donut chart, ציון, expand/collapse). הוחלף במערכת ה-badges הקומפקטית של ההערות האוטומטיות — קלה יותר, ברורה יותר, ואינפורמטיבית יותר.',
    type: 'TASK', priority: 'MEDIUM', status: 'done', feature: 'כרטיס ספק', estimate: '30m', tags: ['כרטיס ספק', 'UX', 'ניקוי קוד'], createdAt: '2026-02-22', version: 'V1',
  },
  {
    id: 'bug1', title: 'תיקון Leaflet _leaflet_pos crash — invalidateSize',
    description: 'שגיאת TypeError: Cannot read properties of undefined (reading \'_leaflet_pos\') ב-SupplierLocationMap. הבעיה: setTimeout עם map.invalidateSize() נורה אחרי שהמפה כבר הוסרה מה-DOM (unmount). תוקן עם guard שבודק שה-map וה-container עדיין קיימים, try/catch, וביטול ה-timeout ב-cleanup.',
    type: 'BUG', priority: 'HIGH', status: 'done', feature: 'כרטיס ספק', estimate: '15m', tags: ['כרטיס ספק', 'Leaflet', 'באג'], createdAt: '2026-02-22', version: 'V1',
  },
  {
    id: 'd29', title: 'הסרת cursor-pointer מכרטיסי רכיבים בעורך הצעות',
    description: 'שם הספק/רכיב בכרטיסים בעורך הצעות המחיר הפך לטקסט רגיל — הוסרו cursor-pointer, onClick ואייקון Pencil כדי למנוע כניסה לעריכת פרטי ספק מתוך הפרויקט. כפתור "עריכה" הכתום הנפרד נשאר לעריכת הרכיב עצמו.',
    type: 'TASK', priority: 'MEDIUM', status: 'done', feature: 'עורך הצעות מחיר', estimate: '15m', tags: ['עורך הצעות', 'UX'], createdAt: '2026-02-22', version: 'V1',
  },
  {
    id: 'd30', title: 'מערכת אישור מחיקה גלובלית — הקלדת "מחיקה"',
    description: 'קומפוננט ConfirmDeleteModal.tsx עם hook useConfirmDelete — בכל פעולת מחיקה במערכת עולה מודאל שדורש הקלדת המילה "מחיקה" לפני אישור. שולב ב-7 קבצים: ProjectsList (מחיקת פרויקט), QuoteEditor (מחיקת רכיב הצעה), SupplierDetail (מחיקת איש קשר ומוצר), ItemEditor ו-ProductEditor (מחיקת תמונות), KanbanBoard (מחיקת משימה וקבצים מצורפים), SupplierLocationMap (מחיקת מיקום). כולל אנימציית Motion, auto-focus, תמיכה ב-Enter/Escape ומצב loading.',
    type: 'TASK', priority: 'HIGH', status: 'done', feature: 'תשתית כללית', estimate: '2h', tags: ['UX', 'אבטחה', 'תשתית'], createdAt: '2026-02-22', version: 'V1',
  },
  {
    id: 'd31', title: 'מולטי-קטגוריה לספקים — checkboxes במקום dropdown',
    description: 'שדה הקטגוריה בכרטיס ספק הפך ל-multi-select עם checkboxes (grid 3 עמודות) — כל ספק יכול לספק כמה שירותים. השינוי חל על מודאל עריכת ספק (SupplierDetail), טופס הוספת ספק חדש (SupplierBank), תצוגת badges בטבלה ובהדר הספק, ומנגנון סינון לפי קטגוריה. הקטגוריות נשמרות כ-comma-separated string עם תאימות אחורית.',
    type: 'FEATURE', priority: 'HIGH', status: 'done', feature: 'בנק ספקים', estimate: '1.5h', tags: ['בנק ספקים', 'UX', 'כרטיס ספק'], createdAt: '2026-02-22', version: 'V1',
  },

  // ════════════════════════════════════════
  // V2 — הרחבה
  // ════════════════════════════════════════

  // ──── V2 בנק הצעות ────
  {
    id: 'v2i1', title: 'שליחת הצעות מחיר דרך WhatsApp', description: 'אינטגרציה עם WhatsApp Business API לשליחת קישור הצעה ישירות ללקוח.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'ideas', feature: 'עורך הצעות מחיר', estimate: '', tags: ['אינטגרציות'], createdAt: '2026-02-19', version: 'V2',
  },
  {
    id: 'v2i2', title: 'סריקת אתרי ספקים אוטומטית', description: 'סריקת מחירים ועדכון אוטומטי של תעריפי ספקים מאתרי הזמנות.',
    type: 'FEATURE', priority: 'LOW', status: 'ideas', feature: 'מוצרים סרוקים', estimate: '', tags: ['אוטומציה'], createdAt: '2026-02-19', version: 'V2',
  },
  {
    id: 'v2i3', title: 'צ׳אט פנימי בין מפיקים', description: 'מערכת הודעות פנימית לתיאום בין מפיקים על אותו פרויקט.',
    type: 'FEATURE', priority: 'LOW', status: 'ideas', feature: 'תשתית כללית', estimate: '', tags: ['שיתוף פעולה'], createdAt: '2026-02-19', version: 'V2',
  },
  {
    id: 'v2i4', title: 'אפליקציית מובייל PWA למפיקים', description: 'גרסת PWA מותאמת למובייל לצפייה ועדכון פרויקטים תוך כדי טיול.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'ideas', feature: 'תשתית כללית', estimate: '', tags: ['מובייל'], createdAt: '2026-02-19', version: 'V2',
  },
  {
    id: 'v2i5', title: 'מנוע המלצות ספקים חכם', description: 'המלצות אוטומטיות לספקים לפי יעד, תקציב, דירוג והיסטוריה.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'ideas', feature: 'בנק ספקים', estimate: '', tags: ['AI'], createdAt: '2026-02-19', version: 'V2',
  },

  // ──── V2 לביצוע ────
  {
    id: 'v2t1', title: 'מערכת תשלומים — מעקב גבייה', description: 'מעקב תשלומי לקוחות: חשבוניות, תזכורות, סטטוס גבייה.',
    type: 'FEATURE', priority: 'HIGH', status: 'todo', feature: 'תשתית כללית', estimate: '2d', tags: ['תשלומים'], createdAt: '2026-02-19', version: 'V2',
  },
  {
    id: 'v2t2', title: 'מערכת התראות מתקדמת', description: 'התראות push, אימייל, ו-in-app על שינויי סטטוס, תאריכים קרובים. כולל התראה למפיק כשלקוח צופה/מאשר הצעה או כשספק מעדכן פרטים.',
    type: 'FEATURE', priority: 'HIGH', status: 'todo', feature: 'תשתית כללית', estimate: '1d', tags: ['התראות'], createdAt: '2026-02-19', version: 'V2',
  },
  {
    id: 'v2t3', title: 'דוחות ו-Analytics מתקדמים', description: 'דשבורד דוחות: רווחיות, ספקים מובילים, תחזיות, ייצוא Excel.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'todo', feature: 'דשבורד', estimate: '2d', tags: ['דוחות'], createdAt: '2026-02-19', version: 'V2',
  },
  {
    id: 'v2t4', title: 'העלאת מסמכים מתקדמת', description: 'ניהול מסמכים מרכזי: חוזים, רישיונות, ביטוחים, תוקף וחידוש.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'todo', feature: 'כרטיס ספק', estimate: '1d', tags: ['מסמכים'], createdAt: '2026-02-19', version: 'V2',
  },
  {
    id: 'v2t5', title: 'Multi-tenant — ניהול מספר ארגונים', description: 'תמיכה בריבוי ארגונים, הפרדת נתונים, הזמנות צוות.',
    type: 'FEATURE', priority: 'LOW', status: 'todo', feature: 'תשתית כללית', estimate: '3d', tags: ['ארכיטקטורה'], createdAt: '2026-02-19', version: 'V2',
  },

  // ──── V2 בעבודה ────
  {
    id: 'v2p1', title: 'תכנון ארכיטקטורת V2', description: 'מפת דרכים טכנית, schema updates, API design לפיצ׳רים מתקדמים.',
    type: 'TASK', priority: 'HIGH', status: 'in-progress', feature: 'תשתית כללית', estimate: '1d', tags: ['ארכיטקטורה'], createdAt: '2026-02-19', version: 'V2',
  },

  // ──── V2 בהמתנה ────
  {
    id: 'v2h1', title: 'אינטגרציית Google Calendar', description: 'סנכרון טיולים ללוח שנה, תזכורות אוטומטיות, שיתוף אירועים.',
    type: 'FEATURE', priority: 'MEDIUM', status: 'on-hold', feature: 'דשבורד', estimate: '6h', tags: ['אינטגרציות'], createdAt: '2026-02-19', version: 'V2',
  },
  {
    id: 'v2h2', title: 'API ציבורי לספקים', description: 'ספקים יוכלו לעדכן זמינות ומחירים דרך API, webhook callbacks.',
    type: 'FEATURE', priority: 'LOW', status: 'on-hold', feature: 'בנק ספקים', estimate: '2d', tags: ['API'], createdAt: '2026-02-19', version: 'V2',
  },
];

// ═══════════════ HELPERS ═══════════════

function generateId() {
  return 't' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

const HEB_MONTHS = ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'];
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
  const isImage = att?.type.startsWith('image/');
  const total = attachments.length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex(i => (i + 1) % total);
      if (e.key === 'ArrowRight') setCurrentIndex(i => (i - 1 + total) % total);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, total]);

  if (!att) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative z-10 flex flex-col items-center max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="flex items-center justify-between w-full mb-4 px-2" dir="rtl">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-white/80 truncate max-w-[300px]" style={{ fontWeight: 600 }}>
              {att.name}
            </span>
            {total > 1 && (
              <span className="text-[11px] text-white/50 bg-white/10 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                {currentIndex + 1} / {total}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={att.dataUrl}
              download={att.name}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title="הורדה"
            >
              <Download size={15} className="text-white" />
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isImage ? (
              <img
                src={att.dataUrl}
                alt={att.name}
                className="max-w-[85vw] max-h-[75vh] rounded-2xl shadow-2xl object-contain"
              />
            ) : (
              <div className="bg-white rounded-2xl p-12 flex flex-col items-center gap-4 shadow-2xl" dir="rtl">
                <div className="w-20 h-20 rounded-2xl bg-[#f0ece6] flex items-center justify-center">
                  <FileText size={36} className="text-[#8d785e]" />
                </div>
                <span className="text-[15px] text-[#181510]" style={{ fontWeight: 600 }}>{att.name}</span>
                <span className="text-[12px] text-[#8d785e]">לא ניתן לצפות בתצוגה מקדימה לסוג קובץ זה</span>
                <a
                  href={att.dataUrl}
                  download={att.name}
                  className="flex items-center gap-2 text-[13px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-5 py-2.5 rounded-xl transition-colors mt-2"
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
              onClick={() => setCurrentIndex(i => (i + 1) % total)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={() => setCurrentIndex(i => (i - 1 + total) % total)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════ TASK CARD ═══════════════

const TaskCard = forwardRef<HTMLDivElement, {
  task: Task;
  onEdit: (task: Task) => void;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragEnd: () => void;
  onOpenLightbox: (attachments: Task['attachments'], index: number) => void;
}>(function TaskCard({
  task,
  onEdit,
  isDragging,
  onDragStart,
  onDragEnd,
  onOpenLightbox,
}, ref) {
  const typeConf = TYPE_CONFIG[task.type];
  const prioConf = PRIORITY_CONFIG[task.priority];
  const TypeIcon = typeConf.icon;

  const imageAttachments = (task.attachments || []).filter(a => a.type.startsWith('image/'));
  const nonImageCount = (task.attachments || []).length - imageAttachments.length;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, task.id)}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(task)}
      className="group bg-white hover:bg-[#fdfcfb] border border-[#e7e1da] hover:border-[#d4cdc3] rounded-xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-md"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Top: Type + Priority */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
          style={{ backgroundColor: typeConf.bg, color: typeConf.color, fontWeight: 700 }}
        >
          <TypeIcon size={10} />
          {typeConf.label}
        </span>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full"
          style={{ backgroundColor: prioConf.bg, color: prioConf.color, fontWeight: 700 }}
        >
          {prioConf.label}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-[13px] text-[#181510] mb-1.5 leading-[1.5]" style={{ fontWeight: 600 }}>
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-[11px] text-[#8d785e] leading-[1.6] mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Image Thumbnails */}
      {imageAttachments.length > 0 && (
        <div className="flex gap-1.5 mb-3">
          {imageAttachments.slice(0, 3).map((att, idx) => {
            const allIdx = (task.attachments || []).indexOf(att);
            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLightbox(task.attachments, allIdx);
                }}
                className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#e7e1da] hover:border-[#ff8c00] transition-colors flex-shrink-0 group/thumb"
              >
                <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn size={14} className="text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity drop-shadow-md" />
                </div>
              </button>
            );
          })}
          {imageAttachments.length > 3 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenLightbox(task.attachments, 3);
              }}
              className="w-14 h-14 rounded-lg bg-[#f0ece6] border border-[#e7e1da] flex items-center justify-center flex-shrink-0"
            >
              <span className="text-[11px] text-[#8d785e]" style={{ fontWeight: 700 }}>+{imageAttachments.length - 3}</span>
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff8c00]/10 text-[#ff8c00]"
              style={{ fontWeight: 600 }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom: Date + Attachments + Grip */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#f0ece6]">
        <div className="flex items-center gap-3">
          {nonImageCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-[#8d785e]">
              <Paperclip size={10} />
              {nonImageCount}
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-[#b8a990]">
            <Calendar size={10} />
            {formatDate(task.createdAt)}
          </span>
        </div>
        <div className="opacity-0 group-hover:opacity-40 transition-opacity">
          <GripVertical size={12} className="text-[#8d785e]" />
        </div>
      </div>
    </motion.div>
  );
});
TaskCard.displayName = 'TaskCard';

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
  onOpenLightbox: (attachments: Task['attachments'], index: number) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showBottomFade, setShowBottomFade] = useState(false);

  // Detect if content overflows and whether user scrolled to bottom
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight + 2;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
    setShowBottomFade(hasOverflow && !atBottom);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, tasks.length]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    onDrop(column.id);
    // Smooth scroll to top so the user sees the newly dropped task
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 80);
  }, [column.id, onDrop]);

  return (
    <div
      className={`flex flex-col min-w-[255px] w-[255px] flex-shrink-0 h-full min-h-0 transition-all ${dragOver ? 'scale-[1.01]' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: column.dotColor }}
          />
          <span className="text-[13px] text-[#181510]" style={{ fontWeight: 700 }}>
            {column.label}
          </span>
          <span
            className="text-[11px] text-[#8d785e] bg-[#f0ece6] px-2 py-0.5 rounded-full"
            style={{ fontWeight: 700 }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="w-7 h-7 rounded-lg bg-white border border-[#e7e1da] hover:bg-[#f5f3f0] hover:border-[#d4cdc3] flex items-center justify-center transition-colors"
        >
          <Plus size={14} className="text-[#8d785e]" />
        </button>
      </div>

      {/* Drop Zone — scrollable, with fade indicator */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollRef}
          className={`h-full space-y-3 p-1.5 rounded-xl transition-colors overflow-y-auto kanban-scroll ${
            dragOver ? 'bg-[#ff8c00]/5 ring-2 ring-dashed ring-[#ff8c00]/30' : ''
          }`}
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d4cdc3 transparent' }}
        >
          <AnimatePresence mode="popLayout">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                isDragging={draggedTaskId === task.id}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onOpenLightbox={onOpenLightbox}
              />
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 opacity-40">
              <LayoutGrid size={24} className="text-[#8d785e] mb-2" />
              <span className="text-[12px] text-[#8d785e]">אין משימות</span>
            </div>
          )}
        </div>

        {/* Bottom fade-out gradient — visible when more content below */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 rounded-b-xl transition-opacity duration-300"
          style={{
            opacity: showBottomFade ? 1 : 0,
            background: 'linear-gradient(to bottom, transparent 0%, #f8f7f5 90%)',
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
  const [titleError, setTitleError] = useState('');
  const { requestDelete: requestTaskDelete, modal: taskDeleteModal } = useConfirmDelete();

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const update = (field: keyof Task, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'title') setTitleError('');
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      setTitleError('כותרת המשימה היא שדה חובה');
      titleRef.current?.focus();
      return;
    }
    if (form.title.trim().length < 2) {
      setTitleError('כותרת חייבת להכיל לפחות 2 תווים');
      titleRef.current?.focus();
      return;
    }
    onSave(form);
  };

  const isTitleValid = form.title.trim().length >= 2;

  const selectArrowStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238d785e' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: 'left 12px center',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[860px] bg-white border border-[#e7e1da] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-[#f0ece6]">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-[22px] text-[#181510]" style={{ fontWeight: 700 }}>
                {isNew ? 'משימה חדשה' : 'עריכת משימה'}
              </h2>
              <p className="text-[13px] text-[#8d785e] mt-0.5">
                {isNew ? 'צור משימה חדשה ללוח.' : 'ערוך את פרטי המשימה.'}
              </p>
            </div>
            <span
              className="text-[11px] px-2.5 py-1 rounded-lg"
              style={{
                fontWeight: 700,
                backgroundColor: activeVersion === 'V1' ? '#fff7ed' : '#f5f3ff',
                color: activeVersion === 'V1' ? '#ff8c00' : '#a78bfa',
              }}
            >
              {activeVersion}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#f5f3f0] flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-[#8d785e]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 overflow-y-auto flex-1">
          <div className="flex gap-6">
            {/* Right — Title + Description */}
            <div className="flex-[2] space-y-5">
              <div>
                <label className="block text-[13px] text-[#181510] mb-2" style={{ fontWeight: 600 }}>כותרת</label>
                <input
                  ref={titleRef}
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="שם המשימה..."
                  className={`w-full bg-[#f8f7f5] border rounded-xl px-4 py-3 text-[14px] text-[#181510] placeholder-[#b8a990] focus:outline-none focus:ring-2 transition-all ${
                    titleError
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-200 bg-red-50/30'
                      : isTitleValid
                        ? 'border-green-400 focus:border-green-400 focus:ring-green-200'
                        : 'border-[#e7e1da] focus:border-[#ff8c00] focus:ring-[#ff8c00]/10'
                  }`}
                />
                {titleError && (
                  <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1" style={{ fontWeight: 500 }}>
                    <AlertCircle size={12} />
                    {titleError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[13px] text-[#181510] mb-2" style={{ fontWeight: 600 }}>תיאור</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="תאר את המשימה..."
                  rows={8}
                  className="w-full bg-[#f8f7f5] border border-[#e7e1da] rounded-xl px-4 py-3 text-[13px] text-[#181510] placeholder-[#b8a990] focus:outline-none focus:border-[#ff8c00] focus:ring-2 focus:ring-[#ff8c00]/10 transition-all resize-none"
                />
              </div>
              {/* ── Attachments ── */}
              <div>
                <label className="block text-[13px] text-[#181510] mb-2" style={{ fontWeight: 600 }}>קבצים מצורפים</label>

                {/* Existing attachments */}
                {(form.attachments && form.attachments.length > 0) && (
                  <div className="space-y-2 mb-3">
                    {form.attachments.map((att, idx) => {
                      const isImage = att.type.startsWith('image/');
                      return (
                        <div key={idx} className="flex items-center gap-3 bg-[#f8f7f5] border border-[#e7e1da] hover:border-[#d4cdc3] rounded-lg p-2.5 transition-colors">
                          <button
                            onClick={() => setLightboxIndex(idx)}
                            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group/att"
                          >
                            {isImage ? (
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover/att:bg-black/20 transition-colors flex items-center justify-center">
                                  <Eye size={12} className="text-white opacity-0 group-hover/att:opacity-100 transition-opacity drop-shadow-md" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#f0ece6] group-hover/att:bg-[#e7e1da] flex items-center justify-center flex-shrink-0 transition-colors">
                                <FileText size={16} className="text-[#8d785e]" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0 text-right">
                              <span className="block text-[12px] text-[#181510] truncate">{att.name}</span>
                              <span className="block text-[10px] text-[#b8a990]">
                                {isImage ? 'לחץ לצפייה' : 'לחץ לפרטים'}
                              </span>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              requestTaskDelete({
                                title: 'מחיקת קובץ מצורף',
                                itemName: att.name,
                                onConfirm: async () => {
                                  setForm(prev => ({
                                    ...prev,
                                    attachments: prev.attachments?.filter((_, i) => i !== idx) || [],
                                  }));
                                },
                              });
                            }}
                            className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0"
                          >
                            <Trash2 size={13} className="text-[#dc2626]" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upload area */}
                <label className="flex items-center gap-3 border-2 border-dashed border-[#e7e1da] hover:border-[#ff8c00]/40 rounded-xl px-4 py-4 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-[#f0ece6] group-hover:bg-[#ff8c00]/10 flex items-center justify-center transition-colors">
                      <ImagePlus size={16} className="text-[#8d785e] group-hover:text-[#ff8c00] transition-colors" />
                    </div>
                    <div>
                      <span className="block text-[12px] text-[#181510]" style={{ fontWeight: 600 }}>
                        הוסף תמונה או קובץ
                      </span>
                      <span className="block text-[10px] text-[#b8a990]">
                        PNG, JPG, PDF, DOC — עד 5MB
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) return;
                      Array.from(files).forEach(file => {
                        if (file.size > 5 * 1024 * 1024) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          setForm(prev => ({
                            ...prev,
                            attachments: [
                              ...(prev.attachments || []),
                              { name: file.name, type: file.type, dataUrl: reader.result as string },
                            ],
                          }));
                        };
                        reader.readAsDataURL(file);
                      });
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Left — Properties */}
            <div className="w-[240px] space-y-4 bg-[#f8f7f5] border border-[#e7e1da] rounded-xl p-5">
              <div className="text-[11px] text-[#8d785e] tracking-wide mb-1" style={{ fontWeight: 700 }}>מאפיינים</div>

              <div>
                <label className="block text-[12px] text-[#181510] mb-1.5" style={{ fontWeight: 600 }}>סטטוס</label>
                <select
                  value={form.status}
                  onChange={(e) => update('status', e.target.value)}
                  className="w-full bg-white border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[13px] text-[#181510] focus:outline-none focus:border-[#ff8c00] transition-colors appearance-none cursor-pointer"
                  style={selectArrowStyle}
                >
                  <option value="ideas">בנק הצעות</option>
                  <option value="todo">לביצוע</option>
                  <option value="in-progress">בעבודה</option>
                  <option value="on-hold">בהמתנה</option>
                  <option value="done">הושלם</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] text-[#181510] mb-1.5" style={{ fontWeight: 600 }}>עדיפות</label>
                <select
                  value={form.priority}
                  onChange={(e) => update('priority', e.target.value)}
                  className="w-full bg-white border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[13px] text-[#181510] focus:outline-none focus:border-[#ff8c00] transition-colors appearance-none cursor-pointer"
                  style={selectArrowStyle}
                >
                  <option value="HIGH">גבוהה</option>
                  <option value="MEDIUM">בינונית</option>
                  <option value="LOW">נמוכה</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] text-[#181510] mb-1.5" style={{ fontWeight: 600 }}>סוג</label>
                <select
                  value={form.type}
                  onChange={(e) => update('type', e.target.value)}
                  className="w-full bg-white border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[13px] text-[#181510] focus:outline-none focus:border-[#ff8c00] transition-colors appearance-none cursor-pointer"
                  style={selectArrowStyle}
                >
                  <option value="TASK">משימה</option>
                  <option value="FEATURE">פיצ׳ר</option>
                  <option value="BUG">באג</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] text-[#181510] mb-1.5" style={{ fontWeight: 600 }}>פיצ׳ר</label>
                <select
                  value={form.feature}
                  onChange={(e) => update('feature', e.target.value)}
                  className="w-full bg-white border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[13px] text-[#181510] focus:outline-none focus:border-[#ff8c00] transition-colors appearance-none cursor-pointer"
                  style={selectArrowStyle}
                >
                  {FEATURE_OPTIONS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] text-[#181510] mb-1.5" style={{ fontWeight: 600 }}>גרסה</label>
                <select
                  value={form.version}
                  onChange={(e) => update('version', e.target.value)}
                  className="w-full bg-white border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[13px] text-[#181510] focus:outline-none focus:border-[#ff8c00] transition-colors appearance-none cursor-pointer"
                  style={selectArrowStyle}
                >
                  <option value="V1">V1 — MVP</option>
                  <option value="V2">V2 — הרחבה</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-[#f0ece6] bg-[#fdfcfb]">
          <div>
            {!isNew && (
              <button
                onClick={() => requestTaskDelete({ title: 'מחיקת משימה', itemName: form.title, onConfirm: async () => { onDelete(form.id); onClose(); } })}
                className="text-[13px] text-[#dc2626] hover:text-[#b91c1c] px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                style={{ fontWeight: 600 }}
              >
                מחיקה
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-[13px] text-[#181510] bg-white hover:bg-[#f5f3f0] border border-[#e7e1da] px-5 py-2.5 rounded-xl transition-colors"
              style={{ fontWeight: 600 }}
            >
              ביטול
            </button>
            <button
              onClick={handleSave}
              disabled={!isTitleValid}
              className="text-[13px] text-white bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-xl transition-colors shadow-md shadow-[#ff8c00]/20"
              style={{ fontWeight: 600 }}
            >
              {isNew ? 'צור משימה' : 'שמור שינויים'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Lightbox inside modal */}
      <AnimatePresence>
        {lightboxIndex !== null && form.attachments && form.attachments.length > 0 && (
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
  const activeTasks = tasks.filter(t => t.status !== 'ideas');
  const total = activeTasks.length;
  const done = activeTasks.filter(t => t.status === 'done').length;
  const inProgress = activeTasks.filter(t => t.status === 'in-progress').length;
  const todo = activeTasks.filter(t => t.status === 'todo').length;
  const highPriority = activeTasks.filter(t => t.priority === 'HIGH' && t.status !== 'done').length;

  return (
    <div className="flex items-center gap-5 text-[12px] flex-wrap">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#ff8c00]" />
        <span className="text-[#8d785e]">סה״כ משימות:</span>
        <span className="text-[#181510]" style={{ fontWeight: 700 }}>{total}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
        <span className="text-[#8d785e]">הושלמו:</span>
        <span className="text-[#22c55e]" style={{ fontWeight: 700 }}>{done}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#ff8c00]" />
        <span className="text-[#8d785e]">בעבודה:</span>
        <span className="text-[#ff8c00]" style={{ fontWeight: 700 }}>{inProgress}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#8d785e]" />
        <span className="text-[#8d785e]">לביצוע:</span>
        <span className="text-[#181510]" style={{ fontWeight: 700 }}>{todo}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#dc2626]" />
        <span className="text-[#8d785e]">עדיפות גבוהה:</span>
        <span className="text-[#dc2626]" style={{ fontWeight: 700 }}>{highPriority}</span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mr-auto">
        <span className="text-[#8d785e]">התקדמות:</span>
        <div className="w-28 h-2 bg-[#ece8e3] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-[#ff8c00] to-[#22c55e] rounded-full transition-all duration-500"
            style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
          />
        </div>
        <span className="text-[#181510]" style={{ fontWeight: 700 }}>
          {total > 0 ? Math.round((done / total) * 100) : 0}%
        </span>
      </div>
    </div>
  );
}

// ═══════════════ IDEAS BANK VIEW ═══════════════

type ViewMode = 'kanban' | 'ideas';

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
  const ideas = tasks.filter(t => t.status === 'ideas' && t.version === version);
  const [filterFeature, setFilterFeature] = useState<string>('ALL');

  const features = Array.from(new Set(ideas.map(t => t.feature))).sort();
  const filtered = filterFeature === 'ALL' ? ideas : ideas.filter(t => t.feature === filterFeature);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      {/* Sub-header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#a78bfa]/10 rounded-xl flex items-center justify-center">
            <Lightbulb size={18} className="text-[#a78bfa]" />
          </div>
          <div>
            <h2 className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>
              בנק הצעות — {version}
            </h2>
            <p className="text-[11px] text-[#8d785e]">
              {ideas.length} רעיונות לפיתוח עתידי
            </p>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 text-white px-4 py-2 rounded-xl text-[12px] transition-colors shadow-md"
          style={{ fontWeight: 600, backgroundColor: '#a78bfa', boxShadow: '0 4px 12px #a78bfa33' }}
        >
          <Plus size={14} />
          הצעה חדשה
        </button>
      </div>

      {/* Feature filter chips */}
      {features.length > 1 && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="text-[11px] text-[#8d785e]" style={{ fontWeight: 600 }}>סינון לפי פיצ'ר:</span>
          <button
            onClick={() => setFilterFeature('ALL')}
            className={`text-[11px] px-3 py-1.5 rounded-lg transition-colors ${
              filterFeature === 'ALL'
                ? 'bg-[#a78bfa] text-white'
                : 'bg-[#f0ece6] text-[#8d785e] hover:text-[#181510]'
            }`}
            style={{ fontWeight: 600 }}
          >
            הכל ({ideas.length})
          </button>
          {features.map(f => {
            const count = ideas.filter(t => t.feature === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilterFeature(f)}
                className={`text-[11px] px-3 py-1.5 rounded-lg transition-colors ${
                  filterFeature === f
                    ? 'bg-[#a78bfa] text-white'
                    : 'bg-[#f0ece6] text-[#8d785e] hover:text-[#181510]'
                }`}
                style={{ fontWeight: 600 }}
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
          <div className="w-16 h-16 bg-[#a78bfa]/10 rounded-2xl flex items-center justify-center mb-4">
            <Lightbulb size={28} className="text-[#a78bfa]" />
          </div>
          <p className="text-[14px] text-[#8d785e]" style={{ fontWeight: 600 }}>אין הצעות עדיין</p>
          <p className="text-[12px] text-[#b8a990] mt-1">לחצו על ״הצעה חדשה״ כדי להוסיף רעיון</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(task => {
              const TypeIcon = TYPE_CONFIG[task.type].icon;
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl border border-[#e7e1da] p-5 hover:shadow-lg hover:border-[#a78bfa]/30 transition-all group cursor-pointer"
                  onClick={() => onEdit(task)}
                >
                  {/* Top row: type + priority */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px]"
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
                        className="px-2 py-1 rounded-md text-[10px]"
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
                  <h3 className="text-[14px] text-[#181510] mb-2 leading-snug" style={{ fontWeight: 700 }}>
                    {task.title}
                  </h3>

                  {/* Description */}
                  {task.description && (
                    <p className="text-[12px] text-[#8d785e] mb-3 leading-relaxed line-clamp-3">
                      {task.description}
                    </p>
                  )}

                  {/* Feature + Tags */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0ece6] text-[#8d785e]" style={{ fontWeight: 600 }}>
                      {task.feature}
                    </span>
                    {task.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#a78bfa]/10 text-[#a78bfa]" style={{ fontWeight: 600 }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Promote button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onPromote(task); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] border-2 border-dashed border-[#e7e1da] text-[#8d785e] hover:border-[#a78bfa] hover:text-[#a78bfa] hover:bg-[#a78bfa]/5 transition-all opacity-0 group-hover:opacity-100"
                    style={{ fontWeight: 600 }}
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
      if (cached) return JSON.parse(cached);
    } catch {}
    return INITIAL_TASKS;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [activeVersion, setActiveVersion] = useState<Version>('V1');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ attachments: Task['attachments']; index: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TaskType | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const mountedRef = useRef(true);

  // ─── Load from server on mount ─────────────────
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function loadFromServer() {
      try {
        // 1. Seed INITIAL_TASKS to server (idempotent — skips if already seeded)
        const tasksToSeed = INITIAL_TASKS.map(({ attachments, ...rest }) => rest);
        await kanbanApi.seed(tasksToSeed as Task[], KANBAN_SEED_VERSION);

        // 2. Fetch all tasks from server
        const serverTasks = await kanbanApi.list();

        if (cancelled) return;

        if (serverTasks && serverTasks.length > 0) {
          setTasks(serverTasks as Task[]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverTasks));
          console.log(`[Kanban] Loaded ${serverTasks.length} tasks from server`);
        } else {
          // Fallback — server empty after seed (shouldn't happen)
          console.warn('[Kanban] Server returned 0 tasks, using INITIAL_TASKS');
          setTasks(INITIAL_TASKS);
        }
        setSyncError(false);
      } catch (err) {
        console.error('[Kanban] Failed to load from server, using cached data:', err);
        setSyncError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadFromServer();
    return () => { cancelled = true; mountedRef.current = false; };
  }, []);

  // ─── Cache to localStorage on change ───────────
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  // ─── Server sync helpers ───────────────────────
  const syncToServer = useCallback(async (action: string, fn: () => Promise<void>) => {
    setIsSyncing(true);
    try {
      await fn();
      setSyncError(false);
    } catch (err) {
      console.error(`[Kanban] Sync failed (${action}):`, err);
      setSyncError(true);
    } finally {
      if (mountedRef.current) setIsSyncing(false);
    }
  }, []);

  // ─── Filtering ─────────────────────────────────
  const versionTasks = tasks.filter(t => t.version === activeVersion);

  const filteredTasks = versionTasks.filter(task => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!task.title.toLowerCase().includes(q) && !task.description.toLowerCase().includes(q)) return false;
    }
    if (filterType !== 'ALL' && task.type !== filterType) return false;
    if (filterPriority !== 'ALL' && task.priority !== filterPriority) return false;
    return true;
  });

  const getColumnTasks = useCallback((status: Status) =>
    filteredTasks
      .filter(t => t.status === status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  [filteredTasks]);

  // ─── Handlers with server sync ─────────────────
  const handleAddTask = (status: Status) => {
    const newTask: Task = {
      id: generateId(),
      title: '',
      description: '',
      type: 'TASK',
      priority: 'MEDIUM',
      status,
      feature: FEATURE_OPTIONS[0],
      estimate: '',
      tags: [],
      createdAt: new Date().toISOString().split('T')[0],
      version: activeVersion,
    };
    setEditingTask(newTask);
    setIsNewTask(true);
  };

  const handleSaveTask = (task: Task) => {
    const creating = isNewTask; // Capture before state changes

    // Optimistic update
    if (creating) {
      setTasks(prev => [...prev, task]);
    } else {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    }
    setEditingTask(null);
    setIsNewTask(false);

    // Sync to server (without attachments — they're too large for KV)
    const { attachments, ...serverTask } = task;
    if (creating) {
      syncToServer('create', () => kanbanApi.create(serverTask).then(() => {}));
    } else {
      syncToServer('update', () => kanbanApi.update(task.id, serverTask).then(() => {}));
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    syncToServer('delete', () => kanbanApi.delete(id).then(() => {}));
  };

  const handleDragStart = (_e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDrop = (targetStatus: Status) => {
    if (!draggedTaskId) return;
    const taskId = draggedTaskId; // Capture before state changes
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === targetStatus) {
      setDraggedTaskId(null);
      return;
    }

    // Optimistic update
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: targetStatus } : t
    ));
    setDraggedTaskId(null);

    // Sync to server
    syncToServer('move', () => kanbanApi.update(taskId, { status: targetStatus }).then(() => {}));
  };


  const handlePromoteIdea = (task: Task) => {
    const promoted = { ...task, status: 'todo' as Status };
    setTasks(prev => prev.map(t => t.id === task.id ? promoted : t));
    syncToServer('promote', () => kanbanApi.update(task.id, { status: 'todo' }).then(() => {}));
  };

  const handleAddIdea = () => {
    const newTask: Task = {
      id: generateId(),
      title: '',
      description: '',
      type: 'FEATURE',
      priority: 'MEDIUM',
      status: 'ideas',
      feature: FEATURE_OPTIONS[0],
      estimate: '',
      tags: [],
      createdAt: new Date().toISOString().split('T')[0],
      version: activeVersion,
    };
    setEditingTask(newTask);
    setIsNewTask(true);
  };

  const handleRefreshFromServer = async () => {
    setIsLoading(true);
    try {
      const serverTasks = await kanbanApi.list();
      if (serverTasks && serverTasks.length > 0) {
        setTasks(serverTasks as Task[]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverTasks));
        setSyncError(false);
      }
    } catch (err) {
      console.error('[Kanban] Refresh from server failed:', err);
      setSyncError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Count tasks per version for the tabs
  const v1Count = tasks.filter(t => t.version === 'V1').length;
  const v2Count = tasks.filter(t => t.version === 'V2').length;
  const versionCounts: Record<Version, number> = { V1: v1Count, V2: v2Count };
  const ideasCount = tasks.filter(t => t.status === 'ideas' && t.version === activeVersion).length;

  const TYPE_FILTER_LABELS: Record<string, string> = { ALL: 'הכל', TASK: 'משימה', FEATURE: 'פיצ׳ר', BUG: 'באג' };
  const PRIO_FILTER_LABELS: Record<string, string> = { ALL: 'הכל', HIGH: 'גבוהה', MEDIUM: 'בינונית', LOW: 'נמוכה' };

  const activeTabColor = VERSION_TABS.find(v => v.id === activeVersion)?.color || '#ff8c00';

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f8f7f5]" dir="rtl">
      {/* Header */}
      <div className="border-b border-[#e7e1da] bg-white flex-shrink-0">
        <div className="max-w-[1500px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ff8c00]/10 rounded-xl flex items-center justify-center">
                  <LayoutGrid size={20} className="text-[#ff8c00]" />
                </div>
                <div>
                  <h1 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>
                    לוח משימות
                  </h1>
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] text-[#8d785e]">
                      ניהול משימות פיתוח TravelPro
                    </p>
                    {/* Sync status indicator */}
                    {isSyncing ? (
                      <div className="flex items-center gap-1 text-[10px] text-[#ff8c00]" style={{ fontWeight: 600 }}>
                        <Loader2 size={10} className="animate-spin" />
                        <span>שומר...</span>
                      </div>
                    ) : syncError ? (
                      <div className="flex items-center gap-1 text-[10px] text-[#dc2626]" style={{ fontWeight: 600 }}>
                        <CloudOff size={10} />
                        <span>לא מסונכרן</span>
                      </div>
                    ) : !isLoading ? (
                      <div className="flex items-center gap-1 text-[10px] text-[#22c55e]" style={{ fontWeight: 600 }}>
                        <Cloud size={10} />
                        <span>מסונכרן</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* ══════ VERSION TABS ══════ */}
              <div className="flex items-center bg-[#f0ece6] rounded-xl p-1 mr-4">
                {VERSION_TABS.map(tab => {
                  const isActive = activeVersion === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveVersion(tab.id)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] transition-all ${
                        isActive
                          ? 'bg-white shadow-sm'
                          : 'hover:bg-white/50'
                      }`}
                      style={{ fontWeight: isActive ? 700 : 500 }}
                    >
                      <Layers size={14} style={{ color: isActive ? tab.color : '#8d785e' }} />
                      <span style={{ color: isActive ? tab.color : '#8d785e' }}>
                        {tab.label}
                      </span>
                      <span className="text-[10px] text-[#8d785e]">
                        {tab.subtitle}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{
                          fontWeight: 700,
                          backgroundColor: isActive ? `${tab.color}15` : '#e7e1da',
                          color: isActive ? tab.color : '#8d785e',
                        }}
                      >
                        {versionCounts[tab.id]}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="version-indicator"
                          className="absolute bottom-0 right-3 left-3 h-[2px] rounded-full"
                          style={{ backgroundColor: tab.color }}
                          transition={{ duration: 0.25 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ══════ VIEW MODE TOGGLE ══════ */}
              <div className="flex items-center bg-[#f0ece6] rounded-xl p-1 mr-2">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all ${
                    viewMode === 'kanban' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                  }`}
                  style={{ fontWeight: viewMode === 'kanban' ? 700 : 500 }}
                >
                  <LayoutGrid size={13} style={{ color: viewMode === 'kanban' ? '#ff8c00' : '#8d785e' }} />
                  <span style={{ color: viewMode === 'kanban' ? '#ff8c00' : '#8d785e' }}>
                    לוח קנבן
                  </span>
                </button>
                <button
                  onClick={() => setViewMode('ideas')}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all ${
                    viewMode === 'ideas' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                  }`}
                  style={{ fontWeight: viewMode === 'ideas' ? 700 : 500 }}
                >
                  <Lightbulb size={13} style={{ color: viewMode === 'ideas' ? '#a78bfa' : '#8d785e' }} />
                  <span style={{ color: viewMode === 'ideas' ? '#a78bfa' : '#8d785e' }}>
                    בנק הצעות
                  </span>
                  {ideasCount > 0 && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{
                        fontWeight: 700,
                        backgroundColor: viewMode === 'ideas' ? '#a78bfa15' : '#e7e1da',
                        color: viewMode === 'ideas' ? '#a78bfa' : '#8d785e',
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
              {viewMode === 'kanban' && (
                <>
                  {/* Search */}
                  <div className="relative">
                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8a990]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="חיפוש משימות..."
                      className="w-52 bg-[#f8f7f5] border border-[#e7e1da] rounded-xl pr-9 pl-3 py-2 text-[12px] text-[#181510] placeholder-[#b8a990] focus:outline-none focus:border-[#ff8c00] focus:ring-2 focus:ring-[#ff8c00]/10 transition-all"
                    />
                  </div>

                  {/* Filter toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] border transition-colors ${
                      showFilters || filterType !== 'ALL' || filterPriority !== 'ALL'
                        ? 'bg-[#ff8c00]/10 border-[#ff8c00]/30 text-[#ff8c00]'
                        : 'bg-[#f8f7f5] border-[#e7e1da] text-[#8d785e] hover:text-[#181510]'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    <Filter size={13} />
                    סינון
                    {(filterType !== 'ALL' || filterPriority !== 'ALL') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff8c00]" />
                    )}
                  </button>

                  {/* Add task */}
                  <button
                    onClick={() => handleAddTask('todo')}
                    className="flex items-center gap-1.5 text-white px-4 py-2 rounded-xl text-[12px] transition-colors shadow-md"
                    style={{
                      fontWeight: 600,
                      backgroundColor: activeTabColor,
                      boxShadow: `0 4px 12px ${activeTabColor}33`,
                    }}
                  >
                    <Plus size={14} />
                    משימה חדשה
                  </button>
                </>
              )}

              {/* Refresh from server */}
              <button
                onClick={handleRefreshFromServer}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] bg-[#f8f7f5] border border-[#e7e1da] text-[#8d785e] hover:text-[#181510] transition-colors disabled:opacity-50"
                style={{ fontWeight: 600 }}
                title="רענון מהשרת"
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
                רענון
              </button>


            </div>
          </div>

          {/* Filter bar — kanban only */}
          <AnimatePresence>
            {showFilters && viewMode === 'kanban' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-4 py-3 border-t border-[#f0ece6]">
                  <span className="text-[12px] text-[#8d785e]" style={{ fontWeight: 600 }}>סוג:</span>
                  <div className="flex gap-1">
                    {(['ALL', 'TASK', 'FEATURE', 'BUG'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className={`text-[11px] px-3 py-1.5 rounded-lg transition-colors ${
                          filterType === t
                            ? 'bg-[#ff8c00] text-white'
                            : 'bg-[#f0ece6] text-[#8d785e] hover:text-[#181510]'
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        {TYPE_FILTER_LABELS[t]}
                      </button>
                    ))}
                  </div>

                  <div className="w-px h-5 bg-[#e7e1da]" />

                  <span className="text-[12px] text-[#8d785e]" style={{ fontWeight: 600 }}>עדיפות:</span>
                  <div className="flex gap-1">
                    {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setFilterPriority(p)}
                        className={`text-[11px] px-3 py-1.5 rounded-lg transition-colors ${
                          filterPriority === p
                            ? 'bg-[#ff8c00] text-white'
                            : 'bg-[#f0ece6] text-[#8d785e] hover:text-[#181510]'
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        {PRIO_FILTER_LABELS[p]}
                      </button>
                    ))}
                  </div>

                  {(filterType !== 'ALL' || filterPriority !== 'ALL') && (
                    <button
                      onClick={() => { setFilterType('ALL'); setFilterPriority('ALL'); }}
                      className="text-[11px] text-[#dc2626] hover:text-[#b91c1c] transition-colors mr-auto"
                      style={{ fontWeight: 600 }}
                    >
                      נקה סינון
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats — scoped to active version, kanban only */}
          {viewMode === 'kanban' && (
            <div className="mt-3">
              <StatsBar tasks={versionTasks} />
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative flex-1 min-h-0 flex flex-col">
        {/* Loading overlay on initial load */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#f8f7f5]/70 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="animate-spin text-[#ff8c00]" />
              <span className="text-[13px] text-[#8d785e]" style={{ fontWeight: 600 }}>טוען משימות מהשרת...</span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {viewMode === 'kanban' ? (
            <motion.div
              key={`kanban-${activeVersion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex-1 min-h-0 max-w-[1500px] w-full mx-auto px-6 py-6 overflow-x-auto"
            >
              <div className="flex gap-4 justify-center min-w-max h-full">
                {COLUMNS.map(column => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={getColumnTasks(column.id)}
                    onEditTask={(task) => { setEditingTask(task); setIsNewTask(false); }}
                    onAddTask={handleAddTask}
                    draggedTaskId={draggedTaskId}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                    onOpenLightbox={(attachments, index) => setLightboxData({ attachments, index })}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`ideas-${activeVersion}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="flex-1 min-h-0 overflow-y-auto kanban-scroll"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#d4cdc3 transparent' }}
            >
              <IdeasBank
                tasks={tasks}
                version={activeVersion}
                onEdit={(task) => { setEditingTask(task); setIsNewTask(false); }}
                onPromote={handlePromoteIdea}
                onAdd={handleAddIdea}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {editingTask && (
          <TaskModal
            task={editingTask}
            isNew={isNewTask}
            activeVersion={activeVersion}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
            onClose={() => { setEditingTask(null); setIsNewTask(false); }}
          />
        )}
      </AnimatePresence>

      {/* Card-level Lightbox (from task card thumbnail clicks) */}
      <AnimatePresence>
        {lightboxData && lightboxData.attachments && lightboxData.attachments.length > 0 && (
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