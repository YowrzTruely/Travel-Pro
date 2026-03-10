/**
 * Auth context — provides user session, profile, login, signup, logout.
 * Uses Convex Auth under the hood + users table for profile/role.
 */

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { api } from "../../../convex/_generated/api";

export type UserRole = "admin" | "producer" | "supplier";

export interface UserProfile {
  authId: string;
  avatar?: string;
  company?: string;
  createdAt: number;
  defaultMarginPercent?: number;
  email: string;
  id: string;
  name: string;
  notificationPreferences?: {
    inApp?: boolean;
    email?: boolean;
    sms?: boolean;
    whatsapp?: boolean;
  };
  onboardingCompleted: boolean;
  onboardingStage?: "stage1" | "stage2" | "stage3";
  phone?: string;
  registrationSource?: "manual" | "self_registration" | "availability_invite";
  role: UserRole;
  status: "active" | "pending" | "suspended";
  supplierId?: string;
}

interface AuthState {
  loading: boolean;
  profile: UserProfile | null;
  profileLoading: boolean;
  user: { email?: string } | null;
}

interface AuthActions {
  createProfileIfNeeded: (args: {
    role: UserRole;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    registrationSource?: "manual" | "self_registration" | "availability_invite";
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    role?: UserRole
  ) => Promise<{ error: string | null }>;
}

type AuthContextValue = AuthState & AuthActions;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();

  // Load profile when authenticated
  const profileData = useQuery(
    api.users.getCurrent,
    isAuthenticated ? {} : "skip"
  );
  const createProfile = useMutation(api.users.createProfile);

  // Track pending signup info for auto-profile creation
  const pendingSignupRef = useRef<{
    name: string;
    email: string;
    role: UserRole;
  } | null>(null);

  // Auto-create/complete profile after signup when authenticated but
  // profile is missing or incomplete (auth system creates {email} only)
  const profileIncomplete =
    profileData !== undefined &&
    (profileData === null || !profileData.role || !profileData.name);

  const autoCreateFiredRef = useRef(false);

  useEffect(() => {
    if (!(isAuthenticated && profileIncomplete) || autoCreateFiredRef.current) {
      return;
    }

    if (pendingSignupRef.current) {
      // Fresh signup — use the role/name from the signup form
      const { name, email, role } = pendingSignupRef.current;
      pendingSignupRef.current = null;
      autoCreateFiredRef.current = true;
      createProfile({
        authId: "",
        email,
        name,
        role,
        registrationSource: "manual",
      }).catch((err) => {
        console.error("[Auth] Auto-create profile failed:", err);
        autoCreateFiredRef.current = false;
      });
    } else {
      // Pre-existing user without a complete profile (page refresh).
      // profileData is either null or an auth-only record without role.
      // Default to producer. The mutation resolves the user from the identity.
      const email = profileData?.email ?? "";
      const name = email.split("@")[0] || "משתמש";
      autoCreateFiredRef.current = true;
      createProfile({
        authId: "",
        email,
        name,
        role: "producer",
        registrationSource: "manual",
      }).catch((err) => {
        console.error("[Auth] Auto-complete profile failed:", err);
        autoCreateFiredRef.current = false;
      });
    }
  }, [isAuthenticated, profileIncomplete, profileData, createProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await signIn("password", { email, password, flow: "signIn" });
        return { error: null };
      } catch (err: any) {
        console.error("[Auth] Login error:", err);
        return { error: err?.message || String(err) };
      }
    },
    [signIn]
  );

  const signup = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      role: UserRole = "producer"
    ) => {
      try {
        pendingSignupRef.current = { name, email, role };
        await signIn("password", { email, password, name, flow: "signUp" });
        return { error: null };
      } catch (err: any) {
        pendingSignupRef.current = null;
        console.error("[Auth] Signup error:", err);
        return { error: err?.message || String(err) };
      }
    },
    [signIn]
  );

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const createProfileIfNeeded = useCallback(
    async (args: {
      role: UserRole;
      name: string;
      email: string;
      phone?: string;
      company?: string;
      registrationSource?:
        | "manual"
        | "self_registration"
        | "availability_invite";
    }) => {
      await createProfile({
        authId: "",
        email: args.email,
        name: args.name,
        role: args.role,
        phone: args.phone,
        company: args.company,
        registrationSource: args.registrationSource,
      });
    },
    [createProfile]
  );

  const user = isAuthenticated ? { email: "" } : null;
  const profileLoading = isAuthenticated && profileData === undefined;

  // Auth system creates users with just {email} — only treat as
  // a complete profile when role + name are set.
  const hasCompleteProfile = profileData?.role && profileData.name;

  const profile: UserProfile | null = hasCompleteProfile
    ? {
        id: profileData.id,
        authId: profileData.authId ?? "",
        email: profileData.email ?? "",
        name: profileData.name ?? "",
        role: profileData.role ?? "producer",
        phone: profileData.phone,
        company: profileData.company,
        avatar: profileData.avatar,
        supplierId: profileData.supplierId,
        status: profileData.status ?? "active",
        onboardingCompleted: profileData.onboardingCompleted ?? false,
        onboardingStage: profileData.onboardingStage,
        registrationSource: profileData.registrationSource,
        createdAt: profileData.createdAt ?? 0,
        notificationPreferences: profileData.notificationPreferences,
        defaultMarginPercent: profileData.defaultMarginPercent,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading: isLoading,
        profileLoading,
        login,
        signup,
        logout,
        createProfileIfNeeded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
