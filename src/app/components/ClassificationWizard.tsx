import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ArrowLeft, Settings, HelpCircle, Archive,
  SkipForward, Keyboard, CheckCircle, Loader2, Search,
  Tag, FolderOpen, Sparkles, PartyPopper, ChevronDown,
  Clock, Zap, LayoutList, X, RotateCcw, MapPin, Phone, Hash,
  FileText, Lightbulb, Microscope
} from 'lucide-react';
import { suppliersApi } from './api';
import { appToast } from './AppToast';
import type { Supplier } from './data';
import { CategoryIcon } from './CategoryIcons';

// ═══════════════════════════════════════════════════
// CATEGORIES & SUBCATEGORIES
// ═══════════════════════════════════════════════════

interface CategoryDef {
  name: string;
  color: string;
  icon: string;
  subs: string[];
}

const CATEGORIES: CategoryDef[] = [
  { name: 'תחבורה', color: '#3b82f6', icon: 'תחבורה', subs: ['אוטובוסים', 'הסעות מיניבוס', 'רכבים פרטיים', 'שאטלים', 'טיסות'] },
  { name: 'מזון', color: '#22c55e', icon: 'מזון', subs: ['קייטרינג', 'מסעדות', 'בר', 'קפה ומאפים', 'אוכל רחוב'] },
  { name: 'אטרקציות', color: '#a855f7', icon: 'אטרקציות', subs: ['ספורט אתגרי', 'סיורים', 'סדנאות', 'פארקי שעשועים', 'טבע ונוף'] },
  { name: 'לינה', color: '#ec4899', icon: 'לינה', subs: ['מלונות', 'צימרים', 'אכסניות', 'קמפינג', 'ריזורט'] },
  { name: 'בידור', color: '#f59e0b', icon: 'בידור', subs: ['DJ / מוזיקה', 'אומנים', 'מנחים', 'מופעים', 'גיבוש'] },
  { name: 'צילום ווידאו', color: '#06b6d4', icon: 'צילום ווידאו', subs: ['צלם אירועים', 'צלם וידאו', 'דרון', 'עריכה', 'אלבומים'] },
  { name: 'ציוד ולוגיסטיקה', color: '#64748b', icon: 'ציוד ולוגיסטיקה', subs: ['הגברה ותאורה', 'במות', 'ריהוט', 'אוהלים', 'שילוט'] },
  { name: 'שיווק ופרסום', color: '#e11d48', icon: 'שיווק ופרסום', subs: ['רכש מדיה', 'ייעוץ שיווקי', 'עיצוב גרפי', 'דפוס', 'דיגיטל'] },
  { name: 'ביטוח', color: '#0d9488', icon: 'ביטוח', subs: ['ביטוח אירועים', 'ביטוח נוסעים', 'ביטוח ציוד', 'אחריות מקצועית'] },
  { name: 'הדרכה', color: '#7c3aed', icon: 'הדרכה', subs: ['מדריכי טיולים', 'מרצים', 'מנחי קבוצות', 'מתרגמים'] },
];

// Keyword → category mapping for AI suggestions
const KEYWORD_RULES: [RegExp, string][] = [
  [/הסע|אוטובוס|רכב|נסיע|שאטל|טיס/i, 'תחבורה'],
  [/קייטרינג|מזון|אוכל|מסעדה|בר|בשר|כשר|טעמ/i, 'מזון'],
  [/ספורט|אתגר|רייז|קיאק|טיול|גלישה|שט|אופני|ג׳יפ/i, 'אטרקציות'],
  [/מלון|צימר|לינה|אכסני|ריזורט|קמפינג/i, 'לינה'],
  [/DJ|מוזיק|אומן|מופע|הופע|מנח|גיבוש|בידור|הנפש/i, 'בידור'],
  [/צילום|וידאו|דרון|צלם|סרט/i, 'צילום ווידאו'],
  [/ציוד|הגבר|תאור|במה|ריהוט|אוהל|שילוט|לוגיסט/i, 'ציוד ולוגיסטיקה'],
  [/שיווק|פרסום|מדיה|עיצוב|גרפי|דפוס|דיגיטל/i, 'שיווק ופרסום'],
  [/ביטוח/i, 'ביטוח'],
  [/מדריך|הדרכ|מרצה|מנחה|תרגום/i, 'הדרכה'],
  [/יקב|יין|טעימ/i, 'אטרקציות'],
];

