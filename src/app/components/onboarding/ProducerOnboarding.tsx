import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "../AuthContext";

export function ProducerOnboarding() {
  const { profile } = useAuth();
  const updateProfile = useMutation(api.users.updateProfile);

  const handleEnter = async () => {
    if (!profile?.id) {
      return;
    }
    await updateProfile({
      id: profile.id as Id<"users">,
      onboardingCompleted: true,
    });
    // Profile update triggers re-render in AuthContext, which will
    // switch to the role-based router automatically.
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center font-['Assistant',sans-serif]"
      dir="rtl"
      style={{ backgroundColor: "#f8f7f5" }}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-10 shadow-lg">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
          style={{ backgroundColor: "#fff3e0" }}
        >
          <span aria-label="welcome" role="img">
            🚀
          </span>
        </div>

        <h1 className="font-bold text-3xl" style={{ color: "#181510" }}>
          ברוכים הבאים ל-Eventos!
        </h1>

        <p className="text-center text-lg" style={{ color: "#8d785e" }}>
          המערכת מוכנה עבורך. אפשר להתחיל לנהל פרויקטים!
        </p>

        <button
          className="mt-4 w-full cursor-pointer rounded-xl px-8 py-4 font-bold text-lg text-white transition-opacity hover:opacity-90"
          onClick={handleEnter}
          style={{ backgroundColor: "#ff8c00" }}
          type="button"
        >
          כניסה ללוח בקרה
        </button>
      </div>
    </div>
  );
}
