import { useQuery } from "convex/react";
import {
  Bell,
  CheckCircle,
  FileText,
  FolderOpen,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import type { Project } from "./data";

interface Notification {
  icon: "project" | "supplier" | "document" | "client";
  id: string;
  message: string;
  path?: string;
  read: boolean;
  time: string;
  title: string;
  type: "success" | "warning" | "info" | "alert";
}

function buildNotifications(
  projects: Project[],
  suppliers: any[]
): Notification[] {
  const notifs: Notification[] = [];

  // Projects needing attention
  for (const p of projects) {
    if (p.status === "מחיר בהערכה") {
      notifs.push({
        id: `proj-pricing-${p.id}`,
        type: "warning",
        title: "ממתין לתמחור",
        message: `"${p.name}" — הפרויקט ממתין לתמחור כבר מספר ימים`,
        time: "היום",
        read: false,
        path: `/projects/${p.id}`,
        icon: "project",
      });
    }
    if (p.status === "אושר") {
      notifs.push({
        id: `proj-approved-${p.id}`,
        type: "success",
        title: "פרויקט אושר!",
        message: `"${p.name}" אושר על ידי ${p.company}`,
        time: "היום",
        read: false,
        path: `/projects/${p.id}`,
        icon: "client",
      });
    }
    if (p.status === "הצעה נשלחה") {
      notifs.push({
        id: `proj-sent-${p.id}`,
        type: "info",
        title: "הצעה נשלחה",
        message: `ההצעה עבור "${p.name}" נשלחה ללקוח — ממתין לתשובה`,
        time: "אתמול",
        read: true,
        path: `/projects/${p.id}`,
        icon: "project",
      });
    }
  }

  // Supplier warnings
  for (const s of suppliers) {
    if (s.verificationStatus === "pending") {
      notifs.push({
        id: `sup-pending-${s._id || s.id}`,
        type: "alert",
        title: "ספק ממתין לאימות",
        message: `${s.name} — חסרים מסמכים לאימות. ${s.notes !== "-" ? s.notes : ""}`,
        time: "היום",
        read: false,
        path: `/suppliers/${s._id || s.id}`,
        icon: "supplier",
      });
    }
    if (s.verificationStatus === "unverified") {
      notifs.push({
        id: `sup-unverified-${s._id || s.id}`,
        type: "warning",
        title: "ספק לא מאומת",
        message: `${s.name} — ${s.notes !== "-" ? s.notes : "נדרש אימות"}`,
        time: "אתמול",
        read: true,
        path: `/suppliers/${s._id || s.id}`,
        icon: "document",
      });
    }
  }

  return notifs;
}

const iconMap = {
  project: FolderOpen,
  supplier: Users,
  document: FileText,
  client: CheckCircle,
};

const typeColors = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    dot: "bg-yellow-500",
  },
  info: { bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" },
  alert: { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
};

export function NotificationsPanel() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [allMarkedRead, setAllMarkedRead] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const projects = useQuery(api.projects.list);
  const suppliers = useQuery(api.suppliers.list);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const notifications = useMemo(() => {
    if (!(projects && suppliers)) {
      return [];
    }
    const notifs = buildNotifications(projects as any, suppliers);
    if (allMarkedRead) {
      return notifs.map((n) => ({ ...n, read: true }));
    }
    return notifs.map((n) => (readIds.has(n.id) ? { ...n, read: true } : n));
  }, [projects, suppliers, readIds, allMarkedRead]);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const markAllRead = () => {
    setAllMarkedRead(true);
  };

  const handleClick = (notif: Notification) => {
    setReadIds((prev) => new Set(prev).add(notif.id));
    if (notif.path) {
      navigate(notif.path);
      setOpen(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={panelRef}>
      <button
        className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-[#f5f3f0] ${open ? "bg-[#f5f3f0] text-[#ff8c00]" : "text-[#181510]"}`}
        onClick={toggleOpen}
        type="button"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            className="absolute top-1.5 left-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#ef4444] text-[10px] text-white"
            style={{ fontWeight: 700 }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute top-12 left-0 z-50 w-96 overflow-hidden rounded-xl border border-[#e7e1da] bg-white shadow-2xl"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-[#e7e1da] border-b bg-[#fcfbf9] px-4 py-3">
            <h3
              className="text-[#181510] text-[15px]"
              style={{ fontWeight: 700 }}
            >
              התראות
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  className="text-[#ff8c00] text-[11px]"
                  onClick={markAllRead}
                  style={{ fontWeight: 600 }}
                  type="button"
                >
                  סמן הכל כנקרא
                </button>
              )}
              <button
                className="text-[#8d785e] hover:text-[#181510]"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications list */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="mx-auto mb-2 text-[#ddd6cb]" size={28} />
                <p className="text-[#8d785e] text-[14px]">אין התראות חדשות</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const Icon = iconMap[notif.icon];
                const colors = typeColors[notif.type];
                return (
                  <button
                    className={`flex w-full items-start gap-3 border-[#f5f3f0] border-b px-4 py-3.5 text-right transition-colors last:border-b-0 hover:bg-[#f5f3f0] ${notif.read ? "" : "bg-[#fffaf3]"}`}
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    type="button"
                  >
                    <div
                      className={`h-9 w-9 rounded-lg ${colors.bg} mt-0.5 flex shrink-0 items-center justify-center`}
                    >
                      <Icon
                        className={`${notif.type === "success" ? "text-green-600" : notif.type === "warning" ? "text-yellow-600" : notif.type === "info" ? "text-blue-600" : "text-red-600"}`}
                        size={16}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <span
                            className={`h-2 w-2 rounded-full ${colors.dot} shrink-0`}
                          />
                        )}
                        <span
                          className="truncate text-[#181510] text-[13px]"
                          style={{ fontWeight: notif.read ? 400 : 600 }}
                        >
                          {notif.title}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[#8d785e] text-[12px]">
                        {notif.message}
                      </p>
                      <span className="mt-1 block text-[#c4b89a] text-[10px]">
                        {notif.time}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
