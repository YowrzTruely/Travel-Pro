import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Bell, X, CheckCircle, AlertTriangle, FileText, Users, FolderOpen } from 'lucide-react';
import { projectsApi, suppliersApi } from './api';
import type { Project } from './data';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
  path?: string;
  icon: 'project' | 'supplier' | 'document' | 'client';
}

function buildNotifications(projects: Project[], suppliers: any[]): Notification[] {
  const notifs: Notification[] = [];
  const now = new Date();

  // Projects needing attention
  for (const p of projects) {
    if (p.status === 'מחיר בהערכה') {
      notifs.push({
        id: `proj-pricing-${p.id}`,
        type: 'warning',
        title: 'ממתין לתמחור',
        message: `"${p.name}" — הפרויקט ממתין לתמחור כבר מספר ימים`,
        time: 'היום',
        read: false,
        path: `/projects/${p.id}`,
        icon: 'project',
      });
    }
    if (p.status === 'אושר') {
      notifs.push({
        id: `proj-approved-${p.id}`,
        type: 'success',
        title: 'פרויקט אושר!',
        message: `"${p.name}" אושר על ידי ${p.company}`,
        time: 'היום',
        read: false,
        path: `/projects/${p.id}`,
        icon: 'client',
      });
    }
    if (p.status === 'הצעה נשלחה') {
      notifs.push({
        id: `proj-sent-${p.id}`,
        type: 'info',
        title: 'הצעה נשלחה',
        message: `ההצעה עבור "${p.name}" נשלחה ללקוח — ממתין לתשובה`,
        time: 'אתמול',
        read: true,
        path: `/projects/${p.id}`,
        icon: 'project',
      });
    }
  }

  // Supplier warnings
  for (const s of suppliers) {
    if (s.verificationStatus === 'pending') {
      notifs.push({
        id: `sup-pending-${s.id}`,
        type: 'alert',
        title: 'ספק ממתין לאימות',
        message: `${s.name} — חסרים מסמכים לאימות. ${s.notes !== '-' ? s.notes : ''}`,
        time: 'היום',
        read: false,
        path: `/suppliers/${s.id}`,
        icon: 'supplier',
      });
    }
    if (s.verificationStatus === 'unverified') {
      notifs.push({
        id: `sup-unverified-${s.id}`,
        type: 'warning',
        title: 'ספק לא מאומת',
        message: `${s.name} — ${s.notes !== '-' ? s.notes : 'נדרש אימות'}`,
        time: 'אתמול',
        read: true,
        path: `/suppliers/${s.id}`,
        icon: 'document',
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
  success: { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500' },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
  alert: { bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
};

export function NotificationsPanel() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loaded, setLoaded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loadNotifications = async () => {
    if (loaded) return;
    try {
      const [projects, suppliers] = await Promise.all([
        projectsApi.list(),
        suppliersApi.list(),
      ]);
      setNotifications(buildNotifications(projects, suppliers));
      setLoaded(true);
    } catch (err) {
      console.error('[Notifications] Failed to load:', err);
    }
  };

  const toggleOpen = () => {
    if (!open) loadNotifications();
    setOpen(!open);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClick = (notif: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.path) {
      navigate(notif.path);
      setOpen(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={toggleOpen}
        className={`relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f5f3f0] transition-colors ${open ? 'bg-[#f5f3f0] text-[#ff8c00]' : 'text-[#181510]'}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 left-1.5 min-w-[18px] h-[18px] bg-[#ef4444] rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white" style={{ fontWeight: 700 }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-12 w-96 bg-white rounded-xl border border-[#e7e1da] shadow-2xl z-50 overflow-hidden" dir="rtl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7e1da] bg-[#fcfbf9]">
            <h3 className="text-[15px] text-[#181510]" style={{ fontWeight: 700 }}>התראות</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[11px] text-[#ff8c00]" style={{ fontWeight: 600 }}>
                  סמן הכל כנקרא
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-[#8d785e] hover:text-[#181510]"><X size={16} /></button>
            </div>
          </div>

          {/* Notifications list */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={28} className="mx-auto text-[#ddd6cb] mb-2" />
                <p className="text-[14px] text-[#8d785e]">אין התראות חדשות</p>
              </div>
            ) : (
              notifications.map(notif => {
                const Icon = iconMap[notif.icon];
                const colors = typeColors[notif.type];
                return (
                  <button
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className={`w-full text-right flex items-start gap-3 px-4 py-3.5 hover:bg-[#f5f3f0] transition-colors border-b border-[#f5f3f0] last:border-b-0 ${!notif.read ? 'bg-[#fffaf3]' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={16} className={`${notif.type === 'success' ? 'text-green-600' : notif.type === 'warning' ? 'text-yellow-600' : notif.type === 'info' ? 'text-blue-600' : 'text-red-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!notif.read && <span className={`w-2 h-2 rounded-full ${colors.dot} shrink-0`} />}
                        <span className="text-[13px] text-[#181510] truncate" style={{ fontWeight: notif.read ? 400 : 600 }}>{notif.title}</span>
                      </div>
                      <p className="text-[12px] text-[#8d785e] mt-0.5 line-clamp-2">{notif.message}</p>
                      <span className="text-[10px] text-[#c4b89a] mt-1 block">{notif.time}</span>
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
