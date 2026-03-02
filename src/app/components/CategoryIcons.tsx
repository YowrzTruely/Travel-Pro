/**
 * CategoryIcons — Custom SVG icons for supplier categories.
 * Replaces emojis with a consistent visual language.
 * Usage: <CategoryIcon category="תחבורה" size={16} />
 */

interface IconProps {
  className?: string;
  color?: string;
  size?: number;
}

// ─── Transport (תחבורה) ───
function TransportIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <rect
        height="12"
        rx="3"
        stroke={color}
        strokeWidth="1.7"
        width="18"
        x="3"
        y="4"
      />
      <path d="M3 12h18" stroke={color} strokeWidth="1.3" />
      <circle cx="7.5" cy="18.5" r="1.8" stroke={color} strokeWidth="1.5" />
      <circle cx="16.5" cy="18.5" r="1.8" stroke={color} strokeWidth="1.5" />
      <path d="M9.3 18.5h5.4" stroke={color} strokeWidth="1.3" />
      <path
        d="M7 7.5h2M12 7.5h2M17 7.5h1"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ─── Food (מזון) ───
function FoodIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M3 14h18"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M4 14c0-4.5 3.5-8 8-8s8 3.5 8 8"
        stroke={color}
        strokeWidth="1.7"
      />
      <path
        d="M12 14v6"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M8 20h8"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="10.5" fill={color} r="1" />
    </svg>
  );
}

// ─── Attractions (אטרקציות) ───
function AttractionsIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M12 3L14.5 8.5L20.5 9.3L16.2 13.4L17.3 19.3L12 16.5L6.7 19.3L7.8 13.4L3.5 9.3L9.5 8.5L12 3Z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

// ─── Accommodation (לינה) ───
function AccommodationIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M3 21V7l9-4 9 4v14"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M9 21v-5h6v5"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <rect
        height="3"
        rx="0.5"
        stroke={color}
        strokeWidth="1.3"
        width="3"
        x="8"
        y="9"
      />
      <rect
        height="3"
        rx="0.5"
        stroke={color}
        strokeWidth="1.3"
        width="3"
        x="13"
        y="9"
      />
    </svg>
  );
}

// ─── Halls & Gardens (אולמות וגנים) ───
function HallsIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M4 21h16"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M6 8v13M10 8v13M14 8v13M18 8v13"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M4 8h16"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M5 8L12 3l7 5"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

// ─── Photography (צילום / צילום ווידאו) ───
function PhotographyIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <rect
        height="14"
        rx="3"
        stroke={color}
        strokeWidth="1.7"
        width="20"
        x="2"
        y="6"
      />
      <circle cx="12" cy="13" r="3.5" stroke={color} strokeWidth="1.7" />
      <path
        d="M8.5 6L9.5 3.5h5L15.5 6"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="13" fill={color} r="1.2" />
      <circle cx="18" cy="9" fill={color} r="0.8" />
    </svg>
  );
}

// ─── Music (מוזיקה) ───
function MusicIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M9 18V6l11-2v12"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <circle cx="6.5" cy="18.5" r="2.5" stroke={color} strokeWidth="1.7" />
      <circle cx="17.5" cy="16.5" r="2.5" stroke={color} strokeWidth="1.7" />
    </svg>
  );
}

// ─── Equipment (ציוד / ציוד ולוגיסטיקה) ───
function EquipmentIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

// ─── General (כללי) ───
function GeneralIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M21 8v13H3V8"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M1 3h22v5H1z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M10 12h4"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

// ─── Entertainment (בידור) ───
function EntertainmentIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M7 8C7 5 5 3 3 3c0 3 2 5 4 5z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M17 8c0-3 2-5 4-5-0 3-2 5-4 5z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M8 8c-1 4-1 7 0 9 1 3 3 4 4 4s3-1 4-4c1-2 1-5 0-9"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path d="M8 8h8" stroke={color} strokeLinecap="round" strokeWidth="1.7" />
      <circle cx="10" cy="12.5" fill={color} r="0.8" />
      <circle cx="14" cy="12.5" fill={color} r="0.8" />
      <path
        d="M10.5 15c.5.5 2.5.5 3 0"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// ─── Marketing (שיווק ופרסום) ───
function MarketingIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M18 8A6 6 0 0 1 6 8v3l-2 2v1h16v-1l-2-2V8z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M21 5l-3 3M21 11l-3-3"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ─── Insurance (ביטוח) ───
function InsuranceIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M12 2L4 6v5c0 5.5 3.3 10.5 8 12 4.7-1.5 8-6.5 8-12V6l-8-4z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

