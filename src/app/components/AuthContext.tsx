/**
 * Auth context — provides user session, login, signup, logout.
 * Uses Supabase Auth under the hood.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  accessToken: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

type AuthContextValue = AuthState & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    accessToken: null,
  });

  // Listen for auth state changes
  useEffect(() => {
    // Try to restore existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        accessToken: session?.access_token ?? null,
      });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        accessToken: session?.access_token ?? null,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('[Auth] Login error:', error.message);
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0045c7fc`;
      const res = await fetch(`${BASE}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        const msg = json.error || `HTTP ${res.status}`;
        console.error('[Auth] Signup error:', msg);
        return { error: msg };
      }

      // After signup, automatically sign in
      const loginResult = await login(email, password);
      return loginResult;
    } catch (err) {
      console.error('[Auth] Signup exception:', err);
      return { error: String(err) };
    }
  }, [login]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
