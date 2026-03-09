/**
 * LoginPage — combined login + signup with tab toggle.
 * Hebrew RTL, warm palette matching TravelPro design.
 */

import imgLogo from "figma:asset/b655d2164f14a54b258c6a8a069f10a88a1c4640.png";
import { Eye, EyeOff, Loader2, LogIn, UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { UserRole } from "./AuthContext";
import { useAuth } from "./AuthContext";
import { FormField, rules } from "./FormField";

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  company: string;
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export function LoginPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const loginForm = useForm<LoginForm>({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const [selectedRole, setSelectedRole] = useState<UserRole>("producer");

  // Signup form
  const signupForm = useForm<SignupForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "producer",
      company: "",
    },
  });

  /** Map known English error strings to Hebrew. */
  const translateError = (error: string): string => {
    if (error.includes("Invalid login") || error.includes("Could not verify")) {
      return "אימייל או סיסמה שגויים";
    }
    if (error.includes("Invalid password")) {
      return "הסיסמה חייבת להכיל לפחות 8 תווים";
    }
    if (
      error.includes("already registered") ||
      error.includes("already been registered")
    ) {
      return "כתובת האימייל כבר רשומה במערכת";
    }
    if (
      error.includes("Account does not exist") ||
      error.includes("no account")
    ) {
      return "לא נמצא חשבון עם כתובת אימייל זו";
    }
    if (error.includes("Too many requests") || error.includes("rate limit")) {
      return "יותר מדי ניסיונות, נסה שוב מאוחר יותר";
    }
    return error;
  };

  const onLogin = async (data: LoginForm) => {
    setServerError("");
    setSubmitting(true);
    const { error } = await login(data.email.trim(), data.password);
    setSubmitting(false);
    if (error) {
      setServerError(translateError(error));
    }
  };

  const onSignup = async (data: SignupForm) => {
    setServerError("");
    if (data.password !== data.confirmPassword) {
      signupForm.setError("confirmPassword", { message: "הסיסמאות לא תואמות" });
      return;
    }
    setSubmitting(true);
    const { error } = await signup(
      data.email.trim(),
      data.password,
      data.name.trim(),
      selectedRole
    );
    setSubmitting(false);
    if (error) {
      setServerError(translateError(error));
    }
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setServerError("");
    setSelectedRole("producer");
    loginForm.reset();
    signupForm.reset();
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#f8f7f5] p-4 font-['Assistant',sans-serif]"
      dir="rtl"
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px]"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <img
            alt="TravelPro"
            className="mb-3 h-16 w-16 rounded-2xl object-contain shadow-lg"
            height="600"
            src={imgLogo}
            width="800"
          />
          <h1
            className="text-[#181510] text-[28px]"
            style={{ fontWeight: 700 }}
          >
            TravelPro
          </h1>
          <p className="mt-1 text-[#8d785e] text-[14px]">
            ניהול פרויקטים למפיקי טיולים
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#e7e1da] bg-white p-6 shadow-xl">
          {/* Tab toggle */}
          <div className="mb-6 flex rounded-xl bg-[#f5f3f0] p-1">
            <button
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[14px] transition-all ${
                mode === "login"
                  ? "bg-white text-[#181510] shadow-sm"
                  : "text-[#8d785e] hover:text-[#181510]"
              }`}
              onClick={() => switchMode("login")}
              style={{ fontWeight: mode === "login" ? 600 : 400 }}
              type="button"
            >
              <LogIn size={15} />
              התחברות
            </button>
            <button
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[14px] transition-all ${
                mode === "signup"
                  ? "bg-white text-[#181510] shadow-sm"
                  : "text-[#8d785e] hover:text-[#181510]"
              }`}
              onClick={() => switchMode("signup")}
              style={{ fontWeight: mode === "signup" ? 600 : 400 }}
              type="button"
            >
              <UserPlus size={15} />
              הרשמה
            </button>
          </div>

          {/* Server error */}
          {serverError && (
            <motion.div
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600"
              initial={{ opacity: 0, height: 0 }}
              style={{ fontWeight: 500 }}
            >
              {serverError}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
                exit={{ opacity: 0, x: 20 }}
                initial={{ opacity: 0, x: -20 }}
                key="login"
                onSubmit={loginForm.handleSubmit(onLogin)}
                transition={{ duration: 0.25 }}
              >
                <FormField
                  error={loginForm.formState.errors.email}
                  isDirty={loginForm.formState.dirtyFields.email}
                  label="אימייל"
                  placeholder="name@company.com"
                  required
                  type="email"
                  {...loginForm.register("email", rules.email(true))}
                />
                <div>
                  <FormField
                    error={loginForm.formState.errors.password}
                    isDirty={loginForm.formState.dirtyFields.password}
                    label="סיסמה"
                    placeholder="הזן סיסמה"
                    required
                    type={showPassword ? "text" : "password"}
                    {...loginForm.register("password", {
                      required: "סיסמה היא שדה חובה",
                    })}
                  />
                  <button
                    className="mt-1 flex items-center gap-1 text-[#8d785e] text-[12px] hover:text-[#ff8c00]"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                    {showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  </button>
                </div>
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-3 text-white shadow-[#ff8c00]/20 shadow-lg transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={submitting || !loginForm.formState.isValid}
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <LogIn size={18} />
                  )}
                  {submitting ? "מתחבר..." : "התחבר"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
                exit={{ opacity: 0, x: -20 }}
                initial={{ opacity: 0, x: 20 }}
                key="signup"
                onSubmit={signupForm.handleSubmit(onSignup)}
                transition={{ duration: 0.25 }}
              >
                <FormField
                  error={signupForm.formState.errors.name}
                  isDirty={signupForm.formState.dirtyFields.name}
                  label="שם מלא"
                  placeholder="ערן לוי"
                  required
                  {...signupForm.register("name", rules.requiredMin("שם", 2))}
                />
                {/* Role selection */}
                <div>
                  <div
                    className="mb-2 block text-[#181510] text-[14px]"
                    style={{ fontWeight: 600 }}
                  >
                    סוג חשבון
                  </div>
                  <div className="flex gap-3">
                    <button
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-[13px] transition-all ${
                        selectedRole === "producer"
                          ? "border-[#ff8c00] bg-[#ff8c00]/10 text-[#ff8c00]"
                          : "border-[#e7e1da] text-[#8d785e] hover:border-[#ff8c00]/50"
                      }`}
                      onClick={() => setSelectedRole("producer")}
                      style={{
                        fontWeight: selectedRole === "producer" ? 600 : 400,
                      }}
                      type="button"
                    >
                      מפיק טיולים
                    </button>
                    <button
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-[13px] transition-all ${
                        selectedRole === "supplier"
                          ? "border-[#ff8c00] bg-[#ff8c00]/10 text-[#ff8c00]"
                          : "border-[#e7e1da] text-[#8d785e] hover:border-[#ff8c00]/50"
                      }`}
                      onClick={() => setSelectedRole("supplier")}
                      style={{
                        fontWeight: selectedRole === "supplier" ? 600 : 400,
                      }}
                      type="button"
                    >
                      ספק שירותים
                    </button>
                  </div>
                </div>
                {/* Conditional company/business name field */}
                <FormField
                  error={signupForm.formState.errors.company}
                  isDirty={signupForm.formState.dirtyFields.company}
                  label={selectedRole === "producer" ? "שם חברה" : "שם עסק"}
                  placeholder={
                    selectedRole === "producer"
                      ? "חברת ההפקות שלי"
                      : "שם העסק שלי"
                  }
                  {...signupForm.register("company")}
                />
                <FormField
                  error={signupForm.formState.errors.email}
                  isDirty={signupForm.formState.dirtyFields.email}
                  label="אימייל"
                  placeholder="name@company.com"
                  required
                  type="email"
                  {...signupForm.register("email", rules.email(true))}
                />
                <div>
                  <FormField
                    error={signupForm.formState.errors.password}
                    isDirty={signupForm.formState.dirtyFields.password}
                    label="סיסמה"
                    placeholder="לפחות 8 תווים"
                    required
                    type={showPassword ? "text" : "password"}
                    {...signupForm.register("password", {
                      required: "סיסמה היא שדה חובה",
                      minLength: {
                        value: 8,
                        message: "סיסמה חייבת להכיל לפחות 8 תווים",
                      },
                    })}
                  />
                  <p className="mt-1 text-[#b8a990] text-[11px]">
                    מינימום 8 תווים
                  </p>
                </div>
                <div>
                  <FormField
                    error={signupForm.formState.errors.confirmPassword}
                    isDirty={signupForm.formState.dirtyFields.confirmPassword}
                    label="אימות סיסמה"
                    placeholder="הזן שוב את הסיסמה"
                    required
                    type={showPassword ? "text" : "password"}
                    {...signupForm.register("confirmPassword", {
                      required: "אימות סיסמה הוא שדה חובה",
                      validate: (v) =>
                        v === signupForm.getValues("password") ||
                        "הסיסמאות לא תואמות",
                    })}
                  />
                  <button
                    className="mt-1 flex items-center gap-1 text-[#8d785e] text-[12px] hover:text-[#ff8c00]"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                    {showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  </button>
                </div>
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-3 text-white shadow-[#ff8c00]/20 shadow-lg transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={submitting || !signupForm.formState.isValid}
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <UserPlus size={18} />
                  )}
                  {submitting ? "נרשם..." : "צור חשבון"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-[#b8a990] text-[12px]">
          TravelPro &copy; 2026 — כל הזכויות שמורות
        </p>
      </motion.div>
    </div>
  );
}
