import { useState, useEffect } from "react";
import { activateSubscription } from "@/lib/billing";

const AUTH_KEY = "tenderiq_auth";

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name?: string } | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check for auth bypass
    const authBypass = import.meta.env.VITE_AUTH_BYPASS === "true";
    if (authBypass) {
      return {
        isAuthenticated: true,
        user: { email: "dev@echotender.com", name: "Developer" },
      };
    }

    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return { isAuthenticated: false, user: null };
  });

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
  }, [authState]);

  const signIn = (email: string, password: string, inviteCode?: string) => {
    // Stubbed auth - in production, this would call an API
    const newState = {
      isAuthenticated: true,
      user: { email, name: email.split("@")[0] },
    };
    setAuthState(newState);
    // Auto-activate subscription in dev
    if (import.meta.env.VITE_AUTH_BYPASS === "true") {
      activateSubscription("pro");
    }
    return Promise.resolve({ success: true });
  };

  const signUp = (email: string, password: string, inviteCode?: string) => {
    // Stubbed auth - in production, this would call an API
    const newState = {
      isAuthenticated: true,
      user: { email, name: email.split("@")[0] },
    };
    setAuthState(newState);
    // Auto-activate subscription in dev
    if (import.meta.env.VITE_AUTH_BYPASS === "true") {
      activateSubscription("pro");
    }
    return Promise.resolve({ success: true });
  };

  const signOut = () => {
    setAuthState({ isAuthenticated: false, user: null });
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
}
