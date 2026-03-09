import type { LucideIcon } from "lucide-react";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  PenLine,
  Phone,
  Youtube,
} from "lucide-react";
import { useNavigate } from "react-router";

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

interface LeadCardProps {
  budget?: number;
  createdAt: number;
  id: string;
  name: string;
  source: string;
}

export function LeadCard({
  id,
  name,
  source,
  budget,
  createdAt,
}: LeadCardProps) {
  const navigate = useNavigate();
  const SourceIcon = SOURCE_ICONS[source] || Globe;
  const daysSince = Math.floor(
    (Date.now() - createdAt) / (1000 * 60 * 60 * 24)
  );

  return (
    <button
      className="w-full cursor-grab rounded-lg border border-[#e7e1da] bg-white p-3 text-right shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
      draggable
      onClick={() => navigate(`/crm/${id}`)}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", id);
        e.dataTransfer.effectAllowed = "move";
      }}
      type="button"
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className="truncate text-[#181510] text-[14px]"
          style={{ fontWeight: 600 }}
        >
          {name}
        </span>
        <SourceIcon className="shrink-0 text-[#8d785e]" size={14} />
      </div>
      <div className="flex items-center justify-between">
        {budget ? (
          <span
            className="text-[#22c55e] text-[12px]"
            style={{ fontWeight: 500 }}
          >
            {budget.toLocaleString()} ₪
          </span>
        ) : (
          <span className="text-[#8d785e] text-[12px]">ללא תקציב</span>
        )}
        <span className="rounded-full bg-[#f5f3f0] px-2 py-0.5 text-[#8d785e] text-[11px]">
          {daysSince} ימים
        </span>
      </div>
    </button>
  );
}
