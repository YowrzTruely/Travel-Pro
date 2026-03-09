import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { LeadCard } from "./LeadCard";
import { LossReasonModal } from "./LossReasonModal";
import { NewLeadModal } from "./NewLeadModal";

const STATUSES = [
  { key: "new", label: "חדש", color: "#3b82f6" },
  { key: "first_contact", label: "יצירת קשר", color: "#8b5cf6" },
  { key: "needs_assessment", label: "בירור צרכים", color: "#f59e0b" },
  { key: "building_plan", label: "בניית תוכנית", color: "#f97316" },
  { key: "quote_sent", label: "הצעה נשלחה", color: "#6366f1" },
  { key: "approved", label: "אושר", color: "#22c55e" },
  { key: "closed_won", label: "נסגר-זכייה", color: "#10b981" },
  { key: "closed_lost", label: "נסגר-הפסד", color: "#ef4444" },
] as const;

type StatusKey = (typeof STATUSES)[number]["key"];

export function LeadsPage() {
  const leads = useQuery(api.leads.listByStatus);
  const stats = useQuery(api.leads.stats);
  const updateStatus = useMutation(api.leads.updateStatus);
  const convertToProject = useMutation(api.leads.convertToProject);

  const [showNewLead, setShowNewLead] = useState(false);
  const [lossModal, setLossModal] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const groupedLeads = useCallback(() => {
    if (!leads) {
      return {};
    }
    const groups: Record<string, typeof leads> = {};
    for (const status of STATUSES) {
      groups[status.key] = [];
    }
    for (const lead of leads) {
      if (groups[lead.status]) {
        groups[lead.status].push(lead);
      }
    }
    return groups;
  }, [leads]);

  const handleDrop = async (targetStatus: StatusKey, leadId: string) => {
    setDragOverCol(null);
    if (!leads) {
      return;
    }
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === targetStatus) {
      return;
    }

    if (targetStatus === "closed_lost") {
      setLossModal({ id: leadId, name: lead.name });
      return;
    }

    if (targetStatus === "closed_won") {
      try {
        await convertToProject({ id: leadId as Id<"leads"> });
        appToast.success("ליד הומר לפרויקט!", "הלקוח והפרויקט נוצרו בהצלחה");
      } catch (err) {
        console.error("[LeadsPage] Convert failed:", err);
        appToast.error("שגיאה בהמרה", String(err));
      }
      return;
    }

    try {
      await updateStatus({ id: leadId as Id<"leads">, status: targetStatus });
    } catch (err) {
      console.error("[LeadsPage] Status update failed:", err);
      appToast.error("שגיאה בעדכון סטטוס", String(err));
    }
  };

  const handleLossConfirm = async (
    reason: "expensive" | "competitor" | "disappeared" | "other",
    notes?: string
  ) => {
    if (!lossModal) {
      return;
    }
    try {
      await updateStatus({
        id: lossModal.id as Id<"leads">,
        status: "closed_lost",
        lossReason: reason,
        lossReasonNotes: notes,
      });
      appToast.info("ליד נסגר כהפסד");
      setLossModal(null);
    } catch (err) {
      console.error("[LeadsPage] Loss reason failed:", err);
      appToast.error("שגיאה בעדכון", String(err));
    }
  };

  const groups = groupedLeads();

  return (
    <div className="p-4 lg:p-8" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[#181510] text-[28px]" style={{ fontWeight: 700 }}>
          ניהול לידים
        </h1>
        <button
          className="flex items-center gap-2 rounded-lg bg-[#ff8c00] px-4 py-2.5 text-white transition-colors hover:bg-[#e67e00]"
          onClick={() => setShowNewLead(true)}
          style={{ fontWeight: 600 }}
          type="button"
        >
          <Plus size={18} />
          ליד חדש
        </button>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => {
          const colLeads = groups[status.key] || [];
          const count = stats?.[status.key] ?? colLeads.length;
          const isOver = dragOverCol === status.key;

          return (
            <div
              className={`flex w-[260px] min-w-[260px] flex-col rounded-xl border transition-colors ${
                isOver
                  ? "border-[#ff8c00] bg-[rgba(255,140,0,0.05)]"
                  : "border-[#e7e1da] bg-[#f8f7f5]"
              }`}
              key={status.key}
              onDragLeave={() => setDragOverCol(null)}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDragOverCol(status.key);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const leadId = e.dataTransfer.getData("text/plain");
                if (leadId) {
                  handleDrop(status.key, leadId);
                }
              }}
            >
              {/* Column header */}
              <div className="flex items-center justify-between p-3 pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span
                    className="text-[#181510] text-[13px]"
                    style={{ fontWeight: 600 }}
                  >
                    {status.label}
                  </span>
                </div>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#e7e1da] px-1.5 text-[#8d785e] text-[11px]">
                  {count}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-1 flex-col gap-2 p-2 pt-0">
                {status.key === "new" && (
                  <button
                    className="flex items-center justify-center gap-1 rounded-lg border border-[#e7e1da] border-dashed py-2 text-[#8d785e] text-[13px] transition-colors hover:border-[#ff8c00] hover:text-[#ff8c00]"
                    onClick={() => setShowNewLead(true)}
                    type="button"
                  >
                    <Plus size={14} />
                    הוסף ליד
                  </button>
                )}
                {colLeads.map((lead) => (
                  <LeadCard
                    budget={lead.budget}
                    createdAt={lead.createdAt}
                    id={lead.id}
                    key={lead.id}
                    name={lead.name}
                    source={lead.source}
                  />
                ))}
                {colLeads.length === 0 && status.key !== "new" && (
                  <div className="py-4 text-center text-[#8d785e] text-[12px]">
                    אין לידים
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {showNewLead && <NewLeadModal onClose={() => setShowNewLead(false)} />}
      {lossModal && (
        <LossReasonModal
          leadName={lossModal.name}
          onClose={() => setLossModal(null)}
          onConfirm={handleLossConfirm}
        />
      )}
    </div>
  );
}
