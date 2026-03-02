import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Bus,
  Calendar,
  ChevronLeft,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Grape,
  LayoutDashboard,
  ScanLine,
  Settings,
  UserCircle,
  Users,
  UtensilsCrossed,
  Wand2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

interface RouteInfo {
  color: string;
  icon: LucideIcon;
  label: string;
}

const routeMeta: Record<string, RouteInfo> = {
  "": { label: "דשבורד", icon: LayoutDashboard, color: "#ff8c00" },
  projects: { label: "פרויקטים", icon: FolderOpen, color: "#3b82f6" },
  suppliers: { label: "בנק ספקים", icon: Users, color: "#8b5cf6" },
  import: { label: "ייבוא ספקים", icon: FileSpreadsheet, color: "#22c55e" },
  classify: { label: "אשף סיווג", icon: Wand2, color: "#ec4899" },
  scan: { label: "סריקת מוצרים", icon: ScanLine, color: "#14b8a6" },
  archive: { label: "ארכיון", icon: Archive, color: "#94a3b8" },
  settings: { label: "הגדרות", icon: Settings, color: "#6b7280" },
  calendar: { label: "יומן", icon: Calendar, color: "#f59e0b" },
  clients: { label: "לקוחות", icon: UserCircle, color: "#06b6d4" },
  documents: { label: "מסמכים", icon: FileText, color: "#8d785e" },
  quote: { label: "תצוגת לקוח", icon: FileText, color: "#ff8c00" },
};

// Known entity IDs → display info
const entityMeta: Record<
  string,
  { label: string; icon: LucideIcon; color: string }
> = {
  "4829-24": {
    label: "נופש שנתי גליל עליון",
    icon: FolderOpen,
    color: "#3b82f6",
  },
  "4830-24": { label: "כנס מכירות Q1", icon: FolderOpen, color: "#3b82f6" },
  "4831-24": {
    label: "יום כיף צוות פיתוח",
    icon: FolderOpen,
    color: "#8b5cf6",
  },
  "4832-24": { label: "אירוע חברה שנתי", icon: FolderOpen, color: "#22c55e" },
  "4833-24": { label: "סדנת גיבוש הנהלה", icon: FolderOpen, color: "#eab308" },
  "1": { label: "הסעות מסיילי הצפון", icon: Bus, color: "#3b82f6" },
  "2": {
    label: "קייטרינג סאמי המזרח",
    icon: UtensilsCrossed,
    color: "#22c55e",
  },
  "3": { label: "ספורט אתגרי בנגב", icon: FolderOpen, color: "#a855f7" },
  "4": { label: "מלון פלאזה - מרכז", icon: FolderOpen, color: "#ec4899" },
  "5": { label: "יקב רמת נפתלי", icon: Grape, color: "#7c3aed" },
  "6": { label: "אוטובוסים הגליל", icon: Bus, color: "#0ea5e9" },
};

interface BreadcrumbItem {
  color: string;
  icon: LucideIcon;
  label: string;
  path: string;
}

export function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") {
    return null;
  }

  const segments = location.pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [
    { label: "דשבורד", path: "/", icon: LayoutDashboard, color: "#ff8c00" },
  ];

  let currentPath = "";
  segments.forEach((segment, idx) => {
    currentPath += `/${segment}`;
    const meta = routeMeta[segment] || entityMeta[segment];
    if (meta) {
      items.push({
        label: meta.label,
        path: currentPath,
        icon: meta.icon,
        color: meta.color,
      });
    } else {
      // For dynamic IDs under known parents, show a friendly label
      const parentSegment = idx > 0 ? segments[idx - 1] : "";
      if (parentSegment === "suppliers") {
        items.push({
          label: "פרטי ספק",
          path: currentPath,
          icon: Users,
          color: "#8b5cf6",
        });
      } else if (parentSegment === "projects") {
        items.push({
          label: "פרטי פרויקט",
          path: currentPath,
          icon: FolderOpen,
          color: "#3b82f6",
        });
      } else {
        items.push({
          label: `#${segment}`,
          path: currentPath,
          icon: FileText,
          color: "#8d785e",
        });
      }
    }
  });

  return (
    <div className="bg-[#f8f7f5] px-4 py-4 lg:px-8">
      <div className="flex items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const Icon = item.icon;

          return (
            <div className="flex items-center gap-2" key={item.path}>
              {/* Separator */}
              {idx > 0 && (
                <ChevronLeft className="mx-0.5 text-[#c4b89a]" size={18} />
              )}

              {isLast ? (
                /* Active (current) crumb */
                <span
                  className="inline-flex items-center gap-2.5 rounded-xl px-4 py-2 text-[15px]"
                  style={{
                    backgroundColor: `${item.color}12`,
                    color: item.color,
                    fontWeight: 600,
                  }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Icon size={18} />
                  </span>
                  {item.label}
                </span>
              ) : (
                /* Clickable parent crumb */
                <button
                  className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[#8d785e] text-[15px] transition-all hover:bg-[#ece8e3]"
                  onClick={() => navigate(item.path)}
                  type="button"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#ece8e3] transition-colors group-hover:bg-[#e0d9ce]">
                    <Icon className="text-[#8d785e]" size={16} />
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
