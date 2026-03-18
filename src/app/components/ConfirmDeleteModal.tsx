import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ConfirmDeleteModalProps {
  description?: string;
  itemName?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
}

const CONFIRM_WORD = "מחיקה";

export function ConfirmDeleteModal({
  open,
  title,
  description,
  itemName,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isMatch = typed.trim() === CONFIRM_WORD;

  // Reset on open/close
  useEffect(() => {
    if (open) {
      setTyped("");
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Handle Enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && isMatch && !loading) {
        e.preventDefault();
        onConfirm();
      }
      if (e.key === "Escape") {
        onCancel();
      }
    },
    [isMatch, loading, onConfirm, onCancel]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onCancel}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-card shadow-2xl"
            dir="rtl"
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="text-destructive" size={24} />
                </div>
                <div>
                  <h3
                    className="text-[17px] text-foreground leading-tight"
                    style={{ fontWeight: 700 }}
                  >
                    {title}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    פעולה זו אינה ניתנת לביטול
                  </p>
                </div>
              </div>
              <button
                className="mt-1 text-tertiary transition-colors hover:text-foreground"
                onClick={onCancel}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              {description && (
                <p className="mb-1 text-[14px] text-foreground leading-relaxed">
                  {description}
                </p>
              )}
              {itemName && (
                <p className="mb-4 text-[14px] text-foreground">
                  האם אתה בטוח שברצונך למחוק את{" "}
                  <span
                    className="text-destructive"
                    style={{ fontWeight: 700 }}
                  >
                    &quot;{itemName}&quot;
                  </span>
                  ?
                </p>
              )}
              {!(itemName || description) && (
                <p className="mb-4 text-[14px] text-foreground">
                  האם אתה בטוח שברצונך לבצע מחיקה זו?
                </p>
              )}

              {/* Type to confirm */}
              <div className="rounded-xl border border-red-100 bg-[#fef2f2] p-4">
                <p className="mb-2.5 text-[13px] text-foreground leading-relaxed">
                  לאישור, הקלד{" "}
                  <span
                    className="rounded bg-destructive/15 px-1.5 py-0.5 font-mono text-[13px] text-destructive"
                    style={{ fontWeight: 700 }}
                  >
                    {CONFIRM_WORD}
                  </span>{" "}
                  בשדה למטה:
                </p>
                <input
                  autoComplete="off"
                  className={`w-full rounded-lg border-2 bg-card px-3 py-2.5 text-[14px] outline-none transition-colors placeholder:text-tertiary ${
                    typed.length === 0
                      ? "border-border focus:border-destructive/40"
                      : isMatch
                        ? "border-green-400 bg-success/10/50"
                        : "border-destructive/40"
                  }`}
                  dir="rtl"
                  onChange={(e) => setTyped(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`הקלד "${CONFIRM_WORD}" כאן...`}
                  ref={inputRef}
                  style={{ fontWeight: 600 }}
                  type="text"
                  value={typed}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pt-2 pb-6">
              <button
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[14px] transition-all ${
                  isMatch && !loading
                    ? "bg-destructive/100 text-white shadow-sm hover:bg-destructive"
                    : "cursor-not-allowed bg-border text-tertiary"
                }`}
                disabled={!isMatch || loading}
                onClick={onConfirm}
                style={{ fontWeight: 600 }}
                type="button"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                {loading ? "מוחק..." : "אישור מחיקה"}
              </button>
              <button
                className="rounded-xl border border-border px-5 py-2.5 text-[14px] text-foreground transition-colors hover:bg-accent"
                onClick={onCancel}
                style={{ fontWeight: 600 }}
                type="button"
              >
                ביטול
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Hook for easy usage ───
export function useConfirmDelete() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    description?: string;
    itemName?: string;
    loading: boolean;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    loading: false,
    onConfirm: () => {},
  });

  const requestDelete = useCallback(
    (opts: {
      title: string;
      description?: string;
      itemName?: string;
      onConfirm: () => Promise<void> | void;
    }) => {
      setState({
        open: true,
        title: opts.title,
        description: opts.description,
        itemName: opts.itemName,
        loading: false,
        onConfirm: async () => {
          setState((prev) => ({ ...prev, loading: true }));
          try {
            await opts.onConfirm();
          } finally {
            setState((prev) => ({ ...prev, open: false, loading: false }));
          }
        },
      });
    },
    []
  );

  const cancel = useCallback(() => {
    setState((prev) => ({ ...prev, open: false, loading: false }));
  }, []);

  const modal = (
    <ConfirmDeleteModal
      description={state.description}
      itemName={state.itemName}
      loading={state.loading}
      onCancel={cancel}
      onConfirm={state.onConfirm}
      open={state.open}
      title={state.title}
    />
  );

  return { requestDelete, modal };
}
