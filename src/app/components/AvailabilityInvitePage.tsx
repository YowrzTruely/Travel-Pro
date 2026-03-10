import { Calendar, CheckCircle, LogIn, UserPlus } from "lucide-react";
import { Link, useParams } from "react-router";

export function AvailabilityInvitePage() {
  const { token } = useParams();

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#f8f7f5] p-6"
      dir="rtl"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ff8c00]/10">
            <Calendar className="text-[#ff8c00]" size={32} />
          </span>
          <h1
            className="mt-4 text-[#181510] text-[24px]"
            style={{ fontWeight: 700 }}
          >
            בקשת זמינות
          </h1>
          <p className="mt-2 text-[#8d785e] text-[14px]">
            קיבלת בקשה לבדיקת זמינות מאחד המפיקים שלנו
          </p>
          {token && (
            <p className="mt-1 text-[#b8a990] text-[12px]">מזהה: {token}</p>
          )}
        </div>

        {/* Instructions */}
        <div className="rounded-xl border border-[#e7e1da] bg-white p-6">
          <h2
            className="mb-4 text-[#181510] text-[16px]"
            style={{ fontWeight: 600 }}
          >
            איך להמשיך?
          </h2>

          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff8c00]/10 text-[#ff8c00]">
                <UserPlus size={16} />
              </span>
              <div>
                <p
                  className="text-[#181510] text-[14px]"
                  style={{ fontWeight: 600 }}
                >
                  ספק חדש?
                </p>
                <p className="text-[#8d785e] text-[13px]">
                  הירשם כספק וצור פרופיל עסקי. לאחר הרישום תוכל לצפות בבקשות
                  ולהגיב עליהן.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22c55e]/10 text-[#22c55e]">
                <LogIn size={16} />
              </span>
              <div>
                <p
                  className="text-[#181510] text-[14px]"
                  style={{ fontWeight: 600 }}
                >
                  ספק רשום?
                </p>
                <p className="text-[#8d785e] text-[13px]">
                  התחבר לחשבון שלך ועבור ללשונית "בקשות" כדי לצפות בבקשת הזמינות
                  ולהגיב.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-[#3b82f6]">
                <CheckCircle size={16} />
              </span>
              <div>
                <p
                  className="text-[#181510] text-[14px]"
                  style={{ fontWeight: 600 }}
                >
                  אישור אוטומטי
                </p>
                <p className="text-[#8d785e] text-[13px]">
                  ספק שמאשר בקשת זמינות מקבל שריון אוטומטי לתאריך המבוקש.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] text-[14px] text-white transition-colors hover:bg-[#e67e00]"
            style={{ fontWeight: 600 }}
            to="/register/supplier"
          >
            <UserPlus size={16} />
            הרשמה כספק
          </Link>
          <Link
            className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#e7e1da] bg-white text-[#181510] text-[14px] transition-colors hover:bg-[#f5f3f0]"
            style={{ fontWeight: 600 }}
            to="/"
          >
            <LogIn size={16} />
            כניסה
          </Link>
        </div>
      </div>
    </div>
  );
}
