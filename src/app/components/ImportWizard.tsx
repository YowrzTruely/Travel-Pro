import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import {
  ArrowRight, ArrowLeft, Upload, CheckCircle, Eye, FileSpreadsheet,
  AlertTriangle, Download, Trash2, Loader2, X, Sparkles, PartyPopper,
  FileText, ChevronDown, LayoutList, Replace, SkipForward, Users, Undo2, Clock, ShieldAlert
} from 'lucide-react';
import { suppliersApi } from './api';
import { appToast } from './AppToast';
import type { Supplier } from './data';

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

interface ParsedRow {
  _rowIdx: number;
  _isDuplicate: boolean;
  _duplicateOf?: string;
  _action: 'import' | 'skip' | 'merge';
  [key: string]: any;
}

interface FieldMapping {
  systemField: string;
  label: string;
  required: boolean;
  csvColumn: string; // '' means unmapped
}

const SYSTEM_FIELDS: { key: string; label: string; required: boolean }[] = [
  { key: 'name', label: 'שם הספק', required: true },
  { key: 'category', label: 'קטגוריה', required: false },
  { key: 'phone', label: 'טלפון', required: false },
  { key: 'email', label: 'אימייל', required: false },
  { key: 'region', label: 'אזור', required: false },
  { key: 'notes', label: 'הערות', required: false },
];

const STEPS = [
  { id: 1, label: 'העלאת קובץ', icon: Upload },
  { id: 2, label: 'מיפוי שדות', icon: FileSpreadsheet },
  { id: 3, label: 'תצוגה מקדימה', icon: Eye },
  { id: 4, label: 'סיום ייבוא', icon: CheckCircle },
];

// Auto-detect column names to system field
function autoMapColumns(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  const lower = headers.map(h => h.toLowerCase().trim());

  const rules: [string, RegExp[]][] = [
    ['name', [/name|שם/i, /supplier|ספק/i]],
    ['category', [/categ|קטגור|סוג/i]],
    ['phone', [/phone|טלפון|נייד|mobile/i]],
    ['email', [/email|mail|אימייל|דוא/i]],
    ['region', [/region|אזור|עיר|city|מיקום/i]],
    ['notes', [/note|הער|comment/i]],
  ];

  for (const [field, patterns] of rules) {
    for (const pattern of patterns) {
      const idx = lower.findIndex(h => pattern.test(h));
      if (idx !== -1 && !Object.values(mapping).includes(headers[idx])) {
        mapping[field] = headers[idx];
        break;
      }
    }
  }
  return mapping;
}

// Generate sample CSV for download
function generateSampleCSV() {
  const bom = '\uFEFF';
  const csv = bom + `שם הספק,קטגוריה,טלפון,אימייל,אזור,הערות
הסעות ישראלי,תחבורה,050-1234567,info@israeli-bus.co.il,מרכז,אוטובוסים ממוגנים
קייטרינג טעמים,מזון,052-9876543,info@teamim.co.il,צפון,כשר למהדרין
אטרקציות הגליל,אטרקציות,054-5555555,fun@galil.co.il,צפון,רייזרים וקיאקים
מלון הים,לינה,03-1112222,book@hayam.co.il,אילת,5 כוכבים`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'suppliers_template.csv'; a.click();
  URL.revokeObjectURL(url);
}

// Confetti particles
function ConfettiParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 2,
      color: ['#ff8c00', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 6)],
      size: 4 + Math.random() * 8,
      rotation: Math.random() * 360,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, top: -20, width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', rotate: p.rotation + 720, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════

