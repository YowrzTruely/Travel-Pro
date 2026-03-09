import { useMutation, useQuery } from "convex/react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Calendar,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  PenLine,
  Phone,
  Plus,
  Save,
  Users,
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { LogCommunicationModal } from "./LogCommunicationModal";

const SOURCE_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Globe,
  youtube: Youtube,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  phone: Phone,
  manual: PenLine,
  website: Globe,
};

const SOURCE_LABELS: Record<string, string> = {
  facebook: "פייסבוק",
  instagram: "אינסטגרם",
  tiktok: "טיקטוק",
  youtube: "יוטיוב",
  linkedin: "לינקדאין",
  whatsapp: "וואטסאפ",
  phone: "טלפון",
  manual: "ידני",
  website: "אתר",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "חדש", color: "#3b82f6" },
  first_contact: { label: "יצירת קשר", color: "#8b5cf6" },
  needs_assessment: { label: "בירור צרכים", color: "#f59e0b" },
  building_plan: { label: "בניית תוכנית", color: "#f97316" },
  quote_sent: { label: "הצעה נשלחה", color: "#6366f1" },
  approved: { label: "אושר", color: "#22c55e" },
  closed_won: { label: "נסגר-זכייה", color: "#10b981" },
  closed_lost: { label: "נסגר-הפסד", color: "#ef4444" },
};

const STATUS_ORDER = [
  "new",
  "first_contact",
  "needs_assessment",
  "building_plan",
  "quote_sent",
  "approved",
  "closed_won",
  "closed_lost",
];

const COMM_ICONS: Record<string, LucideIcon> = {
  call: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  sms: MessageSquare,
  note: PenLine,
  system: Globe,
};

const COMM_LABELS: Record<string, string> = {
  call: "שיחה",
  whatsapp: "וואטסאפ",
  email: "אימייל",
  sms: "SMS",
  note: "הערה",
  system: "מערכת",
};

