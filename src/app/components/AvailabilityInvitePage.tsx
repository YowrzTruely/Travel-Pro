import { useQuery } from "convex/react";
import {
  AlertCircle,
  Calendar,
  Loader2,
  LogIn,
  MapPin,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import { useAuth } from "./AuthContext";

export function AvailabilityInvitePage() {
  const { token } = useParams();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const inviteData = useQuery(
    api.publicAvailabilityInvite.getByToken,
    token ? { token } : "skip"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loading state
  if (inviteData === undefined) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#f8f7f5]"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#ff8c00]" />
          <p className="font-['Assistant',sans-serif] text-[#8d785e] text-[15px]">
            טוען פרטי הזמנה...
          </p>
        </div>
      </div>
    );
  }

  // Invalid or expired token
  if (!inviteData || inviteData.expired || inviteData.registered) {
    const message = inviteData?.expired
      ? "הקישור פג תוקף"
      : inviteData?.registered
        ? "הקישור כבר נוצל"
        : "קישור לא תקין";

    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-[#f8f7f5] p-6"
        dir="rtl"
      >
        <div className="w-full max-w-md space-y-6 text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="text-red-500" size={32} />
          </span>
          <h1
            className="text-[#181510] text-[24px]"
            style={{ fontWeight: 700 }}
          >
            {message}
          </h1>
          <p className="text-[#8d785e] text-[14px]">
            ניתן להירשם כספק דרך הקישור הכללי
          </p>
          <Link
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#ff8c00] px-6 text-[14px] text-white transition-colors hover:bg-[#e67e00]"
            style={{ fontWeight: 600 }}
            to="/register/supplier"
          >
            <UserPlus size={16} />
            הרשמה כספק
          </Link>
        </div>
      </div>
    );
  }

  // Valid token — show context + registration form
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await signup(email, password, name, "supplier");
      if (result.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }

      // Wait briefly for profile to be created, then link
      // The linkRegisteredUser will be called once we have the userId
      // For now, store token in sessionStorage so post-login can link
      sessionStorage.setItem("pendingInviteToken", token);

      appToast.success("נרשמת בהצלחה! מעביר לפורטל הספק...");

      // Navigate to home — the onboarding flow will kick in
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("שגיאה ברישום. נסה שוב.");
    } finally {
      setSubmitting(false);
    }
  };

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
            {inviteData.producerName
              ? `${inviteData.producerName} שלח/ה לך בקשת זמינות`
              : "קיבלת בקשה לבדיקת זמינות"}
          </p>
        </div>

        {/* Event context card */}
        <div className="rounded-xl border border-[#e7e1da] bg-white p-5">
          <h2
            className="mb-3 text-[#181510] text-[16px]"
            style={{ fontWeight: 600 }}
          >
            פרטי האירוע
          </h2>
          <div className="space-y-2">
            {inviteData.projectName && (
              <div className="flex items-center gap-2 text-[#5c5347] text-sm">
                <MapPin className="shrink-0 text-[#8d785e]" size={14} />
                <span>{inviteData.projectName}</span>
              </div>
            )}
            {inviteData.date && (
              <div className="flex items-center gap-2 text-[#5c5347] text-sm">
                <Calendar className="shrink-0 text-[#8d785e]" size={14} />
                <span>{inviteData.date}</span>
              </div>
            )}
            {(inviteData.participants ?? 0) > 0 && (
              <div className="flex items-center gap-2 text-[#5c5347] text-sm">
                <Users className="shrink-0 text-[#8d785e]" size={14} />
                <span>{inviteData.participants} משתתפים</span>
              </div>
            )}
            {inviteData.productName && (
              <div className="flex items-center gap-2 text-[#5c5347] text-sm">
                <span className="shrink-0 text-[#8d785e] text-xs">📦</span>
                <span>{inviteData.productName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Registration form */}
        <form
          className="rounded-xl border border-[#e7e1da] bg-white p-5"
          onSubmit={handleRegister}
        >
          <h2
            className="mb-4 text-[#181510] text-[16px]"
            style={{ fontWeight: 600 }}
          >
            הרשמה כספק
          </h2>

          {error && (
            <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              className="w-full rounded-lg border border-[#d4c9b8] px-4 py-2.5 text-right text-sm focus:outline-none focus:ring-1 focus:ring-[#ff8c00]"
              onChange={(e) => setName(e.target.value)}
              placeholder="שם מלא / שם עסק *"
              required
              type="text"
              value={name}
            />
            <input
              className="w-full rounded-lg border border-[#d4c9b8] px-4 py-2.5 text-right text-sm focus:outline-none focus:ring-1 focus:ring-[#ff8c00]"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="אימייל *"
              required
              type="email"
              value={email}
            />
            <input
              className="w-full rounded-lg border border-[#d4c9b8] px-4 py-2.5 text-right text-sm focus:outline-none focus:ring-1 focus:ring-[#ff8c00]"
              defaultValue={inviteData.supplierPhone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="טלפון"
              type="tel"
              value={phone || inviteData.supplierPhone}
            />
            <input
              className="w-full rounded-lg border border-[#d4c9b8] px-4 py-2.5 text-right text-sm focus:outline-none focus:ring-1 focus:ring-[#ff8c00]"
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה (לפחות 6 תווים) *"
              required
              type="password"
              value={password}
            />
          </div>

          <button
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-3 font-semibold text-[14px] text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
            disabled={submitting}
            type="submit"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus size={16} />
                הרשמה וצפייה בבקשה
              </>
            )}
          </button>
        </form>

        {/* Already registered link */}
        <div className="text-center">
          <Link
            className="inline-flex items-center gap-2 text-[#8d785e] text-[14px] transition-colors hover:text-[#ff8c00]"
            to="/"
          >
            <LogIn size={14} />
            כבר רשום? התחבר כאן
          </Link>
        </div>
      </div>
    </div>
  );
}
