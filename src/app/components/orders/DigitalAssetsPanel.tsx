import { useQuery } from "convex/react";
import {
  Camera,
  Clock,
  FileText,
  Loader2,
  Map as MapIcon,
  Star,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { SaveTheDate } from "../gallery/SaveTheDate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  generateClientTripFile,
  generateDriverTripFile,
  generateEquipmentPdf,
  generateQuotePdf,
} from "../utils/pdfGenerator";

export function DigitalAssetsPanel({
  projectId,
}: {
  projectId: Id<"projects">;
}) {
  const project = useQuery(api.projects.get, { id: projectId });
  const items = useQuery(api.quoteItems.listByProjectId, { projectId });
  const timeline = useQuery(api.timelineEvents.listByProjectId, { projectId });

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showSaveTheDate, setShowSaveTheDate] = useState(false);

  const galleryUrl = `/gallery/${projectId}`;
  const ratingsUrl = `/rate/${projectId}`;

  async function handlePdfAction(actionName: string, generator: () => void) {
    setLoadingAction(actionName);
    try {
      generator();
      appToast.success("PDF הופק בהצלחה", "הקובץ הורד למחשב");
    } catch {
      appToast.error("שגיאה בהפקת המסמך");
    } finally {
      setLoadingAction(null);
    }
  }

  const pdfProject = project
    ? {
        name: project.name,
        client: project.client ?? undefined,
        company: project.company ?? undefined,
        region: project.region ?? undefined,
        date: project.date ?? undefined,
        participants: project.participants,
        totalPrice: project.totalPrice,
        pricePerPerson: project.pricePerPerson,
        tripName: project.tripName ?? undefined,
        openingParagraph: project.openingParagraph ?? undefined,
      }
    : null;

  const pdfItems = (items || []).map(
    (item: {
      type?: string | null;
      name: string;
      supplier?: string | null;
      description?: string | null;
      sellingPrice: number;
      cost: number;
      equipmentRequirements?: string[] | null;
      grossTime?: number | null;
      netTime?: number | null;
    }) => ({
      type: item.type ?? undefined,
      name: item.name,
      supplier: item.supplier ?? undefined,
      description: item.description ?? undefined,
      sellingPrice: item.sellingPrice,
      cost: item.cost,
      equipmentRequirements: item.equipmentRequirements ?? undefined,
      grossTime: item.grossTime ?? undefined,
      netTime: item.netTime ?? undefined,
    })
  );

  const pdfTimeline = (timeline || []).map(
    (event: { time: string; title: string; description?: string | null }) => ({
      time: event.time,
      title: event.title,
      description: event.description ?? undefined,
    })
  );

  const pdfActions = [
    {
      id: "quote",
      label: "הצעת מחיר PDF",
      description: "מסמך ממותג ללקוח",
      icon: <FileText size={18} />,
      action: () =>
        handlePdfAction("quote", () => {
          if (!pdfProject) {
            return;
          }
          generateQuotePdf(pdfProject, pdfItems, pdfTimeline);
        }),
    },
    {
      id: "equipment",
      label: "רשימת ציוד PDF",
      description: "רשימת כל הציוד הנדרש",
      icon: <Wrench size={18} />,
      action: () =>
        handlePdfAction("equipment", () => {
          if (!pdfProject) {
            return;
          }
          generateEquipmentPdf(pdfProject, pdfItems);
        }),
    },
    {
      id: "driver",
      label: "קובץ נהג",
      description: "מסלול וכתובות לנהג",
      icon: <Truck size={18} />,
      action: () =>
        handlePdfAction("driver", () => {
          if (!pdfProject) {
            return;
          }
          generateDriverTripFile(pdfProject, pdfItems, pdfTimeline, true);
        }),
    },
    {
      id: "client",
      label: "קובץ לקוח",
      description: "לוח זמנים ופרטים ללקוח",
      icon: <MapIcon size={18} />,
      action: () =>
        handlePdfAction("client", () => {
          if (!pdfProject) {
            return;
          }
          generateClientTripFile(pdfProject, pdfItems, pdfTimeline);
        }),
    },
  ];

  const digitalLinks = [
    {
      id: "gallery",
      label: "גלריית אירוע",
      description: "תמונות וסרטונים מהאירוע",
      icon: <Camera size={18} />,
      href: galleryUrl,
    },
    {
      id: "ratings",
      label: "דירוג פעילויות",
      description: "טופס דירוג למשתתפים",
      icon: <Star size={18} />,
      href: ratingsUrl,
    },
  ];

  const comingSoon = [
    {
      id: "b2c-lead",
      label: "B2C Lead Capture",
      description: "דף נחיתה ללידים",
      icon: <Users size={18} />,
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <h2
        className="flex items-center gap-2 text-[#181510] text-[18px]"
        style={{ fontWeight: 700 }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff8c00]/10">
          <FileText className="text-[#ff8c00]" size={15} />
        </div>
        נכסים דיגיטליים
      </h2>

      {/* PDF Actions */}
      <div>
        <h3
          className="mb-3 text-[#8d785e] text-[13px]"
          style={{ fontWeight: 600 }}
        >
          מסמכים
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {pdfActions.map((item) => (
            <button
              className="flex items-center gap-3 rounded-xl border border-[#e7e1da] bg-white p-4 text-right transition-colors hover:bg-[#f8f7f5] disabled:opacity-50"
              disabled={loadingAction === item.id || !project}
              key={item.id}
              onClick={item.action}
              type="button"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                {loadingAction === item.id ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  item.icon
                )}
              </div>
              <div className="min-w-0">
                <div
                  className="text-[#181510] text-[14px]"
                  style={{ fontWeight: 600 }}
                >
                  {item.label}
                </div>
                <div className="text-[#8d785e] text-[12px]">
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Digital Links */}
      <div>
        <h3
          className="mb-3 text-[#8d785e] text-[13px]"
          style={{ fontWeight: 600 }}
        >
          דפים ציבוריים
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {digitalLinks.map((item) => (
            <a
              className="flex items-center gap-3 rounded-xl border border-[#e7e1da] bg-white p-4 text-right transition-colors hover:bg-[#f8f7f5]"
              href={item.href}
              key={item.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8c00]/10 text-[#ff8c00]">
                {item.icon}
              </div>
              <div className="min-w-0">
                <div
                  className="text-[#181510] text-[14px]"
                  style={{ fontWeight: 600 }}
                >
                  {item.label}
                </div>
                <div className="text-[#8d785e] text-[12px]">
                  {item.description}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Save the Date */}
      <div>
        <h3
          className="mb-3 text-[#8d785e] text-[13px]"
          style={{ fontWeight: 600 }}
        >
          הזמנות
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            className="flex items-center gap-3 rounded-xl border border-[#e7e1da] bg-white p-4 text-right transition-colors hover:bg-[#f8f7f5]"
            onClick={() => setShowSaveTheDate(true)}
            type="button"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff8c00]/10 text-[#ff8c00]">
              <Clock size={18} />
            </div>
            <div className="min-w-0">
              <div
                className="text-[#181510] text-[14px]"
                style={{ fontWeight: 600 }}
              >
                Save the Date
              </div>
              <div className="text-[#8d785e] text-[12px]">
                הזמנה דיגיטלית לאירוע
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Save the Date Dialog */}
      <Dialog onOpenChange={setShowSaveTheDate} open={showSaveTheDate}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>Save the Date</DialogTitle>
            <DialogDescription>תצוגה מקדימה של ההזמנה</DialogDescription>
          </DialogHeader>
          <SaveTheDate
            date={project?.date || "תאריך לא נקבע"}
            participants={project?.participants}
            region={project?.region}
            tripName={project?.tripName || project?.name || ""}
          />
        </DialogContent>
      </Dialog>

      {/* Coming Soon */}
      <div>
        <h3
          className="mb-3 text-[#8d785e] text-[13px]"
          style={{ fontWeight: 600 }}
        >
          בקרוב
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {comingSoon.map((item) => (
            <div
              className="flex items-center gap-3 rounded-xl border border-[#e7e1da] border-dashed bg-[#f8f7f5] p-4 opacity-60"
              key={item.id}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e7e1da]/50 text-[#8d785e]">
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[#181510] text-[14px]"
                    style={{ fontWeight: 600 }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="rounded-full bg-[#ff8c00]/10 px-2 py-0.5 text-[#ff8c00] text-[10px]"
                    style={{ fontWeight: 700 }}
                  >
                    בקרוב
                  </span>
                </div>
                <div className="text-[#8d785e] text-[12px]">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
