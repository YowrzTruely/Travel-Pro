import { useMutation, useQuery } from "convex/react";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  FolderOpen,
  Hash,
  Keyboard,
  LayoutList,
  Lightbulb,
  Loader2,
  MapPin,
  Microscope,
  PartyPopper,
  Phone,
  RotateCcw,
  SkipForward,
  Sparkles,
  Tag,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import { CategoryIcon } from "./CategoryIcons";
import type { Supplier } from "./data";

// ═══════════════════════════════════════════════════
// CATEGORIES & SUBCATEGORIES
// ═══════════════════════════════════════════════════

interface CategoryDef {
  color: string;
  icon: string;
  name: string;
  subs: string[];
}

const CATEGORIES: CategoryDef[] = [
  {
    name: "תחבורה",
    color: "#3b82f6",
    icon: "תחבורה",
    subs: ["אוטובוסים", "הסעות מיניבוס", "רכבים פרטיים", "שאטלים", "טיסות"],
  },
  {
    name: "מזון",
    color: "#22c55e",
    icon: "מזון",
    subs: ["קייטרינג", "מסעדות", "בר", "קפה ומאפים", "אוכל רחוב"],
  },
  {
    name: "אטרקציות",
    color: "#a855f7",
    icon: "אטרקציות",
    subs: ["ספורט אתגרי", "סיורים", "סדנאות", "פארקי שעשועים", "טבע ונוף"],
  },
  {
    name: "לינה",
    color: "#ec4899",
    icon: "לינה",
    subs: ["מלונות", "צימרים", "אכסניות", "קמפינג", "ריזורט"],
  },
  {
    name: "בידור",
    color: "#f59e0b",
    icon: "בידור",
    subs: ["DJ / מוזיקה", "אומנים", "מנחים", "מופעים", "גיבוש"],
  },
  {
    name: "צילום ווידאו",
    color: "#06b6d4",
    icon: "צילום ווידאו",
    subs: ["צלם אירועים", "צלם וידאו", "דרון", "עריכה", "אלבומים"],
  },
  {
    name: "ציוד ולוגיסטיקה",
    color: "#64748b",
    icon: "ציוד ולוגיסטיקה",
    subs: ["הגברה ותאורה", "במות", "ריהוט", "אוהלים", "שילוט"],
  },
  {
    name: "שיווק ופרסום",
    color: "#e11d48",
    icon: "שיווק ופרסום",
    subs: ["רכש מדיה", "ייעוץ שיווקי", "עיצוב גרפי", "דפוס", "דיגיטל"],
  },
  {
    name: "ביטוח",
    color: "#0d9488",
    icon: "ביטוח",
    subs: ["ביטוח אירועים", "ביטוח נוסעים", "ביטוח ציוד", "אחריות מקצועית"],
  },
  {
    name: "הדרכה",
    color: "#7c3aed",
    icon: "הדרכה",
    subs: ["מדריכי טיולים", "מרצים", "מנחי קבוצות", "מתרגמים"],
  },
];

// Keyword → category mapping for AI suggestions
const KEYWORD_RULES: [RegExp, string][] = [
  [/הסע|אוטובוס|רכב|נסיע|שאטל|טיס/i, "תחבורה"],
  [/קייטרינג|מזון|אוכל|מסעדה|בר|בשר|כשר|טעמ/i, "מזון"],
  [/ספורט|אתגר|רייז|קיאק|טיול|גלישה|שט|אופני|ג׳יפ/i, "אטרקציות"],
  [/מלון|צימר|לינה|אכסני|ריזורט|קמפינג/i, "לינה"],
  [/DJ|מוזיק|אומן|מופע|הופע|מנח|גיבוש|בידור|הנפש/i, "בידור"],
  [/צילום|וידאו|דרון|צלם|סרט/i, "צילום ווידאו"],
  [/ציוד|הגבר|תאור|במה|ריהוט|אוהל|שילוט|לוגיסט/i, "ציוד ולוגיסטיקה"],
  [/שיווק|פרסום|מדיה|עיצוב|גרפי|דפוס|דיגיטל/i, "שיווק ופרסום"],
  [/ביטוח/i, "ביטוח"],
  [/מדריך|הדרכ|מרצה|מנחה|תרגום/i, "הדרכה"],
  [/יקב|יין|טעימ/i, "אטרקציות"],
];

