import { ArrowRight, Construction } from "lucide-react";
import { useNavigate } from "react-router";

interface PlaceholderPageProps {
  description: string;
  icon: string;
  title: string;
}

export function PlaceholderPage({
  title,
  description,
  icon,
}: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div
      className="mx-auto max-w-[800px] p-4 font-['Assistant',sans-serif] lg:p-6"
      dir="rtl"
    >
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#ff8c00]/10">
          <span className="text-[40px]">{icon}</span>
        </div>
        <h1
          className="mb-2 text-[#181510] text-[28px]"
          style={{ fontWeight: 700 }}
        >
          {title}
        </h1>
        <p className="mb-2 max-w-md text-[#8d785e] text-[16px]">
          {description}
        </p>
        <div
          className="mb-8 flex items-center gap-2 text-[#ff8c00] text-[14px]"
          style={{ fontWeight: 600 }}
        >
          <Construction size={16} />
          <span>בפיתוח - צפוי בגרסה הבאה</span>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-[#181510] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#2a2518]"
          onClick={() => navigate("/")}
          style={{ fontWeight: 600 }}
          type="button"
        >
          <ArrowRight size={16} />
          חזרה ללוח בקרה
        </button>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <PlaceholderPage
      description="הדף שחיפשת אינו קיים. ייתכן שהקישור שגוי או שהדף הוסר."
      icon="🔍"
      title="הדף לא נמצא"
    />
  );
}
