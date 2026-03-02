import {
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

type ToastVariant = "success" | "error" | "warning" | "info" | "neutral";

interface ToastConfig {
  bg: string;
  border: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  subColor: string;
  textColor: string;
}

const variants: Record<ToastVariant, ToastConfig> = {
  success: {
    icon: <CheckCircle size={28} />,
    bg: "#f0fdf4",
    iconBg: "#22c55e",
    iconColor: "#fff",
    border: "#bbf7d0",
    textColor: "#15803d",
    subColor: "#4ade80",
  },
  error: {
    icon: <XCircle size={28} />,
    bg: "#fef2f2",
    iconBg: "#ef4444",
    iconColor: "#fff",
    border: "#fecaca",
    textColor: "#b91c1c",
    subColor: "#f87171",
  },
  warning: {
    icon: <AlertTriangle size={28} />,
    bg: "#fff7ed",
    iconBg: "#ff8c00",
    iconColor: "#fff",
    border: "#fed7aa",
    textColor: "#9a3412",
    subColor: "#fb923c",
  },
  info: {
    icon: <Info size={28} />,
    bg: "#eff6ff",
    iconBg: "#3b82f6",
    iconColor: "#fff",
    border: "#bfdbfe",
    textColor: "#1d4ed8",
    subColor: "#60a5fa",
  },
  neutral: {
    icon: <Sparkles size={28} />,
    bg: "#f8f7f5",
    iconBg: "#181510",
    iconColor: "#fff",
    border: "#e7e1da",
    textColor: "#181510",
    subColor: "#8d785e",
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
      className="flex min-w-[380px] items-center gap-4 rounded-2xl px-5 py-4 font-['Assistant',sans-serif] shadow-lg"
      dir="rtl"
      style={{
        background: config.bg,
        border: `1.5px solid ${config.border}`,
      }}
    >
      {/* Icon bubble */}
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm"
        style={{ backgroundColor: config.iconBg, color: config.iconColor }}
      >
        {config.icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div
          className="truncate text-[16px]"
          style={{ color: config.textColor, fontWeight: 600 }}
        >
          {message}
        </div>
        {description && (
          <div
            className="mt-1 truncate text-[13px]"
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
      <ToastContent
        description={description}
        message={message}
        variant="success"
      />
    ));
  },

  error(message: string, description?: string) {
    toast.custom(() => (
      <ToastContent
        description={description}
        message={message}
        variant="error"
      />
    ));
  },

  warning(message: string, description?: string) {
    toast.custom(() => (
      <ToastContent
        description={description}
        message={message}
        variant="warning"
      />
    ));
  },

  info(message: string, description?: string) {
    toast.custom(() => (
      <ToastContent
        description={description}
        message={message}
        variant="info"
      />
    ));
  },

  neutral(message: string, description?: string) {
    toast.custom(() => (
      <ToastContent
        description={description}
        message={message}
        variant="neutral"
      />
    ));
  },
};
