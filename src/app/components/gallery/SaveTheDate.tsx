import { Calendar, MapPin, Users } from "lucide-react";

interface SaveTheDateProps {
  date: string;
  participants?: number;
  region?: string;
  tripName: string;
}

export function SaveTheDate({
  tripName,
  date,
  region,
  participants,
}: SaveTheDateProps) {
  return (
    <div className="flex items-center justify-center p-6" dir="rtl">
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-[#fffaf5] to-accent shadow-lg">
        {/* Decorative top bar */}
        <div className="h-2 bg-gradient-to-l from-primary to-[#e07800]" />

        {/* Content */}
        <div className="flex flex-col items-center gap-5 px-8 py-8 text-center">
          {/* Save the Date label */}
          <p
            className="text-[13px] text-muted-foreground uppercase tracking-[0.2em]"
            style={{ fontWeight: 600 }}
          >
            SAVE THE DATE
          </p>

          {/* Decorative divider */}
          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <div className="h-2 w-2 rotate-45 rounded-sm bg-primary" />
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Trip name */}
          <h2
            className="text-[24px] text-foreground leading-tight"
            style={{ fontWeight: 700 }}
          >
            {tripName}
          </h2>

          {/* Date */}
          <div className="flex items-center gap-2 text-primary">
            <Calendar size={18} />
            <span className="text-[18px]" style={{ fontWeight: 600 }}>
              {date}
            </span>
          </div>

          {/* Region & Participants */}
          {(region || participants) && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
              {region && (
                <div className="flex items-center gap-1.5 text-[14px]">
                  <MapPin size={15} />
                  <span>{region}</span>
                </div>
              )}
              {participants && (
                <div className="flex items-center gap-1.5 text-[14px]">
                  <Users size={15} />
                  <span>{participants} משתתפים</span>
                </div>
              )}
            </div>
          )}

          {/* Decorative bottom divider */}
          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <div className="h-2 w-2 rotate-45 rounded-sm bg-primary" />
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Footer text */}
          <p className="text-[12px] text-muted-foreground">נשמח לראותכם!</p>
        </div>

        {/* Decorative bottom bar */}
        <div className="h-2 bg-gradient-to-l from-primary to-[#e07800]" />
      </div>
    </div>
  );
}
