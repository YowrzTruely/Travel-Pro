import { useMutation, useQuery } from "convex/react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Loader2,
  MessageSquare,
  Printer,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { appToast } from "./AppToast";
import { CategoryIcon } from "./CategoryIcons";
import { ClientQuoteChangeRequest } from "./ClientQuoteChangeRequest";
import { ClientQuoteSignature } from "./ClientQuoteSignature";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const PLANT_IMG =
  "https://images.unsplash.com/photo-1555758826-ce21b7e51ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHBsYW50JTIwbGVhdmVzJTIwZ3JlZW58ZW58MXx8fHwxNzcxMzgwNzUzfDA&ixlib=rb-4.1.0&q=80&w=1080";
const VINEYARD_IMG =
  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const LUNCH_IMG =
  "https://images.unsplash.com/photo-1566670829023-5badae05aa7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwbHVuY2glMjByZXN0YXVyYW50JTIwdGFibGV8ZW58MXx8fHwxNzcxNDY4MjM2fDA&ixlib=rb-4.1.0&q=80&w=1080";
const VAN_IMG =
  "https://images.unsplash.com/photo-1760954661834-fca0f39ead42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdmFuJTIwcm9hZCUyMHRyaXAlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzcxNDY4MjQyfDA&ixlib=rb-4.1.0&q=80&w=1080";

const ACTIVITY_IMAGES = [VINEYARD_IMG, LUNCH_IMG, VAN_IMG];

