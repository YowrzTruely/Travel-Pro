import { useNavigate } from 'react-router';
import { ArrowRight, Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: string;
}

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="p-4 lg:p-6 max-w-[800px] mx-auto font-['Assistant',sans-serif]" dir="rtl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-[#ff8c00]/10 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-[40px]">{icon}</span>
        </div>
        <h1 className="text-[28px] text-[#181510] mb-2" style={{ fontWeight: 700 }}>{title}</h1>
        <p className="text-[16px] text-[#8d785e] mb-2 max-w-md">{description}</p>
        <div className="flex items-center gap-2 text-[14px] text-[#ff8c00] mb-8" style={{ fontWeight: 600 }}>
          <Construction size={16} />
          <span>בפיתוח - צפוי בגרסה הבאה</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[14px] text-white bg-[#181510] hover:bg-[#2a2518] px-5 py-2.5 rounded-xl transition-colors"
          style={{ fontWeight: 600 }}
        >
          <ArrowRight size={16} />
          חזרה ללוח בקרה
        </button>
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <PlaceholderPage
      title="הגדרות"
      description="הגדרות מערכת, פרופיל משתמש והתאמות אישיות."
      icon="⚙️"
    />
  );
}

export function NotFoundPage() {
  return (
    <PlaceholderPage
      title="הדף לא נמצא"
      description="הדף שחיפשת אינו קיים. ייתכן שהקישור שגוי או שהדף הוסר."
      icon="🔍"
    />
  );
}
