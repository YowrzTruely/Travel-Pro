import { ExternalLink, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface HelpTooltipProps {
  text: string;
  videoUrl?: string;
}

export function HelpTooltip({ text, videoUrl }: HelpTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[#8d785e] transition-colors hover:bg-[#f5f3f0] hover:text-[#ff8c00]"
          type="button"
        >
          <Info size={14} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 rounded-lg border border-[#e7e1da] bg-white p-3 shadow-lg"
        side="bottom"
      >
        <p className="text-right text-[#3d3426] text-[13px] leading-relaxed">
          {text}
        </p>
        {videoUrl && (
          <a
            className="mt-2 flex items-center gap-1.5 text-right text-[#ff8c00] text-[12px] transition-colors hover:text-[#e67e00]"
            href={videoUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink size={12} />
            צפה בסרטון הדרכה
          </a>
        )}
      </PopoverContent>
    </Popover>
  );
}
