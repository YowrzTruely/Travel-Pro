import { useAction, useMutation, useQuery } from "convex/react";
import {
  ArrowRight,
  BedDouble,
  Building2,
  Bus,
  Camera,
  Check,
  CheckSquare,
  ChevronDown,
  CircleDot,
  Clock,
  Coins,
  Compass,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileText,
  Info,
  Link,
  Loader2,
  MapPin,
  Music,
  Package,
  Pencil,
  Plus,
  Receipt,
  Save,
  Sparkles,
  Star,
  Trash2,
  User,
  Users,
  UtensilsCrossed,
  Wrench,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { appToast } from "./AppToast";
import { CategoryIcon } from "./CategoryIcons";
import { useConfirmDelete } from "./ConfirmDeleteModal";
import { FormField, rules } from "./FormField";
import { ItemEditor } from "./ItemEditor";
import { SupplierSearch } from "./SupplierSearch";

// ─── Types (previously from api.ts) ───
interface QuoteItem {
  _creationTime: number;
  _id: Id<"quoteItems">;
  alternativeItems?: any[];
  alternatives?: {
    id: string;
    name: string;
    description: string;
    costPerPerson: number;
    selected: boolean;
  }[];
  availabilityStatus?: string;
  cost: number;
  description: string;
  directPrice: number;
  equipmentRequirements?: string[];
  grossTime?: number;
  icon: string;
  id: string;
  images?: { id: string; url: string; name: string }[];
  name: string;
  netTime?: number;
  notes?: string;
  productId?: Id<"supplierProducts">;
  profitWeight: number;
  projectId: Id<"projects">;
  selectedAddons?: { addonId: string; name: string; price: number }[];
  selectedByClient?: boolean;
  sellingPrice: number;
  status: string;
  supplier: string;
  supplierId?: Id<"suppliers">;
  type: string;
}

interface TimelineEvent {
  _creationTime: number;
  _id: Id<"timelineEvents">;
  description: string;
  icon: string;
  id: string;
  projectId: Id<"projects">;
  time: string;
  title: string;
}

// ─── Profit theme system ───
function getProfitTheme(percent: number) {
  if (percent >= 21) {
    return {
      color: "#22c55e",
      lightColor: "#bbf7d0",
      bgTint: "rgba(34, 197, 94, 0.15)",
      glowColor: "rgba(34, 197, 94, 0.35)",
      gradientFrom: "#0f2a1a",
      gradientMid: "#132e1c",
      label: "מצוין!",
      labelBg: "rgba(34, 197, 94, 0.2)",
      iconRotation: -45,
      showShimmer: true,
    };
  }
  if (percent >= 14) {
    return {
      color: "#84cc16",
      lightColor: "#d9f99d",
      bgTint: "rgba(132, 204, 22, 0.12)",
      glowColor: "rgba(132, 204, 22, 0.25)",
      gradientFrom: "#172a10",
      gradientMid: "#1c2e14",
      label: "טוב",
      labelBg: "rgba(132, 204, 22, 0.2)",
      iconRotation: -30,
      showShimmer: false,
    };
  }
  if (percent >= 10) {
    return {
      color: "#ff8c00",
      lightColor: "#ffb74d",
      bgTint: "rgba(255, 140, 0, 0.2)",
      glowColor: "rgba(255, 140, 0, 0.2)",
      gradientFrom: "#2a2010",
      gradientMid: "#2a2518",
      label: "סביר",
      labelBg: "rgba(255, 140, 0, 0.15)",
      iconRotation: 0,
      showShimmer: false,
    };
  }
  return {
    color: "#ef4444",
    lightColor: "#fca5a5",
    bgTint: "rgba(239, 68, 68, 0.2)",
    glowColor: "rgba(239, 68, 68, 0.3)",
    gradientFrom: "#2a1212",
    gradientMid: "#2a1818",
    label: "נמוך",
    labelBg: "rgba(239, 68, 68, 0.2)",
    iconRotation: 45,
    showShimmer: false,
  };
}

// ─── Animated counter hook ───
function useAnimatedCounter(target: number, duration = 800) {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) {
      setValue(target);
      return;
    }

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(start + diff * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevTarget.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

// ─── Icon system ───
const TYPE_ICON_MAP: Record<string, React.ReactNode> = {
  תחבורה: <Bus size={16} />,
  לינה: <BedDouble size={16} />,
  פעילות: <Compass size={16} />,
  "פעילות בוקר": <Compass size={16} />,
  ארוחה: <UtensilsCrossed size={16} />,
  בידור: <Music size={16} />,
  אחר: <Package size={16} />,
};

function getItemIcon(typeOrIcon: string): React.ReactNode {
  if (TYPE_ICON_MAP[typeOrIcon]) {
    return TYPE_ICON_MAP[typeOrIcon];
  }
  // Use CategoryIcon for category name strings (replaces emoji lookup)
  return <CategoryIcon category={typeOrIcon} color="currentColor" size={16} />;
}

function SectionIcon({
  children,
  size = "md",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  return (
    <span
      className={`${dims} flex shrink-0 items-center justify-center rounded-full bg-[#ff8c00] text-white`}
    >
      {children}
    </span>
  );
}

function TypeBadge({
  type,
  iconStr,
  size = "md",
}: {
  type: string;
  iconStr?: string;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = size === "sm" ? 13 : size === "lg" ? 18 : 15;
  const dims =
    size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const lucideIcon = TYPE_ICON_MAP[type];
  return (
    <span
      className={`${dims} flex shrink-0 items-center justify-center rounded-lg bg-[#ff8c00]/10 text-[#ff8c00]`}
    >
      {lucideIcon ? (
        React.cloneElement(lucideIcon as React.ReactElement, { size: iconSize })
      ) : (
        <CategoryIcon
          category={iconStr || type}
          color="#ff8c00"
          size={iconSize}
        />
      )}
    </span>
  );
}

const COMPONENT_TYPES = [
  { label: "תחבורה", type: "תחבורה" },
  { label: "לינה", type: "לינה" },
  { label: "פעילות", type: "פעילות" },
  { label: "ארוחה", type: "ארוחה" },
  { label: "בידור", type: "בידור" },
  { label: "אחר", type: "אחר" },
];

const STATUS_LABELS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  approved: { label: "✓ מאושר", color: "#16a34a", bg: "#f0fdf4" },
  modified: { label: "♦ שונה", color: "#ff8c00", bg: "rgba(255,140,0,0.1)" },
  pending: { label: "● ממתין", color: "#8b5cf6", bg: "#f5f3ff" },
};

const tabs = [
  { id: "components", label: "רכיבים וספקים" },
  { id: "pricing", label: "תמחור ורווח יעד" },
  { id: "timeline", label: 'לו"ז הפעילות' },
];

interface AddItemForm {
  cost: string;
  description: string;
  directPrice: string;
  name: string;
  sellingPrice: string;
  supplier: string;
  type: string;
}

export function QuoteEditor() {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const [activeTab, setActiveTab] = useState("components");

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ─── Convex queries ───
  const project = useQuery(
    api.projects.get,
    projectId ? { id: projectId } : "skip"
  );
  const items = useQuery(
    api.quoteItems.listByProjectId,
    project?._id ? { projectId: project._id } : "skip"
  ) as QuoteItem[] | undefined;
  const timeline = useQuery(
    api.timelineEvents.listByProjectId,
    project?._id ? { projectId: project._id } : "skip"
  ) as TimelineEvent[] | undefined;

  // ─── Convex mutations ───
  const createItem = useMutation(api.quoteItems.create);
  const updateItem = useMutation(api.quoteItems.update);
  const removeItem = useMutation(api.quoteItems.remove);
  const updateProject = useMutation(api.projects.update);
  const generateOpeningParagraph = useAction(
    api.aiSupplier.generateOpeningParagraph
  );

  // Loading: any query still returning undefined
  const loading =
    project === undefined ||
    (project !== null && (items === undefined || timeline === undefined));

  const [saving, setSaving] = useState(false);
  const [tripName, setTripName] = useState(project?.tripName ?? "");
  const [openingParagraph, setOpeningParagraph] = useState(
    project?.openingParagraph ?? ""
  );
  const [generatingParagraph, setGeneratingParagraph] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // Item Editor drawer
  const [editingItem, setEditingItem] = useState<QuoteItem | null>(null);

  const { requestDelete, modal: deleteModal } = useConfirmDelete();

  const [editingDirectPriceId, setEditingDirectPriceId] = useState<
    string | null
  >(null);
  const [editingDirectPriceValue, setEditingDirectPriceValue] = useState("");
  const directPriceInputRef = useRef<HTMLInputElement>(null);

  const [showDirectPriceTooltip, setShowDirectPriceTooltip] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Sync trip name / opening paragraph when project loads
  useEffect(() => {
    if (project?.tripName !== undefined) {
      setTripName(project.tripName ?? "");
    }
    if (project?.openingParagraph !== undefined) {
      setOpeningParagraph(project.openingParagraph ?? "");
    }
  }, [project?.tripName, project?.openingParagraph]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const secId = entry.target.getAttribute("data-section");
            if (secId) {
              setActiveTab(secId);
            }
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  const addForm = useForm<AddItemForm>({
    mode: "onChange",
    defaultValues: {
      type: "",
      name: "",
      supplier: "",
      description: "",
      cost: "",
      directPrice: "",
      sellingPrice: "",
    },
  });

  // ─── Pricing ───
  const currentItems = items ?? [];
  const currentTimeline = timeline ?? [];

  const getSellingPrice = (cost: number, weight: number) => {
    const margin = 0.05 + weight * 0.05;
    return Math.round(cost * (1 + margin));
  };

  const totalCost = currentItems.reduce(
    (sum, item) => sum + (item.cost || 0),
    0
  );
  const totalDirectPrice = currentItems.reduce(
    (sum, item) => sum + (item.directPrice || 0),
    0
  );
  const totalSelling = currentItems.reduce(
    (sum, item) => sum + (item.sellingPrice || 0),
    0
  );
  const totalProfit = totalSelling - totalCost;
  const profitPercent =
    totalSelling > 0 ? Math.round((totalProfit / totalSelling) * 100) : 0;
  const participants = project?.participants || 1;
  const pricePerPerson = Math.round(totalSelling / participants);

  const profitTheme = getProfitTheme(profitPercent);
  const animatedPercent = useAnimatedCounter(profitPercent);
  const animatedTotal = useAnimatedCounter(totalSelling);
  const animatedPPP = useAnimatedCounter(pricePerPerson);

  const totalAddons = currentItems.reduce((sum, item) => {
    if (!item.selectedAddons) {
      return sum;
    }
    return sum + item.selectedAddons.reduce((s, a) => s + a.price, 0);
  }, 0);

  const [equipmentOpen, setEquipmentOpen] = useState(true);

  const aggregatedEquipment = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const item of currentItems) {
      if (!item.equipmentRequirements) {
        continue;
      }
      for (const eq of item.equipmentRequirements) {
        const existing = map.get(eq) || [];
        existing.push(item.name || item.type);
        map.set(eq, existing);
      }
    }
    return map;
  }, [currentItems]);

  const updateProfitWeight = async (item: QuoteItem, newWeight: number) => {
    if (!project?._id) {
      return;
    }
    const newSelling = getSellingPrice(item.cost, newWeight);
    try {
      await updateItem({
        id: item._id,
        profitWeight: newWeight,
        sellingPrice: newSelling,
      });
    } catch (err) {
      console.error("[QuoteEditor] Failed to update weight:", err);
      appToast.error("שגיאה", "לא ניתן לעדכן את משקל הרווח");
    }
  };

  const startEditDirectPrice = (item: QuoteItem) => {
    setEditingDirectPriceId(item.id);
    setEditingDirectPriceValue(String(item.directPrice || ""));
    setTimeout(() => directPriceInputRef.current?.focus(), 50);
  };

  const cancelEditDirectPrice = () => {
    setEditingDirectPriceId(null);
    setEditingDirectPriceValue("");
  };

  const saveDirectPrice = async (item: QuoteItem) => {
    if (!project?._id) {
      return;
    }
    const newPrice = Number.parseFloat(editingDirectPriceValue) || 0;
    if (newPrice === (item.directPrice || 0)) {
      cancelEditDirectPrice();
      return;
    }
    try {
      await updateItem({ id: item._id, directPrice: newPrice });
      appToast.success("תמחור ישיר עודכן", `₪${newPrice.toLocaleString()}`);
    } catch (err) {
      console.error("[QuoteEditor] Failed to update direct price:", err);
      appToast.error("שגיאה", "לא ניתן לעדכן את התמחור הישיר");
    } finally {
      cancelEditDirectPrice();
    }
  };

  const onAddItem = async (data: AddItemForm) => {
    if (!(project?._id && showAddForm)) {
      return;
    }
    try {
      setSaving(true);
      const cost = Number.parseFloat(data.cost) || 0;
      const directPrice =
        Number.parseFloat(data.directPrice) || Math.round(cost * 1.25);
      const sellingPrice =
        Number.parseFloat(data.sellingPrice) || getSellingPrice(cost, 3);
      await createItem({
        projectId: project._id,
        type: showAddForm,
        icon: showAddForm || "אחר",
        name: data.name.trim(),
        supplier: data.supplier.trim(),
        description: data.description.trim(),
        cost,
        directPrice,
        sellingPrice,
        profitWeight: 3,
        status: "pending",
      });
      setShowAddForm(null);
      setShowAddComponent(false);
      addForm.reset();
      appToast.success("רכיב נוסף", `${data.name} נוסף להצעה`);
    } catch (err) {
      console.error("[QuoteEditor] Failed to add item:", err);
      appToast.error("שגיאה", "לא ניתן להוסיף את הרכיב");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!project?._id) {
      return;
    }
    try {
      setDeletingItemId(itemId);
      await removeItem({ id: itemId as Id<"quoteItems"> });
      appToast.success("רכיב הוסר", "הרכיב הוסר מההצעה");
    } catch (err) {
      console.error("[QuoteEditor] Failed to delete item:", err);
      appToast.error("שגיאה", "לא ניתן למחוק את הרכיב");
    } finally {
      setDeletingItemId(null);
    }
  };

  const saveDraft = async () => {
    if (!(projectId && project)) {
      return;
    }
    try {
      setSaving(true);
      const margin =
        totalSelling > 0 ? Math.round((totalProfit / totalSelling) * 100) : 0;
      await updateProject({
        id: projectId,
        totalPrice: totalSelling,
        pricePerPerson,
        profitMargin: margin,
      });
      appToast.success("הטיוטה נשמרה", "מחירים ורווח עודכנו בפרויקט");
    } catch (err) {
      console.error("[QuoteEditor] Failed to save draft:", err);
      appToast.error("שגיאה", "לא ניתן לשמור את הטיוטה");
    } finally {
      setSaving(false);
    }
  };

  // ─── Item editor update handler ───
  // With Convex, the items list auto-updates via the reactive query.
  // We keep this handler for the ItemEditor callback, but it is now
  // essentially a no-op since Convex will push the update through the query.
  // We still sync editingItem so the drawer reflects the latest state.
  const handleItemUpdate = (updated: any) => {
    if (
      editingItem &&
      (editingItem.id === updated.id || editingItem._id === updated._id)
    ) {
      setEditingItem(updated);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="mb-3 animate-spin text-[#ff8c00]" size={32} />
        <p className="text-[#8d785e] text-[14px]">טוען נתוני הצעה...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="mb-4 text-[#8d785e] text-[18px]">פרויקט לא נמצא</p>
        <button
          className="text-[#ff8c00] hover:underline"
          onClick={() => navigate("/projects")}
          type="button"
        >
          חזרה לרשימת הפרויקטים
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 font-['Assistant',sans-serif] lg:p-6" dir="rtl">
      {/* Top bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            className="text-[#8d785e] transition-colors hover:text-[#181510]"
            onClick={() => navigate(-1)}
            type="button"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1
              className="text-[#181510] text-[22px]"
              style={{ fontWeight: 700 }}
            >
              פרויקט: {project.name}
            </h1>
            <p className="text-[#8d785e] text-[12px]">
              מזהה פרויקט: #{projectId} &bull; {project.company}
              {project.quoteVersion != null && (
                <span
                  className="mr-2 rounded-full bg-[#ff8c00]/10 px-2 py-0.5 text-[#ff8c00] text-[11px]"
                  style={{ fontWeight: 600 }}
                >
                  גרסה {project.quoteVersion}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Duplicate version button */}
          <button
            className="flex items-center gap-2 rounded-lg border border-[#e7e1da] px-3 py-2 text-[#6b5d45] text-[13px] transition-colors hover:bg-[#f5f3f0]"
            onClick={async () => {
              if (!(project?._id && projectId)) {
                return;
              }
              try {
                const nextVersion = (project.quoteVersion ?? 1) + 1;
                await updateProject({
                  id: projectId,
                  quoteVersion: nextVersion,
                });
                // Duplicate all quote items
                for (const item of currentItems) {
                  await createItem({
                    projectId: project._id,
                    type: item.type,
                    icon: item.icon,
                    name: item.name,
                    supplier: item.supplier,
                    description: item.description,
                    cost: item.cost,
                    directPrice: item.directPrice,
                    sellingPrice: item.sellingPrice,
                    profitWeight: item.profitWeight,
                    status: "pending",
                  });
                }
                appToast.success(
                  `גרסה ${nextVersion} נוצרה`,
                  `${currentItems.length} רכיבים שוכפלו`
                );
              } catch {
                appToast.error("שגיאה", "לא ניתן לשכפל גרסה");
              }
            }}
            type="button"
          >
            <FileText size={15} />
            שכפל גרסה
          </button>
          <button
            className="flex items-center gap-2 rounded-lg border border-[#e7e1da] px-3 py-2 text-[#6b5d45] text-[13px] transition-colors hover:bg-[#f5f3f0]"
            onClick={() => navigate(`/quote/${projectId}`)}
            type="button"
          >
            <Eye size={15} />
            תצוגה מקדימה ללקוח
          </button>
          <button
            className="flex items-center gap-2 rounded-lg border border-[#e7e1da] px-3 py-2 text-[#6b5d45] text-[13px] transition-colors hover:bg-[#f5f3f0]"
            onClick={() => {
              if (currentItems.length === 0) {
                appToast.warning("אין רכיבים", "הוסף לפחות רכיב אחד להצעה");
              } else {
                appToast.success(
                  "בדיקה הושלמה",
                  "ההצעה תקינה ומוכנה לשליחה ללקוח"
                );
              }
            }}
            type="button"
          >
            <CheckSquare size={15} />
            בדיקה לפני שליחה
          </button>
          <button
            className="flex items-center gap-2 rounded-lg bg-[#ff8c00] px-4 py-2 text-[13px] text-white shadow-sm transition-colors hover:bg-[#e67e00]"
            onClick={() => setShowPreview(true)}
            style={{ fontWeight: 600 }}
            type="button"
          >
            <FileText size={15} />
            צור גרסת הצעה
          </button>
        </div>
      </div>

      {/* Project info cards */}
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "סטטוס",
            value: project.status,
            color: project.statusColor,
            icon: <CircleDot size={13} />,
          },
          {
            label: "חברה",
            value: project.company,
            icon: <Building2 size={13} />,
          },
          {
            label: "משתתפים",
            value: `${project.participants} איש`,
            icon: <Users size={13} />,
          },
          { label: "אזור", value: project.region, icon: <MapPin size={13} /> },
        ].map((card) => (
          <div
            className="rounded-xl border border-[#e7e1da] bg-white p-3.5 text-center"
            key={card.label}
          >
            <div className="mb-1 flex items-center justify-center gap-1.5 text-[#8d785e] text-[11px]">
              <span className="text-[#b8a990]">{card.icon}</span>
              <span>{card.label}</span>
            </div>
            <div
              className="text-[#181510] text-[15px]"
              style={{ fontWeight: 600, color: card.color || "#181510" }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Trip name + Opening paragraph (PRD §4.2) */}
      <div className="mb-4 rounded-xl border border-[#e7e1da] bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <SectionIcon size="sm">
            <FileText size={14} />
          </SectionIcon>
          <span
            className="text-[#181510] text-[14px]"
            style={{ fontWeight: 600 }}
          >
            שם טיול ופסקת פתיחה
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <label
              className="mb-1 block text-[#8d785e] text-[12px]"
              htmlFor="trip-name"
              style={{ fontWeight: 600 }}
            >
              שם הטיול
            </label>
            <input
              className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
              id="trip-name"
              onBlur={async () => {
                if (projectId && tripName !== (project?.tripName ?? "")) {
                  await updateProject({ id: projectId, tripName });
                }
              }}
              onChange={(e) => setTripName(e.target.value)}
              placeholder='למשל: "יום כיף בגליל העליון"'
              value={tripName}
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label
                className="text-[#8d785e] text-[12px]"
                htmlFor="opening-paragraph"
                style={{ fontWeight: 600 }}
              >
                פסקת פתיחה
              </label>
              <button
                className="flex items-center gap-1 rounded-lg bg-gradient-to-l from-[#ff8c00] to-[#e67e00] px-2.5 py-1 text-[11px] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                disabled={generatingParagraph}
                onClick={async () => {
                  setGeneratingParagraph(true);
                  try {
                    const activities = currentItems.map(
                      (i) => i.name || i.type
                    );
                    const result = await generateOpeningParagraph({
                      activities:
                        activities.length > 0 ? activities : ["פעילות"],
                      region: project?.region || undefined,
                      participants: project?.participants || undefined,
                    });
                    setOpeningParagraph(result);
                    if (projectId) {
                      await updateProject({
                        id: projectId,
                        openingParagraph: result,
                      });
                    }
                    appToast.success("פסקת פתיחה נוצרה", "");
                  } catch {
                    appToast.error("שגיאה", "לא ניתן לייצר פסקת פתיחה");
                  } finally {
                    setGeneratingParagraph(false);
                  }
                }}
                style={{ fontWeight: 600 }}
                type="button"
              >
                {generatingParagraph ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                צור עם AI
              </button>
            </div>
            <textarea
              className="w-full resize-none rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[13px] leading-relaxed transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
              id="opening-paragraph"
              onBlur={async () => {
                if (
                  projectId &&
                  openingParagraph !== (project?.openingParagraph ?? "")
                ) {
                  await updateProject({ id: projectId, openingParagraph });
                }
              }}
              onChange={(e) => setOpeningParagraph(e.target.value)}
              placeholder="פסקת פתיחה שיווקית שתופיע בראש ההצעה ללקוח..."
              rows={3}
              value={openingParagraph}
            />
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div
        className="relative mb-5 flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-xl p-4"
        style={{
          background: `linear-gradient(to left, #181510 0%, ${profitTheme.gradientMid} 60%, ${profitTheme.gradientFrom} 100%)`,
          transition: "background 0.8s ease",
          boxShadow: `0 4px 24px ${profitTheme.glowColor}`,
        }}
      >
        {profitTheme.showShimmer && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${profitTheme.glowColor} 50%, transparent 60%)`,
              backgroundSize: "200% 100%",
              animation: "shimmer 3s ease-in-out infinite",
            }}
          />
        )}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-0 w-1/3"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${profitTheme.glowColor} 0%, transparent 70%)`,
            transition: "background 0.8s ease",
          }}
        />
        <style>
          {
            "@keyframes shimmer { 0%,100% { background-position: 200% 0; } 50% { background-position: -200% 0; } }"
          }
        </style>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <User className="text-white/60" size={16} />
            <div className="text-center">
              <div className="text-[#c4b89a] text-[11px]">מחיר לאדם</div>
              <div
                className="text-[22px] text-white"
                style={{ fontWeight: 700 }}
              >
                ₪{animatedPPP.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div className="flex items-center gap-2.5">
            <Receipt className="text-white/60" size={16} />
            <div className="text-center">
              <div className="text-[#c4b89a] text-[11px]">
                מחיר כולל (משוער)
              </div>
              <div
                className="text-[22px] text-white"
                style={{ fontWeight: 700 }}
              >
                ₪{animatedTotal.toLocaleString()}
              </div>
            </div>
          </div>
          {totalAddons > 0 && (
            <>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-[#c4b89a] text-[11px]">תוספות</div>
                <div
                  className="text-[18px] text-white"
                  style={{ fontWeight: 600 }}
                >
                  ₪{totalAddons.toLocaleString()}
                </div>
              </div>
            </>
          )}
        </div>

        <div
          className="relative z-10 flex items-center gap-3 rounded-xl px-4 py-2.5"
          style={{
            backgroundColor: profitTheme.bgTint,
            boxShadow: `inset 0 0 20px ${profitTheme.glowColor}, 0 0 12px ${profitTheme.glowColor}`,
            transition: "all 0.8s ease",
          }}
        >
          <div className="text-center">
            <div
              className="text-[11px]"
              style={{
                color: profitTheme.lightColor,
                transition: "color 0.8s ease",
              }}
            >
              רווח יעד מוערך
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span
                className="text-[22px]"
                style={{
                  fontWeight: 700,
                  color: profitTheme.color,
                  transition: "color 0.8s ease",
                }}
              >
                {animatedPercent}%
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[11px]"
                style={{
                  backgroundColor: profitTheme.labelBg,
                  color: profitTheme.color,
                  fontWeight: 600,
                  transition: "all 0.8s ease",
                }}
              >
                {profitTheme.label}
              </span>
            </div>
          </div>
          <DynamicTrendIcon
            color={profitTheme.color}
            rotation={profitTheme.iconRotation}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-lg bg-[#ece8e3] p-1">
        {tabs.map((tab) => (
          <button
            className={`flex-1 rounded-md px-3 py-2 text-[13px] transition-all ${
              activeTab === tab.id
                ? "bg-white text-[#181510] shadow-sm"
                : "text-[#8d785e] hover:text-[#181510]"
            }`}
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            style={{ fontWeight: 700 }}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ Components Section ═══ */}
      <div
        className="scroll-mt-4 space-y-5"
        data-section="components"
        ref={(el) => {
          sectionRefs.current.components = el;
        }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="flex items-center gap-2 text-[#181510] text-[18px]"
            style={{ fontWeight: 700 }}
          >
            <SectionIcon>
              <Package size={15} />
            </SectionIcon>
            רכיבים וספקים ({currentItems.length})
          </h2>
          <button
            className="flex items-center gap-1 text-[#ff8c00] text-[13px] hover:text-[#e67e00]"
            onClick={() => setShowAddComponent(true)}
            style={{ fontWeight: 600 }}
            type="button"
          >
            <Plus size={14} />
            הוספת רכיב חדש
          </button>
        </div>

        {currentItems.length === 0 && (
          <div className="rounded-xl border border-[#e7e1da] bg-white py-12 text-center">
            <div className="mb-3 flex justify-center">
              <SectionIcon size="lg">
                <Package size={22} />
              </SectionIcon>
            </div>
            <p className="mb-2 text-[#8d785e] text-[16px]">אין רכיבים בהצעה</p>
            <p className="text-[#b8a990] text-[13px]">
              הוסף רכיבים כמו תחבורה, פעילויות, ארוחות ועוד
            </p>
          </div>
        )}

        {currentItems.map((item) => {
          const statusInfo =
            STATUS_LABELS[item.status] || STATUS_LABELS.pending;
          const imageCount = item.images?.length || 0;
          return (
            <div
              className="group/card overflow-hidden rounded-xl border border-[#e7e1da] bg-white transition-shadow hover:shadow-md"
              key={item.id}
            >
              <div className="flex items-center justify-between border-[#e7e1da] border-b bg-[#f5f3f0] p-4">
                <div className="flex items-center gap-2">
                  <SectionIcon size="sm">{getItemIcon(item.type)}</SectionIcon>
                  <span
                    className="text-[#181510] text-[15px]"
                    style={{ fontWeight: 600 }}
                  >
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {imageCount > 0 && (
                    <span className="flex items-center gap-1 rounded-full border border-[#e7e1da] bg-white px-2 py-0.5 text-[#8d785e] text-[11px]">
                      <Camera size={11} />
                      {imageCount}
                    </span>
                  )}
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px]"
                    style={{
                      backgroundColor: statusInfo.bg,
                      color: statusInfo.color,
                      fontWeight: 600,
                    }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TypeBadge iconStr={item.icon} size="lg" type={item.type} />
                    <div>
                      <div
                        className="flex items-center gap-1.5 text-[#181510] text-[15px]"
                        style={{ fontWeight: 600 }}
                      >
                        {item.name || item.supplier}
                      </div>
                      <div className="text-[#8d785e] text-[12px]">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Edit button - always visible */}
                    <button
                      className="flex items-center gap-1.5 rounded-lg bg-[#ff8c00]/10 px-3 py-1.5 text-[#ff8c00] text-[12px] transition-all hover:bg-[#ff8c00] hover:text-white"
                      onClick={() => setEditingItem(item)}
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      <Pencil size={13} />
                      עריכה
                    </button>
                    <button
                      className="text-[#8d785e] transition-colors hover:text-red-500 disabled:opacity-50"
                      disabled={deletingItemId === item.id}
                      onClick={() =>
                        requestDelete({
                          title: "מחיקת רכיב",
                          itemName: item.name || item.supplier,
                          onConfirm: () => deleteItem(item.id),
                        })
                      }
                      type="button"
                    >
                      {deletingItemId === item.id ? (
                        <Loader2 className="animate-spin" size={15} />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                    <div className="text-left">
                      <div className="text-[#8d785e] text-[11px]">עלות</div>
                      <div
                        className="text-[#181510] text-[16px]"
                        style={{ fontWeight: 700 }}
                      >
                        ₪{item.cost.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image preview strip */}
                {imageCount > 0 && (
                  <div className="mt-3 flex gap-2 border-[#f5f3f0] border-t pt-3">
                    {(item.images || []).slice(0, 4).map((img, _idx) => (
                      <div
                        className="h-12 w-16 cursor-pointer overflow-hidden rounded-lg border border-[#e7e1da] transition-all hover:border-[#ff8c00]"
                        key={img.id}
                        onClick={() => setEditingItem(item)}
                      >
                        <img
                          alt={img.name}
                          className="h-full w-full object-cover"
                          height="600"
                          src={img.url}
                          width="800"
                        />
                      </div>
                    ))}
                    {imageCount > 4 && (
                      <div
                        className="flex h-12 w-16 cursor-pointer items-center justify-center rounded-lg border border-[#e7e1da] bg-[#f5f3f0] transition-all hover:border-[#ff8c00]"
                        onClick={() => setEditingItem(item)}
                      >
                        <span
                          className="text-[#8d785e] text-[11px]"
                          style={{ fontWeight: 600 }}
                        >
                          +{imageCount - 4}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Alternatives */}
                {item.alternatives && item.alternatives.length > 0 && (
                  <div className="mt-4 border-[#f5f3f0] border-t pt-3">
                    <div className="mb-3 text-[#8d785e] text-[13px]">
                      חלופות לבחירה:
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {item.alternatives.map((alt) => (
                        <div
                          className={`relative rounded-xl border-2 p-3 transition-all ${
                            alt.selected
                              ? "border-[#ff8c00] bg-[#ff8c00]/5"
                              : "border-[#e7e1da]"
                          }`}
                          key={alt.id}
                        >
                          <div
                            className="text-[#181510] text-[13px]"
                            style={{ fontWeight: 600 }}
                          >
                            {alt.name}
                          </div>
                          <div className="text-[#8d785e] text-[11px]">
                            {alt.description}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[#8d785e] text-[11px]">
                              עלות לאדם
                            </span>
                            <span
                              className="text-[#181510] text-[14px]"
                              style={{ fontWeight: 700 }}
                            >
                              ₪{alt.costPerPerson}
                            </span>
                          </div>
                          {alt.selected && (
                            <div className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff8c00]">
                              <span className="text-[12px] text-white">✓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#e7e1da] border-dashed p-4 text-[#8d785e] transition-all hover:border-[#ff8c00] hover:text-[#ff8c00]"
          onClick={() => setShowAddComponent(true)}
          type="button"
        >
          <Plus size={16} />
          <span className="text-[13px]" style={{ fontWeight: 600 }}>
            הוסף רכיב נוסף (ארוחה, לינה, פעילות...)
          </span>
        </button>
      </div>

      {/* ═══ Pricing Section ═══ */}
      <div
        className="mt-8 scroll-mt-4 space-y-5"
        data-section="pricing"
        ref={(el) => {
          sectionRefs.current.pricing = el;
        }}
      >
        <h2
          className="flex items-center gap-2 text-[#181510] text-[18px]"
          style={{ fontWeight: 700 }}
        >
          <SectionIcon>
            <Coins size={15} />
          </SectionIcon>
          תמחור ורווח יעד
        </h2>

        {currentItems.length === 0 ? (
          <div className="rounded-xl border border-[#e7e1da] bg-white py-12 text-center">
            <p className="text-[#8d785e] text-[16px]">
              הוסף רכיבים כדי לראות תמחור
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#e7e1da] bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-[#e7e1da] border-b bg-[#f5f3f0] text-[#8d785e] text-[12px]">
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>
                    רכיב
                  </th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>
                    <div className="relative flex items-center gap-1">
                      <span>תמחור ישיר</span>
                      <button
                        className="text-[#b8a990] transition-colors hover:text-[#ff8c00]"
                        onClick={() =>
                          setShowDirectPriceTooltip((prev) => !prev)
                        }
                        onMouseEnter={() => setShowDirectPriceTooltip(true)}
                        onMouseLeave={() => setShowDirectPriceTooltip(false)}
                        type="button"
                      >
                        <Info size={13} />
                      </button>
                      {showDirectPriceTooltip && (
                        <div
                          className="absolute top-full right-0 z-10 mt-1 w-52 rounded-lg bg-[#181510] px-3 py-2 text-[11px] text-white shadow-lg"
                          style={{ fontWeight: 400 }}
                        >
                          המחיר שהלקוח היה משלם אם היה פונה ישירות לספק, ללא
                          תיווך. לחץ על מחיר בטבלה כדי לערוך.
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>
                    עלות (ספק)
                  </th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>
                    מחיר מכירה
                  </th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>
                    רווח
                  </th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>
                    משקל רווח
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => {
                  const dp = item.directPrice || 0;
                  const savingsVsDirect = dp > 0 ? dp - item.sellingPrice : 0;
                  return (
                    <tr className="border-[#e7e1da] border-b" key={item.id}>
                      <td
                        className="p-3 text-[14px]"
                        style={{ fontWeight: 500 }}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <span className="text-[#ff8c00]">
                            {getItemIcon(item.type)}
                          </span>
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3">
                        {editingDirectPriceId === item.id ? (
                          <div className="flex items-center gap-1">
                            <div className="relative">
                              <span className="absolute top-1/2 right-2 -translate-y-1/2 text-[#8d785e] text-[12px]">
                                ₪
                              </span>
                              <input
                                className="w-24 rounded-lg border border-[#ff8c00] bg-[#ff8c00]/5 py-1 pr-6 pl-1 text-[#181510] text-[13px] focus:outline-none focus:ring-1 focus:ring-[#ff8c00]"
                                onChange={(e) =>
                                  setEditingDirectPriceValue(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    saveDirectPrice(item);
                                  }
                                  if (e.key === "Escape") {
                                    cancelEditDirectPrice();
                                  }
                                }}
                                ref={directPriceInputRef}
                                style={{ fontWeight: 600 }}
                                type="number"
                                value={editingDirectPriceValue}
                              />
                            </div>
                            <button
                              className="p-0.5 text-green-600 hover:text-green-700"
                              onClick={() => saveDirectPrice(item)}
                              type="button"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              className="p-0.5 text-[#8d785e] hover:text-red-500"
                              onClick={cancelEditDirectPrice}
                              type="button"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="group/dp flex w-full cursor-pointer flex-col items-start gap-0.5 text-right"
                            onClick={() => startEditDirectPrice(item)}
                            type="button"
                          >
                            <span
                              className="text-[#8d785e] text-[14px] transition-colors group-hover/dp:text-[#ff8c00]"
                              style={{ fontWeight: 500 }}
                            >
                              {dp > 0 ? `₪${dp.toLocaleString()}` : "+ הוסף"}
                            </span>
                            {savingsVsDirect > 0 && (
                              <span
                                className="rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] text-green-600"
                                style={{ fontWeight: 600 }}
                              >
                                חיסכון ₪{savingsVsDirect.toLocaleString()}
                              </span>
                            )}
                          </button>
                        )}
                      </td>
                      <td className="p-3 text-[#6b5d45] text-[14px]">
                        ₪{item.cost.toLocaleString()}
                      </td>
                      <td
                        className="p-3 text-[14px]"
                        style={{ fontWeight: 600 }}
                      >
                        ₪{item.sellingPrice.toLocaleString()}
                      </td>
                      <td
                        className="p-3 text-[14px] text-green-600"
                        style={{ fontWeight: 600 }}
                      >
                        ₪{(item.sellingPrice - item.cost).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((w) => (
                            <button
                              className="transition-colors"
                              key={w}
                              onClick={() => updateProfitWeight(item, w)}
                              type="button"
                            >
                              <Star
                                className={
                                  w <= item.profitWeight
                                    ? "text-[#ff8c00]"
                                    : "text-[#ddd6cb]"
                                }
                                fill={
                                  w <= item.profitWeight ? "#ff8c00" : "none"
                                }
                                size={16}
                              />
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-[#181510] text-white">
                  <td className="p-3 text-[14px]" style={{ fontWeight: 600 }}>
                    סה"כ פרויקט
                  </td>
                  <td className="p-3 text-[14px]">
                    {totalDirectPrice > 0 ? (
                      <span>₪{totalDirectPrice.toLocaleString()}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-3 text-[14px]">
                    ₪{totalCost.toLocaleString()}
                  </td>
                  <td className="p-3 text-[14px]" style={{ fontWeight: 700 }}>
                    ₪{totalSelling.toLocaleString()}
                  </td>
                  <td
                    className="p-3 text-[14px] text-green-400"
                    style={{ fontWeight: 700 }}
                  >
                    ₪{totalProfit.toLocaleString()} ({profitPercent}%)
                  </td>
                  <td className="p-3 text-[#c4b89a] text-[14px]">
                    ממוצע:{" "}
                    {currentItems.length > 0
                      ? (
                          currentItems.reduce((s, i) => s + i.profitWeight, 0) /
                          currentItems.length
                        ).toFixed(1)
                      : "0"}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ═══ Equipment Aggregation Section ═══ */}
      {aggregatedEquipment.size > 0 && (
        <div className="mt-8 space-y-3">
          <button
            className="flex w-full items-center justify-between"
            onClick={() => setEquipmentOpen((o) => !o)}
            type="button"
          >
            <h2
              className="flex items-center gap-2 text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              <SectionIcon>
                <Wrench size={15} />
              </SectionIcon>
              ציוד נדרש ({aggregatedEquipment.size})
            </h2>
            <ChevronDown
              className={`text-[#8d785e] transition-transform ${equipmentOpen ? "rotate-180" : ""}`}
              size={18}
            />
          </button>
          {equipmentOpen && (
            <div className="space-y-2 rounded-xl border border-[#e7e1da] bg-white p-4">
              {Array.from(aggregatedEquipment.entries()).map(
                ([eq, activities]: [string, string[]]) => (
                  <div className="flex items-start gap-2 text-[13px]" key={eq}>
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff8c00]" />
                    <div>
                      <span
                        className="text-[#181510]"
                        style={{ fontWeight: 600 }}
                      >
                        {eq}
                      </span>
                      <span className="mr-2 text-[#8d785e]">
                        ({activities.join(", ")})
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ Timeline Section ═══ */}
      <div
        className="mt-8 scroll-mt-4 space-y-5"
        data-section="timeline"
        ref={(el) => {
          sectionRefs.current.timeline = el;
        }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="flex items-center gap-2 text-[#181510] text-[18px]"
            style={{ fontWeight: 700 }}
          >
            <SectionIcon>
              <Clock size={15} />
            </SectionIcon>
            לו"ז הפעילות
          </h2>
          <button
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] transition-all ${
              project?.timelineHidden
                ? "border-[#ff8c00] bg-[#ff8c00]/10 text-[#ff8c00]"
                : "border-[#e7e1da] text-[#8d785e] hover:border-[#ff8c00] hover:text-[#ff8c00]"
            }`}
            onClick={async () => {
              if (!projectId) {
                return;
              }
              try {
                await updateProject({
                  id: projectId,
                  timelineHidden: !project?.timelineHidden,
                });
                appToast.success(
                  project?.timelineHidden
                    ? 'לו"ז יוצג ללקוח'
                    : 'לו"ז הוסתר מהלקוח'
                );
              } catch {
                appToast.error("שגיאה", "לא ניתן לעדכן");
              }
            }}
            style={{ fontWeight: 600 }}
            type="button"
          >
            {project?.timelineHidden ? <EyeOff size={13} /> : <Eye size={13} />}
            {project?.timelineHidden ? "מוסתר מהלקוח" : "הסתר מהלקוח"}
          </button>
        </div>

        {currentTimeline.length === 0 ? (
          <div className="rounded-xl border border-[#e7e1da] bg-white py-12 text-center">
            <div className="mb-3 flex justify-center">
              <SectionIcon size="lg">
                <Clock size={22} />
              </SectionIcon>
            </div>
            <p className="text-[#8d785e] text-[16px]">
              אין אירועי לו"ז לפרויקט זה
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#e7e1da] bg-white p-5">
            <div className="space-y-0">
              {currentTimeline.map((event, idx) => (
                <div className="flex gap-4" key={event.id}>
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff8c00]/10 text-[#b8a990]">
                      {getItemIcon(event.icon)}
                    </div>
                    {idx < currentTimeline.length - 1 && (
                      <div className="my-1 w-0.5 flex-1 bg-[#e7e1da]" />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="text-[#181510] text-[14px]"
                        style={{ fontWeight: 700 }}
                      >
                        {event.time}
                      </span>
                      <span
                        className="text-[#181510] text-[14px]"
                        style={{ fontWeight: 600 }}
                      >
                        &bull; {event.title}
                      </span>
                    </div>
                    <p className="text-[#8d785e] text-[13px]">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spacer for mobile fixed bottom bar */}
      <div className="h-16 md:h-0" />

      {/* Bottom sticky action bar */}
      <div className="fixed right-0 bottom-0 left-0 z-30 mt-8 flex flex-wrap items-center gap-2 border-[#e7e1da] border-t bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md md:sticky md:rounded-xl md:border">
        <button
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#ff8c00] px-5 py-2.5 text-[13px] text-white shadow-sm transition-colors hover:bg-[#e67e00]"
          onClick={() => {
            const url = `${window.location.origin}/quote/${projectId}`;
            navigator.clipboard.writeText(url);
            appToast.success("קישור הועתק", url);
          }}
          style={{ fontWeight: 600 }}
          type="button"
        >
          <Link size={15} />
          שלח הצעה ללקוח
        </button>
        <button
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#181510] px-5 py-2.5 text-[13px] text-white transition-colors hover:bg-[#2a2518] disabled:opacity-50"
          disabled={saving}
          onClick={saveDraft}
          style={{ fontWeight: 600 }}
          type="button"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={15} />
          ) : (
            <Save size={15} />
          )}
          {saving ? "שומר..." : "שמור טיוטה"}
        </button>
        <button
          className="flex min-h-[44px] items-center gap-2 rounded-xl border border-[#e7e1da] px-4 py-2.5 text-[#6b5d45] text-[13px] transition-colors hover:bg-[#f5f3f0]"
          onClick={() => {
            const printWin = window.open("", "_blank");
            if (!printWin) {
              appToast.error("חלון הדפסה נחסם");
              return;
            }
            const rows = currentItems
              .map(
                (i) =>
                  `<tr><td style="padding:10px;border-bottom:1px solid #e7e1da">${i.type}</td><td style="padding:10px;border-bottom:1px solid #e7e1da">${i.name}</td><td style="padding:10px;border-bottom:1px solid #e7e1da">${i.supplier || "-"}</td><td style="padding:10px;border-bottom:1px solid #e7e1da;font-weight:600">₪${i.sellingPrice.toLocaleString()}</td></tr>`
              )
              .join("");
            const tlRows = currentTimeline
              .map(
                (e) =>
                  `<div style="display:flex;gap:12px;margin-bottom:12px"><div style="width:40px;text-align:center;font-weight:700;color:#ff8c00">${e.time}</div><div><b>${e.title}</b><br/><span style="color:#8d785e;font-size:13px">${e.description}</span></div></div>`
              )
              .join("");
            printWin.document.write(
              `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title>הצעת מחיר — ${project?.name || ""}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Assistant,Helvetica,Arial,sans-serif;color:#181510;padding:40px;max-width:800px;margin:0 auto}h1{font-size:24px;margin-bottom:4px}h2{font-size:18px;margin:24px 0 12px;border-bottom:2px solid #ff8c00;padding-bottom:6px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th{text-align:right;padding:10px;background:#f5f3f0;border-bottom:2px solid #e7e1da;font-size:13px}.summary{display:flex;gap:24px;background:#f8f7f5;padding:16px;border-radius:12px;margin:16px 0}.summary div{text-align:center}.summary .value{font-size:22px;font-weight:700}.summary .label{font-size:12px;color:#8d785e}@media print{body{padding:20px}}</style></head><body><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px"><div><h1>הצעת מחיר</h1><p style="color:#8d785e;font-size:14px">${project?.name} — ${project?.company || ""}</p></div><div style="text-align:left"><p style="font-size:13px;color:#8d785e">מזהה: #${projectId}</p><p style="font-size:13px;color:#8d785e">${new Date().toLocaleDateString("he-IL")}</p></div></div><div class="summary"><div><div class="label">משתתפים</div><div class="value">${participants}</div></div><div><div class="label">מחיר לאדם</div><div class="value">₪${pricePerPerson.toLocaleString()}</div></div><div><div class="label">סה"כ</div><div class="value">₪${totalSelling.toLocaleString()}</div></div><div><div class="label">אזור</div><div class="value">${project?.region || ""}</div></div></div><h2>פירוט רכיבים</h2><table><thead><tr><th>סוג</th><th>רכיב</th><th>ספק</th><th>מחיר</th></tr></thead><tbody>${rows}</tbody><tfoot><tr style="background:#181510;color:white"><td colspan="3" style="padding:10px;font-weight:600">סה"כ</td><td style="padding:10px;font-weight:700">₪${totalSelling.toLocaleString()}</td></tr></tfoot></table>${tlRows ? `<h2>לו"ז הפעילות</h2>${tlRows}` : ""}<div style="margin-top:40px;text-align:center;color:#b8a990;font-size:12px"><p>הופק ע"י TravelPro &bull; ${new Date().toLocaleDateString("he-IL")}</p></div></body></html>`
            );
            printWin.document.close();
            setTimeout(() => {
              printWin.print();
            }, 500);
            appToast.success("PDF מוכן", 'חלון ההדפסה נפתח — בחר "שמור כ-PDF"');
          }}
          type="button"
        >
          <Download size={15} />
          ייצא PDF
        </button>
        <button
          className="flex items-center gap-2 rounded-xl border border-[#e7e1da] px-4 py-2.5 text-[#6b5d45] text-[13px] transition-colors hover:bg-[#f5f3f0]"
          onClick={() => {
            const url = `${window.location.origin}/quote/${projectId}?mode=noPrices`;
            navigator.clipboard.writeText(url);
            appToast.success("קישור ללא מחירים הועתק", url);
          }}
          type="button"
        >
          <Copy size={15} />
          שתף ללא מחירים
        </button>
      </div>

      {/* ═══ Create version modal ═══ */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowPreview(false)}
          onKeyDown={(e) => e.key === "Escape" && e.currentTarget.click()}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <h3
              className="mb-3 text-[#181510] text-[20px]"
              style={{ fontWeight: 700 }}
            >
              יצירת גרסת הצעה
            </h3>
            <p className="mb-4 text-[#8d785e] text-[14px]">
              הגרסה הנוכחית תינעל ויווצר קישור לשליחה ללקוח.
            </p>
            <div className="mb-4 rounded-xl bg-[#f5f3f0] p-4">
              <div className="mb-2 flex justify-between text-[13px]">
                <span className="text-[#8d785e]">גרסה:</span>
                <span className="text-[#181510]" style={{ fontWeight: 600 }}>
                  V1.0
                </span>
              </div>
              <div className="mb-2 flex justify-between text-[13px]">
                <span className="text-[#8d785e]">רכיבים:</span>
                <span className="text-[#181510]" style={{ fontWeight: 600 }}>
                  {currentItems.length}
                </span>
              </div>
              <div className="mb-2 flex justify-between text-[13px]">
                <span className="text-[#8d785e]">סה"כ:</span>
                <span className="text-[#181510]" style={{ fontWeight: 600 }}>
                  ₪{totalSelling.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#8d785e]">רווחיות:</span>
                <span className="text-green-600" style={{ fontWeight: 600 }}>
                  {profitPercent}%
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 rounded-xl bg-[#ff8c00] py-2.5 text-white transition-colors hover:bg-[#e67e00]"
                onClick={async () => {
                  await saveDraft();
                  setShowPreview(false);
                  appToast.success(
                    "גרסת הצעה V1.0 נוצרה בהצלחה!",
                    "מעביר לתצוגת לקוח..."
                  );
                  setTimeout(() => navigate(`/quote/${projectId}`), 1200);
                }}
                style={{ fontWeight: 600 }}
                type="button"
              >
                צור ושלח ללקוח
              </button>
              <button
                className="rounded-xl border border-[#e7e1da] px-5 transition-colors hover:bg-[#f5f3f0]"
                onClick={() => setShowPreview(false)}
                type="button"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Add component modal ═══ */}
      {showAddComponent && !showAddForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowAddComponent(false)}
          onKeyDown={(e) => e.key === "Escape" && e.currentTarget.click()}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <h3
              className="mb-4 text-[#181510] text-[20px]"
              style={{ fontWeight: 700 }}
            >
              הוספת רכיב חדש
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {COMPONENT_TYPES.map((ct) => (
                <button
                  className="flex items-center gap-3 rounded-xl border border-[#e7e1da] p-3 transition-all hover:border-[#ff8c00] hover:bg-[#ff8c00]/5"
                  key={ct.type}
                  onClick={() => {
                    setShowAddForm(ct.type);
                    addForm.setValue("type", ct.type);
                  }}
                  type="button"
                >
                  <TypeBadge size="md" type={ct.type} />
                  <span
                    className="text-[#181510] text-[14px]"
                    style={{ fontWeight: 500 }}
                  >
                    {ct.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Add component form ═══ */}
      {showAddForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setShowAddForm(null);
            addForm.reset();
          }}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <h3
              className="mb-4 text-[#181510] text-[20px]"
              style={{ fontWeight: 700 }}
            >
              הוספת {showAddForm} להצעה
            </h3>
            <form
              className="space-y-4"
              onSubmit={addForm.handleSubmit(onAddItem)}
            >
              <FormField
                error={addForm.formState.errors.name}
                isDirty={addForm.formState.dirtyFields.name}
                label="שם רכיב"
                placeholder="למשל: אוטובוס מפואר"
                required
                {...addForm.register("name", rules.requiredMin("שם רכיב", 2))}
              />
              <SupplierSearch
                onChange={(name) =>
                  addForm.setValue("supplier", name, { shouldDirty: true })
                }
                value={addForm.watch("supplier")}
              />
              <FormField
                error={addForm.formState.errors.description}
                isDirty={addForm.formState.dirtyFields.description}
                label="תיאור"
                placeholder="פרטים נוספים..."
                {...addForm.register("description")}
              />
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  error={addForm.formState.errors.cost}
                  isDirty={addForm.formState.dirtyFields.cost}
                  label="עלות (ספק)"
                  placeholder="₪"
                  required
                  type="number"
                  {...addForm.register("cost", rules.positivePrice("עלות"))}
                />
                <FormField
                  error={addForm.formState.errors.directPrice}
                  isDirty={addForm.formState.dirtyFields.directPrice}
                  label="תמחור ישיר"
                  placeholder="₪ (מחיר ללקוח ישיר)"
                  type="number"
                  {...addForm.register("directPrice")}
                />
                <FormField
                  error={addForm.formState.errors.sellingPrice}
                  isDirty={addForm.formState.dirtyFields.sellingPrice}
                  label="מחיר מכירה"
                  placeholder="₪ (אוטומטי אם ריק)"
                  type="number"
                  {...addForm.register("sellingPrice")}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-2.5 text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
                  disabled={saving || !addForm.formState.isValid}
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                  {saving ? "מוסיף..." : "הוסף רכיב"}
                </button>
                <button
                  className="rounded-xl border border-[#e7e1da] px-5 transition-colors hover:bg-[#f5f3f0]"
                  onClick={() => {
                    setShowAddForm(null);
                    addForm.reset();
                  }}
                  type="button"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Item Editor Drawer ═══ */}
      {editingItem && projectId && (
        <ItemEditor
          isOpen={!!editingItem}
          item={editingItem as any}
          onClose={() => setEditingItem(null)}
          onUpdate={handleItemUpdate}
          participants={participants}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteModal}
    </div>
  );
}

function DynamicTrendIcon({
  color,
  rotation,
}: {
  color: string;
  rotation: number;
}) {
  return (
    <svg
      fill="none"
      height="24"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.8s ease, stroke 0.8s ease",
        filter: `drop-shadow(0 0 6px ${color})`,
      }}
      viewBox="0 0 24 24"
      width="24"
    >
      <title>Decorative icon</title>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
