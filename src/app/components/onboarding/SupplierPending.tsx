import { useAuth } from "../AuthContext";

export function SupplierPending() {
  const { logout } = useAuth();

  return (
    <div
      className="flex min-h-screen items-center justify-center font-['Assistant',sans-serif]"
      dir="rtl"
      style={{ backgroundColor: "#f8f7f5" }}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-card p-10 shadow-lg">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
          style={{ backgroundColor: "#fff3e0" }}
        >
          <span aria-label="waiting" role="img">
            ⏳
          </span>
        </div>

        <h1 className="font-bold text-3xl" style={{ color: "#181510" }}>
          החשבון שלך ממתין לאישור
        </h1>

        <p className="text-center text-lg" style={{ color: "#8d785e" }}>
          מנהל המערכת יבדוק את הבקשה שלך ויאשר אותה בהקדם.
        </p>

        <button
          className="mt-4 w-full cursor-pointer rounded-xl border-2 px-8 py-4 font-bold text-lg transition-opacity hover:opacity-80"
          onClick={logout}
          style={{ borderColor: "#8d785e", color: "#8d785e" }}
          type="button"
        >
          התנתק
        </button>
      </div>
    </div>
  );
}