export function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const lead = useQuery(api.leads.get, id ? { id: id as Id<"leads"> } : "skip");
  const communications = useQuery(
    api.leadCommunications.listByLeadId,
    id ? { leadId: id as Id<"leads"> } : "skip"
  );

  const updateLead = useMutation(api.leads.update);
  const updateStatus = useMutation(api.leads.updateStatus);
  const convertToProject = useMutation(api.leads.convertToProject);

  const [showCommModal, setShowCommModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    region: "",
    participants: "",
    budget: "",
    dateRequested: "",
    preferences: "",
    notes: "",
  });

  useEffect(() => {
    if (lead) {
      setEditData({
        name: lead.name || "",
        phone: lead.phone || "",
        email: lead.email || "",
        eventType: lead.eventType || "",
        region: lead.region || "",
        participants: lead.participants?.toString() || "",
        budget: lead.budget?.toString() || "",
        dateRequested: lead.dateRequested || "",
        preferences: lead.preferences || "",
        notes: lead.notes || "",
      });
    }
  }, [lead]);

  if (!id) {
    return null;
  }
  if (lead === undefined) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[#ff8c00]" size={32} />
      </div>
    );
  }
  if (lead === null) {
    return (
      <div className="p-8 text-center text-[#8d785e]" dir="rtl">
        ליד לא נמצא
      </div>
    );
  }

  const SourceIcon = SOURCE_ICONS[lead.source] || Globe;
  const statusInfo = STATUS_CONFIG[lead.status] || {
    label: lead.status,
    color: "#8d785e",
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateLead({
        id: id as Id<"leads">,
        name: editData.name.trim() || undefined,
        phone: editData.phone.trim() || undefined,
        email: editData.email.trim() || undefined,
        eventType: editData.eventType.trim() || undefined,
        region: editData.region.trim() || undefined,
        participants: editData.participants
          ? Number.parseInt(editData.participants, 10)
          : undefined,
        budget: editData.budget
          ? Number.parseFloat(editData.budget)
          : undefined,
        dateRequested: editData.dateRequested || undefined,
        preferences: editData.preferences.trim() || undefined,
        notes: editData.notes.trim() || undefined,
      });
      appToast.success("פרטי ליד עודכנו");
      setEditing(false);
    } catch (err) {
      console.error("[LeadDetail] Save failed:", err);
      appToast.error("שגיאה בעדכון", String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "closed_won") {
      try {
        await convertToProject({ id: id as Id<"leads"> });
        appToast.success("ליד הומר לפרויקט!");
      } catch (err) {
        appToast.error("שגיאה בהמרה", String(err));
      }
      return;
    }
    try {
      await updateStatus({
        id: id as Id<"leads">,
        status: newStatus as Parameters<typeof updateStatus>[0]["status"],
      });
      appToast.success("סטטוס עודכן");
    } catch (err) {
      appToast.error("שגיאה בעדכון סטטוס", String(err));
    }
  };

  const currentIndex = STATUS_ORDER.indexOf(lead.status);
  const nextStatus =
    currentIndex >= 0 && currentIndex < STATUS_ORDER.length - 1
      ? STATUS_ORDER[currentIndex + 1]
      : null;

  return (
    <div className="p-4 lg:p-8" dir="rtl">
      {/* Back button */}
      <button
        className="mb-4 flex items-center gap-2 text-[#8d785e] text-[14px] transition-colors hover:text-[#181510]"
        onClick={() => navigate("/crm")}
        type="button"
      >
        <ArrowRight size={16} />
        חזרה לניהול לידים
      </button>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h1 className="text-[#181510] text-[28px]" style={{ fontWeight: 700 }}>
          {lead.name}
        </h1>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] text-white"
          style={{ backgroundColor: statusInfo.color, fontWeight: 600 }}
        >
          {statusInfo.label}
        </div>
        <div className="flex items-center gap-1 text-[#8d785e] text-[13px]">
          <SourceIcon size={14} />
          {SOURCE_LABELS[lead.source] || lead.source}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Details */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-[#e7e1da] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-[#181510] text-[18px]"
                style={{ fontWeight: 600 }}
              >
                פרטי ליד
              </h2>
              {editing ? (
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1 rounded-lg bg-[#ff8c00] px-3 py-1.5 text-[13px] text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
                    disabled={saving}
                    onClick={handleSave}
                    type="button"
                  >
                    {saving ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Save size={14} />
                    )}
                    שמור
                  </button>
                  <button
                    className="rounded-lg border border-[#e7e1da] px-3 py-1.5 text-[#181510] text-[13px] hover:bg-[#f5f3f0]"
                    onClick={() => setEditing(false)}
                    type="button"
                  >
                    ביטול
                  </button>
                </div>
              ) : (
                <button
                  className="flex items-center gap-1 rounded-lg border border-[#e7e1da] px-3 py-1.5 text-[#181510] text-[13px] transition-colors hover:bg-[#f5f3f0]"
                  onClick={() => setEditing(true)}
                  type="button"
                >
                  <PenLine size={14} />
                  עריכה
                </button>
              )}
            </div>

            {editing ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <EditField
                  label="שם"
                  onChange={(v) => setEditData((d) => ({ ...d, name: v }))}
                  value={editData.name}
                />
                <EditField
                  label="טלפון"
                  onChange={(v) => setEditData((d) => ({ ...d, phone: v }))}
                  value={editData.phone}
                />
                <EditField
                  label="אימייל"
                  onChange={(v) => setEditData((d) => ({ ...d, email: v }))}
                  type="email"
                  value={editData.email}
                />
                <EditField
                  label="סוג אירוע"
                  onChange={(v) => setEditData((d) => ({ ...d, eventType: v }))}
                  value={editData.eventType}
                />
                <EditField
                  label="אזור"
                  onChange={(v) => setEditData((d) => ({ ...d, region: v }))}
                  value={editData.region}
                />
                <EditField
                  label="משתתפים"
                  onChange={(v) =>
                    setEditData((d) => ({ ...d, participants: v }))
                  }
                  type="number"
                  value={editData.participants}
                />
                <EditField
                  label="תקציב (₪)"
                  onChange={(v) => setEditData((d) => ({ ...d, budget: v }))}
                  type="number"
                  value={editData.budget}
                />
                <EditField
                  label="תאריך מבוקש"
                  onChange={(v) =>
                    setEditData((d) => ({ ...d, dateRequested: v }))
                  }
                  type="date"
                  value={editData.dateRequested}
                />
                <div className="sm:col-span-2">
                  <label
                    className="mb-1 block text-[#8d785e] text-[13px]"
                    htmlFor="edit-preferences"
                    style={{ fontWeight: 600 }}
                  >
                    העדפות
                  </label>
                  <textarea
                    className="w-full resize-none rounded-lg border border-[#e7e1da] px-3 py-2 text-[14px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                    id="edit-preferences"
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        preferences: e.target.value,
                      }))
                    }
                    rows={2}
                    value={editData.preferences}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    className="mb-1 block text-[#8d785e] text-[13px]"
                    htmlFor="edit-notes"
                    style={{ fontWeight: 600 }}
                  >
                    הערות
                  </label>
                  <textarea
                    className="w-full resize-none rounded-lg border border-[#e7e1da] px-3 py-2 text-[14px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                    id="edit-notes"
                    onChange={(e) =>
                      setEditData((d) => ({ ...d, notes: e.target.value }))
                    }
                    rows={2}
                    value={editData.notes}
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem icon={Phone} label="טלפון" value={lead.phone} />
                <DetailItem icon={Mail} label="אימייל" value={lead.email} />
                <DetailItem
                  icon={Calendar}
                  label="סוג אירוע"
                  value={lead.eventType}
                />
                <DetailItem icon={MapPin} label="אזור" value={lead.region} />
                <DetailItem
                  icon={Users}
                  label="משתתפים"
                  value={lead.participants?.toString()}
                />
                <DetailItem
                  label="תקציב"
                  value={
                    lead.budget
                      ? `${lead.budget.toLocaleString()} ₪`
                      : undefined
                  }
                />
                <DetailItem
                  icon={Calendar}
                  label="תאריך מבוקש"
                  value={lead.dateRequested}
                />
                <DetailItem
                  icon={Clock}
                  label="נוצר"
                  value={new Date(lead.createdAt).toLocaleDateString("he-IL")}
                />
                {lead.preferences && (
                  <div className="sm:col-span-2">
                    <span
                      className="text-[#8d785e] text-[12px]"
                      style={{ fontWeight: 600 }}
                    >
                      העדפות
                    </span>
                    <p className="mt-0.5 text-[#181510] text-[14px]">
                      {lead.preferences}
                    </p>
                  </div>
                )}
                {lead.notes && (
                  <div className="sm:col-span-2">
                    <span
                      className="text-[#8d785e] text-[12px]"
                      style={{ fontWeight: 600 }}
                    >
                      הערות
                    </span>
                    <p className="mt-0.5 text-[#181510] text-[14px]">
                      {lead.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Communications timeline */}
          <div className="mt-6 rounded-xl border border-[#e7e1da] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-[#181510] text-[18px]"
                style={{ fontWeight: 600 }}
              >
                היסטוריית תקשורת
              </h2>
              <button
                className="flex items-center gap-1 rounded-lg bg-[#ff8c00] px-3 py-1.5 text-[13px] text-white transition-colors hover:bg-[#e67e00]"
                onClick={() => setShowCommModal(true)}
                style={{ fontWeight: 600 }}
                type="button"
              >
                <Plus size={14} />
                הוסף
              </button>
            </div>

            {communications === undefined ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-[#8d785e]" size={20} />
              </div>
            ) : communications.length === 0 ? (
              <p className="py-4 text-center text-[#8d785e] text-[14px]">
                אין תקשורת עדיין
              </p>
            ) : (
              <div className="space-y-3">
                {[...communications]
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((comm) => {
                    const CommIcon = COMM_ICONS[comm.type] || Globe;
                    return (
                      <div
                        className="flex gap-3 rounded-lg border border-[#e7e1da] p-3"
                        key={comm.id}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f3f0] text-[#8d785e]">
                          <CommIcon size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span
                              className="text-[#181510] text-[13px]"
                              style={{ fontWeight: 600 }}
                            >
                              {COMM_LABELS[comm.type] || comm.type}
                            </span>
                            {comm.duration && (
                              <span className="text-[#8d785e] text-[12px]">
                                {comm.duration} דקות
                              </span>
                            )}
                            <span className="mr-auto text-[#8d785e] text-[12px]">
                              {new Date(comm.createdAt).toLocaleString("he-IL")}
                            </span>
                          </div>
                          <p className="text-[#181510] text-[14px]">
                            {comm.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Status actions */}
        <div>
          <div className="rounded-xl border border-[#e7e1da] bg-white p-6">
            <h3
              className="mb-4 text-[#181510] text-[16px]"
              style={{ fontWeight: 600 }}
            >
              פעולות מהירות
            </h3>

            {/* Next status button */}
            {nextStatus && nextStatus !== "closed_lost" && (
              <button
                className="mb-3 w-full rounded-lg py-2.5 text-[14px] text-white transition-colors"
                onClick={() => handleStatusChange(nextStatus)}
                style={{
                  backgroundColor:
                    STATUS_CONFIG[nextStatus]?.color || "#ff8c00",
                  fontWeight: 600,
                }}
                type="button"
              >
                העבר ל{STATUS_CONFIG[nextStatus]?.label}
              </button>
            )}

            {lead.status !== "closed_won" && lead.status !== "closed_lost" && (
              <button
                className="mb-3 w-full rounded-lg border border-[#10b981] py-2.5 text-[#10b981] text-[14px] transition-colors hover:bg-[#10b981]/10"
                onClick={() => handleStatusChange("closed_won")}
                style={{ fontWeight: 600 }}
                type="button"
              >
                המר לפרויקט (זכייה)
              </button>
            )}

            {/* All statuses */}
            <div className="mt-4 border-[#e7e1da] border-t pt-4">
              <p
                className="mb-2 text-[#8d785e] text-[12px]"
                style={{ fontWeight: 600 }}
              >
                שנה סטטוס
              </p>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_ORDER.map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  if (!cfg) {
                    return null;
                  }
                  const isCurrent = s === lead.status;
                  return (
                    <button
                      className={`rounded-md px-2 py-1 text-[11px] transition-colors ${
                        isCurrent
                          ? "text-white"
                          : "border border-[#e7e1da] text-[#181510] hover:bg-[#f5f3f0]"
                      }`}
                      disabled={isCurrent}
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      style={
                        isCurrent
                          ? { backgroundColor: cfg.color, fontWeight: 600 }
                          : {}
                      }
                      type="button"
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Communication modal */}
      {showCommModal && (
        <LogCommunicationModal
          leadId={id}
          onClose={() => setShowCommModal(false)}
        />
      )}
    </div>
  );
}

// ─── Helper components ───

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon?: LucideIcon;
  label: string;
  value?: string;
}) {
  return (
    <div>
      <div className="mb-0.5 flex items-center gap-1">
        {Icon && <Icon className="text-[#8d785e]" size={12} />}
        <span
          className="text-[#8d785e] text-[12px]"
          style={{ fontWeight: 600 }}
        >
          {label}
        </span>
      </div>
      <p className="text-[#181510] text-[14px]">{value || "—"}</p>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  onChange: (v: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span
        className="mb-1 block text-[#8d785e] text-[13px]"
        style={{ fontWeight: 600 }}
      >
        {label}
      </span>
      <input
        className="w-full rounded-lg border border-[#e7e1da] px-3 py-2 text-[14px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
        onChange={(e) => onChange(e.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}
