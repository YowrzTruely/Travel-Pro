/**
 * Supplier categories and operating regions per PRD §3.2
 *
 * Categories: closed list (רשימה סגורה), admin approval required if supplier selects >3.
 * Regions: 11 operating zones across Israel.
 */

export const SUPPLIER_CATEGORIES = [
  {
    value: "attractions",
    label: "אטרקציות ופעילויות",
    examples: "קיאקים, טרקטורונים, ג'יפים, אופניים, פארק חבל...",
  },
  { value: "food", label: "מסעדות ואוכל" },
  { value: "transport", label: "הסעות ותחבורה" },
  { value: "photography", label: "צילום ומגנטים" },
  { value: "entertainment", label: "בידור ומוזיקה" },
  { value: "workshops", label: "סדנאות יצירה ולמידה" },
  { value: "accommodation", label: "לינה" },
  { value: "other", label: "אחר" },
] as const;

export const OPERATING_REGIONS = [
  { value: "upper_galilee", label: "גליל עליון" },
  { value: "lower_galilee", label: "גליל תחתון" },
  { value: "valleys", label: "עמקים" },
  { value: "carmel", label: "כרמל" },
  { value: "sharon", label: "שרון" },
  { value: "center", label: "מרכז" },
  { value: "shfela", label: "שפלה" },
  { value: "jerusalem", label: "ירושלים והר יהודה" },
  { value: "negev", label: "נגב" },
  { value: "arava_eilat", label: "ערבה-אילת" },
  { value: "dead_sea", label: "ים המלח" },
] as const;

/** Max categories before admin approval is required */
export const MAX_CATEGORIES_WITHOUT_APPROVAL = 3;

export type SupplierCategoryValue =
  (typeof SUPPLIER_CATEGORIES)[number]["value"];
export type OperatingRegionValue = (typeof OPERATING_REGIONS)[number]["value"];
