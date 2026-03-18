import { useQuery } from "convex/react";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Box,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ClipboardList,
  Eye,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MapPin,
  ScanLine,
  Settings,
  Shield,
  Star,
  Tag,
  Target,
  UserCircle,
  Users,
  Wand2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

interface RouteInfo {
  color: string;
  icon: LucideIcon;
  label: string;
}

const routeMeta: Record<string, RouteInfo> = {
  // Shared
  "": { label: "דשבורד", icon: LayoutDashboard, color: "#ff8c00" },
  settings: { label: "הגדרות", icon: Settings, color: "#6b7280" },
  // Producer
  projects: { label: "פרויקטים", icon: FolderOpen, color: "#3b82f6" },
  suppliers: { label: "בנק ספקים", icon: Users, color: "#8b5cf6" },
  import: { label: "ייבוא ספקים", icon: FileSpreadsheet, color: "#22c55e" },
  classify: { label: "אשף סיווג", icon: Wand2, color: "#ec4899" },
  scan: { label: "סריקת מוצרים", icon: ScanLine, color: "#14b8a6" },
  archive: { label: "ארכיון", icon: Archive, color: "#94a3b8" },
  calendar: { label: "יומן", icon: Calendar, color: "#f59e0b" },
  clients: { label: "לקוחות", icon: UserCircle, color: "#06b6d4" },
  documents: { label: "מסמכים", icon: FileText, color: "#8d785e" },
  crm: { label: "ניהול לידים", icon: Target, color: "#ef4444" },
  field: { label: 'חמ"ל שטח', icon: MapPin, color: "#16a34a" },
  quote: { label: "תצוגת לקוח", icon: FileText, color: "#ff8c00" },
  // Supplier
  products: { label: "מוצרים", icon: Box, color: "#8b5cf6" },
  profile: { label: "פרופיל", icon: UserCircle, color: "#3b82f6" },
  availability: { label: "זמינות", icon: Calendar, color: "#f59e0b" },
  requests: { label: "בקשות", icon: ClipboardList, color: "#ff8c00" },
  ratings: { label: "דירוגים", icon: Star, color: "#eab308" },
  promotions: { label: "מבצעים", icon: Tag, color: "#ec4899" },
  preview: { label: "תצוגה מקדימה", icon: Eye, color: "#6b7280" },
  // Admin
  "approve-suppliers": {
    label: "אישור ספקים",
    icon: CheckCircle,
    color: "#22c55e",
  },
  users: { label: "משתמשים", icon: Users, color: "#3b82f6" },
  activity: { label: "יומן פעילות", icon: Shield, color: "#8b5cf6" },
};

/** Labels for dynamic ID segments based on their parent route */
const parentLabels: Record<
  string,
  { label: string; icon: LucideIcon; color: string }
> = {
  projects: { label: "פרטי פרויקט", icon: FolderOpen, color: "#3b82f6" },
  suppliers: { label: "פרטי ספק", icon: Users, color: "#8b5cf6" },
  crm: { label: "פרטי ליד", icon: Target, color: "#ef4444" },
  clients: { label: "פרטי לקוח", icon: UserCircle, color: "#06b6d4" },
  field: { label: 'חמ"ל שטח', icon: MapPin, color: "#16a34a" },
  quote: { label: "תצוגת לקוח", icon: FileText, color: "#ff8c00" },
  products: { label: "פרטי מוצר", icon: Box, color: "#8b5cf6" },
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
  const segments = location.pathname.split("/").filter(Boolean);

  // Determine which dynamic entity to resolve
  const projectSegment =
    segments[0] === "projects"
      ? segments[1]
      : segments[0] === "field"
        ? segments[1]
        : undefined;
  const supplierSegment = segments[0] === "suppliers" ? segments[1] : undefined;
  const leadSegment = segments[0] === "crm" ? segments[1] : undefined;
  const productSegment = segments[0] === "products" ? segments[1] : undefined;

  // Only query when we have a dynamic segment to resolve
  const project = useQuery(
    api.projects.get,
    projectSegment && !routeMeta[projectSegment]
      ? { id: projectSegment }
      : "skip"
  );
  const supplier = useQuery(
    api.suppliers.get,
    supplierSegment && !routeMeta[supplierSegment]
      ? { id: supplierSegment as Id<"suppliers"> }
      : "skip"
  );
  const lead = useQuery(
    api.leads.get,
    leadSegment && !routeMeta[leadSegment]
      ? { id: leadSegment as Id<"leads"> }
      : "skip"
  );
  const supplierProduct = useQuery(
    api.supplierProducts.get,
    productSegment && productSegment !== "new" && !routeMeta[productSegment]
      ? { id: productSegment as Id<"supplierProducts"> }
      : "skip"
  );

  if (location.pathname === "/") {
    return null;
  }

  // Map dynamic IDs to resolved names
  const resolvedNames: Record<string, string> = {};
  if (projectSegment && project?.name) {
    resolvedNames[projectSegment] = project.name;
  }
  if (supplierSegment && supplier?.name) {
    resolvedNames[supplierSegment] = supplier.name;
  }
  if (leadSegment && lead?.name) {
    resolvedNames[leadSegment] = lead.name;
  }
  if (productSegment === "new") {
    resolvedNames[productSegment] = "מוצר חדש";
  } else if (productSegment && supplierProduct?.name) {
    resolvedNames[productSegment] = supplierProduct.name;
  }

  const items: BreadcrumbItem[] = [
    { label: "דשבורד", path: "/", icon: LayoutDashboard, color: "#ff8c00" },
  ];

  let currentPath = "";
  segments.forEach((segment, idx) => {
    currentPath += `/${segment}`;
    const meta = routeMeta[segment];
    if (meta) {
      items.push({
        label: meta.label,
        path: currentPath,
        icon: meta.icon,
        color: meta.color,
      });
    } else {
      const parentSegment = idx > 0 ? segments[idx - 1] : "";
      const parentInfo = parentLabels[parentSegment];
      const resolvedName = resolvedNames[segment];
      items.push({
        label: resolvedName || parentInfo?.label || "פרטים",
        path: currentPath,
        icon: parentInfo?.icon || FileText,
        color: parentInfo?.color || "#8d785e",
      });
    }
  });

  return (
    <div className="bg-background px-4 py-4 lg:px-8">
      <div className="flex items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const Icon = item.icon;

          return (
            <div className="flex items-center gap-2" key={item.path}>
              {/* Separator */}
              {idx > 0 && (
                <ChevronLeft className="mx-0.5 text-tertiary" size={18} />
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
                  className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[15px] text-muted-foreground transition-all hover:bg-accent"
                  onClick={() => navigate(item.path)}
                  type="button"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent transition-colors group-hover:bg-accent">
                    <Icon className="text-muted-foreground" size={16} />
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
