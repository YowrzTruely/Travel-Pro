import { ArrowRight, Check, Edit2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { appToast } from "./AppToast";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const DRILL_IMG =
  "https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGRyaWxsJTIwY29uc3RydWN0aW9uJTIwdG9vbHxlbnwxfHx8fDE3NzE0NjgyMzh8MA&ixlib=rb-4.1.0&q=80&w=1080";
const CABINET_IMG =
  "https://images.unsplash.com/photo-1755870190789-113202c5096c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBzdG9yYWdlJTIwY2FiaW5ldCUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MTQ2ODIzOHww&ixlib=rb-4.1.0&q=80&w=1080";
const HOTEL_IMG =
  "https://images.unsplash.com/photo-1708107243243-557a2cad3cf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGxvYmJ5JTIwbHV4dXJ5JTIwcmVjZXB0aW9ufGVufDF8fHx8MTc3MTQ2ODI0M3ww&ixlib=rb-4.1.0&q=80&w=1080";

interface Product {
  approved?: boolean;
  category: string;
  description: string;
  id: string;
  image: string;
  name: string;
  price: number;
  removed?: boolean;
  sourceUrl: string;
  status: "complete" | "incomplete";
}

export function ScannedProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "מקדחה חשמלית 18V - Brushless",
      description:
        "מקדחות אימפקט מקצועית מסדרת ה-XR, מנוע ללא פחמים לאורך חיים ממושך. כולל 2 סוללות 5.0Ah ומטען מהיר במזוודה קשיחה.",
      price: 849.0,
      category: "כלי עבודה חשמליים",
      sourceUrl: "https://supplier-site.com/tools/drill-v18",
      status: "complete",
      image: DRILL_IMG,
    },
    {
      id: "2",
      name: "ארון כלים מודולרי 7 מגירות",
      description:
        "מערכת אחסון מקצועית למוסכים ומדראות. עשוי פלדה עמידה עם ציפוי נגד חלודה, גלגלים מחוזקים עם נעילה ומכנגנון מגיעת פתיחה כפולה.",
      price: 1250.0,
      category: "אחסון ומדפים",
      sourceUrl: "https://supplier-site.com/storage/cabinet-7drw",
      status: "complete",
      image: CABINET_IMG,
    },
    {
      id: "3",
      name: 'ערכת בטיחות "SafeWork"',
      description:
        "המוצר לא הצליח להמיר תיאור מלא מהדף. מומלץ לגשת לקישור המקור ולהוסיף תיאור ידנית.",
      price: 0,
      category: "",
      sourceUrl: "https://supplier-site.com/p/safety-kit-2024",
      status: "incomplete",
      image: HOTEL_IMG,
    },
  ]);

  const approveProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, approved: true } : p))
    );
    appToast.success("המוצר אושר והוסף לקטלוג");
  };

  const removeProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, removed: true } : p))
    );
    appToast.neutral("המוצר הוסר מהרשימה");
  };

  const activeProducts = products.filter((p) => !p.removed);
  const approvedCount = activeProducts.filter((p) => p.approved).length;
  const incompleteCount = activeProducts.filter(
    (p) => p.status === "incomplete"
  ).length;

  return (
    <div
      className="min-h-full bg-[#f8f7f5] font-['Assistant',sans-serif]"
      dir="rtl"
    >
      {/* Header */}
      <div className="border-[#e7e1da] border-b bg-white px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="text-[#8d785e] transition-colors hover:text-[#181510]"
            onClick={() => navigate("/suppliers")}
            type="button"
          >
            <ArrowRight size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff8c00]/10">
              <span className="text-[16px]">🔍</span>
            </div>
            <h1
              className="text-[#181510] text-[22px]"
              style={{ fontWeight: 700 }}
            >
              ניהול ספקים
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto space-y-6 p-4 lg:p-6">
        {/* Title */}
        <div className="text-center">
          <span
            className="rounded-full bg-green-50 px-3 py-1 text-[12px] text-green-600"
            style={{ fontWeight: 600 }}
          >
            ✨ סריקה אוטומטית הושלמה
          </span>
          <h2
            className="mt-3 text-[#181510] text-[26px]"
            style={{ fontWeight: 700 }}
          >
            מוצרים מוצעים מסריקת אתר
          </h2>
          <p className="mx-auto mt-1 max-w-xl text-[#8d785e] text-[14px]">
            האלגוריתם שלנו זיהה מוצרים חדשים באתר הספק. באפשרותך לאשר אותם
            להוספה לקטלוג, לערוך את הפרטים או להסיר פריטים שאינם רלוונטיים.
          </p>
        </div>

        {/* Products */}
        <div className="space-y-5">
          {activeProducts.map((product) => (
            <div
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
                product.approved
                  ? "border-green-200"
                  : product.status === "incomplete"
                    ? "border-yellow-200"
                    : "border-[#e7e1da]"
              }`}
              key={product.id}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative h-48 shrink-0 overflow-hidden bg-[#f5f3f0] md:h-auto md:w-72">
                  <ImageWithFallback
                    alt={product.name}
                    className="h-full w-full object-cover"
                    src={product.image}
                  />
                  {product.status === "complete" && !product.approved && (
                    <span
                      className="absolute top-3 right-3 rounded-md bg-[#ff8c00] px-2 py-0.5 text-[11px] text-white"
                      style={{ fontWeight: 600 }}
                    >
                      ✓ אימות בוצע
                    </span>
                  )}
                  {product.status === "incomplete" && (
                    <span
                      className="absolute top-3 right-3 rounded-md bg-yellow-500 px-2 py-0.5 text-[11px] text-white"
                      style={{ fontWeight: 600 }}
                    >
                      ⚠ נדרש אימות
                    </span>
                  )}
                  {product.approved && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/10">
                      <div className="rounded-full bg-green-500 p-2 text-white">
                        <Check size={24} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <div className="mb-0.5 text-[#8d785e] text-[11px]">
                        שם מוצר שזוהה
                      </div>
                      <h3
                        className="text-[#181510] text-[18px]"
                        style={{ fontWeight: 700 }}
                      >
                        {product.name}
                      </h3>
                    </div>
                    <div className="text-left">
                      <div className="mb-0.5 text-[#8d785e] text-[11px]">
                        הערכת מחיר
                      </div>
                      <div
                        className="text-[#ff8c00] text-[20px]"
                        style={{ fontWeight: 700 }}
                      >
                        {product.price > 0
                          ? `₪${product.price.toFixed(2)}`
                          : "₪ ???"}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-0.5 text-[#8d785e] text-[11px]">
                      תיאור מוצר
                    </div>
                    <p className="text-[#6b5d45] text-[13px]">
                      {product.description}
                    </p>
                  </div>

                  {product.category && (
                    <div className="mb-2 text-[#8d785e] text-[12px]">
                      <span>🏷️ {product.category}</span>
                    </div>
                  )}

                  <div className="mb-4 flex items-center gap-2">
                    <a
                      className="flex items-center gap-1 text-[#ff8c00] text-[12px] hover:text-[#e67e00]"
                      href={product.sourceUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      🔗 {product.sourceUrl}
                    </a>
                    <span className="text-[#c4b89a] text-[12px]">|</span>
                    <span className="text-[#8d785e] text-[12px]">
                      🔒 פרטנות אחסון
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {!product.approved && product.status === "complete" && (
                      <>
                        <button
                          className="flex items-center gap-1.5 rounded-lg bg-[#ff8c00] px-4 py-2 text-[13px] text-white transition-colors hover:bg-[#e67e00]"
                          onClick={() => approveProduct(product.id)}
                          style={{ fontWeight: 600 }}
                          type="button"
                        >
                          <Check size={14} /> אישור מוצר
                        </button>
                        <button
                          className="flex items-center gap-1.5 rounded-lg border border-[#ff8c00] px-4 py-2 text-[#ff8c00] text-[13px] transition-colors hover:bg-[#ff8c00]/5"
                          style={{ fontWeight: 600 }}
                          type="button"
                        >
                          <Edit2 size={14} /> עריכת פרטים
                        </button>
                      </>
                    )}
                    {product.status === "incomplete" && (
                      <button
                        className="flex items-center gap-1.5 rounded-lg border border-[#ff8c00] px-4 py-2 text-[#ff8c00] text-[13px] transition-colors hover:bg-[#ff8c00]/5"
                        style={{ fontWeight: 600 }}
                        type="button"
                      >
                        <Edit2 size={14} /> השלמת פרטים חסרים
                      </button>
                    )}
                    {product.approved && (
                      <span
                        className="flex items-center gap-1 text-[13px] text-green-600"
                        style={{ fontWeight: 600 }}
                      >
                        <Check size={14} /> אושר והוסף לקטלוג
                      </span>
                    )}
                    <button
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[#8d785e] text-[13px] transition-colors hover:text-red-500"
                      onClick={() => removeProduct(product.id)}
                      type="button"
                    >
                      הסרה
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e7e1da] bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px]">📊</span>
            <div
              className="text-[#181510] text-[14px]"
              style={{ fontWeight: 700 }}
            >
              סיכום סריקה
            </div>
            <span className="text-[#8d785e] text-[12px]">
              {activeProducts.length} מוצרים נמצאו &bull; {approvedCount} אושרו
              &bull; {incompleteCount} דורשים השלמה
            </span>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-[#e7e1da] px-4 py-2 text-[#8d785e] text-[13px] transition-colors hover:bg-[#f5f3f0]"
              onClick={() => navigate("/suppliers")}
              type="button"
            >
              סגירה
            </button>
            <button
              className="rounded-lg bg-[#ff8c00] px-4 py-2 text-[13px] text-white transition-colors hover:bg-[#e67e00]"
              onClick={() => {
                appToast.success(
                  "הسكירה הושלמה בהצלחה!",
                  "כל המוצרים עודכנו בקטלוג"
                );
                navigate("/suppliers");
              }}
              style={{ fontWeight: 600 }}
              type="button"
            >
              אישור וסיום סקירה
            </button>
          </div>
        </div>

        <div className="py-4 text-center text-[#8d785e] text-[12px]">
          מערכת ניהול ספקים חכמה © 2024 &bull; הופעל על ידי בינה מלאכותית
        </div>
      </div>
    </div>
  );
}