// ─── Guidance (הדרכה) ───
function GuidanceIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M22 10L12 5 2 10l10 5 10-5z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M6 12.5v5c0 1 2.7 3 6 3s6-2 6-3v-5"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M22 10v7"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ─── Wine (specific: יקב) ───
function WineIcon({
  size = 18,
  className = "",
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Category icon</title>
      <path
        d="M8 2h8l-1 7c-.2 2-1.8 3.5-3 4v0c-1.2-.5-2.8-2-3-4L8 2z"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M12 13v6"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M8 21h8"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M8.5 6h7"
        opacity="0.5"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT & LOOKUP MAP
// ═══════════════════════════════════════════════════

const ICON_COMPONENTS: Record<string, (props: IconProps) => JSX.Element> = {
  תחבורה: TransportIcon,
  מזון: FoodIcon,
  אטרקציות: AttractionsIcon,
  לינה: AccommodationIcon,
  "אולמות וגנים": HallsIcon,
  צילום: PhotographyIcon,
  "צילום ווידאו": PhotographyIcon,
  מוזיקה: MusicIcon,
  ציוד: EquipmentIcon,
  "ציוד ולוגיסטיקה": EquipmentIcon,
  כללי: GeneralIcon,
  בידור: EntertainmentIcon,
  "שיווק ופרסום": MarketingIcon,
  ביטוח: InsuranceIcon,
  הדרכה: GuidanceIcon,
  // Legacy emoji mappings (from existing seed data)
  "🚌": TransportIcon,
  "🍽️": FoodIcon,
  "🎯": AttractionsIcon,
  "🏃": AttractionsIcon,
  "🏨": AccommodationIcon,
  "🏛️": HallsIcon,
  "📸": PhotographyIcon,
  "🎵": MusicIcon,
  "🔧": EquipmentIcon,
  "📦": GeneralIcon,
  "🎭": EntertainmentIcon,
  "📢": MarketingIcon,
  "🛡️": InsuranceIcon,
  "🎓": GuidanceIcon,
  "🍷": WineIcon,
  "🎤": EntertainmentIcon,
  "🕐": GeneralIcon,
  "🚐": TransportIcon,
  "🗺️": AttractionsIcon,
};

// Fallback by checking partial match (e.g. "פעילות בוקר" → AttractionsIcon)
const KEYWORD_ICON_FALLBACK: [RegExp, (props: IconProps) => JSX.Element][] = [
  [/הסע|אוטובוס|רכב|נסיע|שאטל/i, TransportIcon],
  [/קייטרינג|מזון|אוכל|מסעדה|ארוח/i, FoodIcon],
  [/ספורט|אתגר|פעילות|רייז|טיול/i, AttractionsIcon],
  [/מלון|צימר|לינה|אכסני/i, AccommodationIcon],
  [/DJ|מוזיק|אומן|מופע|בידור/i, EntertainmentIcon],
  [/צילום|וידאו|דרון|צלם/i, PhotographyIcon],
  [/ציוד|הגבר|תאור|במה|לוגיסט/i, EquipmentIcon],
  [/שיווק|פרסום|מדיה/i, MarketingIcon],
  [/ביטוח/i, InsuranceIcon],
  [/מדריך|הדרכ|מרצה/i, GuidanceIcon],
  [/יקב|יין/i, WineIcon],
];

/**
 * Renders an SVG category icon based on category name.
 * Falls back to GeneralIcon if no match found.
 */
export function CategoryIcon({
  category,
  size = 18,
  className = "",
  color,
}: {
  category: string;
  size?: number;
  className?: string;
  color?: string;
}) {
  // Direct match
  const DirectIcon = ICON_COMPONENTS[category];
  if (DirectIcon) {
    return <DirectIcon className={className} color={color} size={size} />;
  }

  // Keyword fallback
  for (const [pattern, Icon] of KEYWORD_ICON_FALLBACK) {
    if (pattern.test(category)) {
      return <Icon className={className} color={color} size={size} />;
    }
  }

  return <GeneralIcon className={className} color={color} size={size} />;
}

/**
 * Get the icon component for a category (for programmatic use).
 */
export function getCategoryIconComponent(
  category: string
): (props: IconProps) => JSX.Element {
  const DirectIcon = ICON_COMPONENTS[category];
  if (DirectIcon) {
    return DirectIcon;
  }

  for (const [pattern, Icon] of KEYWORD_ICON_FALLBACK) {
    if (pattern.test(category)) {
      return Icon;
    }
  }

  return GeneralIcon;
}

// Re-export individual icons for special use cases
export {
  TransportIcon,
  FoodIcon,
  AttractionsIcon,
  AccommodationIcon,
  HallsIcon,
  PhotographyIcon,
  MusicIcon,
  EquipmentIcon,
  GeneralIcon,
  EntertainmentIcon,
  MarketingIcon,
  InsuranceIcon,
  GuidanceIcon,
  WineIcon,
};
