import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  LayoutList,
  Loader2,
  PartyPopper,
  Replace,
  ShieldAlert,
  SkipForward,
  Trash2,
  Undo2,
  Upload,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Papa from "papaparse";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import type { Supplier } from "./data";

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

interface ParsedRow {
  _action: "import" | "skip" | "merge";
  _duplicateOf?: string;
  _isDuplicate: boolean;
  _rowIdx: number;
  [key: string]: any;
}

const SYSTEM_FIELDS: { key: string; label: string; required: boolean }[] = [
  { key: "name", label: "שם הספק", required: true },
  { key: "category", label: "קטגוריה", required: false },
  { key: "phone", label: "טלפון", required: false },
  { key: "email", label: "אימייל", required: false },
  { key: "region", label: "אזור", required: false },
  { key: "notes", label: "הערות", required: false },
];

const STEPS = [
  { id: 1, label: "העלאת קובץ", icon: Upload },
  { id: 2, label: "מיפוי שדות", icon: FileSpreadsheet },
  { id: 3, label: "תצוגה מקדימה", icon: Eye },
  { id: 4, label: "סיום ייבוא", icon: CheckCircle },
];

// Regex patterns for auto-mapping columns
const NAME_PATTERNS = [/name|שם/i, /supplier|ספק/i];
const CATEGORY_PATTERNS = [/categ|קטגור|סוג/i];
const PHONE_PATTERNS = [/phone|טלפון|נייד|mobile/i];
const EMAIL_PATTERNS = [/email|mail|אימייל|דוא/i];
const REGION_PATTERNS = [/region|אזור|עיר|city|מיקום/i];
const NOTES_PATTERNS = [/note|הער|comment/i];

