import { toast } from 'sonner';
import { CheckCircle, AlertTriangle, Info, XCircle, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface ToastConfig {
  icon: ReactNode;
  bg: string;
  iconBg: string;
  iconColor: string;
  border: string;
  textColor: string;
  subColor: string;
}

const variants: Record<ToastVariant, ToastConfig> = {
  success: {
    icon: <CheckCircle size={28} />,
    bg: '#f0fdf4',
    iconBg: '#22c55e',
    iconColor: '#fff',
    border: '#bbf7d0',
    textColor: '#15803d',
    subColor: '#4ade80',
  },
  error: {
    icon: <XCircle size={28} />,
    bg: '#fef2f2',
    iconBg: '#ef4444',
    iconColor: '#fff',
    border: '#fecaca',
    textColor: '#b91c1c',
    subColor: '#f87171',
  },
  warning: {
    icon: <AlertTriangle size={28} />,
    bg: '#fff7ed',
    iconBg: '#ff8c00',
    iconColor: '#fff',
    border: '#fed7aa',
    textColor: '#9a3412',
    subColor: '#fb923c',
  },
  info: {
    icon: <Info size={28} />,
    bg: '#eff6ff',
    iconBg: '#3b82f6',
    iconColor: '#fff',
    border: '#bfdbfe',
    textColor: '#1d4ed8',
    subColor: '#60a5fa',
  },
  neutral: {
    icon: <Sparkles size={28} />,
    bg: '#f8f7f5',
    iconBg: '#181510',
    iconColor: '#fff',
    border: '#e7e1da',
    textColor: '#181510',
    subColor: '#8d785e',
  },
};

function ToastContent({
  variant,
  message,
  description,
}: {
  variant: ToastVariant;
  message: string;
  description?: string;
}) {
  const config = variants[variant];

  return (
    <div
      className="flex items-center gap-4 px-5 py-4 rounded-2xl shadow-lg min-w-[380px] font-['Assistant',sans-serif]"
      style={{
        background: config.bg,
        border: `1.5px solid ${config.border}`,
      }}
      dir="rtl"
    >
      {/* Icon bubble */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
        style={{ backgroundColor: config.iconBg, color: config.iconColor }}
      >
        {config.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div
          className="text-[16px] truncate"
          style={{ color: config.textColor, fontWeight: 600 }}
        >
          {message}
        </div>
        {description && (
          <div
            className="text-[13px] mt-1 truncate"
            style={{ color: config.subColor }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Public API ───────────────────────────────────────────────

export const appToast = {
  success(message: string, description?: string) {
    toast.custom(() => (
      <ToastContent variant="success" message={message} description={description} />
    ));
  },

  error(message: string, description?: string) {
    toast.custom(() => (
      <ToastContent variant="error" message={message} description={description} />
    ));
  },

  warning(message: string, description?: string) {
    toast.custom(() => (
      <ToastContent variant="warning" message={message} description={description} />
    ));
  },

  info(message: string, description?: string) {
    toast.custom(() => (
      <ToastContent variant="info" message={message} description={description} />
    ));
  },

  neutral(message: string, description?: string) {
    toast.custom(() => (
      <ToastContent variant="neutral" message={message} description={description} />
    ));
  },
};