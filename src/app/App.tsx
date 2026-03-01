import { useState, useEffect, useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { ensureSeeded } from './components/api';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LoginPage } from './components/LoginPage';
import { ClientQuote } from './components/ClientQuote';

/**
 * Check if the current URL is a public client quote page.
 */
function isPublicQuotePage(): boolean {
  return /^\/quote\/.+$/.test(window.location.pathname);
}

/** Minimal public router for the client quote page (no auth required) */
const publicRouter = createBrowserRouter([
  { path: '/quote/:id', Component: ClientQuote },
  { path: '*', Component: () => null },
]);

function AppInner() {
  const { user, loading: authLoading } = useAuth();
  const [seeded, setSeeded] = useState(false);
  const isPublic = useMemo(() => isPublicQuotePage(), []);

  useEffect(() => {
    ensureSeeded().finally(() => setSeeded(true));
  }, []);

  // ─── Public client quote page — no auth required ───
  if (isPublic) {
    if (!seeded) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#f8f7f5]" dir="rtl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-3 border-[#ff8c00] border-t-transparent rounded-full animate-spin" />
            <p className="text-[15px] text-[#8d785e] font-['Assistant',sans-serif]">טוען הצעה...</p>
          </div>
        </div>
      );
    }
    return <RouterProvider router={publicRouter} />;
  }

  // Auth loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8f7f5]" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#ff8c00] border-t-transparent rounded-full animate-spin" />
          <p className="text-[15px] text-[#8d785e] font-['Assistant',sans-serif]">בודק הרשאות...</p>
        </div>
      </div>
    );
  }

  // Not logged in → show login page
  if (!user) {
    return <LoginPage />;
  }

  // Seed loading
  if (!seeded) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8f7f5]" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#ff8c00] border-t-transparent rounded-full animate-spin" />
          <p className="text-[15px] text-[#8d785e] font-['Assistant',sans-serif]">TravelPro נטען...</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
      <Toaster
        position="bottom-left"
        dir="rtl"
        gap={10}
        toastOptions={{
          unstyled: true,
          style: { background: 'transparent', boxShadow: 'none', padding: 0 },
        }}
      />
    </AuthProvider>
  );
}