function suggestCategory(
  supplier: Supplier
): { category: string; keywords: string[]; reason: string } | null {
  const text =
    `${supplier.name} ${supplier.notes || ""} ${supplier.category || ""}`.toLowerCase();
  const foundKeywords: string[] = [];

  for (const [pattern, cat] of KEYWORD_RULES) {
    const match = text.match(pattern);
    if (match) {
      foundKeywords.push(match[0]);
      return {
        category: cat,
        keywords: foundKeywords,
        reason: `זיהוי מילות מפתח: "${foundKeywords.join(", ")}" — ייתכן שמדובר בספק ${cat.toLowerCase()}.`,
      };
    }
  }
  return null;
}

function isUnclassified(s: Supplier): boolean {
  if (!s.category || s.category.trim() === "") {
    return true;
  }
  const lower = s.category.trim().toLowerCase();
  return ["כללי", "general", "אחר", "other", "—", "-"].includes(lower);
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════

export function ClassificationWizard() {
  const navigate = useNavigate();

  const suppliersData = useQuery(api.suppliers.list);
  const updateSupplier = useMutation(api.suppliers.update);

  // Data
  const [_allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [queue, setQueue] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Current supplier
  const [currentIdx, setCurrentIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left"
  );

  // Classification form
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Progress
  const [classifiedCount, setClassifiedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [allDone, setAllDone] = useState(false);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Shortcuts tooltip
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Tags
  const TAGS = ["B2B", "שנתי", "דחוף", "VIP", "חדש", "מומלץ"];

  // ─── AI suggestion ───────────────────────────────
  const applySuggestion = useCallback((supplier: Supplier) => {
    const suggestion = suggestCategory(supplier);
    if (suggestion) {
      setSelectedCategory(suggestion.category);
      const catDef = CATEGORIES.find((c) => c.name === suggestion.category);
      setSelectedSub(catDef?.subs[0] || "");
    } else {
      setSelectedCategory("");
      setSelectedSub("");
    }
    setSelectedTags([]);
  }, []);

  // ─── Load suppliers from Convex ──────────────────
  useEffect(() => {
    if (suppliersData === undefined) {
      return; // still loading
    }
    const suppliers = suppliersData as any as Supplier[];
    setAllSuppliers(suppliers);
    const unclassified = suppliers.filter(isUnclassified);
    setQueue(unclassified);
    if (unclassified.length > 0) {
      applySuggestion(unclassified[0]);
    }
    if (unclassified.length === 0) {
      setAllDone(true);
    }
    setLoading(false);
  }, [suppliersData, applySuggestion]);

  // ─── Timer ───────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const currentSupplier = queue[currentIdx] || null;
  const aiSuggestion = currentSupplier
    ? suggestCategory(currentSupplier)
    : null;

  // ─── Actions ─────────────────────────────────────
  const moveToNext = useCallback(() => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= queue.length) {
      setAllDone(true);
    } else {
      setSlideDirection("left");
      setCurrentIdx(nextIdx);
      applySuggestion(queue[nextIdx]);
    }
  }, [currentIdx, queue, applySuggestion]);

  const handleApprove = useCallback(async () => {
    if (!(currentSupplier && selectedCategory)) {
      appToast.warning("יש לבחור קטגוריה לפני אישור");
      return;
    }
    setSaving(true);
    try {
      const catDef = CATEGORIES.find((c) => c.name === selectedCategory);
      await updateSupplier({
        id: (currentSupplier as any)._id,
        category: selectedCategory,
        categoryColor: catDef?.color || "#8d785e",
        icon: catDef?.name || "כללי",
        notes:
          selectedTags.length > 0
            ? `${currentSupplier.notes && currentSupplier.notes !== "-" ? `${currentSupplier.notes} | ` : ""}תגיות: ${selectedTags.join(", ")}${selectedSub ? ` | תת-קטגוריה: ${selectedSub}` : ""}`
            : selectedSub
              ? `${currentSupplier.notes && currentSupplier.notes !== "-" ? `${currentSupplier.notes} | ` : ""}תת-קטגוריה: ${selectedSub}`
              : currentSupplier.notes,
      });
      setClassifiedCount((c) => c + 1);
      appToast.success(
        "הספק סווג בהצלחה!",
        `${currentSupplier.name} → ${selectedCategory}${selectedSub ? ` › ${selectedSub}` : ""}`
      );
      moveToNext();
    } catch (err) {
      console.error("[ClassificationWizard] Save error:", err);
      appToast.error("שגיאה בשמירת הסיווג");
    }
    setSaving(false);
  }, [
    currentSupplier,
    selectedCategory,
    selectedSub,
    selectedTags,
    moveToNext,
    updateSupplier,
  ]);

  const handleSkip = useCallback(() => {
    setSkippedCount((s) => s + 1);
    setSlideDirection("left");
    moveToNext();
  }, [moveToNext]);

  const handleArchive = useCallback(async () => {
    if (!currentSupplier) {
      return;
    }
    setSaving(true);
    try {
      await updateSupplier({
        id: (currentSupplier as any)._id,
        category: "ארכיון",
        categoryColor: "#94a3b8",
        notes: `${currentSupplier.notes && currentSupplier.notes !== "-" ? `${currentSupplier.notes} | ` : ""}הועבר לארכיון`,
      });
      setClassifiedCount((c) => c + 1);
      appToast.info("הספק הועבר לארכיון", currentSupplier.name);
      moveToNext();
    } catch (_err) {
      appToast.error("שגיאה בהעברה לארכיון");
    }
    setSaving(false);
  }, [currentSupplier, moveToNext, updateSupplier]);

  // ─── Keyboard shortcuts ──────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (allDone || loading || saving) {
        return;
      }
      // Don't capture if user is in a select/input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        handleApprove();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleSkip();
      } else if (e.key === "a" || e.key === "A" || e.key === "א") {
        e.preventDefault();
        handleArchive();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [allDone, loading, saving, handleApprove, handleSkip, handleArchive]);

  // ─── Computed ────────────────────────────────────
  const totalInQueue = queue.length;
  const processedCount = classifiedCount + skippedCount;
  const progressPct =
    totalInQueue > 0 ? Math.round((processedCount / totalInQueue) * 100) : 0;
  const speedPerHour =
    elapsedSeconds > 60
      ? Math.round((classifiedCount / elapsedSeconds) * 3600)
      : 0;
  const currentCatDef = CATEGORIES.find((c) => c.name === selectedCategory);

  // ═══════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════
  if (loading) {
    return (
      <div
        className="flex min-h-full items-center justify-center bg-background font-['Assistant',sans-serif]"
        dir="rtl"
      >
        <motion.div
          animate={{ opacity: 1 }}
          className="text-center"
          initial={{ opacity: 0 }}
        >
          <Loader2
            className="mx-auto mb-4 animate-spin text-primary"
            size={40}
          />
          <p
            className="text-[16px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            טוען ספקים...
          </p>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // ALL DONE STATE
  // ═══════════════════════════════════════════════════
  if (allDone) {
    return (
      <div
        className="min-h-full bg-background font-['Assistant',sans-serif]"
        dir="rtl"
      >
        <div className="border-border border-b bg-card px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => navigate("/suppliers")}
              type="button"
            >
              <ArrowRight size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Microscope className="text-primary" size={16} />
              </div>
              <h1
                className="text-[22px] text-foreground"
                style={{ fontWeight: 700 }}
              >
                אשף סיווג ספקים מרוכז
              </h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-lg p-6">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              animate={{ scale: 1 }}
              className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/15"
              initial={{ scale: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <PartyPopper className="text-success" size={48} />
            </motion.div>

            <h2
              className="mb-2 text-[24px] text-foreground"
              style={{ fontWeight: 800 }}
            >
              {totalInQueue === 0 ? "אין ספקים לסיווג" : "כל הספקים סווגו!"}
            </h2>
            <p className="mb-6 text-[14px] text-muted-foreground">
              {totalInQueue === 0
                ? "כל הספקים כבר מסווגים בבנק הספקים שלכם."
                : `סיימתם לסווג ${classifiedCount} ספקים ב-${formatTime(elapsedSeconds)}.`}
            </p>

            {classifiedCount > 0 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 grid grid-cols-3 gap-3"
                initial={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.4 }}
              >
                <div className="rounded-xl border border-success/30 bg-success/10 p-3">
                  <div
                    className="text-[24px] text-success"
                    style={{ fontWeight: 800 }}
                  >
                    {classifiedCount}
                  </div>
                  <div className="text-[11px] text-success">סווגו</div>
                </div>
                <div className="rounded-xl border border-border bg-accent p-3">
                  <div
                    className="text-[24px] text-muted-foreground"
                    style={{ fontWeight: 800 }}
                  >
                    {skippedCount}
                  </div>
                  <div className="text-[11px] text-muted-foreground">דולגו</div>
                </div>
                <div className="rounded-xl border border-info/30 bg-info/10 p-3">
                  <div
                    className="text-[24px] text-info"
                    style={{ fontWeight: 800 }}
                  >
                    {formatTime(elapsedSeconds)}
                  </div>
                  <div className="text-[11px] text-blue-700">זמן עבודה</div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-[15px] text-white transition-colors hover:bg-primary-hover"
                onClick={() => navigate("/suppliers")}
                style={{ fontWeight: 600 }}
                type="button"
              >
                <FolderOpen size={16} /> עבור לבנק ספקים
              </button>
              {skippedCount > 0 && (
                <button
                  className="flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-[15px] text-muted-foreground transition-colors hover:bg-accent"
                  onClick={() => {
                    // Re-read suppliers from Convex (already reactive)
                    const fresh = (suppliersData ?? []) as any as Supplier[];
                    const remaining = fresh.filter(isUnclassified);
                    setQueue(remaining);
                    setCurrentIdx(0);
                    setSkippedCount(0);
                    setAllDone(remaining.length === 0);
                    if (remaining.length > 0) {
                      applySuggestion(remaining[0]);
                    }
                  }}
                  style={{ fontWeight: 600 }}
                  type="button"
                >
                  <RotateCcw size={16} /> חזור לדילוגים ({skippedCount})
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // MAIN WIZARD VIEW
  // ═══════════════════════════════════════════════════

  return (
    <div
      className="min-h-full bg-background font-['Assistant',sans-serif]"
      dir="rtl"
    >
      {/* Header */}
      <div className="border-border border-b bg-card px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => navigate("/suppliers")}
              type="button"
            >
              <ArrowRight size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Microscope className="text-primary" size={16} />
              </div>
              <h1
                className="text-[22px] text-foreground"
                style={{ fontWeight: 700 }}
              >
                אשף סיווג ספקים מרוכז
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress info */}
            <div className="hidden text-left md:block">
              <span className="text-[12px] text-muted-foreground">
                {processedCount} מתוך {totalInQueue}
              </span>
              <span
                className="mr-2 text-[12px] text-primary"
                style={{ fontWeight: 600 }}
              >
                {progressPct}%
              </span>
            </div>
            <div className="hidden h-2 w-32 overflow-hidden rounded-full bg-border md:block">
              <motion.div
                animate={{ width: `${progressPct}%` }}
                className="h-full rounded-full bg-gradient-to-l from-primary to-[#ffb347]"
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[12px] text-muted-foreground">
              <Clock size={12} />
              <span
                style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
              >
                {formatTime(elapsedSeconds)}
              </span>
            </div>

            <button
              className="relative p-2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setShowShortcuts(!showShortcuts)}
              type="button"
            >
              <Keyboard size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts tooltip */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-4 z-50 min-w-[200px] rounded-xl bg-foreground p-4 text-[13px] text-white shadow-xl lg:left-6"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span style={{ fontWeight: 700 }}>קיצורי מקלדת</span>
              <button onClick={() => setShowShortcuts(false)} type="button">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/70">אשר והמשך</span>
                <kbd className="rounded bg-card/10 px-2 py-0.5 text-[11px]">
                  Enter
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">דלג</span>
                <kbd className="rounded bg-card/10 px-2 py-0.5 text-[11px]">
                  Esc
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">ארכיון</span>
                <kbd className="rounded bg-card/10 px-2 py-0.5 text-[11px]">
                  A
                </kbd>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto p-4 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* ═══ MAIN CONTENT ═══ */}
          <div className="space-y-5 lg:col-span-3">
            {/* Supplier card — animated */}
            <AnimatePresence mode="wait">
              {currentSupplier && (
                <motion.div
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                  exit={{
                    opacity: 0,
                    x: slideDirection === "left" ? -80 : 80,
                    scale: 0.97,
                  }}
                  initial={{
                    opacity: 0,
                    x: slideDirection === "left" ? 80 : -80,
                    scale: 0.97,
                  }}
                  key={currentSupplier.id}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {/* Card header */}
                  <div className="bg-gradient-to-l from-primary/5 to-white p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[12px] text-success"
                        style={{ fontWeight: 600 }}
                      >
                        <Sparkles size={11} /> ספק {currentIdx + 1} מתוך{" "}
                        {totalInQueue}
                      </span>
                      <span className="text-[12px] text-muted-foreground">
                        {currentSupplier.verificationStatus === "verified"
                          ? "✅ מאומת"
                          : currentSupplier.verificationStatus === "pending"
                            ? "⏳ ממתין"
                            : "❓ לא מאומת"}
                      </span>
                    </div>

                    <h2
                      className="mb-4 text-[24px] text-foreground"
                      style={{ fontWeight: 700 }}
                    >
                      {currentSupplier.name}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div>
                        <div className="mb-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Hash size={10} /> מזהה
                        </div>
                        <div
                          className="text-[14px] text-foreground"
                          style={{ fontWeight: 600 }}
                        >
                          {currentSupplier.id}
                        </div>
                      </div>
                      <div>
                        <div className="mb-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Phone size={10} /> טלפון
                        </div>
                        <div
                          className="text-[14px] text-foreground"
                          dir="ltr"
                          style={{ fontWeight: 600 }}
                        >
                          {currentSupplier.phone || "—"}
                        </div>
                      </div>
                      <div>
                        <div className="mb-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin size={10} /> אזור
                        </div>
                        <div
                          className="text-[14px] text-foreground"
                          style={{ fontWeight: 600 }}
                        >
                          {currentSupplier.region || "—"}
                        </div>
                      </div>
                      <div>
                        <div className="mb-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <FolderOpen size={10} /> קטגוריה מקורית
                        </div>
                        <div className="text-[14px] text-muted-foreground">
                          {currentSupplier.category || "(ללא)"}
                        </div>
                      </div>
                    </div>

                    {currentSupplier.notes && currentSupplier.notes !== "-" && (
                      <div className="mt-3 flex items-center gap-1 text-[12px] text-muted-foreground">
                        <FileText size={11} /> הערות: {currentSupplier.notes}
                      </div>
                    )}
                  </div>

                  {/* AI suggestion */}
                  {aiSuggestion && (
                    <motion.div
                      animate={{ opacity: 1, height: "auto" }}
                      className="mx-5 my-4 rounded-xl border border-primary/30 bg-primary/5 p-3"
                      initial={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb
                          className="shrink-0 text-primary"
                          size={16}
                        />
                        <p className="text-[13px] text-muted-foreground">
                          {aiSuggestion.reason}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Classification form */}
                  <div className="space-y-4 p-5 pt-2">
                    {/* Category grid */}
                    <fieldset>
                      <legend
                        className="mb-2 block text-[13px] text-foreground"
                        style={{ fontWeight: 600 }}
                      >
                        קטגוריה ראשית
                      </legend>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                        {CATEGORIES.map((cat) => (
                          <button
                            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[12px] transition-all ${
                              selectedCategory === cat.name
                                ? "border-2 shadow-md"
                                : "border-border hover:border-tertiary"
                            }`}
                            key={cat.name}
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setSelectedSub(cat.subs[0] || "");
                            }}
                            style={{
                              fontWeight:
                                selectedCategory === cat.name ? 700 : 500,
                              borderColor:
                                selectedCategory === cat.name
                                  ? cat.color
                                  : undefined,
                              backgroundColor:
                                selectedCategory === cat.name
                                  ? `${cat.color}10`
                                  : undefined,
                              color:
                                selectedCategory === cat.name
                                  ? cat.color
                                  : "#181510",
                            }}
                            type="button"
                          >
                            <CategoryIcon
                              category={cat.name}
                              color={
                                selectedCategory === cat.name
                                  ? cat.color
                                  : "#8d785e"
                              }
                              size={16}
                            />
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {/* Sub-category */}
                    <AnimatePresence mode="wait">
                      {currentCatDef && (
                        <motion.fieldset
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          initial={{ opacity: 0, height: 0 }}
                          key={selectedCategory}
                          transition={{ duration: 0.2 }}
                        >
                          <legend
                            className="mb-1.5 block text-[13px] text-foreground"
                            style={{ fontWeight: 600 }}
                          >
                            תת-קטגוריה
                          </legend>
                          <div className="flex flex-wrap gap-2">
                            {currentCatDef.subs.map((sub) => (
                              <button
                                className={`rounded-lg border px-3 py-1.5 text-[12px] transition-all ${
                                  selectedSub === sub
                                    ? "border-transparent text-white"
                                    : "border-border text-muted-foreground hover:border-tertiary"
                                }`}
                                key={sub}
                                onClick={() => setSelectedSub(sub)}
                                style={{
                                  fontWeight: 600,
                                  backgroundColor:
                                    selectedSub === sub
                                      ? currentCatDef.color
                                      : undefined,
                                }}
                                type="button"
                              >
                                {sub}
                              </button>
                            ))}
                          </div>
                        </motion.fieldset>
                      )}
                    </AnimatePresence>

                    {/* Tags */}
                    <fieldset>
                      <legend
                        className="mb-2 block text-[13px] text-foreground"
                        style={{ fontWeight: 600 }}
                      >
                        <Tag className="ml-1 inline" size={12} /> תגיות
                        (אופציונלי)
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {TAGS.map((tag) => (
                          <button
                            className={`rounded-full border px-3 py-1 text-[12px] transition-all ${
                              selectedTags.includes(tag)
                                ? "border-primary bg-primary text-white"
                                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                            }`}
                            key={tag}
                            onClick={() =>
                              setSelectedTags((prev) =>
                                prev.includes(tag)
                                  ? prev.filter((t) => t !== tag)
                                  : [...prev, tag]
                              )
                            }
                            style={{ fontWeight: 600 }}
                            type="button"
                          >
                            {selectedTags.includes(tag) ? "✓ " : "+ "}
                            {tag}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions bar */}
            <motion.div
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
              layout
            >
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  disabled={saving}
                  onClick={handleArchive}
                  type="button"
                >
                  <Archive size={14} /> ארכיון
                </button>
                <button
                  className="flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  disabled={saving}
                  onClick={handleSkip}
                  type="button"
                >
                  <SkipForward size={14} /> דלג
                </button>
              </div>
              <button
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-[14px] text-white shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50"
                disabled={saving || !selectedCategory}
                onClick={handleApprove}
                style={{ fontWeight: 600 }}
                type="button"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={15} />
                ) : (
                  <CheckCircle size={15} />
                )}
                {saving ? "שומר..." : "אשר והמשך לבא"}
                {!saving && <ArrowLeft size={15} />}
              </button>
            </motion.div>

            {/* Keyboard tip */}
            <motion.div
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-[#fff7ed] p-3"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Keyboard className="text-primary" size={14} />
              <span className="text-[12px] text-muted-foreground">
                <kbd
                  className="mx-0.5 rounded border border-border bg-card px-1.5 py-0.5 text-[11px]"
                  style={{ fontWeight: 700 }}
                >
                  Enter
                </kbd>{" "}
                אישור
                <span className="mx-2 text-tertiary">|</span>
                <kbd
                  className="mx-0.5 rounded border border-border bg-card px-1.5 py-0.5 text-[11px]"
                  style={{ fontWeight: 700 }}
                >
                  Esc
                </kbd>{" "}
                דילוג
                <span className="mx-2 text-tertiary">|</span>
                <kbd
                  className="mx-0.5 rounded border border-border bg-card px-1.5 py-0.5 text-[11px]"
                  style={{ fontWeight: 700 }}
                >
                  A
                </kbd>{" "}
                ארכיון
              </span>
            </motion.div>
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <div className="space-y-5">
            {/* Queue */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3
                className="mb-3 flex items-center gap-2 text-[14px] text-foreground"
                style={{ fontWeight: 700 }}
              >
                <LayoutList className="text-primary" size={14} /> תור ספקים (
                {totalInQueue - processedCount} נותרו)
              </h3>
              <div className="max-h-[300px] space-y-1.5 overflow-y-auto">
                {queue
                  .slice(Math.max(0, currentIdx - 1), currentIdx + 6)
                  .map((item, i) => {
                    const actualIdx = Math.max(0, currentIdx - 1) + i;
                    const isCurrent = actualIdx === currentIdx;
                    const isPast = actualIdx < currentIdx;
                    return (
                      <motion.div
                        animate={{ opacity: 1, x: 0 }}
                        className={`rounded-lg p-2.5 transition-all ${
                          isCurrent
                            ? "bg-primary text-white shadow-sm"
                            : isPast
                              ? "border border-green-100 bg-success/10"
                              : "hover:bg-accent"
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        key={item.id}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="flex items-center gap-2">
                          {isPast && (
                            <CheckCircle
                              className="shrink-0 text-success"
                              size={12}
                            />
                          )}
                          <div className="min-w-0">
                            <div
                              className={`truncate text-[13px] ${isCurrent ? "text-white" : isPast ? "text-success" : "text-foreground"}`}
                              style={{ fontWeight: 600 }}
                            >
                              {item.name}
                            </div>
                            <div
                              className={`text-[11px] ${isCurrent ? "text-orange-100" : isPast ? "text-success" : "text-muted-foreground"}`}
                            >
                              {isPast ? "סווג" : `מזהה: ${item.id}`}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
              {totalInQueue - processedCount > 6 && (
                <p
                  className="mt-3 text-center text-[12px] text-primary"
                  style={{ fontWeight: 600 }}
                >
                  +{totalInQueue - processedCount - 6} ספקים נוספים
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3
                className="mb-3 flex items-center gap-2 text-[14px] text-foreground"
                style={{ fontWeight: 700 }}
              >
                <Zap className="text-primary" size={14} /> סטטיסטיקת עבודה
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[12px] text-muted-foreground">
                    סווגו
                  </span>
                  <span
                    className="text-[13px] text-success"
                    style={{ fontWeight: 700 }}
                  >
                    {classifiedCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-muted-foreground">
                    דולגו
                  </span>
                  <span
                    className="text-[13px] text-muted-foreground"
                    style={{ fontWeight: 600 }}
                  >
                    {skippedCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-muted-foreground">
                    קצב (לשעה)
                  </span>
                  <span
                    className="text-[13px] text-foreground"
                    style={{ fontWeight: 600 }}
                  >
                    {speedPerHour > 0 ? `${speedPerHour} ספקים/שעה` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-muted-foreground">
                    זמן עבודה
                  </span>
                  <span
                    className="text-[13px] text-foreground"
                    style={{
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatTime(elapsedSeconds)}
                  </span>
                </div>

                {/* Progress mini bar */}
                <div className="border-accent border-t pt-2">
                  <div className="mb-1 flex justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      התקדמות
                    </span>
                    <span
                      className="text-[11px] text-primary"
                      style={{ fontWeight: 700 }}
                    >
                      {progressPct}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-accent">
                    <motion.div
                      animate={{ width: `${progressPct}%` }}
                      className="h-full rounded-full bg-gradient-to-l from-primary to-[#ffb347]"
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
