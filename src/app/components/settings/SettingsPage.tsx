import { useAction, useMutation } from "convex/react";
import { Camera, Loader2, LogOut, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useAuth } from "../AuthContext";
import { useImageUpload } from "../hooks/useImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

/* ─── Types ─────────────────────────────────────────────────── */

interface ProfileFormData {
  company: string;
  email: string;
  name: string;
  phone: string;
}

interface NotificationFormData {
  email: boolean;
  inApp: boolean;
  sms: boolean;
  whatsapp: boolean;
}

interface PricingFormData {
  defaultMarginPercent: number;
}

interface PasswordFormData {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
}

/* ─── Shared styles ─────────────────────────────────────────── */

const cardClass = "rounded-2xl border border-[#e7e1da] bg-white p-6 shadow-sm";
const labelClass = "mb-1 block text-sm font-semibold text-[#181510]";
const inputClass =
  "w-full rounded-xl border border-[#e7e1da] bg-[#f8f7f5] px-4 py-2.5 text-sm text-[#181510] outline-none transition focus:border-[#ff8c00] focus:ring-2 focus:ring-[#ff8c00]/20 font-['Assistant',sans-serif]";
const btnPrimaryClass =
  "inline-flex items-center gap-2 rounded-xl bg-[#ff8c00] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e07b00] disabled:opacity-50";
const btnDangerClass =
  "inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700";

/* ─── Component ─────────────────────────────────────────────── */

