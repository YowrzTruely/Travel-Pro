import { useMutation, useQuery } from "convex/react";
import type { LucideIcon } from "lucide-react";
import {
  AlertOctagon,
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  FileWarning,
  Send,
  ShieldCheck,
  Target,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// ─── Type config per notification type ───

interface NotifTypeConfig {
  bgColor: string;
  color: string;
  dotColor: string;
  icon: LucideIcon;
}

const typeConfigMap: Record<string, NotifTypeConfig> = {
  availability_request: {
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    dotColor: "bg-purple-500",
  },
  availability_approved: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    dotColor: "bg-green-500",
  },
  availability_declined: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    dotColor: "bg-red-500",
  },
  booking_expiring: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    dotColor: "bg-yellow-500",
  },
  booking_expired: {
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    dotColor: "bg-red-500",
  },
  quote_approved: {
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50",
    dotColor: "bg-green-500",
  },
  new_lead: {
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    dotColor: "bg-blue-500",
  },
  doc_expiring: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    dotColor: "bg-yellow-500",
  },
  doc_expired: {
    icon: AlertOctagon,
    color: "text-red-600",
    bgColor: "bg-red-50",
    dotColor: "bg-red-500",
  },
  doc_reminder: {
    icon: Bell,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    dotColor: "bg-orange-500",
  },
  invoice_missing: {
    icon: FileWarning,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    dotColor: "bg-orange-500",
  },
  supplier_pending: {
    icon: UserPlus,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    dotColor: "bg-purple-500",
  },
  supplier_approved: {
    icon: ShieldCheck,
    color: "text-green-600",
    bgColor: "bg-green-50",
    dotColor: "bg-green-500",
  },
  order_sent: {
    icon: Send,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    dotColor: "bg-blue-500",
  },
};

const defaultConfig: NotifTypeConfig = {
  icon: Bell,
  color: "text-gray-600",
  bgColor: "bg-gray-50",
  dotColor: "bg-gray-500",
};

// ─── Relative time in Hebrew ───

function relativeTimeHebrew(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "עכשיו";
  }
  if (minutes < 60) {
    return `לפני ${minutes} דקות`;
  }
  if (hours < 24) {
    return hours === 1 ? "לפני שעה" : `לפני ${hours} שעות`;
  }
  if (days === 1) {
    return "אתמול";
  }
  if (days < 7) {
    return `לפני ${days} ימים`;
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "לפני שבוע" : `לפני ${weeks} שבועות`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? "לפני חודש" : `לפני ${months} חודשים`;
}

// ─── Date grouping ───

function getDateGroup(timestamp: number): string {
  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

  if (timestamp >= todayStart) {
    return "היום";
  }
  if (timestamp >= yesterdayStart) {
    return "אתמול";
  }
  return "קודם";
}

// ─── Notification interface ───

interface NotifItem {
  body: string;
  createdAt: number;
  id: Id<"notifications">;
  link?: string;
  read: boolean;
  title: string;
  type: string;
}

// ─── Component ───

export function NotificationsPanel() {
  const navigate = useNavigate();
  const notifications = useQuery(api.notifications.listForUser);
  const unreadCountVal = useQuery(api.notifications.unreadCount);
  const markReadMut = useMutation(api.notifications.markRead);
  const markAllReadMut = useMutation(api.notifications.markAllRead);

  const unreadCount = unreadCountVal ?? 0;

  const handleClickNotification = useCallback(
    (notif: NotifItem) => {
      if (!notif.read) {
        markReadMut({ id: notif.id });
      }
      if (notif.link) {
        navigate(notif.link);
      }
    },
    [markReadMut, navigate]
  );

  const handleMarkAllRead = useCallback(() => {
    markAllReadMut({});
  }, [markAllReadMut]);

  // Group notifications by date
  const grouped = useMemo(() => {
    if (!notifications) {
      return [];
    }
    const groups: Array<{ label: string; items: NotifItem[] }> = [];
    const groupMap = new Map<string, NotifItem[]>();
    const order: string[] = [];

    for (const n of notifications) {
      const group = getDateGroup(n.createdAt);
      if (!groupMap.has(group)) {
        groupMap.set(group, []);
        order.push(group);
      }
      groupMap.get(group)?.push(n as NotifItem);
    }

    for (const label of order) {
      const items = groupMap.get(label);
      if (items && items.length > 0) {
        groups.push({ label, items });
      }
    }

    return groups;
  }, [notifications]);

  const isLoading = notifications === undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-[#181510] transition-colors hover:bg-[#f5f3f0]"
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
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-96 overflow-hidden rounded-xl border border-[#e7e1da] bg-white p-0 shadow-2xl"
        sideOffset={8}
      >
        <div dir="rtl">
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
                  onClick={handleMarkAllRead}
                  style={{ fontWeight: 600 }}
                  type="button"
                >
                  סמן הכל כנקרא
                </button>
              )}
            </div>
          </div>

          {/* Notifications list */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-[#ff8c00] border-t-transparent" />
                <p className="text-[#8d785e] text-[13px]">טוען התראות...</p>
              </div>
            ) : grouped.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="mx-auto mb-2 text-[#ddd6cb]" size={28} />
                <p className="text-[#8d785e] text-[14px]">אין התראות חדשות</p>
              </div>
            ) : (
              grouped.map((group) => (
                <div key={group.label}>
                  {/* Group header */}
                  <div className="sticky top-0 z-10 border-[#f5f3f0] border-b bg-[#f8f7f5] px-4 py-1.5">
                    <span
                      className="text-[#8d785e] text-[11px]"
                      style={{ fontWeight: 600 }}
                    >
                      {group.label}
                    </span>
                  </div>

                  {group.items.map((notif) => {
                    const config = typeConfigMap[notif.type] ?? defaultConfig;
                    const Icon = config.icon;
                    return (
                      <button
                        className={`flex w-full items-start gap-3 border-[#f5f3f0] border-b px-4 py-3.5 text-right transition-colors last:border-b-0 hover:bg-[#f5f3f0] ${notif.read ? "" : "bg-[#fffaf3]"}`}
                        key={notif.id}
                        onClick={() => handleClickNotification(notif)}
                        type="button"
                      >
                        <div
                          className={`h-9 w-9 rounded-lg ${config.bgColor} mt-0.5 flex shrink-0 items-center justify-center`}
                        >
                          <Icon className={config.color} size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {!notif.read && (
                              <span
                                className={`h-2 w-2 rounded-full ${config.dotColor} shrink-0`}
                              />
                            )}
                            <span
                              className="truncate text-[#181510] text-[13px]"
                              style={{
                                fontWeight: notif.read ? 400 : 600,
                              }}
                            >
                              {notif.title}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-[#8d785e] text-[12px]">
                            {notif.body}
                          </p>
                          <span className="mt-1 block text-[#c4b89a] text-[10px]">
                            {relativeTimeHebrew(notif.createdAt)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