export function ImportWizard() {
  const navigate = useNavigate();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: File upload
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<Record<string, any>[]>([]);
  const [parsing, setParsing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Field mapping
  const [mappings, setMappings] = useState<Record<string, string>>({});

  // Step 3: Preview & duplicates
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [existingSuppliers, setExistingSuppliers] = useState<Supplier[]>([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const PAGE_SIZE = 10;

  // Step 4: Import
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Rollback / Undo
  const UNDO_TIMEOUT = 30; // seconds
  const [importedIds, setImportedIds] = useState<string[]>([]);
  const [undoSecondsLeft, setUndoSecondsLeft] = useState(0);
  const [undoAvailable, setUndoAvailable] = useState(false);
  const [showUndoConfirm, setShowUndoConfirm] = useState(false);
  const [rollingBack, setRollingBack] = useState(false);
  const [rollbackDone, setRollbackDone] = useState(false);
  const undoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Undo countdown timer
  useEffect(() => {
    if (undoSecondsLeft <= 0 && undoTimerRef.current) {
      clearInterval(undoTimerRef.current);
      undoTimerRef.current = null;
      setUndoAvailable(false);
    }
  }, [undoSecondsLeft]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (undoTimerRef.current) clearInterval(undoTimerRef.current); };
  }, []);

  const startUndoTimer = useCallback(() => {
    setUndoSecondsLeft(UNDO_TIMEOUT);
    setUndoAvailable(true);
    setRollbackDone(false);
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    undoTimerRef.current = setInterval(() => {
      setUndoSecondsLeft(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
  }, []);

  const executeRollback = useCallback(async () => {
    if (importedIds.length === 0) return;
    setRollingBack(true);
    setShowUndoConfirm(false);
    try {
      const result = await suppliersApi.bulkRollback(importedIds);
      setRollbackDone(true);
      setUndoAvailable(false);
      setUndoSecondsLeft(0);
      if (undoTimerRef.current) { clearInterval(undoTimerRef.current); undoTimerRef.current = null; }
      setImportedIds([]);
      appToast.success('הייבוא בוטל בהצלחה', `${result.deleted} ספקים הוסרו מהמערכת`);
    } catch (err) {
      console.error('[ImportWizard] Rollback error:', err);
      appToast.error('שגיאה בביטול הייבוא', String(err));
    } finally {
      setRollingBack(false);
    }
  }, [importedIds]);

  // ─── CSV Parsing ─────────────────────────────────
  const parseFile = useCallback((f: File) => {
    setParsing(true);
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (result) => {
        const headers = result.meta.fields || [];
        const data = result.data as Record<string, any>[];
        setCsvHeaders(headers);
        setCsvData(data);
        const auto = autoMapColumns(headers);
        setMappings(auto);
        setParsing(false);
        setCurrentStep(2);
        appToast.success('קובץ נטען בהצלחה', `${data.length} שורות, ${headers.length} עמודות`);
      },
      error: (err) => {
        setParsing(false);
        console.error('[ImportWizard] Parse error:', err);
        appToast.error('שגיאה בקריאת הקובץ', err.message);
      },
    });
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.csv') || f.name.endsWith('.txt') || f.type === 'text/csv')) {
      setFile(f);
      parseFile(f);
    } else {
      appToast.warning('סוג קובץ לא נתמך', 'יש לבחור קובץ CSV');
    }
  }, [parseFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); parseFile(f); }
  }, [parseFile]);

  // ─── Build preview rows with duplicate check ─────
  const buildPreviewRows = useCallback(async () => {
    setLoadingDuplicates(true);
    try {
      const suppliers = await suppliersApi.list();
      setExistingSuppliers(suppliers);
      const existingNames = new Set(suppliers.map(s => (s.name || '').trim().toLowerCase()));

      const mapped: ParsedRow[] = csvData.map((row, idx) => {
        const mapped: Record<string, any> = { _rowIdx: idx, _isDuplicate: false, _action: 'import' as const };
        for (const sf of SYSTEM_FIELDS) {
          const csvCol = mappings[sf.key];
          mapped[sf.key] = csvCol ? (row[csvCol] || '').toString().trim() : '';
        }
        const name = (mapped.name || '').toLowerCase();
        if (name && existingNames.has(name)) {
          mapped._isDuplicate = true;
          mapped._duplicateOf = suppliers.find(s => s.name.toLowerCase() === name)?.name;
          mapped._action = 'skip';
        }
        return mapped as ParsedRow;
      });

      // Filter out rows with no name
      setRows(mapped.filter(r => r.name));
      setPreviewPage(0);
    } catch (err) {
      console.error('[ImportWizard] Duplicate check error:', err);
      appToast.error('שגיאה בבדיקת כפילויות');
    }
    setLoadingDuplicates(false);
  }, [csvData, mappings]);

  // ─── Run Import ──────────────────────────────────
  const runImport = useCallback(async () => {
    const toImport = rows.filter(r => r._action !== 'skip');
    if (toImport.length === 0) {
      appToast.warning('אין ספקים לייבוא', 'כל הספקים סומנו כדילוג');
      return;
    }

    setImporting(true);
    setImportProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + Math.random() * 15, 85));
      }, 200);

      const suppliers = toImport.map(r => ({
        name: r.name,
        category: r.category || '',
        phone: r.phone || '',
        email: r.email || '',
        region: r.region || '',
        notes: r.notes || '',
        _action: r._action === 'merge' ? 'merge' : undefined,
      }));

      const result = await suppliersApi.bulkImport(suppliers);

      clearInterval(interval);
      setImportProgress(100);

      await new Promise(resolve => setTimeout(resolve, 500));
      setImportResult(result);
      setShowConfetti(true);
      setCurrentStep(4);
      appToast.success('ייבוא הושלם בהצלחה!', `${result.imported} ספקים יובאו למערכת`);

      // Store imported IDs for rollback and start countdown
      if (result.suppliers && result.suppliers.length > 0) {
        setImportedIds(result.suppliers.map((s: any) => s.id));
        startUndoTimer();
      }

      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err) {
      console.error('[ImportWizard] Import error:', err);
      appToast.error('שגיאה בייבוא ספקים', String(err));
    } finally {
      setImporting(false);
    }
  }, [rows]);

  // ─── Step navigation ─────────────────────────────
  const canProceed = useCallback((step: number): boolean => {
    if (step === 1) return !!file && csvData.length > 0;
    if (step === 2) return !!mappings.name; // name is required
    if (step === 3) return rows.length > 0;
    return false;
  }, [file, csvData, mappings, rows]);

  const goToStep = useCallback((step: number) => {
    if (step === 3 && currentStep === 2) {
      buildPreviewRows().then(() => setCurrentStep(3));
    } else if (step <= currentStep || canProceed(step - 1)) {
      setCurrentStep(step);
    }
  }, [currentStep, canProceed, buildPreviewRows]);

  // ─── Stats ───────────────────────────────────────
  const duplicateCount = rows.filter(r => r._isDuplicate).length;
  const importCount = rows.filter(r => r._action !== 'skip').length;
  const skipCount = rows.filter(r => r._action === 'skip').length;
  const paginatedRows = rows.slice(previewPage * PAGE_SIZE, (previewPage + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

  // ═══════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════

  return (
    <div className="min-h-full bg-[#f8f7f5] font-['Assistant',sans-serif]" dir="rtl">
      {showConfetti && <ConfettiParticles />}

      {/* Header */}
      <div className="bg-white border-b border-[#e7e1da] px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/suppliers')} className="text-[#8d785e] hover:text-[#181510] transition-colors">
            <ArrowRight size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ff8c00]/10 rounded-lg flex items-center justify-center">
              <FileSpreadsheet size={16} className="text-[#ff8c00]" />
            </div>
            <h1 className="text-[22px] text-[#181510]" style={{ fontWeight: 700 }}>ייבוא ספקים מאקסל</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-[14px] text-[#8d785e]">ייבאו את רשימת הספקים שלכם בקלות ובמהירות</p>
          <button
            onClick={generateSampleCSV}
            className="text-[13px] text-[#8d785e] flex items-center gap-1 mx-auto mt-2 hover:text-[#ff8c00] transition-colors"
          >
            <Download size={13} /> הורד תבנית לדוגמה (CSV)
          </button>
        </motion.div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-0 max-w-xl mx-auto">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isComplete = step.id < currentStep;
            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => {
                    if (isComplete || (step.id === currentStep)) goToStep(step.id);
                  }}
                  className={`flex flex-col items-center gap-1.5 ${isComplete ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive ? 'bg-[#ff8c00] text-white shadow-lg shadow-[#ff8c00]/30' :
                      isComplete ? 'bg-green-500 text-white' :
                      'bg-[#ddd6cb] text-[#8d785e]'
                    }`}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                  >
                    {isComplete ? <CheckCircle size={18} /> : <Icon size={18} />}
                  </motion.div>
                  <span className={`text-[11px] ${isActive ? 'text-[#ff8c00]' : 'text-[#8d785e]'}`} style={{ fontWeight: isActive ? 600 : 400 }}>{step.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 relative overflow-hidden rounded">
                    <div className="absolute inset-0 bg-[#ddd6cb]" />
                    <motion.div
                      className="absolute inset-y-0 right-0 bg-green-400"
                      initial={{ width: '0%' }}
                      animate={{ width: step.id < currentStep ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {/* ════════ STEP 1: File Upload ════════ */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`relative bg-white rounded-2xl border-2 border-dashed p-12 text-center transition-all cursor-pointer
                  ${dragOver ? 'border-[#ff8c00] bg-[#ff8c00]/5 scale-[1.02]' :
                    file ? 'border-green-400 bg-green-50/30' :
                    'border-[#d4cdc3] hover:border-[#ff8c00]/50 hover:bg-[#fffaf3]'}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                {parsing ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={48} className="animate-spin text-[#ff8c00]" />
                    <p className="text-[16px] text-[#181510]" style={{ fontWeight: 600 }}>קורא את הקובץ...</p>
                  </div>
                ) : file ? (
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center"
                    >
                      <FileText size={32} className="text-green-600" />
                    </motion.div>
                    <div>
                      <p className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>{file.name}</p>
                      <p className="text-[13px] text-[#8d785e] mt-1">
                        {csvData.length} שורות &bull; {csvHeaders.length} עמודות &bull; {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setCurrentStep(2); }}
                        className="flex items-center gap-1.5 text-[14px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-5 py-2.5 rounded-xl transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        המשך למיפוי <ArrowLeft size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null); setCsvHeaders([]); setCsvData([]); setMappings({});
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="flex items-center gap-1.5 text-[13px] text-[#8d785e] border border-[#e7e1da] px-3 py-2 rounded-xl hover:bg-[#f5f3f0] transition-colors"
                      >
                        <Trash2 size={13} /> החלף קובץ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      className="w-20 h-20 bg-[#ff8c00]/10 rounded-2xl flex items-center justify-center"
                      animate={dragOver ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                    >
                      <Upload size={36} className="text-[#ff8c00]" />
                    </motion.div>
                    <div>
                      <p className="text-[18px] text-[#181510]" style={{ fontWeight: 700 }}>גררו קובץ CSV לכאן</p>
                      <p className="text-[14px] text-[#8d785e] mt-1">או לחצו לבחירת קובץ מהמחשב</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
                      <span className="text-[12px] text-[#b8a990] bg-[#f5f3f0] px-3 py-1 rounded-full">CSV</span>
                      <span className="text-[12px] text-[#b8a990] bg-[#f5f3f0] px-3 py-1 rounded-full">UTF-8</span>
                      <span className="text-[12px] text-[#b8a990] bg-[#f5f3f0] px-3 py-1 rounded-full">עברית נתמכת</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ════════ STEP 2: Field Mapping ════════ */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {/* Mapping panel */}
              <div className="bg-white rounded-2xl border border-[#e7e1da] p-5 shadow-sm">
                <h3 className="text-[16px] text-[#181510] flex items-center gap-2 mb-1" style={{ fontWeight: 700 }}>
                  <LayoutList size={16} className="text-[#ff8c00]" /> מיפוי שדות מהקובץ
                </h3>
                <p className="text-[12px] text-[#8d785e] mb-4">התאימו את עמודות הקובץ לשדות המערכת</p>
                <div className="space-y-3">
                  {SYSTEM_FIELDS.map(sf => (
                    <div key={sf.key}>
                      <label className="text-[12px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>
                        {sf.label} {sf.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <select
                          value={mappings[sf.key] || ''}
                          onChange={(e) => setMappings(prev => ({ ...prev, [sf.key]: e.target.value }))}
                          className={`w-full appearance-none border rounded-lg px-3 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] transition-all ${
                            mappings[sf.key] ? 'border-green-300 bg-green-50/30' :
                            sf.required ? 'border-red-300' : 'border-[#e7e1da]'
                          }`}
                        >
                          <option value="">— לא ממופה —</option>
                          {csvHeaders.map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d785e] pointer-events-none" />
                      </div>
                      {mappings[sf.key] && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-[11px] text-green-600 mt-0.5 flex items-center gap-1"
                        >
                          <CheckCircle size={10} /> מחובר ל-"{mappings[sf.key]}"
                        </motion.p>
                      )}
                    </div>
                  ))}
                </div>

                {!mappings.name && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-500 shrink-0" />
                    <span className="text-[12px] text-red-700" style={{ fontWeight: 500 }}>שדה "שם הספק" הוא חובה</span>
                  </div>
                )}

                <button
                  onClick={() => goToStep(3)}
                  disabled={!mappings.name || loadingDuplicates}
                  className="w-full mt-4 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 text-white py-2.5 rounded-xl text-[14px] transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  {loadingDuplicates ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                  {loadingDuplicates ? 'בודק כפילויות...' : 'המשך לתצוגה מקדימה'}
                </button>
              </div>

              {/* Live preview */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e7e1da] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] text-[#181510] flex items-center gap-2" style={{ fontWeight: 700 }}>
                    <Eye size={16} className="text-[#ff8c00]" /> תצוגה מקדימה (5 שורות ראשונות)
                  </h3>
                  <span className="text-[12px] text-[#8d785e] bg-[#f5f3f0] px-2.5 py-1 rounded-full">{csvData.length} שורות בקובץ</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#f5f3f0] border-b border-[#e7e1da]">
                        <th className="p-3 text-right text-[12px] text-[#8d785e]" style={{ fontWeight: 600 }}>#</th>
                        {SYSTEM_FIELDS.filter(sf => mappings[sf.key]).map(sf => (
                          <th key={sf.key} className="p-3 text-right text-[12px] text-[#8d785e]" style={{ fontWeight: 600 }}>{sf.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 5).map((row, idx) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-[#ece8e3] hover:bg-[#faf9f7]"
                        >
                          <td className="p-3 text-[12px] text-[#b8a990]">{idx + 1}</td>
                          {SYSTEM_FIELDS.filter(sf => mappings[sf.key]).map(sf => (
                            <td key={sf.key} className="p-3 text-[13px] text-[#181510]" style={{ fontWeight: sf.key === 'name' ? 600 : 400 }}>
                              {row[mappings[sf.key]] || <span className="text-[#d4cdc3]">—</span>}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {csvData.length > 5 && (
                  <p className="text-[12px] text-[#8d785e] text-center mt-3">
                    +{csvData.length - 5} שורות נוספות...
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ════════ STEP 3: Preview & Duplicates ════════ */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'סה"כ שורות', value: rows.length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                  { label: 'לייבוא', value: importCount, color: 'bg-green-50 text-green-700 border-green-200' },
                  { label: 'כפילויות', value: duplicateCount, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-xl border p-4 text-center ${stat.color}`}
                  >
                    <div className="text-[24px]" style={{ fontWeight: 800 }}>{stat.value}</div>
                    <div className="text-[12px]" style={{ fontWeight: 500 }}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Preview table */}
              <div className="bg-white rounded-2xl border border-[#e7e1da] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] text-[#181510] flex items-center gap-2" style={{ fontWeight: 700 }}>
                    <LayoutList size={16} className="text-[#ff8c00]" /> תצוגה מקדימה וזיהוי כפילויות
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRows(prev => prev.map(r => r._isDuplicate ? { ...r, _action: 'skip' } : r))}
                      className="text-[11px] text-[#8d785e] border border-[#e7e1da] px-2.5 py-1 rounded-md hover:bg-[#f5f3f0] transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      <SkipForward size={10} className="inline ml-1" />דלג על כולם
                    </button>
                    <button
                      onClick={() => setRows(prev => prev.map(r => r._isDuplicate ? { ...r, _action: 'import' } : r))}
                      className="text-[11px] text-[#ff8c00] border border-[#ff8c00]/30 px-2.5 py-1 rounded-md hover:bg-[#ff8c00]/5 transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      <Replace size={10} className="inline ml-1" />ייבא את כולם
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#f5f3f0] border-b border-[#e7e1da]">
                        {['#', 'שם ספק', 'קטגוריה', 'טלפון', 'סטטוס', 'פעולה'].map(h => (
                          <th key={h} className="p-3 text-right text-[12px] text-[#8d785e]" style={{ fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRows.map((row, idx) => (
                        <motion.tr
                          key={row._rowIdx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className={`border-b border-[#ece8e3] transition-colors ${
                            row._action === 'skip' ? 'bg-[#fafafa] opacity-50' :
                            row._isDuplicate ? 'bg-yellow-50/50' : 'hover:bg-[#faf9f7]'
                          }`}
                        >
                          <td className="p-3 text-[12px] text-[#b8a990]">{row._rowIdx + 1}</td>
                          <td className="p-3 text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>{row.name}</td>
                          <td className="p-3 text-[13px] text-[#8d785e]">{row.category || '—'}</td>
                          <td className="p-3 text-[13px] text-[#8d785e]" dir="ltr">{row.phone || '—'}</td>
                          <td className="p-3">
                            {row._isDuplicate ? (
                              <span className="flex items-center gap-1 text-[12px] text-yellow-600" style={{ fontWeight: 600 }}>
                                <AlertTriangle size={13} /> כפילות
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[12px] text-green-600" style={{ fontWeight: 600 }}>
                                <CheckCircle size={13} /> תקין
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {row._isDuplicate ? (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => setRows(prev => prev.map(r => r._rowIdx === row._rowIdx ? { ...r, _action: 'import' } : r))}
                                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                                    row._action === 'import' ? 'bg-[#ff8c00] text-white border-[#ff8c00]' : 'border-[#ff8c00] text-[#ff8c00] hover:bg-[#ff8c00]/5'
                                  }`}
                                  style={{ fontWeight: 600 }}
                                >
                                  ייבא
                                </button>
                                <button
                                  onClick={() => setRows(prev => prev.map(r => r._rowIdx === row._rowIdx ? { ...r, _action: 'skip' } : r))}
                                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                                    row._action === 'skip' ? 'bg-[#181510] text-white border-[#181510]' : 'border-[#e7e1da] text-[#8d785e] hover:bg-[#f5f3f0]'
                                  }`}
                                  style={{ fontWeight: 600 }}
                                >
                                  דלג
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-green-600 flex items-center gap-1" style={{ fontWeight: 600 }}>
                                <CheckCircle size={11} /> מוכן
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e7e1da]">
                    <span className="text-[12px] text-[#8d785e]">
                      מציג {previewPage * PAGE_SIZE + 1}-{Math.min((previewPage + 1) * PAGE_SIZE, rows.length)} מתוך {rows.length}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setPreviewPage(i)}
                          className={`w-7 h-7 rounded-md flex items-center justify-center text-[12px] transition-colors ${
                            previewPage === i ? 'bg-[#ff8c00] text-white' : 'text-[#8d785e] hover:bg-[#ece8e3]'
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          {i + 1}
                        </button>
                      ))}
                      {totalPages > 10 && <span className="text-[12px] text-[#8d785e]">...</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom action bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl p-4 border border-[#e7e1da] mt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1 text-[14px] text-[#8d785e] hover:text-[#181510] transition-colors"
                >
                  <ArrowRight size={14} /> חזרה למיפוי שדות
                </button>
                <div className="flex gap-3">
                  {duplicateCount > 0 && (
                    <button
                      onClick={() => {
                        setRows(prev => prev.map(r => r._isDuplicate ? { ...r, _action: 'skip' } : r));
                        runImport();
                      }}
                      className="text-[14px] text-[#ff8c00] border border-[#ff8c00] px-5 py-2 rounded-xl hover:bg-[#ff8c00]/5 transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      דלג על כפילויות וייבא ({rows.filter(r => !r._isDuplicate).length})
                    </button>
                  )}
                  <button
                    onClick={runImport}
                    disabled={importing || importCount === 0}
                    className="flex items-center gap-2 text-[14px] text-white bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 px-5 py-2.5 rounded-xl shadow-sm transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    {importing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Upload size={14} />
                    )}
                    {importing ? 'מייבא...' : `ייבא ${importCount} ספקים`}
                  </button>
                </div>
              </div>

              {/* Import progress */}
              {importing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-5 border border-[#e7e1da] mt-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>מייבא ספקים...</span>
                    <span className="text-[14px] text-[#ff8c00]" style={{ fontWeight: 700 }}>{Math.round(importProgress)}%</span>
                  </div>
                  <div className="w-full bg-[#ece8e3] rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-l from-[#ff8c00] to-[#ffb347] rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${importProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ════════ STEP 4: Success ════════ */}
          {currentStep === 4 && importResult && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="bg-white rounded-2xl border border-[#e7e1da] p-8 text-center shadow-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <PartyPopper size={48} className="text-green-600" />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-[28px] text-[#181510] mb-2"
                style={{ fontWeight: 800 }}
              >
                הייבוא הושלם בהצלחה!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[16px] text-[#8d785e] mb-6"
              >
                הספקים נוספו לבנק הספקים שלכם
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8"
              >
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="text-[32px] text-green-600" style={{ fontWeight: 800 }}>{importResult.imported}</div>
                  <div className="text-[13px] text-green-700" style={{ fontWeight: 500 }}>ספקים יובאו</div>
                </div>
                <div className="bg-[#f5f3f0] border border-[#e7e1da] rounded-xl p-4">
                  <div className="text-[32px] text-[#8d785e]" style={{ fontWeight: 800 }}>{importResult.skipped}</div>
                  <div className="text-[13px] text-[#8d785e]" style={{ fontWeight: 500 }}>דולגו</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-center gap-3"
              >
                <button
                  onClick={() => navigate('/suppliers')}
                  className="flex items-center gap-2 text-[15px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-6 py-3 rounded-xl transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  <Users size={16} /> עבור לבנק ספקים
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setFile(null); setCsvHeaders([]); setCsvData([]); setMappings({});
                    setRows([]); setImportResult(null);
                    setUndoAvailable(false); setUndoSecondsLeft(0); setImportedIds([]); setRollbackDone(false);
                    if (undoTimerRef.current) { clearInterval(undoTimerRef.current); undoTimerRef.current = null; }
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="flex items-center gap-2 text-[15px] text-[#8d785e] border border-[#e7e1da] px-6 py-3 rounded-xl hover:bg-[#f5f3f0] transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  <Upload size={16} /> ייבוא נוסף
                </button>
              </motion.div>

              {/* ─── Undo / Rollback Section ─── */}
              <AnimatePresence>
                {undoAvailable && !rollbackDone && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 24 }}
                    exit={{ opacity: 0, y: -10, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="relative bg-red-50 border border-red-200 rounded-xl p-4">
                      {/* Countdown progress bar at top */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-red-100 rounded-t-xl overflow-hidden">
                        <motion.div
                          className="h-full bg-red-400"
                          style={{ width: `${(undoSecondsLeft / UNDO_TIMEOUT) * 100}%` }}
                          transition={{ duration: 0.3, ease: 'linear' }}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                            <Undo2 size={18} className="text-red-600" />
                          </div>
                          <div className="text-right">
                            <p className="text-[14px] text-red-800" style={{ fontWeight: 700 }}>טעות? אפשר לבטל</p>
                            <p className="text-[12px] text-red-600">
                              <Clock size={11} className="inline ml-1" />
                              נותרו {undoSecondsLeft} שניות לביטול הייבוא
                            </p>
                          </div>
                        </div>

                        {rollingBack ? (
                          <div className="flex items-center gap-2 text-[13px] text-red-700" style={{ fontWeight: 600 }}>
                            <Loader2 size={16} className="animate-spin" /> מבטל...
                          </div>
                        ) : showUndoConfirm ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-white border border-red-300 rounded-lg px-3 py-1.5">
                              <ShieldAlert size={13} className="text-red-500" />
                              <span className="text-[12px] text-red-700" style={{ fontWeight: 600 }}>בטוח?</span>
                            </div>
                            <button
                              onClick={executeRollback}
                              className="text-[13px] text-white bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg transition-colors"
                              style={{ fontWeight: 700 }}
                            >
                              כן, בטל ייבוא
                            </button>
                            <button
                              onClick={() => setShowUndoConfirm(false)}
                              className="text-[13px] text-red-600 border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                              style={{ fontWeight: 600 }}
                            >
                              לא
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowUndoConfirm(true)}
                            className="flex items-center gap-1.5 text-[13px] text-red-700 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                            style={{ fontWeight: 700 }}
                          >
                            <Undo2 size={14} /> בטל ייבוא
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {rollbackDone && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-center gap-3">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="text-[14px] text-green-700" style={{ fontWeight: 600 }}>
                        הייבוא בוטל בהצלחה. כל הספקים שיובאו הוסרו מהמערכת.
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center text-[12px] text-[#8d785e] py-4">
          &copy; 2026 TravelPro — מערכת ניהול ספקים למפיקי טיולים. כל הזכויות שמורות.
        </div>
      </div>
    </div>
  );
}