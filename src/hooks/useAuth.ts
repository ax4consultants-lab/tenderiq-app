import { useState, useEffect } from "react";

const AUTH_KEY = "echotender_auth";

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name?: string } | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
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
    setAuthState({
      isAuthenticated: true,
      user: { email, name: email.split("@")[0] },
    });
    return Promise.resolve({ success: true });
  };

  const signUp = (email: string, password: string, inviteCode?: string) => {
    // Stubbed auth - in production, this would call an API
    setAuthState({
      isAuthenticated: true,
      user: { email, name: email.split("@")[0] },
    });
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
