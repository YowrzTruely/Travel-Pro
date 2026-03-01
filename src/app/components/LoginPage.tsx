/**
 * LoginPage — combined login + signup with tab toggle.
 * Hebrew RTL, warm palette matching TravelPro design.
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import imgLogo from "figma:asset/b655d2164f14a54b258c6a8a069f10a88a1c4640.png";
import { useAuth } from './AuthContext';
import { FormField, rules } from './FormField';

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function LoginPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const loginForm = useForm<LoginForm>({
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  // Signup form
  const signupForm = useForm<SignupForm>({
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onLogin = async (data: LoginForm) => {
    setServerError('');
    setSubmitting(true);
    const { error } = await login(data.email.trim(), data.password);
    setSubmitting(false);
    if (error) {
      if (error.includes('Invalid login')) {
        setServerError('אימייל או סיסמה שגויים');
      } else {
        setServerError(error);
      }
    }
  };

  const onSignup = async (data: SignupForm) => {
    setServerError('');
    if (data.password !== data.confirmPassword) {
      signupForm.setError('confirmPassword', { message: 'הסיסמאות לא תואמות' });
      return;
    }
    setSubmitting(true);
    const { error } = await signup(data.email.trim(), data.password, data.name.trim());
    setSubmitting(false);
    if (error) {
      if (error.includes('already registered') || error.includes('already been registered')) {
        setServerError('כתובת האימייל כבר רשומה במערכת');
      } else {
        setServerError(error);
      }
    }
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setServerError('');
    loginForm.reset();
    signupForm.reset();
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center p-4 font-['Assistant',sans-serif]" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px]"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={imgLogo} alt="TravelPro" className="w-16 h-16 rounded-2xl object-contain mb-3 shadow-lg" />
          <h1 className="text-[28px] text-[#181510]" style={{ fontWeight: 700 }}>TravelPro</h1>
          <p className="text-[14px] text-[#8d785e] mt-1">ניהול פרויקטים למפיקי טיולים</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#e7e1da] shadow-xl p-6">
          {/* Tab toggle */}
          <div className="flex bg-[#f5f3f0] rounded-xl p-1 mb-6">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[14px] transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#181510] shadow-sm'
                  : 'text-[#8d785e] hover:text-[#181510]'
              }`}
              style={{ fontWeight: mode === 'login' ? 600 : 400 }}
            >
              <LogIn size={15} />
              התחברות
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[14px] transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#181510] shadow-sm'
                  : 'text-[#8d785e] hover:text-[#181510]'
              }`}
              style={{ fontWeight: mode === 'signup' ? 600 : 400 }}
            >
              <UserPlus size={15} />
              הרשמה
            </button>
          </div>

          {/* Server error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-[13px]"
              style={{ fontWeight: 500 }}
            >
              {serverError}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
              >
                <FormField
                  label="אימייל"
                  type="email"
                  placeholder="name@company.com"
                  required
                  error={loginForm.formState.errors.email}
                  isDirty={loginForm.formState.dirtyFields.email}
                  {...loginForm.register('email', rules.email(true))}
                />
                <div>
                  <FormField
                    label="סיסמה"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="הזן סיסמה"
                    required
                    error={loginForm.formState.errors.password}
                    isDirty={loginForm.formState.dirtyFields.password}
                    {...loginForm.register('password', { required: 'סיסמה היא שדה חובה' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[12px] text-[#8d785e] hover:text-[#ff8c00] mt-1 flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                    {showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={submitting || !loginForm.formState.isValid}
                  className="w-full bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#ff8c00]/20"
                  style={{ fontWeight: 600 }}
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                  {submitting ? 'מתחבר...' : 'התחבר'}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={signupForm.handleSubmit(onSignup)}
                className="space-y-4"
              >
                <FormField
                  label="שם מלא"
                  placeholder="ערן לוי"
                  required
                  error={signupForm.formState.errors.name}
                  isDirty={signupForm.formState.dirtyFields.name}
                  {...signupForm.register('name', rules.requiredMin('שם', 2))}
                />
                <FormField
                  label="אימייל"
                  type="email"
                  placeholder="name@company.com"
                  required
                  error={signupForm.formState.errors.email}
                  isDirty={signupForm.formState.dirtyFields.email}
                  {...signupForm.register('email', rules.email(true))}
                />
                <FormField
                  label="סיסמה"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="לפחות 6 תווים"
                  required
                  error={signupForm.formState.errors.password}
                  isDirty={signupForm.formState.dirtyFields.password}
                  {...signupForm.register('password', {
                    required: 'סיסמה היא שדה חובה',
                    minLength: { value: 6, message: 'סיסמה חייבת להכיל לפחות 6 תווים' },
                  })}
                />
                <div>
                  <FormField
                    label="אימות סיסמה"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="הזן שוב את הסיסמה"
                    required
                    error={signupForm.formState.errors.confirmPassword}
                    isDirty={signupForm.formState.dirtyFields.confirmPassword}
                    {...signupForm.register('confirmPassword', {
                      required: 'אימות סיסמה הוא שדה חובה',
                      validate: (v) => v === signupForm.getValues('password') || 'הסיסמאות לא תואמות',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[12px] text-[#8d785e] hover:text-[#ff8c00] mt-1 flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                    {showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={submitting || !signupForm.formState.isValid}
                  className="w-full bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#ff8c00]/20"
                  style={{ fontWeight: 600 }}
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                  {submitting ? 'נרשם...' : 'צור חשבון'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-[12px] text-[#b8a990] mt-6">
          TravelPro &copy; 2026 — כל הזכויות שמורות
        </p>
      </motion.div>
    </div>
  );
}
