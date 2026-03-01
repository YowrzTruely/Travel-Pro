import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { ArrowRight, AlertTriangle, Home } from 'lucide-react';

export function RootErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'שגיאה לא צפויה';
  let description = 'משהו השתבש. נסה לרענן את הדף.';
  let icon = '⚠️';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'הדף לא נמצא';
      description = 'הדף שחיפשת אינו קיים. ייתכן שהקישור שגוי או שהדף הוסר.';
      icon = '🔍';
    } else {
      title = `שגיאה ${error.status}`;
      description = error.statusText || 'אירעה שגיאה בטעינת הדף.';
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center p-4 font-['Assistant',sans-serif]" dir="rtl">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-[#ff8c00]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <span className="text-[40px]">{icon}</span>
        </div>
        <h1 className="text-[28px] text-[#181510] mb-2" style={{ fontWeight: 700 }}>{title}</h1>
        <p className="text-[16px] text-[#8d785e] mb-8">{description}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[14px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-5 py-2.5 rounded-xl transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Home size={16} />
            חזרה לדף הבית
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-[14px] text-[#6b5d45] border border-[#e7e1da] px-5 py-2.5 rounded-xl hover:bg-[#f5f3f0] transition-colors"
          >
            רענן דף
          </button>
        </div>
      </div>
    </div>
  );
}
