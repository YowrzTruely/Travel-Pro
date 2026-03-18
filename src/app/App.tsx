import { useMutation } from "convex/react";
import { ThemeProvider } from "next-themes";
import { useEffect, useMemo, useRef } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { AvailabilityInvitePage } from "./components/AvailabilityInvitePage";
import { ClientQuote } from "./components/ClientQuote";
import { ConvexProvider } from "./components/ConvexProvider";
import { EventRatings } from "./components/gallery/EventRatings";
import { PublicGallery } from "./components/gallery/PublicGallery";
import { LoginPage } from "./components/LoginPage";
import { SupplierOnboarding } from "./components/onboarding/SupplierOnboarding";
import { SupplierSelfRegister } from "./components/SupplierSelfRegister";
import { PublicSupplierProfile } from "./components/supplier/PublicSupplierProfile";
import {
  createAdminRouter,
  createProducerRouter,
  createSupplierRouter,
} from "./routes";

/**
 * Check if the current URL is a public page (no auth required).
 */
const PUBLIC_PATTERNS = [
  /^\/quote\/.+$/,
  /^\/register\/supplier$/,
  /^\/availability-invite\/.+$/,
  /^\/supplier\/.+\/public$/,
  /^\/gallery\/.+$/,
  /^\/rate\/.+$/,
];

function isPublicPage(): boolean {
  const path = window.location.pathname;
  return PUBLIC_PATTERNS.some((re) => re.test(path));
}

/** Public router for unauthenticated pages; "/" renders login so back-from-success works */
const publicRouter = createBrowserRouter([
  { path: "/quote/:id", Component: ClientQuote },
  { path: "/register/supplier", Component: SupplierSelfRegister },
  { path: "/availability-invite/:token", Component: AvailabilityInvitePage },
  { path: "/supplier/:id/public", Component: PublicSupplierProfile },
  { path: "/gallery/:projectId", Component: PublicGallery },
  { path: "/rate/:projectId", Component: EventRatings },
  { path: "/", Component: LoginPage },
  { path: "*", Component: LoginPage },
]);

/** Loading spinner */
function LoadingSpinner({ message }: { message: string }) {
  return (
    <div
      className="flex h-screen items-center justify-center bg-background font-['Assistant',sans-serif]"
      dir="rtl"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        <p className="font-['Assistant',sans-serif] text-[15px] text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
}

function AppInner() {
  const {
    user,
    profile,
    loading: authLoading,
    profileCreateFailed,
    profileLoading,
  } = useAuth();
  const isPublic = useMemo(() => isPublicPage(), []);
  const linkRegisteredUser = useMutation(
    api.publicAvailabilityInvite.linkRegisteredUser
  );
  const inviteLinkFiredRef = useRef(false);

  // Link invite token after registration (Path 3: availability invite flow)
  useEffect(() => {
    if (!profile?.id || inviteLinkFiredRef.current) {
      return;
    }
    const pendingToken = sessionStorage.getItem("pendingInviteToken");
    if (!pendingToken) {
      return;
    }
    inviteLinkFiredRef.current = true;
    sessionStorage.removeItem("pendingInviteToken");
    linkRegisteredUser({
      token: pendingToken,
      userId: profile.id as Id<"users">,
    }).catch((err) => {
      console.warn("[App] Failed to link invite token:", err);
      inviteLinkFiredRef.current = false;
    });
  }, [profile?.id, linkRegisteredUser]);

  // 1. Public pages — no auth required
  if (isPublic) {
    return <RouterProvider router={publicRouter} />;
  }

  // 2. Auth loading
  if (authLoading) {
    return <LoadingSpinner message="בודק הרשאות..." />;
  }

  // 3. Not logged in → login page
  if (!user) {
    return <LoginPage />;
  }

  // 4. Profile loading
  if (profileLoading) {
    return <LoadingSpinner message="טוען פרופיל..." />;
  }

  // 5. No profile yet (first-time user, auto-creation in progress)
  if (!profile) {
    if (profileCreateFailed) {
      return (
        <div
          className="flex min-h-screen items-center justify-center bg-background p-4 font-['Assistant',sans-serif]"
          dir="rtl"
        >
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 shadow-lg">
            <p
              className="text-[16px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              לא הצלחנו ליצור את הפרופיל
            </p>
            <p className="text-[14px] text-muted-foreground">
              נסה לרענן את הדף כדי להמשיך
            </p>
            <button
              className="rounded-xl bg-primary px-6 py-3 text-[14px] text-primary-foreground transition-colors hover:bg-primary-hover"
              onClick={() => window.location.reload()}
              style={{ fontWeight: 600 }}
              type="button"
            >
              רענן דף
            </button>
          </div>
        </div>
      );
    }
    return <LoadingSpinner message="יוצר פרופיל..." />;
  }

  // 6. Onboarding not completed → supplier-specific onboarding (before pending)
  if (!profile.onboardingCompleted && profile.role === "supplier") {
    return <SupplierOnboarding />;
  }

  // 7. Role-based routing (suppliers can access portal even while pending)
  return <RoleRouter role={profile.role} />;
}

/** Memoized role-based router to prevent re-creation on every render */
function RoleRouter({ role }: { role: string }) {
  const router = useMemo(() => {
    switch (role) {
      case "admin":
        return createAdminRouter();
      case "supplier":
        return createSupplierRouter();
      default:
        return createProducerRouter();
    }
  }, [role]);
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ConvexProvider>
        <AuthProvider>
          <AppInner />
          <Toaster
            dir="rtl"
            gap={10}
            position="bottom-left"
            toastOptions={{
              unstyled: true,
              style: {
                background: "transparent",
                boxShadow: "none",
                padding: 0,
              },
            }}
          />
        </AuthProvider>
      </ConvexProvider>
    </ThemeProvider>
  );
}