// Auto-detect column names to system field
function autoMapColumns(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  const lower = headers.map((h) => h.toLowerCase().trim());

  const rules: [string, RegExp[]][] = [
    ["name", NAME_PATTERNS],
    ["category", CATEGORY_PATTERNS],
    ["phone", PHONE_PATTERNS],
    ["email", EMAIL_PATTERNS],
    ["region", REGION_PATTERNS],
    ["notes", NOTES_PATTERNS],
  ];

  for (const [field, patterns] of rules) {
    for (const pattern of patterns) {
      const idx = lower.findIndex((h) => pattern.test(h));
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
  const bom = "\uFEFF";
  const csv =
    bom +
    `שם הספק,קטגוריה,טלפון,אימייל,אזור,הערות
הסעות ישראלי,תחבורה,050-1234567,info@israeli-bus.co.il,מרכז,אוטובוסים ממוגנים
קייטרינג טעמים,מזון,052-9876543,info@teamim.co.il,צפון,כשר למהדרין
אטרקציות הגליל,אטרקציות,054-5555555,fun@galil.co.il,צפון,רייזרים וקיאקים
מלון הים,לינה,03-1112222,book@hayam.co.il,אילת,5 כוכבים`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "suppliers_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Confetti particles
function ConfettiParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 2,
        color: [
          "#ff8c00",
          "#22c55e",
          "#3b82f6",
          "#a855f7",
          "#ec4899",
          "#f59e0b",
        ][Math.floor(Math.random() * 6)],
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          animate={{ y: "110vh", rotate: p.rotation + 720, opacity: [1, 1, 0] }}
          className="absolute rounded-sm"
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          key={p.id}
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
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

  const bulkImport = useMutation(api.suppliers.bulkImport);
  const bulkRollback = useMutation(api.suppliers.bulkRollback);
  const suppliersData = useQuery(api.suppliers.list);

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
  const [_existingSuppliers, setExistingSuppliers] = useState<Supplier[]>([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const PAGE_SIZE = 10;

  // Step 4: Import
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    imported: number;
    skipped: number;
  } | null>(null);
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
    return () => {
      if (undoTimerRef.current) {
        clearInterval(undoTimerRef.current);
      }
    };
  }, []);

  const startUndoTimer = useCallback(() => {
    setUndoSecondsLeft(UNDO_TIMEOUT);
    setUndoAvailable(true);
    setRollbackDone(false);
    if (undoTimerRef.current) {
      clearInterval(undoTimerRef.current);
    }
    undoTimerRef.current = setInterval(() => {
      setUndoSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const executeRollback = useCallback(async () => {
    if (importedIds.length === 0) {
      return;
    }
    setRollingBack(true);
    setShowUndoConfirm(false);
    try {
      const result = await bulkRollback({ supplierIds: importedIds as any });
      setRollbackDone(true);
      setUndoAvailable(false);
      setUndoSecondsLeft(0);
      if (undoTimerRef.current) {
        clearInterval(undoTimerRef.current);
        undoTimerRef.current = null;
      }
      setImportedIds([]);
      appToast.success(
        "הייבוא בוטל בהצלחה",
        `${result.deleted} ספקים הוסרו מהמערכת`
      );
    } catch (err) {
      console.error("[ImportWizard] Rollback error:", err);
      appToast.error("שגיאה בביטול הייבוא", String(err));
    } finally {
      setRollingBack(false);
    }
  }, [importedIds, bulkRollback]);

  // ─── CSV Parsing ─────────────────────────────────
  const parseFile = useCallback((f: File) => {
    setParsing(true);
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (result) => {
        const headers = result.meta.fields || [];
        const data = result.data as Record<string, any>[];
        setCsvHeaders(headers);
        setCsvData(data);
        const auto = autoMapColumns(headers);
        setMappings(auto);
        setParsing(false);
        setCurrentStep(2);
        appToast.success(
          "קובץ נטען בהצלחה",
          `${data.length} שורות, ${headers.length} עמודות`
        );
      },
      error: (err) => {
        setParsing(false);
        console.error("[ImportWizard] Parse error:", err);
        appToast.error("שגיאה בקריאת הקובץ", err.message);
      },
    });
  }, []);

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (
        f &&
        (f.name.endsWith(".csv") ||
          f.name.endsWith(".txt") ||
          f.type === "text/csv")
      ) {
        setFile(f);
        parseFile(f);
      } else {
        appToast.warning("סוג קובץ לא נתמך", "יש לבחור קובץ CSV");
      }
    },
    [parseFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) {
        setFile(f);
        parseFile(f);
      }
    },
    [parseFile]
  );

  // ─── Build preview rows with duplicate check ─────
  const buildPreviewRows = useCallback(async () => {
    setLoadingDuplicates(true);
    try {
      const suppliers = suppliersData ?? [];
      setExistingSuppliers(suppliers as any);
      const existingNames = new Set(
        suppliers.map((s: any) => (s.name || "").trim().toLowerCase())
      );

      const mapped: ParsedRow[] = csvData.map((row, idx) => {
        const mapped: Record<string, any> = {
          _rowIdx: idx,
          _isDuplicate: false,
          _action: "import" as const,
        };
        for (const sf of SYSTEM_FIELDS) {
          const csvCol = mappings[sf.key];
          mapped[sf.key] = csvCol ? (row[csvCol] || "").toString().trim() : "";
        }
        const name = (mapped.name || "").toLowerCase();
        if (name && existingNames.has(name)) {
          mapped._isDuplicate = true;
          mapped._duplicateOf = suppliers.find(
            (s: any) => s.name.toLowerCase() === name
          )?.name;
          mapped._action = "skip";
        }
        return mapped as ParsedRow;
      });

      // Filter out rows with no name
      setRows(mapped.filter((r) => r.name));
      setPreviewPage(0);
    } catch (err) {
      console.error("[ImportWizard] Duplicate check error:", err);
      appToast.error("שגיאה בבדיקת כפילויות");
    }
    setLoadingDuplicates(false);
  }, [csvData, mappings, suppliersData]);

  // ─── Run Import ──────────────────────────────────
  const runImport = useCallback(async () => {
    const toImport = rows.filter((r) => r._action !== "skip");
    if (toImport.length === 0) {
      appToast.warning("אין ספקים לייבוא", "כל הספקים סומנו כדילוג");
      return;
    }

    setImporting(true);
    setImportProgress(0);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setImportProgress((prev) => Math.min(prev + Math.random() * 15, 85));
      }, 200);

      const suppliers = toImport.map((r) => ({
        name: r.name,
        category: r.category || "",
        phone: r.phone || "",
        email: r.email || "",
        region: r.region || "",
        notes: r.notes || "",
        _action: r._action === "merge" ? "merge" : undefined,
      }));

      const result = await bulkImport({ suppliers });

      clearInterval(interval);
      setImportProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setImportResult(result);
      setShowConfetti(true);
      setCurrentStep(4);
      appToast.success(
        "ייבוא הושלם בהצלחה!",
        `${result.imported} ספקים יובאו למערכת`
      );

      // Store imported IDs for rollback and start countdown
      if (result.suppliers && result.suppliers.length > 0) {
        setImportedIds(result.suppliers.map((s: any) => s.id));
        startUndoTimer();
      }

      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err) {
      console.error("[ImportWizard] Import error:", err);
      appToast.error("שגיאה בייבוא ספקים", String(err));
    } finally {
      setImporting(false);
    }
  }, [rows, bulkImport, startUndoTimer]);

  // ─── Step navigation ─────────────────────────────
  const canProceed = useCallback(
    (step: number): boolean => {
      if (step === 1) {
        return !!file && csvData.length > 0;
      }
      if (step === 2) {
        return !!mappings.name; // name is required
      }
      if (step === 3) {
        return rows.length > 0;
      }
      return false;
    },
    [file, csvData, mappings, rows]
  );

  const goToStep = useCallback(
    (step: number) => {
      if (step === 3 && currentStep === 2) {
        buildPreviewRows().then(() => setCurrentStep(3));
      } else if (step <= currentStep || canProceed(step - 1)) {
        setCurrentStep(step);
      }
    },
    [currentStep, canProceed, buildPreviewRows]
  );

  // ─── Stats ───────────────────────────────────────
  const duplicateCount = rows.filter((r) => r._isDuplicate).length;
  const importCount = rows.filter((r) => r._action !== "skip").length;
  const paginatedRows = rows.slice(
    previewPage * PAGE_SIZE,
    (previewPage + 1) * PAGE_SIZE
  );
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

  // ═══════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════

  return (
    <div
      className="min-h-full bg-[#f8f7f5] font-['Assistant',sans-serif]"
      dir="rtl"
    >
      {showConfetti && <ConfettiParticles />}

      {/* Header */}
      <div className="border-[#e7e1da] border-b bg-white px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="text-[#8d785e] transition-colors hover:text-[#181510]"
            onClick={() => navigate("/suppliers")}
            type="button"
          >
            <ArrowRight size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff8c00]/10">
              <FileSpreadsheet className="text-[#ff8c00]" size={16} />
            </div>
            <h1
              className="text-[#181510] text-[22px]"
              style={{ fontWeight: 700 }}
            >
              ייבוא ספקים מאקסל
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 p-4 lg:p-6">
        {/* Description */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: -10 }}
        >
          <p className="text-[#8d785e] text-[14px]">
            ייבאו את רשימת הספקים שלכם בקלות ובמהירות
          </p>
          <button
            className="mx-auto mt-2 flex items-center gap-1 text-[#8d785e] text-[13px] transition-colors hover:text-[#ff8c00]"
            onClick={generateSampleCSV}
            type="button"
          >
            <Download size={13} /> הורד תבנית לדוגמה (CSV)
          </button>
        </motion.div>

        {/* Steps indicator */}
        <div className="mx-auto flex max-w-xl items-center justify-center gap-0">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isComplete = step.id < currentStep;
            return (
              <div className="flex flex-1 items-center" key={step.id}>
                <button
                  className={`flex flex-col items-center gap-1.5 ${isComplete ? "cursor-pointer" : "cursor-default"}`}
                  onClick={() => {
                    if (isComplete || step.id === currentStep) {
                      goToStep(step.id);
                    }
                  }}
                  type="button"
                >
                  <motion.div
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                      isActive
                        ? "bg-[#ff8c00] text-white shadow-[#ff8c00]/30 shadow-lg"
                        : isComplete
                          ? "bg-green-500 text-white"
                          : "bg-[#ddd6cb] text-[#8d785e]"
                    }`}
                    transition={{
                      duration: 0.5,
                      repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                      repeatDelay: 2,
                    }}
                  >
                    {isComplete ? (
                      <CheckCircle size={18} />
                    ) : (
                      <Icon size={18} />
                    )}
                  </motion.div>
                  <span
                    className={`text-[11px] ${isActive ? "text-[#ff8c00]" : "text-[#8d785e]"}`}
                    style={{ fontWeight: isActive ? 600 : 400 }}
                  >
                    {step.label}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded">
                    <div className="absolute inset-0 bg-[#ddd6cb]" />
                    <motion.div
                      animate={{ width: step.id < currentStep ? "100%" : "0%" }}
                      className="absolute inset-y-0 right-0 bg-green-400"
                      initial={{ width: "0%" }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
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
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              initial={{ opacity: 0, x: 30 }}
              key="step1"
              transition={{ duration: 0.3 }}
            >
              <div
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed bg-white p-12 text-center transition-all ${
                  dragOver
                    ? "scale-[1.02] border-[#ff8c00] bg-[#ff8c00]/5"
                    : file
                      ? "border-green-400 bg-green-50/30"
                      : "border-[#d4cdc3] hover:border-[#ff8c00]/50 hover:bg-[#fffaf3]"
                }`}
                onClick={() => !file && fileInputRef.current?.click()}
                onDragLeave={() => setDragOver(false)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDrop={handleFileDrop}
              >
                <input
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  type="file"
                />

                {parsing ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2
                      className="animate-spin text-[#ff8c00]"
                      size={48}
                    />
                    <p
                      className="text-[#181510] text-[16px]"
                      style={{ fontWeight: 600 }}
                    >
                      קורא את הקובץ...
                    </p>
                  </div>
                ) : file ? (
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      animate={{ scale: 1 }}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100"
                      initial={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <FileText className="text-green-600" size={32} />
                    </motion.div>
                    <div>
                      <p
                        className="text-[#181510] text-[16px]"
                        style={{ fontWeight: 700 }}
                      >
                        {file.name}
                      </p>
                      <p className="mt-1 text-[#8d785e] text-[13px]">
                        {csvData.length} שורות &bull; {csvHeaders.length} עמודות
                        &bull; {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        className="flex items-center gap-1.5 rounded-xl bg-[#ff8c00] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#e67e00]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentStep(2);
                        }}
                        style={{ fontWeight: 600 }}
                        type="button"
                      >
                        המשך למיפוי <ArrowLeft size={14} />
                      </button>
                      <button
                        className="flex items-center gap-1.5 rounded-xl border border-[#e7e1da] px-3 py-2 text-[#8d785e] text-[13px] transition-colors hover:bg-[#f5f3f0]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          setCsvHeaders([]);
                          setCsvData([]);
                          setMappings({});
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        type="button"
                      >
                        <Trash2 size={13} /> החלף קובץ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      animate={
                        dragOver
                          ? { scale: 1.15, rotate: 5 }
                          : { scale: 1, rotate: 0 }
                      }
                      className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#ff8c00]/10"
                    >
                      <Upload className="text-[#ff8c00]" size={36} />
                    </motion.div>
                    <div>
                      <p
                        className="text-[#181510] text-[18px]"
                        style={{ fontWeight: 700 }}
                      >
                        גררו קובץ CSV לכאן
                      </p>
                      <p className="mt-1 text-[#8d785e] text-[14px]">
                        או לחצו לבחירת קובץ מהמחשב
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                      <span className="rounded-full bg-[#f5f3f0] px-3 py-1 text-[#b8a990] text-[12px]">
                        CSV
                      </span>
                      <span className="rounded-full bg-[#f5f3f0] px-3 py-1 text-[#b8a990] text-[12px]">
                        UTF-8
                      </span>
                      <span className="rounded-full bg-[#f5f3f0] px-3 py-1 text-[#b8a990] text-[12px]">
                        עברית נתמכת
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ════════ STEP 2: Field Mapping ════════ */}
          {currentStep === 2 && (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="grid gap-6 lg:grid-cols-3"
              exit={{ opacity: 0, x: -30 }}
              initial={{ opacity: 0, x: 30 }}
              key="step2"
              transition={{ duration: 0.3 }}
            >
              {/* Mapping panel */}
              <div className="rounded-2xl border border-[#e7e1da] bg-white p-5 shadow-sm">
                <h3
                  className="mb-1 flex items-center gap-2 text-[#181510] text-[16px]"
                  style={{ fontWeight: 700 }}
                >
                  <LayoutList className="text-[#ff8c00]" size={16} /> מיפוי שדות
                  מהקובץ
                </h3>
                <p className="mb-4 text-[#8d785e] text-[12px]">
                  התאימו את עמודות הקובץ לשדות המערכת
                </p>
                <div className="space-y-3">
                  {SYSTEM_FIELDS.map((sf) => (
                    <div key={sf.key}>
                      <label
                        className="mb-1 block text-[#8d785e] text-[12px]"
                        htmlFor={`import-field-${sf.key}`}
                        style={{ fontWeight: 600 }}
                      >
                        {sf.label}{" "}
                        {sf.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <select
                          className={`w-full appearance-none rounded-lg border bg-white px-3 py-2.5 text-[13px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 ${
                            mappings[sf.key]
                              ? "border-green-300 bg-green-50/30"
                              : sf.required
                                ? "border-red-300"
                                : "border-[#e7e1da]"
                          }`}
                          id={`import-field-${sf.key}`}
                          onChange={(e) =>
                            setMappings((prev) => ({
                              ...prev,
                              [sf.key]: e.target.value,
                            }))
                          }
                          value={mappings[sf.key] || ""}
                        >
                          <option value="">— לא ממופה —</option>
                          {csvHeaders.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#8d785e]"
                          size={14}
                        />
                      </div>
                      {mappings[sf.key] && (
                        <motion.p
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-0.5 flex items-center gap-1 text-[11px] text-green-600"
                          initial={{ opacity: 0, height: 0 }}
                        >
                          <CheckCircle size={10} /> מחובר ל-"{mappings[sf.key]}"
                        </motion.p>
                      )}
                    </div>
                  ))}
                </div>

                {!mappings.name && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                    <AlertTriangle
                      className="shrink-0 text-red-500"
                      size={14}
                    />
                    <span
                      className="text-[12px] text-red-700"
                      style={{ fontWeight: 500 }}
                    >
                      שדה "שם הספק" הוא חובה
                    </span>
                  </div>
                )}

                <button
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-2.5 text-[14px] text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
                  disabled={!mappings.name || loadingDuplicates}
                  onClick={() => goToStep(3)}
                  style={{ fontWeight: 600 }}
                  type="button"
                >
                  {loadingDuplicates ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                  {loadingDuplicates
                    ? "בודק כפילויות..."
                    : "המשך לתצוגה מקדימה"}
                </button>
              </div>

              {/* Live preview */}
              <div className="rounded-2xl border border-[#e7e1da] bg-white p-5 shadow-sm lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h3
                    className="flex items-center gap-2 text-[#181510] text-[16px]"
                    style={{ fontWeight: 700 }}
                  >
                    <Eye className="text-[#ff8c00]" size={16} /> תצוגה מקדימה (5
                    שורות ראשונות)
                  </h3>
                  <span className="rounded-full bg-[#f5f3f0] px-2.5 py-1 text-[#8d785e] text-[12px]">
                    {csvData.length} שורות בקובץ
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-[#e7e1da] border-b bg-[#f5f3f0]">
                        <th
                          className="p-3 text-right text-[#8d785e] text-[12px]"
                          style={{ fontWeight: 600 }}
                        >
                          #
                        </th>
                        {SYSTEM_FIELDS.filter((sf) => mappings[sf.key]).map(
                          (sf) => (
                            <th
                              className="p-3 text-right text-[#8d785e] text-[12px]"
                              key={sf.key}
                              style={{ fontWeight: 600 }}
                            >
                              {sf.label}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 5).map((row, idx) => (
                        <motion.tr
                          animate={{ opacity: 1, y: 0 }}
                          className="border-[#ece8e3] border-b hover:bg-[#faf9f7]"
                          initial={{ opacity: 0, y: 10 }}
                          key={idx}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <td className="p-3 text-[#b8a990] text-[12px]">
                            {idx + 1}
                          </td>
                          {SYSTEM_FIELDS.filter((sf) => mappings[sf.key]).map(
                            (sf) => (
                              <td
                                className="p-3 text-[#181510] text-[13px]"
                                key={sf.key}
                                style={{
                                  fontWeight: sf.key === "name" ? 600 : 400,
                                }}
                              >
                                {row[mappings[sf.key]] || (
                                  <span className="text-[#d4cdc3]">—</span>
                                )}
                              </td>
                            )
                          )}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {csvData.length > 5 && (
                  <p className="mt-3 text-center text-[#8d785e] text-[12px]">
                    +{csvData.length - 5} שורות נוספות...
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ════════ STEP 3: Preview & Duplicates ════════ */}
          {currentStep === 3 && (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              initial={{ opacity: 0, x: 30 }}
              key="step3"
              transition={{ duration: 0.3 }}
            >
              {/* Stats bar */}
              <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                  {
                    label: 'סה"כ שורות',
                    value: rows.length,
                    color: "bg-blue-50 text-blue-700 border-blue-200",
                  },
                  {
                    label: "לייבוא",
                    value: importCount,
                    color: "bg-green-50 text-green-700 border-green-200",
                  },
                  {
                    label: "כפילויות",
                    value: duplicateCount,
                    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
                  },
                ].map((stat, i) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl border p-4 text-center ${stat.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    key={stat.label}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-[24px]" style={{ fontWeight: 800 }}>
                      {stat.value}
                    </div>
                    <div className="text-[12px]" style={{ fontWeight: 500 }}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Preview table */}
              <div className="rounded-2xl border border-[#e7e1da] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3
                    className="flex items-center gap-2 text-[#181510] text-[16px]"
                    style={{ fontWeight: 700 }}
                  >
                    <LayoutList className="text-[#ff8c00]" size={16} /> תצוגה
                    מקדימה וזיהוי כפילויות
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-md border border-[#e7e1da] px-2.5 py-1 text-[#8d785e] text-[11px] transition-colors hover:bg-[#f5f3f0]"
                      onClick={() =>
                        setRows((prev) =>
                          prev.map((r) =>
                            r._isDuplicate ? { ...r, _action: "skip" } : r
                          )
                        )
                      }
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      <SkipForward className="ml-1 inline" size={10} />
                      דלג על כולם
                    </button>
                    <button
                      className="rounded-md border border-[#ff8c00]/30 px-2.5 py-1 text-[#ff8c00] text-[11px] transition-colors hover:bg-[#ff8c00]/5"
                      onClick={() =>
                        setRows((prev) =>
                          prev.map((r) =>
                            r._isDuplicate ? { ...r, _action: "import" } : r
                          )
                        )
                      }
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      <Replace className="ml-1 inline" size={10} />
                      ייבא את כולם
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-[#e7e1da] border-b bg-[#f5f3f0]">
                        {[
                          "#",
                          "שם ספק",
                          "קטגוריה",
                          "טלפון",
                          "סטטוס",
                          "פעולה",
                        ].map((h) => (
                          <th
                            className="p-3 text-right text-[#8d785e] text-[12px]"
                            key={h}
                            style={{ fontWeight: 600 }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRows.map((row, idx) => (
                        <motion.tr
                          animate={{ opacity: 1, x: 0 }}
                          className={`border-[#ece8e3] border-b transition-colors ${
                            row._action === "skip"
                              ? "bg-[#fafafa] opacity-50"
                              : row._isDuplicate
                                ? "bg-yellow-50/50"
                                : "hover:bg-[#faf9f7]"
                          }`}
                          initial={{ opacity: 0, x: 20 }}
                          key={row._rowIdx}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <td className="p-3 text-[#b8a990] text-[12px]">
                            {row._rowIdx + 1}
                          </td>
                          <td
                            className="p-3 text-[#181510] text-[13px]"
                            style={{ fontWeight: 600 }}
                          >
                            {row.name}
                          </td>
                          <td className="p-3 text-[#8d785e] text-[13px]">
                            {row.category || "—"}
                          </td>
                          <td
                            className="p-3 text-[#8d785e] text-[13px]"
                            dir="ltr"
                          >
                            {row.phone || "—"}
                          </td>
                          <td className="p-3">
                            {row._isDuplicate ? (
                              <span
                                className="flex items-center gap-1 text-[12px] text-yellow-600"
                                style={{ fontWeight: 600 }}
                              >
                                <AlertTriangle size={13} /> כפילות
                              </span>
                            ) : (
                              <span
                                className="flex items-center gap-1 text-[12px] text-green-600"
                                style={{ fontWeight: 600 }}
                              >
                                <CheckCircle size={13} /> תקין
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {row._isDuplicate ? (
                              <div className="flex gap-1.5">
                                <button
                                  className={`rounded-md border px-2.5 py-1 text-[11px] transition-colors ${
                                    row._action === "import"
                                      ? "border-[#ff8c00] bg-[#ff8c00] text-white"
                                      : "border-[#ff8c00] text-[#ff8c00] hover:bg-[#ff8c00]/5"
                                  }`}
                                  onClick={() =>
                                    setRows((prev) =>
                                      prev.map((r) =>
                                        r._rowIdx === row._rowIdx
                                          ? { ...r, _action: "import" }
                                          : r
                                      )
                                    )
                                  }
                                  style={{ fontWeight: 600 }}
                                  type="button"
                                >
                                  ייבא
                                </button>
                                <button
                                  className={`rounded-md border px-2.5 py-1 text-[11px] transition-colors ${
                                    row._action === "skip"
                                      ? "border-[#181510] bg-[#181510] text-white"
                                      : "border-[#e7e1da] text-[#8d785e] hover:bg-[#f5f3f0]"
                                  }`}
                                  onClick={() =>
                                    setRows((prev) =>
                                      prev.map((r) =>
                                        r._rowIdx === row._rowIdx
                                          ? { ...r, _action: "skip" }
                                          : r
                                      )
                                    )
                                  }
                                  style={{ fontWeight: 600 }}
                                  type="button"
                                >
                                  דלג
                                </button>
                              </div>
                            ) : (
                              <span
                                className="flex items-center gap-1 text-[11px] text-green-600"
                                style={{ fontWeight: 600 }}
                              >
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
                  <div className="mt-3 flex items-center justify-between border-[#e7e1da] border-t pt-3">
                    <span className="text-[#8d785e] text-[12px]">
                      מציג {previewPage * PAGE_SIZE + 1}-
                      {Math.min((previewPage + 1) * PAGE_SIZE, rows.length)}{" "}
                      מתוך {rows.length}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(totalPages, 10) },
                        (_, i) => (
                          <button
                            className={`flex h-7 w-7 items-center justify-center rounded-md text-[12px] transition-colors ${
                              previewPage === i
                                ? "bg-[#ff8c00] text-white"
                                : "text-[#8d785e] hover:bg-[#ece8e3]"
                            }`}
                            key={i}
                            onClick={() => setPreviewPage(i)}
                            style={{ fontWeight: 600 }}
                            type="button"
                          >
                            {i + 1}
                          </button>
                        )
                      )}
                      {totalPages > 10 && (
                        <span className="text-[#8d785e] text-[12px]">...</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom action bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e7e1da] bg-white p-4">
                <button
                  className="flex items-center gap-1 text-[#8d785e] text-[14px] transition-colors hover:text-[#181510]"
                  onClick={() => setCurrentStep(2)}
                  type="button"
                >
                  <ArrowRight size={14} /> חזרה למיפוי שדות
                </button>
                <div className="flex gap-3">
                  {duplicateCount > 0 && (
                    <button
                      className="rounded-xl border border-[#ff8c00] px-5 py-2 text-[#ff8c00] text-[14px] transition-colors hover:bg-[#ff8c00]/5"
                      onClick={() => {
                        setRows((prev) =>
                          prev.map((r) =>
                            r._isDuplicate ? { ...r, _action: "skip" } : r
                          )
                        );
                        runImport();
                      }}
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      דלג על כפילויות וייבא (
                      {rows.filter((r) => !r._isDuplicate).length})
                    </button>
                  )}
                  <button
                    className="flex items-center gap-2 rounded-xl bg-[#ff8c00] px-5 py-2.5 text-[14px] text-white shadow-sm transition-colors hover:bg-[#e67e00] disabled:opacity-50"
                    disabled={importing || importCount === 0}
                    onClick={runImport}
                    style={{ fontWeight: 600 }}
                    type="button"
                  >
                    {importing ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Upload size={14} />
                    )}
                    {importing ? "מייבא..." : `ייבא ${importCount} ספקים`}
                  </button>
                </div>
              </div>

              {/* Import progress */}
              {importing && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl border border-[#e7e1da] bg-white p-5"
                  initial={{ opacity: 0, y: 10 }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className="text-[#181510] text-[14px]"
                      style={{ fontWeight: 600 }}
                    >
                      מייבא ספקים...
                    </span>
                    <span
                      className="text-[#ff8c00] text-[14px]"
                      style={{ fontWeight: 700 }}
                    >
                      {Math.round(importProgress)}%
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-[#ece8e3]">
                    <motion.div
                      animate={{ width: `${importProgress}%` }}
                      className="h-full rounded-full bg-gradient-to-l from-[#ff8c00] to-[#ffb347]"
                      initial={{ width: "0%" }}
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
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-[#e7e1da] bg-white p-8 text-center shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              key="step4"
              transition={{ duration: 0.5, type: "spring" }}
            >
              <motion.div
                animate={{ scale: 1 }}
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
                initial={{ scale: 0 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                <motion.div
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <PartyPopper className="text-green-600" size={48} />
                </motion.div>
              </motion.div>

              <motion.h2
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 text-[#181510] text-[28px]"
                initial={{ opacity: 0, y: 20 }}
                style={{ fontWeight: 800 }}
                transition={{ delay: 0.4 }}
              >
                הייבוא הושלם בהצלחה!
              </motion.h2>

              <motion.p
                animate={{ opacity: 1 }}
                className="mb-6 text-[#8d785e] text-[16px]"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.6 }}
              >
                הספקים נוספו לבנק הספקים שלכם
              </motion.p>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto mb-8 grid max-w-md grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.7 }}
              >
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div
                    className="text-[32px] text-green-600"
                    style={{ fontWeight: 800 }}
                  >
                    {importResult.imported}
                  </div>
                  <div
                    className="text-[13px] text-green-700"
                    style={{ fontWeight: 500 }}
                  >
                    ספקים יובאו
                  </div>
                </div>
                <div className="rounded-xl border border-[#e7e1da] bg-[#f5f3f0] p-4">
                  <div
                    className="text-[#8d785e] text-[32px]"
                    style={{ fontWeight: 800 }}
                  >
                    {importResult.skipped}
                  </div>
                  <div
                    className="text-[#8d785e] text-[13px]"
                    style={{ fontWeight: 500 }}
                  >
                    דולגו
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-3"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.9 }}
              >
                <button
                  className="flex items-center gap-2 rounded-xl bg-[#ff8c00] px-6 py-3 text-[15px] text-white transition-colors hover:bg-[#e67e00]"
                  onClick={() => navigate("/suppliers")}
                  style={{ fontWeight: 600 }}
                  type="button"
                >
                  <Users size={16} /> עבור לבנק ספקים
                </button>
                <button
                  className="flex items-center gap-2 rounded-xl border border-[#e7e1da] px-6 py-3 text-[#8d785e] text-[15px] transition-colors hover:bg-[#f5f3f0]"
                  onClick={() => {
                    setCurrentStep(1);
                    setFile(null);
                    setCsvHeaders([]);
                    setCsvData([]);
                    setMappings({});
                    setRows([]);
                    setImportResult(null);
                    setUndoAvailable(false);
                    setUndoSecondsLeft(0);
                    setImportedIds([]);
                    setRollbackDone(false);
                    if (undoTimerRef.current) {
                      clearInterval(undoTimerRef.current);
                      undoTimerRef.current = null;
                    }
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  style={{ fontWeight: 600 }}
                  type="button"
                >
                  <Upload size={16} /> ייבוא נוסף
                </button>
              </motion.div>

              {/* ─── Undo / Rollback Section ─── */}
              <AnimatePresence>
                {undoAvailable && !rollbackDone && (
                  <motion.div
                    animate={{
                      opacity: 1,
                      y: 0,
                      height: "auto",
                      marginTop: 24,
                    }}
                    className="overflow-hidden"
                    exit={{ opacity: 0, y: -10, height: 0, marginTop: 0 }}
                    initial={{ opacity: 0, y: 20, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="relative rounded-xl border border-red-200 bg-red-50 p-4">
                      {/* Countdown progress bar at top */}
                      <div className="absolute top-0 right-0 left-0 h-1 overflow-hidden rounded-t-xl bg-red-100">
                        <motion.div
                          className="h-full bg-red-400"
                          style={{
                            width: `${(undoSecondsLeft / UNDO_TIMEOUT) * 100}%`,
                          }}
                          transition={{ duration: 0.3, ease: "linear" }}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-1">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                            <Undo2 className="text-red-600" size={18} />
                          </div>
                          <div className="text-right">
                            <p
                              className="text-[14px] text-red-800"
                              style={{ fontWeight: 700 }}
                            >
                              טעות? אפשר לבטל
                            </p>
                            <p className="text-[12px] text-red-600">
                              <Clock className="ml-1 inline" size={11} />
                              נותרו {undoSecondsLeft} שניות לביטול הייבוא
                            </p>
                          </div>
                        </div>

                        {rollingBack ? (
                          <div
                            className="flex items-center gap-2 text-[13px] text-red-700"
                            style={{ fontWeight: 600 }}
                          >
                            <Loader2 className="animate-spin" size={16} />{" "}
                            מבטל...
                          </div>
                        ) : showUndoConfirm ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-lg border border-red-300 bg-white px-3 py-1.5">
                              <ShieldAlert className="text-red-500" size={13} />
                              <span
                                className="text-[12px] text-red-700"
                                style={{ fontWeight: 600 }}
                              >
                                בטוח?
                              </span>
                            </div>
                            <button
                              className="rounded-lg bg-red-600 px-4 py-1.5 text-[13px] text-white transition-colors hover:bg-red-700"
                              onClick={executeRollback}
                              style={{ fontWeight: 700 }}
                              type="button"
                            >
                              כן, בטל ייבוא
                            </button>
                            <button
                              className="rounded-lg border border-red-300 px-3 py-1.5 text-[13px] text-red-600 transition-colors hover:bg-red-100"
                              onClick={() => setShowUndoConfirm(false)}
                              style={{ fontWeight: 600 }}
                              type="button"
                            >
                              לא
                            </button>
                          </div>
                        ) : (
                          <button
                            className="flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-[13px] text-red-700 transition-colors hover:bg-red-100"
                            onClick={() => setShowUndoConfirm(true)}
                            style={{ fontWeight: 700 }}
                            type="button"
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
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                    initial={{ opacity: 0, y: 10 }}
                  >
                    <div className="flex items-center justify-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                      <CheckCircle className="text-green-600" size={18} />
                      <span
                        className="text-[14px] text-green-700"
                        style={{ fontWeight: 600 }}
                      >
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
        <div className="py-4 text-center text-[#8d785e] text-[12px]">
          &copy; 2026 TravelPro — מערכת ניהול ספקים למפיקי טיולים. כל הזכויות
          שמורות.
        </div>
      </div>
    </div>
  );
}
