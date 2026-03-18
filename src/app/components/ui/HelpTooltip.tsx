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
          className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
          type="button"
        >
          <Info size={14} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 rounded-lg border border-border bg-card p-3 shadow-lg"
        side="bottom"
      >
        <p className="text-right text-[13px] text-foreground leading-relaxed">
          {text}
        </p>
        {videoUrl && (
          <a
            className="mt-2 flex items-center gap-1.5 text-right text-[12px] text-primary transition-colors hover:text-primary-hover"
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
