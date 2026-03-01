import { useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, FolderOpen, Users, FileSpreadsheet,
  Wand2, ScanLine, Settings, Calendar, UserCircle,
  FileText, ChevronLeft, Grape, Bus, UtensilsCrossed, Archive,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface RouteInfo {
  label: string;
  icon: LucideIcon;
  color: string;
}

const routeMeta: Record<string, RouteInfo> = {
  '': { label: 'דשבורד', icon: LayoutDashboard, color: '#ff8c00' },
  'projects': { label: 'פרויקטים', icon: FolderOpen, color: '#3b82f6' },
  'suppliers': { label: 'בנק ספקים', icon: Users, color: '#8b5cf6' },
  'import': { label: 'ייבוא ספקים', icon: FileSpreadsheet, color: '#22c55e' },
  'classify': { label: 'אשף סיווג', icon: Wand2, color: '#ec4899' },
  'scan': { label: 'סריקת מוצרים', icon: ScanLine, color: '#14b8a6' },
  'archive': { label: 'ארכיון', icon: Archive, color: '#94a3b8' },
  'settings': { label: 'הגדרות', icon: Settings, color: '#6b7280' },
  'calendar': { label: 'יומן', icon: Calendar, color: '#f59e0b' },
  'clients': { label: 'לקוחות', icon: UserCircle, color: '#06b6d4' },
  'documents': { label: 'מסמכים', icon: FileText, color: '#8d785e' },
  'quote': { label: 'תצוגת לקוח', icon: FileText, color: '#ff8c00' },
};

// Known entity IDs → display info
const entityMeta: Record<string, { label: string; icon: LucideIcon; color: string }> = {
  '4829-24': { label: 'נופש שנתי גליל עליון', icon: FolderOpen, color: '#3b82f6' },
  '4830-24': { label: 'כנס מכירות Q1', icon: FolderOpen, color: '#3b82f6' },
  '4831-24': { label: 'יום כיף צוות פיתוח', icon: FolderOpen, color: '#8b5cf6' },
  '4832-24': { label: 'אירוע חברה שנתי', icon: FolderOpen, color: '#22c55e' },
  '4833-24': { label: 'סדנת גיבוש הנהלה', icon: FolderOpen, color: '#eab308' },
  '1': { label: 'הסעות מסיילי הצפון', icon: Bus, color: '#3b82f6' },
  '2': { label: 'קייטרינג סאמי המזרח', icon: UtensilsCrossed, color: '#22c55e' },
  '3': { label: 'ספורט אתגרי בנגב', icon: FolderOpen, color: '#a855f7' },
  '4': { label: 'מלון פלאזה - מרכז', icon: FolderOpen, color: '#ec4899' },
  '5': { label: 'יקב רמת נפתלי', icon: Grape, color: '#7c3aed' },
  '6': { label: 'אוטובוסים הגליל', icon: Bus, color: '#0ea5e9' },
};

interface BreadcrumbItem {
  label: string;
  path: string;
  icon: LucideIcon;
  color: string;
}

export function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/') return null;

  const segments = location.pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [
    { label: 'דשבורד', path: '/', icon: LayoutDashboard, color: '#ff8c00' },
  ];

  let currentPath = '';
  segments.forEach((segment, idx) => {
    currentPath += `/${segment}`;
    const meta = routeMeta[segment] || entityMeta[segment];
    if (meta) {
      items.push({ label: meta.label, path: currentPath, icon: meta.icon, color: meta.color });
    } else {
      // For dynamic IDs under known parents, show a friendly label
      const parentSegment = idx > 0 ? segments[idx - 1] : '';
      if (parentSegment === 'suppliers') {
        items.push({ label: 'פרטי ספק', path: currentPath, icon: Users, color: '#8b5cf6' });
      } else if (parentSegment === 'projects') {
        items.push({ label: 'פרטי פרויקט', path: currentPath, icon: FolderOpen, color: '#3b82f6' });
      } else {
        items.push({ label: `#${segment}`, path: currentPath, icon: FileText, color: '#8d785e' });
      }
    }
  });

  return (
    <div className="px-4 lg:px-8 py-4 bg-[#f8f7f5]">
      <div className="flex items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const Icon = item.icon;

          return (
            <div key={item.path} className="flex items-center gap-2">
              {/* Separator */}
              {idx > 0 && (
                <ChevronLeft size={18} className="text-[#c4b89a] mx-0.5" />
              )}

              {isLast ? (
                /* Active (current) crumb */
                <span
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-[15px]"
                  style={{
                    backgroundColor: item.color + '12',
                    color: item.color,
                    fontWeight: 600,
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: item.color + '20' }}
                  >
                    <Icon size={18} />
                  </span>
                  {item.label}
                </span>
              ) : (
                /* Clickable parent crumb */
                <button
                  onClick={() => navigate(item.path)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[15px] text-[#8d785e] hover:bg-[#ece8e3] transition-all group"
                >
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#ece8e3] group-hover:bg-[#e0d9ce] transition-colors">
                    <Icon size={16} className="text-[#8d785e]" />
                  </span>
                  {item.label}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}