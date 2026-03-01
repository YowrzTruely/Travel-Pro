import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const CONFIRM_WORD = 'מחיקה';

export function ConfirmDeleteModal({
  open,
  title,
  description,
  itemName,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const [typed, setTyped] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isMatch = typed.trim() === CONFIRM_WORD;

  // Reset on open/close
  useEffect(() => {
    if (open) {
      setTyped('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Handle Enter key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && isMatch && !loading) {
        e.preventDefault();
        onConfirm();
      }
      if (e.key === 'Escape') {
        onCancel();
      }
    },
    [isMatch, loading, onConfirm, onCancel]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-[17px] text-[#181510] leading-tight" style={{ fontWeight: 700 }}>
                    {title}
                  </h3>
                  <p className="text-[12px] text-[#8d785e] mt-0.5">פעולה זו אינה ניתנת לביטול</p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="text-[#b5a48b] hover:text-[#181510] transition-colors mt-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              {description && (
                <p className="text-[14px] text-[#3d3322] mb-1 leading-relaxed">{description}</p>
              )}
              {itemName && (
                <p className="text-[14px] text-[#181510] mb-4">
                  האם אתה בטוח שברצונך למחוק את{' '}
                  <span style={{ fontWeight: 700 }} className="text-red-600">
                    &quot;{itemName}&quot;
                  </span>
                  ?
                </p>
              )}
              {!itemName && !description && (
                <p className="text-[14px] text-[#181510] mb-4">האם אתה בטוח שברצונך לבצע מחיקה זו?</p>
              )}

              {/* Type to confirm */}
              <div className="bg-[#fef2f2] border border-red-100 rounded-xl p-4">
                <p className="text-[13px] text-[#3d3322] mb-2.5 leading-relaxed">
                  לאישור, הקלד{' '}
                  <span
                    className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-mono text-[13px]"
                    style={{ fontWeight: 700 }}
                  >
                    {CONFIRM_WORD}
                  </span>{' '}
                  בשדה למטה:
                </p>
                <input
                  ref={inputRef}
                  type="text"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`הקלד "${CONFIRM_WORD}" כאן...`}
                  dir="rtl"
                  className={`w-full text-[14px] bg-white border-2 rounded-lg px-3 py-2.5 outline-none transition-colors placeholder:text-[#c4b89a] ${
                    typed.length === 0
                      ? 'border-[#e7e1da] focus:border-red-300'
                      : isMatch
                        ? 'border-green-400 bg-green-50/50'
                        : 'border-red-300'
                  }`}
                  style={{ fontWeight: 600 }}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-6 pt-2">
              <button
                onClick={onConfirm}
                disabled={!isMatch || loading}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-[14px] ${
                  isMatch && !loading
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                    : 'bg-[#e7e1da] text-[#b5a48b] cursor-not-allowed'
                }`}
                style={{ fontWeight: 600 }}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {loading ? 'מוחק...' : 'אישור מחיקה'}
              </button>
              <button
                onClick={onCancel}
                className="px-5 py-2.5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors text-[14px] text-[#3d3322]"
                style={{ fontWeight: 600 }}
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
    title: '',
    loading: false,
    onConfirm: () => {},
  });

  const requestDelete = useCallback(
    (opts: { title: string; description?: string; itemName?: string; onConfirm: () => Promise<void> | void }) => {
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
      open={state.open}
      title={state.title}
      description={state.description}
      itemName={state.itemName}
      loading={state.loading}
      onConfirm={state.onConfirm}
      onCancel={cancel}
    />
  );

  return { requestDelete, modal };
}