export function SettingsPage() {
  const { profile, logout } = useAuth();
  const updateProfile = useMutation(api.users.updateProfile);
  const { upload } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Profile form ── */
  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
      company: profile?.company ?? "",
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone ?? "",
        company: profile.company ?? "",
      });
    }
  }, [profile, profileForm]);

  const onSaveProfile = async (data: ProfileFormData) => {
    if (!profile) {
      return;
    }
    try {
      await updateProfile({
        id: profile.id as Id<"users">,
        name: data.name,
        phone: data.phone || undefined,
        company: data.company || undefined,
      });
      appToast.success("הפרופיל עודכן", "הפרטים נשמרו בהצלחה");
    } catch {
      appToast.error("שגיאה", "לא ניתן לעדכן את הפרופיל");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!(file && profile)) {
      return;
    }
    try {
      const storageId = await upload(file);
      await updateProfile({
        id: profile.id as Id<"users">,
        avatar: storageId,
      });
      appToast.success("תמונה עודכנה", "התמונה הועלתה בהצלחה");
    } catch {
      appToast.error("שגיאה", "לא ניתן להעלות את התמונה");
    }
  };

  /* ── Notification form ── */
  const notifForm = useForm<NotificationFormData>({
    defaultValues: {
      inApp: profile?.notificationPreferences?.inApp ?? true,
      email: profile?.notificationPreferences?.email ?? true,
      sms: profile?.notificationPreferences?.sms ?? false,
      whatsapp: profile?.notificationPreferences?.whatsapp ?? false,
    },
  });

  useEffect(() => {
    if (profile?.notificationPreferences) {
      notifForm.reset({
        inApp: profile.notificationPreferences.inApp ?? true,
        email: profile.notificationPreferences.email ?? true,
        sms: profile.notificationPreferences.sms ?? false,
        whatsapp: profile.notificationPreferences.whatsapp ?? false,
      });
    }
  }, [profile, notifForm]);

  const onSaveNotifications = async (data: NotificationFormData) => {
    if (!profile) {
      return;
    }
    try {
      await updateProfile({
        id: profile.id as Id<"users">,
        notificationPreferences: {
          inApp: data.inApp,
          email: data.email,
          sms: data.sms,
          whatsapp: data.whatsapp,
        },
      });
      appToast.success("התראות עודכנו", "העדפות ההתראות נשמרו");
    } catch {
      appToast.error("שגיאה", "לא ניתן לעדכן את ההתראות");
    }
  };

  /* ── Pricing form ── */
  const pricingForm = useForm<PricingFormData>({
    defaultValues: {
      defaultMarginPercent: profile?.defaultMarginPercent ?? 15,
    },
  });

  useEffect(() => {
    if (profile?.defaultMarginPercent !== undefined) {
      pricingForm.reset({
        defaultMarginPercent: profile.defaultMarginPercent,
      });
    }
  }, [profile, pricingForm]);

  const onSavePricing = async (data: PricingFormData) => {
    if (!profile) {
      return;
    }
    try {
      await updateProfile({
        id: profile.id as Id<"users">,
        defaultMarginPercent: Number(data.defaultMarginPercent),
      });
      appToast.success("תמחור עודכן", "אחוז הרווח נשמר בהצלחה");
    } catch {
      appToast.error("שגיאה", "לא ניתן לעדכן את התמחור");
    }
  };

  /* ── Password form (stub) ── */
  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePassword = useAction(api.passwordChange.changePassword);
  const [changingPassword, setChangingPassword] = useState(false);

  const onChangePassword = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      appToast.error("שגיאה", "הסיסמאות אינן תואמות");
      return;
    }

    setChangingPassword(true);
    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (result.success) {
        appToast.success("סיסמה שונתה", "הסיסמה עודכנה בהצלחה");
        passwordForm.reset();
      } else {
        appToast.error("שגיאה", result.error || "לא ניתן לשנות את הסיסמה");
      }
    } catch {
      appToast.error("שגיאה", "לא ניתן לשנות את הסיסמה");
    } finally {
      setChangingPassword(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <p className="font-['Assistant',sans-serif] text-[#8d785e] text-sm">
          טוען...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f8f7f5] p-6 font-['Assistant',sans-serif]"
      dir="rtl"
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <h1 className="mb-6 font-bold text-2xl text-[#181510]">הגדרות</h1>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="profile">פרופיל</TabsTrigger>
            <TabsTrigger value="notifications">התראות</TabsTrigger>
            {profile.role === "producer" && (
              <TabsTrigger value="pricing">תמחור</TabsTrigger>
            )}
            <TabsTrigger value="account">חשבון</TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Profile ── */}
          <TabsContent value="profile">
            <div className={cardClass}>
              <h2 className="mb-4 font-bold text-[#181510] text-lg">
                פרטי פרופיל
              </h2>

              {/* Avatar */}
              <div className="mb-6 flex items-center gap-4">
                <button
                  className="group relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#e7e1da] bg-[#f8f7f5] transition hover:border-[#ff8c00]"
                  onClick={handleAvatarClick}
                  type="button"
                >
                  {profile.avatar ? (
                    <img
                      alt="avatar"
                      className="h-full w-full object-cover"
                      height={80}
                      src={profile.avatar}
                      width={80}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-2xl text-[#8d785e]">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                    <Camera className="text-white" size={20} />
                  </div>
                </button>
                <div>
                  <p className="font-semibold text-[#181510] text-sm">
                    תמונת פרופיל
                  </p>
                  <p className="text-[#8d785e] text-xs">
                    לחץ על התמונה כדי לשנות
                  </p>
                </div>
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  ref={fileInputRef}
                  type="file"
                />
              </div>

              {/* Profile fields */}
              <form
                className="space-y-4"
                onSubmit={profileForm.handleSubmit(onSaveProfile)}
              >
                <div>
                  <label className={labelClass} htmlFor="name">
                    שם מלא
                  </label>
                  <input
                    className={inputClass}
                    id="name"
                    {...profileForm.register("name", {
                      required: "שם הוא שדה חובה",
                    })}
                  />
                  {profileForm.formState.errors.name && (
                    <p className="mt-1 text-red-500 text-xs">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    אימייל
                  </label>
                  <input
                    className={`${inputClass} cursor-not-allowed opacity-60`}
                    id="email"
                    readOnly
                    {...profileForm.register("email")}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="phone">
                    טלפון
                  </label>
                  <input
                    className={inputClass}
                    id="phone"
                    type="tel"
                    {...profileForm.register("phone")}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="company">
                    חברה
                  </label>
                  <input
                    className={inputClass}
                    id="company"
                    {...profileForm.register("company")}
                  />
                </div>

                <div className="flex justify-start pt-2">
                  <button
                    className={btnPrimaryClass}
                    disabled={profileForm.formState.isSubmitting}
                    type="submit"
                  >
                    <Save size={16} />
                    שמור שינויים
                  </button>
                </div>
              </form>
            </div>
          </TabsContent>

          {/* ── Tab 2: Notifications ── */}
          <TabsContent value="notifications">
            <div className={cardClass}>
              <h2 className="mb-4 font-bold text-[#181510] text-lg">
                העדפות התראות
              </h2>

              <form
                className="space-y-4"
                onSubmit={notifForm.handleSubmit(onSaveNotifications)}
              >
                <NotificationToggle
                  description="קבל התראות בתוך המערכת"
                  label="בתוך האפליקציה"
                  register={notifForm.register("inApp")}
                />
                <NotificationToggle
                  description="קבל התראות באימייל"
                  label="אימייל"
                  register={notifForm.register("email")}
                />
                <NotificationToggle
                  description="קבל התראות ב-SMS"
                  label="SMS"
                  register={notifForm.register("sms")}
                />
                <NotificationToggle
                  description="קבל התראות בוואטסאפ"
                  label="וואטסאפ"
                  register={notifForm.register("whatsapp")}
                />

                <div className="flex justify-start pt-2">
                  <button
                    className={btnPrimaryClass}
                    disabled={notifForm.formState.isSubmitting}
                    type="submit"
                  >
                    <Save size={16} />
                    שמור העדפות
                  </button>
                </div>
              </form>
            </div>
          </TabsContent>

          {/* ── Tab 3: Pricing (producer only) ── */}
          {profile.role === "producer" && (
            <TabsContent value="pricing">
              <div className={cardClass}>
                <h2 className="mb-4 font-bold text-[#181510] text-lg">
                  הגדרות תמחור
                </h2>

                <form
                  className="space-y-4"
                  onSubmit={pricingForm.handleSubmit(onSavePricing)}
                >
                  <div>
                    <label
                      className={labelClass}
                      htmlFor="defaultMarginPercent"
                    >
                      אחוז רווח ברירת מחדל (%)
                    </label>
                    <input
                      className={`${inputClass} max-w-[200px]`}
                      id="defaultMarginPercent"
                      max={100}
                      min={0}
                      step={0.5}
                      type="number"
                      {...pricingForm.register("defaultMarginPercent", {
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "אחוז הרווח חייב להיות חיובי",
                        },
                        max: {
                          value: 100,
                          message: "אחוז הרווח לא יכול לעלות על 100",
                        },
                      })}
                    />
                    {pricingForm.formState.errors.defaultMarginPercent && (
                      <p className="mt-1 text-red-500 text-xs">
                        {
                          pricingForm.formState.errors.defaultMarginPercent
                            .message
                        }
                      </p>
                    )}
                    <p className="mt-2 text-[#8d785e] text-xs">
                      אחוז הרווח שיוחל כברירת מחדל על פריטי הצעת מחיר חדשים
                    </p>
                  </div>

                  <div className="flex justify-start pt-2">
                    <button
                      className={btnPrimaryClass}
                      disabled={pricingForm.formState.isSubmitting}
                      type="submit"
                    >
                      <Save size={16} />
                      שמור תמחור
                    </button>
                  </div>
                </form>
              </div>
            </TabsContent>
          )}

          {/* ── Tab 4: Account ── */}
          <TabsContent value="account">
            <div className="space-y-6">
              {/* Change password (stub) */}
              <div className={cardClass}>
                <h2 className="mb-4 font-bold text-[#181510] text-lg">
                  שינוי סיסמה
                </h2>

                <form
                  className="space-y-4"
                  onSubmit={passwordForm.handleSubmit(onChangePassword)}
                >
                  <div>
                    <label className={labelClass} htmlFor="currentPassword">
                      סיסמה נוכחית
                    </label>
                    <input
                      className={inputClass}
                      id="currentPassword"
                      type="password"
                      {...passwordForm.register("currentPassword", {
                        required: "שדה חובה",
                      })}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="newPassword">
                      סיסמה חדשה
                    </label>
                    <input
                      className={inputClass}
                      id="newPassword"
                      type="password"
                      {...passwordForm.register("newPassword", {
                        required: "שדה חובה",
                        minLength: {
                          value: 6,
                          message: "סיסמה חייבת להכיל לפחות 6 תווים",
                        },
                      })}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="confirmPassword">
                      אימות סיסמה חדשה
                    </label>
                    <input
                      className={inputClass}
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register("confirmPassword", {
                        required: "שדה חובה",
                      })}
                    />
                  </div>

                  <div className="flex justify-start pt-2">
                    <button
                      className={btnPrimaryClass}
                      disabled={changingPassword}
                      type="submit"
                    >
                      {changingPassword ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Save size={16} />
                      )}
                      {changingPassword ? "משנה סיסמה..." : "שנה סיסמה"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Logout */}
              <div className={cardClass}>
                <h2 className="mb-2 font-bold text-[#181510] text-lg">
                  התנתקות
                </h2>
                <p className="mb-4 text-[#8d785e] text-sm">
                  לחץ כדי להתנתק מהמערכת
                </p>
                <button
                  className={btnDangerClass}
                  onClick={() => logout()}
                  type="button"
                >
                  <LogOut size={16} />
                  התנתק
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ─── Sub-components ────────────────────────────────────────── */

function NotificationToggle({
  label,
  description,
  register,
}: {
  label: string;
  description: string;
  register: ReturnType<
    typeof useForm<NotificationFormData>
  >["register"] extends (...args: infer _A) => infer R
    ? R
    : never;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e7e1da] bg-[#f8f7f5] px-4 py-3 transition hover:border-[#ff8c00]/40">
      <div>
        <p className="font-semibold text-[#181510] text-sm">{label}</p>
        <p className="text-[#8d785e] text-xs">{description}</p>
      </div>
      <div className="relative">
        <input className="peer sr-only" type="checkbox" {...register} />
        <div className="h-6 w-11 rounded-full bg-[#e7e1da] transition peer-checked:bg-[#ff8c00]" />
        <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
      </div>
    </label>
  );
}