export function ClientQuote() {
  const { id: projectId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || undefined;

  const [expandedTimeline, setExpandedTimeline] = useState<number | null>(null);
  const [expandedActivities, setExpandedActivities] = useState<
    Record<number, boolean>
  >({});
  const [confirmed, setConfirmed] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [showChangeRequest, setShowChangeRequest] = useState(false);

  const quoteData = useQuery(
    api.publicQuote.getQuote,
    projectId ? { id: projectId, mode } : "skip"
  );
  const toggleUpsell = useMutation(api.publicQuote.toggleUpsell);
  const selectAlternative = useMutation(api.publicQuote.selectAlternative);

  const loading = quoteData === undefined;
  const noPrices = mode === "noPrices";

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  // Static fallback activities (used when no API data)
  const defaultActivities = [
    {
      title: "סיור כרמים, טעימות יין וגבינות בוטיק",
      subtitle: "החוויה הגלילית האולטימטיבית",
      img: VINEYARD_IMG,
      bullets: [
        "סיור מודרך בכרם עין רפאל בגליל העליון, עם מדריך שמכיר כל גפן ואבן במקום.",
        "נכנסים ללב הכרם — נופים עוצרי נשימה, אדמה אדומה וסיפורים מרתקים.",
        "טעימות מקצועיות של 5 סוגי יין מהייקב, עם הסבר על תהליך הייצור.",
        "פלטת גבינות בוטיק מחלבות גליליות, זיתים ולחם טרי מהטאבון.",
        "צילום קבוצתי בנקודת תצפית פנורמית על הגליל.",
      ],
    },
    {
      title: "ארוחת צהריים גורמה בטבע",
      subtitle: "חוויה קולינרית גלילית",
      img: LUNCH_IMG,
      bullets: [
        "ארוחה במסעדת חווה ציורית בלב הטבע, שולחנות מוצלים מתחת לעצי אלון.",
        "תפריט שף עשיר: סלטי חווה טריים, בשרים על הגריל ותבשילים ביתיים.",
        "כל המנות מוכנות ממרכיבים מקומיים וטריים מהמשק.",
        "אופציות מותאמות לכשר, צמחוני וטבעוני.",
      ],
    },
    {
      title: "הסעות VIP ולוגיסטיקה מלאה",
      subtitle: "ROYAL TRANSPORT",
      img: VAN_IMG,
      bullets: [
        'איסוף מאורגן מ-3 נקודות מפגש מרכזיות (ת"א, חיפה, נתניה).',
        "3 אוטובוסים מפוארים עם מושבים מרופדים, Wi-Fi ומיזוג אוויר.",
        "מנהלת לוגיסטית מלווה את הקבוצה לאורך כל הדרך.",
        "זמן נסיעה משוער: כשעה וחצי עם עצירת ביניים לקפה.",
      ],
    },
  ];

  // Build activities from API items or use defaults
  const activities =
    quoteData?.items && quoteData.items.length > 0
      ? quoteData.items.map((item: any, idx: number) => ({
          quoteItemId: item.quoteItemId,
          title: item.name || item.type,
          subtitle: item.type,
          img: ACTIVITY_IMAGES[idx % ACTIVITY_IMAGES.length],
          bullets: [item.description || "פרטים נוספים יתווספו בקרוב."],
          sellingPrice: item.sellingPrice,
          equipmentRequirements: item.equipmentRequirements,
          grossTime: item.grossTime,
          netTime: item.netTime,
          selectedAddons: item.selectedAddons,
          alternativeItems: item.alternativeItems,
          selectedByClient: item.selectedByClient,
        }))
      : defaultActivities;

  const projectName = quoteData?.name || "נופש שנתי גליל עליון";
  const participants = quoteData?.participants || 50;
  const totalPrice = quoteData?.totalPrice || 42_500;
  const pricePerPerson =
    quoteData?.pricePerPerson || Math.round(totalPrice / participants);

  // Timeline from API or defaults
  const timelineItems =
    quoteData?.timeline && quoteData.timeline.length > 0
      ? quoteData.timeline.map((t: any) => ({
          time: t.time,
          title: t.title,
          iconKey: t.icon || t.title,
        }))
      : [
          { time: "09:00-12:00", title: "סיור כרמים וטעימות", iconKey: "יקב" },
          { time: "13:00-14:00", title: "ארוחת צהריים גורמה", iconKey: "מזון" },
          {
            time: "15:00-18:00",
            title: "הסעות VIP וסיום היום",
            iconKey: "תחבורה",
          },
        ];

  const tips = [
    {
      title: "קחו כובעים וקרם הגנה",
      desc: "בגליל העליון ישנן כ-14 שעות שמש ביום בעונת הקיץ. מומלץ להצטייד בכובע, קרם הגנה ובקבוק מים.",
    },
    {
      title: "הגיעו עם נעליים נוחות",
      desc: "הסיור בכרמים מתבצע על שבילים לא סלולים. נעלי ספורט או נעליים סגורות מומלצות.",
    },
  ];

  const handleApprove = () => {
    if (!projectId || confirmed) {
      return;
    }
    setShowSignature(true);
  };

  const handleSigned = () => {
    setShowSignature(false);
    setConfirmed(true);
  };

  const toggleActivity = (idx: number) => {
    setExpandedActivities((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Items list for change request modal
  const changeRequestItems = (quoteData?.items || []).map((item: any) => ({
    id: item.quoteItemId,
    name: item.name || item.type,
  }));

  if (loading) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center bg-white font-['Assistant',sans-serif]"
        dir="rtl"
      >
        <Loader2 className="mb-3 animate-spin text-[#ff8c00]" size={32} />
        <p className="text-[#8d785e] text-[14px]">טוען הצעת מחיר...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white font-['Assistant',sans-serif]"
      dir="rtl"
    >
      {/* No-prices banner */}
      {noPrices && (
        <div className="bg-[#fff7ed] px-4 py-2 text-center font-semibold text-[#9a3412] text-[13px]">
          תצוגה ללא מחירים — לצפייה בלבד
        </div>
      )}

      {/* Top nav */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-[#e7e1da] border-b bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1.5 rounded-lg bg-[#f5f3f0] py-1.5 pr-2 pl-3 text-[#8d785e] text-[13px] transition-colors hover:bg-[#ece8e3] hover:text-[#181510]"
            onClick={goBack}
            style={{ fontWeight: 600 }}
            type="button"
          >
            חזרה
            <ArrowRight size={15} />
          </button>
          <div className="h-6 w-px bg-[#e7e1da]" />
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff8c00]">
            <span className="text-[14px] text-white">✈</span>
          </div>
          <span
            className="text-[#181510] text-[16px]"
            style={{ fontWeight: 700 }}
          >
            TravelPro
          </span>
        </div>
        <div className="hidden items-center gap-2 text-[#8d785e] text-[13px] sm:flex">
          <span>הצעת מחיר | {projectName}</span>
          {quoteData?.quoteVersion && (
            <span className="rounded-full bg-[#f5f3f0] px-2 py-0.5 font-semibold text-[11px]">
              V{quoteData.quoteVersion}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-[#e7e1da] px-3 py-1.5 text-[#8d785e] text-[12px] transition-colors hover:bg-[#f5f3f0]"
            onClick={() => setShowVersions(true)}
            type="button"
          >
            גרסאות
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg bg-[#ff8c00] px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-[#e67e00]"
            onClick={() => window.print()}
            style={{ fontWeight: 600 }}
            type="button"
          >
            <Printer size={13} />
            הדפס
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[400px] overflow-hidden md:h-[500px]">
        <ImageWithFallback
          alt="Hero"
          className="h-full w-full object-cover"
          src={PLANT_IMG}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-6 text-right md:p-10">
          <span
            className="text-[#ffb74d] text-[12px] tracking-wider"
            style={{ fontWeight: 600 }}
          >
            החוויה הגלילית שלכם
          </span>
          <h1
            className="mt-2 max-w-lg text-[32px] text-white md:text-[44px]"
            style={{ fontWeight: 700, lineHeight: 1.2 }}
          >
            החוויה הגלילית שלכם מתחילה כאן
          </h1>
          <p className="mt-3 max-w-md text-[14px] text-white/80">
            יום נופש מושלם בגליל העליון: סיור ביקב, טעימות יין, ארוחת שף בטבע
            והסעות מפנקות. חוויה שתיזכר לאורך זמן.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-8 md:px-8">
        {/* Quick timeline */}
        <div>
          <h2
            className="mb-4 text-[#181510] text-[22px]"
            style={{ fontWeight: 700 }}
          >
            ⏰ לו"ז מקוצר
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {timelineItems.map((item: any, idx: number) => (
              <button
                className="flex items-center gap-3 rounded-xl border-2 border-[#ff8c00]/20 bg-white p-4 transition-all hover:border-[#ff8c00]"
                key={idx}
                onClick={() =>
                  setExpandedTimeline(expandedTimeline === idx ? null : idx)
                }
                type="button"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ff8c00]/10 text-[#ff8c00]">
                  <CategoryIcon
                    category={item.iconKey}
                    color="#ff8c00"
                    size={20}
                  />
                </span>
                <div className="text-right">
                  <div
                    className="text-[#181510] text-[14px]"
                    style={{ fontWeight: 600 }}
                  >
                    {item.title}
                  </div>
                  <div
                    className="text-[#ff8c00] text-[12px]"
                    style={{ fontWeight: 600 }}
                  >
                    {item.time}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div>
          <h2
            className="mb-4 text-[#181510] text-[22px]"
            style={{ fontWeight: 700 }}
          >
            📋 פירוט הפעילויות
          </h2>
          <div className="space-y-5">
            {activities.map((activity: any, idx: number) => (
              <div
                className="overflow-hidden rounded-2xl border border-[#e7e1da] bg-white shadow-sm transition-shadow hover:shadow-md"
                key={idx}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="h-56 shrink-0 overflow-hidden bg-[#f5f3f0] md:h-auto md:w-80">
                    <ImageWithFallback
                      alt={activity.title}
                      className="h-full w-full object-cover"
                      src={activity.img}
                    />
                  </div>
                  <div className="flex-1 p-5">
                    {activity.subtitle && (
                      <div
                        className="mb-1 text-[#ff8c00] text-[11px]"
                        style={{ fontWeight: 600 }}
                      >
                        {activity.subtitle}
                      </div>
                    )}
                    <h3
                      className="mb-2 text-[#181510] text-[18px]"
                      style={{ fontWeight: 700 }}
                    >
                      {activity.title}
                    </h3>

                    {/* Time display */}
                    {(activity.grossTime || activity.netTime) && (
                      <div className="mb-2 flex items-center gap-3 text-[#8d785e] text-[12px]">
                        <Clock className="shrink-0" size={13} />
                        {activity.grossTime && (
                          <span>זמן ברוטו: {activity.grossTime}</span>
                        )}
                        {activity.netTime && (
                          <span>זמן נטו: {activity.netTime}</span>
                        )}
                      </div>
                    )}

                    {/* Equipment requirements */}
                    {activity.equipmentRequirements && (
                      <div className="mb-2 rounded-lg bg-[#f5f3f0] px-3 py-1.5 text-[#8d785e] text-[12px]">
                        ציוד נדרש: {activity.equipmentRequirements}
                      </div>
                    )}

                    {/* Per-item price (hidden in noPrices mode) */}
                    {!noPrices && activity.sellingPrice != null && (
                      <div className="mb-2 font-bold text-[#ff8c00] text-[14px]">
                        ₪{Number(activity.sellingPrice).toLocaleString()}
                      </div>
                    )}

                    <div
                      className={`space-y-1 ${expandedActivities[idx] ? "" : "relative max-h-20 overflow-hidden"}`}
                    >
                      {activity.bullets.map((bullet: string, bIdx: number) => (
                        <div
                          className="flex gap-2 text-[#8d785e] text-[13px]"
                          key={bIdx}
                        >
                          <span className="shrink-0 text-[#ff8c00]">•</span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                      {!expandedActivities[idx] &&
                        activity.bullets.length > 2 && (
                          <div className="absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t from-white to-transparent" />
                        )}
                    </div>
                    {activity.bullets.length > 2 && (
                      <button
                        className="mt-2 flex items-center gap-1 text-[#ff8c00] text-[12px]"
                        onClick={() => toggleActivity(idx)}
                        style={{ fontWeight: 600 }}
                        type="button"
                      >
                        {expandedActivities[idx] ? "הצג פחות" : "קרא עוד"}
                        {expandedActivities[idx] ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                      </button>
                    )}

                    {/* Upsell addons */}
                    {activity.selectedAddons &&
                      activity.selectedAddons.length > 0 && (
                        <div className="mt-3 space-y-1.5 border-[#e7e1da] border-t pt-3">
                          <div
                            className="text-[#181510] text-[12px]"
                            style={{ fontWeight: 600 }}
                          >
                            תוספות זמינות
                          </div>
                          {activity.selectedAddons.map(
                            (addon: any, aIdx: number) => (
                              <label
                                className="flex cursor-pointer items-center gap-2"
                                key={aIdx}
                              >
                                <input
                                  checked={addon.selected ?? false}
                                  className="h-3.5 w-3.5 accent-[#ff8c00]"
                                  onChange={(e) => {
                                    if (!(projectId && activity.quoteItemId)) {
                                      return;
                                    }
                                    toggleUpsell({
                                      projectId:
                                        projectId as unknown as Id<"projects">,
                                      quoteItemId: activity.quoteItemId,
                                      addonId: addon.addonId,
                                      name: addon.name,
                                      price: addon.price ?? 0,
                                      selected: e.target.checked,
                                    });
                                  }}
                                  type="checkbox"
                                />
                                <span className="text-[#8d785e] text-[12px]">
                                  {addon.name}
                                  {!noPrices && addon.price != null && (
                                    <span className="mr-1 text-[#ff8c00]">
                                      (+₪{Number(addon.price).toLocaleString()})
                                    </span>
                                  )}
                                </span>
                              </label>
                            )
                          )}
                        </div>
                      )}

                    {/* Alternative items */}
                    {activity.alternativeItems &&
                      activity.alternativeItems.length > 0 && (
                        <div className="mt-3 space-y-1.5 border-[#e7e1da] border-t pt-3">
                          <div
                            className="text-[#181510] text-[12px]"
                            style={{ fontWeight: 600 }}
                          >
                            חלופות
                          </div>
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              checked={activity.selectedByClient !== false}
                              className="h-3.5 w-3.5 accent-[#ff8c00]"
                              name={`alt-${activity.quoteItemId}`}
                              onChange={() => {
                                if (!activity.quoteItemId) {
                                  return;
                                }
                                selectAlternative({
                                  quoteItemId: activity.quoteItemId,
                                  selectedAlternativeIndex: -1,
                                });
                              }}
                              type="radio"
                            />
                            <span className="text-[#8d785e] text-[12px]">
                              {activity.title} (מקורי)
                            </span>
                          </label>
                          {activity.alternativeItems.map(
                            (alt: any, altIdx: number) => (
                              <label
                                className="flex cursor-pointer items-center gap-2"
                                key={altIdx}
                              >
                                <input
                                  checked={false}
                                  className="h-3.5 w-3.5 accent-[#ff8c00]"
                                  name={`alt-${activity.quoteItemId}`}
                                  onChange={() => {
                                    if (!activity.quoteItemId) {
                                      return;
                                    }
                                    selectAlternative({
                                      quoteItemId: activity.quoteItemId,
                                      selectedAlternativeIndex: altIdx,
                                    });
                                  }}
                                  type="radio"
                                />
                                <span className="text-[#8d785e] text-[12px]">
                                  {alt.name}
                                  {!noPrices && alt.price != null && (
                                    <span className="mr-1 text-[#ff8c00]">
                                      (₪{Number(alt.price).toLocaleString()})
                                    </span>
                                  )}
                                </span>
                              </label>
                            )
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h2
            className="mb-4 text-[#181510] text-[22px]"
            style={{ fontWeight: 700 }}
          >
            💡 חשוב לדעת
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {tips.map((tip, idx) => (
              <div
                className="rounded-xl border border-[#ff8c00]/20 bg-[#fff7ed] p-4"
                key={idx}
              >
                <div
                  className="mb-1 text-[#181510] text-[14px]"
                  style={{ fontWeight: 600 }}
                >
                  {tip.title}
                </div>
                <div className="text-[#8d785e] text-[12px]">{tip.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Price summary — hidden in noPrices mode */}
        {!noPrices && (
          <div className="rounded-2xl bg-gradient-to-l from-[#181510] to-[#2a2518] p-6 text-white">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2
                  className="text-[20px] text-white"
                  style={{ fontWeight: 700 }}
                >
                  סיכום הצעת מחיר
                </h2>
                <p className="mt-1 text-[#c4b89a] text-[13px]">
                  החבילה המומלצת על {participants} משתתפים
                </p>
              </div>
              <div className="flex items-end gap-6">
                <div className="text-center">
                  <div className="text-[#c4b89a] text-[11px]">מחיר לאדם</div>
                  <div
                    className="text-[20px] text-white"
                    style={{ fontWeight: 700 }}
                  >
                    ₪{pricePerPerson.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[#c4b89a] text-[11px]">מחיר כולל</div>
                  <div
                    className="text-[#ff8c00] text-[32px]"
                    style={{ fontWeight: 700 }}
                  >
                    ₪{totalPrice.toLocaleString()}
                  </div>
                  <div className="text-[#c4b89a] text-[11px]">
                    כולל מע"מ על בסיס {participants} משתתפים
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {!confirmed && (
                <>
                  <button
                    className="flex items-center gap-2 rounded-xl bg-[#ff8c00] px-8 py-3 text-white shadow-[#ff8c00]/20 shadow-lg transition-all hover:bg-[#e67e00]"
                    onClick={handleApprove}
                    style={{ fontWeight: 700 }}
                    type="button"
                  >
                    <Check size={18} />
                    אישור הזמנה
                  </button>
                  <button
                    className="flex items-center gap-2 rounded-xl border border-[#c4b89a]/40 px-6 py-3 text-[#c4b89a] transition-colors hover:bg-white/5"
                    onClick={() => setShowChangeRequest(true)}
                    type="button"
                  >
                    <MessageSquare size={16} />
                    בקשת שינויים
                  </button>
                </>
              )}
              <button
                className="flex items-center gap-2 rounded-xl border border-[#c4b89a]/40 px-6 py-3 text-[#c4b89a] transition-colors hover:bg-white/5"
                onClick={async () => {
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: `הצעת מחיר — ${projectName}`,
                        url: window.location.href,
                      });
                    } else {
                      await navigator.clipboard.writeText(window.location.href);
                      appToast.success("קישור הועתק", "קישור ההצעה הועתק ללוח");
                    }
                  } catch {
                    /* user cancelled share dialog */
                  }
                }}
                type="button"
              >
                <Share2 size={16} /> שיתוף
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Post-approval confirmation overlay */}
      {confirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
          <div className="mx-4 max-w-md text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <Check className="text-green-600" size={48} />
            </div>
            <h2
              className="mb-2 text-[#181510] text-[28px]"
              style={{ fontWeight: 700 }}
            >
              ההזמנה אושרה!
            </h2>
            <p className="mb-1 text-[#8d785e] text-[16px]">{projectName}</p>
            {quoteData?.date && (
              <p className="mb-4 text-[#8d785e] text-[14px]">
                {quoteData.date}
              </p>
            )}
            <p
              className="mb-6 text-[#181510] text-[16px]"
              style={{ fontWeight: 600 }}
            >
              נציג יצור איתך קשר בקרוב
            </p>
            <button
              className="flex items-center gap-2 rounded-xl border border-[#e7e1da] px-6 py-3 text-[#8d785e] text-[14px] opacity-50"
              disabled
              type="button"
            >
              <Download size={16} />
              הורד PDF
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 bg-[#181510] py-8 text-white">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff8c00]">
                <span className="text-[14px] text-white">✈</span>
              </div>
              <span className="text-[16px]" style={{ fontWeight: 700 }}>
                TravelPro
              </span>
            </div>
            <div className="text-[#8d785e] text-[12px]">
              &copy; 2026 TravelPro Productions
            </div>
            <div className="flex gap-4 text-[#8d785e] text-[12px]">
              <span>info@travelpro.co.il</span>
              <span>073-123-4567</span>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-[#8d785e] text-[12px]">
            <button
              className="transition-colors hover:text-white"
              type="button"
            >
              תנאי שימוש
            </button>
            <button
              className="transition-colors hover:text-white"
              type="button"
            >
              מדיניות פרטיות
            </button>
            <button
              className="transition-colors hover:text-white"
              type="button"
            >
              אודות
            </button>
          </div>
        </div>
      </footer>

      {/* Versions modal */}
      {showVersions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowVersions(false)}
          onKeyDown={(e) => e.key === "Escape" && e.currentTarget.click()}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <h3
              className="mb-4 text-[#181510] text-[20px]"
              style={{ fontWeight: 700 }}
            >
              גרסאות הצעה
            </h3>
            <div className="space-y-2">
              {[
                {
                  version: "V1.0",
                  date: "15.03.2024",
                  price: `₪${totalPrice.toLocaleString()}`,
                  status: "נוכחית",
                  active: true,
                },
                {
                  version: "V0.9",
                  date: "12.03.2024",
                  price: "₪45,000",
                  status: "ארכיון",
                  active: false,
                },
                {
                  version: "V0.8",
                  date: "10.03.2024",
                  price: "₪48,000",
                  status: "ארכיון",
                  active: false,
                },
              ].map((v) => (
                <div
                  className={`flex items-center justify-between rounded-xl border p-3 ${v.active ? "border-[#ff8c00] bg-[#ff8c00]/5" : "border-[#e7e1da]"}`}
                  key={v.version}
                >
                  <div>
                    <div
                      className="text-[#181510] text-[14px]"
                      style={{ fontWeight: 600 }}
                    >
                      {v.version}
                    </div>
                    <div className="text-[#8d785e] text-[12px]">
                      {v.date} &bull; {v.price}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${v.active ? "bg-[#ff8c00] text-white" : "bg-[#f5f3f0] text-[#8d785e]"}`}
                    style={{ fontWeight: 600 }}
                  >
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full rounded-xl border border-[#e7e1da] py-2 text-[#8d785e] text-[14px] transition-colors hover:bg-[#f5f3f0]"
              onClick={() => setShowVersions(false)}
              type="button"
            >
              סגור
            </button>
          </div>
        </div>
      )}

      {/* Signature modal */}
      {projectId && (
        <ClientQuoteSignature
          isOpen={showSignature}
          onClose={() => setShowSignature(false)}
          onSigned={handleSigned}
          projectId={projectId}
        />
      )}

      {/* Change request modal */}
      {projectId && (
        <ClientQuoteChangeRequest
          isOpen={showChangeRequest}
          items={changeRequestItems}
          onClose={() => setShowChangeRequest(false)}
          onSubmitted={() => {
            setShowChangeRequest(false);
            appToast.success("הבקשה נשלחה", "המפיק יבדוק את הבקשה שלך");
          }}
          projectId={projectId}
        />
      )}
    </div>
  );
}
