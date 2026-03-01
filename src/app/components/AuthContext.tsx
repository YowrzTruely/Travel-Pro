/**
 * Auth context — provides user session, login, signup, logout.
 * Uses Convex Auth under the hood.
 */
import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

interface AuthState {
  user: { email?: string } | null;
  loading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

type AuthContextValue = AuthState & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signIn("password", { email, password, flow: "signIn" });
      return { error: null };
    } catch (err: any) {
      console.error('[Auth] Login error:', err);
      return { error: err?.message || String(err) };
    }
  }, [signIn]);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      await signIn("password", { email, password, name, flow: "signUp" });
      return { error: null };
    } catch (err: any) {
      console.error('[Auth] Signup error:', err);
      return { error: err?.message || String(err) };
    }
  }, [signIn]);

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const user = isAuthenticated ? { email: "" } : null;

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