function suggestCategory(supplier: Supplier): { category: string; keywords: string[]; reason: string } | null {
  const text = `${supplier.name} ${supplier.notes || ''} ${supplier.category || ''}`.toLowerCase();
  const foundKeywords: string[] = [];

  for (const [pattern, cat] of KEYWORD_RULES) {
    const match = text.match(pattern);
    if (match) {
      foundKeywords.push(match[0]);
      const catDef = CATEGORIES.find(c => c.name === cat);
      return {
        category: cat,
        keywords: foundKeywords,
        reason: `זיהוי מילות מפתח: "${foundKeywords.join(', ')}" — ייתכן שמדובר בספק ${cat.toLowerCase()}.`,
      };
    }
  }
  return null;
}

function isUnclassified(s: Supplier): boolean {
  if (!s.category || s.category.trim() === '') return true;
  const lower = s.category.trim().toLowerCase();
  return ['כללי', 'general', 'אחר', 'other', '—', '-'].includes(lower);
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════

export function ClassificationWizard() {
  const navigate = useNavigate();

  // Data
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [queue, setQueue] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Current supplier
  const [currentIdx, setCurrentIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');

  // Classification form
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
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
  const TAGS = ['B2B', 'שנתי', 'דחוף', 'VIP', 'חדש', 'מומלץ'];

  // ─── Load suppliers ──────────────────────────────
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const suppliers = await suppliersApi.list();
        setAllSuppliers(suppliers);
        const unclassified = suppliers.filter(isUnclassified);
        setQueue(unclassified);
        if (unclassified.length > 0) {
          applySuggestion(unclassified[0]);
        }
        if (unclassified.length === 0) {
          setAllDone(true);
        }
      } catch (err) {
        console.error('[ClassificationWizard] Load error:', err);
        appToast.error('שגיאה בטעינת ספקים');
      }
      setLoading(false);
    })();
  }, []);

  // ─── Timer ───────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // ─── AI suggestion ───────────────────────────────
  const applySuggestion = useCallback((supplier: Supplier) => {
    const suggestion = suggestCategory(supplier);
    if (suggestion) {
      setSelectedCategory(suggestion.category);
      const catDef = CATEGORIES.find(c => c.name === suggestion.category);
      setSelectedSub(catDef?.subs[0] || '');
    } else {
      setSelectedCategory('');
      setSelectedSub('');
    }
    setSelectedTags([]);
  }, []);

  const currentSupplier = queue[currentIdx] || null;
  const aiSuggestion = currentSupplier ? suggestCategory(currentSupplier) : null;

  // ─── Actions ─────────────────────────────────────
  const moveToNext = useCallback(() => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= queue.length) {
      setAllDone(true);
    } else {
      setSlideDirection('left');
      setCurrentIdx(nextIdx);
      applySuggestion(queue[nextIdx]);
    }
  }, [currentIdx, queue, applySuggestion]);

  const handleApprove = useCallback(async () => {
    if (!currentSupplier || !selectedCategory) {
      appToast.warning('יש לבחור קטגוריה לפני אישור');
      return;
    }
    setSaving(true);
    try {
      const catDef = CATEGORIES.find(c => c.name === selectedCategory);
      await suppliersApi.update(currentSupplier.id, {
        category: selectedCategory,
        categoryColor: catDef?.color || '#8d785e',
        icon: catDef?.name || 'כללי',
        notes: selectedTags.length > 0
          ? `${currentSupplier.notes && currentSupplier.notes !== '-' ? currentSupplier.notes + ' | ' : ''}תגיות: ${selectedTags.join(', ')}${selectedSub ? ' | תת-קטגוריה: ' + selectedSub : ''}`
          : (selectedSub ? `${currentSupplier.notes && currentSupplier.notes !== '-' ? currentSupplier.notes + ' | ' : ''}תת-קטגוריה: ${selectedSub}` : currentSupplier.notes),
      });
      setClassifiedCount(c => c + 1);
      appToast.success('הספק סווג בהצלחה!', `${currentSupplier.name} → ${selectedCategory}${selectedSub ? ' › ' + selectedSub : ''}`);
      moveToNext();
    } catch (err) {
      console.error('[ClassificationWizard] Save error:', err);
      appToast.error('שגיאה בשמירת הסיווג');
    }
    setSaving(false);
  }, [currentSupplier, selectedCategory, selectedSub, selectedTags, moveToNext]);

  const handleSkip = useCallback(() => {
    setSkippedCount(s => s + 1);
    setSlideDirection('left');
    moveToNext();
  }, [moveToNext]);

  const handleArchive = useCallback(async () => {
    if (!currentSupplier) return;
    setSaving(true);
    try {
      await suppliersApi.update(currentSupplier.id, {
        category: 'ארכיון',
        categoryColor: '#94a3b8',
        notes: `${currentSupplier.notes && currentSupplier.notes !== '-' ? currentSupplier.notes + ' | ' : ''}הועבר לארכיון`,
      });
      setClassifiedCount(c => c + 1);
      appToast.info('הספק הועבר לארכיון', currentSupplier.name);
      moveToNext();
    } catch (err) {
      appToast.error('שגיאה בהעברה לארכיון');
    }
    setSaving(false);
  }, [currentSupplier, moveToNext]);

  // ─── Keyboard shortcuts ──────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (allDone || loading || saving) return;
      // Don't capture if user is in a select/input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleApprove();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'א') {
        e.preventDefault();
        handleArchive();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [allDone, loading, saving, handleApprove, handleSkip, handleArchive]);

  // ─── Computed ────────────────────────────────────
  const totalInQueue = queue.length;
  const processedCount = classifiedCount + skippedCount;
  const progressPct = totalInQueue > 0 ? Math.round((processedCount / totalInQueue) * 100) : 0;
  const speedPerHour = elapsedSeconds > 60 ? Math.round((classifiedCount / elapsedSeconds) * 3600) : 0;
  const currentCatDef = CATEGORIES.find(c => c.name === selectedCategory);

  // ═══════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="min-h-full bg-[#f8f7f5] font-['Assistant',sans-serif] flex items-center justify-center" dir="rtl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 size={40} className="animate-spin text-[#ff8c00] mx-auto mb-4" />
          <p className="text-[16px] text-[#181510]" style={{ fontWeight: 600 }}>טוען ספקים...</p>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // ALL DONE STATE
  // ═══════════════════════════════════════════════════
  if (allDone) {
    return (
      <div className="min-h-full bg-[#f8f7f5] font-['Assistant',sans-serif]" dir="rtl">
        <div className="bg-white border-b border-[#e7e1da] px-4 lg:px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/suppliers')} className="text-[#8d785e] hover:text-[#181510] transition-colors">
              <ArrowRight size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ff8c00]/10 rounded-lg flex items-center justify-center">
                <Microscope size={16} className="text-[#ff8c00]" />
              </div>
              <h1 className="text-[22px] text-[#181510]" style={{ fontWeight: 700 }}>אשף סיווג ספקים מרוכז</h1>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-white rounded-2xl border border-[#e7e1da] p-8 text-center shadow-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <PartyPopper size={48} className="text-green-600" />
            </motion.div>

            <h2 className="text-[24px] text-[#181510] mb-2" style={{ fontWeight: 800 }}>
              {totalInQueue === 0 ? 'אין ספקים לסיווג' : 'כל הספקים סווגו!'}
            </h2>
            <p className="text-[14px] text-[#8d785e] mb-6">
              {totalInQueue === 0
                ? 'כל הספקים כבר מסווגים בבנק הספקים שלכם.'
                : `סיימתם לסווג ${classifiedCount} ספקים ב-${formatTime(elapsedSeconds)}.`
              }
            </p>

            {classifiedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-3 mb-6"
              >
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <div className="text-[24px] text-green-600" style={{ fontWeight: 800 }}>{classifiedCount}</div>
                  <div className="text-[11px] text-green-700">סווגו</div>
                </div>
                <div className="bg-[#f5f3f0] border border-[#e7e1da] rounded-xl p-3">
                  <div className="text-[24px] text-[#8d785e]" style={{ fontWeight: 800 }}>{skippedCount}</div>
                  <div className="text-[11px] text-[#8d785e]">דולגו</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="text-[24px] text-blue-600" style={{ fontWeight: 800 }}>{formatTime(elapsedSeconds)}</div>
                  <div className="text-[11px] text-blue-700">זמן עבודה</div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => navigate('/suppliers')}
                className="flex items-center gap-2 text-[15px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-6 py-3 rounded-xl transition-colors"
                style={{ fontWeight: 600 }}
              >
                <FolderOpen size={16} /> עבור לבנק ספקים
              </button>
              {skippedCount > 0 && (
                <button
                  onClick={async () => {
                    // Re-fetch suppliers to get only the still-unclassified ones
                    setLoading(true);
                    try {
                      const fresh = await suppliersApi.list();
                      const remaining = fresh.filter(isUnclassified);
                      setQueue(remaining);
                      setCurrentIdx(0);
                      setSkippedCount(0);
                      setAllDone(remaining.length === 0);
                      if (remaining.length > 0) applySuggestion(remaining[0]);
                    } catch (err) {
                      appToast.error('שגיאה בטעינת ספקים');
                    }
                    setLoading(false);
                  }}
                  className="flex items-center gap-2 text-[15px] text-[#8d785e] border border-[#e7e1da] px-5 py-3 rounded-xl hover:bg-[#f5f3f0] transition-colors"
                  style={{ fontWeight: 600 }}
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
    <div className="min-h-full bg-[#f8f7f5] font-['Assistant',sans-serif]" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#e7e1da] px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/suppliers')} className="text-[#8d785e] hover:text-[#181510] transition-colors">
              <ArrowRight size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ff8c00]/10 rounded-lg flex items-center justify-center">
                <Microscope size={16} className="text-[#ff8c00]" />
              </div>
              <h1 className="text-[22px] text-[#181510]" style={{ fontWeight: 700 }}>אשף סיווג ספקים מרוכז</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress info */}
            <div className="text-left hidden md:block">
              <span className="text-[12px] text-[#8d785e]">{processedCount} מתוך {totalInQueue}</span>
              <span className="text-[12px] text-[#ff8c00] mr-2" style={{ fontWeight: 600 }}>{progressPct}%</span>
            </div>
            <div className="w-32 h-2 bg-[#ddd6cb] rounded-full overflow-hidden hidden md:block">
              <motion.div
                className="h-full bg-gradient-to-l from-[#ff8c00] to-[#ffb347] rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1 text-[12px] text-[#8d785e] bg-[#f5f3f0] px-2.5 py-1 rounded-full">
              <Clock size={12} />
              <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatTime(elapsedSeconds)}</span>
            </div>

            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="p-2 text-[#8d785e] hover:text-[#181510] transition-colors relative"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-4 lg:left-6 top-16 z-50 bg-[#181510] text-white rounded-xl p-4 shadow-xl text-[13px] min-w-[200px]"
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontWeight: 700 }}>קיצורי מקלדת</span>
              <button onClick={() => setShowShortcuts(false)}><X size={14} /></button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-white/70">אשר והמשך</span><kbd className="bg-white/10 px-2 py-0.5 rounded text-[11px]">Enter</kbd></div>
              <div className="flex justify-between"><span className="text-white/70">דלג</span><kbd className="bg-white/10 px-2 py-0.5 rounded text-[11px]">Esc</kbd></div>
              <div className="flex justify-between"><span className="text-white/70">ארכיון</span><kbd className="bg-white/10 px-2 py-0.5 rounded text-[11px]">A</kbd></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto p-4 lg:p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* ═══ MAIN CONTENT ═══ */}
          <div className="lg:col-span-3 space-y-5">
            {/* Supplier card — animated */}
            <AnimatePresence mode="wait">
              {currentSupplier && (
                <motion.div
                  key={currentSupplier.id}
                  initial={{ opacity: 0, x: slideDirection === 'left' ? 80 : -80, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: slideDirection === 'left' ? -80 : 80, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="bg-white rounded-2xl border border-[#e7e1da] shadow-sm overflow-hidden"
                >
                  {/* Card header */}
                  <div className="bg-gradient-to-l from-[#fff7ed] to-white p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1" style={{ fontWeight: 600 }}>
                        <Sparkles size={11} /> ספק {currentIdx + 1} מתוך {totalInQueue}
                      </span>
                      <span className="text-[12px] text-[#8d785e]">
                        {currentSupplier.verificationStatus === 'verified' ? '✅ מאומת' :
                         currentSupplier.verificationStatus === 'pending' ? '⏳ ממתין' : '❓ לא מאומת'}
                      </span>
                    </div>

                    <h2 className="text-[24px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>{currentSupplier.name}</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-[11px] text-[#8d785e] mb-0.5 flex items-center gap-1"><Hash size={10} /> מזהה</div>
                        <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{currentSupplier.id}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#8d785e] mb-0.5 flex items-center gap-1"><Phone size={10} /> טלפון</div>
                        <div className="text-[14px] text-[#181510]" dir="ltr" style={{ fontWeight: 600 }}>{currentSupplier.phone || '—'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#8d785e] mb-0.5 flex items-center gap-1"><MapPin size={10} /> אזור</div>
                        <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{currentSupplier.region || '—'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#8d785e] mb-0.5 flex items-center gap-1"><FolderOpen size={10} /> קטגוריה מקורית</div>
                        <div className="text-[14px] text-[#8d785e]">{currentSupplier.category || '(ללא)'}</div>
                      </div>
                    </div>

                    {currentSupplier.notes && currentSupplier.notes !== '-' && (
                      <div className="mt-3 text-[12px] text-[#8d785e] flex items-center gap-1">
                        <FileText size={11} /> הערות: {currentSupplier.notes}
                      </div>
                    )}
                  </div>

                  {/* AI suggestion */}
                  {aiSuggestion && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mx-5 my-4 bg-[#ff8c00]/5 border border-[#ff8c00]/30 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb size={16} className="text-[#ff8c00] shrink-0" />
                        <p className="text-[13px] text-[#6b5d45]">
                          {aiSuggestion.reason}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Classification form */}
                  <div className="p-5 pt-2 space-y-4">
                    {/* Category grid */}
                    <div>
                      <label className="text-[13px] text-[#181510] mb-2 block" style={{ fontWeight: 600 }}>קטגוריה ראשית</label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat.name}
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setSelectedSub(cat.subs[0] || '');
                            }}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[12px] transition-all ${
                              selectedCategory === cat.name
                                ? 'border-2 shadow-md'
                                : 'border-[#e7e1da] hover:border-[#d4cdc3]'
                            }`}
                            style={{
                              fontWeight: selectedCategory === cat.name ? 700 : 500,
                              borderColor: selectedCategory === cat.name ? cat.color : undefined,
                              backgroundColor: selectedCategory === cat.name ? `${cat.color}10` : undefined,
                              color: selectedCategory === cat.name ? cat.color : '#181510',
                            }}
                          >
                            <CategoryIcon category={cat.name} size={16} color={selectedCategory === cat.name ? cat.color : '#8d785e'} />
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sub-category */}
                    <AnimatePresence mode="wait">
                      {currentCatDef && (
                        <motion.div
                          key={selectedCategory}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <label className="text-[13px] text-[#181510] mb-1.5 block" style={{ fontWeight: 600 }}>תת-קטגוריה</label>
                          <div className="flex flex-wrap gap-2">
                            {currentCatDef.subs.map(sub => (
                              <button
                                key={sub}
                                onClick={() => setSelectedSub(sub)}
                                className={`text-[12px] px-3 py-1.5 rounded-lg border transition-all ${
                                  selectedSub === sub
                                    ? 'text-white border-transparent'
                                    : 'border-[#e7e1da] text-[#8d785e] hover:border-[#d4cdc3]'
                                }`}
                                style={{
                                  fontWeight: 600,
                                  backgroundColor: selectedSub === sub ? currentCatDef.color : undefined,
                                }}
                              >
                                {sub}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tags */}
                    <div>
                      <label className="text-[13px] text-[#181510] mb-2 block" style={{ fontWeight: 600 }}>
                        <Tag size={12} className="inline ml-1" /> תגיות (אופציונלי)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                            className={`text-[12px] px-3 py-1 rounded-full border transition-all ${
                              selectedTags.includes(tag)
                                ? 'bg-[#ff8c00] text-white border-[#ff8c00]'
                                : 'border-[#e7e1da] text-[#8d785e] hover:border-[#ff8c00] hover:text-[#ff8c00]'
                            }`}
                            style={{ fontWeight: 600 }}
                          >
                            {selectedTags.includes(tag) ? '✓ ' : '+ '}{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions bar */}
            <motion.div
              layout
              className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl p-4 border border-[#e7e1da]"
            >
              <div className="flex gap-2">
                <button
                  onClick={handleArchive}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-[13px] text-[#8d785e] hover:text-[#181510] transition-colors disabled:opacity-50"
                >
                  <Archive size={14} /> ארכיון
                </button>
                <button
                  onClick={handleSkip}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-[13px] text-[#8d785e] hover:text-[#181510] transition-colors disabled:opacity-50"
                >
                  <SkipForward size={14} /> דלג
                </button>
              </div>
              <button
                onClick={handleApprove}
                disabled={saving || !selectedCategory}
                className="flex items-center gap-2 text-[14px] text-white bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 px-6 py-2.5 rounded-xl shadow-sm transition-colors"
                style={{ fontWeight: 600 }}
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                {saving ? 'שומר...' : 'אשר והמשך לבא'}
                {!saving && <ArrowLeft size={15} />}
              </button>
            </motion.div>

            {/* Keyboard tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-[#fff7ed] border border-[#ff8c00]/20 rounded-xl p-3 flex items-center justify-center gap-2"
            >
              <Keyboard size={14} className="text-[#ff8c00]" />
              <span className="text-[12px] text-[#6b5d45]">
                <kbd className="bg-white border border-[#e7e1da] px-1.5 py-0.5 rounded text-[11px] mx-0.5" style={{ fontWeight: 700 }}>Enter</kbd> אישור
                <span className="mx-2 text-[#d4cdc3]">|</span>
                <kbd className="bg-white border border-[#e7e1da] px-1.5 py-0.5 rounded text-[11px] mx-0.5" style={{ fontWeight: 700 }}>Esc</kbd> דילוג
                <span className="mx-2 text-[#d4cdc3]">|</span>
                <kbd className="bg-white border border-[#e7e1da] px-1.5 py-0.5 rounded text-[11px] mx-0.5" style={{ fontWeight: 700 }}>A</kbd> ארכיון
              </span>
            </motion.div>
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <div className="space-y-5">
            {/* Queue */}
            <div className="bg-white rounded-2xl border border-[#e7e1da] p-5 shadow-sm">
              <h3 className="text-[14px] text-[#181510] flex items-center gap-2 mb-3" style={{ fontWeight: 700 }}>
                <LayoutList size={14} className="text-[#ff8c00]" /> תור ספקים ({totalInQueue - processedCount} נותרו)
              </h3>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                {queue.slice(Math.max(0, currentIdx - 1), currentIdx + 6).map((item, i) => {
                  const actualIdx = Math.max(0, currentIdx - 1) + i;
                  const isCurrent = actualIdx === currentIdx;
                  const isPast = actualIdx < currentIdx;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`p-2.5 rounded-lg transition-all ${
                        isCurrent
                          ? 'bg-[#ff8c00] text-white shadow-sm'
                          : isPast
                          ? 'bg-green-50 border border-green-100'
                          : 'hover:bg-[#f5f3f0]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isPast && <CheckCircle size={12} className="text-green-500 shrink-0" />}
                        <div className="min-w-0">
                          <div className={`text-[13px] truncate ${isCurrent ? 'text-white' : isPast ? 'text-green-700' : 'text-[#181510]'}`} style={{ fontWeight: 600 }}>
                            {item.name}
                          </div>
                          <div className={`text-[11px] ${isCurrent ? 'text-orange-100' : isPast ? 'text-green-500' : 'text-[#8d785e]'}`}>
                            {isPast ? 'סווג' : `מזהה: ${item.id}`}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {totalInQueue - processedCount > 6 && (
                <p className="text-[12px] text-[#ff8c00] mt-3 text-center" style={{ fontWeight: 600 }}>
                  +{totalInQueue - processedCount - 6} ספקים נוספים
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-[#e7e1da] p-5 shadow-sm">
              <h3 className="text-[14px] text-[#181510] flex items-center gap-2 mb-3" style={{ fontWeight: 700 }}>
                <Zap size={14} className="text-[#ff8c00]" /> סטטיסטיקת עבודה
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[12px] text-[#8d785e]">סווגו</span>
                  <span className="text-[13px] text-green-600" style={{ fontWeight: 700 }}>{classifiedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-[#8d785e]">דולגו</span>
                  <span className="text-[13px] text-[#8d785e]" style={{ fontWeight: 600 }}>{skippedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-[#8d785e]">קצב (לשעה)</span>
                  <span className="text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>
                    {speedPerHour > 0 ? `${speedPerHour} ספקים/שעה` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-[#8d785e]">זמן עבודה</span>
                  <span className="text-[13px] text-[#181510]" style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatTime(elapsedSeconds)}</span>
                </div>

                {/* Progress mini bar */}
                <div className="pt-2 border-t border-[#ece8e3]">
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-[#8d785e]">התקדמות</span>
                    <span className="text-[11px] text-[#ff8c00]" style={{ fontWeight: 700 }}>{progressPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#ece8e3] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-l from-[#ff8c00] to-[#ffb347] rounded-full"
                      animate={{ width: `${progressPct}%` }}
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