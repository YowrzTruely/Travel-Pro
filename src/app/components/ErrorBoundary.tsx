import { Home } from "lucide-react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";

export function RootErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "שגיאה לא צפויה";
  let description = "משהו השתבש. נסה לרענן את הדף.";
  let icon = "⚠️";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "הדף לא נמצא";
      description = "הדף שחיפשת אינו קיים. ייתכן שהקישור שגוי או שהדף הוסר.";
      icon = "🔍";
    } else {
      title = `שגיאה ${error.status}`;
      description = error.statusText || "אירעה שגיאה בטעינת הדף.";
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#f8f7f5] p-4 font-['Assistant',sans-serif]"
      dir="rtl"
    >
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#ff8c00]/10">
          <span className="text-[40px]">{icon}</span>
        </div>
        <h1
          className="mb-2 text-[#181510] text-[28px]"
          style={{ fontWeight: 700 }}
        >
          {title}
        </h1>
        <p className="mb-8 text-[#8d785e] text-[16px]">{description}</p>
        <div className="flex justify-center gap-3">
          <button
            className="flex items-center gap-2 rounded-xl bg-[#ff8c00] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#e67e00]"
            onClick={() => navigate("/")}
            style={{ fontWeight: 600 }}
            type="button"
          >
            <Home size={16} />
            חזרה לדף הבית
          </button>
          <button
            className="flex items-center gap-2 rounded-xl border border-[#e7e1da] px-5 py-2.5 text-[#6b5d45] text-[14px] transition-colors hover:bg-[#f5f3f0]"
            onClick={() => window.location.reload()}
            type="button"
          >
            רענן דף
          </button>
        </div>
      </div>
    </div>
  );
}
