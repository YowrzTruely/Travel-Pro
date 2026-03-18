import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

const THEMES = [
  { value: "light", label: "בהיר", Icon: Sun },
  { value: "dark", label: "כהה", Icon: Moon },
  { value: "system", label: "מערכת", Icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[2];
  const CurrentIcon = current.Icon;

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="שנה ערכת נושא"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <CurrentIcon size={20} />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 min-w-[140px] rounded-lg border border-border bg-popover p-1 shadow-lg">
          {THEMES.map(({ value, label, Icon }) => (
            <button
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                theme === value
                  ? "bg-accent text-primary"
                  : "text-popover-foreground hover:bg-accent"
              }`}
              key={value}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              style={{ fontWeight: theme === value ? 600 : 400 }}
              type="button"
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
