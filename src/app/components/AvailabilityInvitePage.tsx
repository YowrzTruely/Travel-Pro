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
        className="flex min-h-screen items-center justify-center bg-background"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="font-['Assistant',sans-serif] text-[15px] text-muted-foreground">
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
        className="flex min-h-screen flex-col items-center justify-center bg-background p-6"
        dir="rtl"
      >
        <div className="w-full max-w-md space-y-6 text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
            <AlertCircle className="text-destructive" size={32} />
          </span>
          <h1
            className="text-[24px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            {message}
          </h1>
          <p className="text-[14px] text-muted-foreground">
            ניתן להירשם כספק דרך הקישור הכללי
          </p>
          <Link
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[14px] text-white transition-colors hover:bg-primary-hover"
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
      className="flex min-h-screen flex-col items-center justify-center bg-background p-6"
      dir="rtl"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="text-primary" size={32} />
          </span>
          <h1
            className="mt-4 text-[24px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            בקשת זמינות
          </h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            {inviteData.producerName
              ? `${inviteData.producerName} שלח/ה לך בקשת זמינות`
              : "קיבלת בקשה לבדיקת זמינות"}
          </p>
        </div>

        {/* Event context card */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2
            className="mb-3 text-[16px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            פרטי האירוע
          </h2>
          <div className="space-y-2">
            {inviteData.projectName && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="shrink-0 text-muted-foreground" size={14} />
                <span>{inviteData.projectName}</span>
              </div>
            )}
            {inviteData.date && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar
                  className="shrink-0 text-muted-foreground"
                  size={14}
                />
                <span>{inviteData.date}</span>
              </div>
            )}
            {(inviteData.participants ?? 0) > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Users className="shrink-0 text-muted-foreground" size={14} />
                <span>{inviteData.participants} משתתפים</span>
              </div>
            )}
            {inviteData.productName && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span className="shrink-0 text-muted-foreground text-xs">
                  📦
                </span>
                <span>{inviteData.productName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Registration form */}
        <form
          className="rounded-xl border border-border bg-card p-5"
          onSubmit={handleRegister}
        >
          <h2
            className="mb-4 text-[16px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            הרשמה כספק
          </h2>

          {error && (
            <div className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              className="w-full rounded-lg border border-border px-4 py-2.5 text-right text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setName(e.target.value)}
              placeholder="שם מלא / שם עסק *"
              required
              type="text"
              value={name}
            />
            <input
              className="w-full rounded-lg border border-border px-4 py-2.5 text-right text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="אימייל *"
              required
              type="email"
              value={email}
            />
            <input
              className="w-full rounded-lg border border-border px-4 py-2.5 text-right text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              defaultValue={inviteData.supplierPhone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="טלפון"
              type="tel"
              value={phone || inviteData.supplierPhone}
            />
            <input
              className="w-full rounded-lg border border-border px-4 py-2.5 text-right text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה (לפחות 6 תווים) *"
              required
              type="password"
              value={password}
            />
          </div>

          <button
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-[14px] text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
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
            className="inline-flex items-center gap-2 text-[14px] text-muted-foreground transition-colors hover:text-primary"
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
